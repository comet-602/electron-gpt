const express = require('express');
const { OpenAI } = require('openai');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000; 

app.use(cors());
app.use(bodyParser.json());

// 初始化 OpenAI 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 使用環境變數管理你的 API 密鑰
});

// 路由處理 GPT 請求
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  console.log("=== connect to backend ===")
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // 可以根據需要選擇不同的模型
      messages: [{ role: 'user', content: message }],
    });
    const gptMessage = response.choices[0].message.content;
    console.log(gptMessage)
    res.json({ message: gptMessage });
  } catch (error) {
    if (error.status === 401) {
      res.status(401).json({ error: 'Invalid API key or quota exceeded' });
    } else if (error.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded' });
    } else if (error.status === 404) {
      res.status(404).json({ error: 'URL error' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

app.get('/api/button-config', (req, res) => {
  const buttonConfig = {
    button1: {
      name: '行事曆',
      url: 'https://192.168.53.112:8445/APHR/SMS12'
    },
    button2: {
      name: '新聞',
      url: 'https://news.google.com/home?hl=zh-TW&gl=TW&ceid=TW:zh-Hant'
    }
  };

  res.json(buttonConfig);
});

// 啟動伺服器
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
});