import { useState, useEffect } from "react";
import { get_takvim_list, delete_takvim, update_takvim } from "../api/api";
import './TakvimList.css';
import { useNavigate } from "react-router-dom";

const TakvimList = () => {
  const [takvimler, setTakvimler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTakvim, setEditingTakvim] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedYear, setUpdatedYear] = useState("");
  const navigate = useNavigate();
  const isAuth = localStorage.getItem('jwt_token') ? true : false;
  const token = localStorage.getItem('jwt_token');

  const saveTakvimToLocalStorage = (takvim) => {
    //localStorage.setItem('selectedTakvim', JSON.stringify(takvim));
    localStorage.setItem('selectedTakvim', takvim.id);
};

  const handleUpdate = async (id) => {
    try {
      const updatedTakvim = await update_takvim(id, updatedName, updatedYear, token);
      
      setTakvimler(takvimler.map((takvim) =>
        takvim.id === id ? { ...takvim, ...updatedTakvim } : takvim
      ));

      saveTakvimToLocalStorage(updatedTakvim);
      
      setEditingTakvim(null); 
      setUpdatedName("");  
      setUpdatedYear(""); 

      console.log(`Takvim with id: ${id} updated successfully.`);
    } catch (error) {
      setError("Takvim güncellenirken bir hata oluştu.");
    }
  };

  const handleToEvent = async (takvim) =>{
    localStorage.setItem('selectedTakvim', takvim.id);
    navigate('/event-create')


  }

  const handleDelete = async (id) => {
    try {
      await delete_takvim(id); 
      setTakvimler(takvimler.filter((takvim) => takvim.id !== id));
      
      localStorage.removeItem('selectedTakvim');
      
      console.log(`Takvim with id: ${id} deleted successfully.`);
    } catch (error) {
      setError("Takvim silinirken bir hata oluştu.");
    }
  };

  const handleSelect = (takvim) => {
    saveTakvimToLocalStorage(takvim);
    console.log(`Takvim ${takvim.id} seçildi ve localStorage'a kaydedildi.`);
  };

  useEffect(() => {
    const fetchTakvimler = async () => {
      try {
        const response = await get_takvim_list();
        const sortedTakvimler = response.sort((a, b) => b.year - a.year);
        setTakvimler(sortedTakvimler);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTakvimler();
  }, []);

  if (loading) {
    return <p>Takvimler yükleniyor...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Hata: {error}</p>;
  }

  return (
    <div className="takvim-liste">
      <h2>Takvimler</h2>
      <ul>
        {takvimler.map((takvim) => (
          <li 
            key={takvim.id} 
            style={{ cursor: 'pointer' }} 
            onClick={() => handleSelect(takvim)}
          >
            <strong>{takvim.name}</strong> {takvim.year}
            <div>
                <button onClick={() => navigate("/akademik-takvim")}>Görüntüle</button>
            </div>
            {isAuth && (
              <div>
                <button style={{marginBottom:'4px'}} onClick={() => {
                  setEditingTakvim(takvim.id);
                  setUpdatedName(takvim.name);
                  setUpdatedYear(takvim.year);
                }}>Güncelle</button>
                <button style={{marginBottom:'4px'}} onClick={() => handleDelete(takvim.id)}>Sil</button>
                <button onClick={() => handleToEvent(takvim.id)}>Olay Ekle</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Takvim güncelleme formu */}
      {editingTakvim && (
        <div>
          <h3>Takvim Güncelle</h3>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="Yeni Takvim Adı"
          />
          <input
            type="text"
            value={updatedYear}
            onChange={(e) => setUpdatedYear(e.target.value)}
            placeholder="Yeni Yıl"
          />
          <button onClick={() => handleUpdate(editingTakvim)}>Güncelle</button>
          <button onClick={() => setEditingTakvim(null)}>İptal</button>
        </div>
      )}
    </div>
  );
};

export default TakvimList;
