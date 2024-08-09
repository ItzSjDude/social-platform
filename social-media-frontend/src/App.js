import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [posts, setPosts] = useState([]);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5004/login', {
        username,
        password
      });
      const { token } = response.data;
      localStorage.setItem('jwt', token);
      setToken(token);
      setLoginError('');
    } catch (error) {
      setLoginError('Login failed');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div className="App">
      <h1>Social Media App</h1>

      {!token ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        </div>
      ) : (
        <div>
          <button onClick={fetchPosts}>Fetch Posts</button>
          <ul>
            {posts.map((post) => (
              <li key={post._id}>{post.content}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
