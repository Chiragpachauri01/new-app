import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from './firebase';

const App = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);

    firestore.collection('posts').onSnapshot((snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setPosts(newPosts);
    });
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setImage(await fileRef.getDownloadURL());
  };

  const handlePost = async (e) => {
    e.preventDefault();
    await firestore.collection('posts').add({
      title,
      description,
      image,
      user: user.email
    });
    setImage(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <h1>Welcome to the Blog</h1>
      {user ? (
        <div>
          <h2>Create Post</h2>
          <form onSubmit={handlePost}>
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input type="file" onChange={handleImageUpload} />
            <button type="submit">Post</button>
          </form>
          {posts.map(post => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <img src={post.image} alt="post" />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <form onSubmit={handleSignIn}>
            <h2>Sign In</h2>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button type="submit">Login</button>
          </form>
          <form onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button type="submit">Register</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
