import React from 'react';

const MastersView = () => {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
          Masters Data Management
        </h2>
        
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
          <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(74, 21, 75, 0.25)' }}>Rate Matrix</button>
          <button style={{ padding: '10px 20px', background: 'white', color: '#4A4A68', border: '1px solid #E8E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Grades</button>
          <button style={{ padding: '10px 20px', background: 'white', color: '#4A4A68', border: '1px solid #E8E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Competencies</button>
          <button style={{ padding: '10px 20px', background: 'white', color: '#4A4A68', border: '1px solid #E8E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Approval Matrix</button>
        </div>

        <div style={{ padding: '20px', background: '#F5F5F9', borderRadius: '12px' }}>
          <p style={{ color: '#4A154B', fontWeight: '600', marginBottom: '12px' }}>Rate Matrix Configuration</p>
          <p style={{ color: '#6B6B8D', margin: 0 }}>Configure billing and cost rates for different grade and competency combinations. This data is used for automatic calculation in pricing proposals.</p>
        </div>
      </div>
    </div>
  );
};

export default MastersView;