import React from 'react'

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Wakefoil Lessons",
      description: "Learn the basics of hydrofoil wakeboarding with our certified instructors",
      icon: "🏄‍♂️",
      price: "From $150/session"
    },
    {
      id: 2,
      title: "Advanced Training",
      description: "Take your wakefoiling skills to the next level with advanced techniques",
      icon: "🚀",
      price: "From $200/session"
    },
    {
      id: 3,
      title: "Equipment Rental",
      description: "High-quality wakefoil boards and equipment available for rent",
      icon: "⛵",
      price: "From $75/day"
    },
    {
      id: 4,
      title: "Group Sessions",
      description: "Perfect for corporate events, team building, or group celebrations",
      icon: "👥",
      price: "Custom pricing"
    }
  ]

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <p className="service-price">{service.price}</p>
              <button className="btn btn-outline">Learn More</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services