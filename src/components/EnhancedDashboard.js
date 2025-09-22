import React, { useState } from 'react';

const EnhancedDashboard = ({ user, isDarkMode, quickSavs, onQuickSav }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterTime, setFilterTime] = useState('All Time');
  const [sortBy, setSortBy] = useState('Sort by Date');

  // User tier limits (Free tier)
  const tierLimits = {
    spaces: 4,
    stacks: 20,
    savits: 50,
    storage: 5 // GB
  };

  // Current usage (mock data for now)
  const currentUsage = {
    spaces: 2,
    stacks: 5,
    savits: quickSavs.length,
    storage: 0.1 // GB
  };

  // Calculate progress percentages
  const progress = {
    spaces: (currentUsage.spaces / tierLimits.spaces) * 100,
    stacks: (currentUsage.stacks / tierLimits.stacks) * 100,
    savits: (currentUsage.savits / tierLimits.savits) * 100,
    storage: (currentUsage.storage / tierLimits.storage) * 100
  };

  // File type icons
  const getFileIcon = (type) => {
    switch (type) {
      case 'link': return '🌐';
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'voice': return '🎵';
      case 'file': return '📄';
      default: return '📄';
    }
  };

  // Filter quicksavs
  const filteredQuickSavs = quickSavs.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All Types' || item.content_type === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            QuickSav
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Organized Media System
          </p>
        </div>
        <button
          onClick={onQuickSav}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          QuickSav NOW
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Spaces */}
        <div className="bg-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-lg">📁</span>
            </div>
            <div>
              <h3 className="font-semibold">Total Spaces</h3>
              <div className="text-2xl font-bold">{currentUsage.spaces} <span className="text-sm font-normal opacity-75">used</span></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm opacity-75 mb-1">
              <span>Progress</span>
              <span>{currentUsage.spaces}/{tierLimits.spaces} ({Math.round(progress.spaces)}%)</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(progress.spaces, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs opacity-75">Current Tier:</span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">Free</span>
          </div>
        </div>

        {/* Total Stacks */}
        <div className="bg-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-lg">📚</span>
            </div>
            <div>
              <h3 className="font-semibold">Total Stacks</h3>
              <div className="text-2xl font-bold">{currentUsage.stacks} <span className="text-sm font-normal opacity-75">used</span></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm opacity-75 mb-1">
              <span>Progress</span>
              <span>{currentUsage.stacks}/{tierLimits.stacks} ({Math.round(progress.stacks)}%)</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(progress.stacks, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs opacity-75">Current Tier:</span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">Free</span>
          </div>
        </div>

        {/* Total SavIts */}
        <div className="bg-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-lg">💾</span>
            </div>
            <div>
              <h3 className="font-semibold">Total SavIts</h3>
              <div className="text-2xl font-bold">{currentUsage.savits} <span className="text-sm font-normal opacity-75">used</span></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm opacity-75 mb-1">
              <span>Progress</span>
              <span>{currentUsage.savits}/{tierLimits.savits} ({Math.round(progress.savits)}%)</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(progress.savits, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs opacity-75">Current Tier:</span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">Free</span>
          </div>
        </div>
      </div>

      {/* Upgrade Prompt */}
      <div className={`rounded-xl p-4 mb-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Level Up?
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Unlock more Spaces, Stacks, and SavIts with QuickSav Pro
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            View Plans
          </button>
        </div>
      </div>

      {/* QuickSavs Section */}
      <div className="bg-red-600 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between text-white mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">QuickSavs</h2>
              <div className="text-sm opacity-75">{filteredQuickSavs.length} total</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-75 mb-1">Current Tier: <span className="bg-white bg-opacity-20 px-2 py-1 rounded">Free</span></div>
            <div className="text-xs opacity-75">Storage Used</div>
            <div className="text-sm">
              {currentUsage.savits}/100 (100%)
              <button className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs ml-2 hover:bg-opacity-30 transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </div>
        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-white'} opacity-90`}>
          Unorganized items
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search QuickSavs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option>All Types</option>
            <option>Link</option>
            <option>Text</option>
            <option>Image</option>
            <option>Video</option>
            <option>Voice</option>
            <option>File</option>
          </select>
          
          <select 
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option>All Time</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option>Sort by Date</option>
            <option>Sort by Name</option>
            <option>Sort by Type</option>
          </select>
          
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterType('All Types');
              setFilterTime('All Time');
              setSortBy('Sort by Date');
            }}
            className={`px-4 py-3 border rounded-lg transition-colors ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* QuickSavs List */}
      <div className="space-y-3">
        {filteredQuickSavs.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {searchTerm || filterType !== 'All Types' ? 'No matching QuickSavs' : 'No QuickSavs yet'}
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              {searchTerm || filterType !== 'All Types' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start saving content with the QuickSav NOW button'
              }
            </p>
            {(!searchTerm && filterType === 'All Types') && (
              <button
                onClick={onQuickSav}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Create Your First QuickSav
              </button>
            )}
          </div>
        ) : (
          filteredQuickSavs.map((quickSav) => (
            <div
              key={quickSav.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* File Type Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">{getFileIcon(quickSav.content_type)}</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {quickSav.title}
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <span className={`capitalize ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {quickSav.content_type}
                  </span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {new Date(quickSav.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex-shrink-0">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Organize
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;
