require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ルートエンドポイント
app.get('/', (req, res) => {
  res.send(`
    <form action="/update" method="post">
      <button type="submit">Update Sheet</button>
    </form>
    <form action="/export" method="post">
      <button type="submit">Export Sheet</button>
    </form>
  `);
});

// スプレッドシートを更新するエンドポイント
app.post('/update', (req, res) => {
  exec('node script.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`エラーが発生しました: ${error.message}`);
      return res.status(500).send('エラーが発生しました');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('エラーが発生しました');
    }
    console.log(`stdout: ${stdout}`);
    res.send(`スプレッドシートが更新されました: ${stdout}`);
  });
});

// スプレッドシートをエクスポートするエンドポイント
app.post('/export', (req, res) => {
  exec('node exportSheet.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`エラーが発生しました: ${error.message}`);
      return res.status(500).send('エラーが発生しました');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('エラーが発生しました');
    }
    console.log(`stdout: ${stdout}`);
    res.send(`スプレッドシートがエクスポートされました: ${stdout}`);
  });
});

// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});