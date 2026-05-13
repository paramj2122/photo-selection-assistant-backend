import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, ChevronRight, Calendar, Users, Image as ImageIcon } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch photographer id
  const { data: photographer } = await supabase
    .from('photographers')
    .select('id')
    .eq('email', user.email)
    .single()

  let jobs = []
  if (photographer) {
    const { data } = await supabase
      .from('jobs')
      .select('*, photos(count)')
      .eq('photographer_id', photographer.id)
      .order('created_at', { ascending: false })
    jobs = data || []
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-foreground/60 mt-1">Manage your shoots and client selections</p>
        </div>
        <Link
          href="/jobs/new"
          className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-accent-500/20 transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          Create New Job
        </Link>
      </div>

      <div className="glass rounded-2xl p-6 shadow-sm border border-foreground/5">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Calendar className="text-accent-500" size={24} />
          Recent Jobs
        </h2>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-foreground/10 bg-foreground/5">
            <ImageIcon className="mx-auto text-foreground/30 mb-4" size={48} />
            <h3 className="text-lg font-medium">No jobs yet</h3>
            <p className="text-foreground/60 mt-1 max-w-sm mx-auto">
              Create your first job to generate a magic link and start importing photos.
            </p>
            <Link
              href="/jobs/new"
              className="mt-6 inline-flex items-center gap-2 text-accent-600 font-medium hover:text-accent-700"
            >
              Get started <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job: any) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border border-foreground/10 hover:border-accent-500/50 bg-background/50 hover:bg-background transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold truncate group-hover:text-accent-600 transition-colors">
                      {job.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${job.status === 'draft' ? 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' : ''}
                      ${job.status === 'active' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' : ''}
                      ${job.status === 'selection_done' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' : ''}
                    `}>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-foreground/60">
                    <span className="flex items-center gap-1.5 truncate">
                      <Users size={14} />
                      {job.client_name}
                    </span>
                    <span className="hidden sm:inline text-foreground/30">•</span>
                    <span className="flex items-center gap-1.5">
                      <ImageIcon size={14} />
                      {job.photos[0]?.count || 0} photos
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-accent-500 font-medium group-hover:translate-x-1 transition-transform">
                  View details <ChevronRight size={18} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
