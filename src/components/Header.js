import React from 'react';
import { Icons } from './Icons';

const Header = ({ title, subtitle }) => (
  <header style={{ 
    background: 'white', 
    borderBottom: '1px solid #E8E8F0', 
    padding: '20px 32px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    position: 'sticky', 
    top: 0, 
    zIndex: 100 
  }}>
    <div>
      <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1A1A2E' }}>{title}</h1>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6B6B8D' }}>{subtitle}</p>}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F5F5F9', padding: '10px 16px', borderRadius: '10px', border: '1px solid #E8E8F0' }}>
        <Icons.Search />
        <input type="text" placeholder="Search..." style={{ border: 'none', background: 'transparent', fontSize: '14px', outline: 'none', width: '180px', color: '#1A1A2E' }} />
      </div>
      <button style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #E8E8F0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A4A68', position: 'relative', transition: 'all 0.2s' }}>
        <Icons.Bell />
        <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#E5007D', borderRadius: '50%', border: '2px solid white' }} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#F5F5F9', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '600' }}>RK</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>Ravi Kumar</div>
          <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Engagement Lead</div>
        </div>
        <Icons.ChevronDown />
      </div>
    </div>
  </header>
);

export default Header;