import React, { useEffect, useState } from "react";
import {
  addComment,
  listComments,
  updateComment,
  deleteComment,
  getUsername,
} from "../api/api";
import "./CommentManagement.css";
import { useNavigate } from "react-router-dom";

const CommentManagement = () => {
  const blogId = localStorage.getItem("blog_id");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role] = useState(localStorage.getItem("role"));
  const navigation = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await listComments(blogId);

        
        const commentsWithUsernames = await Promise.all(
          commentsData.map(async (comment) => {
            const username = await getUsername(comment.user_id);
            return { ...comment, username: username }; 
          })
        );

        setComments(commentsWithUsernames);
      } catch (err) {
        setError(err.response?.data?.error || "Yorumlar yüklenirken hata oluştu.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [blogId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const userId = localStorage.getItem("user_id");
        const addedComment = await addComment(newComment, blogId, userId);
        const username = await getUsername(userId); 
        setComments([...comments, { ...addedComment, username }]);
        setNewComment("");
        setError("");
      } catch (err) {
        setError("Yorum eklenirken bir hata oluştu.");
        if(err.response.status === 401){
          navigation("/login");
        }
      }
    } else {
      setError("Yorum boş olamaz.");
    }
  };

  const handleUpdateComment = async () => {
    if (updatedText.trim()) {
      try {
        const updatedComment = await updateComment(
          editingComment.id,
          updatedText
        );
        setComments(
          comments.map((comment) =>
            comment.id === editingComment.id
              ? { ...updatedComment, username: comment.username } 
              : comment
          )
        );
        setEditingComment(null);
        setUpdatedText("");
      } catch (err) {
        setError("Yorum güncellenirken bir hata oluştu.");
        console.error(err);
      }
    } else {
      setError("Yorum metni boş olamaz.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setError("Yorum silinirken bir hata oluştu.");
      console.error(err);
    }
  };

  return (


    <div className="comment-management">
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : (
        <>
          <div className="comment-list">
            <h3>Yorumlar</h3>
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  <p>
                    <strong> {comment.username || "Bilinmiyor"} </strong>
                  </p>
                  <p>{comment.comment_text}</p>
                  <p>
                  <p style={{ color: "gray", opacity: 0.7 }}>{new Date(comment.created_at).toLocaleString().substring(0,10)}</p>
                  </p>
                  {role === "Mod" && (
                    <div>
                      <button
                        onClick={() => {
                          setEditingComment(comment);
                          setUpdatedText(comment.comment_text);
                        }}
                      >
                        Düzenle
                      </button>
                      <button onClick={() => handleDeleteComment(comment.id)}>
                        Sil
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yeni yorum ekle"
            ></textarea>
            <button onClick={handleAddComment}>Ekle</button>
          </div>

          {editingComment && (
            <div className="comment-edit-form">
              <textarea
                value={updatedText}
                onChange={(e) => setUpdatedText(e.target.value)}
                placeholder="Yorumu güncelle"
              ></textarea>
              <button onClick={handleUpdateComment}>Güncelle</button>
              <button onClick={() => setEditingComment(null)}>İptal</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentManagement;
