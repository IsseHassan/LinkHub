import { ReactNode, useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  UserCircle, 
  Menu, 
  ChevronLeft,
  Bell,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/auth-context';


interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  path: string;
  icon: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const {user, logout} = useAuth()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu on wider screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems: NavItem[] = [
    { title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: 'Profile', path: '/dashboard/profile', icon: <UserCircle className="h-5 w-5" /> },
    { title: 'Analytics', path: '/dashboard/analytics', icon: <Users className="h-5 w-5" /> },
    { title: 'Settings', path: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const isCurrentRoute = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-30 w-full bg-white border-b border-zinc-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xl font-bold">
                <a href="/">LinkHub</a>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src= {user?.avatar}/>
                    <AvatarFallback>{user?.displayName[0]+''+ user?.displayName[1]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <NavLink to={'/dashboard/profile'}>Profile</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink to={'/dashboard/settings'}>Settings</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-20 h-full
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          bg-white border-r border-zinc-200
          pt-16
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 px-3 py-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex absolute right-0 top-20 -mr-4 bg-white border border-zinc-200 rounded-full"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </Button>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md
                    transition-colors duration-200
                    ${isCurrentRoute(item.path) 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-zinc-600 hover:bg-zinc-100'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-zinc-200" id='logout-button'>
            <Button
              variant="ghost"
              className={`w-full text-zinc-600 hover:bg-zinc-100 ${
                isCollapsed ? 'px-0' : ''
              }`}
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300 ease-in-out
          pt-16
          ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}
        `}
      >
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}