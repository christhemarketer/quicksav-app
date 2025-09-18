import React, { useState } from 'react';
import { 
  Home, 
  Layers, 
  Share2, 
  User, 
  Settings, 
  Plus,
  Camera,
  Upload,
  Link,
  LogOut,
  Menu,
  X,
  Briefcase,
  Heart,
  BookOpen,
  Music,
  Edit3,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Folder,
  FileText,
  Code,
  Image,
  Video,
  Archive,
  Search,
  ExternalLink,
  File,
  Calendar,
  Clock,
  Box,
  Moon,
  Sun,
  Globe,
  FileImage,
  PlayCircle
} from 'lucide-react';

// File type detection and icon mapping
const getFileTypeIcon = (savIt) => {
  const { type, url, title } = savIt;
  
  if (type === 'link' && url) {
    if (url.includes('facebook.com')) return { icon: 'fb', color: 'text-white', label: 'Facebook', bgColor: 'bg-blue-600' };
    if (url.includes('tiktok.com')) return { icon: 'tt', color: 'text-white', label: 'TikTok', bgColor: 'bg-black' };
    if (url.includes('youtube.com') || url.includes('youtu.be')) return { icon: '▶', color: 'text-white', label: 'YouTube', bgColor: 'bg-red-600' };
    if (url.includes('instagram.com')) return { icon: '📷', color: 'text-white', label: 'Instagram', bgColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400' };
    if (url.includes('twitter.com') || url.includes('x.com')) return { icon: '𝕏', color: 'text-white', label: 'X/Twitter', bgColor: 'bg-black' };
    if (url.includes('linkedin.com')) return { icon: 'in', color: 'text-white', label: 'LinkedIn', bgColor: 'bg-blue-700' };
    if (url.includes('github.com')) return { icon: '⚡', color: 'text-white', label: 'GitHub', bgColor: 'bg-gray-800' };
    return { icon: Globe, color: 'text-blue-600', label: 'Website', bgColor: 'bg-blue-100' };
  }
  
  if (title && title.includes('.pdf')) return { icon: FileText, color: 'text-red-600', label: 'PDF', bgColor: 'bg-red-100' };
  if (title && (title.includes('.png') || title.includes('.jpg') || title.includes('.jpeg'))) return { icon: FileImage, color: 'text-purple-600', label: 'Image', bgColor: 'bg-purple-100' };
  if (title && (title.includes('.mp4') || title.includes('.mov'))) return { icon: PlayCircle, color: 'text-red-600', label: 'Video', bgColor: 'bg-red-100' };
  
  switch (type) {
    case 'image': return { icon: FileImage, color: 'text-purple-600', label: 'Image', bgColor: 'bg-purple-100' };
    case 'video': return { icon: PlayCircle, color: 'text-red-600', label: 'Video', bgColor: 'bg-red-100' };
    case 'link': return { icon: Globe, color: 'text-blue-600', label: 'Link', bgColor: 'bg-blue-100' };
    default: return { icon: File, color: 'text-gray-600', label: 'File', bgColor: 'bg-gray-100' };
  }
};

// Available icons for Spaces and Stacks
const iconOptions = [
  { icon: Briefcase, label: 'Work' },
  { icon: Heart, label: 'Personal' },
  { icon: BookOpen, label: 'Learning' },
  { icon: Code, label: 'Development' },
  { icon: Image, label: 'Design' },
  { icon: Music, label: 'Music' }
];

// Date formatting utility
const formatDistanceToNow = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

// Editable name component
const EditableName = ({ value, onSave, className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className={`bg-white border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 ${className}`}
        autoFocus
      />
    );
  }

  return (
    <div 
      className={`cursor-pointer hover:bg-gray-100 rounded px-2 py-1 flex items-center gap-2 ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <span>{value}</span>
      <Edit3 size={12} className="opacity-0 group-hover:opacity-100 text-gray-400" />
    </div>
  );
};

// Icon picker component
const IconPicker = ({ selectedIcon, onSelect, isOpen, onToggle }) => {
  if (!isOpen) {
    const IconComponent = selectedIcon || Folder;
    return (
      <button 
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <IconComponent size={20} className="text-gray-700" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="p-2 bg-blue-100 rounded-lg"
      >
        {selectedIcon && <selectedIcon size={20} className="text-blue-600" />}
      </button>
      <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 grid grid-cols-3 gap-2 z-50">
        {iconOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              onSelect(option.icon);
              onToggle();
            }}
            className="p-2 hover:bg-gray-100 rounded flex flex-col items-center gap-1"
            title={option.label}
          >
            <option.icon size={16} className="text-gray-700" />
          </button>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedStack, setSelectedStack] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuickSavModal, setShowQuickSavModal] = useState(false);
  const [quickSavType, setQuickSavType] = useState('link');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showOrganizeModal, setShowOrganizeModal] = useState(false);
  const [organizingQuickSav, setOrganizingQuickSav] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [currentTier, setCurrentTier] = useState('free');

  // Mock data
  const [spaces, setSpaces] = useState([
    {
      id: 'sp1',
      name: 'Work Projects',
      description: 'Development and professional content',
      icon: Briefcase,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'sp2',
      name: 'Personal Learning',
      description: 'Skills and knowledge development',
      icon: BookOpen,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [stacks, setStacks] = useState([
    {
      id: 's1',
      name: 'React Development',
      description: 'Components, hooks, and best practices',
      spaceId: 'sp1',
      icon: Box,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 's2',
      name: 'UI/UX Design',
      description: 'Design systems and user research',
      spaceId: 'sp1',
      icon: Image,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [savIts, setSavIts] = useState({
    's1': [
      {
        id: 'sv1',
        title: 'React 18 Concurrent Features Guide',
        type: 'link',
        url: 'https://react.dev/blog/2022/03/29/react-v18',
        stackId: 's1',
        metadata: { domain: 'react.dev', description: 'Complete guide to React 18 concurrent features' },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ['react', 'concurrent', 'guide']
      },
      {
        id: 'sv2',
        title: 'Component Architecture Diagram.png',
        type: 'image',
        filePath: '/Users/demo/Projects/diagrams/component-arch.png',
        stackId: 's1',
        metadata: { size: '1.2 MB', dimensions: '1920x1080' },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['architecture', 'diagram']
      }
    ]
  });

  const [quickSavs, setQuickSavs] = useState([
    {
      id: 'qs1',
      title: 'React State Management Best Practices',
      type: 'link',
      url: 'https://react.dev/learn/managing-state',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: { domain: 'react.dev' }
    },
    {
      id: 'qs2',
      title: 'Meeting Notes Screenshot.png',
      type: 'image',
      filePath: '/Users/demo/Screenshots/meeting-notes.png',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      metadata: { size: '2.1 MB' }
    },
    {
      id: 'qs3',
      title: 'Productivity Tips Video',
      type: 'link',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      metadata: { domain: 'youtube.com' }
    },
    {
      id: 'qs4',
      title: 'Design System Components.pdf',
      type: 'link',
      url: 'https://example.com/design-system.pdf',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      metadata: { domain: 'example.com' }
    },
    {
      id: 'qs5',
      title: 'Team Photo.jpg',
      type: 'image',
      filePath: '/Users/demo/Photos/team-photo.jpg',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      metadata: { size: '4.2 MB' }
    },
    {
      id: 'qs6',
      title: 'Project Planning Guide',
      type: 'link',
      url: 'https://notion.so/project-planning',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      metadata: { domain: 'notion.so' }
    },
    {
      id: 'qs7',
      title: 'Wireframe Mockups.png',
      type: 'image',
      filePath: '/Users/demo/Design/wireframes.png',
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
      metadata: { size: '1.8 MB' }
    },
    {
      id: 'qs8',
      title: 'API Documentation',
      type: 'link',
      url: 'https://docs.api.com/v2',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      metadata: { domain: 'docs.api.com' }
    },
    {
      id: 'qs9',
      title: 'Financial Report Q3.pdf',
      type: 'link',
      url: 'https://company.com/reports/q3.pdf',
      timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
      metadata: { domain: 'company.com' }
    },
    {
      id: 'qs10',
      title: 'Marketing Campaign Video.mp4',
      type: 'video',
      filePath: '/Users/demo/Videos/campaign.mp4',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      metadata: { size: '15.7 MB' }
    }
  ]);

  // Add new QuickSav function
  const addQuickSav = (newItem) => {
    const quickSav = {
      id: `qs${Date.now()}`,
      title: newItem.title,
      type: newItem.type,
      url: newItem.url || null,
      filePath: newItem.filePath || null,
      timestamp: new Date(),
      metadata: newItem.metadata || {}
    };
    setQuickSavs(prev => [quickSav, ...prev]);
    setShowQuickSavModal(false);
  };

  // Pricing Modal
  const PricingModal = () => {
    const pricingPlans = [
      {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for personal use',
        features: [
          '4 Spaces',
          '20 Stacks per Space',
          '50 SavIts per Stack',
          '5GB Storage',
          'Basic Search',
          'Email Support',
          'Mobile App Access',
          'Basic Organization Tools'
        ],
        limitations: [
          'Limited Spaces',
          'No AI Features',
          'Basic Support Only'
        ],
        buttonText: currentTier === 'free' ? 'Current Plan' : 'Downgrade',
        isCurrentTier: currentTier === 'free',
        isPro: false
      },
      {
        name: 'Pro',
        price: '$9.99',
        period: 'per month',
        description: 'Unlock the full power of QuickSav',
        features: [
          'Unlimited Spaces',
          'Unlimited Stacks',
          'Unlimited SavIts',
          '100GB Storage',
          'Advanced Search & Filters',
          'AI-Powered Organization',
          'Smart Auto-Categorization',
          'Custom Themes & Backgrounds',
          'Priority Support',
          'API Access',
          'Advanced Analytics',
          'Bulk Operations'
        ],
        limitations: [],
        buttonText: currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
        isCurrentTier: currentTier === 'pro',
        isPro: true
      },
      {
        name: 'Teams',
        price: '$19.99',
        period: 'per user/month',
        description: 'Built for team collaboration',
        features: [
          'Everything in Pro',
          'Team Collaboration',
          'Shared Spaces & Stacks',
          'Admin Controls',
          'Team Analytics Dashboard',
          'Single Sign-On (SSO)',
          'Advanced Security Features',
          'Custom Integrations',
          'Dedicated Account Manager',
          'Priority Phone Support',
          'Custom Onboarding',
          'Advanced Reporting'
        ],
        limitations: [],
        buttonText: currentTier === 'teams' ? 'Current Plan' : 'Upgrade to Teams',
        isCurrentTier: currentTier === 'teams',
        isPro: true
      }
    ];

    if (!showPricingModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto`}>
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Choose Your Plan</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Compare features and upgrade your QuickSav experience</p>
            </div>
            <button
              onClick={() => setShowPricingModal(false)}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            </button>
          </div>

          <div className="p-4">
            {/* Current Tier Indicator */}
            <div className={`mb-4 p-3 rounded-lg text-center ${
              currentTier === 'free' ? 'bg-blue-50 text-blue-700' :
              currentTier === 'pro' ? 'bg-emerald-50 text-emerald-700' :
              'bg-purple-50 text-purple-700'
            }`}>
              <span className="font-medium">Current Plan: {pricingPlans.find(p => p.name.toLowerCase() === currentTier)?.name}</span>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <thead>
                  <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <th className={`p-3 text-left border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>Features</th>
                    {pricingPlans.map(plan => (
                      <th key={plan.name} className={`p-3 text-center border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} ${
                        plan.isCurrentTier ? 'bg-blue-100' : ''
                      }`}>
                        <div className="font-bold text-lg">{plan.name}</div>
                        <div className={`text-xl font-bold ${plan.name === 'Free' ? 'text-blue-600' : plan.name === 'Pro' ? 'text-emerald-600' : 'text-purple-600'}`}>
                          {plan.price}
                        </div>
                        <div className="text-xs opacity-75">{plan.period}</div>
                        {plan.isCurrentTier && <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full mt-1">Current</div>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>Spaces</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center`}>4</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-600 font-medium`}>Unlimited</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-purple-600 font-medium`}>Unlimited</td>
                  </tr>
                  <tr className={isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>Stacks per Space</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center`}>20</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-600 font-medium`}>Unlimited</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-purple-600 font-medium`}>Unlimited</td>
                  </tr>
                  <tr>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>SavIts per Stack</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center`}>50</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-600 font-medium`}>Unlimited</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-purple-600 font-medium`}>Unlimited</td>
                  </tr>
                  <tr className={isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>Storage</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center`}>5GB</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center`}>100GB</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center`}>500GB</td>
                  </tr>
                  <tr>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>AI Features</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-red-500`}>✗</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-500`}>✓</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-500`}>✓</td>
                  </tr>
                  <tr className={isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>Advanced Search</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-red-500`}>✗</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-500`}>✓</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-500`}>✓</td>
                  </tr>
                  <tr>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>Custom Themes</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-red-500`}>✗</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-500`}>✓</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-500`}>✓</td>
                  </tr>
                  <tr className={isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>Team Collaboration</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-red-500`}>✗</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-red-500`}>✗</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-purple-500`}>✓</td>
                  </tr>
                  <tr>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>Priority Support</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-red-500`}>✗</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-emerald-500`}>✓</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-purple-500`}>✓</td>
                  </tr>
                  <tr className={isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-medium`}>Admin Controls</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-red-500`}>✗</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-red-500`}>✗</td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} text-center text-purple-500`}>✓</td>
                  </tr>
                  <tr>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600 border-b-2' : 'border-gray-200 border-b-2'} font-medium`}></td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600 border-b-2' : 'border-gray-200 border-b-2'} text-center`}>
                      <button
                        onClick={() => {
                          if (currentTier !== 'free') {
                            setCurrentTier('free');
                            setShowPricingModal(false);
                          }
                        }}
                        disabled={currentTier === 'free'}
                        className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
                          currentTier === 'free' 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {currentTier === 'free' ? 'Current Plan' : 'Downgrade'}
                      </button>
                    </td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600 border-b-2' : 'border-gray-200 border-b-2'} text-center`}>
                      <button
                        onClick={() => {
                          if (currentTier !== 'pro') {
                            setCurrentTier('pro');
                            setShowPricingModal(false);
                          }
                        }}
                        disabled={currentTier === 'pro'}
                        className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
                          currentTier === 'pro' 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {currentTier === 'pro' ? 'Current Plan' : 'Upgrade'}
                      </button>
                    </td>
                    <td className={`p-3 border ${isDarkMode ? 'border-gray-600 border-b-2' : 'border-gray-200 border-b-2'} text-center`}>
                      <button
                        onClick={() => {
                          if (currentTier !== 'teams') {
                            setCurrentTier('teams');
                            setShowPricingModal(false);
                          }
                        }}
                        disabled={currentTier === 'teams'}
                        className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
                          currentTier === 'teams' 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {currentTier === 'teams' ? 'Current Plan' : 'Upgrade'}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`mt-4 text-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              All plans include 30-day money back guarantee • Cancel anytime
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Organize Modal
  const OrganizeModal = () => {
    const [editedTitle, setEditedTitle] = useState('');
    const [selectedSpace, setSelectedSpace] = useState('');
    const [selectedStack, setSelectedStack] = useState('');
    const [newSpaceName, setNewSpaceName] = useState('');
    const [newStackName, setNewStackName] = useState('');
    const [organizationMode, setOrganizationMode] = useState('existing'); // 'existing' or 'new'

    React.useEffect(() => {
      if (organizingQuickSav) {
        setEditedTitle(organizingQuickSav.title);
      }
    }, [organizingQuickSav]);

    const handleOrganize = () => {
      // Implementation for organizing the QuickSav
      console.log('Organizing:', { editedTitle, selectedSpace, selectedStack, newSpaceName, newStackName });
      setShowOrganizeModal(false);
      setOrganizingQuickSav(null);
    };

    if (!showOrganizeModal || !organizingQuickSav) return null;

    const availableStacks = stacks.filter(stack => stack.spaceId === selectedSpace);
    const canCreateNewSpace = spaces.length < 4; // Free tier limit
    const canCreateNewStack = selectedSpace && stacks.filter(s => s.spaceId === selectedSpace).length < 20; // Free tier limit

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Organize QuickSav</h2>
              <button
                onClick={() => {
                  setShowOrganizeModal(false);
                  setOrganizingQuickSav(null);
                }}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            </div>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Add this item to a Space and Stack for better organization</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Edit Title */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Item Title
              </label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Organization Mode */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Organization Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOrganizationMode('existing')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    organizationMode === 'existing' 
                      ? 'border-blue-500 bg-blue-50' 
                      : isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Layers size={24} className={`mx-auto mb-2 ${organizationMode === 'existing' ? 'text-blue-600' : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${organizationMode === 'existing' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Use Existing</div>
                </button>
                
                <button
                  onClick={() => setOrganizationMode('new')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    organizationMode === 'new' 
                      ? 'border-green-500 bg-green-50' 
                      : isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Plus size={24} className={`mx-auto mb-2 ${organizationMode === 'new' ? 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${organizationMode === 'new' ? 'text-green-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Create New</div>
                </button>
              </div>
            </div>

            {/* Existing Mode */}
            {organizationMode === 'existing' && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Select Space
                  </label>
                  <select 
                    value={selectedSpace}
                    onChange={(e) => {
                      setSelectedSpace(e.target.value);
                      setSelectedStack('');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Choose a Space...</option>
                    {spaces.map(space => (
                      <option key={space.id} value={space.id}>{space.name}</option>
                    ))}
                  </select>
                </div>

                {selectedSpace && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Select Stack
                    </label>
                    <div className="space-y-2">
                      <select 
                        value={selectedStack}
                        onChange={(e) => setSelectedStack(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Choose a Stack...</option>
                        {availableStacks.map(stack => (
                          <option key={stack.id} value={stack.id}>{stack.name}</option>
                        ))}
                      </select>
                      
                      {canCreateNewStack && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Or create new stack..."
                            value={newStackName}
                            onChange={(e) => setNewStackName(e.target.value)}
                            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* New Mode */}
            {organizationMode === 'new' && (
              <div className="space-y-4">
                {canCreateNewSpace ? (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Space Name
                      </label>
                      <input
                        type="text"
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        placeholder="Enter space name..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Stack Name
                      </label>
                      <input
                        type="text"
                        value={newStackName}
                        onChange={(e) => setNewStackName(e.target.value)}
                        placeholder="Enter stack name..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                  </>
                ) : (
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-yellow-600 bg-yellow-900/20' : 'border-yellow-300 bg-yellow-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                      You've reached the maximum number of Spaces for the Free tier. Please upgrade or use an existing Space.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowOrganizeModal(false);
                  setOrganizingQuickSav(null);
                }}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleOrganize}
                disabled={!editedTitle || 
                  (organizationMode === 'existing' && (!selectedStack && !newStackName)) ||
                  (organizationMode === 'new' && (!newSpaceName || !newStackName))
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Organize Item
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // QuickSav NOW Modal
  const QuickSavModal = () => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
      if (!title.trim()) return;

      const newItem = {
        title: title.trim(),
        type: quickSavType,
        url: quickSavType === 'link' ? url : null,
        filePath: quickSavType === 'file' ? `/Users/demo/${title}` : null,
        metadata: {
          description: description,
          domain: quickSavType === 'link' && url ? new URL(url).hostname : null
        }
      };

      addQuickSav(newItem);
      setTitle('');
      setUrl('');
      setDescription('');
    };

    if (!showQuickSavModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>QuickSav NOW</h2>
              <button
                onClick={() => setShowQuickSavModal(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            </div>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quickly save any type of content to organize later</p>
          </div>

          <div className="p-6">
            {/* Content Type Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Content Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setQuickSavType('link')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quickSavType === 'link' 
                      ? 'border-blue-500 bg-blue-50' 
                      : isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ExternalLink size={24} className={`mx-auto mb-2 ${quickSavType === 'link' ? 'text-blue-600' : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${quickSavType === 'link' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Link/URL</div>
                </button>
                
                <button
                  onClick={() => setQuickSavType('image')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quickSavType === 'image' 
                      ? 'border-purple-500 bg-purple-50' 
                      : isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image size={24} className={`mx-auto mb-2 ${quickSavType === 'image' ? 'text-purple-600' : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${quickSavType === 'image' ? 'text-purple-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Image</div>
                </button>

                <button
                  onClick={() => setQuickSavType('video')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quickSavType === 'video' 
                      ? 'border-red-500 bg-red-50' 
                      : isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Video size={24} className={`mx-auto mb-2 ${quickSavType === 'video' ? 'text-red-600' : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${quickSavType === 'video' ? 'text-red-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Video</div>
                </button>

                <button
                  onClick={() => setQuickSavType('file')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quickSavType === 'file' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText size={24} className={`mx-auto mb-2 ${quickSavType === 'file' ? 'text-emerald-600' : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${quickSavType === 'file' ? 'text-emerald-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Document</div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              {/* URL field for links */}
              {quickSavType === 'link' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              )}

              {/* File upload simulation for other types */}
              {quickSavType !== 'link' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    File
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <Upload size={24} className={`mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {quickSavType === 'image' && 'Drop an image here or click to browse'}
                      {quickSavType === 'video' && 'Drop a video here or click to browse'}
                      {quickSavType === 'file' && 'Drop a document here or click to browse'}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any notes or context..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickSavModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save to QuickSav
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Home view with logo, usage modules, and QuickSavs queue
  const HomeView = () => (
    <div className="p-6">
      {/* Official Logo and Tagline */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className={`text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>QuickSav</div>
        </div>
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Organized Media System</p>
      </div>

      {/* Usage Modules */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Spaces Module */}
        <div className="bg-blue-600 border border-blue-200 rounded-xl p-6 relative overflow-hidden" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.8), rgba(30, 64, 175, 0.8)),
            url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(0px)'
        }}>
          <div className="absolute inset-0 bg-blue-600/70 backdrop-blur-sm"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Layers size={24} className="text-white" />
              <h3 className="text-2xl font-bold text-white">Total Spaces</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-3">2 <span className="text-lg text-blue-200">used</span></div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-blue-100 mb-1">
                <span>Progress</span>
                <span>2/4 (50%)</span>
              </div>
              <div className="w-full bg-blue-800/40 rounded-full h-2">
                <div className="bg-gradient-to-r from-white to-blue-100 h-2 rounded-full transition-all duration-300" style={{width: '50%'}}></div>
              </div>
            </div>

            {/* Tier Info */}
            <div className="flex items-center justify-center">
              <div className="text-xs">
                <span className="text-blue-100 font-medium">Current Tier: </span>
                <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-medium">Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stacks Module */}
        <div className="bg-emerald-600 border border-emerald-200 rounded-xl p-6 relative overflow-hidden" style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.8), rgba(4, 120, 87, 0.8)),
            url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="absolute inset-0 bg-emerald-600/70 backdrop-blur-sm"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Box size={24} className="text-white" />
              <h3 className="text-2xl font-bold text-white">Total Stacks</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-3">5 <span className="text-lg text-emerald-200">used</span></div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-emerald-100 mb-1">
                <span>Progress</span>
                <span>5/20 (25%)</span>
              </div>
              <div className="w-full bg-emerald-800/40 rounded-full h-2">
                <div className="bg-gradient-to-r from-white to-emerald-100 h-2 rounded-full transition-all duration-300" style={{width: '25%'}}></div>
              </div>
            </div>

            {/* Tier Info */}
            <div className="flex items-center justify-center">
              <div className="text-xs">
                <span className="text-emerald-100 font-medium">Current Tier: </span>
                <span className="bg-white text-emerald-600 px-2 py-1 rounded-full text-xs font-medium">Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* SavIts Module */}
        <div className="bg-purple-600 border border-purple-200 rounded-xl p-6 relative overflow-hidden" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.8), rgba(109, 40, 217, 0.8)),
            url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="absolute inset-0 bg-purple-600/70 backdrop-blur-sm"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <File size={24} className="text-white" />
              <h3 className="text-2xl font-bold text-white">Total SavIts</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-3">12 <span className="text-lg text-purple-200">used</span></div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-purple-100 mb-1">
                <span>Progress</span>
                <span>12/50 (24%)</span>
              </div>
              <div className="w-full bg-purple-800/40 rounded-full h-2">
                <div className="bg-gradient-to-r from-white to-purple-100 h-2 rounded-full transition-all duration-300" style={{width: '24%'}}></div>
              </div>
            </div>

            {/* Tier Info */}
            <div className="flex items-center justify-center">
              <div className="text-xs">
                <span className="text-purple-100 font-medium">Current Tier: </span>
                <span className="bg-white text-purple-600 px-2 py-1 rounded-full text-xs font-medium">Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border-2 rounded-xl p-6 mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Ready to Level Up?</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Unlock more Spaces, Stacks, and SavIts with QuickSav Pro</p>
          </div>
          <div>
            <button 
              onClick={() => setShowPricingModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>

      {/* QuickSavs Section */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
        {/* QuickSavs Header with Stats */}
        <div className="bg-red-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock size={28} className="text-white" />
              <h2 className="text-3xl font-bold text-white">QuickSavs</h2>
            </div>
            <div className="text-xs">
              <span className="text-red-100 font-medium">Current Tier: </span>
              <span className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-medium">Free</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-white mb-2">{quickSavs.length} <span className="text-lg text-red-200">total</span></div>
              <div className="text-sm text-red-100">Unorganized items</div>
            </div>
            <div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-red-100 mb-1">
                  <span>Storage Used</span>
                  <span>{quickSavs.length}/100 (10%)</span>
                </div>
                <div className="w-full bg-red-800/40 rounded-full h-2">
                  <div className="bg-gradient-to-r from-white to-red-100 h-2 rounded-full transition-all duration-300" style={{width: '10%'}}></div>
                </div>
              </div>
              <button className="text-xs bg-white hover:bg-red-50 text-red-600 px-3 py-1 rounded-full transition-colors font-medium">
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search size={20} className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search QuickSavs..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3">
            <select className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option value="">All Types</option>
              <option value="link">Links</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="file">Documents</option>
            </select>
            
            <select className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="older">Older</option>
            </select>
            
            <select className={`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option value="">Sort by Date</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">A-Z</option>
            </select>
            
            <button className={`px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* QuickSavs List */}
        <div className="space-y-3">
          {quickSavs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(quickSav => {
            const fileTypeInfo = getFileTypeIcon(quickSav);
            
            return (
              <div key={quickSav.id} className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {typeof fileTypeInfo.icon === 'string' ? (
                      <div className={`w-8 h-8 ${fileTypeInfo.bgColor} rounded flex items-center justify-center`}>
                        <span className={`${fileTypeInfo.color} text-xs font-bold`}>{fileTypeInfo.icon}</span>
                      </div>
                    ) : (
                      <fileTypeInfo.icon size={24} className={`${fileTypeInfo.color}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{quickSav.title}</h3>
                    <div className={`flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{fileTypeInfo.label}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(quickSav.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setOrganizingQuickSav(quickSav);
                    setShowOrganizeModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Organize
                </button>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className={`flex items-center justify-between mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, quickSavs.length)} of {quickSavs.length} QuickSavs
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Show:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`border rounded px-2 py-1 text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: Math.ceil(quickSavs.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : isDarkMode 
                      ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(quickSavs.length / itemsPerPage), prev + 1))}
              disabled={currentPage === Math.ceil(quickSavs.length / itemsPerPage)}
              className={`px-3 py-1 border rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Spaces view
  const SpacesView = () => {
    const [iconPickerOpen, setIconPickerOpen] = useState(null);

    const updateSpaceName = (spaceId, newName) => {
      setSpaces(prev => prev.map(space => 
        space.id === spaceId ? { ...space, name: newName } : space
      ));
    };

    const updateSpaceIcon = (spaceId, newIcon) => {
      setSpaces(prev => prev.map(space => 
        space.id === spaceId ? { ...space, icon: newIcon } : space
      ));
      setIconPickerOpen(null);
    };

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Spaces</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={20} />
            New Space
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map(space => {
            const stackCount = stacks.filter(s => s.spaceId === space.id).length;
            
            return (
              <div 
                key={space.id} 
                className={`group border rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300 ${
                  isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                }`}
                onClick={() => {
                  setCurrentView('stacks');
                  setSelectedSpace(space.id);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <IconPicker
                    selectedIcon={space.icon}
                    onSelect={(icon) => updateSpaceIcon(space.id, icon)}
                    isOpen={iconPickerOpen === space.id}
                    onToggle={() => setIconPickerOpen(iconPickerOpen === space.id ? null : space.id)}
                  />
                  <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Folder size={16} />
                    {stackCount}
                  </div>
                </div>
                
                <EditableName
                  value={space.name}
                  onSave={(newName) => updateSpaceName(space.id, newName)}
                  className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                />
                
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{space.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Calendar size={14} />
                    {formatDistanceToNow(space.createdAt)}
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Sidebar navigation
  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
      {/* Logo */}
      <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>QuickSav</div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className={`lg:hidden p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <X size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
        </button>
      </div>
      
      {/* QuickSav NOW Button */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button 
          onClick={() => setShowQuickSavModal(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-all hover:scale-105"
        >
          QuickSav NOW
        </button>
      </div>
      
      {/* Main Navigation */}
      <nav className="p-4 flex-1">
        <div className="space-y-2">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'home' 
                ? 'bg-blue-100 text-blue-700' 
                : isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setCurrentView('spaces')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'spaces' 
                ? 'bg-blue-100 text-blue-700' 
                : isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layers size={20} />
            <span>Spaces</span>
          </button>
          
          <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
          }`}>
            <Share2 size={20} />
            <span>SendIt</span>
          </button>
        </div>
        
        {/* Account Section */}
        <div className="mt-8">
          <div className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account</div>
          <div className="space-y-2">
            <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}>
              <User size={20} />
              <span>Profile</span>
            </button>
            <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}>
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}>
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Dark Mode Toggle */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Sun size={16} />
            <span>Light</span>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Moon size={16} />
            <span>Dark</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'spaces':
        return <SpacesView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar />
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className={`lg:hidden flex items-center justify-between p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Menu size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          <div className="flex items-center gap-3">
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>QuickSav</div>
          </div>
          <div className="w-10" />
        </div>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>

      {/* Pricing Modal */}
      <PricingModal />

      {/* Organize Modal */}
      <OrganizeModal />

      {/* QuickSav NOW Modal */}
      <QuickSavModal />
    </div>
  );
}

export default App;
