import React, { useState } from 'react';
import { theme, opportunities, grades, competencies, rateMatrix } from './components/data';
import { Icons, GTLogo } from './components/Icons';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import PricingFormView from './components/PricingFormView';
import ApprovalsView from './components/ApprovalsView';
import MastersView from './components/MastersView';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedPricingId, setSelectedPricingId] = useState(null);
  const [viewMode, setViewMode] = useState('new'); // 'new', 'edit', 'view'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFC' }}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div style={{ flex: 1, marginLeft: '260px' }}>
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
            <ApprovalsView setActiveView={setActiveView} />
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
      </div>
    </div>
  );
}

export default App;