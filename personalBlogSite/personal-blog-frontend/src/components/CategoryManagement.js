import React, { useEffect, useState } from "react";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../api/api"; 
import "./CategoryManagement.css"; 
import { useNavigate } from "react-router-dom";  
import Navbar from "./Navbar";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [error, setError] = useState(null);
  const [role,] = useState(localStorage.getItem("role")); 
  const [isEditing, setIsEditing] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await listCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError("Kategoriler alınırken bir hata oluştu.");
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (categoryName.trim()) {
      try {
        const newCategory = await createCategory(categoryName);
        setCategories([...categories, newCategory]); 
        setCategoryName(""); 
      } catch (err) {
        setError("Kategori oluşturulurken bir hata oluştu.");
      }
    } else {
      setError("Kategori adı boş olamaz.");
    }
  };

  const handleUpdateCategory = async () => {
    if (selectedCategory && categoryName.trim()) {
      try {
        const updatedCategory = await updateCategory(selectedCategory.id, categoryName);
        setCategories(categories.map((cat) => (cat.id === selectedCategory.id ? updatedCategory : cat)));
        setCategoryName(""); 
        setSelectedCategory(null); 
        setIsEditing(false); 
      } catch (err) {
        setError("Kategori güncellenirken bir hata oluştu.");
      }
    } else {
      setError("Kategori adı boş olamaz.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter((cat) => cat.id !== categoryId)); 
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    localStorage.setItem("category", categoryId)
    navigate("/blog");
    console.log(`Kategori ID: ${categoryId}`);
  };

  
  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>            <Navbar/>

    <div className="category-management">
      <h2>{role === "Mod" ? "Kategori Yönetimi" : ""}</h2> {}
      {error && <p className="error-message">{error}</p>}

      {role === "Mod" && (
        <div className="category-form">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Kategori adı"
          />
          {isEditing ? (
            <button onClick={handleUpdateCategory}>Kategori Güncelle</button>
          ) : (
            <button onClick={handleCreateCategory}>Kategori Ekle</button>
          )}
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Kategori Ara"
        />
      </div>

      <div className="category-list">
        <h3>Kategoriler</h3>
        <ul>
          {filteredCategories.map((category) => (
            <li key={category.id} onClick={() => handleCategoryClick(category.id)} style={{cursor:'pointer'}}>
            {category.category_name}
              {role === "Mod" && (
                <>
                  <button onClick={(e) => {e.stopPropagation(); setCategoryName(category.category_name); setSelectedCategory(category); setIsEditing(true); }}>Düzenle</button>
                  <button onClick={(e) => {e.stopPropagation(); handleDeleteCategory(category.id);}}>Sil</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default CategoryManagement;
