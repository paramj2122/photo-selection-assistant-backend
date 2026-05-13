import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request,
  { params }: { params: { job_id: string } }
) {
  try {
    const job_id = params.job_id;

    // Fetch selections joined with photos
    // We only want selections where is_selected is true
    const { data, error } = await supabase
      .from('selections')
      .select(`
        selected_by,
        photos (
          id,
          raw_local_path,
          original_filename
        )
      `)
      .eq('job_id', job_id)
      .eq('is_selected', true);

    if (error) throw error;

    // Flatten the response for easier consumption by the local script
    const finalSelections = data.map((item: any) => ({
      photo_id: item.photos.id,
      raw_local_path: item.photos.raw_local_path,
      original_filename: item.photos.original_filename,
      selected_by: item.selected_by
    }));

    return NextResponse.json({ selections: finalSelections });
  } catch (error: any) {
    console.error('Error fetching final selections:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
