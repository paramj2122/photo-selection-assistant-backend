'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import { login } from './actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="glass w-full max-w-md p-8 rounded-2xl shadow-xl z-10 animate-fade-in relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent-500 text-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <Camera size={32} />
          </div>
          <h1 className="text-3xl font-bold text-center text-foreground">Photographer Portal</h1>
          <p className="text-foreground/60 text-center mt-2">Sign in to manage your shoots</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-background/50 focus:bg-background focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 outline-none text-foreground"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-background/50 focus:bg-background focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 outline-none text-foreground"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-accent-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
