import React from 'react'

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Experience the Future of Water Sports</h1>
        <p className="hero-subtitle">
          Discover the thrill of hydrofoil wakeboarding on the beautiful waters of Lake Ontario
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Book Your Session</button>
          <button className="btn btn-secondary">Learn More</button>
        </div>
      </div>
      <div className="hero-image">
        <div className="placeholder-image">
          <p>🏄‍♀️ Toronto Wakefoil Action</p>
        </div>
      </div>
    </section>
  )
}

export default Hero