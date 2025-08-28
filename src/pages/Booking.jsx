import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event_id, selectedSeats } = location.state || {};

  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || selectedSeats.length === 0 || !event_id) {
      setMessage('⚠️ 請輸入完整資料');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/book', {
        user_id: parseInt(userId),
        event_id,
        seat_nos: selectedSeats,
      });

      setMessage(`✅ 訂票成功，訂單編號：${res.data.order_id}`);

      // Optional: 自動跳轉到查詢訂單頁
      // navigate('/orders');
    } catch (err) {
      setMessage(`❌ 訂票失敗：${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!event_id || !selectedSeats) {
    return (
      <div className="p-4 text-red-600">
        ⚠️ 錯誤：缺少選擇的座位資料，請從活動頁面重新操作。
        <div className="mt-2">
          <button onClick={() => navigate('/')} className="text-blue-600 underline">
            回活動列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">確認訂票</h2>

      <div className="mb-2">
        <p>活動編號：{event_id}</p>
        <p>選擇座位：{selectedSeats.join(', ')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mt-4">
        <input
          className="w-full border p-2"
          type="number"
          placeholder="請輸入使用者 ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '送出中...' : '確認送出訂單'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 text-sm ${
            message.startsWith('✅')
              ? 'text-green-700'
              : 'text-red-600'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
