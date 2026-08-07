import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import AnalysisPage from './pages/AnalysisPage'
import ResultsPage from './pages/ResultsPage'
import { useSession } from './utils/api'

function App() {
  const [page, setPage] = useState('landing')
  const [analysisData, setAnalysisData] = useState(null)
  const { session, setSessionToken, clearSession } = useSession()

  const handleLicenseVerified = (data) => {
    setSessionToken(data.token)
    setPage('analysis')
  }

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data)
    setPage('results')
  }

  const handleRunAnother = () => {
    setAnalysisData(null)
    setPage('analysis')
  }

  if (session && page === 'landing') {
    setPage('analysis')
  }

  return (
    <div className="min-h-screen bg-white">
      {page === 'landing' && (
        <LandingPage onLicenseVerified={handleLicenseVerified} />
      )}
      {page === 'analysis' && (
        <AnalysisPage onAnalysisComplete={handleAnalysisComplete} token={session} />
      )}
      {page === 'results' && analysisData && (
        <ResultsPage data={analysisData} onRunAnother={handleRunAnother} />
      )}
    </div>
  )
}

export default App
