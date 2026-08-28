-- Meal Prep Life OS — database schema for Supabase (Postgres)
-- Run this once in your Supabase project's SQL Editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------- RECIPES ----------
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  tag text not null check (tag in ('Breakfast','Desk Mini-Meal','Work Break Meal','Dinner','Snack')),
  time text not null default '',
  description text not null default '',
  ingredients text[] not null default '{}',
  instructions text[] not null default '{}',
  prep_video_url text,
  prep_video_is_video boolean not null default false,
  -- nutrition facts (per serving)
  serving_size text not null default '',
  calories numeric not null default 0,
  total_fat_g numeric not null default 0,
  saturated_fat_g numeric not null default 0,
  cholesterol_mg numeric not null default 0,
  sodium_mg numeric not null default 0,
  total_carbs_g numeric not null default 0,
  fiber_g numeric not null default 0,
  sugars_g numeric not null default 0,
  protein_g numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table recipes enable row level security;

create policy "recipes_select_own" on recipes for select using (auth.uid() = user_id);
create policy "recipes_insert_own" on recipes for insert with check (auth.uid() = user_id);
create policy "recipes_update_own" on recipes for update using (auth.uid() = user_id);
create policy "recipes_delete_own" on recipes for delete using (auth.uid() = user_id);

-- ---------- MEAL PLAN ----------
create table if not exists meal_plan_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  day text not null check (day in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  slot text not null check (slot in ('Breakfast','Desk Mini-Meal','Work Break Meal','Dinner','Snack')),
  recipe_id uuid not null references recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, day, slot)
);

alter table meal_plan_entries enable row level security;

create policy "plan_select_own" on meal_plan_entries for select using (auth.uid() = user_id);
create policy "plan_insert_own" on meal_plan_entries for insert with check (auth.uid() = user_id);
create policy "plan_update_own" on meal_plan_entries for update using (auth.uid() = user_id);
create policy "plan_delete_own" on meal_plan_entries for delete using (auth.uid() = user_id);

-- ---------- SHOPPING LIST ----------
create table if not exists shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'Pantry' check (category in ('Produce','Protein','Dairy','Pantry')),
  checked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table shopping_list_items enable row level security;

create policy "list_select_own" on shopping_list_items for select using (auth.uid() = user_id);
create policy "list_insert_own" on shopping_list_items for insert with check (auth.uid() = user_id);
create policy "list_update_own" on shopping_list_items for update using (auth.uid() = user_id);
create policy "list_delete_own" on shopping_list_items for delete using (auth.uid() = user_id);

-- ---------- FOOD DIARY ----------
create table if not exists food_diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  logged_date date not null default current_date,
  day text not null,
  slot text not null,
  recipe_id uuid references recipes(id) on delete set null,
  recipe_name text not null default '',
  eaten_url text not null,
  eaten_is_video boolean not null default false,
  actual_eaten text not null default '',
  -- nutrition snapshot, copied from the recipe at the moment this was logged
  calories numeric not null default 0,
  protein_g numeric not null default 0,
  total_carbs_g numeric not null default 0,
  total_fat_g numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table food_diary_entries enable row level security;

create policy "diary_select_own" on food_diary_entries for select using (auth.uid() = user_id);
create policy "diary_insert_own" on food_diary_entries for insert with check (auth.uid() = user_id);
create policy "diary_update_own" on food_diary_entries for update using (auth.uid() = user_id);
create policy "diary_delete_own" on food_diary_entries for delete using (auth.uid() = user_id);

-- ---------- STORAGE (prep/output photos & videos) ----------
-- Create the bucket first: Storage > New bucket > name "meal-media" > Public bucket: ON
-- Then run the policies below (Storage > Policies, or here in SQL editor).

insert into storage.buckets (id, name, public)
values ('meal-media', 'meal-media', true)
on conflict (id) do nothing;

create policy "meal_media_read_all" on storage.objects for select using (bucket_id = 'meal-media');

create policy "meal_media_insert_own" on storage.objects for insert
  with check (bucket_id = 'meal-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "meal_media_delete_own" on storage.objects for delete
  using (bucket_id = 'meal-media' and (storage.foldername(name))[1] = auth.uid()::text);
