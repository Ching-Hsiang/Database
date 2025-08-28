const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../db');

router.get('/', async (req, res) => {
  const { event_id } = req.query;

  if (!event_id) {
    return res.status(400).json({ error: '缺少 event_id' });
  }

  const id = Number(event_id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'event_id 必須是數字' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    request.input('event_id', sql.Int, id);

    const result = await request.query(`
      SELECT 
        s.seat_id, s.seat_no, s.price,
        CASE WHEN oi.seat_id IS NULL THEN 0 ELSE 1 END AS is_reserved
      FROM Seats s
      LEFT JOIN OrderItems oi ON s.seat_id = oi.seat_id
      WHERE s.event_id = @event_id
      ORDER BY s.seat_no;
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ 座位查詢失敗:', err.message);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

module.exports = router;
