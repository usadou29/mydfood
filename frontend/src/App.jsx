import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Commander } from './pages/Commander';
import { MenusFamille } from './pages/MenusFamille';
import { Traiteur } from './pages/Traiteur';
import { Evenements } from './pages/Evenements';
import { Contact } from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/commander" element={<Commander />} />
            <Route path="/menus-famille" element={<MenusFamille />} />
            <Route path="/traiteur" element={<Traiteur />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
