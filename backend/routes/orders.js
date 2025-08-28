const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../db');

router.get('/', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) return res.status(400).json({ error: '缺少 user_id' });

  const id = Number(user_id);
  if (isNaN(id)) return res.status(400).json({ error: 'user_id 必須為數字' });

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    request.input('user_id', sql.Int, id);

    const result = await request.query(`
      SELECT 
        o.order_id, e.event_name, e.place,
        e.date AS event_date, -- 保持原始 DATETIME，交給前端格式化
        s.seat_no, s.price
      FROM Orders o
      JOIN Events e ON o.event_id = e.event_id
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Seats s ON oi.seat_id = s.seat_id
      WHERE o.user_id = @user_id
      ORDER BY o.order_id;
    `);

    if (result.recordset.length === 0) {
      return res.json([]);
    }

    // 整理結果
    const map = {};
    result.recordset.forEach(row => {
      if (!map[row.order_id]) {
        map[row.order_id] = {
          order_id: row.order_id,
          event_name: row.event_name,
          place: row.place,
          date: row.event_date, // 前端格式化
          seats: [],
          total_price: 0
        };
      }
      map[row.order_id].seats.push(row.seat_no);
      map[row.order_id].total_price += row.price;
    });

    res.json(Object.values(map));
  } catch (err) {
    console.error('❌ 查詢訂票紀錄失敗:', err.message);
    res.status(500).json({ error: '伺服器錯誤' }); // 上線避免暴露 SQL
  }
});

module.exports = router;
