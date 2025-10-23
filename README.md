# Backpackers App

バックパッカーのための旅行情報共有アプリケーション

## 🏗️ 技術スタック（本番環境：Render 単体構成）

```mermaid
graph TB
    subgraph "🌐 本番環境 (Render)"
        subgraph "Frontend"
            A[React 18] --> B[TypeScript]
            B --> C[Vite]
            C --> D[Tailwind CSS]
            D --> E[Fetch API]
            E --> F[React Router]
        end
        
        subgraph "Backend"
            G[Rails 8] --> H[Ruby 3.2.8]
            H --> I[Puma Server]
            I --> J[JWT Authentication]
            J --> K[REST API]
        end
        
        subgraph "Database"
            L[PostgreSQL] --> M[Solid Cache]
            M --> N[Solid Queue]
            N --> O[Solid Cable]
        end
        
        subgraph "Infrastructure"
            P[Docker Container] --> Q[Auto Deploy]
            Q --> R[SSL Certificate]
            R --> S[Custom Domain]
        end
    end
    
    subgraph "🔧 開発環境"
        T[Local Development] --> U[Foreman]
        U --> V[Hot Reload]
    end
    
    A --> K
    K --> L
    P --> A
    P --> G
    P --> L
```

## 🚀 開発環境の起動

```bash
# 開発環境を起動
npm run up
# または
foreman start -f Procfile.dev

# 開発環境を停止（Ctrl+C または）
npm run down
```

## 📝 開発ルール

- POST/PATCHで送るときは必ずキー付きでラップする