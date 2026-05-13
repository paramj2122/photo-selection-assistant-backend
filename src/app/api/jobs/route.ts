import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

function generateMagicToken(clientName: string): string {
  const initials = clientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${initials}-${randomStr}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { photographer_id, title, client_name, client_email, selection_deadline } = body;

    if (!photographer_id || !title || !client_name || !client_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const magic_link_token = generateMagicToken(client_name);

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          photographer_id,
          title,
          client_name,
          client_email,
          selection_deadline: selection_deadline || null,
          magic_link_token,
        },
      ])
      .select('*')
      .single();

    if (error) throw error;

    // Use a placeholder base URL for now. In production, this would be your frontend URL.
    const magic_link_url = `https://example.com/gallery/${magic_link_token}`;

    return NextResponse.json(
      { job: data, magic_link_url },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
