require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const axios = require('axios');
const fs = require('fs');
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

// スプレッドシートIDを設定
const spreadsheetId = process.env.SPREADSHEET_ID;

// 現在の日付を取得し、MM/DD形式に変換
const date_ob = new Date();
const date = ("0" + date_ob.getDate()).slice(-2);
const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
const currentDate = `${month}/${date}`;

// ルートエンドポイント
app.get('/', (req, res) => {
  res.send(`
    <form action="/update" method="post">
      <input type="text" name="text" placeholder="Enter text" required>
      <button type="submit">Update</button>
    </form>
    <form action="/export" method="get">
      <button type="submit">Export</button>
    </form>
  `);
});

// スプレッドシートを更新するエンドポイント
app.post('/update', async (req, res) => {
  const text = req.body.text;
  const range = 'リハビリ（7月）!E20:H20';  // カタカナのシート名を使用
  try {
    const response = await google.sheets({ version: 'v4', auth: oAuth2Client }).spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['9:00', text, '', '']],
      },
    });
    res.send(`セルが更新されました: ${text}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).send('エラーが発生しました');
  }
});

// スプレッドシートをエクスポートするエンドポイント
app.get('/export', async (req, res) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    });

    const filePath = '/Users/shigoto/Downloads/テスト.xlsx';
    fs.writeFileSync(filePath, response.data);
    res.send(`ファイルが保存されました: ${filePath}`);
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