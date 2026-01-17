import React, { useState } from 'react';
import { Icons } from '../Icons';

const Step2ResourceAndOverhead = ({
  resourceAllocations,
  setResourceAllocations,
  updateResource,
  discountPercent,
  setDiscountPercent,
  overheadExpenses,
  setOverheadExpenses,
  totals,
  isReadOnly,
  setStep,
  grades,
  competencies,
  handleAllSolutions,
  selectedOpportunity,
  solutionLeads,
  currentSolution,
  setCurrentSolution,
  childRequestsCreated,
  setChildRequestsCreated
}) => {
  
  const [activeTab, setActiveTab] = useState(0);

  // Get solutions list
  const solutions = selectedOpportunity?.solutions || [];
  const primarySolution = solutions.find(s => s.isPrimary);
  const secondarySolutions = solutions.filter(s => !s.isPrimary);

  // Determine which solutions to show
  const visibleSolutions = handleAllSolutions 
    ? solutions 
    : (primarySolution ? [primarySolution] : solutions);

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

  const handleDownloadTemplate = () => {
    const headers = ['Grade/Level', 'Competency', 'Utilization %', 'Duration (months)', 'System Bill Rate', 'Override Bill Rate', 'Cost Rate'];
    const csvContent = headers.join(',') + '\n' + 
      'D,1,50,3,650,650,325\n' +
      'M,1,100,3,380,380,190\n' +
      'SC,1,100,3,280,280,140';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resource_mapping_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUploadTemplate = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Template upload functionality to be implemented. File selected: ${file.name}`);
      }
    };
    input.click();
  };

  const handleCreateChildRequests = () => {
    // Logic to create child requests
    const childRequests = secondarySolutions.map((sol, idx) => ({
      id: `${selectedOpportunity.id}.${String(idx + 1).padStart(3, '0')}`,
      solutionName: sol.name,
      solutionLead: solutionLeads[sol.name],
      status: 'pending',
      createdAt: new Date().toISOString()
    }));

    console.log('Creating child requests:', childRequests);
    
    // TODO: API call to create child requests in backend
    // await createChildRequests(childRequests);
    
    setChildRequestsCreated(true);
    alert(`${childRequests.length} child pricing request(s) created successfully!\n\nNotifications sent to:\n${childRequests.map(cr => `• ${cr.solutionLead} (${cr.solutionName})`).join('\n')}`);
  };

  const canProceed = resourceAllocations.length > 0 && 
    resourceAllocations.every(r => r.grade && r.competency);

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '24px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
        Resource Mapping & Overhead
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#6B6B8D' }}>
        {handleAllSolutions 
          ? 'Configure resources, apply discounts, and define overhead expenses for all solutions'
          : 'Configure resources for the primary solution. Secondary solutions will be priced by their respective owners.'}
      </p>

      {/* Solution Tabs (if consolidated mode) */}
      {handleAllSolutions && solutions.length > 1 && (
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #E8E8F0' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {solutions.map((sol, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                style={{
                  padding: '12px 24px',
                  background: activeTab === idx ? 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)' : 'transparent',
                  color: activeTab === idx ? 'white' : '#6B6B8D',
                  border: 'none',
                  borderBottom: activeTab === idx ? 'none' : '2px solid transparent',
                  borderRadius: '8px 8px 0 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== idx) e.currentTarget.style.background = '#F5F5F9';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== idx) e.currentTarget.style.background = 'transparent';
                }}
              >
                {sol.name}
                <span style={{
                  fontSize: '10px',
                  background: activeTab === idx ? 'rgba(255,255,255,0.2)' : (sol.isPrimary ? '#4A154B15' : '#00A3E015'),
                  color: activeTab === idx ? 'white' : (sol.isPrimary ? '#4A154B' : '#00A3E0'),
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  {sol.isPrimary ? 'Primary' : 'Secondary'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Solution Context Card (if distributed mode) */}
      {!handleAllSolutions && primarySolution && (
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px', 
          background: 'linear-gradient(135deg, #4A154B08 0%, #E5007D08 100%)', 
          borderRadius: '12px',
          border: '1px solid #4A154B25'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Current Solution</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#4A154B' }}>
                {primarySolution.name}
                <span style={{
                  marginLeft: '10px',
                  fontSize: '11px',
                  background: '#4A154B15',
                  color: '#4A154B',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  Primary Solution
                </span>
              </div>
            </div>
            {secondarySolutions.length > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Secondary Solutions</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#00A3E0' }}>
                  {secondarySolutions.length} solution{secondarySolutions.length > 1 ? 's' : ''} will be priced separately
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discount Override Section */}
      <div style={{ marginBottom: '24px', padding: '16px', background: '#F5F5F9', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: '600', color: '#1A1A2E' }}>
          Apply Discount
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
              Discount Percentage
            </label>
            <input 
              type="range" 
              min="0" 
              max="30" 
              value={discountPercent} 
              onChange={(e) => !isReadOnly && setDiscountPercent(Number(e.target.value))} 
              disabled={isReadOnly} 
              style={{ width: '100%', accentColor: '#4A154B' }} 
            />
          </div>
          <div style={{ 
            width: '90px', 
            padding: '10px', 
            background: 'white', 
            borderRadius: '8px', 
            textAlign: 'center', 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#4A154B', 
            border: '1px solid #E8E8F0' 
          }}>
            {discountPercent}%
          </div>
        </div>
        <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Gross Revenue</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>
              ${totals.totalGrossRevenue.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D' }}>After Discount</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#00A3E0' }}>
              ${totals.discountedRevenue.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Discount Amount</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#DE350B' }}>
              -${totals.discountAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Mapping Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: '600', color: '#1A1A2E' }}>
              Resource Mapping
              {handleAllSolutions && solutions.length > 1 && (
                <span style={{ marginLeft: '10px', fontSize: '13px', color: '#6B6B8D', fontWeight: '400' }}>
                  ({solutions[activeTab]?.name})
                </span>
              )}
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#6B6B8D' }}>
              Map grades, competencies and effort as per SOW
            </p>
          </div>
          {!isReadOnly && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleDownloadTemplate}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '9px 16px', 
                  background: 'white',
                  color: '#4A154B',
                  border: '1px solid #4A154B', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#4A154B08'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Template
              </button>
              <button 
                onClick={handleUploadTemplate}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '9px 16px', 
                  background: 'white',
                  color: '#4A154B',
                  border: '1px solid #4A154B', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#4A154B08'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Template
              </button>
              <button 
                onClick={() => setResourceAllocations([
                  ...resourceAllocations, 
                  { 
                    id: Date.now(), 
                    grade: '', 
                    competency: '', 
                    utilization: 100, 
                    months: 1, 
                    systemBillRate: 0, 
                    overrideBillRate: 0, 
                    costRate: 0,
                    solution: handleAllSolutions ? solutions[activeTab]?.name : primarySolution?.name
                  }
                ])} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '9px 16px', 
                  background: 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(74, 21, 75, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                <Icons.Plus />
                Add Resource
              </button>
            </div>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F5F9' }}>
                {[
                  'Grade/Level', 
                  'Competency', 
                  'Utilization %', 
                  'Duration', 
                  'System Bill Rate', 
                  'Override Bill Rate', 
                  'Cost Rate', 
                  'Hours', 
                  'Revenue', 
                  !isReadOnly && 'Actions'
                ].filter(Boolean).map(h => (
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
              {resourceAllocations
                .filter(r => {
                  if (handleAllSolutions) {
                    return r.solution === solutions[activeTab]?.name;
                  } else {
                    return r.solution === primarySolution?.name || !r.solution;
                  }
                })
                .map((r) => {
                  const hours = 160 * r.months * (r.utilization / 100);
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #E8E8F0' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <select 
                          value={r.grade} 
                          onChange={(e) => updateResource(r.id, 'grade', e.target.value)} 
                          disabled={isReadOnly} 
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
                          disabled={isReadOnly} 
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
                          disabled={isReadOnly} 
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
                            disabled={isReadOnly} 
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
                          disabled={isReadOnly} 
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
                      {!isReadOnly && (
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
                              onMouseEnter={(e) => e.target.style.background = '#00A3E025'}
                              onMouseLeave={(e) => e.target.style.background = '#00A3E015'}
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
                              onMouseEnter={(e) => e.target.style.background = '#DE350B25'}
                              onMouseLeave={(e) => e.target.style.background = '#DE350B15'}
                            >
                              <Icons.Trash />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

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
            <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Total Cost</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#DE350B' }}>
              ${totals.totalCost.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Gross Revenue (after discount)</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#00875A' }}>
              ${totals.discountedRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Overhead Expenses Section */}
      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #E8E8F0' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#1A1A2E' }}>
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
                onChange={(e) => !isReadOnly && setOverheadExpenses(prev => prev.map(x => x.id === exp.id ? { ...x, category: e.target.value } : x))} 
                disabled={isReadOnly} 
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
                onChange={(e) => !isReadOnly && setOverheadExpenses(prev => prev.map(x => x.id === exp.id ? { ...x, amount: Number(e.target.value) } : x))} 
                disabled={isReadOnly} 
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
                  onChange={(e) => !isReadOnly && setOverheadExpenses(prev => prev.map(x => x.id === exp.id ? { ...x, billablePercent: Number(e.target.value) } : x))} 
                  disabled={isReadOnly} 
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
              {!isReadOnly && (
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
              )}
            </div>
          ))}
          
          {!isReadOnly && (
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
          )}
        </div>

        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          background: 'linear-gradient(135deg, #4A154B08 0%, #E5007D08 100%)', 
          borderRadius: '12px' 
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Total Overhead</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
                ${overheadExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Billable Overhead</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#00875A' }}>
                ${totals.billableOverhead.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6B6B8D' }}>Non-Billable Overhead</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#DE350B' }}>
                ${(overheadExpenses.reduce((sum, e) => sum + e.amount, 0) - totals.billableOverhead).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '24px', 
        paddingTop: '20px', 
        borderTop: '1px solid #E8E8F0' 
      }}>
        <button 
          onClick={() => setStep(1)} 
          style={{ 
            padding: '10px 20px', 
            background: 'transparent', 
            color: '#4A154B', 
            border: '1px solid #4A154B', 
            borderRadius: '10px', 
            fontSize: '14px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ← Back
        </button>

        {!isReadOnly && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Create Child Requests Button (Distributed Mode Only) */}
            {!handleAllSolutions && !childRequestsCreated && secondarySolutions.length > 0 && canProceed && (
              <button 
                onClick={handleCreateChildRequests}
                style={{ 
                  padding: '10px 24px', 
                  background: 'linear-gradient(135deg, #00A3E0 0%, #0094CC 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 12px rgba(0, 163, 224, 0.25)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                Create Child Requests ({secondarySolutions.length})
              </button>
            )}

            {/* Continue Button */}
            {(handleAllSolutions || childRequestsCreated) && (
              <button 
                onClick={() => setStep(3)} 
                disabled={!canProceed}
                style={{ 
                  padding: '10px 28px', 
                  background: canProceed ? 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)' : '#E8E8F0', 
                  color: canProceed ? 'white' : '#6B6B8D', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: canProceed ? 'pointer' : 'not-allowed', 
                  boxShadow: canProceed ? '0 4px 12px rgba(74, 21, 75, 0.25)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Continue to Year-wise Comparison →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Child Requests Status Card (after creation) */}
      {!handleAllSolutions && childRequestsCreated && secondarySolutions.length > 0 && (
        <div style={{ 
          marginTop: '24px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, #00875A08 0%, #00A96008 100%)', 
          borderRadius: '12px',
          border: '2px solid #00875A25'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00875A" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#00875A' }}>
                Child Requests Created Successfully
              </div>
              <div style={{ fontSize: '13px', color: '#6B6B8D', marginTop: '4px' }}>
                {secondarySolutions.length} solution owner{secondarySolutions.length > 1 ? 's have' : ' has'} been notified to complete their pricing
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            {secondarySolutions.map((sol, idx) => (
              <div key={idx} style={{ 
                padding: '12px 16px', 
                background: 'white', 
                borderRadius: '8px',
                border: '1px solid #00875A25'
              }}>
                <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>
                  {selectedOpportunity.id}.{String(idx + 1).padStart(3, '0')}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E', marginBottom: '2px' }}>
                  {sol.name}
                </div>
                <div style={{ fontSize: '12px', color: '#00A3E0' }}>
                  Assigned to: {solutionLeads[sol.name]}
                </div>
              </div>
            ))}
          </div>
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: '#00A3E015', 
            borderRadius: '8px',
            fontSize: '12px',
            color: '#00A3E0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>
              You can proceed to Year-wise Comparison while waiting for secondary solution owners to submit their pricing. You'll be able to view and consolidate all submissions in the Consolidation Dashboard.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2ResourceAndOverhead;