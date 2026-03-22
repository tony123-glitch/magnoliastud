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

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProjectsList } from './pages/admin/AdminProjectsList';
import { AdminProjectDetail } from './pages/admin/AdminProjectDetail';

// Portal Pages
import { ClientPortalLogin } from './pages/portal/ClientPortalLogin';
import { ClientPortal } from './pages/portal/ClientPortal';

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
        {/* We want the Navbar and Footer to only show on public routes, not Admin routes. 
            So we should extract the public layout. But for simplicity, we can just conditionally render 
            or wrap public routes in a layout component. */}
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route path="/" element={
            <>
              <Navbar onBookClick={() => setIsBookingOpen(true)} />
              <main className="flex-grow">
                <Hero onBookClick={handleBookClick} />
                <Services onBookClick={handleBookClick} />
                <Portfolio />
                <About />
                <Process />
                <Pricing onBookClick={handleBookClick} />
                <Reviews />
                <Location />
              </main>
              <Footer onBookClick={handleBookClick} />
            </>
          } />
          
          <Route path="/portfolio" element={
            <>
              <Navbar onBookClick={() => setIsBookingOpen(true)} />
              <main className="flex-grow">
                <PortfolioPage onBookClick={handleBookClick} />
              </main>
              <Footer onBookClick={handleBookClick} />
            </>
          } />

          {/* Client Portal Routes */}
          <Route path="/portal" element={<ClientPortalLogin />} />
          <Route path="/portal/dashboard" element={<ClientPortal />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjectsList />} />
            <Route path="projects/:id" element={<AdminProjectDetail />} />
          </Route>
        </Routes>

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
