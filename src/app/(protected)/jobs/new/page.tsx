'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createJob } from './actions'

export default function NewJobPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createJob(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard" 
          className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Job</h1>
          <p className="text-foreground/60 mt-1">Create a new client gallery and magic link</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 md:p-8 shadow-sm border border-foreground/5 animate-slide-up">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-foreground/10 pb-2">Shoot Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2" htmlFor="title">
                Job Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-background/50 focus:bg-background focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all outline-none"
                placeholder="e.g., Rohan & Aditi Wedding Day 1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2" htmlFor="client_name">
                  Client Name *
                </label>
                <input
                  id="client_name"
                  name="client_name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-background/50 focus:bg-background focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all outline-none"
                  placeholder="Rohan Sharma"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2" htmlFor="client_email">
                  Client Email *
                </label>
                <input
                  id="client_email"
                  name="client_email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-background/50 focus:bg-background focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all outline-none"
                  placeholder="rohan@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2" htmlFor="selection_deadline">
                Selection Deadline (Optional)
              </label>
              <input
                id="selection_deadline"
                name="selection_deadline"
                type="datetime-local"
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-background/50 focus:bg-background focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-foreground/10 flex justify-end gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-accent-500/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
            >
              <Save size={18} />
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
