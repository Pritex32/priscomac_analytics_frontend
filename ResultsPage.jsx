import { useState, useCallback } from 'react'
import Plot from 'react-plotly.js'
import { API_BASE } from '../utils/api'

export default function AnalysisPage({ onAnalysisComplete, token }) {
  const [file, setFile] = useState(null)
  const [forecastPeriod, setForecastPeriod] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please upload a file.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('forecast_period', String(forecastPeriod))
      formData.append('token', token)

      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Analysis failed.')
        return
      }
      onAnalysisComplete(data)
    } catch (err) {
      setError('An error occurred during analysis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Priscomac Analytics</h1>
          <span className="text-sm text-gray-500">Demand Forecast Tool</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-2">Upload Your Data</h2>
        <p className="text-gray-600 mb-8">Upload a CSV or Excel file with date, demand, and product columns.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-primary bg-red-50' : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="hidden"
            />
            <p className="text-gray-600">
              {file ? file.name : 'Drag and drop your file here, or click to browse'}
            </p>
            <p className="text-sm text-gray-400 mt-2">.xlsx, .xls, .csv</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Period</label>
            <select
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating Forecast...' : 'Generate Forecast'}
          </button>
        </form>
      </main>
    </div>
  )
}
