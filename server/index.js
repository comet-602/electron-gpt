const express = require('express');
const { OpenAI } = require('openai');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3001; // 伺服器端口

app.use(bodyParser.json());

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 使用環境變量管理你的 API 密鑰
});

// 路由處理 GPT 請求
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
    console.log(message)
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // 可以根據需要選擇不同的模型
      messages: [{ role: 'user', content: message }],
    });

    const gptMessage = response.choices[0].message.content;
    res.json({ message: gptMessage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});