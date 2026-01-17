import React from 'react';
import { GTLogo, Icons } from './Icons';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'pricing', label: 'New Pricing', icon: Icons.Pricing },
    { id: 'approvals', label: 'Approvals', icon: Icons.Approvals },
    { id: 'masters', label: 'Masters', icon: Icons.Masters },
  ];

  return (
    <div style={{ 
      width: '260px', 
      background: 'linear-gradient(180deg, #FAFAFC 0%, #F5F5F9 100%)', 
      borderRight: '1px solid #E8E8F0', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      position: 'fixed', 
      left: 0, 
      top: 0 
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #E8E8F0' }}>
        <GTLogo />
      </div>
      <nav style={{ flex: 1, padding: '20px 12px' }}>
        {menuItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveView(item.id)} 
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '14px 16px', 
              marginBottom: '6px', 
              border: 'none', 
              borderRadius: '10px', 
              background: activeView === item.id ? 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)' : 'transparent', 
              color: activeView === item.id ? 'white' : '#4A4A68', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: activeView === item.id ? '600' : '500', 
              textAlign: 'left', 
              boxShadow: activeView === item.id ? '0 4px 12px rgba(74, 21, 75, 0.25)' : 'none', 
              transition: 'all 0.2s' 
            }}
          >
            <item.icon />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;