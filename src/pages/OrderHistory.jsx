import { useState } from 'react';
import axios from 'axios';

export default function OrderHistory() {
  const [userId, setUserId] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (e) => {
    e.preventDefault();
    if (!userId) return alert('請輸入 User ID');
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/api/orders?user_id=${userId}`);
      setOrders(res.data);
    } catch (error) {
      alert('查詢失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>查詢訂單紀錄</h2>
      <form onSubmit={fetchOrders}>
        <input
          placeholder="輸入 User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button type="submit">查詢</button>
      </form>

      {loading && <p>載入中...</p>}
      {!loading && orders.length === 0 && <p>尚無訂單紀錄</p>}

      {orders.map(order => (
        <div key={order.order_id} style={{ marginTop: '10px' }}>
          <h3>{order.event_name} - {order.date}</h3>
          <p>場地: {order.place}</p>
          <p>座位: {order.seats.join(', ')}</p>
          <p>總金額: {order.total_price} 元</p>
        </div>
      ))}
    </div>
  );
}
