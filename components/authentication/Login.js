import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from "../../firebase/firebaseConfig"
import "./Login.css";
import { useDispatch } from 'react-redux';
import { movieActions } from '../../store/redux-store';
const Login = () => {
  const dispatch=useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  console.log("Login Component Rendered");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Query the Firestore for admin credentials
      const q = query(collection(db, 'admin'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Invalid credentials');
        return;
      }

      const adminData = querySnapshot.docs[0].data();
      const isPasswordValid = password===adminData.password;

      if (isPasswordValid) {
        dispatch(movieActions.adminLogin());
        navigate("/admin");
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>
      {error && <p>{error}</p>}
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autocomplete="current-password"/>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
