import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Search, Lock, TrendingUp, Users, Award } from 'lucide-react';
import '../styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="brand">
              <span className="brand-icon">🏁</span>
              <span className="brand-text">Apex Motors</span>
            </div>
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#showcase" className="nav-link">Showcase</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="hero-badge">🚀 Transform Your Dealership</span>
              <h1 className="hero-title">The Future of Vehicle Inventory Management</h1>
              <p className="hero-subtitle">
                Streamline your dealership with real-time inventory tracking, instant vehicle search, and seamless purchase management.
              </p>
              <div className="hero-cta">
                <Link to="/register" className="btn btn-primary btn-lg d-flex align-items-center gap-2">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <button className="btn btn-outline-light btn-lg">Watch Demo</button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <strong>10K+</strong>
                  <span>Active Users</span>
                </div>
                <div className="stat">
                  <strong>50K+</strong>
                  <span>Vehicles Listed</span>
                </div>
                <div className="stat">
                  <strong>99.9%</strong>
                  <span>Uptime</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-container">
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=600" 
                  alt="Modern Car Showroom"
                  className="hero-img"
                  crossOrigin="anonymous"
                />
                <div className="image-badge">Premium Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features Built for Success</h2>
            <p>Everything you need to manage your dealership efficiently</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Search size={32} />
              </div>
              <h3>Smart Search</h3>
              <p>Advanced filtering by make, model, category, and price range to find the perfect vehicle instantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Lock size={32} />
              </div>
              <h3>Secure Transactions</h3>
              <p>Enterprise-grade security with JWT authentication and role-based access control for complete safety.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Real-time Updates</h3>
              <p>Live inventory tracking with instant stock updates to prevent overselling and manage availability.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Multi-role Support</h3>
              <p>Admin and user roles with customized dashboards for complete control and delegation capabilities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Analytics Ready</h3>
              <p>Track sales, monitor trends, and make data-driven decisions with comprehensive reporting tools.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h3>Industry Standard</h3>
              <p>Built with Spring Boot, React, and PostgreSQL—trusted by enterprises worldwide for reliability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section" id="showcase">
        <div className="container">
          <div className="section-header">
            <h2>See It In Action</h2>
            <p>Explore our professional interface designed for dealership teams</p>
          </div>
          <div className="showcase-grid">
            <div className="showcase-item">
              <img 
                src="https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&h=400" 
                alt="Dashboard View"
                className="showcase-img"
                crossOrigin="anonymous"
              />
              <h3>Intuitive Dashboard</h3>
              <p>Clean, responsive interface optimized for quick actions and data visualization</p>
            </div>
            <div className="showcase-item">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" 
                alt="Inventory Management"
                className="showcase-img"
              />
              <h3>Inventory Management</h3>
              <p>Organize and manage your entire vehicle fleet with powerful tools</p>
            </div>
            <div className="showcase-item">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" 
                alt="Mobile Responsive"
                className="showcase-img"
              />
              <h3>Mobile Responsive</h3>
              <p>Access your dealership from any device, anywhere, anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Transparent Pricing</h2>
            <p>Simple, straightforward pricing with no hidden fees</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Starter</h3>
              <div className="price">$29<span>/month</span></div>
              <p className="price-desc">Perfect for small dealerships</p>
              <ul className="price-features">
                <li>✓ Up to 50 vehicles</li>
                <li>✓ 2 user accounts</li>
                <li>✓ Basic analytics</li>
                <li>✗ Admin features</li>
              </ul>
              <button className="btn btn-outline-light btn-block">Get Started</button>
            </div>
            <div className="pricing-card featured">
              <div className="featured-badge">Most Popular</div>
              <h3>Professional</h3>
              <div className="price">$79<span>/month</span></div>
              <p className="price-desc">For growing dealerships</p>
              <ul className="price-features">
                <li>✓ Unlimited vehicles</li>
                <li>✓ 10 user accounts</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Admin dashboard</li>
              </ul>
              <button className="btn btn-primary btn-block">Start Free Trial</button>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <div className="price">Custom</div>
              <p className="price-desc">For large operations</p>
              <ul className="price-features">
                <li>✓ Everything in Professional</li>
                <li>✓ Unlimited everything</li>
                <li>✓ API access</li>
                <li>✓ Dedicated support</li>
              </ul>
              <button className="btn btn-outline-light btn-block">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Dealership?</h2>
            <p>Join thousands of dealerships already using Apex Motors to streamline their operations.</p>
            <Link to="/register" className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2" style={{ maxWidth: '250px', margin: '0 auto' }}>
              Start Your Free Trial <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Apex Motors</h4>
              <p>Modern vehicle inventory management for the digital age.</p>
            </div>
            <div className="footer-section">
              <h5>Product</h5>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Security</a>
            </div>
            <div className="footer-section">
              <h5>Company</h5>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-section">
              <h5>Legal</h5>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Apex Motors. All rights reserved.</p>
            <div className="social-links">
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
