import React, { useEffect, useState } from "react";
import { checkUser, changePassword } from "../api/api";  
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Dashboard.css";  

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);  
  const [oldPassword, setOldPassword] = useState("");  
  const [newPassword, setNewPassword] = useState("");  
  const [confirmPassword, setConfirmPassword] = useState("");  
  const [passwordError, setPasswordError] = useState(null);  
  const [passwordSuccess, setPasswordSuccess] = useState(null);  

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/");
    }

    const fetchUserData = async () => {
      try {
        const data = await checkUser();  
        setUserData(data);  
        localStorage.setItem('user_id', data.ID);
      } catch (err) {
        setError("Kullanıcı bilgileri alınırken bir hata oluştu.");
      } finally {
        setLoading(false);  
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Her üç şifre de gereklidir.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);  
      setPasswordSuccess("Şifreniz başarıyla değiştirildi.");
      setOldPassword("");  
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError("Şifre değişikliği sırasında bir hata oluştu.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;  
  }

  if (error) {
    return <div className="error">{error}</div>;  
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        {userData ? (
          <div className="user-details">
            <p><strong>Username:</strong> {userData.Username}</p>
            <p><strong>Name:</strong> {userData.Name}</p>
            <p><strong>Surname:</strong> {userData.Surname}</p>
            <p><strong>Email:</strong> {userData.Email}</p>
            <p><strong>Role:</strong> {userData.Role}</p>
          </div>
        ) : (
          <p>Kullanıcı bilgileri bulunamadı.</p>
        )}

        <button onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}>
          Şifremi Değiştir
        </button>

        {showChangePasswordForm && (
          <form onSubmit={handleChangePasswordSubmit} className="change-password-form">
            <div>
              <label htmlFor="oldPassword">Eski Şifre:</label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword">Yeni Şifre:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Yeni Şifre Tekrar:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Şifreyi Değiştir</button>
          </form>
        )}

        {passwordError && <p className="error">{passwordError}</p>}
        {passwordSuccess && <p className="success">{passwordSuccess}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
