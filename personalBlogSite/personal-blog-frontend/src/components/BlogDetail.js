import React, { useEffect, useState } from "react";
import "./BlogDetail.css";
import { getBlogById } from "../api/api";
import Navbar from "./Navbar";
import CommentManagement from "./CommentManagement";

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const blogId = localStorage.getItem('blog_id');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await getBlogById(blogId);
                setBlog(data);
            } catch (error) {
                console.error("Blog alınırken bir hata oluştu:", error);
            }
        };

        fetchBlog();
    }, [blogId]);

    if (!blog) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Navbar/>
        <div className="blog-detail">
            <center><h1>{blog.title}</h1></center>
            {blog.photo && <center><img src={"http://127.0.0.1:8000" + blog.photo} alt={blog.title} className="blog-photo" /></center>}
            <p>{blog.content}</p>
            <CommentManagement/>

        </div>
        </div>
    );
};

export default BlogDetail;
