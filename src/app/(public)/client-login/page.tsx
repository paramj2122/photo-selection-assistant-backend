'use client'

import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ClientLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const jobCode = formData.get('jobCode') as string
    const password = formData.get('password') as string

    // TODO: Connect to backend check.
    // For now, this is a stub that simulates a login and expects the jobCode to be the magic_link_token.
    setTimeout(() => {
      if (jobCode.length > 5) {
        router.push(`/gallery/${jobCode}`)
      } else {
        setError('Invalid Job Code or Password')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass w-full max-w-md p-8 rounded-2xl shadow-xl animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg mb-4">
            <ImageIcon size={32} />
          </div>
          <h1 className="text-3xl font-bold text-center text-foreground">Client Access</h1>
          <p className="text-foreground/60 text-center mt-2">Enter your job code to view photos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2" htmlFor="jobCode">
              Job Code
            </label>
            <input
              id="jobCode"
              name="jobCode"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-background/50 focus:bg-background focus:ring-2 focus:ring-foreground focus:border-transparent transition-all duration-200 outline-none text-foreground"
              placeholder="e.g. jdoe-xyz123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2" htmlFor="password">
              Password (Optional)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-background/50 focus:bg-background focus:ring-2 focus:ring-foreground focus:border-transparent transition-all duration-200 outline-none text-foreground"
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
            className="w-full bg-foreground hover:bg-foreground/90 text-background font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Accessing...' : 'View Gallery'}
          </button>
        </form>
      </div>
    </div>
  )
}
