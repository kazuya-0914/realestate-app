# CLAUDE.md

このファイルは、このリポジトリのコードを扱う際にClaude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト概要

**realestate-app** は、Supabase認証機能付きの不動産管理Webアプリです。メールアドレス＋パスワードでの会員登録・ログインを行い、ログイン後に自分が登録した物件の一覧表示・新規登録・編集・削除（CRUD）ができます。

## 技術スタック

- React 19 + Vite
- react-router-dom（ルーティング・認証によるアクセス制御）
- Supabase（`@supabase/supabase-js`。メール＋パスワード認証）
- oxlint（Lint）

## ファイル構成

- `src/lib/supabaseClient.js` — Supabaseクライアントの初期化
- `src/contexts/authContextObject.js` — 認証情報のReact Context本体
- `src/contexts/AuthContext.jsx` — `AuthProvider`。セッション取得・監視、`signUp`/`signIn`/`signOut`を提供
- `src/contexts/useAuth.js` — Contextを利用するためのフック（Fast Refreshのため`AuthContext.jsx`とは別ファイルに分離）
- `src/components/ProtectedRoute.jsx` — 未ログイン時に`/login`へリダイレクトするラッパー
- `src/components/PropertyCard.jsx` — 物件カード（物件名・家賃・エリア・間取り、編集/削除ボタン）
- `src/components/PropertyForm.jsx` — 物件の新規登録・編集で共用するフォーム
- `src/lib/propertiesApi.js` — `properties`テーブルへのCRUD操作（fetch/create/update/delete）
- `src/pages/LoginPage.jsx` — ログイン画面
- `src/pages/SignupPage.jsx` — 会員登録画面（メール確認が必要な場合はその旨を表示）
- `src/pages/PropertiesPage.jsx` — 物件一覧画面。一覧取得・新規登録・編集・削除・ログアウトを統括
- `src/App.jsx` — ルーティング定義（`/login`, `/signup`, `/properties`）
- `supabase/migrations/0001_create_properties.sql` — `properties`テーブルとRLSポリシーのSQL（Supabase CLI未導入のため、SupabaseダッシュボードのSQL Editorで手動実行する）

## 認証まわりの設計

- ルート（`/`）と未定義パスはすべて`/properties`へ転送し、`ProtectedRoute`が未ログインなら`/login`へリダイレクトする
- 会員登録直後、Supabase側でメール確認が有効な場合は`session`が返らないため、その場合は登録完了ではなく「確認メールを送信した」旨を表示する（`AuthContext`の`signUp`が`needsEmailConfirmation`を返す）
- 認可（誰がどの物件を見られるか等）はSupabase側のRow Level Securityで行う。`properties`テーブルは`user_id = auth.uid()`の行のみSELECT/INSERT/UPDATE/DELETEできるポリシーを設定済み（`supabase/migrations/0001_create_properties.sql`）
- `propertiesApi.js`側では`user_id`で明示的に絞り込んでいないが、RLSにより自分の行以外は返らない・操作できない

## データベース（properties テーブル）

| カラム | 型 | 説明 |
|---|---|---|
| id | uuid | 主キー（自動生成） |
| user_id | uuid | 登録したユーザー（`auth.users.id`への外部キー） |
| name | text | 物件名 |
| rent | integer | 家賃（円） |
| area | text | エリア名 |
| layout | text | 間取り（例: 1LDK） |
| created_at | timestamptz | 作成日時 |

- 初回セットアップ時は `supabase/migrations/0001_create_properties.sql` の内容をSupabaseダッシュボードのSQL Editorに貼り付けて実行する
- テーブル定義・RLSポリシーを変更する場合は、このディレクトリに連番で新しいマイグレーションファイルを追加すること（既存ファイルは変更しない）

## APIキーの管理

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` は `.env` で管理し、`.gitignore`で除外している
- Publishable key（旧anon key相当）はSupabaseの設計上ブラウザに埋め込まれることを前提とした公開キーであり、`VITE_`接頭辞でビルド時にクライアントバンドルへ含まれる。これはSupabaseの想定通りの使い方であり、他プロジェクト（weather-app・kakeibo-app）のような秘密鍵をサーバー経由にする対応は不要
- Service role keyなど本当に秘匿すべきキーは、今後もこのプロジェクトでは使用しないこと（使う場合はサーバー経由に切り替える）

## 動作確認方法

```
npm install
cp .env.example .env   # VITE_SUPABASE_URL・VITE_SUPABASE_PUBLISHABLE_KEYを設定
npm run dev
```

## 開発方針

- コンポーネント単位で責務を分割し、可読性を優先する。過度な抽象化は避ける
- 日本語話者向けのアプリのため、UI文言・コメントは日本語を基本とする
- コンポーネントファイル・関数名は`PascalCase`、イベントハンドラは`handle + 動詞 + 対象`の`camelCase`、CSSクラス名は`kebab-case`（task-board・kakeibo-appと同じ規約）

## GitHubリポジトリ

https://github.com/kazuya-0914/realestate-app

## デプロイ情報

- 本番URL：https://realestate-app-blue.vercel.app/
- Supabaseプロジェクト名：realestate-app

## デプロイ（Vercel）

- `vercel.json` で全パスを `/index.html` にリライトしている（react-router-domによるクライアントサイドルーティングのため、`/login`などへの直接アクセス・リロードでも404にならないようにする設定）
- 環境変数（`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`）は`vercel.json`に含めず、Vercelダッシュボードの Project Settings > Environment Variables で設定する
- ビルドコマンド・出力ディレクトリはVercelのVite自動検出に任せており、`vercel.json`では指定していない

## Git運用ルール

- コードを変更したら、その都度コミットしてGitHubリポジトリ（origin/main）にプッシュすること
- 変更内容が分かるコミットメッセージを日本語で付けること
- `.env`は絶対にコミットしないこと（コミット前に`git status`で混入していないか確認する）

## 応答言語

このプロジェクトに関するやり取りは、必ず日本語で行うこと。
