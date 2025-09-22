import React, { useState } from 'react';

const QuickSavForm = ({ isOpen, onClose, onSave, isDarkMode }) => {
  const [contentType, setContentType] = useState('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Content type options
  const contentTypes = [
    { id: 'link', label: 'Link' },
    { id: 'text', label: 'Text Note' },
    { id: 'image', label: 'Image' },
    { id: 'video', label: 'Video' },
    { id: 'file', label: 'Document' }
  ];

  // Reset form
  const resetForm = () => {
    setContentType('link');
    setTitle('');
    setUrl('');
    setTextContent('');
    setSelectedFile(null);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name);
      }
    }
  };

  // Validate form
  const isValid = () => {
    if (!title.trim()) return false;
    
    switch (contentType) {
      case 'link': return url.trim();
      case 'text': return textContent.trim();
      case 'image':
      case 'video':
      case 'file': return selectedFile;
      default: return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    setLoading(true);

    const quickSavData = {
      title: title.trim(),
      content_type: contentType,
      url: contentType === 'link' ? url : null,
      text_content: contentType === 'text' ? textContent : null,
      file_name: selectedFile ? selectedFile.name : null,
      file_size: selectedFile ? selectedFile.size : null,
      metadata: {
        originalFile: selectedFile ? selectedFile.type : null
      }
    };

    try {
      await onSave(quickSavData, selectedFile, null);
      resetForm();
      onClose();
    } catch (error) {
      alert('Error saving QuickSav: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              QuickSav NOW
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              ✕
            </button>
          </div>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Save any type of content to organize later
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Content Type Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Content Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setContentType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    contentType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`text-2xl mb-2`}>
                    {type.id === 'link' && '🔗'}
                    {type.id === 'text' && '📝'}
                    {type.id === 'image' && '🖼️'}
                    {type.id === 'video' && '🎥'}
                    {type.id === 'file' && '📄'}
                  </div>
                  <div className={`text-sm font-medium ${
                    contentType === type.id 
                      ? 'text-blue-600' 
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Content Input */}
          <div>
            {contentType === 'link' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  URL *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (!title && e.target.value) {
                      try {
                        const domain = new URL(e.target.value).hostname;
                        setTitle(`Link from ${domain}`);
                      } catch {}
                    }
                  }}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>
            )}

            {contentType === 'text' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Text Content *
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => {
                    setTextContent(e.target.value);
                    if (!title && e.target.value) {
                      const preview = e.target.value.slice(0, 50) + (e.target.value.length > 50 ? '...' : '');
                      setTitle(preview);
                    }
                  }}
                  placeholder="Enter your text note..."
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 resize-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>
            )}

            {(contentType === 'image' || contentType === 'video' || contentType === 'file') && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {contentType === 'image' && 'Select Image'}
                  {contentType === 'video' && 'Select Video'}
                  {contentType === 'file' && 'Select Document'}
                </label>
                {selectedFile ? (
                  <div className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedFile.name}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-red-600 hover:text-red-700 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="text-4xl mb-3">📁</div>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept={
                        contentType === 'image' ? 'image/*' :
                        contentType === 'video' ? 'video/*' :
                        '.pdf,.doc,.docx,.txt,.csv,.xlsx'
                      }
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Click to browse files
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title..."
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 border rounded-lg transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid() || loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save QuickSav'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickSavForm;
