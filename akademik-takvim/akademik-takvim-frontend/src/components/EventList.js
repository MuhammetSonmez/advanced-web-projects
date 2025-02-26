import { useState, useEffect } from "react";
import { get_event_list, delete_event, update_event } from "../api/api";
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedTerm, setUpdatedTerm] = useState("");
  const [updatedStartDate, setUpdatedStartDate] = useState("");
  const [updatedEndDate, setUpdatedEndDate] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false); // Güncelleme işlemi için loading durumu

  const isAuth = localStorage.getItem('jwt_token') ? true : false;

  const saveEventToLocalStorage = (event) => {
    localStorage.setItem('selectedEvent', event.id);
  };

  const handleUpdate = async () => {
    setLoadingUpdate(true);
    try {
      const updatedEvent = await update_event(
        editingEvent,
        localStorage.getItem('selectedTakvim'),
        updatedName,        
        updatedTerm,
        updatedStartDate,
        updatedEndDate,
        
      );

      setEvents(events.map((event) =>
        event.id === editingEvent ? { ...event, ...updatedEvent } : event
      ));

      saveEventToLocalStorage(updatedEvent);

      setEditingEvent(null);
      setUpdatedName("");
      setUpdatedTerm("");
      setUpdatedStartDate("");
      setUpdatedEndDate("");

      console.log(`Event with id: ${editingEvent} updated successfully.`);
    } catch (error) {
      setError("Event güncellenirken bir hata oluştu.");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await delete_event(id);
      setEvents(events.filter((event) => event.id !== id));

      localStorage.removeItem('selectedEvent');
      console.log(`Event with id: ${id} deleted successfully.`);
    } catch (error) {
      setError("Event silinirken bir hata oluştu.");
    }
  };

  const handleSelect = (event) => {
    saveEventToLocalStorage(event);
    console.log(`Event ${event.id} seçildi ve localStorage'a kaydedildi.`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await get_event_list();
        // eslint-disable-next-line eqeqeq
        const filteredEvents = response.filter(event => event.takvim == localStorage.getItem('selectedTakvim'));
        console.log(localStorage.getItem('selectedTakvim'));
        const sortedEvents = filteredEvents.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        setEvents(sortedEvents);
        setLoading(false);
        console.log(response);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Events yükleniyor...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Hata: {error}</p>;
  }

  return (
    <div className="event-liste">
      <h2>Olaylar</h2>
      <ul>
        {events.map((event) => (
          <li
            key={event.id}
            style={{ cursor: 'pointer' }}
            onClick={() => handleSelect(event)}
          >
            <strong>{event.name}</strong> {event.term} ({event.start_date} - {event.end_date})
            {isAuth && (
              <div>
                <button style={{ marginBottom: '4px' }} onClick={() => {
                  setEditingEvent(event.id);
                  setUpdatedName(event.name);
                  setUpdatedTerm(event.term);
                  setUpdatedStartDate(event.start_date);
                  setUpdatedEndDate(event.end_date);
                }}>Güncelle</button>
                <button onClick={() => handleDelete(event.id)}>Sil</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Event güncelleme formu */}
      {editingEvent && (
        <div>
          <h3>Event Güncelle</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <label>
              Name:
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                placeholder="Yeni Event Adı"
              />
            </label>
            <br />
            <label>
              Term:
              <select
                value={updatedTerm}
                onChange={(e) => setUpdatedTerm(e.target.value)}
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
                value={updatedStartDate}
                onChange={(e) => setUpdatedStartDate(e.target.value)}
                placeholder="Yeni Başlangıç Tarihi"
              />
            </label>
            <br />
            <label>
              End Date:
              <input
                type="date"
                value={updatedEndDate}
                onChange={(e) => setUpdatedEndDate(e.target.value)}
                placeholder="Yeni Bitiş Tarihi"
              />
            </label>
            <br />
            <button type="submit" disabled={loadingUpdate}>
              {loadingUpdate ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
            <button type="button" onClick={() => setEditingEvent(null)}>İptal</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventList;
