import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import QuickSavForm from './components/QuickSavForm';
import EnhancedDashboard from './components/EnhancedDashboard';

// Supabase setup
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // UI state
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showQuickSavModal, setShowQuickSavModal] = useState(false);
  
  // QuickSav state
  const [quickSavs, setQuickSavs] = useState([]);
  const [filteredQuickSavs, setFilteredQuickSavs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isLoadingQuickSavs, setIsLoadingQuickSavs] = useState(false);
  const [categories, setCategories] = useState(['Work', 'Personal', 'Ideas', 'Resources', 'Archive']);
  const [allTags, setAllTags] = useState([]);
  const [editingQuickSav, setEditingQuickSav] = useState(null);

  // Authentication effect
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchQuickSavs(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchQuickSavs(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Apply filters and search whenever they change
  useEffect(() => {
    let filtered = [...quickSavs];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(qs => 
        qs.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qs.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qs.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(qs => qs.category === selectedCategory);
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(qs => 
        selectedTags.every(tag => qs.tags?.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'modified':
          return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
        default:
          return 0;
      }
    });

    setFilteredQuickSavs(filtered);
  }, [quickSavs, searchQuery, selectedCategory, selectedTags, sortBy]);

  // Extract all unique tags from quickSavs
  useEffect(() => {
    const tags = new Set();
    quickSavs.forEach(qs => {
      if (qs.tags && Array.isArray(qs.tags)) {
        qs.tags.forEach(tag => tags.add(tag));
      }
    });
    setAllTags(Array.from(tags));
  }, [quickSavs]);

  // Auth functions
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    setQuickSavs([]);
    setFilteredQuickSavs([]);
  };

  // QuickSav CRUD Operations
  const fetchQuickSavs = async (userId) => {
    setIsLoadingQuickSavs(true);
    try {
      const { data, error } = await supabase
        .from('quicksavs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If table doesn't exist or is empty, use local data
      setQuickSavs(data || []);
    } catch (error) {
      console.error('Error fetching QuickSavs:', error);
      // Fallback to local storage if database fails
      const localQuickSavs = localStorage.getItem(`quicksavs_${userId}`);
      if (localQuickSavs) {
        setQuickSavs(JSON.parse(localQuickSavs));
      }
    } finally {
      setIsLoadingQuickSavs(false);
    }
  };

  const handleSaveQuickSav = async (quickSavData, file, audioBlob) => {
    try {
      let fileUrl = null;
      let audioUrl = null;

      // Upload file if present
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from('quicksav-files')
          .upload(fileName, file);
        
        if (!fileError && fileData) {
          fileUrl = fileData.path;
        }
      }

      // Upload audio if present
      if (audioBlob) {
        const audioFileName = `${user.id}/audio_${Date.now()}.webm`;
        const { data: audioData, error: audioError } = await supabase.storage
          .from('quicksav-audio')
          .upload(audioFileName, audioBlob);
        
        if (!audioError && audioData) {
          audioUrl = audioData.path;
        }
      }

      const newQuickSav = {
        ...quickSavData,
        user_id: user.id,
        file_url: fileUrl,
        audio_url: audioUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to save to Supabase
      const { data, error } = await supabase
        .from('quicksavs')
        .insert([newQuickSav])
        .select()
        .single();

      if (error) {
        console.error('Error saving to database:', error);
        // Fallback to local storage
        newQuickSav.id = Date.now();
        const updatedQuickSavs = [newQuickSav, ...quickSavs];
        setQuickSavs(updatedQuickSavs);
        localStorage.setItem(`quicksavs_${user.id}`, JSON.stringify(updatedQuickSavs));
      } else {
        setQuickSavs(prev => [data, ...prev]);
      }

      setShowQuickSavModal(false);
      setEditingQuickSav(null);
    } catch (error) {
      console.error('Error saving QuickSav:', error);
      alert('Error saving QuickSav. Please try again.');
    }
  };

  const handleUpdateQuickSav = async (id, updates) => {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('quicksavs')
        .update(updatedData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating:', error);
        // Fallback to local update
        setQuickSavs(prev => prev.map(qs => 
          qs.id === id ? { ...qs, ...updatedData } : qs
        ));
      } else {
        setQuickSavs(prev => prev.map(qs => 
          qs.id === id ? data : qs
        ));
      }

      setEditingQuickSav(null);
    } catch (error) {
      console.error('Error updating QuickSav:', error);
    }
  };

  const handleDeleteQuickSav = async (id) => {
    if (!window.confirm('Are you sure you want to delete this QuickSav?')) return;

    try {
      const { error } = await supabase
        .from('quicksavs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting:', error);
      }
      
      // Remove from local state regardless
      setQuickSavs(prev => prev.filter(qs => qs.id !== id));
      
      // Update local storage
      const updatedQuickSavs = quickSavs.filter(qs => qs.id !== id);
      localStorage.setItem(`quicksavs_${user.id}`, JSON.stringify(updatedQuickSavs));
    } catch (error) {
      console.error('Error deleting QuickSav:', error);
    }
  };

  const handleBulkDelete = async (ids) => {
    if (!window.confirm(`Delete ${ids.length} QuickSavs?`)) return;

    try {
      const { error } = await supabase
        .from('quicksavs')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error bulk deleting:', error);
      }

      setQuickSavs(prev => prev.filter(qs => !ids.includes(qs.id)));
    } catch (error) {
      console.error('Error bulk deleting:', error);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredQuickSavs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quicksavs_export_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          // Add user_id to each imported item
          const dataWithUserId = importedData.map(item => ({
            ...item,
            user_id: user.id,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          const { data, error } = await supabase
            .from('quicksavs')
            .insert(dataWithUserId)
            .select();

          if (error) {
            console.error('Error importing:', error);
            alert('Error importing data. Some items may not have been imported.');
          } else {
            setQuickSavs(prev => [...data, ...prev]);
            alert(`Successfully imported ${data.length} QuickSavs!`);
          }
        }
      } catch (error) {
        console.error('Error parsing import file:', error);
        alert('Invalid file format. Please select a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">QuickSav</h1>
            <p className="text-gray-600">Save everything, organize anything</p>
          </div>
          
          <LoginForm onSignIn={signIn} onSignUp={signUp} />
        </div>
      </div>
    );
  }

  // Main app interface
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onSignOut={signOut}
          onQuickSav={() => setShowQuickSavModal(true)}
          user={user}
          quickSavsCount={quickSavs.length}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {currentView === 'dashboard' && (
            <div className="p-6">
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  {/* Search */}
                  <div className="flex-1 min-w-[300px]">
                    <input
                      type="text"
                      placeholder="Search QuickSavs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">By Title</option>
                    <option value="modified">Recently Modified</option>
                  </select>

                  {/* Export/Import */}
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Export
                  </button>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Tags Filter */}
                {allTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Tags:</span>
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTags(prev => 
                            prev.includes(tag) 
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    {selectedTags.length > 0 && (
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Results Summary */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredQuickSavs.length} of {quickSavs.length} QuickSavs
              </div>

              {/* QuickSavs Grid */}
              {isLoadingQuickSavs ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredQuickSavs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    {searchQuery || selectedCategory !== 'all' || selectedTags.length > 0
                      ? 'No QuickSavs found matching your filters.'
                      : 'No QuickSavs yet. Click "QuickSav NOW" to create your first one!'}
                  </p>
                  {(searchQuery || selectedCategory !== 'all' || selectedTags.length > 0) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedTags([]);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredQuickSavs.map((quickSav) => (
                    <div key={quickSav.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 flex-1">
                          {quickSav.title || 'Untitled'}
                        </h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingQuickSav(quickSav)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteQuickSav(quickSav.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {quickSav.content && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                          {quickSav.content}
                        </p>
                      )}
                      
                      {quickSav.category && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2 mr-2">
                          {quickSav.category}
                        </span>
                      )}
                      
                      {quickSav.tags && quickSav.tags.map((tag, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-2 mr-1">
                          {tag}
                        </span>
                      ))}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(quickSav.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {currentView === 'spaces' && <div className="p-6">Spaces View Coming Soon</div>}
          {currentView === 'sendit' && <div className="p-6">SendIt View Coming Soon</div>}
          {currentView === 'profile' && <div className="p-6">Profile View Coming Soon</div>}
          {currentView === 'settings' && <div className="p-6">Settings View Coming Soon</div>}
        </main>
      </div>

      {/* QuickSav Modal */}
      <QuickSavForm 
        isOpen={showQuickSavModal || editingQuickSav !== null}
        onClose={() => {
          setShowQuickSavModal(false);
          setEditingQuickSav(null);
        }}
        onSave={editingQuickSav 
          ? (data) => handleUpdateQuickSav(editingQuickSav.id, data)
          : handleSaveQuickSav}
        isDarkMode={isDarkMode}
        initialData={editingQuickSav}
        categories={categories}
      />
    </div>
  );
}

// Simple login form component
const LoginForm = ({ onSignIn, onSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await onSignUp(email, password);
        alert('Check your email for confirmation link!');
      } else {
        await onSignIn(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
      >
        {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
      </button>

      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full text-blue-600 hover:underline"
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
    </form>
  );
};

// Updated Sidebar component to match the design
const Sidebar = ({ currentView, setCurrentView, isDarkMode, setIsDarkMode, onSignOut, onQuickSav, user, quickSavsCount }) => (
  <div className="w-64 bg-white h-screen flex flex-col shadow-lg">
    {/* Header */}
    <div className="p-6 pb-4">
      <h1 className="text-2xl font-bold text-gray-900">QuickSav</h1>
    </div>
    
    {/* QuickSav NOW Button */}
    <div className="px-4 pb-4">
      <button
        onClick={onQuickSav}
        className="w-full py-3 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-semibold text-base"
      >
        QuickSav NOW
      </button>
    </div>
    
    {/* Main Navigation */}
    <nav className="flex-1 px-4">
      <button
        onClick={() => setCurrentView('dashboard')}
        className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors ${
          currentView === 'dashboard' 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="font-medium">Home</span>
        {quickSavsCount > 0 && (
          <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            {quickSavsCount}
          </span>
        )}
      </button>
      
      <button
        onClick={() => setCurrentView('spaces')}
        className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors mt-1 ${
          currentView === 'spaces' 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="font-medium">Spaces</span>
      </button>
      
      <button
        onClick={() => setCurrentView('sendit')}
        className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors mt-1 ${
          currentView === 'sendit' 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        <span className="font-medium">SendIt</span>
      </button>
      
      {/* Account Section */}
      <div className="mt-8 pt-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
          Account
        </div>
        
        <button
          onClick={() => setCurrentView('profile')}
          className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors ${
            currentView === 'profile' 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium">Profile</span>
        </button>
        
        <button
          onClick={() => setCurrentView('settings')}
          className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors mt-1 ${
            currentView === 'settings' 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Settings</span>
        </button>
        
        <button
          onClick={onSignOut}
          className="w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors mt-1 text-gray-700 hover:bg-gray-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </nav>

    {/* Dark Mode Toggle at Bottom */}
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Light</span>
        </div>
        
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200"
        >
          <span className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Dark</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

export default App;
