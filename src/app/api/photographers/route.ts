import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('photographers')
      .insert([{ email, name }])
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, message: 'Photographer created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating photographer:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
