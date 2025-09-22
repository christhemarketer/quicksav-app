import React, { useState } from 'react';
import { X, Link, FileText, Image, Video, Mic, Upload, Plus } from 'lucide-react';

const QuickSavForm = ({ isOpen, onClose, onSave, isDarkMode }) => {
  const [contentType, setContentType] = useState('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loading, setLoading] = useState(false);

  // Content type options
  const contentTypes = [
    { id: 'link', label: 'Link', icon: Link, color: 'blue' },
    { id: 'text', label: 'Text Note', icon: FileText, color: 'green' },
    { id: 'image', label: 'Image', icon: Image, color: 'purple' },
    { id: 'video', label: 'Video', icon: Video, color: 'red' },
    { id: 'voice', label: 'Voice Note', icon: Mic, color: 'orange' },
    { id: 'file', label: 'Document', icon: Upload, color: 'gray' }
  ];

  // Reset form
  const resetForm = () => {
    setContentType('link');
    setTitle('');
    setUrl('');
    setTextContent('');
    setSelectedFile(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setIsRecording(false);
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

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Store timer and recorder for cleanup
      window.currentRecording = { recorder, timer };

    } catch (error) {
      alert('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (window.currentRecording) {
      window.currentRecording.recorder.stop();
      clearInterval(window.currentRecording.timer);
      window.currentRecording = null;
    }
    setIsRecording(false);
  };

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Validate form
  const isValid = () => {
    if (!title.trim()) return false;
    
    switch (contentType) {
      case 'link': return url.trim();
      case 'text': return textContent.trim();
      case 'voice': return audioBlob;
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
      audio_duration: contentType === 'voice' ? recordingTime : null,
      metadata: {
        originalFile: selectedFile ? selectedFile.type : null,
        recordingDuration: contentType === 'voice' ? recordingTime : null
      }
    };

    try {
      await onSave(quickSavData, selectedFile, audioBlob);
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
              <X size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
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
              {contentTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setContentType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      contentType === type.id
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : isDarkMode
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <IconComponent 
                      size={24} 
                      className={`mx-auto mb-2 ${
                        contentType === type.id 
                          ? `text-${type.color}-600` 
                          : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} 
                    />
                    <div className={`text-sm font-medium ${
                      contentType === type.id 
                        ? `text-${type.color}-600` 
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </div>
                  </button>
                );
              })}
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

            {contentType === 'voice' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Voice Recording
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                }`}>
                  {!audioBlob ? (
                    <div>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isRecording ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
                      }`}>
                        <Mic size={24} className="text-white" />
                      </div>
                      <div className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatTime(recordingTime)}
                      </div>
                      <div className="space-x-2">
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Start Recording
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                          >
                            Stop Recording
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center mb-3">
                        <Mic size={20} className="text-orange-600 mr-2" />
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          Recording Complete ({formatTime(recordingTime)})
                        </span>
                      </div>
                      <audio controls src={URL.createObjectURL(audioBlob)} className="mx-auto" />
                      <button
                        type="button"
                        onClick={() => setAudioBlob(null)}
                        className="mt-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Delete & Re-record
                      </button>
                    </div>
                  )}
                </div>
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
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <Upload size={32} className={`mx-auto mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
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
                      className="cursor-pointer text-blue-600 hover:text-blue-700"
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
