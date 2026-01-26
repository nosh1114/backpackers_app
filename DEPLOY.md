# Render デプロイ手順（フェーズ1: 無料プラン）

## 📋 前提条件

- GitHubアカウント
- Renderアカウント（無料で作成可能: https://render.com/）
- Neonアカウント（データベース用、無料・永続的: https://neon.tech/）
- AWSアカウント（画像ストレージ用、無料枠あり: https://aws.amazon.com/）

---

## 🚀 ステップ1: GitHubにプッシュ

1. GitHubリポジトリを作成（まだの場合）
2. コードをプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/backpackers-app.git
git push -u origin main
```

---

## 🗄️ ステップ2: 画像ストレージの設定

**重要**: AWS S3には**「常に無料」の無料枠**があります（12ヶ月限定ではありません）。ただし、無料枠の範囲を超えると課金されます。無料枠を超えた場合、またはより大きな無料枠が必要な場合は、以下の代替案を検討してください：

### オプションA: AWS S3（常に無料の無料枠あり）

**無料枠（永続的・常に無料）:**
- 5GBのストレージ
- 20,000回のGETリクエスト/月
- 2,000回のPUTリクエスト/月
- **注意**: 無料枠は永続的ですが、この範囲を超えると課金されます

**無料枠を超えた場合のコスト:**
- ストレージ: $0.023/GB/月（5GB超分）
- GETリクエスト: $0.0004/1,000リクエスト（20,000回超分）
- PUTリクエスト: $0.005/1,000リクエスト（2,000回超分）

1. AWSアカウントを作成（まだの場合）: https://aws.amazon.com/
2. AWSコンソールにログイン
3. S3サービスに移動
4. 「バケットを作成」をクリック
5. 以下の設定を入力：

**基本設定:**
- **バケット名**: `backpackers-app-images`（一意の名前）
- **AWSリージョン**: `アジアパシフィック（東京）ap-northeast-1`（推奨）

**パブリックアクセス設定:**
- 「パブリックアクセスをすべてブロック」のチェックを**外す**（画像を公開するため）
- 警告を確認して「了解しました」にチェック

**バケットポリシー（後で設定）:**
バケット作成後、以下のポリシーを追加：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::backpackers-app-images/*"
    }
  ]
}
```

6. IAMユーザーを作成（S3アクセス用）:
   - IAMコンソール → 「ユーザー」→「ユーザーを追加」
   - **ユーザー名**: `backpackers-app-s3-user`
   - **アクセスの種類**: 「プログラムによるアクセス」にチェック
   - **アクセス権限**: 「既存のポリシーを直接アタッチ」→ `AmazonS3FullAccess` を選択
   - 作成後、**アクセスキーID**と**シークレットアクセスキー**をコピー（後で使用）

### 2.1 S3のコスト制限設定（重要）

無料枠を超えないように、以下の設定を行います：

#### A. バケットのバージョニングを無効化

1. S3バケットを開く
2. 「プロパティ」タブを開く
3. 「バケットのバージョニング」セクションで「無効」を選択
4. 保存

#### B. ライフサイクルポリシーで古いファイルを削除

1. S3バケットを開く
2. 「管理」タブを開く
3. 「ライフサイクルルールを作成」をクリック
4. 以下の設定を入力：

**ルール名**: `delete-old-files`

**ルールスコープ**: 「このルールをバケット内のすべてのオブジェクトに適用」

**アクション**: 「現在のバージョンの有効期限」にチェック
- **オブジェクトの有効期限（日数）**: `365`（1年経過したファイルを削除）

**保存**

#### C. CloudWatchでアラームを設定（無料枠接近時に通知）

1. CloudWatchコンソールに移動
2. 「アラーム」→「アラームの作成」をクリック
3. 「メトリクスを選択」をクリック
4. 「S3」→「バケットメトリクス」を選択
5. バケット名を選択し、以下のメトリクスを設定：

**アラーム1: ストレージサイズ**
- **メトリクス**: `BucketSizeBytes`
- **統計**: `Average`
- **期間**: `1日`
- **条件**: `>= 4GB`（無料枠5GBの80%で警告）
- **通知**: メールアドレスを設定

