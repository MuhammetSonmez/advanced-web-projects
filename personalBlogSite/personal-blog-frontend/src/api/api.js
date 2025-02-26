import axios from "axios";

const base_endpoint = 'http://127.0.0.1:8000';

const registerUser = async (userData) => {
  const endpoint = base_endpoint + "/api/register/";
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(endpoint, userData, { headers });
    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error.message);
    throw error;
  }
};

const loginUser = async (credentials) => {
  const endpoint = base_endpoint + "/api/login/";
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(endpoint, credentials, { headers });
    console.log("Login successful:", response.data);

    const jwtToken = response.data.access;
    console.log("jwt: ", jwtToken);
    localStorage.setItem('jwt_token', jwtToken);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

const changePassword = async (oldPassword, newPassword) => {
  const endpoint = base_endpoint + "/api/change-password/";
  const jwtToken = localStorage.getItem("jwt_token");  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer: ${jwtToken}`, 
  };

  const body = {
    old_password: oldPassword,
    new_password: newPassword,
  };

  try {
    const response = await axios.post(endpoint, body, { headers });
    console.log("Password change successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during password change:", error.response?.data || error.message);
    throw error; 
  }
};


const checkUser = async () => {
    const endpoint = base_endpoint + "/api/check-user/";
    const jwtToken = localStorage.getItem('jwt_token');
    console.log("jwt: ", jwtToken);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    try {
      const response = await axios.get(endpoint, { headers });
      console.log("User details:", response.data);
      localStorage.setItem('role', response.data.Role);
  
      return response.data;  
    } catch (error) {
      console.error("Error during user check:", error.response?.data || error.message);
      throw error; 
    }
  };



  const createCategory = async (categoryName) => {
    const endpoint = base_endpoint + "/api/category/";
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    const body = {
      category_name: categoryName,
    };
  
    try {
      const response = await axios.post(endpoint, body, { headers });
      console.log("Category created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during category creation:", error.response?.data || error.message);
      throw error;
    }
  };


  const listCategories = async () => {
    const endpoint = base_endpoint + "/api/category/";
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    try {
      const response = await axios.get(endpoint, { headers });
      console.log("Categories:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during fetching categories:", error.response?.data || error.message);
      throw error;
    }
  };

  const getCategoryById = async (categoryId) => {
    const endpoint = `${base_endpoint}/api/category/${categoryId}/`;
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    try {
      const response = await axios.get(endpoint, { headers });
      console.log("Category details:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during fetching category:", error.response?.data || error.message);
      throw error;
    }
  };
  
  
  const updateCategory = async (categoryId, categoryName) => {
    const endpoint = base_endpoint + "/api/category/";
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    const body = {
      category_id: categoryId,
      category_name: categoryName,
    };
  
    try {
      const response = await axios.put(endpoint, body, { headers });
      console.log("Category updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during category update:", error.response?.data || error.message);
      throw error;
    }
  };

  const deleteCategory = async (categoryId) => {
    const endpoint = base_endpoint + "/api/category/";
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    const body = {
      category_id: categoryId,
    };
  
    try {
      const response = await axios.delete(endpoint, { headers, data: body });
      console.log("Category deleted successfully:", response.status);
      return response.status;
    } catch (error) {
      console.error("Error during category deletion:", error.response?.data || error.message);
      throw error;
    }
  };
  
  
const createBlog = async (blogData) => {
    const endpoint = base_endpoint + "/api/blog/";
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer: ${jwtToken}`,
    };
  
    try {
      const response = await axios.post(endpoint, blogData, { headers });
      console.log("Blog created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during blog creation:", error.response?.data || error.message);
      throw error;
    }
  };
  
  const listBlogs = async () => {
    const endpoint = base_endpoint + "/api/blog/";
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    try {
      const response = await axios.get(endpoint, { headers });
      console.log("Blogs:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during fetching blogs:", error.response?.data || error.message);
      throw error;
    }
  };
  
  const listBlogsByCategory = async (categoryId) => {
    const endpoint = `${base_endpoint}/api/blog/?category_id=${categoryId}`;
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    try {
      const response = await axios.get(endpoint, { headers });
      console.log("Blogs by category:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during fetching blogs by category:", error.response?.data || error.message);
      throw error;
    }
  };
  
  const getBlogById = async (blogId) => {
    const endpoint = `${base_endpoint}/api/blog/${blogId}/`;
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    try {
      const response = await axios.get(endpoint, { headers });
      console.log("Blog details:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during fetching blog:", error.response?.data || error.message);
      throw error;
    }
  };
  
  const updateBlog = async (blogId, blogData) => {
    const endpoint = base_endpoint + "/api/blog/";
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer: ${jwtToken}`,
    };
  
    const body = {
      blog_id: blogId,
      ...blogData,
    };
  
    try {
      const response = await axios.put(endpoint, body, { headers });
      console.log("Blog updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during blog update:", error.response?.data || error.message);
      throw error;
    }
  };
  
  const deleteBlog = async (blogId) => {
    const endpoint = base_endpoint + "/api/blog/";
    const jwtToken = localStorage.getItem('jwt_token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer: ${jwtToken}`,
    };
  
    const body = {
      blog_id: blogId,
    };
  
    try {
      const response = await axios.delete(endpoint, { headers, data: body });
      console.log("Blog deleted successfully:", response.status);
      return response.status;
    } catch (error) {
      console.error("Error during blog deletion:", error.response?.data || error.message);
      throw error;
    }
  };
  
  
  const addComment = async (commentText, blogId, userId) => {
      const endpoint = base_endpoint + "/api/comment/";
      const jwtToken = localStorage.getItem('jwt_token');
      const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer: ${jwtToken}`,
      };
  
      const body = {
          comment_text: commentText,
          blog_id: blogId,
          user_id: userId,
      };
  
      try {
          const response = await axios.post(endpoint, body, { headers });
          console.log("Comment added successfully:", response.data);
          return response.data;
      } catch (error) {
          console.error("Error during adding comment:", error.response?.data || error.message);
          throw error;
      }
  };
  
  const listComments = async (blogId) => {
      const endpoint = `${base_endpoint}/api/comment/?blog_id=${blogId}`;
      const jwtToken = localStorage.getItem('jwt_token');
      const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer: ${jwtToken}`,
      };
  
      try {
          const response = await axios.get(endpoint, { headers });
          console.log("Comments list:", response.data);
          return response.data;
      } catch (error) {
          console.error("Error during listing comments:", error.response?.data || error.message);
          throw error;
      }
  };
  
  const updateComment = async (commentId, updatedText) => {
      const endpoint = base_endpoint + "/api/comment/";
      const jwtToken = localStorage.getItem('jwt_token');
      const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer: ${jwtToken}`,
      };
  
      const body = {
          comment_id: commentId,
          comment_text: updatedText,
      };
  
      try {
          const response = await axios.put(endpoint, body, { headers });
          console.log("Comment updated successfully:", response.data);
          return response.data;
      } catch (error) {
          console.error("Error during updating comment:", error.response?.data || error.message);
          throw error;
      }
  };
  
  const deleteComment = async (commentId) => {
      const endpoint = base_endpoint + "/api/comment/";
      const jwtToken = localStorage.getItem('jwt_token');
      const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer: ${jwtToken}`,
      };
  
      const body = {
          comment_id: commentId,
      };
  
      try {
          const response = await axios.delete(endpoint, { headers, data: body });
          console.log("Comment deleted successfully:", response.status);
          return response.status;
      } catch (error) {
          console.error("Error during deleting comment:", error.response?.data || error.message);
          throw error;
      }
  };


  const getUsername = async (userId) => {
    try {
      const response = await axios.get(base_endpoint+`/api/user/${userId}/username/`);
      console.log('Username:', response.data.username);
      return response.data.username; 
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data.error);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request Error:', error.message);
      }
      return null; 
    }
  };
  
  

  export { 
    registerUser, 
    loginUser, 
    changePassword, 
    checkUser, 
    createCategory, 
    listCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory, 
    createBlog, 
    listBlogs, 
    listBlogsByCategory, 
    getBlogById, 
    updateBlog, 
    deleteBlog,
    addComment,
    listComments,
    updateComment,
    deleteComment,
    getUsername
  };
  