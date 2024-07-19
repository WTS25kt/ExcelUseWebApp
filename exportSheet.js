require('dotenv').config();
const { google } = require('googleapis');
const axios = require('axios');
const fs = require('fs');
const { OAuth2 } = google.auth;

// 認証情報を設定
const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,     // クライアントID
  process.env.CLIENT_SECRET, // クライアントシークレット
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// アクセストークンを取得する関数
async function getAccessToken() {
  try {
    const tokens = await oAuth2Client.getAccessToken();
    return tokens.token;
  } catch (error) {
    console.error('アクセストークンの取得に失敗しました:', error);
    throw error;
  }
}

// スプレッドシートをエクスポートする関数
async function exportSheet() {
  try {
    const accessToken = await getAccessToken();
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const filePath = '/Users/shigoto/Downloads/勤怠状況.xlsx';
    fs.writeFileSync(filePath, response.data);
    console.log(`ファイルが保存されました: ${filePath}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 関数を実行
exportSheet();
