import { useState, useEffect, useCallback } from 'react'
import { API_BASE } from '../utils/api'

export default function GetLicense({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [licenseKey, setLicenseKey] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', email)
      const res = await fetch(`${API_BASE}/paystack/init`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok || !data.authorization_url) {
        setError(data.detail || 'Payment initialization failed.')
        return
      }
      window.location.href = data.authorization_url
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyPayment = useCallback(async (reference) => {
    setVerifying(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/paystack/verify/${encodeURIComponent(reference)}`)
      const data = await res.json()
      if (res.ok && data.paid && data.license) {
        setLicenseKey(data.license)
      } else {
        const message = data.detail || data.error || 'Payment not confirmed yet.'
        setError(message)
      }
    } catch (err) {
      setError('An error occurred while verifying payment.')
    } finally {
      setVerifying(false)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference')
    if (reference) {
      verifyPayment(reference)
    }
  }, [verifyPayment])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  if (licenseKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your license key is ready below.</p>

          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">Your License Key</p>
            <p className="text-2xl font-mono font-bold text-primary break-all">{licenseKey}</p>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors mb-4"
          >
            {copied ? 'License Copied!' : 'Copy License'}
          </button>

          <p className="text-sm text-gray-500">
            Save this license key somewhere safe. You will need it to activate the product later.
          </p>

          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 text-primary underline text-sm"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    )
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Verifying Payment...</h1>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Get Your License</h1>
        <p className="text-gray-600 mb-8">Purchase a license to unlock Priscomac Analytics.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Initializing...' : 'Pay $30.00 with Paystack'}
          </button>
        </form>

        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 text-gray-500 underline text-sm"
          >
            Back
          </button>
        )}
      </div>
    </div>
  )
}
