import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import GalleryView from './GalleryView'

export default async function GalleryPage({ params }: { params: { magicToken: string } }) {
  const supabase = createClient()

  // 1. Find the job by token
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('id, title, client_name, status')
    .eq('magic_link_token', params.magicToken)
    .single()

  if (jobError || !job) {
    notFound()
  }

  // 2. Fetch photos
  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select('id, drive_preview_public_url, width, height')
    .eq('job_id', job.id)

  // 3. Fetch existing selections for this job
  const { data: selections } = await supabase
    .from('selections')
    .select('photo_id, selected_by, is_selected')
    .eq('job_id', job.id)

  const photosWithState = (photos || []).map(photo => {
    const photoSelections = (selections || []).filter((s: any) => s.photo_id === photo.id && s.is_selected)
    return {
      ...photo,
      selectedByClient: photoSelections.some((s: any) => s.selected_by === 'client'),
      selectedByPhotographer: photoSelections.some((s: any) => s.selected_by === 'photographer'),
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-40 border-b border-foreground/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{job.title}</h1>
            <p className="text-sm text-foreground/60">Prepared for {job.client_name}</p>
          </div>
          {job.status === 'selection_done' && (
            <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium border border-green-500/20">
              Selection Finalized
            </div>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GalleryView 
          initialPhotos={photosWithState} 
          magicToken={params.magicToken} 
          isReadOnly={job.status === 'selection_done'} 
        />
      </main>
    </div>
  )
}
