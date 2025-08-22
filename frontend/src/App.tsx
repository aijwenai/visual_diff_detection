import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import { HistoryPanel } from './components/HistoryPanel';
import ResultsPanel from './components/ResultsPanel'
import SensitivitySlider from './components/SensitivitySlider'
import RegionSelector from './components/RegionSelector'
import { useComparison } from './hooks/useComparison'
interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}
function App() {
  const [before, setBefore] = useState<File | undefined>()
  const [after, setAfter] = useState<File | undefined>()
  const [threshold, setThreshold] = useState(0.1)
  const [beforeRegions, setBeforeRegions] = useState<Rectangle[]>([])
  const [afterRegions, setAfterRegions] = useState<Rectangle[]>([])
  const { result, loading, error, compare } = useComparison()
  // Handlers for file uploads
  const handleBeforeChange = (file: File | undefined) => {
      setBefore(file)
      if (file) {
      setBeforeRegions([]) // Reset regions when new file is selected
      }
  }
  const handleAfterChange = (file: File | undefined) => {
      setAfter(file)
      if (file) {
      setAfterRegions([]) // Reset regions when new file is selected
      }
  }
  const handleCompare = () => {
    if (before && after) {
      compare(before, after, threshold, beforeRegions, afterRegions)
    }
  }
  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: 30 }}>Duku AI Visual Regression MVP</h1>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <FileUpload
          label="Before Image"
          onFile={handleBeforeChange}
          selectedFile={before}
        />
        <FileUpload
          label="After Image"
          onFile={handleAfterChange}
          selectedFile={after}
        />
      </div>
      {/* Region selectors */}
      {before && (
        <div style={{ marginBottom: 20 }}>
          <h3>Select Regions to Ignore in Before Image:</h3>
          <RegionSelector
            imageSrc={URL.createObjectURL(before)}
            onRegionsChange={setBeforeRegions}
            regions={beforeRegions}
          />
        </div>
      )}
      {after && (
        <div style={{ marginBottom: 20 }}>
          <h3>Select Regions to Ignore in After Image:</h3>
          <RegionSelector
            imageSrc={URL.createObjectURL(after)}
            onRegionsChange={setAfterRegions}
            regions={afterRegions}
          />
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        <SensitivitySlider value={threshold} onChange={setThreshold} />
      </div>
      <button
        disabled={!before || !after || loading}
        onClick={handleCompare}
        style={{
          padding: '12px 24px',
          backgroundColor: before && after && !loading ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: before && after && !loading ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Comparing Images...' : 'Run Comparison'}
      </button>
      {error && (
        <div style={{
          marginTop: 15,
          padding: 12,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <div style={{ marginTop: 30 }}>
        <ResultsPanel result={result} loading={loading} />
      </div>
      <div style={{ marginTop: 30 }}>
        <HistoryPanel />
      </div>
    </div>
  )
}
export default App