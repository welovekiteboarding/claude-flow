import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Toronto Wakefoil</h3>
            <p>Experience the future of water sports on Lake Ontario</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="YouTube">📺</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Wakefoil Lessons</a></li>
              <li><a href="#services">Advanced Training</a></li>
              <li><a href="#services">Equipment Rental</a></li>
              <li><a href="#services">Group Sessions</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📍 Harbourfront Centre<br />Toronto, ON M5J 2L7</p>
            <p>📞 (416) 555-FOIL</p>
            <p>✉️ info@torontowakefoil.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Toronto Wakefoil. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer