# Photo Selection Assistant Backend

**What this backend does:**
This is the "brain" for your photo selection tool. It provides a database to store which clients are selecting which photos, and it creates simple "API" endpoints. Later, your local helper script will send photo details to these endpoints, and your frontend website will fetch the photos to show to clients. Finally, another local script uses this backend to figure out which RAW files the client selected so it can copy them.

## Prerequisites

Before running this, you will need:
1. A **GitHub account** (to store your code).
2. A **Supabase account** (this is your free database).
3. A **Google account** (for Google Drive, which we will connect later).

---

## Step 1: Set up Supabase

Supabase is where your database lives.

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase dashboard, go to the **SQL Editor** (the `</>` icon on the left menu).
3. Click "New Query".
4. Open the `supabase/schema.sql` file in this project, copy all the text inside it, and paste it into the Supabase SQL Editor.
5. Click **Run**. This creates all the necessary tables (photographers, jobs, photos, selections) in your database!

---

## Step 2: Configure Environment Variables

Your code needs to know how to connect to *your* specific Supabase project.

1. In the root of this folder, create a new file and name it exactly `.env.local` (notice the dot at the beginning).
2. Open the `.env.example` file, copy its contents, and paste them into your new `.env.local` file.
3. In your Supabase Dashboard, go to **Project Settings** (the gear icon ⚙️) -> **API**.
4. Find the **Project URL** and paste it next to `NEXT_PUBLIC_SUPABASE_URL=`.
5. Find the **anon / public** key and paste it next to `NEXT_PUBLIC_SUPABASE_ANON_KEY=`.
6. Find the **service_role** key and paste it next to `SUPABASE_SERVICE_ROLE_KEY=`.

*Important: Never share your `service_role` key with anyone!*

---

## Step 3: Run Locally

To start the backend server on your computer:

1. Open your terminal in this folder (`photo-selection-assistant-backend`).
2. Run this command to install the required packages (you only do this once):
   ```bash
   npm install
   ```
3. Run this command to start the server:
   ```bash
   npm run dev
   ```

Your backend is now running at `http://localhost:3000`!

---

## Step 4: How the local helper scripts will work (conceptual)

Inside the `scripts/` folder, there are scripts meant to be run directly on your Mac.

- **`list-selected-raws.ts`**: When a client finishes selecting photos, you can run this script and give it the `job_id`. It will talk to Supabase, find out exactly which photos the client selected, and print out their original RAW file paths on your computer.
- **`copy-selected-raws.ts`**: (Coming soon!) This script will take those RAW file paths and automatically copy the heavy RAW files into a new folder for you to edit in Lightroom/Capture One.

To run a script, you can use a command like this:
```bash
npx ts-node scripts/list-selected-raws.ts <paste-the-job-id-here>
```
