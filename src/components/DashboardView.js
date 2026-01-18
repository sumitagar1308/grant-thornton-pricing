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

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

const DashboardView = ({ setActiveView, setSelectedPricingId, setViewMode }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [showAddendumModal, setShowAddendumModal] = useState(false);
  const [selectedAddendumId, setSelectedAddendumId] = useState(null);

  const handlePricingClick = (id) => {
    setSelectedPricingId(id);
    setViewMode('edit');
    setActiveView('pricing');
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddendumRequest = (id) => {
    setSelectedAddendumId(id);
    setShowAddendumModal(true);
  };

  const submitAddendumRequest = () => {
    // Handle addendum request submission
    alert(`Addendum request created for ${selectedAddendumId}`);
    setShowAddendumModal(false);
    setSelectedAddendumId(null);
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
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
                    fontSize: '13px',
                    outline: 'none',
                    width: '220px'
                  }} 
                />
                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B6B8D' }}>
                  <Icons.Search />
                </div>
              </div>
              <button onClick={() => { setViewMode('new'); setActiveView('pricing'); }} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(74, 21, 75, 0.25)', transition: 'all 0.2s' }}>
                <Icons.Plus />New Pricing
              </button>
              {/* Temporary Test Section - Remove in production */}
              <div style={{ 
                marginBottom: '24px', 
                padding: '16px', 
                background: '#F5A62315', 
                borderRadius: '12px',
                border: '1px solid #F5A62350'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#F5A623', marginBottom: '8px' }}>
                  🧪 Testing Tools (Remove in Production)
                </div>
                <button 
                  onClick={() => setActiveView('child-request')}
                  style={{ 
                    padding: '10px 20px', 
                    background: '#00A3E0', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 163, 224, 0.25)'
                  }}
                >
                  📧 Simulate Child Request Notification (Secondary Owner View)
                </button>
              </div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F5F9' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase', letterSpacing: '0.5px', width: '40px' }}></th>
                  {['ID', 'Opportunity', 'Client', 'CSP', 'Rate/Hr', 'Recovery%', 'Value', 'Margin', 'Opp Status', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: h === 'Value' || h === 'Margin' || h === 'Rate/Hr' || h === 'Recovery%' ? 'right' : h === 'Status' || h === 'Opp Status' || h === 'Actions' ? 'center' : 'left', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPricings.map((p, i) => (
                  <React.Fragment key={p.id}>
                    {/* Parent Row */}
                    <tr style={{ borderBottom: '1px solid #E8E8F0', transition: 'background 0.2s', background: expandedRows[p.id] ? '#F5F5F9' : 'transparent' }} onMouseEnter={(e) => !expandedRows[p.id] && (e.currentTarget.style.background = '#F5F5F9')} onMouseLeave={(e) => !expandedRows[p.id] && (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '16px' }}>
                        {p.childRequests && p.childRequests.length > 0 && (
                          <button 
                            onClick={() => toggleRow(p.id)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer', 
                              color: '#4A154B',
                              display: 'flex',
                              alignItems: 'center',
                              padding: 0
                            }}
                          >
                            {expandedRows[p.id] ? <ChevronDown /> : <ChevronRight />}
                          </button>
                        )}
                      </td>
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
                      
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {p.childRequests && p.childRequests.length > 0 && (
                          <button 
                            onClick={() => setActiveView('consolidation')}
                            style={{ 
                              padding: '6px 12px', 
                              background: '#00A3E0', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '6px', 
                              fontSize: '11px', 
                              fontWeight: '600', 
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#0094CC'}
                            onMouseLeave={(e) => e.target.style.background = '#00A3E0'}
                          >
                            View Consolidation
                          </button>
                        )}
                        
                        {p.status === 'Approved' && (
                          <button 
                            onClick={() => handleAddendumRequest(p.id)}
                            style={{ 
                              padding: '6px 12px', 
                              background: '#FF8F73', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '6px', 
                              fontSize: '11px', 
                              fontWeight: '600', 
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#FF7A59'}
                            onMouseLeave={(e) => e.target.style.background = '#FF8F73'}
                          >
                            + Addendum
                          </button>
                        )}
                        
                        {!p.childRequests && p.status !== 'Approved' && (
                          <span style={{ fontSize: '11px', color: '#C1C1D0' }}>—</span>
                        )}
                      </div>
                    </td>
                    </tr>

                    {/* Child Rows */}
                    {expandedRows[p.id] && p.childRequests && p.childRequests.map((child, idx) => (
                      <tr key={`${p.id}-${idx}`} style={{ background: '#FAFAFC', borderBottom: idx === p.childRequests.length - 1 ? '1px solid #E8E8F0' : '1px solid #F0F0F5' }}>
                        <td style={{ padding: '12px 16px' }}></td>
                        <td style={{ padding: '12px 16px' }}>
                          <button 
                            onClick={() => handlePricingClick(`${p.id}.${String(idx + 1).padStart(3, '0')}`)}
                            style={{ 
                              fontSize: '12px', 
                              fontWeight: '600', 
                              color: '#6B6B8D', 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer', 
                              textDecoration: 'underline',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: 0,
                              marginLeft: '20px'
                            }}
                          >
                            {p.id}.{String(idx + 1).padStart(3, '0')}
                            <Icons.ExternalLink />
                          </button>
                        </td>
                        <td colSpan="2" style={{ padding: '12px 16px', fontSize: '12px', color: '#1A1A2E', fontWeight: '600' }}>
                          {child.solutionName}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B6B8D' }}>
                          {child.solutionLead}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#1A1A2E', textAlign: 'right' }}>
                          {child.ratePerHour}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#00A3E0', textAlign: 'right' }}>
                          {child.recoveryRate}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#1A1A2E', textAlign: 'right' }}>
                          {child.value}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#00875A', textAlign: 'right' }}>
                          {child.margin}
                        </td>
                        <td style={{ padding: '12px 16px' }}></td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '600', background: child.status === 'Approved' ? '#00875A15' : child.status === 'Pending' ? '#F5A62315' : '#00A3E015', color: child.status === 'Approved' ? '#00875A' : child.status === 'Pending' ? '#F5A623' : '#00A3E0', whiteSpace: 'nowrap' }}>{child.status}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Addendum Request Modal */}
      {showAddendumModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '32px', 
            maxWidth: '600px', 
            width: '90%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
              Create Addendum Request
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6B6B8D' }}>
              Request ID: {selectedAddendumId}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
                Addendum Type *
              </label>
              <select style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #E8E8F0', 
                borderRadius: '10px', 
                fontSize: '14px',
                outline: 'none'
              }}>
                <option value="">Select addendum type</option>
                <option value="scope">Scope Change</option>
                <option value="timeline">Timeline Extension</option>
                <option value="resource">Resource Addition</option>
                <option value="rate">Rate Adjustment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
                Reason for Addendum *
              </label>
              <textarea 
                placeholder="Describe the reason for this addendum request..."
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '10px', 
                  fontSize: '14px',
                  outline: 'none',
                  minHeight: '100px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowAddendumModal(false);
                  setSelectedAddendumId(null);
                }}
                style={{ 
                  padding: '10px 20px', 
                  background: 'transparent', 
                  color: '#4A154B', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={submitAddendumRequest}
                style={{ 
                  padding: '10px 24px', 
                  background: 'linear-gradient(135deg, #E5007D 0%, #C4006A 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(229, 0, 125, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;