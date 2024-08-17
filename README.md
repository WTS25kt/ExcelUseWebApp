#bugfix/google-oauth-authentication-fix
##Google認証がうまくいかなくなったため、GoogleCloudConsoleのOauth2.0クライアントIDを削除し、再作成

リダイレクトURIに `https://developers.google.com/oauthplayground` を入力するのは、OAuth 2.0の認証をテストするためには良い方法です。Google OAuth Playgroundを使用することで、OAuthフローをシミュレートし、アプリケーションの動作を確認することができます。以下の手順で行ってください。

### 手順 1: クライアントIDとシークレットの再作成

1. **Google Cloud Consoleにログイン**:
   - [Google Cloud Console](https://console.cloud.google.com/apis/credentials?hl=ja&project=silent-sweep-429801-a5)にログインします。

2. **認証情報のページを開く**:
   - 左側のメニューから「APIとサービス」 > 「認証情報」を選択します。

3. **既存のクライアントIDの削除**:
   - 「OAuth 2.0 クライアント ID」セクションで、既存のクライアントIDの右側にあるゴミ箱アイコンをクリックして削除します。

4. **新しいクライアントIDの作成**:
   - 「認証情報を作成」ボタンをクリックし、「OAuth クライアント ID」を選択します。
   - 「アプリケーションのタイプ」で「Webアプリケーション」を選択します。

5. **リダイレクトURIの設定**:
   - リダイレクトURIとして `https://developers.google.com/oauthplayground` を入力します。

6. **新しいクライアントIDとシークレットの取得**:
   - 作成が完了すると、新しいクライアントIDとクライアントシークレットが表示されます。~~これを安全に保管します。~~クライアンドIDとクライアントシークレットを控えます。

### 手順 2: OAuth Playgroundでのテスト

1. **OAuth Playgroundにアクセス**:
   - [Google OAuth Playground](https://developers.google.com/oauthplayground)にアクセスします。

2. **設定の更新**:
   - 右上の「設定」アイコン（歯車マーク）をクリックし、「Use your own OAuth credentials」を選択します。
   - 先ほど取得したクライアントIDとクライアントシークレットを入力します。

3. **認証フローの実行**:
   - 使用するスコープを選択し（例：`https://www.googleapis.com/auth/spreadsheets`）、「Authorize APIs」ボタンをクリックします。
   - Googleアカウントで認証を行い、許可を与えます。
   - 認証が成功すると、認証コードが表示されるので、「Exchange authorization code for tokens」をクリックして~~アクセストークンを取得します。~~Refresh tokenを控えます。

### 手順 3: アプリケーションの設定を更新

1. **設定ファイルの更新**:
   - 新しく作成したクライアントIDとシークレットを使用して、アプリケーションのOAuth 2.0設定ファイル（例：`credentials.json`）を更新します。

2. **アプリケーションのテスト**:
   - 新しいクライアントIDとシークレットを使用して、アプリケーションが正しく動作することを確認します。

### 注意点

- **リダイレクトURIの一致**:
  - リダイレクトURIがGoogle Cloud ConsoleとOAuth Playgroundの両方で一致していることを確認してください。

- **スコープの設定**:
  - 必要なAPIアクセス権限を持つスコープ（例：`https://www.googleapis.com/auth/spreadsheets`）を選択してください。

この方法で、Google OAuth Playgroundを使用して認証フローをテストし、アプリケーションが正しく動作することを確認できます。