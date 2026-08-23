// src/components/Profile.jsx
import React, { useState } from 'react';

export default function Profile({ onNavigate, onLogout, theme = 'light' }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const mainBg = isDark ? '#0f172a' : '#ffffff';
  const sidebarBg = isDark ? '#1e293b' : '#eff6ff'; // Light blue sidebar from the design
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#cbd5e1';
  const inputBg = isDark ? '#0f172a' : '#ffffff';

  // Form State
  const [fullName, setFullName] = useState('Upeksha Madumali');
  const [email, setEmail] = useState('upeksha@gmail.com');
  const [bio, setBio] = useState('Product designer passionate about creating beautiful and functional user experiences.');
  const [location, setLocation] = useState('Colombo, Sri Lanka');
  const [website, setWebsite] = useState('https://upeksha.ui.design');
  const [profileImage, setProfileImage] = useState(
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
   );

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile update successfully!');
  };


  const handlePhotoChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    setProfileImage(URL.createObjectURL(file));
  }
  };

  // Helper for Sidebar Nav Buttons
  const NavButton = ({ label, icon, active, onClick }) => {
    return (
      <button
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          background: active ? '#2563eb' : (isDark ? '#0f172a' : '#ffffff'),
          color: active ? '#ffffff' : textColor,
          border: active ? 'none' : `1px solid ${borderColor}`,
          borderRadius: '8px',
          fontSize: '15px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left'
        }}
      >
        <span style={{ fontSize: '18px' }}>{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: mainBg, fontFamily: 'sans-serif', boxSizing: 'border-box', color: textColor }}>
      
      {/* Sidebar - Matching specific UI styling from the image */}
      <div style={{ width: '240px', background: cardBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px', color: textColor }}>
          <span style={{ background: '#2563eb', color: 'white', padding: '6px', borderRadius: '8px' }}>📅</span> CollabBoard
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div onClick={() => onNavigate('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📊 Dashboard
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
            👤 Profile
          </div>
          
          <div onClick={() => onNavigate('tasks')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📋 Tasks
          </div>
          
          <div onClick={() => onNavigate('team')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            👥 Team
          </div>
          
          <div onClick={() => onNavigate('project-overview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📁 Project Overview
          </div>
          
          <div onClick={() => onNavigate('setting')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            ⚙️ Setting
          </div>


          <button 
            onClick={onLogout}
            style={{ padding: '10px', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Logout
          </button>
          
        </div>

      </div> 

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px 60px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 'bold', color: textColor }}>Profile</h1>
          <p style={{ margin: 0, fontSize: '13px', color: subTextColor }}>Manage your personal information and preferences.</p>
        </div>

        {/* Main Profile Card Container */}
        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', display: 'flex', padding: '40px', minHeight: '500px' }}>
          
          {/* Left Column: Avatar & Basic Info */}
          <div style={{
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRight: `1px solid ${borderColor}`,
            paddingRight: '40px'
          }}>
            
            <img 
              src={profileImage}
              alt="Profile Avatar"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '20px'
              }}
            />

            <h2 style={{
              margin: '0 0 4px 0',
              fontSize: '20px',
              color: textColor,
              fontWeight: 'bold'
            }}>
              {fullName}
            </h2>

            <p style={{
              margin: '0 0 20px 0',
              fontSize: '12px',
              color: subTextColor
            }}>
              {email.toLowerCase()}
            </p>

            {/* Instagram-style Change Photo */}
            <label
              htmlFor="profile-photo"
              style={{
                padding: '8px 20px',
                background: '#2563eb',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              Change Photo
            </label>

            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Right Column: Form Fields */}
          <div style={{ flex: 1, paddingLeft: '40px', display: 'flex', flexDirection: 'column' }}>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
              
              {/* Form Row: Full Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ padding: '12px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '14px', outline: 'none', background: inputBg, color: textColor }}
                />
              </div>

              {/* Form Row: Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: '12px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '14px', outline: 'none', background: inputBg, color: textColor }}
                />
              </div>

              {/* Form Row: Bio */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'flex-start', gap: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor, marginTop: '12px' }}>Bio</label>
                <textarea 
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ padding: '12px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '14px', outline: 'none', background: inputBg, color: textColor, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Form Row: Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ padding: '12px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '14px', outline: 'none', background: inputBg, color: textColor }}
                />
              </div>

              {/* Form Row: Website */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>Website</label>
                <input 
                  type="text" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={{ padding: '12px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '14px', outline: 'none', background: inputBg, color: textColor }}
                />
              </div>

              {/* Save submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '20px' }}>
                <button 
                  type="submit" 
                  style={{ padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}