// QuickSav Core Utilities & Helpers
// Filename: utils.js
// This component contains all utility functions, file detection, and helper methods

import { createClient } from '@supabase/supabase-js';
import { 
  Globe,
  FileText,
  FileImage,
  PlayCircle,
  File,
  Code,
  Archive,
  Music,
  Video,
  Image,
  Link,
  Briefcase,
  Heart,
  BookOpen,
  Settings,
  User
} from 'lucide-react';

// Supabase client setup
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Professional file type detection with social media platform recognition
export const getFileTypeIcon = (savIt) => {
  const { type, url, title } = savIt;
  
  // Social media and link detection with professional branded icons
  if (type === 'link' && url) {
    if (url.includes('facebook.com')) {
      return { 
        icon: <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">f</div>, 
        color: 'text-blue-600', 
        label: 'Facebook',
        bgColor: 'bg-blue-50',
        platform: 'facebook'
      };
    }
    if (url.includes('tiktok.com')) {
      return { 
        icon: <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-white text-xs font-bold">TT</div>, 
        color: 'text-black', 
        label: 'TikTok',
        bgColor: 'bg-gray-50',
        platform: 'tiktok'
      };
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return { 
        icon: <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">▶</div>, 
        color: 'text-red-600', 
        label: 'YouTube',
        bgColor: 'bg-red-50',
        platform: 'youtube'
      };
    }
    if (url.includes('instagram.com')) {
      return { 
        icon: <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs font-bold">IG</div>, 
        color: 'text-purple-600', 
        label: 'Instagram',
        bgColor: 'bg-purple-50',
        platform: 'instagram'
      };
    }
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return { 
        icon: <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-white text-xs font-bold">X</div>, 
        color: 'text-black', 
        label: 'Twitter/X',
        bgColor: 'bg-gray-50',
        platform: 'twitter'
      };
    }
    if (url.includes('linkedin.com')) {
      return { 
        icon: <div className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">in</div>, 
        color: 'text-blue-700', 
        label: 'LinkedIn',
        bgColor: 'bg-blue-50',
        platform: 'linkedin'
      };
    }
    if (url.includes('github.com')) {
      return { 
        icon: <div className="w-5 h-5 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">GH</div>, 
        color: 'text-gray-800', 
        label: 'GitHub',
        bgColor: 'bg-gray-50',
        platform: 'github'
      };
    }
    if (url.includes('reddit.com')) {
      return { 
        icon: <div className="w-5 h-5 bg-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">R</div>, 
        color: 'text-orange-600', 
        label: 'Reddit',
        bgColor: 'bg-orange-50',
        platform: 'reddit'
      };
    }
    if (url.includes('pinterest.com')) {
      return { 
        icon: <div className="w-5 h-5 bg-red-700 rounded flex items-center justify-center text-white text-xs font-bold">P</div>, 
        color: 'text-red-700', 
        label: 'Pinterest',
        bgColor: 'bg-red-50',
        platform: 'pinterest'
      };
    }
    if (url.includes('discord.com') || url.includes('discord.gg')) {
      return { 
        icon: <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">D</div>, 
        color: 'text-indigo-600', 
        label: 'Discord',
        bgColor: 'bg-indigo-50',
        platform: 'discord'
      };
    }
    if (url.includes('slack.com')) {
      return { 
        icon: <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">S</div>, 
        color: 'text-purple-600', 
        label: 'Slack',
        bgColor: 'bg-purple-50',
        platform: 'slack'
      };
    }
    // Generic website link
    return { 
      icon: <Link className="w-5 h-5" />, 
      color: 'text-blue-600', 
      label: 'Website',
      bgColor: 'bg-blue-50',
      platform: 'website'
    };
  }
  
  // File extension detection
  if (title) {
    const extension = title.toLowerCase();
    
    // Document files
    if (extension.includes('.pdf')) {
      return { 
        icon: <FileText className="w-5 h-5" />, 
        color: 'text-red-600', 
        label: 'PDF Document',
        bgColor: 'bg-red-50',
        fileType: 'document'
      };
    }
    if (extension.includes('.doc') || extension.includes('.docx')) {
      return { 
        icon: <FileText className="w-5 h-5" />, 
        color: 'text-blue-600', 
        label: 'Word Document',
        bgColor: 'bg-blue-50',
        fileType: 'document'
      };
    }
    if (extension.includes('.xls') || extension.includes('.xlsx')) {
      return { 
        icon: <FileText className="w-5 h-5" />, 
        color: 'text-green-600', 
        label: 'Excel Spreadsheet',
        bgColor: 'bg-green-50',
        fileType: 'document'
      };
    }
    if (extension.includes('.ppt') || extension.includes('.pptx')) {
      return { 
        icon: <FileText className="w-5 h-5" />, 
        color: 'text-orange-600', 
        label: 'PowerPoint',
        bgColor: 'bg-orange-50',
        fileType: 'document'
      };
    }
    
    // Image files
    if (extension.includes('.jpg') || extension.includes('.jpeg') || 
        extension.includes('.png') || extension.includes('.gif') ||
        extension.includes('.webp') || extension.includes('.svg')) {
      return { 
        icon: <FileImage className="w-5 h-5" />, 
        color: 'text-purple-600', 
        label: 'Image File',
        bgColor: 'bg-purple-50',
        fileType: 'image'
      };
    }
    
    // Video files
    if (extension.includes('.mp4') || extension.includes('.mov') ||
        extension.includes('.avi') || extension.includes('.mkv') ||
        extension.includes('.webm') || extension.includes('.flv')) {
      return { 
        icon: <PlayCircle className="w-5 h-5" />, 
        color: 'text-red-600', 
        label: 'Video File',
        bgColor: 'bg-red-50',
        fileType: 'video'
      };
    }
    
    // Audio files
    if (extension.includes('.mp3') || extension.includes('.wav') ||
        extension.includes('.flac') || extension.includes('.m4a') ||
        extension.includes('.ogg')) {
      return { 
        icon: <Music className="w-5 h-5" />, 
        color: 'text-green-600', 
        label: 'Audio File',
        bgColor: 'bg-green-50',
        fileType: 'audio'
      };
    }
    
    // Code files
    if (extension.includes('.js') || extension.includes('.jsx') ||
        extension.includes('.ts') || extension.includes('.tsx') ||
        extension.includes('.html') || extension.includes('.css') ||
        extension.includes('.py') || extension.includes('.java') ||
        extension.includes('.cpp') || extension.includes('.c') ||
        extension.includes('.php') || extension.includes('.rb') ||
        extension.includes('.go') || extension.includes('.rs')) {
      return { 
        icon: <Code className="w-5 h-5" />, 
        color: 'text-indigo-600', 
        label: 'Code File',
        bgColor: 'bg-indigo-50',
        fileType: 'code'
      };
    }
    
    // Archive files
    if (extension.includes('.zip') || extension.includes('.rar') ||
        extension.includes('.7z') || extension.includes('.tar') ||
        extension.includes('.gz')) {
      return { 
        icon: <Archive className="w-5 h-5" />, 
        color: 'text-gray-600', 
        label: 'Archive File',
        bgColor: 'bg-gray-50',
        fileType: 'archive'
      };
    }
  }
  
  // Fallback based on type
  switch (type) {
    case 'image': 
      return { 
        icon: <FileImage className="w-5 h-5" />, 
        color: 'text-purple-600', 
        label: 'Image',
        bgColor: 'bg-purple-50',
        fileType: 'image'
      };
    case 'video': 
      return { 
        icon: <PlayCircle className="w-5 h-5" />, 
        color: 'text-red-600', 
        label: 'Video',
        bgColor: 'bg-red-50',
        fileType: 'video'
      };
    case 'link': 
      return { 
        icon: <Link className="w-5 h-5" />, 
        color: 'text-blue-600', 
        label: 'Link',
        bgColor: 'bg-blue-50',
        platform: 'website'
      };
    case 'document':
      return { 
        icon: <FileText className="w-5 h-5" />, 
        color: 'text-gray-600', 
        label: 'Document',
        bgColor: 'bg-gray-50',
        fileType: 'document'
      };
    default: 
      return { 
        icon: <File className="w-5 h-5" />, 
        color: 'text-gray-600', 
        label: 'File',
        bgColor: 'bg-gray-50',
        fileType: 'unknown'
      };
  }
};

