import React from 'react';
import { pendingApprovals } from '../components/data';
import { Icons } from './Icons';

const ApprovalsView = ({ setActiveView }) => {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
          Approvals Management
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <button style={{ padding: '10px 20px', background: 'white', color: '#4A4A68', border: '1px solid #E8E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            All <span style={{ background: '#F5F5F9', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>12</span>
          </button>
          <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(74, 21, 75, 0.25)' }}>
            Pending My Approval <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>2</span>
          </button>
          <button style={{ padding: '10px 20px', background: 'white', color: '#4A4A68', border: '1px solid #E8E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Approved <span style={{ background: '#F5F5F9', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>8</span>
          </button>
          <button style={{ padding: '10px 20px', background: 'white', color: '#4A4A68', border: '1px solid #E8E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Rejected <span style={{ background: '#F5F5F9', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>1</span>
          </button>
        </div>

        {pendingApprovals.map((item, i) => (
          <div key={item.id} style={{ padding: '20px', borderBottom: i < pendingApprovals.length - 1 ? '1px solid #E8E8F0' : 'none', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 140px', gap: '24px', alignItems: 'center' }}>
            <div>
              <button style={{ fontSize: '13px', fontWeight: '600', color: '#4A154B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                {item.id}
                <Icons.ExternalLink />
              </button>
              <div style={{ fontSize: '13px', color: '#6B6B8D', marginTop: '4px' }}>{item.client}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Submitted by</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>{item.submitter}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Margin</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#00875A' }}>{item.margin}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => alert(`Approved ${item.id}`)} style={{ padding: '10px 16px', background: '#00875A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', flex: 1 }}>
                ✓ Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalsView;
