import React, { useState } from 'react';

const CreateFolder = ({ parentFolderId, onClose, onSuccess }) => {
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: folderName.trim(),
          parentId: parentFolderId
        })
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Error creating folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Error creating folder');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create New Folder</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Folder Name:</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              autoFocus
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolder;