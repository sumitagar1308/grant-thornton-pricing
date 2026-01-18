import React, { useState } from 'react';
import { grades, competencies } from './data';
import { Icons } from './Icons';

const ChildRequestView = ({ 
  childRequestId,
  parentRequestId,
  opportunityDetails,
  solutionName,
  solutionType,
  primaryOwner,
  engagementContext,
  messageFromPrimary,
  onSubmit,
  onSaveDraft,
  setActiveView 
}) => {
  // Resource allocations for this solution
  const [resourceAllocations, setResourceAllocations] = useState([
    { id: 1, grade: '', competency: '', utilization: 100, months: 1, systemBillRate: 0, overrideBillRate: 0, costRate: 0 }
  ]);

  // Overhead expenses
  const [overheadExpenses, setOverheadExpenses] = useState([
    { id: 1, category: '', amount: 0, billablePercent: 100 }
  ]);

  const updateResource = (id, field, value) => {
    setResourceAllocations(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        
        // Auto-populate rates when grade and competency are selected
        if ((field === 'grade' || field === 'competency') && updated.grade && updated.competency) {
          // Mock rate lookup - replace with actual rateMatrix lookup
          updated.systemBillRate = 650;
          updated.overrideBillRate = 650;
          updated.costRate = 325;
        }
        
        return updated;
      }
      return r;
    }));
  };

  const handleDeleteRow = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResourceAllocations(prev => prev.filter(x => x.id !== id));
    }
  };

  const handleDuplicateRow = (resource) => {
    const newResource = {
      ...resource,
      id: Date.now()
    };
    setResourceAllocations(prev => [...prev, newResource]);
  };

  // Calculate totals
  const totals = resourceAllocations.reduce((acc, r) => {
    const hours = 160 * r.months * (r.utilization / 100);
    const revenue = hours * r.overrideBillRate;
    const cost = hours * r.costRate;
    
    return {
      totalHours: acc.totalHours + hours,
      totalRevenue: acc.totalRevenue + revenue,
      totalCost: acc.totalCost + cost
    };
  }, { totalHours: 0, totalRevenue: 0, totalCost: 0 });

  const discountedRevenue = totals.totalRevenue * (1 - (engagementContext.discount || 0) / 100);
  const billableOverhead = overheadExpenses.reduce((sum, e) => sum + (e.amount * e.billablePercent / 100), 0);
  const netRevenue = discountedRevenue + billableOverhead;
  const netProfit = netRevenue - (totals.totalCost + overheadExpenses.reduce((sum, e) => sum + e.amount, 0));
  const margin = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;
  const recovery = totals.totalCost > 0 ? (netRevenue / totals.totalCost) * 100 : 0;

  const canSubmit = resourceAllocations.length > 0 && 
    resourceAllocations.every(r => r.grade && r.competency && r.overrideBillRate > 0);

  const handleSubmitToPrimary = () => {
    if (!canSubmit) {
      alert('Please complete all required fields before submitting.');
      return;
    }

    const submissionData = {
      childRequestId,
      solutionName,
      resourceAllocations,
      overheadExpenses,
      metrics: {
        netRevenue: Math.round(netRevenue),
        margin: parseFloat(margin.toFixed(1)),
        recovery: parseFloat(recovery.toFixed(0)),
        totalCost: Math.round(totals.totalCost + overheadExpenses.reduce((sum, e) => sum + e.amount, 0))
      },
      submittedAt: new Date().toISOString()
    };

    if (onSubmit) {
      onSubmit(submissionData);
    }

    alert(`Pricing submitted successfully to ${primaryOwner}!\n\nYou will be notified once the primary owner reviews your submission.`);
    setActiveView('dashboard');
  };

  const handleSaveAsDraft = () => {
    if (onSaveDraft) {
      onSaveDraft({
        childRequestId,
        resourceAllocations,
        overheadExpenses,
        lastSaved: new Date().toISOString()
      });
    }
    alert('Draft saved successfully!');
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
          Child Pricing Request
        </h1>
        <div style={{ fontSize: '14px', color: '#6B6B8D' }}>
          Request ID: <strong style={{ color: '#4A154B' }}>{childRequestId}</strong> • Parent: <strong>{parentRequestId}</strong>
        </div>
      </div>

      {/* Engagement Context Card */}
      <div style={{ 
        marginBottom: '24px', 
        padding: '20px', 
        background: 'linear-gradient(135deg, #4A154B08 0%, #E5007D08 100%)', 
        borderRadius: '16px',
        border: '1px solid #4A154B25'
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700', color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A154B" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Engagement Context (Read-only)
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Opportunity</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>{opportunityDetails.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Client</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>{opportunityDetails.client}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Primary Owner</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>{primaryOwner}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Your Solution</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#4A154B' }}>
              {solutionName}
              <span style={{
                marginLeft: '8px',
                fontSize: '10px',
                background: '#00A3E015',
                color: '#00A3E0',
                padding: '3px 8px',
                borderRadius: '6px',
                fontWeight: '600'
              }}>
                {solutionType}
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Duration</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
              {engagementContext.duration}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Delivery Model</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>{engagementContext.deliveryModel}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Discount</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#DE350B' }}>{engagementContext.discount}%</div>
          </div>
        </div>

        {engagementContext.billRateEscalation > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Bill Rate Escalation</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#00875A' }}>{engagementContext.billRateEscalation}% YoY</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Cost Rate Escalation</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#F5A623' }}>{engagementContext.costRateEscalation}% YoY</div>
            </div>
          </div>
        )}

        {messageFromPrimary && (
          <div style={{ 
            marginTop: '16px', 
            padding: '16px', 
            background: 'white', 
            borderRadius: '10px',
            border: '1px solid #4A154B25'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B6B8D', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A154B" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Message from {primaryOwner}:
            </div>
            <div style={{ fontSize: '14px', color: '#1A1A2E', lineHeight: '1.6' }}>
              {messageFromPrimary}
            </div>
          </div>
        )}
      </div>

      {/* Resource Mapping Section */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
              Resource Mapping
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#6B6B8D' }}>
              Configure resources for {solutionName}
            </p>
          </div>
          <button 
            onClick={() => setResourceAllocations([
              ...resourceAllocations, 
              { id: Date.now(), grade: '', competency: '', utilization: 100, months: 1, systemBillRate: 0, overrideBillRate: 0, costRate: 0 }
            ])} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '10px 18px', 
              background: 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '13px', 
              fontWeight: '600', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(74, 21, 75, 0.25)'
            }}
          >
            <Icons.Plus />
            Add Resource
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F5F9' }}>
                {['Grade/Level', 'Competency', 'Utilization %', 'Duration', 'System Bill Rate', 'Override Bill Rate', 'Cost Rate', 'Hours', 'Revenue', 'Actions'].map(h => (
                  <th key={h} style={{ 
                    padding: '12px 14px', 
                    textAlign: ['System Bill Rate', 'Override Bill Rate', 'Cost Rate', 'Hours', 'Revenue'].includes(h) ? 'right' : h === 'Actions' ? 'center' : 'left', 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: '#6B6B8D', 
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resourceAllocations.map((r) => {
                const hours = 160 * r.months * (r.utilization / 100);
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #E8E8F0' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <select 
                        value={r.grade} 
                        onChange={(e) => updateResource(r.id, 'grade', e.target.value)} 
                        style={{ 
                          width: '100%', 
                          padding: '8px 10px', 
                          border: '1px solid #E8E8F0', 
                          borderRadius: '6px', 
                          fontSize: '13px', 
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select</option>
                        {grades.map(g => <option key={g.id} value={g.level}>{g.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <select 
                        value={r.competency} 
                        onChange={(e) => updateResource(r.id, 'competency', e.target.value)} 
                        style={{ 
                          width: '100%', 
                          padding: '8px 10px', 
                          border: '1px solid #E8E8F0', 
                          borderRadius: '6px', 
                          fontSize: '13px', 
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select</option>
                        {competencies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <input 
                        type="number" 
                        value={r.utilization} 
                        onChange={(e) => updateResource(r.id, 'utilization', Number(e.target.value))} 
                        style={{ 
                          width: '70px', 
                          padding: '8px', 
                          border: '1px solid #E8E8F0', 
                          borderRadius: '6px', 
                          textAlign: 'center',
                          fontSize: '13px'
                        }} 
                      />
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input 
                          type="number" 
                          value={r.months} 
                          onChange={(e) => updateResource(r.id, 'months', Number(e.target.value))} 
                          style={{ 
                            width: '60px', 
                            padding: '8px', 
                            border: '1px solid #E8E8F0', 
                            borderRadius: '6px', 
                            textAlign: 'center',
                            fontSize: '13px'
                          }} 
                        />
                        <span style={{ fontSize: '11px', color: '#6B6B8D' }}>mo</span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '10px 14px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#6B6B8D',
                      background: '#F5F5F9'
                    }}>
                      ${r.systemBillRate}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <input 
                        type="number" 
                        value={r.overrideBillRate} 
                        onChange={(e) => updateResource(r.id, 'overrideBillRate', Number(e.target.value))} 
                        style={{ 
                          width: '90px', 
                          padding: '8px', 
                          border: '1px solid #E8E8F0', 
                          borderRadius: '6px', 
                          textAlign: 'right', 
                          background: 'white',
                          fontSize: '13px',
                          fontWeight: '600'
                        }} 
                      />
                    </td>
                    <td style={{ 
                      padding: '10px 14px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      color: '#6B6B8D' 
                    }}>
                      ${r.costRate}
                    </td>
                    <td style={{ 
                      padding: '10px 14px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      fontWeight: '600' 
                    }}>
                      {hours.toLocaleString()}
                    </td>
                    <td style={{ 
                      padding: '10px 14px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#00875A' 
                    }}>
                      ${(hours * r.overrideBillRate).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleDuplicateRow(r)}
                          title="Duplicate row"
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            border: 'none', 
                            background: '#00A3E015', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#00A3E0',
                            transition: 'all 0.2s'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteRow(r.id)}
                          title="Delete row"
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            border: 'none', 
                            background: '#DE350B15', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#DE350B',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Row */}
        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          background: 'linear-gradient(135deg, #4A154B08 0%, #E5007D08 100%)', 
          borderRadius: '12px', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '32px' 
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Total Hours</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>
              {totals.totalHours.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Gross Revenue</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#00A3E0' }}>
              ${totals.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Total Cost</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#DE350B' }}>
              ${totals.totalCost.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Overhead Expenses Section */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
          Overhead Expenses
        </h3>
        
        <div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr 60px', 
              gap: '12px', 
              padding: '10px 14px', 
              background: '#F5F5F9', 
              borderRadius: '8px', 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#6B6B8D', 
              textTransform: 'uppercase' 
            }}>
              <div>Category</div>
              <div style={{ textAlign: 'right' }}>Amount ($)</div>
              <div style={{ textAlign: 'center' }}>Billable %</div>
              <div></div>
            </div>
          </div>

          {overheadExpenses.map(exp => (
            <div 
              key={exp.id} 
              style={{ 
                padding: '12px 14px', 
                border: '1px solid #E8E8F0', 
                borderRadius: '10px', 
                marginBottom: '10px', 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 60px', 
                gap: '12px', 
                alignItems: 'center' 
              }}
            >
              <input 
                value={exp.category} 
                onChange={(e) => setOverheadExpenses(prev => prev.map(x => x.id === exp.id ? { ...x, category: e.target.value } : x))} 
                placeholder="Enter category" 
                style={{ 
                  padding: '8px 10px', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '6px',
                  fontSize: '13px'
                }} 
              />
              <input 
                type="number" 
                value={exp.amount} 
                onChange={(e) => setOverheadExpenses(prev => prev.map(x => x.id === exp.id ? { ...x, amount: Number(e.target.value) } : x))} 
                style={{ 
                  padding: '8px 10px', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '6px', 
                  textAlign: 'right',
                  fontSize: '13px'
                }} 
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <input 
                  type="number" 
                  value={exp.billablePercent} 
                  onChange={(e) => setOverheadExpenses(prev => prev.map(x => x.id === exp.id ? { ...x, billablePercent: Number(e.target.value) } : x))} 
                  style={{ 
                    width: '60px', 
                    padding: '8px', 
                    border: '1px solid #E8E8F0', 
                    borderRadius: '6px', 
                    textAlign: 'center',
                    fontSize: '13px'
                  }} 
                />
                <span style={{ fontSize: '13px' }}>%</span>
              </div>
              <button 
                onClick={() => setOverheadExpenses(prev => prev.filter(x => x.id !== exp.id))} 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  border: 'none', 
                  background: '#DE350B15', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  color: '#DE350B', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Icons.Trash />
              </button>
            </div>
          ))}
          
          <button 
            onClick={() => setOverheadExpenses([...overheadExpenses, { id: Date.now(), category: '', amount: 0, billablePercent: 100 }])} 
            style={{ 
              padding: '8px 14px', 
              background: '#4A154B', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '13px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}
          >
            <Icons.Plus /> Add Expense
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #00875A08 0%, #00A96008 100%)', 
        borderRadius: '16px',
        border: '2px solid #00875A25',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
          📊 Financial Summary
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '6px' }}>Net Revenue</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#4A154B' }}>
              ${Math.round(netRevenue).toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '6px' }}>Net Profit</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#00875A' }}>
              ${Math.round(netProfit).toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '6px' }}>Margin</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: margin >= 35 ? '#00875A' : margin >= 25 ? '#F5A623' : '#DE350B' }}>
              {margin.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '6px' }}>Recovery</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#00A3E0' }}>
              {recovery.toFixed(0)}%
            </div>
          </div>
        </div>

        {margin < 35 && (
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
              <strong>Note:</strong> Current margin ({margin.toFixed(1)}%) is below target threshold of 35%. Consider optimizing resource mix or bill rates.
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        paddingTop: '24px', 
        borderTop: '2px solid #E8E8F0' 
      }}>
        <button 
          onClick={handleSaveAsDraft}
          style={{ 
            padding: '12px 24px', 
            background: 'white', 
            color: '#4A154B', 
            border: '1px solid #E8E8F0', 
            borderRadius: '10px', 
            fontSize: '14px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Save as Draft
        </button>
        
        <button 
          onClick={handleSubmitToPrimary}
          disabled={!canSubmit}
          style={{ 
            padding: '12px 32px', 
            background: canSubmit ? 'linear-gradient(135deg, #00875A 0%, #00A960 100%)' : '#E8E8F0', 
            color: canSubmit ? 'white' : '#6B6B8D', 
            border: 'none', 
            borderRadius: '10px', 
            fontSize: '14px', 
            fontWeight: '600', 
            cursor: canSubmit ? 'pointer' : 'not-allowed', 
            boxShadow: canSubmit ? '0 4px 12px rgba(0, 135, 90, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Submit to {primaryOwner} →
        </button>
      </div>
    </div>
  );
};

export default ChildRequestView;