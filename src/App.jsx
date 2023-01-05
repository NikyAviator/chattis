import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/UI/Header';
import HomePage from './components/Pages/HomePage';
import '../scss/main.scss';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
