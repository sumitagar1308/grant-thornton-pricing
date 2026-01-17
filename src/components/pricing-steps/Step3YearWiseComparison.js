import React from 'react';

const Step3YearWiseComparison = ({ yearWiseData, setYearWiseData, totals, setStep }) => {
  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8F0', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>
        Year-wise Budget Comparison
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6B6B8D' }}>
        Compare pricing budget across financial years
      </p>

      {/* Placeholder Content */}
      <div style={{ 
        padding: '80px 40px', 
        textAlign: 'center', 
        background: '#F5F5F9', 
        borderRadius: '12px',
        border: '2px dashed #E8E8F0'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: '#1A1A2E' }}>
          Year-wise Comparison
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#6B6B8D', maxWidth: '500px', margin: '0 auto' }}>
          This section will display year-wise budget breakup and comparison. Features will be added in the next update.
        </p>
      </div>

      {/* Placeholder Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '32px' }}>
        {[
          { label: 'Total Years', value: '-', color: '#4A154B' },
          { label: 'Average Annual Revenue', value: '$0', color: '#00A3E0' },
          { label: 'Growth Rate', value: '0%', color: '#00875A' }
        ].map(item => (
          <div key={item.label} style={{ 
            padding: '20px', 
            background: 'white', 
            border: '1px solid #E8E8F0', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#6B6B8D', marginBottom: '8px' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: item.color }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '40px', 
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