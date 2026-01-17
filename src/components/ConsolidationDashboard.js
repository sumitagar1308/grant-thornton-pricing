import React, { useState } from 'react';
import { Icons } from './Icons';

const ConsolidationDashboard = ({ 
  parentRequestId,
  selectedOpportunity,
  primarySolution,
  secondarySolutions,
  solutionLeads,
  childRequests,
  setChildRequests,
  onProceedToStep3,
  setActiveView 
}) => {
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedChildForRevision, setSelectedChildForRevision] = useState(null);
  const [revisionMessage, setRevisionMessage] = useState('');

  // Calculate consolidated metrics
  const primaryMetrics = {
    netRevenue: 450000,
    margin: 40,
    recovery: 160,
    status: 'completed'
  };

  const allChildrenComplete = childRequests.every(cr => cr.status === 'submitted' || cr.status === 'approved');
  const totalNetRevenue = primaryMetrics.netRevenue + childRequests
    .filter(cr => cr.status === 'submitted' || cr.status === 'approved')
    .reduce((sum, cr) => sum + (cr.netRevenue || 0), 0);
  
  const weightedMargin = childRequests.length > 0
    ? (primaryMetrics.margin * primaryMetrics.netRevenue + 
       childRequests.reduce((sum, cr) => sum + (cr.margin || 0) * (cr.netRevenue || 0), 0)) / 
      totalNetRevenue
    : primaryMetrics.margin;

  const avgRecovery = childRequests.length > 0
    ? (primaryMetrics.recovery + childRequests.reduce((sum, cr) => sum + (cr.recovery || 0), 0)) / 
      (childRequests.length + 1)
    : primaryMetrics.recovery;

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
      case 'submitted':
      case 'approved':
        return { bg: '#00875A15', color: '#00875A', icon: '✓' };
      case 'pending':
        return { bg: '#F5A62315', color: '#F5A623', icon: '⏳' };
      case 'revision_requested':
        return { bg: '#E5007D15', color: '#E5007D', icon: '↻' };
      default:
        return { bg: '#6B6B8D15', color: '#6B6B8D', icon: '○' };
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'submitted': return 'Submitted';
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'revision_requested': return 'Revision Requested';
      default: return 'Unknown';
    }
  };

  const handleRequestRevision = (childRequest) => {
    setSelectedChildForRevision(childRequest);
    setRevisionModalOpen(true);
  };

  const submitRevisionRequest = () => {
    if (!revisionMessage.trim()) {
      alert('Please enter a revision message');
      return;
    }

    setChildRequests(prev => prev.map(cr => 
      cr.id === selectedChildForRevision.id 
        ? { 
            ...cr, 
            status: 'revision_requested',
            revisionHistory: [
              ...(cr.revisionHistory || []),
              {
                requestedAt: new Date().toISOString(),
                message: revisionMessage
              }
            ]
          }
        : cr
    ));

    alert(`Revision request sent to ${selectedChildForRevision.solutionLead}`);
    setRevisionModalOpen(false);
    setRevisionMessage('');
    setSelectedChildForRevision(null);
  };

  const handleApproveChild = (childRequest) => {
    if (window.confirm(`Approve pricing for ${childRequest.solutionName}?`)) {
      setChildRequests(prev => prev.map(cr => 
        cr.id === childRequest.id ? { ...cr, status: 'approved' } : cr
      ));
    }
  };

  const handleSendReminder = (childRequest) => {
    alert(`Reminder sent to ${childRequest.solutionLead} for ${childRequest.solutionName}`);
    setChildRequests(prev => prev.map(cr => 
      cr.id === childRequest.id 
        ? { 
            ...cr, 
            lastReminder: new Date().toISOString()
          }
        : cr
    ));
  };

  const handleTakeOver = (childRequest) => {
    if (window.confirm(`Take over pricing for ${childRequest.solutionName}? This will convert it back to your responsibility.`)) {
      alert('Pricing taken over. You can now complete this in the Resource Mapping step.');
      // Logic to convert child back to parent
    }
  };

  const handleViewDetails = (childRequest) => {
    alert(`View details for ${childRequest.solutionName}\n\nThis will open a detailed view of the submitted pricing.`);
    // Navigate to detailed view
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveView('dashboard')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '8px 12px', 
            background: 'transparent', 
            border: 'none', 
            color: '#4A154B', 
            fontSize: '13px', 
            fontWeight: '600', 
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Back to Dashboard
        </button>
        
        <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '700', color: '#1A1A2E' }}>
          Pricing Consolidation
        </h1>
        <div style={{ fontSize: '14px', color: '#6B6B8D' }}>
          Request ID: <strong style={{ color: '#4A154B' }}>{parentRequestId}</strong> • {selectedOpportunity?.name}
        </div>
      </div>

      {/* Overall Status Card */}
      <div style={{ 
        marginBottom: '24px', 
        padding: '24px', 
        background: allChildrenComplete 
          ? 'linear-gradient(135deg, #00875A08 0%, #00A96008 100%)' 
          : 'linear-gradient(135deg, #F5A62308 0%, #E6941508 100%)',
        borderRadius: '16px',
        border: `2px solid ${allChildrenComplete ? '#00875A25' : '#F5A62325'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: allChildrenComplete ? '#00875A' : '#F5A623',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            {allChildrenComplete ? '✓' : '⏳'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>
              {allChildrenComplete 
                ? '✅ All Solutions Complete - Ready to Proceed'
                : `⚠️ Awaiting Secondary Solutions (${childRequests.filter(cr => cr.status === 'submitted' || cr.status === 'approved').length} of ${childRequests.length} complete)`
              }
            </div>
            <div style={{ fontSize: '13px', color: '#6B6B8D' }}>
              {allChildrenComplete 
                ? 'All solution owners have submitted their pricing. Review and proceed to Year-wise Comparison.'
                : 'Waiting for remaining solution owners to complete their pricing submissions.'
              }
            </div>
          </div>
          {allChildrenComplete && (
            <button 
              onClick={onProceedToStep3}
              style={{ 
                padding: '12px 24px', 
                background: 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(74, 21, 75, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              Proceed to Step 3 →
            </button>
          )}
        </div>
      </div>

      {/* Solutions Grid */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
          Solutions Overview
        </h2>

        {/* Primary Solution Card */}
        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '12px', 
          border: '2px solid #4A154B',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: '#00875A15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00875A',
                fontSize: '18px',
                fontWeight: '700'
              }}>
                ✓
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>
                  {primarySolution?.name || 'Primary Solution'}
                  <span style={{
                    marginLeft: '10px',
                    fontSize: '11px',
                    background: '#4A154B',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}>
                    PRIMARY
                  </span>
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '11px',
                    background: '#00875A15',
                    color: '#00875A',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}>
                    YOU
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#6B6B8D', marginTop: '2px' }}>
                  Status: Completed {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
            <button 
              onClick={() => alert('View your primary solution pricing details')}
              style={{ 
                padding: '8px 16px', 
                background: 'transparent', 
                color: '#4A154B', 
                border: '1px solid #4A154B', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: '600', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              View Details
              <Icons.ExternalLink />
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Net Revenue</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#4A154B' }}>
                ${primaryMetrics.netRevenue.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Margin</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#00875A' }}>
                {primaryMetrics.margin}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Recovery</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#00A3E0' }}>
                {primaryMetrics.recovery}%
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Solution Cards */}
        {childRequests.map((child, idx) => {
          const statusStyle = getStatusColor(child.status);
          return (
            <div key={child.id} style={{ 
              padding: '20px', 
              background: 'white', 
              borderRadius: '12px', 
              border: `2px solid ${child.status === 'submitted' || child.status === 'approved' ? '#00875A25' : '#E8E8F0'}`,
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: statusStyle.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: statusStyle.color,
                    fontSize: '18px',
                    fontWeight: '700'
                  }}>
                    {statusStyle.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>
                      {child.solutionName}
                      <span style={{
                        marginLeft: '10px',
                        fontSize: '11px',
                        background: '#00A3E015',
                        color: '#00A3E0',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: '600'
                      }}>
                        SECONDARY
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B6B8D' }}>
                      Request ID: {child.id} • Assigned to: <strong>{child.solutionLead}</strong>
                    </div>
                    <div style={{ 
                      marginTop: '6px',
                      fontSize: '12px',
                      padding: '4px 10px',
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      borderRadius: '6px',
                      display: 'inline-block',
                      fontWeight: '600'
                    }}>
                      {getStatusText(child.status)}
                      {child.submittedAt && ` • ${new Date(child.submittedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  {(child.status === 'submitted' || child.status === 'approved') && (
                    <>
                      <button 
                        onClick={() => handleViewDetails(child)}
                        style={{ 
                          padding: '8px 14px', 
                          background: 'transparent', 
                          color: '#4A154B', 
                          border: '1px solid #4A154B', 
                          borderRadius: '8px', 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Icons.ExternalLink />
                        View
                      </button>
                      {child.status === 'submitted' && (
                        <>
                          <button 
                            onClick={() => handleRequestRevision(child)}
                            style={{ 
                              padding: '8px 14px', 
                              background: '#E5007D', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '8px', 
                              fontSize: '12px', 
                              fontWeight: '600', 
                              cursor: 'pointer'
                            }}
                          >
                            Request Revision
                          </button>
                          <button 
                            onClick={() => handleApproveChild(child)}
                            style={{ 
                              padding: '8px 14px', 
                              background: '#00875A', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '8px', 
                              fontSize: '12px', 
                              fontWeight: '600', 
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Approve
                          </button>
                        </>
                      )}
                    </>
                  )}
                  
                  {child.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleSendReminder(child)}
                        style={{ 
                          padding: '8px 14px', 
                          background: 'transparent', 
                          color: '#F5A623', 
                          border: '1px solid #F5A623', 
                          borderRadius: '8px', 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          cursor: 'pointer'
                        }}
                      >
                        Send Reminder
                      </button>
                      <button 
                        onClick={() => handleTakeOver(child)}
                        style={{ 
                          padding: '8px 14px', 
                          background: 'transparent', 
                          color: '#6B6B8D', 
                          border: '1px solid #6B6B8D', 
                          borderRadius: '8px', 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          cursor: 'pointer'
                        }}
                      >
                        Take Over
                      </button>
                    </>
                  )}

                  {child.status === 'revision_requested' && (
                    <div style={{ 
                      padding: '8px 14px', 
                      background: '#E5007D15', 
                      color: '#E5007D', 
                      borderRadius: '8px', 
                      fontSize: '12px', 
                      fontWeight: '600'
                    }}>
                      Awaiting Revision
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics (if submitted) */}
              {(child.status === 'submitted' || child.status === 'approved') && child.netRevenue && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', paddingTop: '16px', borderTop: '1px solid #E8E8F0' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Net Revenue</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#4A154B' }}>
                      ${child.netRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Margin</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#00875A' }}>
                      {child.margin}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>Recovery</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#00A3E0' }}>
                      {child.recovery}%
                    </div>
                  </div>
                </div>
              )}

              {/* Revision History */}
              {child.revisionHistory && child.revisionHistory.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E8E8F0' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B6B8D', marginBottom: '8px' }}>
                    Revision History:
                  </div>
                  {child.revisionHistory.map((rev, idx) => (
                    <div key={idx} style={{ 
                      padding: '10px 12px', 
                      background: '#F5F5F9', 
                      borderRadius: '8px', 
                      fontSize: '12px', 
                      color: '#6B6B8D',
                      marginBottom: '6px'
                    }}>
                      <strong>{new Date(rev.requestedAt).toLocaleString()}</strong>: {rev.message}
                    </div>
                  ))}
                </div>
              )}

              {/* Last Reminder */}
              {child.lastReminder && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px 12px', 
                  background: '#F5A62315', 
                  borderRadius: '8px', 
                  fontSize: '11px', 
                  color: '#F5A623' 
                }}>
                  Last reminder sent: {new Date(child.lastReminder).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Consolidated Financial Summary */}
      <div style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #4A154B08 0%, #E5007D08 100%)', 
        borderRadius: '16px',
        border: '1px solid #4A154B25'
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
          📊 Consolidated Financial Summary
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '6px' }}>Total Net Revenue</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#4A154B' }}>
              ${totalNetRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginTop: '4px' }}>
              {childRequests.filter(cr => cr.status === 'submitted' || cr.status === 'approved').length + 1} of {childRequests.length + 1} solutions
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '6px' }}>Weighted Avg Margin</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#00875A' }}>
              {weightedMargin.toFixed(1)}%
            </div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginTop: '4px' }}>
              Across all completed solutions
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '6px' }}>Overall Recovery</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#00A3E0' }}>
              {avgRecovery.toFixed(0)}%
            </div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginTop: '4px' }}>
              Average across solutions
            </div>
          </div>
        </div>

        {!allChildrenComplete && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: '#F5A62315', 
            borderRadius: '8px', 
            fontSize: '12px', 
            color: '#F5A623',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>
              <strong>Note:</strong> Complete figures will be available once all secondary solutions are submitted.
            </span>
          </div>
        )}
      </div>

      {/* Revision Request Modal */}
      {revisionModalOpen && selectedChildForRevision && (
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
              Request Revision
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6B6B8D' }}>
              {selectedChildForRevision.solutionName} • {selectedChildForRevision.solutionLead}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
                Current Metrics
              </label>
              <div style={{ padding: '12px', background: '#F5F5F9', borderRadius: '8px', fontSize: '13px' }}>
                <div>• Net Revenue: ${selectedChildForRevision.netRevenue?.toLocaleString()}</div>
                <div>• Margin: {selectedChildForRevision.margin}%</div>
                <div>• Recovery: {selectedChildForRevision.recovery}%</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
                Revision Request Message *
              </label>
              <textarea 
                value={revisionMessage}
                onChange={(e) => setRevisionMessage(e.target.value)}
                placeholder="Please describe what needs to be revised and why..."
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '10px', 
                  fontSize: '14px',
                  outline: 'none',
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setRevisionModalOpen(false);
                  setRevisionMessage('');
                  setSelectedChildForRevision(null);
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
                onClick={submitRevisionRequest}
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
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsolidationDashboard;