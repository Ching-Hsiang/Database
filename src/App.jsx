// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import Booking from './pages/Booking';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EventList />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/orders" element={<OrderHistory />} />
    </Routes>
  );
}

export default App;
