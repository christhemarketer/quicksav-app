import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">QuickSav</h1>
        <p className="text-gray-600">App is loading successfully!</p>
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">
            Environment check:
          </p>
          <p className="text-xs mt-2">
            Supabase URL: {process.env.REACT_APP_SUPABASE_URL ? 'Connected' : 'Missing'}
          </p>
          <p className="text-xs">
            Supabase Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Connected' : 'Missing'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
