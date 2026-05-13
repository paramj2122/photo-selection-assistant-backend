import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const jobId = process.argv[2];

  if (!jobId) {
    console.error('Usage: npx ts-node scripts/list-selected-raws.ts <job_id>');
    process.exit(1);
  }

  console.log(`Fetching selections for job: ${jobId}`);

  const { data, error } = await supabase
    .from('selections')
    .select(`
      selected_by,
      photos (
        raw_local_path,
        original_filename
      )
    `)
    .eq('job_id', jobId)
    .eq('is_selected', true);

  if (error) {
    console.error('Error fetching selections:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('No selections found for this job.');
    return;
  }

  console.log(`\nFound ${data.length} selected photos:\n`);
  data.forEach((item: any, index: number) => {
    console.log(`${index + 1}. [${item.selected_by}] ${item.photos.original_filename} -> ${item.photos.raw_local_path}`);
  });
}

main();
