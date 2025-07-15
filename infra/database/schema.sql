-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Create messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_domain text not null,
  recipient_email text not null,
  type text check (type in ('order','invoice','shipping')) not null,
  payload jsonb not null,
  created_at timestamptz default now()
);

-- Create preferences table
create table if not exists preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  message_type text check (message_type in ('order','invoice','shipping')),
  enabled boolean default true,
  unique(user_id, message_type)
);

-- Create indexes
create index idx_messages_recipient_email on messages(recipient_email);
create index idx_messages_created_at on messages(created_at desc);
create index idx_preferences_user_id on preferences(user_id);

-- Enable RLS
alter table messages enable row level security;
alter table users enable row level security;
alter table preferences enable row level security;

-- Create RLS policies for messages
create policy "recipient can read own messages"
  on messages for select
  using (recipient_email = auth.jwt() ->> 'email');

-- Create RLS policies for users
create policy "users can read own profile"
  on users for select
  using (id = auth.uid());

create policy "users can update own profile"
  on users for update
  using (id = auth.uid());

-- Create RLS policies for preferences
create policy "users can read own preferences"
  on preferences for select
  using (user_id = auth.uid());

create policy "users can insert own preferences"
  on preferences for insert
  with check (user_id = auth.uid());

create policy "users can update own preferences"
  on preferences for update
  using (user_id = auth.uid());

create policy "users can delete own preferences"
  on preferences for delete
  using (user_id = auth.uid());

-- Create function to handle new user creation
create or replace function handle_new_user()
returns trigger as $
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$ language plpgsql security definer;

-- Create trigger for new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();