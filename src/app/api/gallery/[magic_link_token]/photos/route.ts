import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request,
  { params }: { params: { magic_link_token: string } }
) {
  try {
    const magic_link_token = params.magic_link_token;

    // 1. Find the job by token
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, client_name')
      .eq('magic_link_token', magic_link_token)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Gallery not found or invalid token' }, { status: 404 });
    }

    // 2. Fetch photos for this job
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('id, drive_preview_public_url, width, height')
      .eq('job_id', job.id);

    if (photosError) throw photosError;

    // 3. Fetch existing selections for this job
    const { data: selections, error: selectionsError } = await supabase
      .from('selections')
      .select('photo_id, selected_by, is_selected')
      .eq('job_id', job.id);

    if (selectionsError) throw selectionsError;

    // Merge selection state into photos
    const photosWithState = photos.map(photo => {
      const photoSelections = selections.filter(s => s.photo_id === photo.id && s.is_selected);
      return {
        ...photo,
        selectedByClient: photoSelections.some(s => s.selected_by === 'client'),
        selectedByPhotographer: photoSelections.some(s => s.selected_by === 'photographer'),
      };
    });

    return NextResponse.json({ job, photos: photosWithState });
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
