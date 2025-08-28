const sql = require('mssql');
const config = require('./db');

async function testQuery() {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT TOP 5 * FROM Events');
    console.log('✅ 查詢結果：');
    console.table(result.recordset);
    sql.close();
  } catch (err) {
    console.error('❌ 查詢失敗:', err.message);
  }
}

testQuery();
