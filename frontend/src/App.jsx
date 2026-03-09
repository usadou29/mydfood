import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Commander } from './pages/Commander';
import { MenusFamille } from './pages/MenusFamille';
import { Traiteur } from './pages/Traiteur';
import { Evenements } from './pages/Evenements';
import { Contact } from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/commander" element={<Commander />} />
          <Route path="/menus-famille" element={<MenusFamille />} />
          <Route path="/traiteur" element={<Traiteur />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
