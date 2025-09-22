import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import QuickSavForm from './components/QuickSavForm';

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
            <Dashboard 
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
      className="w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 mb-6 font-medium"
    >
      <span className="text-lg">+</span> QuickSav NOW
    </button>
    
    {/* Navigation */}
    <nav className="space-y-2">
      <button
        onClick={() => setCurrentView('dashboard')}
        className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${
          currentView === 'dashboard' ? 'bg-blue-600 text-white' : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span>Dashboard</span>
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
    </nav>

    {/* Bottom Actions */}
    <div className="mt-8 pt-8 border-t border-gray-200">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`w-full p-3 rounded-lg mb-2 text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <button
        onClick={onSignOut}
        className="w-full p-3 rounded-lg text-left text-red-600 hover:bg-red-50"
      >
        Sign Out
      </button>
    </div>
  </div>
);

// Dashboard component
const Dashboard = ({ user, isDarkMode, quickSavs, onQuickSav }) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, {user.email.split('@')[0]}!
        </h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Ready to save something new?
        </p>
      </div>
      <button
        onClick={onQuickSav}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
      >
        <span className="text-lg">+</span>
        QuickSav NOW
      </button>
    </div>
    
    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {quickSavs.length}
        </div>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Total QuickSavs
        </div>
      </div>
      <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          0
        </div>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Organized Items
        </div>
      </div>
      <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          0
        </div>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Spaces Created
        </div>
      </div>
    </div>

    {/* Recent QuickSavs */}
    <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Recent QuickSavs
      </h2>
      
      {quickSavs.length === 0 ? (
        <div className="text-center py-8">
          <div className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            No QuickSavs yet
          </div>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            Start saving content with the QuickSav NOW button
          </p>
          <button
            onClick={onQuickSav}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First QuickSav
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {quickSavs.slice(0, 5).map((quickSav) => (
            <div
              key={quickSav.id}
              className={`p-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {quickSav.title}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {quickSav.content_type} • {new Date(quickSav.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          {quickSavs.length > 5 && (
            <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              And {quickSavs.length - 5} more...
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

export default App;
