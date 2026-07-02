-- ============================================================
-- Kamay Aral — Supabase Schema
-- Run this in the Supabase SQL editor to set up the database.
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- TEACHERS
-- Uses Supabase Auth (auth.users) for credentials.
-- One auth.user = one teacher profile.
-- ============================================================
create table public.teachers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);
alter table public.teachers enable row level security;

-- Teachers can only read/update their own profile
create policy "Teachers: own profile" on public.teachers
  for all using (auth.uid() = id);

-- ============================================================
-- SECTIONS
-- A teacher's class group (e.g. "Apple", "Banana").
-- ============================================================
create table public.sections (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
alter table public.sections enable row level security;

create policy "Sections: teacher owns" on public.sections
  for all using (teacher_id = auth.uid());

-- ============================================================
-- STUDENTS
-- Accounts created by teachers. Auth also via auth.users.
-- ============================================================
create table public.students (
  id uuid primary key references auth.users(id) on delete cascade,
  section_id uuid not null references public.sections(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);
alter table public.students enable row level security;

-- Students read their own row
create policy "Students: own row" on public.students
  for select using (auth.uid() = id);

-- Teachers read/write students in their sections
create policy "Teachers: manage students" on public.students
  for all using (
    section_id in (
      select id from public.sections where teacher_id = auth.uid()
    )
  );

-- ============================================================
-- LEARN PROGRESS
-- Tracks which items a student has viewed in Learn Mode.
-- ============================================================
create table public.learn_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  module_id text not null,
  submodule_id text not null,
  item_id text not null,
  viewed_at timestamptz not null default now(),
  unique (student_id, module_id, submodule_id, item_id)
);
alter table public.learn_progress enable row level security;

create policy "LearnProgress: own" on public.learn_progress
  for all using (student_id = auth.uid());

create policy "LearnProgress: teacher view" on public.learn_progress
  for select using (
    student_id in (
      select s.id from public.students s
      join public.sections sec on s.section_id = sec.id
      where sec.teacher_id = auth.uid()
    )
  );

-- ============================================================
-- QUIZ SETTINGS
-- Teachers enable/disable quiz per sub-module per section.
-- ============================================================
create table public.quiz_settings (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  submodule_id text not null,
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (section_id, submodule_id)
);
alter table public.quiz_settings enable row level security;

create policy "QuizSettings: teacher manages" on public.quiz_settings
  for all using (
    section_id in (
      select id from public.sections where teacher_id = auth.uid()
    )
  );

-- Students can read quiz settings for their section
create policy "QuizSettings: student reads" on public.quiz_settings
  for select using (
    section_id in (
      select section_id from public.students where id = auth.uid()
    )
  );

-- ============================================================
-- QUIZ ATTEMPTS
-- One attempt per student per sub-module (unless reset).
-- ============================================================
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  submodule_id text not null,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score integer,
  total integer,
  unique (student_id, submodule_id)
);
alter table public.quiz_attempts enable row level security;

create policy "QuizAttempts: own" on public.quiz_attempts
  for all using (student_id = auth.uid());

create policy "QuizAttempts: teacher view" on public.quiz_attempts
  for select using (
    student_id in (
      select s.id from public.students s
      join public.sections sec on s.section_id = sec.id
      where sec.teacher_id = auth.uid()
    )
  );

-- Teachers can delete (reset) an attempt
create policy "QuizAttempts: teacher reset" on public.quiz_attempts
  for delete using (
    student_id in (
      select s.id from public.students s
      join public.sections sec on s.section_id = sec.id
      where sec.teacher_id = auth.uid()
    )
  );

-- ============================================================
-- QUIZ ANSWERS
-- Per-question results within an attempt.
-- ============================================================
create table public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  activity_type text not null,
  item_id text not null,
  answer_given text,
  is_correct boolean not null
);
alter table public.quiz_answers enable row level security;

create policy "QuizAnswers: via attempt" on public.quiz_answers
  for all using (
    attempt_id in (
      select id from public.quiz_attempts where student_id = auth.uid()
    )
  );

create policy "QuizAnswers: teacher view" on public.quiz_answers
  for select using (
    attempt_id in (
      select qa.id from public.quiz_attempts qa
      join public.students s on qa.student_id = s.id
      join public.sections sec on s.section_id = sec.id
      where sec.teacher_id = auth.uid()
    )
  );

-- ============================================================
-- USER ROLES VIEW
-- Helper to determine if an auth.user is a teacher or student.
-- ============================================================
create or replace view public.user_roles as
  select id, 'teacher' as role from public.teachers
  union all
  select id, 'student' as role from public.students;

-- ============================================================
-- TEACHER AUTO-INSERT TRIGGER
-- When a new auth user signs up with role='teacher' in their
-- user_metadata, automatically insert into public.teachers.
-- This fires on supabase.auth.signUp() from the register page.
-- ============================================================
create or replace function public.handle_teacher_signup()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (new.raw_user_meta_data ->> 'role') = 'teacher' then
    insert into public.teachers (id, full_name)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', 'Teacher')
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_teacher_signup();

-- ============================================================
-- GRANTS
-- Required because tables created via SQL editor are not
-- automatically accessible to the `authenticated` role.
-- ============================================================
grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on public.teachers to authenticated;
grant select, insert, update, delete on public.sections to authenticated;
grant select, insert, update, delete on public.students to authenticated;
grant select, insert, update, delete on public.learn_progress to authenticated;
grant select, insert, update, delete on public.quiz_settings to authenticated;
grant select, insert, update, delete on public.quiz_attempts to authenticated;
grant select, insert, update, delete on public.quiz_answers to authenticated;
grant select on public.user_roles to authenticated;
