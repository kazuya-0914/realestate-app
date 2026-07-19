-- 物件テーブルの作成
-- 物件名・家賃・エリア名・間取りと、登録したユーザー(user_id)を保存する
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  rent integer not null check (rent >= 0),
  area text not null,
  layout text not null,
  created_at timestamptz not null default now()
);

-- user_idでの絞り込み（RLSのポリシー判定・一覧取得）が頻繁に発生するためインデックスを張る
create index if not exists properties_user_id_idx on public.properties (user_id);

-- RLSを有効化
alter table public.properties enable row level security;

-- 自分が登録した物件のみ参照できる
create policy "Users can view their own properties"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 自分のuser_idでのみ新規登録できる（他人のuser_idを詐称して登録することを防ぐ）
create policy "Users can insert their own properties"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
create policy "Users can update their own properties"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
create policy "Users can delete their own properties"
  on public.properties
  for delete
  using (auth.uid() = user_id);
