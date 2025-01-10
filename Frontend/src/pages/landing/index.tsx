import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView} from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, ArrowRight, 
  Star, Menu, X, Sparkles, 
  Globe, Rocket, MessageSquare, Calendar,
  BookOpen, ArrowUpRight,
  Instagram,
  Twitter,
  Youtube,
  Music,
  Linkedin,
  Facebook,
  PinIcon,
  Github,
  Dribbble,
  Figma,
  Twitch,
  MessageCircleCode,
  Command,
  Trello,
  NotebookIcon,
  TrendingUp,
  ZoomIn,
  Chrome,
  CodeIcon
} from 'lucide-react';
import Blog2 from '@/assets/blog2.png';
import Blog3 from '@/assets/blog3.png';
import Blog1 from '@/assets/blog1.png';
import profile1 from '@/assets/profile1.png';
import profile2 from '@/assets/profile2.png';
import profile3 from '@/assets/profile3.png';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

// Reusable section wrapper with animations
function AnimatedSection({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function InfiniteLogoScroll() {
  // Map of company names to their corresponding Lucide icons and colors
  const companies = [
    { name: 'Instagram', Icon: Instagram, color: 'text-pink-500' },
    { name: 'Twitter', Icon: Twitter, color: 'text-blue-400' },
    { name: 'Youtube', Icon: Youtube, color: 'text-red-500' },
    { name: 'Spotify', Icon: Music, color: 'text-green-500' },
    { name: 'LinkedIn', Icon: Linkedin, color: 'text-blue-600' },
    { name: 'Facebook', Icon: Facebook, color: 'text-blue-500' },
    { name: 'Pinterest', Icon: PinIcon, color: 'text-red-600' },
    { name: 'Discord', Icon: MessageCircleCode, color: 'text-indigo-500' },
    { name: 'Twitch', Icon: Twitch, color: 'text-purple-500' },
    { name: 'Github', Icon: Github, color: 'text-gray-800' },
    { name: 'Dribbble', Icon: Dribbble, color: 'text-pink-600' },
    { name: 'Figma', Icon: Figma, color: 'text-violet-500' },
    { name: 'Slack', Icon: Command, color: 'text-yellow-500' },
    { name: 'Trello', Icon: Trello, color: 'text-blue-400' },
    { name: 'Notion', Icon: NotebookIcon, color: 'text-gray-700' },
    { name: 'Analytics', Icon: TrendingUp, color: 'text-green-600' },
    { name: 'Zoom', Icon: ZoomIn, color: 'text-blue-500' },
    { name: 'Chrome', Icon: Chrome, color: 'text-blue-600' },
    { name: 'CodeSandbox', Icon: CodeIcon, color: 'text-gray-800' }
  ];

  // Triple the array for smooth infinite scroll
  const tripleCompanies = [...companies, ...companies, ...companies];

  return (
    <div className="relative w-full py-10 bg-gray-50 overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />
      
      {/* Scrolling container */}
      <motion.div
        className="flex"
        animate={{
          x: [0, -50 * companies.length],
        }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {tripleCompanies.map(({ name, Icon, color }, index) => (
          <motion.div
            key={`${name}-${index}`}
            className="flex-none mx-8"
            whileHover={{ 
              scale: 1.1,
              y: -5
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10 
            }}
          >
            <div className="w-32 h-32 rounded-xl  flex items-center justify-center p-4  transition-all duration-300 relative group">
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
              
              {/* Icon wrapper */}
              <div className="relative z-10 flex flex-col items-center gap-3 cursor-pointer" >
                <Icon 
                  className={`w-10 h-10 ${color} transition-all duration-300 group-hover:scale-110`}
                  strokeWidth={1.5}
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                  {name}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Enhanced feature card component
interface FeatureCardProps {
  icon: React.ComponentType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group relative p-8 rounded-2xl bg-white hover:bg-gray-50/80 transition-all duration-300"
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute  inset-0 rounded-2xl bg-blue-100 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{ padding: '1px' }}
      />
      
      {/* Card content wrapper */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 h-full cursor-pointer">
        {/* Icon container with animated background */}
        <div className="relative mb-6 inline-block">
          {/* Animated blob background */}
          <motion.div
            className="absolute -inset-2 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          {/* Icon with hover effect */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Icon className="w-12 h-12 text-blue-600 transition-transform duration-300 group-hover:scale-110" 
                  strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Text content with hover animations */}
        <motion.h3 
          className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 leading-relaxed"
          style={{ maxWidth: '24rem' }}
        >
          {description}
        </motion.p>

        {/* Interactive arrow indicator */}
        <motion.div
          className="mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          Learn more
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </motion.svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  image: string;
}

function TestimonialCard({ quote, author, role, image }: TestimonialCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="flex items-center mb-6">
        <img
          src={image || `/api/placeholder/48/48?text=${author[0]}`}
          alt={author}
          className="w-12 h-12 rounded-full mr-4 object-cover "
        />
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic mb-4">{quote}</p>
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
    </motion.div>
  );
}
// Blog card component
interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  url: string;
}

function BlogCard({ title, excerpt, date, readTime, url }: BlogCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.02 }}
      className="rounded-xl bg-white shadow-lg overflow-hidden group"
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={url || `/api/placeholder/400/200?text=${title}`}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          {date}
          <span className="mx-2">•</span>
          <BookOpen className="w-4 h-4 mr-2" />
          {readTime} min read
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <Link
          to="#"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          Read More <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </motion.div>
  );
}

// Stats counter component with animation
function AnimatedCounter({ value, label }: { value: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += stepValue;
        if (current > value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      className="text-center"
    >
      <div className="text-4xl font-bold text-blue-600 mb-2">
        {count.toLocaleString()}+
      </div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  );
}


export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="py-4 px-6 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            LinkHub
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {["Features", "How It Works", "Pricing", "Testimonials"].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>

          <motion.button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
         <motion.div
         initial={false}
         animate={isMenuOpen ? "open" : "closed"}
         variants={{
           open: { opacity: 1, height: "auto" },
           closed: { opacity: 0, height: 0 }
         }}
         className="md:hidden overflow-hidden bg-white shadow-lg"
       >
          <NavLink to="#features" onClick={() => setIsMenuOpen(false)}>Features</NavLink>
          <NavLink to="#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</NavLink>
          <NavLink to="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</NavLink>
          <NavLink to="#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</NavLink>
          <div className="mt-4 space-y-2">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </motion.div>
      )}

       {/* Hero Section with parallax effect */}
       <AnimatedSection className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto relative">
          <motion.div
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                New Feature: AI-Powered Analytics
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Your Digital Identity,
              <br />All in One Place
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create a stunning landing page for all your important links, analytics, and digital presence.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started Free <ArrowRight className="ml-2" />
            </Button>
          </motion.div>

          {/* Floating elements animation */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-20 left-10 hidden lg:block"
          >
            <Sparkles className="w-12 h-12 text-purple-400 opacity-60" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-20 right-10 hidden lg:block"
          >
            <Sparkles className="w-12 h-12 text-purple-400 opacity-60" />
          </motion.div>
        </div>
      </AnimatedSection>

       {/* Features grid with hover effects */}
       <AnimatedSection className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose LinkHub?</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your online presence</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Rocket}
              title="Lightning Fast"
              description="Optimized performance ensures your page loads instantly"
            />
            <FeatureCard
              icon={Globe}
              title="Global CDN"
              description="Deliver your content quickly to users worldwide"
            />
            <FeatureCard
              icon={MessageSquare}
              title="24/7 Support"
              description="Get help whenever you need it from our expert team"
            />
          </div>
        </div>
      </AnimatedSection>

       {/* Enhanced integrations section with infinite scroll */}
       <AnimatedSection className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto text-center mb-12">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl font-bold mb-4"
          >
            Integrate with Your Favorite Tools
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-600"
          >
            Connect with over 100+ popular platforms
          </motion.p>
        </div>
        <InfiniteLogoScroll />
      </AnimatedSection>

       {/* How It Works Section */}
       <AnimatedSection className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <motion.div
              className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -z-10 hidden md:block"
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1 }
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {[
              {
                step: 1,
                title: "Create Account",
                description: "Sign up for free in just a few clicks"
              },
              {
                step: 2,
                title: "Add Your Links",
                description: "Import your content with our easy-to-use dashboard"
              },
              {
                step: 3,
                title: "Share & Grow",
                description: "Share your LinkHub page and track your growth"
              }
            ].map(({ step, title, description }) => (
              <motion.div
                key={step}
                variants={fadeInUp}
                className="relative"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6"
                  >
                    {step}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">{title}</h3>
                  <p className="text-gray-600 text-center">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

       {/* Stats Section */}
       <AnimatedSection className="py-20 px-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <AnimatedCounter value={100000} label="Active Users" />
            <AnimatedCounter value={500000} label="Links Created" />
            <AnimatedCounter value={10000000} label="Monthly Clicks" />
            <AnimatedCounter value={99} label="Customer Satisfaction" />
          </div>
        </div>
      </AnimatedSection>
          
      {/* Testimonials Section */}
      <AnimatedSection className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied customers</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="LinkHub has completely transformed how I manage my online presence. The analytics are incredible!"
              author="Sarah Johnson"
              role="Digital Creator"
              image={profile1}
            />
            <TestimonialCard
              quote="The best investment I've made for my personal brand. Simple, effective, and powerful."
              author="Issa Hassan"
              role="Software Engineer"
              image={profile2}
            />
            <TestimonialCard
              quote="I've tried other similar services, but LinkHub is by far the best. Highly recommended!"
              author="Abdirashid Mowlid Osman"
              role="Software Developer"
              image={profile3}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimatedCard 
              title="Free"
              price="$0"
              features={[
                "Up to 5 links",
                "Basic customization",
                "1 photo memory",
                "Basic analytics"
              ]}
            />
            <AnimatedCard 
              title="Pro"
              price="$9.99"
              features={[
                "Unlimited links",
                "Advanced customization",
                "Unlimited photo memories",
                "Advanced analytics dashboard",
                "Priority support",
                "Custom domain"
              ]}
              highlighted={true}
            />
          </div>
        </div>
      </section>

       {/* Blog Section */}
       <AnimatedSection className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Latest from Our Blog</h2>
            <p className="text-xl text-gray-600">Tips, tricks, and insights for digital creators</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <BlogCard
              title="10 Tips for Optimizing Your LinkHub Page"
              excerpt="Learn how to maximize your page's performance and engagement."
              date="Jan 8, 2025"
              readTime={5}
              url={Blog1}
            />
            <BlogCard
              title="The Future of Personal Branding"
              excerpt="Discover emerging trends in digital presence management."
              date="Jan 5, 2025"
              readTime={7}
              url={Blog2}
            />
            <BlogCard
              title="Success Story: From 0 to 100K Followers"
              excerpt="How one creator built their audience using LinkHub."
              date="Jan 2, 2025"
              readTime={6}
              url={Blog3}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
       <AnimatedSection className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            variants={scaleIn}
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators and professionals who use LinkHub to grow their online presence.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Free Trial <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>

       {/* Footer */}
       <footer className="bg-gray-900 text-white py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link to="/" className="text-2xl font-bold mb-6 block">
                LinkHub
              </Link>
              <p className="text-gray-400 mb-6">
                Your all-in-one solution for managing your digital presence.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map(platform => (
                  <motion.a
                    key={platform}
                    href={`#${platform}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <img
                      src={`/api/placeholder/20/20?text=${platform[0].toUpperCase()}`}
                      alt={platform}
                      className="w-5 h-5"
                    />
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Integrations", "Pricing", "FAQ"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"]
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Cookies"]
              }
            ].map(({ title, links }) => (
              <div key={title}>
                <h3 className="font-semibold text-lg mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map(link => (
                    <motion.li
                      key={link}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to={`#${link.toLowerCase()}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LinkHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link to={to} className="text-gray-600 hover:text-blue-600 transition-colors duration-300" onClick={onClick}>
      {children}
    </Link>
  )
}

function AnimatedCard({ icon, title, description, step, price, features, highlighted, quote, author, name, excerpt, date }: {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  step?: number;
  price?: string;
  features?: string[];
  highlighted?: boolean;
  quote?: string;
  author?: string;
  name?: string;
  excerpt?: string;
  date?: string;
}) {
  const controls = useAnimation()
  const [ref, inView] = useState(false)

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 })
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={(el) => {
        if (el) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                inView(true)
              }
            },
            { threshold: 0.1 }
          )
          observer.observe(el)
          return () => observer.disconnect()
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg shadow-lg ${highlighted ? 'bg-blue-600 text-white' : 'bg-white'}`}
    >
      {icon && <div className="mb-4">{icon}</div>}
      {step && (
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
          {step}
        </div>
      )}
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      {price && (
        <p className="text-4xl font-bold mb-6">
          {price}<span className="text-lg font-normal opacity-75">/month</span>
        </p>
      )}
      {description && <p className="text-gray-600">{description}</p>}
      {features && (
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle2 className={`h-5 w-5 ${highlighted ? 'text-white' : 'text-green-500'} mr-2`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      {quote && (
        <>
          <Star className="w-8 h-8 text-yellow-500 mb-4" />
          <p className="text-gray-600 mb-4">{quote}</p>
        </>
      )}
      {author && <p className="font-semibold">{author}</p>}
      {name && (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
          <img 
            src={`/placeholder.svg?height=50&width=50&text=${name}`}
            alt={`${name} logo`}
            width={50}
            height={50}
          />
        </div>
      )}
      {excerpt && <p className="text-gray-600 mb-4">{excerpt}</p>}
      {date && <p className="text-sm text-gray-500">{date}</p>}
      {highlighted && (
        <Button className="w-full mt-6" variant="secondary">
          Get Started
        </Button>
      )}
    </motion.div>
  )
}

