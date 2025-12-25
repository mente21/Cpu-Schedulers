import React from "react";
import { Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Brand Badge */}
        <div className="footer-brand">
          <Code2 size={16} className="text-primary" />
          <span>Process Scheduling Simulation Engine v2.0</span>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Content */}
        <div className="flex flex-col items-center gap-4">
          <p className="footer-about-title">About</p>
          
          <p className="footer-description">
            Schedulix — an interactive CPU scheduling simulator for visualizing and comparing 
            scheduling algorithms such as Round Robin, FCFS, and SJF. Use the simulator to 
            experiment with time quantum, arrival times, and priorities to understand 
            scheduler behaviour and performance.
          </p>

          <div className="footer-links">
            <p className="source-link-wrapper">
              <span className="source-label">Source:</span>
              <a
                href="https://github.com/mente21/Cpu-Schedulers"
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                github.com/mente21/Cpu-Schedulers
              </a>
            </p>
            
            <p className="copyright">
              <span>&copy; {new Date().getFullYear()} Schedulix</span> • Licensed under MIT
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
