import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, Info, FileText, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react'
import FlowCanvas from './components/FlowCanvas'
import SidePanel from './components/SidePanel'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [selectedStep, setSelectedStep] = useState(null)

  const loadingMessages = [
    "Uploading document...",
    "Analyzing content...",
    "Generating your action plan..."
  ]

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < 2 ? prev + 1 : prev));
      }, 2000); // Progress message every 2 seconds
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    setSelectedStep(null)
    const formData = new FormData()
    formData.append('document', file)

    try {
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      })
      const json = await response.json()
      
      if (json.status === 'success') {
        if (!json.data.flow.nodes || json.data.flow.nodes.length === 0) {
          setError("We couldn’t fully understand this document.")
        } else {
          setResult(json.data)
        }
      } else {
        setError("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteStep = (stepId) => {
    if (!result) return

    const nodes = [...result.flow.nodes]
    const currentIndex = nodes.findIndex(n => n.id === stepId)
    
    if (currentIndex !== -1 && nodes[currentIndex].status === 'active') {
      // 1. Mark current as completed
      nodes[currentIndex].status = 'completed'
      
      // 2. Mark next as active (if exists)
      if (currentIndex + 1 < nodes.length) {
        nodes[currentIndex + 1].status = 'active'
      }

      setResult({
        ...result,
        flow: {
          ...result.flow,
          nodes
        }
      })
      
      // Update the selected step preview
      setSelectedStep(nodes[currentIndex])
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setSelectedStep(null)
    setError(null)
  }

  return (
    <div className="App" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ color: 'var(--indigo)', fontSize: '2.5rem', marginBottom: '8px', margin: 0 }}>FlowSaarthi</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Simple guides for your government documents</p>
        </div>
        {result && (
          <button 
            onClick={handleReset}
            style={{
              background: 'white',
              border: '1px solid var(--gray-border)',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-dark)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <RefreshCw size={18} /> Start New
          </button>
        )}
      </header>

      <main>
        {!result && (
          <section className="upload-container" style={{ 
            background: 'white', 
            padding: '32px', 
            borderRadius: '20px', 
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".jpg,.jpeg,.png,.pdf"
            style={{ marginBottom: '20px', display: 'block', margin: '0 auto 20px' }}
          />
          <button 
            onClick={handleUpload} 
            disabled={loading || !file}
            style={{
              background: 'var(--indigo)',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'transform 0.1s'
            }}
          >
            {loading ? 'Analyzing Document...' : 'Upload & Start Flow'}
          </button>
        </section>
      )}

        {error && (
          <div className="error-card" style={{
            background: '#fef2f2',
            color: '#b91c1c',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid #fee2e2'
          }}>
            <AlertCircle size={24} />
            <span style={{ fontWeight: '500' }}>{error}</span>
          </div>
        )}
        
        {loading && (
          <div className="loading-screen fade-in" style={{
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease'
          }}>
            <Loader2 className="animate-spin" size={48} color="var(--indigo)" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
              {loadingMessages[loadingStep]}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              We're simplifying your document complex into actionable steps.
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="content-grid fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '32px' }}>
            {/* 🟦 Explanation Hero Card */}
            <section className="analysis-card" style={{ 
              background: 'white', 
              padding: '32px', 
              borderRadius: '24px', 
              borderLeft: '8px solid var(--indigo)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>{result.title}</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {result.caseType.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ 
                  background: result.urgency.toLowerCase() === 'high' ? '#fee2e2' : '#fef3c7', 
                  color: result.urgency.toLowerCase() === 'high' ? '#991b1b' : '#92400e',
                  padding: '6px 16px', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem', 
                  fontWeight: '700' 
                }}>
                  {result.urgency} Urgency
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  {result.summary}
                </p>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {result.meaning}
                </p>
              </div>
            </section>

            {/* 🟢 The Interactive Flow */}
            <section className="flow-container">
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', color: 'var(--text-dark)', textAlign: 'center' }}>
                Your Step-by-Step Guide
              </h2>
              <FlowCanvas 
                nodes={result.flow.nodes} 
                edges={result.flow.edges} 
                onNodeSelect={setSelectedStep} 
              />
            </section>
          </div>
        )}
      </main>

      <SidePanel 
        step={selectedStep} 
        onClose={() => setSelectedStep(null)} 
        onComplete={handleCompleteStep}
      />
    </div>
  )
}

export default App
