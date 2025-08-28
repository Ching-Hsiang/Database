const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 測試首頁
app.get('/', (req, res) => {
  res.send('✅ API 伺服器已啟動');
});

// API 路由模組
app.use('/api/events', require('./routes/events'));
app.use('/api/seats', require('./routes/seats'));
app.use('/api/book', require('./routes/book'));
app.use('/api/orders', require('./routes/orders'));

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('❌ 伺服器錯誤:', err);
  res.status(500).json({ error: '伺服器內部錯誤' });
});

app.listen(PORT, () => {
  console.log(`✅ 後端 API 運行於 http://localhost:${PORT}`);
});
