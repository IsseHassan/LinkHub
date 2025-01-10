import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import fs from 'fs/promises';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import geoip from 'geoip-lite';
import useragent from 'useragent';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Middleware to authenticate user
export const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Helper function to optimize image
async function optimizeImage(file, width = 800, quality = 80) {
  const optimizedImageBuffer = await sharp(file.path)
    .resize(width)
    .webp({ quality })
    .toBuffer();

  const optimizedFilePath = `${file.path}.webp`;
  await fs.writeFile(optimizedFilePath, optimizedImageBuffer);

  return optimizedFilePath;
}

// Upload image
router.post('/upload', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const optimizedFilePath = await optimizeImage(req.file);

    const result = await cloudinary.uploader.upload(optimizedFilePath, {
      folder: 'linkhub',
      use_filename: true,
      unique_filename: false,
    });

    // Clean up temporary files
    await fs.unlink(req.file.path);
    await fs.unlink(optimizedFilePath);

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Get user profile
router.get('/', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/', authenticateUser, async (req, res) => {
  try {
    const { displayName, bio, avatar, links, memories, theme } = req.body;

    if (links && !Array.isArray(links)) {
      return res.status(400).json({ message: 'Links must be an array' });
    }

    // Ensure memories array does not contain an `id` field
    const sanitizedMemories = memories ? memories.map(memory => ({
      title: memory.title,
      imageUrl: memory.imageUrl
    })) : undefined;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { displayName, bio, avatar, links, memories: sanitizedMemories, theme },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Add new link
router.post('/links', authenticateUser, async (req, res) => {
  try {
    const { title, url } = req.body;
    const shortUrl = nanoid(8); // Generate a short URL
    const user = await User.findById(req.userId);
    user.links.push({ title, url, shortUrl });
    await user.save();
    res.json(user.links[user.links.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding link', error: error.message });
  }
});

// Track link click
router.get('/click/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const user = await User.findOne({ 'links.shortUrl': shortUrl });
    if (!user) {
      return res.status(404).json({ message: 'Link not found' });
    }
    const link = user.links.find(link => link.shortUrl === shortUrl);
    link.clicks += 1;
    user.totalClicks += 1;

    // Get country from IP
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    const country = geo ? geo.country : 'Unknown';

    // Get device from user agent
    const agent = useragent.parse(req.headers['user-agent']);
    if(agent.device.family === 'Other') {
      agent.device.family = req.headers['sec-ch-ua-platform'];
    }
    let device = agent.device.family;
    device= device.replace(/"/g, '');
    
    // Generate or retrieve visitor ID
    let visitorId = req.cookies.visitorId;
    
    if (!visitorId) {
      visitorId = uuidv4();
      res.cookie('visitorId', visitorId, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
      user.uniqueVisitors += 1;
    }

    // Add click data
    user.clickData.push({
      date: new Date(),
      country,
      device,
      linkId: link._id,
      visitorId
    });

    await user.save();
    res.redirect(link.url);
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ message: 'Error tracking click', error: error.message });
  }
});

// Get public profile by display name
router.get('/:displayName', async (req, res) => {
  try {
    const user = await User.findOne({ displayName: req.params.displayName }).select('-password -email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.settings.publicProfile) {
      return res.status(403).json({ message: 'Profile is private' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Get analytics
router.get('/user/analytics', authenticateUser, async (req, res) => {
  try {
    const { range = '7d' } = req.query;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(range));

    const clickData = user.clickData.filter(click => click.date >= startDate && click.date <= endDate);

    const dailyClicks = getDailyClicks(clickData);
    const topCountries = getTopCountries(clickData);
    const devices = getDeviceDistribution(clickData);
    const linkClicks = getLinkClicks(user.links, clickData);

    const uniqueVisitors = new Set(clickData.map(click => click.visitorId)).size;
    const previousPeriodClicks = user.clickData.filter(click => 
      click.date >= new Date(startDate.getTime() - (endDate - startDate)) && 
      click.date < startDate
    ).length;

    const clickGrowth = previousPeriodClicks === 0 ? 100 : 
      ((clickData.length - previousPeriodClicks) / previousPeriodClicks) * 100;

    const previousPeriodVisitors = new Set(user.clickData
      .filter(click => 
        click.date >= new Date(startDate.getTime() - (endDate - startDate)) && 
        click.date < startDate
      )
      .map(click => click.visitorId)
    ).size;

    const visitorGrowth = previousPeriodVisitors === 0 ? 100 : 
      ((uniqueVisitors - previousPeriodVisitors) / previousPeriodVisitors) * 100;

    const analytics = {
      totalClicks: clickData.length,
      uniqueVisitors,
      clickGrowth,
      visitorGrowth,
      dailyClicks,
      topCountries,
      devices,
      linkClicks
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

// Helper functions
function getDailyClicks(clickData) {
  const dailyClicks = {};
  clickData.forEach(click => {
    const date = click.date.toISOString().split('T')[0];
    dailyClicks[date] = (dailyClicks[date] || 0) + 1;
  });
  return Object.entries(dailyClicks).map(([date, clicks]) => ({ date, clicks }));
}

function getTopCountries(clickData) {
  const countries = {};
  clickData.forEach(click => {
    countries[click.country] = (countries[click.country] || 0) + 1;
  });
  return Object.entries(countries)
    .map(([country, clicks]) => ({ country, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
}

function getDeviceDistribution(clickData) {
  const devices = {};
  clickData.forEach(click => {
    devices[click.device] = (devices[click.device] || 0) + 1;
  });
  const total = clickData.length;
  return Object.entries(devices).map(([device, count]) => ({
    device,
    percentage: (count / total) * 100
  }));
}

function getLinkClicks(links, clickData) {
  const linkClicksMap = {};
  clickData.forEach(click => {
    linkClicksMap[click.linkId] = (linkClicksMap[click.linkId] || 0) + 1;
  });
  return links.map(link => ({
    title: link.title,
    clicks: linkClicksMap[link._id] || 0
  }));
}

export default router;

