import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../scss/main.scss';
import Navigation from './components/Navigation';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Chat from './pages/Chat.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  // Get the user that is logging in, to store it in a global variable
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = () => {
      axios.get('/api/fetch-user').then((response) => {
        setUser(response.data.user);
      });
    };
    getUser();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navigation userData={user} setUserCallback={setUser} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login setUserCallback={setUser} />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/chat' element={<Chat setUserCallback={setUser} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
