'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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

export async function createJob(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get photographer ID
  const { data: photographer } = await supabase
    .from('photographers')
    .select('id')
    .eq('email', user.email)
    .single()

  if (!photographer) return { error: 'Photographer profile not found' }

  const title = formData.get('title') as string
  const client_name = formData.get('client_name') as string
  const client_email = formData.get('client_email') as string
  const selection_deadline = formData.get('selection_deadline') as string

  const magic_link_token = generateMagicToken(client_name)

  const { data, error } = await supabase
    .from('jobs')
    .insert([
      {
        photographer_id: photographer.id,
        title,
        client_name,
        client_email,
        selection_deadline: selection_deadline ? new Date(selection_deadline).toISOString() : null,
        magic_link_token,
      },
    ])
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  redirect(`/jobs/${data.id}`)
}
