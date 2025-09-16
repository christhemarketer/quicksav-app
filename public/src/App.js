import React, { useState } from 'react';
import { 
  Home, 
  Layers, 
  Clock, 
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
  Gamepad2,
  ShoppingCart,
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
  MoveRight
} from 'lucide-react';

// File type detection and icon mapping
const getFileTypeIcon = (savIt) => {
  const { type, url, filePath, title } = savIt;
  
  if (type === 'link' && url) {
    const domain = url.includes('facebook.com') ? 'facebook.com' : 
                   url.includes('tiktok.com') ? 'tiktok.com' :
                   url.includes('youtube.com') ? 'youtube.com' : 'other';
    
    if (domain === 'facebook.com') return { icon: '📘', color: 'text-blue-600', label: 'Facebook' };
    if (domain === 'tiktok.com') return { icon: '🎵', color: 'text-pink-600', label: 'TikTok' };
    if (domain === 'youtube.com') return { icon: '📺', color: 'text-red-600', label: 'YouTube' };
    return { icon: '🔗', color: 'text-gray-600', label: 'Link' };
  }
  
  if (title && title.includes('.pdf')) return { icon: '📄', color: 'text-red-600', label: 'PDF' };
  if (title && title.includes('.png')) return { icon: '🖼️', color: 'text-purple-600', label: 'Image' };
  if (title && title.includes('.mp4')) return { icon: '🎬', color: 'text-red-600', label: 'Video' };
  
  switch (type) {
    case 'image': return { icon: '🖼️', color: 'text-purple-600', label: 'Image' };
    case 'video': return { icon: '🎬', color: 'text-red-600', label: 'Video' };
    case 'link': return { icon: '🔗', color: 'text-gray-600', label: 'Link' };
    default: return { icon: '📄', color: 'text-gray-600', label: 'File' };
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
      icon: Code,
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
    }
  ]);

  // Home view with logo, usage modules, and QuickSavs queue
  const HomeView = () => (
    <div className="p-6">
      {/* Official Logo and Tagline */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <svg width="200" height="60" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 20 C20 20, 10 20, 10 30 L10 35 C10 45, 20 45, 30 45 L65 45 C75 45, 75 55, 75 55 C75 65, 65 65, 65 65 L30 65 C30 65, 30 75, 40 75 L70 75 C80 75, 90 75, 90 85 L90 90 C90 100, 80 100, 70 100 L20 100 C20 100, 20 90, 30 90 L65 90 C75 90, 75 80, 75 80 C75 70, 65 70, 65 70 L30 70 C20 70, 10 70, 10 60 L10 55 C10 45, 20 45, 20 45 L55 45 C65 45, 65 35, 65 35 C65 25, 55 25, 55 25 L20 25 C20 25, 20 20, 20 20 Z" fill="black"/>
            <ellipse cx="125" cy="60" rx="25" ry="35" fill="black"/>
            <ellipse cx="125" cy="60" rx="15" ry="25" fill="white"/>
            <rect x="140" y="45" width="15" height="50" fill="black"/>
            <path d="M180 45 L195 45 L210 85 L225 45 L240 45 L215 100 L205 100 L180 45 Z" fill="#4A90E2"/>
            <circle cx="265" cy="35" r="8" fill="black"/>
            <rect x="257" y="45" width="16" height="50" fill="black"/>
            <rect x="290" y="25" width="16" height="70" fill="black"/>
            <rect x="280" y="45" width="36" height="12" fill="black"/>
          </svg>
        </div>
        <p className="text-lg text-gray-600 font-medium">Organized Media System</p>
      </div>

      {/* Usage Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">2 of 4</div>
          <div className="text-gray-600 font-medium">Total Spaces</div>
          <div className="text-sm text-gray-500 mt-1">Free Tier Limit</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">5 of 20</div>
          <div className="text-gray-600 font-medium">Total Stacks</div>
          <div className="text-sm text-gray-500 mt-1">Free Tier Limit</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">12 of 50</div>
          <div className="text-gray-600 font-medium">Total SavIts</div>
          <div className="text-sm text-gray-500 mt-1">Free Tier Limit</div>
        </div>
      </div>

      {/* Recent QuickSavs Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent QuickSavs</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Camera size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Upload size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Link size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search QuickSavs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* QuickSavs List */}
        <div className="space-y-3">
          {quickSavs.map(quickSav => {
            const fileTypeInfo = getFileTypeIcon(quickSav);
            
            return (
              <div key={quickSav.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{fileTypeInfo.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{quickSav.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className={fileTypeInfo.color}>{fileTypeInfo.label}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(quickSav.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Organize
                </button>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 3 of 12 QuickSavs
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
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
          <h2 className="text-2xl font-bold text-gray-800">Your Spaces</h2>
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
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300"
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
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Folder size={16} />
                    {stackCount}
                  </div>
                </div>
                
                <EditableName
                  value={space.name}
                  onSave={(newName) => updateSpaceName(space.id, newName)}
                  className="text-lg font-semibold text-gray-800 mb-2"
                />
                
                <p className="text-sm text-gray-600 mb-4">{space.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
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
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">QS</span>
          </div>
          <span className="font-bold text-xl text-gray-800">QuickSav</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>
      
      <nav className="p-4">
        <div className="space-y-2">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setCurrentView('spaces')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'spaces' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layers size={20} />
            <span>Spaces</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Clock size={20} />
            <span>QuickSavs</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Search size={20} />
            <span>Search</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Share2 size={20} />
            <span>SendIt</span>
          </button>
        </div>
        
        <div className="mt-8">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Account</div>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <User size={20} />
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
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
    <div className="flex h-screen bg-gray-50">
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
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">QS</span>
            </div>
            <span className="font-bold text-xl text-gray-800">QuickSav</span>
          </div>
          <div className="w-10" />
        </div>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
