import React, { useState, useEffect, useCallback } from 'react';

const Step3YearWiseComparison = ({
  yearWiseData,
  setYearWiseData,
  totals,
  setStep,
  expStartDate,
  expEndDate,
  multiYear,
  resourceAllocations,
  overheadExpenses,
  bdCost,
  discountPercent
}) => {
  const [billRateEscalation, setBillRateEscalation] = useState(0);
  const [costRateEscalation, setCostRateEscalation] = useState(0);
  const [customBillRates] = useState({});
  const [customCostRates] = useState({});
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);

  // Calculate financial years breakdown - wrapped in useCallback to prevent infinite loop
  const calculateYearlyBreakdown = useCallback(() => {
    if (!expStartDate || !expEndDate) return [];

    const start = new Date(expStartDate);
    const end = new Date(expEndDate);
    const years = [];
    
    // Get financial year start (April 1st)
    const getFYStart = (date) => {
      const year = date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
      return new Date(year, 3, 1); // April 1st
    };

    const getFYEnd = (date) => {
      const year = date.getMonth() < 3 ? date.getFullYear() : date.getFullYear() + 1;
      return new Date(year, 2, 31); // March 31st
    };

    let currentFYStart = getFYStart(start);
    let yearIndex = 0;

    while (currentFYStart <= end) {
      const fyEnd = getFYEnd(currentFYStart);
      const periodStart = currentFYStart < start ? start : currentFYStart;
      const periodEnd = fyEnd > end ? end : fyEnd;

      if (periodStart <= periodEnd) {
        const months = Math.round((periodEnd - periodStart) / (1000 * 60 * 60 * 24 * 30.44));
        const fyLabel = `FY ${currentFYStart.getFullYear()}-${(currentFYStart.getFullYear() + 1).toString().slice(-2)}`;

        // Capture yearIndex in a closure-safe way
        const currentYearIndex = yearIndex;
        
        // Calculate escalation multiplier
        const billEscalationMultiplier = 1 + (billRateEscalation / 100) * currentYearIndex;
        const costEscalationMultiplier = 1 + (costRateEscalation / 100) * currentYearIndex;

        // Calculate revenue and cost for this year
        let yearRevenue = 0;
        let yearCost = 0;
        const hoursPerMonth = 160;

        resourceAllocations.forEach(r => {
          const effectiveMonths = Math.min(r.months, months);
          const effectiveHours = hoursPerMonth * effectiveMonths * (r.utilization / 100);
          
          // Check if custom rates exist for this year
          const customBillKey = `${r.id}-${currentYearIndex}`;
          const customCostKey = `${r.id}-${currentYearIndex}`;
          
          const billRate = customBillRates[customBillKey] !== undefined 
            ? customBillRates[customBillKey] 
            : r.overrideBillRate * billEscalationMultiplier;
            
          const costRate = customCostRates[customCostKey] !== undefined 
            ? customCostRates[customCostKey] 
            : r.costRate * costEscalationMultiplier;

          yearRevenue += effectiveHours * billRate;
          yearCost += effectiveHours * costRate;
        });

        // Apply discount
        const discountedRevenue = yearRevenue * (1 - discountPercent / 100);
        
        // Add overhead (proportional to months)
        const overheadForYear = overheadExpenses.reduce((sum, e) => sum + (e.amount * months / 12), 0);
        const billableOverheadForYear = overheadExpenses.reduce((sum, e) => sum + (e.amount * months / 12 * e.billablePercent / 100), 0);
        yearCost += overheadForYear;

        // Add BD Cost (only in first year)
        const bdCostForYear = currentYearIndex === 0 ? bdCost : 0;

        const netRevenue = discountedRevenue + billableOverheadForYear - bdCostForYear;
        const netProfit = netRevenue - yearCost;
        const margin = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

        years.push({
          year: currentYearIndex + 1,
          fyLabel,
          periodStart: periodStart.toISOString().split('T')[0],
          periodEnd: periodEnd.toISOString().split('T')[0],
          months,
          grossRevenue: yearRevenue,
          discountedRevenue,
          billableOverhead: billableOverheadForYear,
          bdCost: bdCostForYear,
          netRevenue,
          totalCost: yearCost,
          netProfit,
          margin,
          billEscalationMultiplier,
          costEscalationMultiplier
        });

        yearIndex++;
      }

      currentFYStart = new Date(currentFYStart.getFullYear() + 1, 3, 1);
    }

    return years;
  }, [expStartDate, expEndDate, billRateEscalation, costRateEscalation, customBillRates, customCostRates, resourceAllocations, overheadExpenses, bdCost, discountPercent]);

  useEffect(() => {
    if (expStartDate && expEndDate) {
      const breakdown = calculateYearlyBreakdown();
      setYearlyBreakdown(breakdown);
    }
  }, [expStartDate, expEndDate, calculateYearlyBreakdown]);

  const totalSummary = yearlyBreakdown.reduce((acc, year) => ({
    grossRevenue: acc.grossRevenue + year.grossRevenue,
    discountedRevenue: acc.discountedRevenue + year.discountedRevenue,
    billableOverhead: acc.billableOverhead + year.billableOverhead,
    bdCost: acc.bdCost + year.bdCost,
    netRevenue: acc.netRevenue + year.netRevenue,
    totalCost: acc.totalCost + year.totalCost,
    netProfit: acc.netProfit + year.netProfit
  }), {
    grossRevenue: 0,
    discountedRevenue: 0,
    billableOverhead: 0,
    bdCost: 0,
    netRevenue: 0,
    totalCost: 0,
    netProfit: 0
  });

  const avgMargin = totalSummary.netRevenue > 0 
    ? (totalSummary.netProfit / totalSummary.netRevenue) * 100 
    : 0;

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
        Year-wise Budget Comparison
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6B6B8D' }}>
        Configure year-on-year escalation and review financial projections
      </p>

      {/* Escalation Configuration */}
      <div style={{ marginBottom: '24px', padding: '20px', background: '#F5F5F9', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
          Escalation Configuration
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
              Bill Rate Escalation (% per year)
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[0, 5, 10, 15].map(val => (
                <button
                  key={val}
                  onClick={() => setBillRateEscalation(val)}
                  style={{
                    padding: '10px 20px',
                    background: billRateEscalation === val ? 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)' : 'white',
                    color: billRateEscalation === val ? 'white' : '#4A154B',
                    border: billRateEscalation === val ? 'none' : '1px solid #E8E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flex: 1
                  }}
                >
                  {val}%
                </button>
              ))}
              <input
                type="number"
                value={billRateEscalation}
                onChange={(e) => setBillRateEscalation(Number(e.target.value))}
                placeholder="Custom"
                style={{
                  width: '100px',
                  padding: '10px',
                  border: '1px solid #E8E8F0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
              Cost Rate Escalation (% per year)
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[0, 5, 10, 15].map(val => (
                <button
                  key={val}
                  onClick={() => setCostRateEscalation(val)}
                  style={{
                    padding: '10px 20px',
                    background: costRateEscalation === val ? 'linear-gradient(135deg, #00875A 0%, #00A960 100%)' : 'white',
                    color: costRateEscalation === val ? 'white' : '#00875A',
                    border: costRateEscalation === val ? 'none' : '1px solid #E8E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flex: 1
                  }}
                >
                  {val}%
                </button>
              ))}
              <input
                type="number"
                value={costRateEscalation}
                onChange={(e) => setCostRateEscalation(Number(e.target.value))}
                placeholder="Custom"
                style={{
                  width: '100px',
                  padding: '10px',
                  border: '1px solid #E8E8F0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: '12px', padding: '12px', background: '#00A3E015', borderRadius: '8px', fontSize: '12px', color: '#00A3E0' }}>
          <strong>Note:</strong> Escalation applies cumulatively. Year 1: Base rate, Year 2: Base × (1 + escalation%), Year 3: Base × (1 + 2×escalation%), etc.
        </div>
      </div>

      {/* Year-wise Breakdown Table */}
      {yearlyBreakdown.length > 0 && (
        <>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
              Financial Year Breakdown
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F5F5F9' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>Financial Year</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>Period</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>Months</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>Gross Revenue</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>After Discount</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>Billable OH</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>BD Cost</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>Net Revenue</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>Total Cost</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>Net Profit</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6B6B8D', textTransform: 'uppercase' }}>Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyBreakdown.map((year, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E8E8F0' }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>
                        {year.fyLabel}
                        <div style={{ fontSize: '11px', color: '#6B6B8D', fontWeight: '400', marginTop: '2px' }}>
                          Year {year.year}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6B6B8D' }}>
                        {new Date(year.periodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(year.periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#00A3E0' }}>
                        {year.months}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>
                        ${Math.round(year.grossRevenue).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#00A3E0' }}>
                        ${Math.round(year.discountedRevenue).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#00875A' }}>
                        ${Math.round(year.billableOverhead).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#DE350B' }}>
                        ${Math.round(year.bdCost).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: '#4A154B' }}>
                        ${Math.round(year.netRevenue).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#DE350B' }}>
                        ${Math.round(year.totalCost).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: '#00875A' }}>
                        ${Math.round(year.netProfit).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: year.margin >= 35 ? '#00875A' : year.margin >= 25 ? '#F5A623' : '#DE350B' }}>
                        {year.margin.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr style={{ background: 'linear-gradient(135deg, #4A154B08 0%, #E5007D08 100%)', fontWeight: '700' }}>
                    <td colSpan="3" style={{ padding: '14px 16px', fontSize: '14px', color: '#1A1A2E' }}>
                      TOTAL ({yearlyBreakdown.length} Years)
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', color: '#1A1A2E' }}>
                      ${Math.round(totalSummary.grossRevenue).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', color: '#00A3E0' }}>
                      ${Math.round(totalSummary.discountedRevenue).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', color: '#00875A' }}>
                      ${Math.round(totalSummary.billableOverhead).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', color: '#DE350B' }}>
                      ${Math.round(totalSummary.bdCost).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '15px', color: '#4A154B' }}>
                      ${Math.round(totalSummary.netRevenue).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', color: '#DE350B' }}>
                      ${Math.round(totalSummary.totalCost).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '15px', color: '#00875A' }}>
                      ${Math.round(totalSummary.netProfit).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '15px', color: avgMargin >= 35 ? '#00875A' : avgMargin >= 25 ? '#F5A623' : '#DE350B' }}>
                      {avgMargin.toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #4A154B15 0%, #6B2D6C15 100%)', borderRadius: '12px', border: '1px solid #4A154B25' }}>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Total Contract Value</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#4A154B' }}>
                ${Math.round(totalSummary.netRevenue).toLocaleString()}
              </div>
            </div>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #00875A15 0%, #00A96015 100%)', borderRadius: '12px', border: '1px solid #00875A25' }}>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Total Net Profit</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#00875A' }}>
                ${Math.round(totalSummary.netProfit).toLocaleString()}
              </div>
            </div>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #00A3E015 0%, #0094CC15 100%)', borderRadius: '12px', border: '1px solid #00A3E025' }}>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Average Margin</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#00A3E0' }}>
                {avgMargin.toFixed(1)}%
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #E5007D15 0%, #C4006A15 100%)', borderRadius: '12px', border: '1px solid #E5007D25' }}>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Engagement Duration</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#E5007D' }}>
                {yearlyBreakdown.length} {yearlyBreakdown.length === 1 ? 'Year' : 'Years'}
              </div>
            </div>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #F5A62315 0%, #E6941515 100%)', borderRadius: '12px', border: '1px solid #F5A62325' }}>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Avg Rate/Hour</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#F5A623' }}>
                ${(() => {
                  const totalHours = resourceAllocations.reduce((sum, r) => {
                    return sum + (160 * r.months * (r.utilization / 100));
                  }, 0) * yearlyBreakdown.length;
                  const avgRatePerHour = totalHours > 0 ? totalSummary.netRevenue / totalHours : 0;
                  return Math.round(avgRatePerHour).toLocaleString();
                })()}
              </div>
            </div>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #6B2D6C15 0%, #4A154B15 100%)', borderRadius: '12px', border: '1px solid #6B2D6C25' }}>
              <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Recovery %</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#6B2D6C' }}>
                {(() => {
                  const recoveryPercent = totalSummary.totalCost > 0 
                    ? (totalSummary.netRevenue / totalSummary.totalCost) * 100 
                    : 0;
                  return recoveryPercent.toFixed(0);
                })()}%
              </div>
            </div>
          </div>
        </>
      )}

      {yearlyBreakdown.length === 0 && (
        <div style={{ 
          padding: '60px 40px', 
          textAlign: 'center', 
          background: '#F5F5F9', 
          borderRadius: '12px',
          border: '2px dashed #E8E8F0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: '#1A1A2E' }}>
            No Date Range Configured
          </h3>
          <p style={{ margin: '0 auto', fontSize: '14px', color: '#6B6B8D', maxWidth: '500px' }}>
            Please go back to Step 1 and configure the Expected Start Date and Expected End Date to see year-wise breakdown.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '32px', 
        paddingTop: '24px', 
        borderTop: '1px solid #E8E8F0' 
      }}>
        <button 
          onClick={() => setStep(2)} 
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
          onClick={() => setStep(4)} 
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
          View Summary →
        </button>
      </div>
    </div>
  );
};

export default Step3YearWiseComparison;