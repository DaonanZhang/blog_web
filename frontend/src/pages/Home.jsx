import { useState, useEffect } from "react";
import api from "../api";
import BlogSubmitBox from "../components/Submit_Blog";
import DetailBlog from "./DetailBlog";
import { Link } from "react-router-dom";
import React from "react";

function Home() {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    useEffect(() => {
        console.log("Fetching blogs for page:", currentPage);
        fetchBlogs(currentPage);
    }, [currentPage]); 

    const fetchBlogs = async (page = 1) => {
        if (typeof page !== 'number' || page < 1) {
            page = 1; 
        }

        try {
            const response = await api.get(`/blog/blogss/?page=${page}`);
            console.log("Fetched data:", response.data);

            setBlogs(response.data.results);
            setTotalPages(response.data.total_pages || 1);
            setHasNext(!!response.data.next);
            setHasPrevious(!!response.data.previous);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/blog/blogss/${id}/`);
            fetchBlogs(currentPage); 
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert("You do not have permission to delete this blog.");
            } else {
                console.error("Error deleting blog:", error);
            }
        }
    };

    return (
        <div>
            <BlogSubmitBox onBlogCreated={() => fetchBlogs(currentPage)} />

            <h1>Blog List</h1>
            <ul>
            console.log("Blogs:", blogs);
            {/* {blogs.results.map(blog => (
                <li key={blog.id}>
                    <Link to={`/blog/blogs/${blog.id}`}>{blog.title}</Link>
                    <p>{blog.content}</p>
                    <p><strong>Author:</strong> {blog.author}</p>
                    <p><strong>Created At:</strong> {new Date(blog.created_at).toLocaleString()}</p>
                    <button onClick={() => handleDelete(blog.id)}>Delete</button>
                    <hr />
                </li> */}
            {/* ))} */}
            </ul>

            <div>
                <button
                    disabled={!hasPrevious}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>

                <span>Page {currentPage} of {totalPages}</span>

                <button
                    disabled={!hasNext}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Home;
