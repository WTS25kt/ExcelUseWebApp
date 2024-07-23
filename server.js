require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ルートエンドポイント
app.get('/', (req, res) => {
  res.send(`
    <form action="/update" method="post">
      <input type="text" name="startTime" value="9:00" onfocus="this.value=''" placeholder="Enter start time" required>
      <input type="text" name="endTime" value="18:00" onfocus="this.value=''" placeholder="Enter end time" required>
      <select name="note1">
        <option value="">--選択してください--</option>
        <option value="有">有</option>
      </select>
      <input type="text" name="note2" value="" onfocus="this.value=''" placeholder="Enter note 2">
      <button type="submit">Update Sheet</button>
    </form>
    <form action="/export" method="post">
      <button type="submit">Export Sheet</button>
    </form>
  `);
});

// スプレッドシートを更新するエンドポイント
app.post('/update', (req, res) => {
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const note1 = req.body.note1 || '';
  const note2 = req.body.note2 || '';

  exec(`node script.js ${startTime} ${endTime} ${note1} ${note2}`, (error, stdout, stderr) => {
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