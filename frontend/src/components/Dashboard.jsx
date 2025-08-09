import React, { useState, useEffect } from 'react';
import FolderView from './FolderView';
import ImageUpload from './ImageUpload';
import SearchBar from './SearchBar';

const Dashboard = ({ user, onLogout }) => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  const handleFolderChange = (folderId) => {
    setCurrentFolderId(folderId);
    setSearchResults(null);
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  useEffect(() => {
    if (currentFolderId) {
      fetchBreadcrumb();
    } else {
      setBreadcrumb([{ name: 'Home', id: null }]);
    }
  }, [currentFolderId]);

  const fetchBreadcrumb = async () => {
    try {
      const response = await fetch( `${import.meta.env.VITE_API_URL}/api/folders/${currentFolderId}/path`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const path = await response.json();
        setBreadcrumb([{ name: 'Home', id: null }, ...path]);
      }
    } catch (error) {
      console.error('Error fetching breadcrumb:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Image Manager</h1>
          <SearchBar onSearch={handleSearch} onClear={clearSearch} />
        </div>
        <div className="header-right">
          <span>Welcome, {user.username}!</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="breadcrumb">
        {breadcrumb.map((item, index) => (
          <span key={item.id || 'root'}>
            <button 
              className="breadcrumb-link"
              onClick={() => handleFolderChange(item.id)}
            >
              {item.name}
            </button>
            {index < breadcrumb.length - 1 && ' > '}
          </span>
        ))}
      </nav>

      <div className="dashboard-content">
        <div className="sidebar">
          <ImageUpload 
            currentFolderId={currentFolderId} 
            onUploadSuccess={refresh}
          />
        </div>
        
        <div className="main-content">
          <FolderView 
            currentFolderId={currentFolderId}
            onFolderChange={handleFolderChange}
            searchResults={searchResults}
            refreshTrigger={refreshTrigger}
            onRefresh={refresh}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
