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

// スプレッドシートIDを設定
const spreadsheetId = process.env.SPREADSHEET_ID;

// 現在の日付を取得し、MM/DD形式に変換
const date_ob = new Date();
const date = ("0" + date_ob.getDate()).slice(-2);
const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
const currentDate = `${month}/${date}`;

// コマンドライン引数から値を取得
const startTime = process.argv[2];
const endTime = process.argv[3];
const note1 = process.argv[4] || '';
const note2 = process.argv[5] || '';

// スプレッドシートからデータを読み込み、現在の日付に一致する行を見つける関数
async function findAndUpdateRow() {
  try {
    const range = 'リハビリ（7月）!A:H';
    const response = await sheets.spreadsheets.values.get({
      auth: oAuth2Client,
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const rows = response.data.values;
    if (rows.length) {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === currentDate) {
          const rowNumber = i + 1; // シートの行番号は1から始まる
          const updateRange = `リハビリ（7月）!E${rowNumber}:H${rowNumber}`;
          await updateSheet(updateRange);
          return;
        }
      }
      console.log('現在の日付に一致する行が見つかりませんでした。');
    } else {
      console.log('スプレッドシートにデータが見つかりませんでした。');
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// スプレッドシートにデータを書き込む関数
async function updateSheet(range) {
  try {
    const response = await sheets.spreadsheets.values.update({
      auth: oAuth2Client,
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[startTime, endTime, note1, note2]],
      },
    });
    console.log('セルが更新されました:', response.data);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 関数を実行
findAndUpdateRow();