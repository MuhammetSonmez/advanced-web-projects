import { useState, useEffect } from "react";
import { create_takvim } from "../api/api";
import './TakvimCreate.css';
import { useNavigate } from "react-router-dom";
import TakvimList from "./TakvimList";
import Navbar from "./Navbar";

const TakvimCreate = () => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
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
    create_takvim(name, year )
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
        <Navbar/>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <br />
        <label>
          Year:
          <input type="text" value={year} onChange={(event) => setYear(event.target.value)} />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Takvim oluştur'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <TakvimList/>
    </div>
  );
};

export default TakvimCreate;
   