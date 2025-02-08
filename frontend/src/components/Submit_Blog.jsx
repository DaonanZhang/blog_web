import React, { useState } from 'react';
import api from "../api";
import { ACCESS_TOKEN } from '../constants';

const BlogSubmitBox = ({ onBlogCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const response = await api.post(
                '/blog/blogss/',
                { title, content }
            );

            onBlogCreated(response.data);
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Error creating blog:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="submit-box">
            <h2>Create New Blog</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                required
            ></textarea>
            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
};

export default BlogSubmitBox;
