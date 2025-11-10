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
- **カード編集/削除ボタン実装(CRUD 完成)**
- 画像は Base64 形式で localStorage に保存
- ファイル選択時に即時プレビュー反映

**ポイント**

- TypeScript の型推論と型共有(`Log`, `StorageKey`, `WorkCategory`)
- ファイルモジュール構成(`text.ts`, `storage.ts`, `image.ts`)
- Base64 変換による画像永続化
- Tailwind のユーティリティ設計

---

## Step 3：（予定） React + Supabase への進化

- Supabase データベース連携
- ユーザー認証（ログイン機能（ログインできるアカウントを 7 つくらいに制限））
- Cloud Storage への画像アップロード
- React Hooks + Context による状態管理
- API 層分離とフォームバリデーション（React Hook Form など）

**目標**

- 本格的な SPA（single page application）化
- クラウド DB + ストレージによる永続的データ管理
- Next.js or Vite 構成でのモダン開発体験

---

## ⚙️ 技術構成（Step2 時点）

| 分類           | 使用技術                                  |
| -------------- | ----------------------------------------- |
| 言語           | TypeScript                                |
| UI             | Tailwind CSS                              |
| ビルド         | Vite                                      |
| データ保存     | localStorage（Base64 画像対応）           |
| モジュール構成 | `src/utils/`, `src/types/`, `src/main.ts` |

---

## 📸 主な機能

- [x] 新規登録（体重・運動・食事・コメント）
- [x] 一覧カード表示（7 日分 or 月指定）
- [x] 編集機能（既存データ反映・プレビュー更新）
- [x] 削除機能（確認ダイアログ付き）
- [x] 画像 Base64 保存＆即時プレビュー対応

---

## 🧩 今後の拡張アイデア

- 週単位・月単位の体重推移グラフ表示
- PWA 対応（スマホで使える日記アプリ化）
- Supabase Auth + Storage 連携（Step3）
- 目標体重の管理や進捗バー表示

---

## 🧾 License

MIT License  
© 2025 kosuke homma
