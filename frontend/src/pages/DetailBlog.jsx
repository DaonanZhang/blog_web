import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import React from "react";

function DetailBlog() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {

        const fetchBlog = async () => {
            try {
                const response = await api.get(`/blog/blogs/${id}/`);
                setBlog(response.data);
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await api.get(`/blog/blogs/${id}/comments/`);
                console.log("Fetched comments:", response.data.results); 
                setComments(response.data.results);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        
        fetchBlog();
        fetchComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/blog/blogs/${id}/comments/`, {
                content: newComment
            });
            setComments((prevComments) => [...prevComments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    if (!blog) return <p>Loading...</p>;

    return (
        <div>
            <h1>{blog.title}</h1>
            <p>{blog.content}</p>
            <p><strong>Author:</strong> {blog.author}</p>
            <p><strong>Created At:</strong> {new Date(blog.created_at).toLocaleString()}</p>

            <h2>Comments</h2>
            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (

                // <>debug</>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <p>{comment.content}</p>
                            <p><strong>By:</strong> {comment.author || "Anonymous"}</p>
                            <p><em>{new Date(comment.created_at).toLocaleString()}</em></p>
                        </li>
                    ))}
                </ul>
            )}

            <h3>Add a Comment</h3>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment here..."
                    required
                    rows="4"
                    cols="50"
                />
                <br />
                <button type="submit">Submit Comment</button>
            </form>

            <Link to="/">← Back to Home</Link>
        </div>
    );
}

export default DetailBlog;
