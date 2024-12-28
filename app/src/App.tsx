import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <div className="h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
