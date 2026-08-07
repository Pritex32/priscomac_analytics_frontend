import { useState } from 'react'
import { API_BASE } from '../utils/api'

const LICENSE_URL = import.meta.env.VITE_LICENSE_URL || 'https://priscomac.com/get-license'

export default function LandingPage({ onLicenseVerified }) {
  const [licenseKey, setLicenseKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('license_key', licenseKey)
      const res = await fetch(`${API_BASE}/verify-license`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Invalid license key.')
        return
      }
      onLicenseVerified(data)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-primary mb-2">Priscomac Analytics</h1>
        <p className="text-gray-600 mb-8">Upload your sales or inventory data and receive an AI-powered analysis.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="PMA-XXXX-XXXX-XXXX"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Enter License Key'}
          </button>
        </form>

        <div className="mt-6">
          <a
            href={LICENSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-primary text-primary font-semibold px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Get Your License
          </a>
        </div>
      </div>
    </div>
  )
}
