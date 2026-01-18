import React, { useState } from 'react';
import { grades, competencies, rateMatrix } from '../components/data';
import { Icons } from './Icons';
import Step1OpportunitySelection from './pricing-steps/Step1OpportunitySelection';
import Step2ResourceAndOverhead from './pricing-steps/Step2ResourceAndOverhead';
import Step3YearWiseComparison from './pricing-steps/Step3YearWiseComparison';
import Step4Summary from './pricing-steps/Step4Summary';

const PricingFormView = ({ viewMode, selectedPricingId }) => {
  const [step, setStep] = useState(1);
  
  // NEW: Jump to summary step when opening in view mode from approvals
  React.useEffect(() => {
    if (viewMode === 'view' && selectedPricingId) {
      setStep(4); // Jump directly to Summary step
    } else {
      setStep(1); // Start from beginning for new pricing
    }
  }, [viewMode, selectedPricingId]);

  // Step 1: Opportunity & Engagement Details
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [engagementTypes, setEngagementTypes] = useState({
    tm: false,
    fixed: false,
    success: false,
    milestone: false
  });
  const [salesStream, setSalesStream] = useState('');
  const [deliveryModel, setDeliveryModel] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [multiYear, setMultiYear] = useState(false);
  const [bdCost, setBdCost] = useState(0);
  const [handleAllSolutions, setHandleAllSolutions] = useState(false);
const [solutionLeads, setSolutionLeads] = useState({});
const [childRequestsCreated, setChildRequestsCreated] = useState(false);
const [currentSolution, setCurrentSolution] = useState(null);
  
  // Step 2: Resource Mapping & Overhead
  const [resourceAllocations, setResourceAllocations] = useState([
    { 
      id: 1, 
      grade: 'D', 
      competency: '1', 
      utilization: 50, 
      months: 3, 
      systemBillRate: 650, 
      overrideBillRate: 650, 
      costRate: 325 
    },
    { 
      id: 2, 
      grade: 'M', 
      competency: '1', 
      utilization: 100, 
      months: 3, 
      systemBillRate: 380, 
      overrideBillRate: 380, 
      costRate: 190 
    },
    { 
      id: 3, 
      grade: 'SC', 
      competency: '1', 
      utilization: 100, 
      months: 3, 
      systemBillRate: 280, 
      overrideBillRate: 280, 
      costRate: 140 
    },
  ]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [overheadExpenses, setOverheadExpenses] = useState([
    { id: 1, category: 'Travel & Accommodation', amount: 25000, billablePercent: 100 },
    { id: 2, category: 'Software Licenses', amount: 8000, billablePercent: 50 },
  ]);
  
  // Step 3: Year-wise data (blank for now)
  const [yearWiseData, setYearWiseData] = useState([]);
  
  const isReadOnly = viewMode === 'view';

  // Calculate totals
  const calculateTotals = () => {
    const hoursPerMonth = 160;
    let totalCost = 0, totalGrossRevenue = 0;
    
    resourceAllocations.forEach(r => {
      const effectiveHours = hoursPerMonth * r.months * (r.utilization / 100);
      totalCost += effectiveHours * r.costRate;
      totalGrossRevenue += effectiveHours * r.overrideBillRate;
    });
    
    const discountedRevenue = totalGrossRevenue * (1 - discountPercent / 100);
    const totalOverhead = overheadExpenses.reduce((sum, e) => sum + e.amount, 0);
    const billableOverhead = overheadExpenses.reduce((sum, e) => sum + (e.amount * e.billablePercent / 100), 0);
    totalCost += totalOverhead;
    
    const netRevenue = discountedRevenue + billableOverhead - bdCost;
    const margin = netRevenue > 0 ? ((netRevenue - totalCost) / netRevenue) * 100 : 0;
    const totalHours = resourceAllocations.reduce((sum, r) => sum + (160 * r.months * (r.utilization / 100)), 0);
    
    return { 
      totalCost, 
      totalGrossRevenue, 
      discountedRevenue, 
      billableOverhead, 
      netRevenue, 
      margin, 
      totalHours, 
      netRatePerHour: totalHours > 0 ? netRevenue / totalHours : 0, 
      recoveryPercent: totalCost > 0 ? (netRevenue / totalCost) * 100 : 0,
      bdCost,
      discountAmount: totalGrossRevenue - discountedRevenue
    };
  };

  const totals = calculateTotals();

  // Update resource allocation
  const updateResource = (id, field, value) => {
    if (isReadOnly) return;
    setResourceAllocations(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        if (field === 'grade' || field === 'competency') {
          const key = `${updated.grade}-${updated.competency}`;
          const rates = rateMatrix[key];
          if (rates) { 
            updated.systemBillRate = rates.billRate;
            updated.overrideBillRate = rates.billRate;
            updated.costRate = rates.costRate; 
          }
        }
        return updated;
      }
      return r;
    }));
  };

  // Step Progress Indicator
  const StepIndicator = () => {
    const steps = ['Opportunity & Engagement', 'Resource & Overhead', 'Year-wise Comparison', 'Summary'];
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', gap: '0' }}>
        {steps.map((label, index) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: step > index + 1 ? '#00875A' : step === index + 1 ? 'linear-gradient(135deg, #4A154B 0%, #6B2D6C 100%)' : '#E8E8F0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: step >= index + 1 ? 'white' : '#6B6B8D', 
                fontWeight: '600', 
                fontSize: '14px', 
                boxShadow: step === index + 1 ? '0 4px 12px rgba(74, 21, 75, 0.25)' : 'none' 
              }}>
                {step > index + 1 ? <Icons.Check /> : index + 1}
              </div>
              <span style={{ 
                marginTop: '8px', 
                fontSize: '11px', 
                fontWeight: step === index + 1 ? '600' : '500', 
                color: step === index + 1 ? '#4A154B' : '#6B6B8D', 
                textAlign: 'center',
                maxWidth: '120px'
              }}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div style={{ 
                width: '60px', 
                height: '2px', 
                background: step > index + 1 ? '#00875A' : '#E8E8F0', 
                margin: '0 4px', 
                marginBottom: '28px' 
              }} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '32px' }}>
      <StepIndicator />
      
      {step === 1 && (
      <Step1OpportunitySelection
        selectedOpportunity={selectedOpportunity}
        setSelectedOpportunity={setSelectedOpportunity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        engagementTypes={engagementTypes}
        setEngagementTypes={setEngagementTypes}
        salesStream={salesStream}
        setSalesStream={setSalesStream}
        deliveryModel={deliveryModel}
        setDeliveryModel={setDeliveryModel}
        expStartDate={expStartDate}
        setExpStartDate={setExpStartDate}
        expEndDate={expEndDate}
        setExpEndDate={setExpEndDate}
        multiYear={multiYear}
        setMultiYear={setMultiYear}
        bdCost={bdCost}
        setBdCost={setBdCost}
        handleAllSolutions={handleAllSolutions}
        setHandleAllSolutions={setHandleAllSolutions}
        solutionLeads={solutionLeads}
        setSolutionLeads={setSolutionLeads}
        isReadOnly={isReadOnly}
        setStep={setStep}
      />
    )}
      
      {step === 2 && (
      <Step2ResourceAndOverhead
        resourceAllocations={resourceAllocations}
        setResourceAllocations={setResourceAllocations}
        updateResource={updateResource}
        discountPercent={discountPercent}
        setDiscountPercent={setDiscountPercent}
        overheadExpenses={overheadExpenses}
        setOverheadExpenses={setOverheadExpenses}
        totals={totals}
        isReadOnly={isReadOnly}
        setStep={setStep}
        grades={grades}
        competencies={competencies}
        handleAllSolutions={handleAllSolutions}
        selectedOpportunity={selectedOpportunity}
        solutionLeads={solutionLeads}
        currentSolution={currentSolution}
        setCurrentSolution={setCurrentSolution}
        childRequestsCreated={childRequestsCreated}
        setChildRequestsCreated={setChildRequestsCreated}
      />
    )}
      
      {step === 3 && (
        <Step3YearWiseComparison
          yearWiseData={yearWiseData}
          setYearWiseData={setYearWiseData}
          totals={totals}
          setStep={setStep}
          expStartDate={expStartDate}
          expEndDate={expEndDate}
          multiYear={multiYear}
          resourceAllocations={resourceAllocations}
          overheadExpenses={overheadExpenses}
          bdCost={bdCost}
          discountPercent={discountPercent}
        />
      )}
      
      {step === 4 && (
        <Step4Summary
          selectedOpportunity={selectedOpportunity}
          engagementTypes={engagementTypes}
          salesStream={salesStream}
          deliveryModel={deliveryModel}
          expStartDate={expStartDate}
          expEndDate={expEndDate}
          multiYear={multiYear}
          bdCost={bdCost}
          resourceAllocations={resourceAllocations}
          overheadExpenses={overheadExpenses}
          discountPercent={discountPercent}
          totals={totals}
          setStep={setStep}
        />
      )}
    </div>
  );
};

export default PricingFormView;