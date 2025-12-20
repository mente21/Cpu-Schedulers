import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Activity, Layers, Clock, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { pathname } = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: null },
    { path: '/rr', label: 'Round Robin', icon: <Clock size={14} /> },
    { path: '/fcfs', label: 'FCFS', icon: <Layers size={14} /> },
    { path: '/sjf', label: 'SJF', icon: <Activity size={14} /> },
  ];

  // Close menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuVariants = {
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { opacity: 0, x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="nav-brand group z-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Cpu className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">Schedule</span>
        </NavLink>
        
        {/* Desktop Links */}
        <div className="nav-links desktop-menu">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-item flex items-center gap-2 ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <motion.div 
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className="mobile-menu-overlay"
      >
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            {link.icon && React.cloneElement(link.icon, { size: 28 })}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </motion.div>
    </>
  );
};

export default Navbar;
