require('dotenv').config();
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { OAuth2 } = google.auth;

// 認証情報を設定
const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,     // クライアントID
  process.env.CLIENT_SECRET, // クライアントシークレット
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// スプレッドシートIDと範囲を設定
const spreadsheetId = process.env.SPREADSHEET_ID;
const range = 'Sheet1!A1';

// スプレッドシートにデータを書き込む関数
async function updateSheet() {
  try {
    const response = await sheets.spreadsheets.values.update({
      auth: oAuth2Client,
      spreadsheetId: spreadsheetId,
      range: range, // 範囲をエンコード
      valueInputOption: 'RAW',
      requestBody: {
        values: [['test']],
      },
    });
    console.log('セルが更新されました:', response.data);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 関数を実行
updateSheet();