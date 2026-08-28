# Meal Prep — Life OS

A real, working meal-prep app: recipes, a weekly meal plan, a shopping list, and a photo/video
food diary for accountability. Built with Next.js and Supabase (Postgres + Auth + Storage).

Retailer checkout is intentionally not built yet — that's phase 2.

## 1. Create your Supabase project (free)

1. Go to [supabase.com](https://supabase.com), sign up, and click **New project**.
2. Pick any name/region and a database password (save it somewhere safe — you won't need it day
   to day, Supabase handles that).
3. Once the project finishes setting up, go to **Project Settings > API**. You'll need two values
   from that page in step 3 below: the **Project URL** and the **anon public** key.

## 2. Set up the database

1. In your Supabase project, open **SQL Editor > New query**.
2. Copy the entire contents of `supabase/schema.sql` (in this project) into the editor and click
   **Run**. This creates all four tables (recipes, meal plan, shopping list, food diary) with the
   security rules that keep your data private to your account, plus the storage bucket for
   photos/videos.
3. Go to **Authentication > Providers > Email** and turn **off** "Confirm email" — since this is
   just for you, this skips the email-verification step so you can sign up and log straight in.

> If you'd already run an earlier version of `schema.sql` in a Supabase project, this version adds
> instructions/video/nutrition fields to recipes, changes the meal plan's slots, and reshapes the
> food diary table. Since you likely haven't gone live with real data yet, the simplest path is to
> drop the four tables (Table Editor > select each > Delete) and re-run the new `schema.sql` fresh.

## 3. Connect the app to your project

1. Copy `.env.local.example` to a new file named `.env.local`.
2. Fill in the two values from step 1:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

## 4. Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it'll redirect you to a login screen.
Click **Create Account**, enter any email and a password, and you're in. Your six starter recipes
are added automatically on first signup.

## 5. Put it online (when you're ready)

The easiest path is [Vercel](https://vercel.com) (also free to start):

1. Push this project to a GitHub repository.
2. In Vercel, **New Project > import that repo**.
3. Add the same two environment variables from `.env.local` in Vercel's project settings.
4. Deploy — Vercel gives you a live URL you can open from your phone.

## What's real vs. what's next

- Recipes, your meal plan, your shopping list, and your food diary (including uploaded
  photos/videos) are all saved for real in your own Supabase project — they'll be there next time
  you open the app, on any device, once it's deployed.
- The shopping list's "Order Online" button is disabled on purpose — retailer checkout is a later
  phase, once the rest is solid.
- "Habits & Health" is a placeholder tile, gesturing at future modules of your Life OS.

## Project structure

```
src/app/(app)/        # the signed-in app: dashboard, recipes, plan, list, diary, habits
src/app/login/        # sign in / sign up
src/app/(app)/actions.ts   # all database writes (server actions)
src/components/       # interactive pieces: modals, the meal plan grid, sidebar
src/lib/supabase/     # Supabase client setup (browser, server, session middleware)
src/lib/types.ts      # shared types + the starter recipe data
supabase/schema.sql   # run this once in Supabase's SQL Editor
```
