const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../db');

router.post('/', async (req, res) => {
  const { user_id, event_id, seat_nos } = req.body;

  if (!user_id || !event_id || !seat_nos?.length) {
    return res.status(400).json({ error: '缺少訂單資料' });
  }

  const pool = await sql.connect(dbConfig);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 建立訂單
    const request = new sql.Request(transaction);
    request.input('user_id', sql.Int, user_id);
    request.input('event_id', sql.Int, event_id);

    const orderResult = await request.query(`
      INSERT INTO Orders (user_id, event_id)
      OUTPUT INSERTED.order_id
      VALUES (@user_id, @event_id);
    `);

    const order_id = orderResult.recordset[0].order_id;

    for (const seat_no of seat_nos) {
      // 檢查座位是否可用（未被任何訂單占用）
      const seatRequest = new sql.Request(transaction);
      seatRequest.input('event_id', sql.Int, event_id);
      seatRequest.input('seat_no', sql.NVarChar, seat_no);

      const seatQuery = await seatRequest.query(`
        SELECT s.seat_id 
        FROM Seats s
        LEFT JOIN OrderItems oi ON s.seat_id = oi.seat_id
        WHERE s.event_id = @event_id AND s.seat_no = @seat_no AND oi.seat_id IS NULL;
      `);

      if (!seatQuery.recordset.length) {
        throw new Error(`座位 ${seat_no} 已被預訂或不存在`);
      }

      const seat_id = seatQuery.recordset[0].seat_id;

      // 插入訂單明細
      const insertRequest = new sql.Request(transaction);
      insertRequest.input('seat_id', sql.Int, seat_id);
      insertRequest.input('order_id', sql.Int, order_id);

      await insertRequest.query(`
        INSERT INTO OrderItems (order_id, seat_id) VALUES (@order_id, @seat_id);
      `);
    }

    await transaction.commit();
    res.json({ order_id });
  } catch (err) {
    await transaction.rollback();
    console.error('❌ 訂單建立失敗:', err.message);
    res.status(400).json({ error: err.message });
  } finally {
    sql.close(); // 釋放連線（或使用 pool.close()）
  }
});

module.exports = router;
