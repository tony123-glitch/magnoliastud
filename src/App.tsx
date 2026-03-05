import { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { Process } from './components/Process';
import { Pricing } from './components/Pricing';
import { Reviews } from './components/Reviews';
import { Location } from './components/Location';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ScrollToTop } from './components/ScrollToTop';
import { PortfolioPage } from './pages/PortfolioPage';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');

  const handleBookClick = (service?: string) => {
    setPreselectedService(service || '');
    setIsBookingOpen(true);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="bg-background min-h-screen text-foreground font-sans selection:bg-[#c6b198]/30 selection:text-white flex flex-col">
        <Navbar onBookClick={() => setIsBookingOpen(true)} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero onBookClick={handleBookClick} />
                <Services onBookClick={handleBookClick} />
                <Portfolio />
                <About />
                <Process />
                <Pricing onBookClick={handleBookClick} />
                <Reviews />
                <Location />
              </>
            } />
            <Route path="/portfolio" element={<PortfolioPage onBookClick={handleBookClick} />} />
          </Routes>
        </main>

        <Footer onBookClick={handleBookClick} />

        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          preselectedService={preselectedService}
        />
      </div>
    </Router>
  );
}

export default App;
