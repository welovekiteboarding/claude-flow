import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    alert('Thank you for your inquiry! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', phone: '', service: '', message: '' })
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <strong>📍 Location:</strong>
              <p>Harbourfront Centre<br />Toronto, ON M5J 2L7</p>
            </div>
            <div className="contact-item">
              <strong>📞 Phone:</strong>
              <p>(416) 555-FOIL</p>
            </div>
            <div className="contact-item">
              <strong>✉️ Email:</strong>
              <p>info@torontowakefoil.com</p>
            </div>
            <div className="contact-item">
              <strong>🕒 Hours:</strong>
              <p>Mon-Sun: 9:00 AM - 7:00 PM<br />
                 (Weather dependent)</p>
            </div>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Book a Session</h3>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select a Service</option>
                <option value="beginner-lesson">Wakefoil Lesson</option>
                <option value="advanced-training">Advanced Training</option>
                <option value="equipment-rental">Equipment Rental</option>
                <option value="group-session">Group Session</option>
              </select>
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Additional Information"
                rows="4"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact