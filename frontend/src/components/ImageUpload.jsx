import React, { useState } from 'react';

const ImageUpload = ({ currentFolderId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setImageName(file.name.split('.')[0]); // Remove extension for default name
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      alert('Please drop an image file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !imageName.trim()) {
      alert('Please select a file and enter a name');
      return;
    }

    if (!currentFolderId) {
      alert('Please select a folder first');
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('name', imageName.trim());
    formData.append('folderId', currentFolderId);

    try {
      const response = await fetch('http://localhost:5000/api/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        setSelectedFile(null);
        setImageName('');
        onUploadSuccess();
        alert('Image uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error uploading image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
    
    setUploading(false);
  };

  return (
    <div className="image-upload">
      <h3>Upload Image</h3>
      
      <div 
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          style={{ display: 'none' }}
        />
        
        {selectedFile ? (
          <div className="file-selected">
            <p>📁 {selectedFile.name}</p>
            <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="upload-placeholder">
            <p>📷</p>
            <p>Click or drag image here</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="upload-form">
          <div className="form-group">
            <label>Image Name:</label>
            <input
              type="text"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter image name"
            />
          </div>
          
          <button 
            onClick={handleUpload}
            disabled={uploading || !currentFolderId}
            className="upload-btn"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          
          {!currentFolderId && (
            <p className="warning">Please select a folder to upload to</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