// Date and time helper functions
export const formatDistanceToNow = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return past.toLocaleDateString();
};

export const formatFullDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Available icons for Spaces and Stacks organization
export const iconOptions = [
  { icon: Briefcase, label: 'Work', value: 'work' },
  { icon: Heart, label: 'Personal', value: 'personal' },
  { icon: BookOpen, label: 'Learning', value: 'learning' },
  { icon: Code, label: 'Projects', value: 'projects' },
  { icon: Music, label: 'Entertainment', value: 'entertainment' },
  { icon: Settings, label: 'Tools', value: 'tools' },
  { icon: User, label: 'Profile', value: 'profile' },
  { icon: Globe, label: 'Research', value: 'research' },
  { icon: Archive, label: 'Archive', value: 'archive' }
];

// URL validation and metadata extraction
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const extractDomain = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Search and filter helpers
export const searchItems = (items, searchTerm) => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    item.title?.toLowerCase().includes(term) ||
    item.name?.toLowerCase().includes(term) ||
    item.url?.toLowerCase().includes(term) ||
    item.tags?.some(tag => tag.toLowerCase().includes(term))
  );
};

export const sortItems = (items, sortBy = 'date', order = 'desc') => {
  return [...items].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.timestamp || a.addedDate || a.lastModified);
        bValue = new Date(b.timestamp || b.addedDate || b.lastModified);
        break;
      case 'name':
        aValue = (a.title || a.name || '').toLowerCase();
        bValue = (b.title || b.name || '').toLowerCase();
        break;
      case 'type':
        aValue = a.type || '';
        bValue = b.type || '';
        break;
      default:
        return 0;
    }
    
    if (order === 'desc') {
      return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
    } else {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  });
};

// Constants for the application
export const SPACE_TYPES = {
  WORK: 'work',
  PERSONAL: 'personal',
  LEARNING: 'learning',
  PROJECTS: 'projects',
  ENTERTAINMENT: 'entertainment'
};

export const CONTENT_TYPES = {
  LINK: 'link',
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  FILE: 'file'
};

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

// QuickSav brand colors (using blue from logo)
export const COLORS = {
  PRIMARY: '#4A90E2',      // Blue from logo
  PRIMARY_LIGHT: '#E3F2FD',
  PRIMARY_DARK: '#1565C0',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  GRAY: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  }
};
