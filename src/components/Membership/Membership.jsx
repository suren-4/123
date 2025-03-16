import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Membership.css';
import ArrowButton from '../common/ArrowButton';

const Membership = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setShowDemo(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleCancelMembership = () => {
    if (window.confirm('Are you sure you want to cancel your membership?')) {
      setShowDemo(false);
    }
  };

  const plans = [
    {
      title: "Basic Explorer",
      price: "₹999",
      duration: "/year",
      features: [
      
        
        "Monthly curated collections",
        
        "Quarterly newsletter subscription",
        "Live sessions with the Archaelogist",
        "Instant artifact feed access",
        
      ],
      recommended: false
    },
    {
      title: "Kalanjiyam Patron",
      price: "₹2,499",
      duration: "/year",
      features: [
    
        
        "Exclusive excavatory documentaries",
        "Behind-the-scenes updates",
       
        "Access to exclusive artifact lectures",
        "Live sessions with the Archaelogist",
       
        "Quarterly artifact magazine",
        "Instant artifact feed access",
      ],
      recommended: true
    }
  ];

  return (
    <div className="membership-container">
      <ArrowButton onClick={() => navigate(-1)} />
      
      <div className="membership-header">
        <h1>Explore Ancient Artifacts Like Never Before</h1>
        <p>Subscribe to get instant access to our extensive artifact collection with real-time updates and exclusive content.</p>
      </div>
      
      {showDemo ? (
        <div className="current-membership">
          <div className="membership-badge">
            <span className="checkmark">✓</span>
            <h2>Active Membership</h2>
          </div>
          
          <div className="membership-details">
            <p><strong>Plan:</strong> {selectedPlan.title}</p>
            <p><strong>Start Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Renewal Date:</strong> {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
          
          <div className="membership-actions">
            <button className="cancel-button" onClick={handleCancelMembership}>
              Cancel Membership
            </button>
          </div>
        </div>
      ) : (
        <div className="plans-container-horizontal">
          {plans.map((plan) => (
            <div 
              key={plan.title} 
              className={`plan-card-horizontal ${selectedPlan?.title === plan.title ? 'selected' : ''} ${plan.recommended ? 'recommended' : ''}`}
            >
              <h2 className="plan-name">{plan.title}</h2>
              
              <ul className="plan-features-list">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-check">✓</span> {feature}
                  </li>
                ))}
              </ul>
              
              <div className="plan-price-tag">{plan.price} {plan.duration}</div>
              
              <button 
                className="plan-action-button"
                onClick={() => handleSubscribe(plan)}
                disabled={processingPayment}
              >
                {processingPayment && selectedPlan?.title === plan.title ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="membership-benefits">
        <h2>Membership Benefits</h2>
        
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🔄</div>
            <h3>Real-Time Updates</h3>
            <p>Get instant notifications about new artifact discoveries and additions to our collection.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h3>Personalized Feed</h3>
            <p>Receive customized artifact recommendations based on your interests and browsing history.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">��️</div>
            <h3>Exclusive Access</h3>
            <p>Get special access to curator talks, guided tours, and preview events.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">📱</div>
            <h3>Instant Access</h3>
            <p>Browse and explore artifacts anytime, anywhere through our mobile-friendly platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership; 