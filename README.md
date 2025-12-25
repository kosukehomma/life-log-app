# Life Log App

日々の**体重・運動・食事（生活ログ）** を記録する学習用のローカル web アプリです。
フロントエンドの基礎から、型安全・モジュール化・CRUD 実装までを段階的に習得することを目的としています。

## Step 1：HTML + CSS + JavaScript(基礎構築)

- HTML+CSS+JS で画面を構成
- `localStorage` にログデータを保存
- 食事画像・体重・コメント・運動内容を一覧カードで表示
- デザインはプレーン CSS ベース

**ポイント**

- DOM 操作・イベント処理の基礎
- localStorage による簡易データ永続化

---

## Step 2：Tailwind CSS + TypeScript（リファクタリング）

- Tailwind CSS によるデザイン統一
- TypeScript による型安全化・構造整理
- `utils/`・`types/` モジュール分割
- カード編集/削除ボタン実装(CRUD 完成)
- 画像は Base64 形式で localStorage に保存

**ポイント**

- TypeScript の型推論と型共有(`Log`, `StorageKey`, `WorkCategory`)
- ファイルモジュール構成(`text.ts`, `storage.ts`, `image.ts`)
- 即時プレビューを伴う画像処理

---

## Step 3：React + TypeScript（SPA 化）

- React によるコンポーネント設計
- react-router-dom によるページ遷移
- Zustand による状態管理
- フォーム・一覧・編集ページの分離

**学習ポイント**

- コンポーネント分割
- Page / Component の責務整理
- SPA における状態管理

---

## Step 4:Supabase(Auth/DB/RLS/Storage)で本物化

- Supabase Auth による認証（限定アカウント運用）
- Supabase Database によるログ永続化
- Supabase Storage による食事画像アップロード
- RLS（Row Level Security）設定
- API 層の分離と設計整理
- Add / Edit 共通フォームの完成

**現在の到達点**

- 実用レベルの CRUD + 画像管理
- 設計を意識した React + TypeScript 構成

---

## Tech Stack

- Frontend: React / TypeScript / Vite
- State Management: Zustand
- Backend: Supabase (Auth / Database / Storage)
- Routing: react-router-dom
- Styling: Tailwind CSS

---

## 📸 主な機能

- [x] ログ一覧表示（Supabase DB）
- [x] 新規ログ作成（体重・運動・食事・コメント）
- [x] 編集機能（既存データ反映）
- [x] 削除機能（確認ダイアログ付き）
- [x] 食事画像アップロード（Supabase Storage）
- [x] 画像差し替え時の旧画像削除
- [x] Supabase Auth + RLS による限定ユーザー運用

---

## Architecture / Design

### Form と Page の責務分離

#### LogForm

- 入力 UI と state 管理に専念
- DB / Storage / Auth / Routing を一切知らない
- 画像選択時は `onImageSelect` を通じて **URL を受け取るだけ**
- Add / Edit 両方で共通利用される純粋なフォームコンポーネント

#### AddLog

- 新規作成ユースケースを担当
- 画像アップロード・insert 処理を実装
- LogForm に必要な callback を組み立てる

#### EditLog

- 編集・削除ユースケースを担当
- 既存ログ取得
- 画像差し替え時の旧画像削除
- update / delete 処理を実装

Add / Edit の差分は Page 側に閉じ込め、
Form は完全に共通化しています。

---

### API Layer

用途ごとに API を分離しています。

- `fetchLogs` : ログ一覧取得
- `fetchLogById` : ログ 1 件取得（編集用）
- `insertLog`
- `updateLog`
- `deleteLog`

一覧取得と単体取得を分けることで、  
責務と型の明確化を行っています。

---

## 🧩 今後の拡張アイデア

- フォームバリデーション（Zod）
- Submit 中の loading / disable 対応
- 週・月単位の体重推移グラフ
- UI / UX 改善
- PWA 対応
- 目標体重管理・進捗可視化

---

## 🧾 License

MIT License  
© 2025 kosuke homma
