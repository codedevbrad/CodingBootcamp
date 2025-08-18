'use client';

import { User, TutorProfile } from '@/generated/prisma'
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
  MessageSquare,
  BookOpen,
  Clock,
  Award,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkModeToggle from "@/components/darkmode/mode-toggle";

// Types
interface TutorHeaderProps {
  tutor: User & {
    tutorProfile: TutorProfile | null;
  };
  tutorProfile: TutorProfile;
}

interface GreetingState {
  currentTime: Date | null;
  isClient: boolean;
}

// Utility Functions
const getInitials = (name: string | null): string => {
  if (!name) return 'T';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getGreeting = (currentTime: Date | null, isClient: boolean): string => {
  if (!isClient || !currentTime) return 'Hello';
  
  const hour = currentTime.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getGreetingEmoji = (currentTime: Date | null, isClient: boolean): string => {
  if (!isClient || !currentTime) return '👋';
  
  const hour = currentTime.getHours();
  if (hour < 12) return '🌅';
  if (hour < 17) return '☀️';
  return '🌙';
};

// Hook for managing time state
const useCurrentTime = (): GreetingState => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return { currentTime, isClient };
};

// Background Component
const HeaderBackground = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10">
      <div 
        className="absolute inset-0 opacity-50 dark:opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
    </div>
  </>
);

// Logo Component
const TutorLogo = () => (
  <div className="flex items-center space-x-4">
    <div className="relative">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
        <BookOpen className="h-7 w-7 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-background animate-pulse"></div>
    </div>
    <div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        CodeBootcamp 
      </h1>
    </div>
  </div>
);

// Greeting Component
interface GreetingProps {
  tutorName: string | null;
  currentTime: Date | null;
  isClient: boolean;
}

const TutorGreeting = ({ tutorName, currentTime, isClient }: GreetingProps) => (
  <p className="text-sm text-muted-foreground flex items-center space-x-1">
    <span>{getGreeting(currentTime, isClient)}, {tutorName?.split(' ')[0] || 'Tutor'}!</span>
    <span className="animate-bounce">{getGreetingEmoji(currentTime, isClient)}</span>
  </p>
);

// Action Buttons Component
const ActionButtons = () => (
  <div className="flex items-center space-x-2">
    <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
      <Calendar className="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
      <MessageSquare className="h-5 w-5" />
    </Button>
  </div>
);

// Profile Dropdown Component
interface ProfileDropdownProps {
  tutor: User;
}

const ProfileDropdown = ({ tutor }: ProfileDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="flex items-center space-x-3 h-12 cursor-pointer hover:bg-accent transition-colors">
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={tutor.image || undefined} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
              {getInitials(tutor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-background"></div>
        </div>
        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-64 p-2">
      <DropdownMenuLabel className="pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={tutor.image || undefined} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {getInitials(tutor.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{tutor.name}</p>
            <p className="text-xs text-muted-foreground">{tutor.email}</p>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-950/50">
        <Settings className="mr-3 h-4 w-4" />
        <span>Profile Settings</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="hover:bg-green-50 dark:hover:bg-green-950/50">
        <TrendingUp className="mr-3 h-4 w-4" />
        <span>Performance Analytics</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="hover:bg-purple-50 dark:hover:bg-purple-950/50">
        <Users className="mr-3 h-4 w-4" />
        <span>My Students</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="hover:bg-yellow-50 dark:hover:bg-yellow-950/50">
        <Award className="mr-3 h-4 w-4" />
        <span>Achievements</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50">
        <LogOut className="mr-3 h-4 w-4" />
        <span>Sign out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Status Section Component
interface StatusSectionProps {
  currentTime: Date | null;
  isClient: boolean;
}

const StatusSection = ({ currentTime, isClient }: StatusSectionProps) => (
  <div className="flex items-center space-x-8">
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-sm font-medium text-foreground">Online & Ready</span>
    </div>
    
    {isClient && currentTime && (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
      </div>
    )}
    
    <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
      <Calendar className="h-4 w-4" />
      <span>Next: <strong className="text-foreground">Physics Tutoring</strong> at 3:00 PM</span>
    </div>
  </div>
);

// Quick Actions Component
const QuickActions = () => (
  <div className="flex items-center space-x-3">
    <Button 
      size="sm" 
      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
    >
      <Users className="mr-2 h-4 w-4" />
      Start New Session
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      className="border-2 hover:bg-accent transition-all duration-300"
    >
      <Calendar className="mr-2 h-4 w-4" />
      Schedule
    </Button>
  </div>
);

// Secondary Bar Component
interface SecondaryBarProps {
  currentTime: Date | null;
  isClient: boolean;
}

const SecondaryBar = ({ currentTime, isClient }: SecondaryBarProps) => (
  <div className="relative bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-14">
        <StatusSection currentTime={currentTime} isClient={isClient} />
        <QuickActions />
      </div>
    </div>
  </div>
);

// Main Header Content Component
interface MainHeaderProps {
  tutor: User;
  currentTime: Date | null;
  isClient: boolean;
}

const MainHeader = ({ tutor, currentTime, isClient }: MainHeaderProps) => (
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-20">
      <div className="flex items-center space-x-6">
        <TutorLogo />
        <TutorGreeting 
          tutorName={tutor.name} 
          currentTime={currentTime} 
          isClient={isClient} 
        />
      </div>

      <div className="flex items-center space-x-3">
        <ActionButtons />
        <ProfileDropdown tutor={tutor} />
        <DarkModeToggle />
      </div>
    </div>
  </div>
);

// Main Component
export default function AnimatedTutorHeader({ tutor }: TutorHeaderProps) {
  const { currentTime, isClient } = useCurrentTime();

  return (
    <header className="relative bg-background border-b border-border shadow-lg overflow-hidden">
      <HeaderBackground />
      <MainHeader tutor={tutor} currentTime={currentTime} isClient={isClient} />
      <SecondaryBar currentTime={currentTime} isClient={isClient} />
    </header>
  );
}

// Export individual components for reuse
export {
  HeaderBackground,
  TutorLogo,
  TutorGreeting,
  ActionButtons,
  ProfileDropdown,
  StatusSection,
  QuickActions,
  SecondaryBar,
  MainHeader,
  useCurrentTime,
  getInitials,
  getGreeting,
  getGreetingEmoji
};