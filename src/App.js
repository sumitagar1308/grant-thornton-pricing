import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import PricingFormView from './components/PricingFormView';
import ApprovalsView from './components/ApprovalsView';
import MastersView from './components/MastersView';
import ConsolidationDashboard from './components/ConsolidationDashboard';


function App() {
  //const [activeView, setActiveView] = useState('dashboard');
  const [activeView, setActiveView] = useState('consolidation');
  const [selectedPricingId, setSelectedPricingId] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [viewMode, setViewMode] = useState('new');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [childRequests, setChildRequests] = useState([
  // Mock data for demonstration
  {
    id: 'PR-2024-045.001',
    solutionName: 'Technology Consulting',
    solutionLead: 'Michael Chen',
    status: 'submitted', // pending, submitted, approved, revision_requested
    submittedAt: '2024-01-16T14:20:00Z',
    netRevenue: 300000,
    margin: 44,
    recovery: 170
  },
  {
    id: 'PR-2024-045.002',
    solutionName: 'Process Automation',
    solutionLead: 'David Lee',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z'
  }
]);

  const sidebarWidth = isSidebarCollapsed ? 80 : 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFC' }}>
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Main content wrapper */}
      <div style={{ 
        marginLeft: `${sidebarWidth}px`,
        flex: 1,
        transition: 'margin-left 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {activeView === 'dashboard' && (
          <>
            <Header 
              title="Dashboard" 
              subtitle="Overview of pricing activities and approvals" 
            />
            <DashboardView 
              setActiveView={setActiveView}
              setSelectedPricingId={setSelectedPricingId}
              setViewMode={setViewMode}
            />
          </>
        )}
        
        {activeView === 'pricing' && (
          <>
            <Header 
              title="Create New Pricing" 
              subtitle="Initiate pricing for an engagement opportunity" 
            />
            <PricingFormView 
              viewMode={viewMode}
              selectedPricingId={selectedPricingId}
            />
          </>
        )}
        
        {activeView === 'approvals' && (
          <>
            <Header 
              title="Approvals" 
              subtitle="Review and approve pricing proposals" 
            />
            <ApprovalsView 
              setActiveView={setActiveView}
              setSelectedPricingId={setSelectedPricingId}
              setViewMode={setViewMode}
            />
          </>
        )}
        
        {activeView === 'masters' && (
          <>
            <Header 
              title="Masters" 
              subtitle="Manage rate matrices, grades, and approval workflows" 
            />
            <MastersView />
          </>
        )}

        {activeView === 'consolidation' && (
        <ConsolidationDashboard 
          parentRequestId={selectedPricingId || "PR-2024-045"}
          selectedOpportunity={selectedOpportunity }
          primarySolution={selectedOpportunity?.solutions?.find(s => s.isPrimary)}
          secondarySolutions={selectedOpportunity?.solutions?.filter(s => !s.isPrimary) || []}
          solutionLeads={{}} // This will come from the pricing form state when integrated
          childRequests={childRequests}
          setChildRequests={setChildRequests}
          onProceedToStep3={() => {
            setActiveView('pricing');
            setViewMode('edit');
            // Logic to set step to 3 will be added when we integrate with pricing flow
          }}
          setActiveView={setActiveView}
        />
      )}
      </div>
    </div>
  );
}

export default App;