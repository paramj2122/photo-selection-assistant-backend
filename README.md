# Photo Selection Assistant

**What this app does:**
This is a full-stack Next.js application that helps photographers share photo galleries with clients and lets clients select their favorite photos. It features a sleek Photographer Dashboard to manage shoots, and a beautiful Pinterest-style Client Gallery for photo selection. 

It connects to your local machine via helper scripts to eventually copy the heavy RAW files based on client selections.

## Prerequisites

Before running this, you will need:
1. A **GitHub account** (to store your code).
2. A **Supabase account** (this is your free database and authentication).
3. A **Google account** (for Google Drive, which we will connect later for photo previews).

---

## Step 1: Set up Supabase

Supabase is where your database lives.

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase dashboard, go to the **SQL Editor** (the `</>` icon on the left menu).
3. Open the `supabase/schema.sql` file in this project, copy all the text inside it, and paste it into the Supabase SQL Editor.
4. Click **Run**. This creates all the necessary tables (photographers, jobs, photos, selections) in your database!

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

To start the full web application on your computer:

1. Open your terminal in this folder (`photo-selection-assistant-backend`).
2. Run this command to install the required packages (you only do this once):
   ```bash
   npm install
   ```
3. Run this command to start the server:
   ```bash
   npm run dev
   ```

Your app is now running at `http://localhost:3000`!

---

## The Workflow

**1. Photographer Dashboard**
- Go to `http://localhost:3000/login` to sign in.
- Create a new "Job" with your client's name and email.
- You will receive a unique "Magic Link" to send to your client.

**2. Client Gallery**
- Your client opens the Magic Link.
- They see a beautiful Pinterest-style grid of their photos.
- They can click photos to expand them into a lightbox and click "Select" or the heart icon.
- Selections are saved automatically.

**3. Exporting RAWs**
- Once the client finishes, go to the Job details in your dashboard.
- You will see exactly how many photos they selected and a simple terminal command.
- Open your terminal and run the provided command (e.g. `npx ts-node scripts/list-selected-raws.ts`) to locate and extract those specific RAW files on your Mac!
