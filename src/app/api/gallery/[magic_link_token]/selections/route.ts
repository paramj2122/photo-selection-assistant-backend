import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(
  request: Request,
  { params }: { params: { magic_link_token: string } }
) {
  try {
    const magic_link_token = params.magic_link_token;
    const body = await request.json();
    
    // Expecting body: { selected_by: 'client' | 'photographer', selections: [{ photo_id, is_selected }] }
    const { selected_by, selections } = body;

    if (!selected_by || !['client', 'photographer'].includes(selected_by)) {
      return NextResponse.json({ error: 'Invalid selected_by value' }, { status: 400 });
    }

    if (!Array.isArray(selections)) {
      return NextResponse.json({ error: 'selections must be an array' }, { status: 400 });
    }

    // 1. Find the job by token
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('magic_link_token', magic_link_token)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    const job_id = job.id;

    // 2. Upsert selections
    const selectionsToUpsert = selections.map((s: any) => ({
      job_id,
      photo_id: s.photo_id,
      selected_by,
      is_selected: s.is_selected,
    }));

    // We can use upsert, relying on the unique constraint (photo_id, selected_by)
    const { error: upsertError } = await supabase
      .from('selections')
      .upsert(selectionsToUpsert, { onConflict: 'photo_id, selected_by' });

    if (upsertError) throw upsertError;

    return NextResponse.json({ message: 'Selections saved successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving selections:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
