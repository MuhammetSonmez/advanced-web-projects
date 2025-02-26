import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import CategoryManagement from "./components/CategoryManagement";
import BlogManagement from "./components/BlogManagement";
import BlogDetail from "./components/BlogDetail";

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element = {<Dashboard/>} />
          <Route path="/" element = {<CategoryManagement/>} />
          <Route path="/blog" element = {<BlogManagement/>} />
          <Route path="/blog-detail" element = {<BlogDetail/>}/>
        </Routes>
    </Router>
  );
}

export default App;
