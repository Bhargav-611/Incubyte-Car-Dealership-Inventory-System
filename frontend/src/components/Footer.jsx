import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-shell mt-auto">
      <div className="container text-center">
        <p className="mb-1">&copy; {new Date().getFullYear()} Apex Motors. Crafted for a premium showroom experience.</p>
        <small>Spring Boot 3.5, React, Bootstrap & PostgreSQL powering the inventory experience.</small>
      </div>
    </footer>
  );
};

export default Footer;
