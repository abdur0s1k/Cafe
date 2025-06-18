import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import ScriptLoader from './ScriptLoader'; // путь к новому компоненту

import Main from './components/main';
import Footer from './components/F-H/footer';
import Header from './components/F-H/header';
import Catalog from './components/Catalog/catalog';
import AboutUs from './components/Aboutus/aboutus'; 
import Account from './components/Users/Account'; 
import Basket from './components/Basket/basket';
import AdminPanel from './components/AdminPanel/AdminPanel'; 
import OrderHistory from "./components/Orders/OrderHistory";
import OrderManagement from "./components/Orders/OrderManagement";
import Reservation from "./components/Reservation/TableMap";
import BookingHIstory from "./components/BookingHIstory/BookingHistory"
import AdminBookings from "./components/BookingHIstory/AdminBookings"

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <div className={isAdminRoute ? 'admin-wrapper' : 'wrapper'}>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path='/reservation' element={<Reservation />}/>
        <Route path='/bookinghistory' element={<BookingHIstory />}/>
        <Route path='/admin/bookings' element={<AdminBookings />}/>
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
    const scripts = [
"https://r.mobirisesite.com/1506557/assets/bootstrap/js/bootstrap.bundle.min.js?rnd=1747831109099",
"https://r.mobirisesite.com/1506557/assets/parallax/jarallax.js?rnd=1747831109099",
"https://r.mobirisesite.com/1506557/assets/scrollgallery/scroll-gallery.js?rnd=1747831109099",
"https://r.mobirisesite.com/1506557/assets/theme/js/script.js?rnd=1747831109099"
  ];
  return (
    <Router>
      <ScriptLoader scripts={scripts} />
      <AppContent />
    </Router>
  );
}

export default App;
