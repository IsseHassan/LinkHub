'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Twitter, Music2, Twitch, Instagram,  Facebook, Mail, ExternalLink, GithubIcon, Linkedin } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Types
interface ProfileLink {
  id: string;
  title: string;
  url: string;
  shortUrl: string;
  emoji: string;
}

interface Memory {
  _id: string;
  title: string;
  imageUrl: string;
}

interface ProfileLink {
  title: string;
  shortUrl: string;
}


interface SocialLinks {
  links: ProfileLink[];
}

interface ProfileData {
  _id: string;
  displayName: string;
  bio: string;
  avatar: string;
  links: ProfileLink[];
  memories: Memory[];
  theme: string;
  socials?: SocialLinks;
}

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ProfileHeader: React.FC<{ profile: ProfileData }> = ({ profile }) => (
  <motion.div 
    className="flex flex-col items-center space-y-3"
    variants={itemAnimation}
  >
    <Avatar className="w-40 h-40 border-4 border-zinc-300 shadow-lg bg-white">
      <AvatarImage src={profile.avatar} alt={profile.displayName} 
        
      
      />
      <AvatarFallback className="bg-zinc-100 text-zinc-900">{profile.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <h1 className="text-2xl font-bold text-zinc-900">{profile.displayName.charAt(0).toUpperCase() + profile.displayName.slice(1) }</h1>
    <p className="text-center text-zinc-800 text-sm max-w-sm">{profile.bio}</p>
  </motion.div>
);

const ProfileLink: React.FC<{ link: ProfileLink }> = ({ link }) => (
  <motion.div variants={itemAnimation}>
    <Button
      variant="secondary"
      className="w-full h-12 group relative overflow-hidden rounded-xs bg-white hover:bg-white/90 text-zinc-900 border-2 border-zinc-700/25 transition-all duration-200"
      asChild
    >
      <Link to={`http://localhost:5000/api/profile/click/${link.shortUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-4">
        <ExternalLink className="mr-1 h-4 w-4 text-zinc-500" />
        <span className="flex-1 text-left text-sm font-medium truncate">{link.title.charAt(0).toUpperCase() + link.title.slice(1)}</span>
      </Link>
    </Button>
  </motion.div>
);

const MemoryGrid: React.FC<{ memories: Memory[] }> = ({ memories }) => (
  <motion.div className="space-y-3" variants={itemAnimation}>
    <h2 className="text-xl font-bold text-zinc-900 text-center">Memories</h2>
    <div className="grid grid-cols-2 gap-3">
      {memories.map((memory) => (
        <motion.div 
          key={memory._id} 
          className="relative aspect-square group overflow-hidden rounded-2xl border-2 border-zinc-300"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/30 to-transparent flex items-end justify-center p-2">
            <p className="text-white text-xs font-medium">{memory.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const SocialIcons: React.FC<{ socials: SocialLinks }> = ({ socials }) => {
  if (!socials || !socials.links) {
    return null; // or return some fallback UI
  }

  function getSocialIcon(title: string) {
    const socialLink = socials.links.find((link: ProfileLink) => link.title.toLowerCase() === title);
    return socialLink ? socialLink.shortUrl : '';
  }

  
  const socialIcons = [
    { key: 'twitter', Icon: Twitter, url: getSocialIcon('twitter') !== '' ? `http://localhost:5000/api/profile/click/${getSocialIcon('twitter')}` : null },
    { key: 'facebook', Icon: Facebook, url: getSocialIcon('facebook') !== '' ? `http://localhost:5000/api/profile/click/${getSocialIcon('facebook')}` : null },
    { key: 'instagram', Icon: Instagram, url: getSocialIcon('instagram') !== '' ? `http://localhost:5000/api/profile/click/${getSocialIcon('instagram')}` : null },
    { key: 'spotify', Icon: Music2, url: getSocialIcon('spotify') !== '' ? `http://localhost:5000/api/profile/click/${getSocialIcon('spotify')}` : null },
    { key: 'twitch', Icon: Twitch, url: getSocialIcon('twitch') !== '' ? `http://localhost:5000/api/profile/click/${getSocialIcon('twitch')}` : null },
    { key: 'email', Icon: Mail, url: getSocialIcon('email') !== '' ? `http://localhost:5000/api/profile/click/${getSocialIcon('email')}` : null },
    { key: 'linkedin', Icon: Linkedin, url: getSocialIcon('linkedin') !== '' ? `http://localhost:5000/api/profile/click/${getSocialIcon('linkedin')}` : null },
    { key: 'github', Icon: GithubIcon, url: getSocialIcon('github') !== '' ? `http://localhost:5000/api/profile/click/${getSocialIcon('github')}` : null },
  ];

  return (
    <motion.div 
      className="flex justify-center flex-wrap gap-3"
      variants={itemAnimation}
    >
      {socialIcons.map(({ key, Icon, url }) => url && (
        <motion.div
          key={key}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to={url}
            target="_blank"
            className="p-2 text-zinc-900 hover:text-zinc-700 transition-colors"
          >
            <Icon className="h-5 w-5" />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="w-full max-w-md space-y-4 p-4">
    <div className="flex flex-col items-center space-y-3">
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded-full" />
      ))}
    </div>
  </div>
);

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();
  const username = params.get('username');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch profile');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, token]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-400 to-zinc-300 flex items-center justify-center">
      <LoadingState />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-400 to-zinc-300 flex items-center justify-center p-4">
      <div className="text-zinc-900 text-center p-6 bg-white border-2 border-zinc-900/50">
        {error}
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-400 to-zinc-300 flex items-center justify-center p-4">
      <div className="text-zinc-900 text-center p-6 bg-white rounded-3xl shadow-lg">
        No profile data available
      </div>
    </div>
  );

  const social_media = ['twitter', 'instagram', 'youtube', 'spotify', 'twitch', 'facebook','linkedin', 'github', 'email'];

  const socials = profile.links.filter(link => social_media.includes(link.title.toLowerCase()));

  const non_socials = profile.links.filter(link => !social_media.includes(link.title.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-500/45 to-gray-50 flex items-center justify-center">
      
      <div className="relative w-full max-w-xl mx-auto p-4">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerAnimation}
        >
          <Card className="bg-white/90 border-zinc-900/15 border-2 shadow-xl backdrop-blur-sm rounded-lg overflow-hidden">
            <CardContent className="space-y-6 p-6">
              <ProfileHeader profile={profile} />
              <motion.div className=" flex items-center justify-center gap-2" variants={itemAnimation}>
                {non_socials && non_socials.map((link) => (
                  <ProfileLink key={link.id} link={link} />
                ))}
              </motion.div>
              {profile.memories.length > 0 && <MemoryGrid memories={profile.memories} />}
              <SocialIcons socials={{ links: socials }} />
            </CardContent>
          </Card>

          {/* Logo/Watermark */}
          <motion.div 
            className="text-center mt-4 text-sm text-zinc-800"
            variants={itemAnimation}
          >
            LinkHub &copy; 2025
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}