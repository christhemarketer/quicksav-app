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
  const [quickSavs, setQuickSavs] = useState([]);

  // Authentication effect
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
  };

  // QuickSav functions
  const handleSaveQuickSav = async (quickSavData, file, audioBlob) => {
    const newQuickSav = {
      id: Date.now(),
      ...quickSavData,
      created_at: new Date().toISOString(),
      user_id: user.id
    };
    
    setQuickSavs(prev => [newQuickSav, ...prev]);
    console.log('Saved QuickSav:', newQuickSav);
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
            <EnhancedDashboard 
              user={user} 
              isDarkMode={isDarkMode} 
              quickSavs={quickSavs}
              onQuickSav={() => setShowQuickSavModal(true)}
            />
          )}
          {currentView === 'spaces' && <div className="p-6">Spaces View Coming Soon</div>}
          {currentView === 'settings' && <div className="p-6">Settings View Coming Soon</div>}
        </main>
      </div>

      {/* QuickSav Modal */}
      <QuickSavForm 
        isOpen={showQuickSavModal}
        onClose={() => setShowQuickSavModal(false)}
        onSave={handleSaveQuickSav}
        isDarkMode={isDarkMode}
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

// Sidebar component
const Sidebar = ({ currentView, setCurrentView, isDarkMode, setIsDarkMode, onSignOut, onQuickSav, user, quickSavsCount }) => (
  <div className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-4`}>
    <div className="mb-8">
      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>QuickSav</h2>
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {user?.email?.split('@')[0] || 'User'}
      </p>
    </div>
    
    {/* QuickSav NOW Button */}
    <button
      onClick={onQuickSav}
      className="w-full p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 mb-6 font-medium"
    >
      QuickSav NOW
    </button>
    
    {/* Navigation */}
    <nav className="space-y-2">
      <button
        onClick={() => setCurrentView('dashboard')}
        className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${
          currentView === 'dashboard' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span>Home</span>
        {quickSavsCount > 0 && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            currentView === 'dashboard' ? 'bg-blue-500' : 'bg-blue-600 text-white'
          }`}>
            {quickSavsCount}
          </span>
        )}
      </button>
      <button
        onClick={() => setCurrentView('spaces')}
        className={`w-full text-left p-3 rounded-lg ${
          currentView === 'spaces' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Spaces
      </button>
      <button
        onClick={() => setCurrentView('sendit')}
        className={`w-full text-left p-3 rounded-lg ${
          currentView === 'sendit' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        SendIt
      </button>
    </nav>

    {/* Account Section */}
    <div className="mt-8 pt-4 border-t border-gray-200">
      <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        ACCOUNT
      </div>
      <nav className="space-y-1">
        <button
          onClick={() => setCurrentView('profile')}
          className={`w-full text-left p-2 rounded text-sm ${
            currentView === 'profile' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setCurrentView('settings')}
          className={`w-full text-left p-2 rounded text-sm ${
            currentView === 'settings' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Settings
        </button>
        <button
          onClick={onSignOut}
          className="w-full text-left p-2 rounded text-sm text-red-600 hover:bg-red-50"
        >
          Sign Out
        </button>
      </nav>
    </div>

    {/* Dark Mode Toggle */}
    <div className="mt-4 pt-4 border-t border-gray-200">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`w-full p-2 rounded text-sm text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        {isDarkMode ? 'Light' : 'Dark'}
      </button>
    </div>
  </div>
);

export default App;
