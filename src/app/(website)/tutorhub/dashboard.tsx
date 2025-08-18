'use client';

import { TutorProfile, User } from '@/generated/prisma';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { 
  Calendar, 
  Users, 
  TrendingUp,
  Settings,
  BookOpen,
  Clock,
  Award,
  DollarSign,
  Star,
  Activity,
  Eye,
  Edit3,
  BarChart3
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkModeToggle from "@/components/darkmode/mode-toggle";

interface TutorDashboardProps {
  tutor: User & {
    tutorProfile: TutorProfile | null;
    accounts: any[];
  };
  tutorProfile: TutorProfile;
}

// Overview Tab Component
function OverviewTab({ tutor, tutorProfile }: { tutor: User; tutorProfile: TutorProfile }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Enhanced Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
          <div className="relative flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
              <p className="text-3xl font-bold text-foreground">0</p>
              <p className="text-xs text-green-600 font-medium">+0% from last month</p>
            </div>
          </div>
        </div>

        <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
          <div className="relative flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
              <p className="text-3xl font-bold text-foreground">$0</p>
              <p className="text-xs text-green-600 font-medium">Ready to start!</p>
            </div>
          </div>
        </div>

        <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/10"></div>
          <div className="relative flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Rating</p>
              <p className="text-3xl font-bold text-foreground">5.0</p>
              <p className="text-xs text-yellow-600 font-medium">Perfect start!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
        <div className="relative">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
            <Button variant="outline" className="w-full border-2 hover:bg-accent transition-all duration-300">
              <Clock className="mr-2 h-4 w-4" />
              Update Availability
            </Button>
            <Button variant="outline" className="w-full border-2 hover:bg-accent transition-all duration-300">
              <Eye className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Recent Activity
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-lg font-medium">No recent activity</p>
          <p className="text-sm">Your sessions and updates will appear here</p>
        </div>
      </div>
    </div>
  );
}

// Enhanced Profile Tab Component
function ProfileTab({ tutor, tutorProfile }: { tutor: User; tutorProfile: TutorProfile }) {
  const getInitials = (name: string | null) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
      <div className="relative px-6 py-4 border-b border-border bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Tutor Profile
        </h3>
      </div>
      <div className="px-6 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-border">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={tutor.image || undefined} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
              {getInitials(tutor.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-xl font-bold text-foreground">{tutor.name || 'Not provided'}</h4>
            <p className="text-muted-foreground">{tutor.email}</p>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-foreground">5.0 Rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-foreground font-medium p-3 bg-accent/50 rounded-lg border border-border">
              {tutor.name || 'Not provided'}
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-foreground font-medium p-3 bg-accent/50 rounded-lg border border-border">
              {tutor.email}
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Hourly Rate</label>
            <p className="text-foreground font-medium p-3 bg-accent/50 rounded-lg border border-border flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
              {tutorProfile.hourlyRate || 'Not set'}
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Profile Created</label>
            <p className="text-foreground font-medium p-3 bg-accent/50 rounded-lg border border-border">
              {new Date(tutorProfile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">Bio</label>
          <p className="text-foreground p-4 bg-accent/50 rounded-lg border border-border min-h-[100px]">
            {tutorProfile.bio || 'No bio provided yet. Add a compelling bio to attract more students!'}
          </p>
        </div>
        
        <div className="pt-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

// Enhanced placeholder components for other tabs
function SessionsTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
        Sessions
      </h3>
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-blue-500" />
        </div>
        <p className="text-lg font-medium">Sessions management will be implemented here</p>
      </div>
    </div>
  );
}

function EarningsTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
        Earnings
      </h3>
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-lg font-medium">Earnings tracking will be implemented here</p>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-gray-600" />
        Settings
      </h3>
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="h-8 w-8 text-gray-500" />
        </div>
        <p className="text-lg font-medium">Settings panel will be implemented here</p>
      </div>
    </div>
  );
}

export default function TutorDashboard({ tutor, tutorProfile }: TutorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { theme } = useTheme();

  const getInitials = (name: string | null) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="relative bg-card border border-border rounded-xl shadow-lg mb-8 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>

          <div className="relative px-6 py-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src={tutor.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
                      {getInitials(tutor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-2 border-background"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome back, {tutor.name?.split(' ')[0] || 'Tutor'}! 👋
                  </h1>
                  <p className="text-muted-foreground text-lg">Tutor Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <DarkModeToggle />
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-bold text-green-600 flex items-center">
                    <DollarSign className="h-6 w-6 mr-1" />
                    {tutorProfile.hourlyRate || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Tabs */}
          <div className="relative px-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'profile', label: 'Profile', icon: Users },
                { id: 'sessions', label: 'Sessions', icon: Calendar },
                { id: 'earnings', label: 'Earnings', icon: TrendingUp },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab tutor={tutor} tutorProfile={tutorProfile} />}
          {activeTab === 'profile' && <ProfileTab tutor={tutor} tutorProfile={tutorProfile} />}
          {activeTab === 'sessions' && <SessionsTab />}
          {activeTab === 'earnings' && <EarningsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}