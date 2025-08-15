import React, { useState } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-logo">
            <h1>Toronto Wakefoil</h1>
          </div>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <a href="#home" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#services" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Services
              </a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                About
              </a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Contact
              </a>
            </li>
          </ul>
          <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header