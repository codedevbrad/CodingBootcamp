'use client';

import { Calendar, MessageSquare, BookOpen, Clock, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/custom/darkmode"; 

// ShadCN Dropdown (mobile)
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import ProfileDropdown from './sub.dropdown';

// ---------------------------------------------
// Action Buttons
// ---------------------------------------------
const ActionButtons = () => (
  <div className="hidden md:flex items-center space-x-2">
    <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
      <Calendar className="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
      <MessageSquare className="h-5 w-5" />
    </Button>
  </div>
);




// ---------------------------------------------
// Status
// ---------------------------------------------
interface StatusSectionProps {
  currentTime: Date | null;
  isClient: boolean;
}

const StatusSection = ({ currentTime, isClient }: StatusSectionProps) => (
  <div className="hidden sm:flex items-center gap-6">
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-sm font-medium text-foreground">Online & Ready</span>
    </div>

    {isClient && currentTime && (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="font-mono tabular-nums">{currentTime.toLocaleTimeString()}</span>
      </div>
    )}
  </div>
);

// ---------------------------------------------
// Quick Actions (right side)
///---------------------------------------------
const QuickActions = () => (
  <div className="hidden md:flex items-center space-x-3">
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

// ---------------------------------------------
// Creator Nav Data
// ---------------------------------------------
type NavGroup = {
  title: 'Concepts' | 'Challenges' | 'Projects' | 'Journeys';
  items: { label: string; href: string }[];
};

const NAV: NavGroup[] = [
  {
    title: 'Concepts',
    items: [
      { label: 'All Concepts', href: '/creator/concepts' },
      { label: 'New Concept', href: '/creator/concepts/new' },
      { label: 'Templates', href: '/creator/concepts/templates' },
      { label: 'Categories', href: '/creator/concepts/categories' },
    ],
  },
  {
    title: 'Challenges',
    items: [
      { label: 'All Challenges', href: '/creator/challenges' },
      { label: 'New Challenge', href: '/creator/challenges/new' },
      { label: 'Difficulty Levels', href: '/creator/challenges/levels' },
      { label: 'Leaderboard', href: '/creator/challenges/leaderboard' },
    ],
  },
  {
    title: 'Projects',
    items: [
      { label: 'All Projects', href: '/creator/projects' },
      { label: 'New Project', href: '/creator/projects/new' },
      { label: 'Templates', href: '/creator/projects/templates' },
      { label: 'Categories', href: '/creator/projects/categories' },
    ],
  },
  {
    title: 'Journeys',
    items: [
      { label: 'All Journeys', href: '/creator/journeys' },
      { label: 'New Journey', href: '/creator/journeys/new' },
      { label: 'Roadmaps', href: '/creator/journeys/roadmaps' },
      { label: 'Analytics', href: '/creator/journeys/analytics' },
    ],
  },
];



// ---------------------------------------------
// Mobile Nav (hamburger -> dropdown)
// ---------------------------------------------
const CreatorNavMobile = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-64">
      {NAV.map((group, gi) => (
        <div key={group.title}>
          {gi !== 0 && <DropdownMenuSeparator />}
          <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">
            {group.title}
          </DropdownMenuLabel>
          {group.items.map((it) => (
            <DropdownMenuItem key={it.href} asChild>
              <a href={it.href} className="w-full">
                {it.label}
              </a>
            </DropdownMenuItem>
          ))}
        </div>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);


// ---------------------------------------------
// Main Header Content
// ---------------------------------------------
const MainHeader = () => (
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-20">
      <div className="flex items-center gap-4"> 
        {/* Mobile nav */}
        <CreatorNavMobile />
      </div>


      <div className="flex items-center gap-3">
        <ActionButtons />
        <ProfileDropdown />
        <DarkModeToggle />
      </div>
    </div>
  </div>
);

// ---------------------------------------------
// Exported Header
// ---------------------------------------------

// 1) Make the header not clip popovers (overflow-visible) and put it above bg
export default function CreatorHeader() {
  return (
    <header className="w-full relative  overflow-visible">
      <MainHeader />
    </header>
  );
}
