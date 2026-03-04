# まねもり 💰

**まねもり (Manemori)** は、日々の支出を簡単に管理できる個人向けWebアプリケーションです。

月次予算を設定して、日別・週別の支出を視覚的に把握できます。

## 主な機能

- 📊 **予算管理** - 月次予算の設定と自動計算（日別・週別平均）
- 💳 **支出記録** - カテゴリ別に支出を記録・編集・削除
- 📅 **カレンダー表示** - 日別の支出を色分けして表示
  - 🟢 予算内
  - 🟡 予算の1〜1.5倍
  - 🔴 予算の1.5倍超
- 📈 **リアルタイム集計** - 今日・今週・今月の支出と残高を自動計算
- 🏷️ **カテゴリ管理** - 食費、交通費、日用品、娯楽、医療費、その他

## 技術スタック

- **フロントエンド**: Next.js 16 (App Router) + React 19 + TypeScript
- **スタイリング**: Tailwind CSS 4
- **バックエンド**: Supabase (PostgreSQL)
- **認証**: Supabase Auth (Google OAuth)
- **デプロイ**: Vercel

## プロジェクト構成

```
manemori/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインダッシュボード
│   ├── history/           # 履歴・カレンダービュー
│   ├── login/             # ログインページ
│   └── auth/callback/     # OAuth認証コールバック
├── components/            # React UIコンポーネント
├── lib/
│   ├── supabase/         # Supabaseクライアント設定
│   └── actions/          # Server Actions（データ操作）
├── middleware.ts         # 認証ミドルウェア
└── public/               # 静的ファイル
```

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/manemori.git
cd manemori
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

プロジェクトルートに `.env.local` ファイルを作成：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Supabaseの設定方法:**

1. [Supabase](https://supabase.com/) でプロジェクトを作成
2. Project Settings > API から URL と anon key を取得
3. `.env.local` に設定

### 4. データベースのセットアップ

Supabaseのダッシュボードで以下のテーブルを作成してください：

- `categories` - 支出カテゴリ（ユーザーごとに管理）
- `monthly_budgets` - 月次予算（ユーザー・年・月で一意）
- `expenses` - 支出記録（カテゴリと紐付け）

各テーブルのスキーマ詳細は、リポジトリをクローン後にコードを参照してください。

### 5. Google OAuth認証の設定

1. Supabase ダッシュボード > Authentication > Providers > Google を有効化
2. Google Cloud Console でOAuth認証情報を作成
3. リダイレクトURIに `https://your-project.supabase.co/auth/v1/callback` を追加
4. Client ID と Client Secret を Supabase に設定

### 6. 開発サーバーを起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開きます。

## 使い方

1. **ログイン** - Googleアカウントでログイン
2. **予算設定** - 月次予算を入力
3. **支出記録** - 日々の支出を登録
4. **履歴確認** - カレンダービューで過去の支出を確認

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com) でプロジェクトをインポート
2. 環境変数 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) を設定
3. デプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/manemori)

## ライセンス

MIT License

## 開発者

Made with ❤️ by [Hirokatsu](https://github.com/hirokatsu)
