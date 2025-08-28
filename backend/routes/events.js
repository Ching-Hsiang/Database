const express = require('express');
const router = express.Router();
const sql = require('mssql');
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    await sql.connect(db);
    const result = await sql.query(`
      SELECT event_id, event_name, FORMAT(date, 'yyyy-MM-dd HH:mm') AS date, place
      FROM Events
    `);

    res.json(result.recordset); // 回傳 JSON 陣列
  } catch (err) {
    console.error('❌ 活動查詢失敗:', err.message);
    res.status(500).json({ error: '查詢失敗', detail: err.message });
  } finally {
    sql.close(); // 確保釋放連線
  }
});

module.exports = router;
