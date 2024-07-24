const express = require('express');
const { OpenAI } = require('openai');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000; // 伺服器端口

app.use(cors());
app.use(bodyParser.json());

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 使用環境變量管理你的 API 密鑰
});

// 路由處理 GPT 請求
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // 可以根據需要選擇不同的模型
      messages: [{ role: 'user', content: message }],
    });
    console.log(response)

    const gptMessage = response.choices[0].message.content;
    res.json({ message: gptMessage });
  } catch (error) {
    console.log(error.status)
    if (error.status === 401) {
      res.status(401).json({ error: 'Invalid API key or quota exceeded' });
    } else if (error.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});