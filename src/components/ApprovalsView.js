import React from 'react';
import { pendingApprovals } from '../components/data';
import { Icons } from './Icons';

const ApprovalsView = ({ setActiveView, setSelectedPricingId, setViewMode }) => {
  const handleViewPricing = (id) => {
    setSelectedPricingId(id);
    setViewMode('view');
    setActiveView('pricing');
  };

  const handleApprove = (id) => {
    alert(`Approved: ${id}`);
    // Add your approval logic here
  };

  const handleReject = (id) => {
    const reason = prompt(`Enter reason for rejecting ${id}:`);
    if (reason) {
      alert(`Rejected: ${id}\nReason: ${reason}`);
      // Add your rejection logic here
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
          Approvals Management
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <button style={{ padding: '10px 20px', background: 'white', color: '#4A4A68', border: '1px solid #E8E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            All <span style={{ background: '#F5F5F9', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>12</span>
          </button>
          <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(74, 21, 75, 0.25)' }}>
            Pending My Approval <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>3</span>
          </button>
          <button style={{ padding: '10px 20px', background: 'white', color: '#4A4A68', border: '1px solid #E8E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Approved <span style={{ background: '#F5F5F9', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>8</span>
          </button>
          <button style={{ padding: '10px 20px', background: 'white', color: '#4A4A68', border: '1px solid #E8E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Rejected <span style={{ background: '#F5F5F9', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>1</span>
          </button>
        </div>

        {pendingApprovals.map((item, i) => (
          <div key={item.id} style={{ 
            padding: '20px 24px', 
            borderBottom: i < pendingApprovals.length - 1 ? '1px solid #E8E8F0' : 'none',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 220px',
            gap: '20px',
            alignItems: 'center'
          }}>
            {/* Request ID & Client */}
            <div>
              <button 
                onClick={() => handleViewPricing(item.id)}
                style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#4A154B', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  textDecoration: 'underline', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: 0,
                  marginBottom: '4px'
                }}
              >
                {item.id}
                <Icons.ExternalLink />
              </button>
              <div style={{ fontSize: '13px', color: '#6B6B8D' }}>{item.client}</div>
            </div>

            {/* Submitted By */}
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Submitted by</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>{item.submitter}</div>
            </div>

            {/* Total Value */}
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Value</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                ${item.value ? Math.round(item.value / 1000) + 'K' : 'N/A'}
              </div>
            </div>

            {/* Net Profit */}
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Net Profit</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#00875A' }}>
                ${item.netProfit ? Math.round(item.netProfit / 1000) + 'K' : 'N/A'}
              </div>
            </div>

            {/* Margin */}
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Margin</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#00875A' }}>{item.margin}</div>
            </div>

            {/* Recovery % */}
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Recovery</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#00A3E0' }}>
                {item.recoveryRate ? item.recoveryRate : 'N/A'}
              </div>
            </div>

            {/* Rate/Hour */}
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Rate/Hr</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#4A154B' }}>
                ${item.ratePerHour ? item.ratePerHour : 'N/A'}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleApprove(item.id)} 
                style={{ 
                  padding: '10px 16px', 
                  background: '#00875A', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#006644'}
                onMouseLeave={(e) => e.target.style.background = '#00875A'}
              >
                ✓ Approve
              </button>
              <button 
                onClick={() => handleReject(item.id)} 
                style={{ 
                  padding: '10px 16px', 
                  background: '#FF8F73', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#FF7A59'}
                onMouseLeave={(e) => e.target.style.background = '#FF8F73'}
              >
                ✕ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalsView;