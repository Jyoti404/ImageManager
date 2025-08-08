import React, { useState, useEffect } from 'react';
import CreateFolder from './CreateFolder';

const FolderView = ({ 
  currentFolderId, 
  onFolderChange, 
  searchResults, 
  refreshTrigger,
  onRefresh 
}) => {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  useEffect(() => {
    if (searchResults) {
      setImages(searchResults);
      setFolders([]);
      setLoading(false);
    } else {
      fetchFolders();
      fetchImages();
    }
  }, [currentFolderId, searchResults, refreshTrigger]);

  const fetchFolders = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/folders?parentId=${currentFolderId || ''}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/images?folderId=${currentFolderId || ''}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async (folderId) => {
    if (!window.confirm('Are you sure? This will delete the folder and all its contents.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        onRefresh();
      } else {
        alert('Error deleting folder');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const deleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        onRefresh();
      } else {
        alert('Error deleting image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="folder-view">
      {!searchResults && (
        <div className="folder-actions">
          <button 
            className="create-folder-btn"
            onClick={() => setShowCreateFolder(true)}
          >
            + Create Folder
          </button>
        </div>
      )}

      {showCreateFolder && (
        <CreateFolder
          parentFolderId={currentFolderId}
          onClose={() => setShowCreateFolder(false)}
          onSuccess={() => {
            setShowCreateFolder(false);
            onRefresh();
          }}
        />
      )}

      {searchResults && (
        <div className="search-header">
          <h3>Search Results ({images.length} images found)</h3>
        </div>
      )}

      <div className="content-grid">
        {/* Folders */}
        {folders.map(folder => (
          <div key={folder._id} className="folder-item">
            <div 
              className="folder-icon"
              onClick={() => onFolderChange(folder._id)}
            >
              📁
            </div>
            <div className="item-name">{folder.name}</div>
            <div className="item-actions">
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(folder._id);
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {/* Images */}
        {images.map(image => (
          <div key={image._id} className="image-item">
            <div className="image-thumbnail">
              <img 
                src={`http://localhost:5000/${image.filePath}`}
                alt={image.name}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
            <div className="item-name" title={image.name}>{image.name}</div>
            {searchResults && (
              <div className="image-path">
                in: {image.folderId?.path || '/'}
              </div>
            )}
            <div className="item-actions">
              <button 
                className="delete-btn"
                onClick={() => deleteImage(image._id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {folders.length === 0 && images.length === 0 && (
        <div className="empty-state">
          {searchResults ? 'No images found matching your search.' : 'This folder is empty.'}
        </div>
      )}
    </div>
  );
};

export default FolderView;