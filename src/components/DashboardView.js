import React, { useState } from 'react';
import { recentPricings } from '../components/data';
import { Icons } from './Icons';

const StatCard = ({ icon: Icon, label, value, subValue, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        border: '1px solid #E8E8F0', 
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}><Icon /></div>
        {subValue && <span style={{ fontSize: '12px', fontWeight: '600', color: subValue.includes('+') ? '#00875A' : '#6B6B8D', background: subValue.includes('+') ? '#00875A15' : '#F5F5F9', padding: '4px 10px', borderRadius: '20px' }}>{subValue}</span>}
      </div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '13px', color: '#6B6B8D' }}>{label}</div>
    </div>
  );
};

const DashboardView = ({ setActiveView, setSelectedPricingId, setViewMode }) => {
  const handlePricingClick = (id) => {
    setSelectedPricingId(id);
    setViewMode('edit');
    setActiveView('pricing');
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon={Icons.FileText} label="Active Pricings" value="24" subValue="+3 this week" color="#4A154B" />
        <StatCard icon={Icons.DollarSign} label="Total Pipeline" value="$12.4M" subValue="+18%" color="#00A3E0" />
        <StatCard icon={Icons.Percent} label="Avg. Margin" value="41.2%" subValue="+2.3%" color="#00875A" />
        <StatCard icon={Icons.TrendingUp} label="Win Rate" value="68%" subValue="+5%" color="#E5007D" />
        <StatCard icon={Icons.FileText} label="Pricing under Proposal" value="8" color="#F5A623" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px', gap: '24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>Recent Pricing Proposals</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search pricing..." 
                  style={{ 
                    padding: '8px 36px 8px 12px', 
                    border: '1px solid #E8E8F0', 
                    borderRadius: '10px', 
                    fontSize: '16px',
                    outline: 'none',
                    width: '250px'
                  }} 
                />
                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B6B8D' }}>
                  <Icons.Search />
                </div>
              </div>
              </div>
    
            <button onClick={() => { setViewMode('new'); setActiveView('pricing'); }} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(74, 21, 75, 0.25)', transition: 'all 0.2s' }}>
              <Icons.Plus />New Pricing
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F5F9' }}>
                  {['ID', 'Opportunity', 'Client', 'CSP', 'Rate/Hr', 'Recovery%', 'Value', 'Margin', 'Opp Status', 'Status'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: h === 'Value' || h === 'Margin' || h === 'Rate/Hr' || h === 'Recovery' ? 'right' : h === 'Status' || h === 'Opp Status' ? 'center' : 'left', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPricings.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < recentPricings.length - 1 ? '1px solid #E8E8F0' : 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F5F5F9'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px' }}>
                      <button 
                        onClick={() => handlePricingClick(p.id)}
                        style={{ 
                          fontSize: '13px', 
                          fontWeight: '600', 
                          color: '#4A154B', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          textDecoration: 'underline',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0
                        }}
                      >
                        {p.id}
                        <Icons.ExternalLink />
                      </button>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#1A1A2E', whiteSpace: 'nowrap' }}>{p.opportunity}</td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#6B6B8D', whiteSpace: 'nowrap' }}>{p.client}</td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#1A1A2E', whiteSpace: 'nowrap' }}>{p.partner}</td>
                    <td style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', textAlign: 'right', whiteSpace: 'nowrap' }}>{p.ratePerHour}</td>
                    <td style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#00A3E0', textAlign: 'right', whiteSpace: 'nowrap' }}>{p.recoveryRate}</td>
                    <td style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', textAlign: 'right', whiteSpace: 'nowrap' }}>{p.value}</td>
                    <td style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#00875A', textAlign: 'right', whiteSpace: 'nowrap' }}>{p.margin}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: p.oppStatus === 'Approved' ? '#00875A15' : p.oppStatus === 'Pending' ? '#F5A62315' : '#00A3E015', color: p.oppStatus === 'Approved' ? '#00875A' : p.oppStatus === 'Pending' ? '#F5A623' : '#00A3E0', whiteSpace: 'nowrap' }}>{p.oppStatus}</span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: p.status === 'Approved' ? '#00875A15' : p.status === 'Pending' ? '#F5A62315' : '#00A3E015', color: p.status === 'Approved' ? '#00875A' : p.status === 'Pending' ? '#F5A623' : '#00A3E0', whiteSpace: 'nowrap' }}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default DashboardView;