import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/events')
      .then((res) => setEvents(res.data))
      .catch(() => setError('❌ 載入活動失敗，請稍後再試'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-6">載入中...</div>;

  if (error)
    return (
      <div className="text-center text-red-600 mt-6">
        {error}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">🎫 活動清單</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">目前沒有可用的活動</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="border rounded-lg shadow p-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div>
                <h2 className="text-lg font-semibold">{event.event_name}</h2>
                <p className="text-gray-600 text-sm">📍 {event.place}</p>
                <p className="text-gray-500 text-sm">🗓 {event.date}</p>
              </div>
              <button
                onClick={() => navigate(`/events/${event.event_id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                查看座位
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
