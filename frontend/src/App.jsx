
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Simulator from './components/Simulator';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container pt-32 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rr" element={<Simulator key="RR" algorithm="RR" />} />
            <Route path="/fcfs" element={<Simulator key="FCFS" algorithm="FCFS" />} />
            <Route path="/sjf" element={<Simulator key="SJF" algorithm="SJF" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
