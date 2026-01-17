import React from 'react';
import { GTLogo, Icons } from './Icons';

const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'pricing', label: 'New Pricing', icon: Icons.Pricing },
    { id: 'approvals', label: 'Approvals', icon: Icons.Approvals },
    { id: 'masters', label: 'Masters', icon: Icons.Masters },
  ];

  const sidebarWidth = isCollapsed ? 80 : 260;

  return (
    <div style={{ 
      width: `${sidebarWidth}px`, 
      background: 'linear-gradient(180deg, #FAFAFC 0%, #F5F5F9 100%)', 
      borderRight: '1px solid #E8E8F0', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      position: 'fixed', 
      left: 0, 
      top: 0,
      transition: 'all 0.3s ease-in-out',
      zIndex: 1000
    }}>
      {/* Logo Section with Hamburger */}
      <div style={{ 
        padding: '24px 20px', 
        borderBottom: '1px solid #E8E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        {/* Hamburger Menu Icon */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ 
            width: '40px', 
            height: '40px', 
            border: 'none', 
            background: 'transparent', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#4A154B',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#4A154B15'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Logo - only show when expanded */}
        {!isCollapsed && (
          <div style={{ flex: 1 }}>
            <GTLogo />
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
        {menuItems.map(item => (
          <div key={item.id} style={{ position: 'relative', marginBottom: '6px' }}>
            <button 
              onClick={() => setActiveView(item.id)} 
              title={isCollapsed ? item.label : ''}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '14px 16px', 
                border: 'none', 
                borderRadius: '10px', 
                background: activeView === item.id ? 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)' : 'transparent', 
                color: activeView === item.id ? 'white' : '#4A4A68', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: activeView === item.id ? '600' : '500', 
                textAlign: 'left', 
                boxShadow: activeView === item.id ? '0 4px 12px rgba(74, 21, 75, 0.25)' : 'none', 
                transition: 'all 0.2s',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
              }}
              onMouseEnter={(e) => {
                if (activeView !== item.id) {
                  e.currentTarget.style.background = '#4A154B08';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <item.icon />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          </div>
        ))}
      </nav>

      {/* Footer - only show when expanded */}
      {!isCollapsed && (
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #E8E8F0',
          fontSize: '11px',
          color: '#6B6B8D',
          textAlign: 'center'
        }}>
          © 2026 Grant Thornton
        </div>
      )}
    </div>
  );
};

export default Sidebar;