import { useState, useEffect } from "react";
import { create_event } from "../api/api";
import './EventCreate.css';
import { useNavigate } from "react-router-dom";
import EventList from "./EventList";
import Navbar from "./Navbar";

const EventCreate = () => {
  const [name, setName] = useState('');
  const [term, setTerm] = useState('Güz');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('jwt_token');
    if (!isAuthenticated) {
      console.log("Token yok. Giriş sayfasına yönlendiriliyor...");
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
        'takvim': localStorage.getItem('selectedTakvim'), 
        "name": name,
        "term": term,
        "start_date": startDate,
        "end_date": endDate
    }
    create_event(data.takvim, name, term, data.start_date, data.end_date)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    window.location.reload();
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <br />
        <label>
          Term:
          <select
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          >
            <option value="Güz">Güz</option>
            <option value="Bahar">Bahar</option>
          </select>
        </label>
        <br />
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>
        <br />
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Olay ekle'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <EventList />
    </div>
  );
};

export default EventCreate;
