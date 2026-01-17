import React from 'react';
import { opportunities } from '../../components/data';
import { Icons } from '../Icons';

const Step1OpportunitySelection = ({
  selectedOpportunity,
  setSelectedOpportunity,
  searchQuery,
  setSearchQuery,
  engagementTypes,
  setEngagementTypes,
  salesStream,
  setSalesStream,
  deliveryModel,
  setDeliveryModel,
  expStartDate,
  setExpStartDate,
  expEndDate,
  setExpEndDate,
  multiYear,
  setMultiYear,
  bdCost,
  setBdCost,
  isReadOnly,
  setStep
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [solutionLeads, setSolutionLeads] = React.useState({});
  
  const filteredOpportunities = opportunities.filter(opp => 
    opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize solution leads when opportunity is selected
  React.useEffect(() => {
    if (selectedOpportunity && selectedOpportunity.solutions) {
      const leads = {};
      selectedOpportunity.solutions.forEach(sol => {
        leads[sol.name] = sol.lead || '';
      });
      setSolutionLeads(leads);
    }
  }, [selectedOpportunity]);

  // Validate if can proceed
  const canProceed = selectedOpportunity && 
    (engagementTypes.tm || engagementTypes.fixed || engagementTypes.success || engagementTypes.milestone) &&
    salesStream && 
    deliveryModel && 
    expStartDate && 
    expEndDate;

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
        Select Opportunity & Configure Engagement
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#6B6B8D' }}>
        Choose an opportunity and configure engagement parameters
      </p>

      {/* Opportunity Selection Section */}
      <div style={{ marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid #E8E8F0' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
          Opportunity Selection
        </h3>
        
        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
            Search Opportunity *
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search by ID, name, or client..." 
              value={selectedOpportunity ? selectedOpportunity.name : searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedOpportunity) setSelectedOpportunity(null);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              disabled={isReadOnly}
              style={{ 
                width: '100%', 
                padding: '12px 40px 12px 16px', 
                border: '1px solid #E8E8F0', 
                borderRadius: '10px', 
                fontSize: '14px',
                outline: 'none'
              }} 
            />
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B6B8D' }}>
              <Icons.Search />
            </div>
          </div>
          
          {/* Dropdown for opportunities */}
          {showDropdown && !selectedOpportunity && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              marginTop: '4px',
              background: 'white', 
              border: '1px solid #E8E8F0', 
              borderRadius: '10px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              maxHeight: '400px', 
              overflowY: 'auto',
              zIndex: 1000
            }}>
              {filteredOpportunities.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6B6B8D', fontSize: '14px' }}>
                  {searchQuery ? `No opportunities found matching "${searchQuery}"` : 'Start typing to search opportunities'}
                </div>
              ) : (
                <>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #E8E8F0', fontSize: '12px', fontWeight: '600', color: '#6B6B8D' }}>
                    {searchQuery ? `${filteredOpportunities.length} Results` : 'Recent Opportunities'}
                  </div>
                  {filteredOpportunities.map(opp => (
                    <div 
                      key={opp.id} 
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (!isReadOnly) {
                          setSelectedOpportunity(opp);
                          setSearchQuery(opp.name);
                          setShowDropdown(false);
                        }
                      }}
                      style={{ 
                        padding: '14px 16px', 
                        borderBottom: '1px solid #E8E8F0', 
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F5F5F9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>{opp.name}</div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#4A154B' }}>
                          ${opp.amount.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B6B8D' }}>
                        {opp.id} • {opp.client} • {opp.solution}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <div style={{ fontSize: '11px', color: '#6B6B8D' }}>
                          Owner: {opp.enquiryOwner}
                        </div>
                        <span style={{ 
                          fontSize: '10px', 
                          background: '#00A3E015', 
                          color: '#00A3E0', 
                          padding: '3px 8px', 
                          borderRadius: '6px', 
                          fontWeight: '500' 
                        }}>
                          {opp.phase}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {selectedOpportunity && (
          <div style={{ background: '#F5F5F9', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
              Opportunity Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: 'Opp Code', value: selectedOpportunity.code },
                { label: 'Opp Name', value: selectedOpportunity.name },
                { label: 'Client Name', value: selectedOpportunity.client },
                { label: 'Enquiry Owner', value: selectedOpportunity.enquiryOwner },
                { label: 'Expected Fee (Billing)', value: `${selectedOpportunity.billingCurrency} ${selectedOpportunity.expectedFee.toLocaleString()}` },
                { label: 'Expected Fee (INR)', value: `₹${selectedOpportunity.expectedFeeINR.toLocaleString()}` },
                { label: 'Industry', value: selectedOpportunity.industry },
                { label: 'Market', value: selectedOpportunity.market },
                { label: 'Sub Market', value: selectedOpportunity.subMarket },
                { label: 'Key Account', value: selectedOpportunity.keyAccount },
                { label: 'Legal Entity', value: selectedOpportunity.legalEntity },
                { label: 'Opportunity Status', value: selectedOpportunity.status },
                { label: 'Billing Currency', value: selectedOpportunity.billingCurrency }
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '11px', color: '#6B6B8D', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Solutions Section */}
            {selectedOpportunity.solutions && selectedOpportunity.solutions.length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E8E8F0' }}>
                <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                  Solutions
                </h4>
                <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #E8E8F0', overflow: 'hidden' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '40px 2fr 1fr 2fr', 
                    gap: '12px', 
                    padding: '12px 16px', 
                    background: '#F5F5F9', 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: '#6B6B8D', 
                    textTransform: 'uppercase' 
                  }}>
                    <div>#</div>
                    <div>Solution</div>
                    <div>Type</div>
                    <div>Solution Lead *</div>
                  </div>
                  {selectedOpportunity.solutions.map((sol, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '40px 2fr 1fr 2fr', 
                        gap: '12px', 
                        padding: '14px 16px', 
                        borderTop: '1px solid #E8E8F0',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ fontSize: '13px', color: '#6B6B8D' }}>{index + 1}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E' }}>
                        {sol.name}
                      </div>
                      <div>
                        <span style={{ 
                          fontSize: '11px', 
                          background: sol.isPrimary ? '#4A154B15' : '#00A3E015', 
                          color: sol.isPrimary ? '#4A154B' : '#00A3E0', 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          fontWeight: '600' 
                        }}>
                          {sol.isPrimary ? 'Primary' : 'Secondary'}
                        </span>
                      </div>
                      <div>
                        <input 
                          type="text" 
                          placeholder="Enter solution lead name"
                          value={solutionLeads[sol.name] || ''}
                          onChange={(e) => setSolutionLeads({...solutionLeads, [sol.name]: e.target.value})}
                          disabled={isReadOnly}
                          style={{ 
                            width: '100%', 
                            padding: '10px 12px', 
                            border: '1px solid #E8E8F0', 
                            borderRadius: '8px', 
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Engagement Details Section */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1A1A2E' }}>
          Engagement Details
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left Column */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '12px' }}>
                Engagement Type (Select all that apply) *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { key: 'tm', label: 'Time & Material' },
                  { key: 'fixed', label: 'Fixed Fee' },
                  { key: 'success', label: 'Success Fee' },
                  { key: 'milestone', label: 'Milestone Based' }
                ].map(type => (
                  <label 
                    key={type.key} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '12px 16px', 
                      border: '1px solid #E8E8F0', 
                      borderRadius: '10px', 
                      cursor: 'pointer', 
                      background: engagementTypes[type.key] ? '#4A154B08' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={engagementTypes[type.key]}
                      onChange={(e) => setEngagementTypes({...engagementTypes, [type.key]: e.target.checked})}
                      disabled={isReadOnly}
                      style={{ width: '18px', height: '18px', accentColor: '#4A154B', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
                Sales Stream *
              </label>
              <select 
                value={salesStream} 
                onChange={(e) => setSalesStream(e.target.value)} 
                disabled={isReadOnly}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '10px', 
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select Sales Stream</option>
                <option value="manpower">Manpower</option>
                <option value="software">Software</option>
                <option value="license">License</option>
                <option value="hardware">Hardware</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
                Delivery Model *
              </label>
              <select 
                value={deliveryModel} 
                onChange={(e) => setDeliveryModel(e.target.value)} 
                disabled={isReadOnly}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '10px', 
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select Delivery Model</option>
                <option value="offshore">Offshore</option>
                <option value="onshore">Onshore</option>
                <option value="hybrid">Hybrid</option>
                <option value="ikcc">IKCC</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
                Expected Start Date *
              </label>
              <input 
                type="date" 
                value={expStartDate}
                onChange={(e) => setExpStartDate(e.target.value)}
                disabled={isReadOnly}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '10px', 
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
                Expected End Date *
              </label>
              <input 
                type="date" 
                value={expEndDate}
                onChange={(e) => setExpEndDate(e.target.value)}
                disabled={isReadOnly}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '10px', 
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '12px 16px', 
                border: '1px solid #E8E8F0', 
                borderRadius: '10px', 
                cursor: 'pointer', 
                background: multiYear ? '#4A154B08' : 'white',
                transition: 'all 0.2s'
              }}>
                <input 
                  type="checkbox" 
                  checked={multiYear}
                  onChange={(e) => setMultiYear(e.target.checked)}
                  disabled={isReadOnly}
                  style={{ width: '18px', height: '18px', accentColor: '#4A154B', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Multi-Year Engagement</span>
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>
                BD Cost (₹)
              </label>
              <input 
                type="number" 
                value={bdCost}
                onChange={(e) => setBdCost(Number(e.target.value))}
                disabled={isReadOnly}
                placeholder="Enter BD Cost"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #E8E8F0', 
                  borderRadius: '10px', 
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E8E8F0' }}>
        {!isReadOnly && (
          <button 
            onClick={() => setStep(2)} 
            disabled={!canProceed} 
            style={{ 
              padding: '12px 32px', 
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
            Continue to Resource Mapping →
          </button>
        )}
      </div>
    </div>
  );
};

export default Step1OpportunitySelection;