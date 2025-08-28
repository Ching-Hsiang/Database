import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventDetail() {
  const { id: eventId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/seats?event_id=${eventId}`)
      .then((res) => setSeats(res.data))
      .catch(() => setError('❌ 無法載入座位資料，請稍後再試'))
      .finally(() => setLoading(false));
  }, [eventId]);

  const toggleSeat = (seat_no) => {
    if (selectedSeats.includes(seat_no)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat_no));
    } else {
      setSelectedSeats([...selectedSeats, seat_no]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('請至少選擇一個座位');
      return;
    }
    navigate('/booking', {
      state: {
        event_id: parseInt(eventId),
        selectedSeats: selectedSeats,
      },
    });
  };

  if (loading) return <div className="text-center mt-6">載入中...</div>;
  if (error) return <div className="text-red-600 text-center mt-6">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">選擇座位</h2>

      {seats.length === 0 ? (
        <p className="text-gray-500 text-center">此活動沒有座位資訊</p>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4 mb-6">
            {seats.map((seat) => {
              const isSelected = selectedSeats.includes(seat.seat_no);
              return (
                <button
                  key={seat.seat_id}
                  disabled={seat.is_reserved === 1}
                  onClick={() => toggleSeat(seat.seat_no)}
                  className={`p-3 text-sm border rounded-lg font-semibold transition ${
                    seat.is_reserved === 1
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-white hover:bg-blue-100'
                  }`}
                >
                  {seat.seat_no}
                  <div className="text-xs text-gray-500">{seat.price} 元</div>
                </button>
              );
            })}
          </div>

          {selectedSeats.length > 0 && (
            <div className="mb-4 text-green-700">
              ✅ 已選擇座位：{selectedSeats.join(', ')}
            </div>
          )}

          <button
            onClick={handleContinue}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full"
          >
            繼續訂票
          </button>
        </>
      )}
    </div>
  );
}
