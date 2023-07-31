import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from './firebase';
import './App.css'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
const App = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [showBlog, setShowBlog] = useState(true);

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
      setShowLogIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      setShowSignUp(false);
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
    if (!title || !description || !image) {
      alert('Please fill all the fields and make sure the image is uploaded');
      return;
    }
    try {
      await firestore.collection('posts').add({
        title,
        description,
        image,
        user: user.email
      });
      setImage(null);
      setTitle('');
      setDescription('');
      setShowPost(false);
    } catch (error) {
      console.error('Error while posting', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };



  const openLogin = () => {
    setShowSignUp(false);
    setShowPost(false);
    setShowBlog(false);
    setShowLogIn(true);
  };

  const openSignUp = () => {
    setShowLogIn(false);
    setShowPost(false);
    setShowBlog(false);
    setShowSignUp(true);
  };

  const openPost = () => {
    setShowLogIn(false);
    setShowSignUp(false);
    setShowBlog(false);
    setShowPost(true);
  };

  const openBlog = () => {
    setShowLogIn(false);
    setShowSignUp(false);
    setShowPost(false);
    setShowBlog(true);
  };
  return (
    <div>


<Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand href="#" onClick={openBlog}>Blog</Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarScroll" />
    <Navbar.Collapse id="navbarScroll">
      <Nav className="ms-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
        {user ? (
          <>
            <Nav.Link onClick={openPost}>Create Post</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link onClick={openLogin}>Log In</Nav.Link>
            <Nav.Link onClick={openSignUp}>Sign Up</Nav.Link>
          </>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
      {showLogIn && !user && (
        <form onSubmit={handleSignIn} className="custom-form">
          <h2>Log In</h2>
          <input className="form-control form-field mb-2" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input className="form-control form-field mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button className="btn custom-btn" type="submit">Login</button>
        </form>
      )}

      {showSignUp && !user && (
        <form onSubmit={handleSignUp} className="custom-form">
          <h2>Sign Up</h2>
          <input className="form-control form-field mb-2" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input className="form-control form-field mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button className="btn custom-btn" type="submit">Register</button>
        </form>
      )}

      {showPost && user && (
        <form onSubmit={handlePost} className="custom-form">
          <h2>Create Post</h2>
          <input className="form-control form-field mb-2" type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="form-control form-field mb-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <input type="file" onChange={handleImageUpload} />
          <button className="btn custom-btn" type="submit">Post</button>
        </form>
      )}
<div className='row'>
{!showSignUp && !showLogIn && !showPost && posts.map(post => (
  <div className='col-lg-6 col-sm-12'>
<div class="card mb-3" >
  <img class="card-img-top"  alt="Card image cap" src={post.image} height={400}/>
  <div class="card-body">
    <h5 class="card-title">{post.title}</h5>
    <p class="card-text">{post.description}</p>
    <small className="text-muted">Posted by {post.user}</small>
  </div>
</div>
</div>

      ))}
</div>

    </div>
  );
};

export default App;