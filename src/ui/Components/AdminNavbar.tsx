import React from 'react';

const AdminNavbar = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px', height: '100vh', position: 'fixed', left: 0, top: 0, backgroundColor: '#f8f9fa' }}>
      {/* Logo and Brand Name */}
      <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
        <span>E-Sport Central</span>
      </div>
      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '20px', borderBottom: '1px solid #ddd' }}>
        <a href="#" style={{ display: 'block', margin: '10px 0' }}>Home</a>
        <a href="#" style={{ display: 'block', margin: '10px 0' }}>Tournaments</a>
        <a href="#" style={{ display: 'block', margin: '10px 0' }}>Teams</a>
        <a href="#" style={{ display: 'block', margin: '10px 0' }}>Players</a>
        <a href="#" style={{ display: 'block', margin: '10px 0' }}>Add Games</a> 
      </div>
      {/* Icons and Profile */}
      <div style={{ padding: '20px', borderTop: '1px solid #ddd' }}>
        <button style={{ display: 'block', margin: '10px 0' }}>
          <i className="fas fa-search"></i>
        </button>
        <button style={{ display: 'block', margin: '10px 0' }}>
          <i className="fas fa-bell"></i>
        </button>
        <button style={{ display: 'block', margin: '10px 0' }}>
          <i className="fas fa-comment-dots"></i>
        </button>
        <img
          src="https://via.placeholder.com/32"
          alt="Profile"
          style={{ display: 'block', margin: '10px 0' }}
        />
      </div>
    </div>
  );
};

export default AdminNavbar;