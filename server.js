require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 認証情報を設定
const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// スプレッドシートIDと範囲を設定
const spreadsheetId = process.env.SPREADSHEET_ID;

// ルートエンドポイント
app.get('/', (req, res) => {
  res.send(`
    <form action="/update" method="post">
      <input type="text" name="text" placeholder="Enter text" required>
      <button type="submit">Update</button>
    </form>
  `);
});

// スプレッドシートを更新するエンドポイント
app.post('/update', async (req, res) => {
  const text = req.body.text;
  const range = 'シート1!A1';  // カタカナのシート名を使用
  try {
    const response = await google.sheets({ version: 'v4', auth: oAuth2Client }).spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[text]],
      },
    });
    res.send(`セルが更新されました: ${text}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).send('エラーが発生しました');
  }
});

// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});