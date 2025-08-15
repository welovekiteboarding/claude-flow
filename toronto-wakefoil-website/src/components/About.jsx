import React from 'react'

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">About Toronto Wakefoil</h2>
            <p>
              Located on the stunning shores of Lake Ontario, Toronto Wakefoil is your premier 
              destination for hydrofoil wakeboarding adventures. Our experienced team of certified 
              instructors is passionate about sharing the incredible sensation of gliding above 
              the water on a hydrofoil.
            </p>
            <p>
              Whether you're a complete beginner or looking to master advanced techniques, 
              we provide personalized instruction and top-of-the-line equipment to ensure 
              you have an unforgettable experience on the water.
            </p>
            <div className="about-features">
              <div className="feature">
                <h4>🏆 Certified Instructors</h4>
                <p>Professional, safety-focused training</p>
              </div>
              <div className="feature">
                <h4>🌊 Prime Location</h4>
                <p>Beautiful Lake Ontario waters</p>
              </div>
              <div className="feature">
                <h4>⚡ Latest Equipment</h4>
                <p>Top-quality foil boards and gear</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="placeholder-image">
              <p>🌅 Lake Ontario Views</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About