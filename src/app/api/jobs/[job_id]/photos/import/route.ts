import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(
  request: Request,
  { params }: { params: { job_id: string } }
) {
  try {
    const job_id = params.job_id;
    const body = await request.json();
    
    // Expecting an array of photo objects
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: 'Expected an array of photos' }, { status: 400 });
    }

    const photosToInsert = body.map((photo: any) => ({
      job_id,
      original_filename: photo.original_filename,
      raw_local_path: photo.raw_local_path,
      drive_preview_file_id: photo.drive_preview_file_id,
      drive_preview_public_url: photo.drive_preview_public_url || null,
      width: photo.width || null,
      height: photo.height || null,
    }));

    const { data, error } = await supabase
      .from('photos')
      .insert(photosToInsert)
      .select('id, original_filename');

    if (error) throw error;

    return NextResponse.json(
      { message: `Successfully imported ${data.length} photos`, importedCount: data.length },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error importing photos:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
