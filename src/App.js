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
  Clock
} from 'lucide-react';

// File type detection and icon mapping
const getFileTypeIcon = (savIt) => {
  const { type, url, title } = savIt;
  
  if (type === 'link' && url) {
    if (url.includes('facebook.com')) return { icon: '📘', color: 'text-blue-600', label: 'Facebook' };
    if (url.includes('tiktok.com')) return { icon: '🎵', color: 'text-pink-600', label: 'TikTok' };
    if (url.includes('youtube.com')) return { icon: '📺', color: 'text-red-600', label: 'YouTube' };
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuickSavModal, setShowQuickSavModal] = useState(false);
  const [quickSavType, setQuickSavType] = useState('link');

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

  // QuickSav NOW Modal
  const QuickSavModal = () => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
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
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">QuickSav NOW</h2>
              <button
                onClick={() => setShowQuickSavModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <p className="text-gray-600 mt-2">Quickly save any type of content to organize later</p>
          </div>

          <div className="p-6">
            {/* Content Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setQuickSavType('link')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quickSavType === 'link' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ExternalLink size={24} className={`mx-auto mb-2 ${quickSavType === 'link' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${quickSavType === 'link' ? 'text-blue-600' : 'text-gray-600'}`}>Link/URL</div>
                </button>
                
                <button
                  onClick={() => setQuickSavType('image')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quickSavType === 'image' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image size={24} className={`mx-auto mb-2 ${quickSavType === 'image' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${quickSavType === 'image' ? 'text-purple-600' : 'text-gray-600'}`}>Image</div>
                </button>

                <button
                  onClick={() => setQuickSavType('video')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quickSavType === 'video' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Video size={24} className={`mx-auto mb-2 ${quickSavType === 'video' ? 'text-red-600' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${quickSavType === 'video' ? 'text-red-600' : 'text-gray-600'}`}>Video</div>
                </button>

                <button
                  onClick={() => setQuickSavType('file')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quickSavType === 'file' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText size={24} className={`mx-auto mb-2 ${quickSavType === 'file' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${quickSavType === 'file' ? 'text-emerald-600' : 'text-gray-600'}`}>Document</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* URL field for links */}
              {quickSavType === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* File upload simulation for other types */}
              {quickSavType !== 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {quickSavType === 'image' && 'Drop an image here or click to browse'}
                      {quickSavType === 'video' && 'Drop a video here or click to browse'}
                      {quickSavType === 'file' && 'Drop a document here or click to browse'}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any notes or context..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickSavModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save to QuickSav
                </button>
              </div>
            </form>
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
          <img 
            src="/QuickSavLogoV1.png" 
            alt="QuickSav Logo" 
            className="h-16"
          />
        </div>
        <p className="text-lg text-gray-600 font-medium">Organized Media System</p>
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
              <Folder size={24} className="text-white" />
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
              <Archive size={24} className="text-white" />
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
      <div className="bg-white border-2 border-gray-300 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Level Up?</h3>
            <p className="text-gray-600 text-sm">Unlock more Spaces, Stacks, and SavIts with QuickSav Pro</p>
          </div>
          <div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              View Plans
            </button>
          </div>
        </div>
      </div>

      {/* QuickSavs Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {/* QuickSavs Header with Stats */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-6 relative overflow-hidden" style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='30' cy='10' r='2'/%3E%3Ccircle cx='10' cy='30' r='2'/%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E"),
            linear-gradient(135deg, #F59E0B 0%, #DC2626 100%)
          `
        }}>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock size={28} className="text-white" />
                <h2 className="text-3xl font-bold text-white">QuickSavs</h2>
              </div>
              <div className="text-xs">
                <span className="text-orange-100 font-medium">Current Tier: </span>
                <span className="bg-white text-orange-600 px-2 py-1 rounded-full text-xs font-medium">Free</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-white mb-2">{quickSavs.length} <span className="text-lg text-orange-200">total</span></div>
                <div className="text-sm text-orange-100">Unorganized items</div>
              </div>
              <div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-orange-100 mb-1">
                    <span>Storage Used</span>
                    <span>{quickSavs.length}/100 (10%)</span>
                  </div>
                  <div className="w-full bg-orange-800/40 rounded-full h-2">
                    <div className="bg-gradient-to-r from-white to-orange-100 h-2 rounded-full transition-all duration-300" style={{width: '10%'}}></div>
                  </div>
                </div>
                <button className="text-xs bg-white hover:bg-orange-50 text-orange-600 px-3 py-1 rounded-full transition-colors font-medium">
                  Upgrade
                </button>
              </div>
            </div>
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
          {quickSavs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(quickSav => {
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
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, quickSavs.length)} of {quickSavs.length} QuickSavs
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
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
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(quickSavs.length / itemsPerPage), prev + 1))}
              disabled={currentPage === Math.ceil(quickSavs.length / itemsPerPage)}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img 
            src="/QuickSavLogoV1.png" 
            alt="QuickSav" 
            className="h-8 object-contain"
          />
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>
      
      {/* QuickSav NOW Button */}
      <div className="p-4 border-b border-gray-200">
        <button 
          onClick={() => setShowQuickSavModal(true)}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          QuickSav NOW
        </button>
      </div>
      
      {/* Main Navigation */}
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
            <Share2 size={20} />
            <span>SendIt</span>
          </button>
        </div>
        
        {/* Account Section */}
        <div className="mt-8">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Account</div>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <img 
                src="/CtM-Head.jpg" 
                alt="Profile" 
                className="w-5 h-5 rounded-full object-cover"
              />
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
            <img 
              src="/QuickSavLogoV1.png" 
              alt="QuickSav" 
              className="h-8 object-contain"
            />
          </div>
          <div className="w-10" />
        </div>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>

      {/* QuickSav NOW Modal */}
      <QuickSavModal />
    </div>
  );
}

export default App;
