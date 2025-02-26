import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";  
import "./LoginForm.css"; 
import {loginUser} from '../api/api'; 

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    useEffect(() => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        navigate("/dashboard");
      }
    }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    
    if (!formData.username || !formData.password) {
      setError("Both fields are required.");
    } else {
      try {
        
        const response = await loginUser(formData);
        console.log("Login successful:", response);
        navigate("/dashboard");
    } catch (error) {
        setError("Invalid username or password.");
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <div className="register-link">
        <p>Hesabınız yok mu? <Link to="/register">Kaydol</Link></p> {}
      </div>
    </div>
  );
};

export default LoginForm;
