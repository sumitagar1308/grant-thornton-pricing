import React from 'react';

const Step4Summary = ({
  selectedOpportunity,
  engagementTypes,
  salesStream,
  deliveryModel,
  expStartDate,
  expEndDate,
  multiYear,
  bdCost,
  resourceAllocations,
  overheadExpenses,
  discountPercent,
  totals,
  setStep
}) => {
  const getEngagementTypesText = () => {
    const types = [];
    if (engagementTypes.tm) types.push('Time & Material');
    if (engagementTypes.fixed) types.push('Fixed Fee');
    if (engagementTypes.success) types.push('Success Fee');
    if (engagementTypes.milestone) types.push('Milestone Based');
    return types.join(', ') || 'Not specified';
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
        Pricing Summary
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#6B6B8D' }}>
        Review your pricing configuration before submission
      </p>

      {/* Opportunity Information */}
      {selectedOpportunity && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
            Opportunity Details
          </h3>
          <div style={{ background: '#F5F5F9', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Opportunity</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                  {selectedOpportunity.name}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Client</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                  {selectedOpportunity.client}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Expected Fee</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#4A154B' }}>
                  ${selectedOpportunity.expectedFee.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Configuration */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
          Engagement Configuration
        </h3>
        <div style={{ background: '#F5F5F9', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Engagement Type</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                {getEngagementTypesText()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Sales Stream</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E', textTransform: 'capitalize' }}>
                {salesStream || 'Not specified'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Delivery Model</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E', textTransform: 'capitalize' }}>
                {deliveryModel || 'Not specified'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Project Duration</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                {expStartDate && expEndDate ? `${expStartDate} to ${expEndDate}` : 'Not specified'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Multi-Year</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                {multiYear ? 'Yes' : 'No'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>BD Cost</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                ₹{bdCost.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
          Financial Summary
        </h3>
        
        {/* Revenue Breakdown */}
        <div style={{ background: '#F5F5F9', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '600', color: '#6B6B8D' }}>
            Revenue Calculation
          </h4>
          {[
            { label: 'Gross Revenue (from resources)', value: totals.totalGrossRevenue, color: '#1A1A2E' },
            { label: `Discount (${discountPercent}%)`, value: -totals.discountAmount, color: '#DE350B' },
            { label: 'Discounted Revenue', value: totals.discountedRevenue, color: '#00A3E0' },
            { label: 'Billable Overhead', value: totals.billableOverhead, color: '#00875A' },
            { label: 'BD Cost', value: -bdCost, color: '#DE350B' }
          ].map((item, i) => (
            <div key={item.label} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0', 
              borderBottom: i < 4 ? '1px solid #E8E8F0' : 'none' 
            }}>
              <span style={{ fontSize: '14px', color: '#6B6B8D' }}>{item.label}</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: item.color }}>
                {item.value < 0 ? '-' : ''}${Math.abs(item.value).toLocaleString()}
              </span>
            </div>
          ))}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '16px 0 0', 
            marginTop: '8px',
            borderTop: '2px solid #4A154B'
          }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E' }}>Net Revenue</span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#4A154B' }}>
              ${totals.netRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Cost', value: `$${totals.totalCost.toLocaleString()}`, color: '#DE350B' },
            { label: 'Net Profit', value: `$${(totals.netRevenue - totals.totalCost).toLocaleString()}`, color: '#00875A' },
            { label: 'Margin', value: `${totals.margin.toFixed(1)}%`, color: '#4A154B' },
            { label: 'Recovery Rate', value: `${totals.recoveryPercent.toFixed(0)}%`, color: '#00A3E0' }
          ].map(metric => (
            <div key={metric.label} style={{ 
              padding: '16px', 
              background: 'white', 
              border: '1px solid #E8E8F0', 
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '8px' }}>
                {metric.label}
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: metric.color }}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Summary */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
          Resource Allocation
        </h3>
        <div style={{ background: '#F5F5F9', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '14px', color: '#6B6B8D', marginBottom: '12px' }}>
            Total Resources: {resourceAllocations.length}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Total Hours</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
                {totals.totalHours.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Net Rate/Hour</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#00A3E0' }}>
                ${totals.netRatePerHour.toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '4px' }}>Overhead Expenses</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#DE350B' }}>
                ${overheadExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        paddingTop: '24px', 
        borderTop: '1px solid #E8E8F0' 
      }}>
        <button 
          onClick={() => setStep(3)} 
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
        <button 
          onClick={() => alert('Pricing submitted for approval!')} 
          style={{ 
            flex: 1,
            padding: '12px 32px', 
            background: 'linear-gradient(135deg, #00875A 0%, #00A960 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px', 
            fontSize: '14px', 
            fontWeight: '600', 
            cursor: 'pointer', 
            boxShadow: '0 4px 12px rgba(0, 135, 90, 0.25)',
            transition: 'all 0.2s'
          }}
        >
          Submit for Approval
        </button>
        <button 
          onClick={() => alert('Pricing saved as draft!')} 
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
      </div>
    </div>
  );
};

export default Step4Summary;