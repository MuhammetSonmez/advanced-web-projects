import React, { useState, useEffect } from "react";
import {registerUser} from "../api/api";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await registerUser(formData);
      setSuccess(true);
    } catch (err) {
      
      const errorData = err.response?.data;
      if (typeof errorData === "object") {
        
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${value}`)
          .join(", ");
        setError(errorMessages);
      } else {
        setError(errorData || "An error occurred during registration.");
      }
    }
  };

  return (
    <div className="register-form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Kayıt işlemi başarılı!</p>}
    </div>
  );
};

export default RegisterForm;
