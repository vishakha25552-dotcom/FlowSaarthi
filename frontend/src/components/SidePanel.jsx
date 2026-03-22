import React from 'react';
import { X, FileText, ExternalLink, Info, CheckCircle } from 'lucide-react';

const SidePanel = ({ step, onClose, onComplete }) => {
  if (!step) return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: '350px',
      height: '100vh',
      background: 'white',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'var(--text-muted)',
      textAlign: 'center'
    }}>
      <Info size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
      <p>Select a step to see details</p>
    </div>
  );

  return (
    <div className="side-panel" style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: '350px',
      height: '100vh',
      background: 'white',
      boxShadow: '-10px 0 15px -3px rgba(0, 0, 0, 0.03)',
      padding: '32px 24px',
      zIndex: 1000,
      overflowY: 'auto',
      borderLeft: '1px solid var(--gray-border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: '700' }}>{step.title}</h2>
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 'bold', 
            textTransform: 'uppercase',
            color: step.status === 'completed' ? 'var(--teal)' : 'var(--text-muted)'
          }}>
            {step.status}
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
      </div>

      {step.status === 'active' && (
        <button 
          onClick={() => onComplete(step.id)}
          style={{
            width: '100%',
            background: 'var(--teal-soft)',
            color: '#065f46',
            border: 'none',
            padding: '12px',
            borderRadius: '10px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            marginBottom: '32px'
          }}
        >
          <CheckCircle size={20} /> Mark as Complete
        </button>
      )}

      {step.status === 'completed' && (
        <div style={{
          background: 'var(--teal-soft)',
          color: '#065f46',
          padding: '12px',
          borderRadius: '10px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px'
        }}>
          <CheckCircle size={20} /> Completed
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '0.75rem', color: 'var(--indigo)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          What to do
        </h3>
        <p style={{ color: 'var(--text-dark)', lineHeight: '1.6', fontSize: '0.95rem' }}>{step.description}</p>
      </div>

      {step.required_documents?.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '0.75rem', color: 'var(--indigo)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Documents needed
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {step.required_documents.map((doc, i) => (
              <li key={i} style={{ 
                background: 'var(--gray-light)', 
                padding: '8px 12px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                fontSize: '0.9rem',
                border: '1px solid var(--gray-border)'
              }}>
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {step.links?.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.75rem', color: 'var(--indigo)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Links
          </h3>
          {step.links.map((link, i) => (
            <a key={i} href={link} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--indigo)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Open Portal <ExternalLink size={14} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidePanel;
