import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaThList, FaTachometerAlt, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    window.location.reload();
    localStorage.clear();
    console.log("Logout işlemi gerçekleşti");


  };

  const isAuthenticated = localStorage.getItem("jwt_token");

  return (
    <nav style={styles.navbar}>
      {/* Sol taraf */}
      <div style={styles.leftSection}>
        <Link to="/" style={styles.navLink}>
          <FaThList style={styles.icon} /> Kategoriler
        </Link>
      </div>

      {/* Sağ taraf */}
      <div style={styles.rightSection}>
        {isAuthenticated && (
          <Link to="/dashboard" style={styles.navLink}>
            <FaTachometerAlt style={styles.icon} /> Dashboard
          </Link>
        )}
        {isAuthenticated ? (
          <button onClick={handleLogout} style={styles.logoutButton}>
            <FaSignOutAlt style={styles.icon} /> Logout
          </button>
        ) : (
          <Link to="/login" style={styles.logoutButton}>
            <FaSignInAlt style={styles.icon} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
    top: 0,
    width: "98%",
    zIndex: 1000,
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
  },
  leftSection: {
    display: "flex",
    gap: "15px",
  },
  rightSection: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  navLink: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  icon: {
    fontSize: "18px",
  },
  logoutButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
};

export default Navbar;
