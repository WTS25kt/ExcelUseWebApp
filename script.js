const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { OAuth2 } = google.auth;

// 認証情報を設定
const oAuth2Client = new OAuth2(
  'YOUR_CLIENT_ID',     // クライアントID
  'YOUR_CLIENT_SECRET', // クライアントシークレット
);

oAuth2Client.setCredentials({
  refresh_token: 'YOUR_REFRESH_TOKEN',
});

// スプレッドシートIDと範囲を設定
const spreadsheetId = 'YOUR_SPREADSHEET_ID';
const range = 'Sheet1!A1';

// スプレッドシートにデータを書き込む関数
async function updateSheet() {
  try {
    const response = await sheets.spreadsheets.values.update({
      auth: oAuth2Client,
      spreadsheetId: spreadsheetId,
      range: range,
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