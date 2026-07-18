import React from 'react';

// Shared page heading: big title, muted subtitle, optional action button on
// the right. Every page renders this so the header styling lives in one place.
const PageHeader = ({ title, subtitle, action }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: '2rem', gap: '1rem',
  }}>
    <div style={{ minWidth: 0 }}>
      <h1 style={{
        fontSize: '1.75rem', fontWeight: 800, color: '#efefef',
        letterSpacing: '-0.5px', marginBottom: '0.2rem',
      }}>
        {title}
      </h1>
      {subtitle && <p style={{ color: '#383838', fontSize: '0.82rem' }}>{subtitle}</p>}
    </div>
    {action && <div style={{ flexShrink: 0 }}>{action}</div>}
  </div>
);

export default PageHeader;
