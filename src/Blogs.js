import React, { useEffect, useState } from 'react';
import { firestore } from './firebase';
import './styles.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('blogs').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
      const blogData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="blogs-container">
      {blogs.map((blog) => (
        <div key={blog.id} className="blog-card card">
          <img src={blog.imageURL} className="card-img-top" alt="Blog" />
          <div className="card-body">
            <h5 className="card-title">{blog.title}</h5>
            <p className="card-text">{blog.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
