import React, { useEffect, useState } from "react";
import { createBlog, updateBlog, deleteBlog, listCategories, listBlogsByCategory } from "../api/api"; 
import "./BlogManagement.css"; 
import { useNavigate } from "react-router-dom";  
import Navbar from "./Navbar";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState(""); 
  const [content, setContent] = useState(""); 
  const [photo, setPhoto] = useState(null); 
  const [, setCategory] = useState(""); 
  const [categories, setCategories] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [selectedBlog, setSelectedBlog] = useState(null); 
  const [error, setError] = useState(null);
  const [role] = useState(localStorage.getItem("role")); 
  const [isEditing, setIsEditing] = useState(false); 
  const navigate = useNavigate();
  

  useEffect(() => {
    
    const fetchCategories = async () => {
      try {
        const categoriesData = await listCategories(); 
        setCategories(categoriesData); 
        setCategory(categoriesData[0]?.id || ""); 
      } catch (err) {
        setError("Kategoriler alınırken bir hata oluştu.");
        console.error(err);
      }
    };

    fetchCategories();

    const fetchBlogs = async () => {
      try {
        const blogsData = await listBlogsByCategory(localStorage.getItem('category'));
        setBlogs(blogsData);
      } catch (err) {
        setError("Bloglar alınırken bir hata oluştu.");
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);
  

  const handleCreateBlog = async () => {
    if (blogTitle.trim() && content.trim()) {
      const formData = new FormData();
      formData.append("title", blogTitle);
      formData.append("content", content);
      formData.append("photo", photo);
      formData.append("category", localStorage.getItem('category'));

      try {
        const newBlog = await createBlog(formData);
        setBlogs([...blogs, newBlog]); 
        setBlogTitle(""); 
        setContent(""); 
        setPhoto(null); 
        setCategory(categories[0]?.id || ""); 
      } catch (err) {
        setError("Blog oluşturulurken bir hata oluştu.");
      }
    } else {
      setError("Blog başlığı ve içeriği boş olamaz.");
    }
  };

  const handleUpdateBlog = async () => {
    if (selectedBlog && blogTitle.trim() && content.trim()) {
      const updatedData = {
        title: blogTitle,
        content: content,
        category: localStorage.getItem('category'),
      };

      
      if (photo) {
        updatedData.photo = photo;
      }

      try {
        const updatedBlog = await updateBlog(selectedBlog.id, updatedData);
        setBlogs(blogs.map((blog) => (blog.id === selectedBlog.id ? updatedBlog : blog)));
        setBlogTitle(""); 
        setContent(""); 
        setPhoto(null); 
        setCategory(categories[0]?.id || ""); 
        setSelectedBlog(null); 
        setIsEditing(false); 
      } catch (err) {
        setError("Blog güncellenirken bir hata oluştu.");
      }
    } else {
      setError("Blog başlığı ve içeriği boş olamaz.");
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await deleteBlog(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId)); 
    } catch (err) {
      setError("Blog silinirken bir hata oluştu.");
    }
  };

  const handleBlogClick = (blogID) => {
    localStorage.setItem("blog_id", blogID)
    navigate("/blog-detail");
    console.log(`Kategori ID: ${blogID}`);
  };

  
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar/>
    <div className="blog-management">
      <h2>{role === "Mod" ? "Blog Yönetimi" : ""}</h2> {}
      {error && <p className="error-message">{error}</p>}

      {role === "Mod" && (
        <div className="blog-form">
          <input
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Blog başlığı"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Blog içeriğini yazın"
          ></textarea>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          {isEditing ? (
            <button onClick={handleUpdateBlog}>Blog Güncelle</button>
          ) : (
            <button onClick={handleCreateBlog}>Blog Ekle</button>
          )}
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Blog Ara"
        />
      </div>

      <div className="blog-list">
        <h3>Bloglar</h3>
        <ul>
          {filteredBlogs.map((blog) => (
            <li key={blog.id } onClick={() => handleBlogClick(blog.id)} style={{cursor:'pointer'}} className="blog-item" > 
              <h4>{blog.title}</h4>
              <img
                src={"http://127.0.0.1:8000" + blog.photo}
                alt={blog.title}
                style={{ maxWidth: "60px", height: "auto" }}
              />
              <p><strong>Kategori:</strong> {categories.find((cat) => cat.id === blog.category)?.category_name || "Bilinmeyen" }</p>
              <p><strong>Oluşturulma Tarihi:</strong> {new Date(blog.created_at).toLocaleString().substring(0,10)}</p>
              {role === "Mod" && (
                <div className="blog-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlogTitle(blog.title);
                      setContent(blog.content);
                      setCategory(blog.category.id); 
                      setSelectedBlog(blog);
                      setIsEditing(true);
                    }}
                  >
                    Düzenle
                  </button>
                  <button onClick={(e) => {e.stopPropagation(); handleDeleteBlog(blog.id);}}>Sil</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

    </div>
    </div>
  );
};

export default BlogManagement;