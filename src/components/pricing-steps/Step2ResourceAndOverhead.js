import React from 'react';
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
  competencies
}) => {
  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '32px' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
        Resource Mapping & Overhead
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6B6B8D' }}>
        Configure resources, apply discounts, and define overhead expenses
      </p>

      {/* Discount Override Section - At Top */}
      <div style={{ marginBottom: '32px', padding: '20px', background: '#F5F5F9', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
          Apply Discount
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
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
            width: '100px', 
            padding: '12px', 
            background: 'white', 
            borderRadius: '8px', 
            textAlign: 'center', 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#4A154B', 
            border: '1px solid #E8E8F0' 
          }}>
            {discountPercent}%
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Gross Revenue</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
              ${totals.totalGrossRevenue.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D' }}>After Discount</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#00A3E0' }}>
              ${totals.discountedRevenue.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Discount Amount</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#DE350B' }}>
              -${totals.discountAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Mapping Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
              Resource Mapping
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#6B6B8D' }}>
              Map grades, competencies and effort as per SOW
            </p>
          </div>
          {!isReadOnly && (
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
                  costRate: 0 
                }
              ])} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 20px', 
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
                  !isReadOnly && ''
                ].filter(Boolean).map(h => (
                  <th key={h} style={{ 
                    padding: '14px 16px', 
                    textAlign: ['System Bill Rate', 'Override Bill Rate', 'Cost Rate', 'Hours', 'Revenue'].includes(h) ? 'right' : 'left', 
                    fontSize: '12px', 
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
                    <td style={{ padding: '12px 16px' }}>
                      <select 
                        value={r.grade} 
                        onChange={(e) => updateResource(r.id, 'grade', e.target.value)} 
                        disabled={isReadOnly} 
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          border: '1px solid #E8E8F0', 
                          borderRadius: '8px', 
                          fontSize: '13px', 
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select</option>
                        {grades.map(g => <option key={g.id} value={g.level}>{g.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select 
                        value={r.competency} 
                        onChange={(e) => updateResource(r.id, 'competency', e.target.value)} 
                        disabled={isReadOnly} 
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          border: '1px solid #E8E8F0', 
                          borderRadius: '8px', 
                          fontSize: '13px', 
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select</option>
                        {competencies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <input 
                        type="number" 
                        value={r.utilization} 
                        onChange={(e) => updateResource(r.id, 'utilization', Number(e.target.value))} 
                        disabled={isReadOnly} 
                        style={{ 
                          width: '70px', 
                          padding: '10px', 
                          border: '1px solid #E8E8F0', 
                          borderRadius: '8px', 
                          textAlign: 'center',
                          fontSize: '13px'
                        }} 
                      />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input 
                          type="number" 
                          value={r.months} 
                          onChange={(e) => updateResource(r.id, 'months', Number(e.target.value))} 
                          disabled={isReadOnly} 
                          style={{ 
                            width: '60px', 
                            padding: '10px', 
                            border: '1px solid #E8E8F0', 
                            borderRadius: '8px', 
                            textAlign: 'center',
                            fontSize: '13px'
                          }} 
                        />
                        <span style={{ fontSize: '12px', color: '#6B6B8D' }}>mo</span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#6B6B8D',
                      background: '#F5F5F9'
                    }}>
                      ${r.systemBillRate}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <input 
                        type="number" 
                        value={r.overrideBillRate} 
                        onChange={(e) => updateResource(r.id, 'overrideBillRate', Number(e.target.value))} 
                        disabled={isReadOnly} 
                        style={{ 
                          width: '90px', 
                          padding: '10px', 
                          border: '1px solid #E8E8F0', 
                          borderRadius: '8px', 
                          textAlign: 'right', 
                          background: 'white',
                          fontSize: '13px',
                          fontWeight: '600'
                        }} 
                      />
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      color: '#6B6B8D' 
                    }}>
                      ${r.costRate}
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      fontWeight: '600' 
                    }}>
                      {hours.toLocaleString()}
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      textAlign: 'right', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#00875A' 
                    }}>
                      ${(hours * r.overrideBillRate).toLocaleString()}
                    </td>
                    {!isReadOnly && (
                      <td style={{ padding: '12px 16px' }}>
                        <button 
                          onClick={() => setResourceAllocations(prev => prev.filter(x => x.id !== r.id))} 
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            border: 'none', 
                            background: '#DE350B15', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#DE350B' 
                          }}
                        >
                          <Icons.Trash />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ 
          marginTop: '24px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, #4A154B08 0%, #E5007D08 100%)', 
          borderRadius: '12px', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '40px' 
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Total Hours</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
              {totals.totalHours.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Total Cost</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#DE350B' }}>
              ${totals.totalCost.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Net Revenue (after discount)</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#00875A' }}>
              ${totals.discountedRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Overhead Expenses Section - Below Resource Mapping */}
      <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #E8E8F0' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
          Overhead Expenses
        </h3>
        
        <div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr 60px', 
              gap: '12px', 
              padding: '12px 16px', 
              background: '#F5F5F9', 
              borderRadius: '8px', 
              fontSize: '12px', 
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
                padding: '16px', 
                border: '1px solid #E8E8F0', 
                borderRadius: '10px', 
                marginBottom: '12px', 
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
                  padding: '10px', 
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
                  padding: '10px', 
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
                    padding: '10px', 
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
                    width: '40px', 
                    height: '40px', 
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
                padding: '10px 16px', 
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
          marginTop: '24px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, #4A154B08 0%, #E5007D08 100%)', 
          borderRadius: '12px' 
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Total Overhead</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
                ${overheadExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Billable Overhead</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#00875A' }}>
                ${totals.billableOverhead.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D' }}>Non-Billable Overhead</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#DE350B' }}>
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
        marginTop: '32px', 
        paddingTop: '24px', 
        borderTop: '1px solid #E8E8F0' 
      }}>
        <button 
          onClick={() => setStep(1)} 
          style={{ 
            padding: '12px 24px', 
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
          <button 
            onClick={() => setStep(3)} 
            style={{ 
              padding: '12px 32px', 
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
            Continue to Year-wise Comparison →
          </button>
        )}
      </div>
    </div>
  );
};

export default Step2ResourceAndOverhead;