**アラーム2: GETリクエスト数（オプション）**
- **メトリクス**: `GetRequests`（S3のリクエストメトリクス）
- **統計**: `Sum`
- **期間**: `1ヶ月`
- **条件**: `>= 16000`（無料枠20,000回の80%で警告）
- **通知**: メールアドレスを設定

**注意**: GETリクエスト数の監視は、CloudWatchの請求メトリクスで確認することもできます。

#### D. バケットポリシーでアップロードサイズを制限（追加の安全策）

既にアプリ側で2MB制限がありますが、S3側でも制限を追加：

1. S3バケットを開く
2. 「アクセス許可」タブを開く
3. 「バケットポリシー」を編集
4. 以下のポリシーを追加（既存のポリシーに追加）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::backpackers-app-images/*"
    },
    {
      "Sid": "DenyLargeUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::backpackers-app-images/*",
      "Condition": {
        "NumericGreaterThan": {
          "aws:ContentLength": "2097152"
        }
      }
    }
  ]
}
```

**注意**: このポリシーは2MB（2,097,152バイト）を超えるアップロードを拒否します。

---

### オプションB: Cloudflare R2（推奨・永続的に無料枠あり）

**無料枠（永続的）:**
- 10GBのストレージ
- 100万回の読み取り/月
- 100万回の書き込み/月
- **無料枠は永続的で、12ヶ月制限なし**

**設定手順:**

1. **Cloudflareアカウントを作成**: https://www.cloudflare.com/
   - 無料アカウントでOK

2. **R2ダッシュボードに移動**
   - Cloudflareダッシュボード → 「R2」をクリック
   - 「Get started」をクリック（初回のみ）

3. **バケットを作成**
   - 「Create bucket」をクリック
   - **バケット名**: `backpackers-app-images`（一意の名前）
   - **リージョン**: `Asia Pacific (Tokyo)` または `Asia Pacific (Singapore)`
   - 「Create bucket」をクリック

4. **APIトークンを作成**
   - R2ダッシュボード → 「Manage R2 API Tokens」をクリック
   - 「Create API token」をクリック
   - **トークン名**: `backpackers-app-r2-token`
   - **権限**: 「Object Read & Write」を選択
   - 「Create API token」をクリック
   - **重要**: 表示された**Access Key ID**と**Secret Access Key**をコピー（後で使用、再表示不可）

5. **アカウントIDを確認**
   - R2ダッシュボードの右上に表示されている**アカウントID**をコピー
   - または、Cloudflareダッシュボードの右上から確認

6. **バケットのパブリックアクセスを設定（画像を公開するため）**
   - 作成したバケットを開く
   - 「Settings」タブを開く
   - 「Public access」セクションで「Allow Access」を有効化
   - または、カスタムドメインを設定（推奨）

**環境変数（Render）:**
```
CLOUDFLARE_R2_ACCESS_KEY_ID=<R2アクセスキーID（ステップ4で取得）>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<R2シークレットアクセスキー（ステップ4で取得）>
CLOUDFLARE_R2_BUCKET=backpackers-app-images
CLOUDFLARE_R2_ENDPOINT=https://<アカウントID>.r2.cloudflarestorage.com
```

**エンドポイントURLの例:**
- アカウントIDが`abc123def456`の場合: `https://abc123def456.r2.cloudflarestorage.com`

**注意**: 
- コードは既にR2に対応済みです（`config/storage.yml`と`config/environments/production.rb`を更新済み）
- 環境変数を設定するだけで、自動的にR2が使用されます
- S3の環境変数（`AWS_*`）は削除するか、設定しないでください

---

### オプションC: Renderのローカルストレージ（一時的な解決策）

**メリット:**
- 無料
- 設定不要

**デメリット:**
- 再デプロイ時に画像が消える可能性
- 永続的ではない

**設定:**
- 環境変数`AWS_S3_BUCKET`と`CLOUDFLARE_R2_BUCKET`を設定しない（または空にする）
- アプリは自動的にローカルストレージを使用

---

## 🔧 ステップ3: Renderでバックエンドをデプロイ

### 3.1 新しいWeb Serviceを作成

1. Renderダッシュボードにログイン
2. 「New +」→「Web Service」を選択
3. GitHubリポジトリを接続
4. 以下の設定を入力：

**基本設定:**
- **Name**: `backpackers-app-backend`
- **Region**: 最寄りのリージョン（例: Singapore）
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Ruby`
- **Build Command**: `bundle install && bundle exec rails db:migrate`
- **Start Command**: `bundle exec puma -C config/puma.rb`

**環境変数（S3使用の場合）:**
```
RAILS_ENV=production
RAILS_MASTER_KEY=<Rails credentialsのマスターキー>
DATABASE_URL=<NeonのConnection String（ステップ3.2で設定）>
FRONTEND_URL=https://backpackers-app.onrender.com
JWT_SECRET=<ランダムな文字列>
AWS_ACCESS_KEY_ID=<AWS IAMユーザーのアクセスキーID>
AWS_SECRET_ACCESS_KEY=<AWS IAMユーザーのシークレットアクセスキー>
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET=backpackers-app-images
```

**環境変数（Cloudflare R2使用の場合）:**
```
RAILS_ENV=production
RAILS_MASTER_KEY=<Rails credentialsのマスターキー>
DATABASE_URL=<NeonのConnection String（ステップ3.2で設定）>
FRONTEND_URL=https://backpackers-app.onrender.com
JWT_SECRET=<ランダムな文字列>
CLOUDFLARE_ACCOUNT_ID=<CloudflareアカウントID>
CLOUDFLARE_R2_ACCESS_KEY_ID=<R2アクセスキーID>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<R2シークレットアクセスキー>
CLOUDFLARE_R2_BUCKET=backpackers-app-images
CLOUDFLARE_R2_ENDPOINT=https://<アカウントID>.r2.cloudflarestorage.com
```

**環境変数（ローカルストレージ使用の場合）:**
```
RAILS_ENV=production
RAILS_MASTER_KEY=<Rails credentialsのマスターキー>
DATABASE_URL=<NeonのConnection String（ステップ3.2で設定）>
FRONTEND_URL=https://backpackers-app.onrender.com
JWT_SECRET=<ランダムな文字列>
# AWS関連の環境変数は設定しない（ローカルストレージを使用）
```

**注意**: 
- `DATABASE_URL`はステップ3.2でNeonのConnection Stringを設定してください
- 各`<...>`の部分を実際の値に置き換えてください

**Rails Master Keyの取得方法:**
```bash
cd backend
cat config/master.key
```

**⚠️ 重要: RAILS_MASTER_KEYの設定時の注意点:**
1. Renderダッシュボードの「Environment」タブで環境変数を追加
2. **Key**: `RAILS_MASTER_KEY`
3. **Value**: `config/master.key`の内容を**そのまま**コピー（余分なスペースや改行を入れない）
4. 例: `384d97754b259f6646ddef68ba11daaa`（32文字の16進数）
5. 設定後、必ず「Save Changes」をクリック

**JWT_SECRETの生成:**
```bash
# ランダムな文字列を生成
openssl rand -hex 32
```

### 3.2 データベースを作成（Neonを使用 - 推奨）

**⚠️ 重要**: Renderの無料PostgreSQLは90日で削除される可能性があります。**Neon**を使用することで、無料で永続的なデータベースを利用できます。

#### オプションA: Neonを使用（推奨 - 永続的）

1. **Neonアカウントを作成**
   - https://neon.tech/ にアクセス
   - GitHubアカウントでサインアップ（推奨）

2. **プロジェクトを作成**
   - 「Create a project」をクリック
   - 以下の設定を入力：
     - **Project name**: `backpackers-app`
     - **PostgreSQL version**: `16`（最新版推奨）
     - **Database name**: `backpackers_app_production`
     - **Region**: `Asia Pacific (Tokyo)` または `Asia Pacific (Singapore)`（最寄りを選択）

3. **Connection Stringを取得**
   - プロジェクト作成後、「Connect」ボタンをクリック
   - 「Connection string」タブを選択
   - **Connection string** をコピー（例: `postgres://user:password@ep-xxx-xxx.region.neon.tech/neondb?sslmode=require`）

4. **Renderの環境変数に設定**
   - Renderダッシュボードでバックエンドサービスを開く
   - 「Environment」タブを開く
   - 環境変数を追加：
     - **Key**: `DATABASE_URL`
     - **Value**: （コピーしたNeonのConnection String）

#### オプションB: RenderのPostgreSQLを使用（90日制限あり）

1. 「New +」→「PostgreSQL」を選択
2. 以下の設定を入力：

**基本設定:**
- **Name**: `backpackers-app-db`
- **Database**: `backpackers_app_production`
- **User**: `backpackers_app`
- **Plan**: `Free`

3. 作成後、**Internal Database URL** をコピー
4. バックエンドサービスの環境変数に追加：
   - **Key**: `DATABASE_URL`
   - **Value**: （コピーしたURL）

**⚠️ 注意**: Renderの無料PostgreSQLは90日で削除される可能性があります。長期的な運用にはNeonを推奨します。

---

## 🎨 ステップ4: Renderでフロントエンドをデプロイ

1. 「New +」→「Static Site」を選択
2. GitHubリポジトリを接続
3. 以下の設定を入力：

**基本設定:**
- **Name**: `backpackers-app-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

**環境変数:**
```
VITE_API_BASE_URL=https://backpackers-app-backend.onrender.com/api/v1
VITE_BACKEND_URL=https://backpackers-app-backend.onrender.com
```

**注意**: フロントエンドのURLが確定したら、バックエンドの `FRONTEND_URL` 環境変数を更新してください。

---

## 🌐 ステップ5: カスタムドメイン設定（bappa.jp）

`bappa.jp`ドメインをRenderに設定します。

### 5.1 フロントエンドのカスタムドメイン設定

1. Renderダッシュボードでフロントエンドサービスを開く
2. 「Settings」タブを開く
3. 「Custom Domains」セクションで「Add Custom Domain」をクリック
4. ドメインを入力: `bappa.jp` または `www.bappa.jp`
5. Renderが提供するDNSレコードをコピー（例: `CNAME`レコード）

### 5.2 DNS設定

ドメイン管理画面（例: お名前.com、ムームードメイン）で以下を設定：

**オプションA: ルートドメイン（bappa.jp）**
```
Type: CNAME
Name: @
Value: <Renderが提供するCNAME値>
```

**オプションB: wwwサブドメイン（www.bappa.jp）**
```
Type: CNAME
Name: www
Value: <Renderが提供するCNAME値>
```

**注意**: ルートドメイン（@）がCNAMEをサポートしない場合、Aレコードを使用する必要があります。Renderのサポートに問い合わせてください。

### 5.3 バックエンドのカスタムドメイン設定（オプション）

API用のサブドメインを設定する場合：

1. Renderダッシュボードでバックエンドサービスを開く
2. 「Settings」タブを開く
3. 「Custom Domains」セクションで「Add Custom Domain」をクリック
4. ドメインを入力: `api.bappa.jp`
5. DNSレコードを設定（CNAME）

### 5.4 環境変数の更新

カスタムドメイン設定後、環境変数を更新：

**フロントエンド:**
```
VITE_API_BASE_URL=https://api.bappa.jp/api/v1
VITE_BACKEND_URL=https://api.bappa.jp
```

**バックエンド:**
```
FRONTEND_URL=https://bappa.jp
```

または、wwwサブドメインを使用する場合：
```
FRONTEND_URL=https://www.bappa.jp
```

### 5.5 SSL証明書

Renderは自動的にSSL証明書を発行・更新します（Let's Encrypt）。設定後、数分〜数時間で有効になります。

---

## 🔄 ステップ6: CORS設定の更新

フロントエンドのURLが確定したら、バックエンドのCORS設定を更新：

1. Renderダッシュボードでバックエンドサービスを開く
2. 「Environment」タブを開く
3. `FRONTEND_URL` を更新：
   - カスタムドメイン使用時: `https://bappa.jp` または `https://www.bappa.jp`
   - RenderのデフォルトURL使用時: `https://backpackers-app-frontend.onrender.com`
4. サービスを再デプロイ

**注意**: CORS設定は`backend/config/initializers/cors.rb`で`FRONTEND_URL`環境変数から自動的に読み込まれます。環境変数を更新するだけで反映されます。

---

## 📧 ステップ7: メール設定（オプション）

本番環境でメールを送信する場合：

1. SendGrid、Mailgun、またはAWS SESのアカウントを作成
2. 環境変数を追加：
   ```
   SMTP_USER_NAME=<your-smtp-username>
   SMTP_PASSWORD=<your-smtp-password>
   SMTP_ADDRESS=<smtp-server>
   SMTP_PORT=587
   ```

---

## 🔍 ステップ8: 監視サービスの設定（スリープ防止）

無料プランは15分の非アクセスでスリープするため、監視サービスを設定：

### UptimeRobot（無料）

1. https://uptimerobot.com/ にアカウント作成
2. 「Add New Monitor」をクリック
3. 以下の設定：
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Backpackers App
   - **URL**: `https://backpackers-app-backend.onrender.com/up`
   - **Monitoring Interval**: 5 minutes

これで定期的にアクセスされ、スリープを防げます。

---

## ✅ デプロイ確認

**カスタムドメイン設定前:**
1. フロントエンド: `https://backpackers-app-frontend.onrender.com`
2. バックエンド: `https://backpackers-app-backend.onrender.com`
3. ヘルスチェック: `https://backpackers-app-backend.onrender.com/up`

**カスタムドメイン設定後:**
1. フロントエンド: `https://bappa.jp` または `https://www.bappa.jp`
2. バックエンド: `https://api.bappa.jp`（設定した場合）
3. ヘルスチェック: `https://api.bappa.jp/up` または `https://backpackers-app-backend.onrender.com/up`

---

## 🐛 トラブルシューティング

### CORSエラー（`Access-Control-Allow-Origin header is not present`）

**エラーメッセージ:**
```
Access to fetch at 'https://backpackers-app-backend.onrender.com/api/v1/...' 
from origin 'https://backpackers-app.onrender.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**原因:**
- バックエンドの`FRONTEND_URL`環境変数が正しく設定されていない
- CORS設定でフロントエンドのURLが許可されていない

**解決方法:**
1. Renderダッシュボードでバックエンドサービスを開く
2. 「Environment」タブを開く
3. `FRONTEND_URL`環境変数を確認または追加：
   - Key: `FRONTEND_URL`
   - Value: `https://backpackers-app.onrender.com`（実際のフロントエンドURL）
4. 「Save Changes」をクリック
5. サービスを再デプロイ

**確認:**
- フロントエンドのURLが`https://backpackers-app.onrender.com`の場合、`FRONTEND_URL`にそのURLを設定
- カスタムドメイン（`bappa.jp`）を使用する場合、`FRONTEND_URL=https://bappa.jp`を設定

**注意:**
- CORS設定（`backend/config/initializers/cors.rb`）は、`FRONTEND_URL`環境変数と、明示的に許可されたURL（`backpackers-app.onrender.com`など）を読み込みます
- 環境変数を設定した後、必ずサービスを再デプロイしてください

---

### RAILS_MASTER_KEYエラー（`ArgumentError: key must be 16 bytes`）

**エラーメッセージ:**
```
ArgumentError: key must be 16 bytes
        cipher.key = @secret
```

**原因:**
- `RAILS_MASTER_KEY`環境変数が正しく設定されていない
- 値に余分なスペースや改行が含まれている
- 値が間違ってコピーされている

**解決方法:**
1. ローカルでマスターキーを確認:
   ```bash
   cd backend
   cat config/master.key
   ```
2. Renderダッシュボードで環境変数を確認:
   - 「Environment」タブを開く
   - `RAILS_MASTER_KEY`が存在するか確認
   - 値が32文字の16進数（例: `384d97754b259f6646ddef68ba11daaa`）であることを確認
3. 環境変数を再設定:
   - `RAILS_MASTER_KEY`を削除して再追加
   - 値は`config/master.key`の内容を**そのまま**コピー（スペースや改行を入れない）
   - 「Save Changes」をクリック
4. サービスを再デプロイ

### データベース接続エラー

- `DATABASE_URL` 環境変数が正しく設定されているか確認
- データベースサービスが起動しているか確認
- NeonのConnection Stringが正しいか確認

### CORSエラー

- `FRONTEND_URL` 環境変数が正しく設定されているか確認
- CORS設定ファイル（`config/initializers/cors.rb`）を確認

### ビルドエラー

- ログを確認: Renderダッシュボードの「Logs」タブ
- ローカルでビルドが成功するか確認
- 環境変数がすべて正しく設定されているか確認

---

## 📝 次のステップ

- カスタムドメインの設定
- SSL証明書の設定（Renderが自動で設定）
- 有料プランへのアップグレード（収益化開始時）
- **AWSへの移行**（スケールアップ時）

---

## 🚀 AWSへの移行（フェーズ2: スケールアップ時）

収益化が進み、より安定したインフラが必要になった場合、AWSへの移行を検討できます。

### 移行のメリット

1. **スケーラビリティ**: トラフィック増加に対応しやすい
2. **信頼性**: AWSの高い可用性と冗長性
3. **統合性**: S3、RDS、CloudFrontなどAWSサービスとの統合
4. **コスト最適化**: 使用量に応じた柔軟な課金

### 移行オプション

#### オプション1: AWS Lightsail（最も簡単・推奨）

**構成:**
- **フロントエンド**: Lightsail Static Site（またはS3 + CloudFront）
- **バックエンド**: Lightsail Container（またはEC2）
- **データベース**: Lightsail PostgreSQL（またはRDS）
- **画像ストレージ**: S3（既に使用中）

**メリット:**
- 設定が簡単
- 月額固定料金で予測可能
- 管理が少ない

**コスト:**
- Lightsail Container: $7/月（512MB RAM、1 vCPU）
- Lightsail PostgreSQL: $15/月（1GB RAM、40GB SSD）
- S3: 使用量に応じて（通常は無料枠内）
- **合計: 約$22-25/月（約3300-3750円）**

**移行手順:**
1. Lightsailでコンテナサービスを作成
2. Dockerイメージをビルドしてプッシュ
3. 環境変数を設定
4. データベースをLightsail PostgreSQLに移行（またはRDS）
5. フロントエンドをLightsail Static SiteまたはS3 + CloudFrontに移行

---

#### オプション2: AWS EC2 + RDS（より柔軟）

**構成:**
- **フロントエンド**: S3 + CloudFront
- **バックエンド**: EC2（t3.microまたはt3.small）
- **データベース**: RDS PostgreSQL（db.t3.micro）
- **画像ストレージ**: S3（既に使用中）

**メリット:**
- より柔軟な設定が可能
- スケーリングオプションが豊富
- より細かい制御が可能

**コスト:**
- EC2 t3.micro: $7.5/月（1 vCPU、1GB RAM）
- RDS db.t3.micro: $15/月（1 vCPU、1GB RAM、20GBストレージ）
- S3 + CloudFront: 使用量に応じて
- **合計: 約$22-30/月（約3300-4500円）**

**移行手順:**
1. EC2インスタンスを作成（Amazon Linux 2023）
2. Dockerをインストールしてアプリをデプロイ
3. RDS PostgreSQLインスタンスを作成
4. データを移行
5. S3 + CloudFrontでフロントエンドをホスティング
6. Application Load Balancerを設定（オプション）

---

#### オプション3: AWS Amplify + EC2 + RDS（フロントエンド最適化）

**構成:**
- **フロントエンド**: AWS Amplify（自動デプロイ、CDN付き）
- **バックエンド**: EC2（またはECS）
- **データベース**: RDS PostgreSQL
- **画像ストレージ**: S3（既に使用中）

**メリット:**
- フロントエンドの自動デプロイ
- グローバルCDN
- CI/CDが組み込まれている

**コスト:**
- Amplify: 無料枠あり（その後は使用量に応じて）
- EC2: $7.5-15/月
- RDS: $15/月
- **合計: 約$22-35/月（約3300-5250円）**

---

### 移行時の注意点

1. **データベース移行**:
   - NeonからRDSへの移行: `pg_dump`と`pg_restore`を使用
   - ダウンタイムを最小化するため、メンテナンスウィンドウを計画

2. **環境変数の移行**:
   - Renderの環境変数をAWS Systems Manager Parameter StoreまたはSecrets Managerに移行

3. **ドメイン設定**:
   - Route 53でDNSを管理
   - SSL証明書はACM（AWS Certificate Manager）で自動管理

4. **監視とログ**:
   - CloudWatchでログとメトリクスを監視
   - アラームを設定して問題を早期検知

5. **バックアップ**:
   - RDSの自動バックアップを有効化
   - S3のバージョニングを有効化

---

### 移行のタイミング

**AWS移行を検討すべきタイミング:**
- 月間アクティブユーザーが1,000人を超えた
- 月間収益が$100を超えた
- Renderの無料プランの制限に達した
- より高い可用性が必要になった

**段階的な移行:**
1. **フェーズ1**: Render + Neon + S3（現在）
2. **フェーズ2**: Lightsailに移行（簡単）
3. **フェーズ3**: EC2 + RDSに移行（スケール時）

---

## 💰 コスト

**現在（無料プラン）:**
- フロントエンド: 無料
- バックエンド: 無料（スリープあり）
- データベース（Neon）: 無料（永続的、制限なし）
- AWS S3: 無料枠内（5GBストレージ、20,000回のGETリクエスト/月）

**Neonの無料枠:**
- 0.5GBのストレージ
- プロジェクト数: 無制限
- ブランチ数: 無制限
- 自動スケーリング（使用時のみ課金）
- **90日制限なし、永続的**

**AWS S3の無料枠（常に無料・永続的）:**
- 5GBのストレージ
- 20,000回のGETリクエスト/月
- 2,000回のPUTリクエスト/月
- **注意**: 無料枠は永続的ですが、この範囲を超えると課金されます（約$0.023/GB/月）

**Cloudflare R2の無料枠（永続的・推奨）:**
- 10GBのストレージ
- 100万回の読み取り/月
- 100万回の書き込み/月
- **無料枠は永続的で、12ヶ月制限なし**

**S3のコスト制限設定（重要）:**
上記の「ステップ2.1 S3のコスト制限設定」を参照して、以下の設定を行ってください：
- バケットのバージョニングを無効化
- ライフサイクルポリシーで1年以上経過したファイルを自動削除
- CloudWatchアラームで無料枠の80%に達したら通知
- バケットポリシーで2MBを超えるアップロードを拒否（アプリ側でも2MB制限あり）

**無料枠を超えた場合のコスト:**
- ストレージ: $0.023/GB/月（5GB超分）
- GETリクエスト: $0.0004/1,000リクエスト（20,000回超分）
- PUTリクエスト: $0.005/1,000リクエスト（2,000回超分）

**例**: 10GB使用、30,000回のGETリクエストの場合:
- ストレージ: (10GB - 5GB) × $0.023 = $0.115/月
- GETリクエスト: (30,000 - 20,000) / 1,000 × $0.0004 = $0.004/月
- **合計: 約$0.12/月（約18円）**

**収益化開始時（有料プラン - Render継続）:**
- バックエンド: $7/月（Render）
- データベース: Neonの無料枠を超えた場合のみ課金（通常は無料枠内）
- AWS S3: 使用量に応じて（通常は$0.023/GB/月）
- **合計: 約$7-8/月（約1050-1200円）**

**AWS移行後（Lightsail）:**
- バックエンド: $7/月（Lightsail Container）
- データベース: $15/月（Lightsail PostgreSQL）
- AWS S3: 使用量に応じて（通常は無料枠内）
- **合計: 約$22-25/月（約3300-3750円）**

**AWS移行後（EC2 + RDS）:**
- バックエンド: $7.5-15/月（EC2）
- データベース: $15/月（RDS PostgreSQL）
- AWS S3 + CloudFront: 使用量に応じて
- **合計: 約$22-35/月（約3300-5250円）**

**注意**: 
- Neonを使用することで、データベースの90日制限を回避し、長期的に無料で使用できます。
- AWS移行は段階的に行うことを推奨します（まずLightsail、必要に応じてEC2 + RDSへ）。


