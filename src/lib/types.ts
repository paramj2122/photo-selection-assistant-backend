export type Photographer = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

export type Job = {
  id: string;
  photographer_id: string;
  title: string;
  client_name: string;
  client_email: string;
  status: 'draft' | 'active' | 'selection_done';
  selection_deadline: string | null;
  magic_link_token: string;
  created_at: string;
};

export type Photo = {
  id: string;
  job_id: string;
  original_filename: string;
  raw_local_path: string;
  drive_preview_file_id: string;
  drive_preview_public_url: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type Selection = {
  id: string;
  job_id: string;
  photo_id: string;
  selected_by: 'client' | 'photographer';
  is_selected: boolean;
  created_at: string;
};
