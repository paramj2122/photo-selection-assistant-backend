import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Copy, ExternalLink, Terminal, CheckCircle2, Image as ImageIcon } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function JobDetailsPage({ params }: { params: { jobId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch job details along with photo count and selections
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      photos(id),
      selections(is_selected, selected_by)
    `)
    .eq('id', params.jobId)
    .single()

  if (error || !job) {
    notFound()
  }

  // Calculate stats
  const totalPhotos = job.photos.length
  const clientSelections = job.selections.filter((s: any) => s.is_selected && s.selected_by === 'client').length
  const photographerSelections = job.selections.filter((s: any) => s.is_selected && s.selected_by === 'photographer').length

  // Generate the full magic link
  // In production, you would use NEXT_PUBLIC_SITE_URL or similar
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const magicLink = `${baseUrl}/gallery/${job.magic_link_token}`

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="text-foreground/60 mt-1">Client: {job.client_name} ({job.client_email})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Magic Link Card */}
        <div className="md:col-span-2 glass rounded-2xl p-6 border border-foreground/5 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="text-accent-500" size={20} />
            Client Gallery Link
          </h2>
          <p className="text-sm text-foreground/70 mb-4">
            Send this secret link to your client so they can select their photos.
          </p>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={magicLink}
              className="flex-1 px-4 py-2.5 rounded-xl border border-foreground/10 bg-background/50 text-foreground font-mono text-sm outline-none"
            />
            {/* Note: Clipboard API works best in Client Components, but for simplicity here we can use a small client wrapper or just show it. 
                For a real app, make a small <CopyButton text={magicLink} /> client component. */}
            <a 
              href={magicLink}
              target="_blank"
              rel="noreferrer"
              className="bg-foreground/5 hover:bg-foreground/10 text-foreground px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              Open
            </a>
          </div>
        </div>

        {/* Stats Card */}
        <div className="glass rounded-2xl p-6 border border-foreground/5 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Selection Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground/70 flex items-center gap-2"><ImageIcon size={16}/> Total Photos</span>
              <span className="font-semibold">{totalPhotos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/70 flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Client Selected</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{clientSelections}</span>
            </div>
          </div>
        </div>

        {/* Export Instructions Card */}
        <div className="md:col-span-3 glass rounded-2xl p-6 border border-foreground/5 shadow-sm bg-accent-500/5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Terminal className="text-accent-500" size={20} />
            Export Selected RAWs
          </h2>
          <p className="text-sm text-foreground/70 mb-4">
            Once the client has finished their selection, run this command in your local terminal (where the backend code lives) to copy the heavy RAW files into a new folder for editing.
          </p>
          
          <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-sm overflow-x-auto">
            <code>
              <span className="text-accent-400">npx</span> ts-node scripts/copy-selected-raws.ts {job.id} /path/to/destination
            </code>
          </div>
          <p className="text-xs text-foreground/50 mt-3">
            Replace <code>/path/to/destination</code> with where you want the RAWs copied (e.g., <code>~/Desktop/SelectedRAWs</code>).
          </p>
        </div>
      </div>
    </div>
  )
}
