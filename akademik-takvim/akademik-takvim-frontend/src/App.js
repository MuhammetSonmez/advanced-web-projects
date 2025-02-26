import './App.css';
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import Home from './components/Home';
import TakvimCreate from './components/TakvimCreate';
import EventCreate from './components/EventCreate';
import AkademikTakvim from './components/AkademikTakvim';


function App() {

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element = {<Home/>}/>
          <Route path="/takvim-create" element = {<TakvimCreate/>}/>
          <Route path="/event-create" element = {<EventCreate/>}/>
          <Route path="/akademik-takvim" element = {<AkademikTakvim/>}/>

        </Routes>
    </Router>
  );
}
export default App;
