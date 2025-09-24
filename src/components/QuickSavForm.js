import React, { useState, useRef, useEffect } from 'react';

const QuickSavForm = ({ isOpen, onClose, onSave, isDarkMode, initialData = null, categories = [] }) => {
  const [contentType, setContentType] = useState(initialData?.content_type || 'file');
  const [title, setTitle] = useState(initialData?.title || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [textContent, setTextContent] = useState(initialData?.content || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(initialData?.category || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Content type options
  const contentTypes = [
    { id: 'file', label: 'File/Image' },
    { id: 'link', label: 'Link' },
    { id: 'text', label: 'Text Note' },
    { id: 'video', label: 'Video' },
  ];

  // Default categories if none provided
  const defaultCategories = ['Work', 'Personal', 'Ideas', 'Resources', 'Archive'];
  const categoryOptions = categories.length > 0 ? categories : defaultCategories;

  // Set initial data when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTextContent(initialData.content || '');
      setCategory(initialData.category || '');
      setTags(initialData.tags?.join(', ') || '');
      setUrl(initialData.url || '');
      setContentType(initialData.content_type || 'text');
    }
  }, [initialData]);

  // Reset form
  const resetForm = () => {
    setContentType('file');
    setTitle('');
    setUrl('');
    setTextContent('');
    setSelectedFile(null);
    setCategory('');
    setTags('');
    setImagePreview(null);
    setIsDragging(false);
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      
      // Set title from filename if empty
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Validate form
  const isValid = () => {
    if (!title.trim()) return false;
    
    switch (contentType) {
      case 'link': return url.trim();
      case 'text': return textContent.trim();
      case 'file':
      case 'image':
      case 'video': 
        return initialData || selectedFile; // Allow save when editing without new file
      default: return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    setLoading(true);

    // Parse tags
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const quickSavData = {
      title: title.trim(),
      content_type: contentType,
      content: contentType === 'text' ? textContent : '',
      url: contentType === 'link' ? url : null,
      category: category || 'Personal',
      tags: tagArray,
      file_name: selectedFile ? selectedFile.name : null,
      file_size: selectedFile ? selectedFile.size : null,
      metadata: {
        originalFile: selectedFile ? selectedFile.type : null
      }
    };

    try {
      await onSave(quickSavData, selectedFile, null);
      if (!initialData) resetForm(); // Only reset if not editing
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
              {initialData ? 'Edit QuickSav' : 'QuickSav NOW'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {initialData ? 'Update your saved content' : 'Save any type of content to organize later'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Content Type Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Content Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                    {type.id === 'file' && '📁'}
                    {type.id === 'video' && '🎥'}
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

          {/* File Upload - Moved Above Title */}
          {(contentType === 'file' || contentType === 'video') && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {contentType === 'video' ? 'Select Video' : 'Select File'}
              </label>
              {selectedFile ? (
                <div className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full max-h-48 object-contain mb-3 rounded"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedFile.name}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="ml-3 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : isDarkMode 
                        ? 'border-gray-600 bg-gray-700 hover:border-gray-500' 
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-3">
                    {isDragging ? '📥' : '📁'}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    accept={contentType === 'video' ? 'video/*' : '*'}
                    className="hidden"
                  />
                  <p className={`font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {isDragging ? 'Drop your file here' : 'Click to browse or drag and drop'}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {contentType === 'video' ? 'MP4, MOV, AVI up to 500MB' : 'Any file type up to 100MB'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* URL Input for Links */}
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

          {/* Text Content for Notes */}
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

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select category...</option>
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
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
              {loading ? 'Saving...' : (initialData ? 'Update QuickSav' : 'Save QuickSav')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickSavForm;
