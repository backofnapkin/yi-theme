import React from 'react';
import type { CSSProperties } from 'react';

// Import Google Fonts in the component to keep them scoped
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
`;

// Scoped styles using CSS-in-JS with proper TypeScript types
const styles: Record<string, CSSProperties> = {
  page: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: "linear-gradient(to bottom right, #f8fafc, #f1f5f9)",
    overflowX: "hidden" as const,
    minHeight: "100vh"
  },
  heading: {
    fontFamily: "'Montserrat', sans-serif"
  },
  gradientText: {
    background: "linear-gradient(to right, #059669, #d97706)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    position: "relative",
    display: "inline-block",
    overflow: "hidden"
  },
  bubble: {
    background: "linear-gradient(to bottom right, #059669, #0ea5e9)",
    padding: "0.5rem 1.5rem",
    borderRadius: "9999px",
    color: "white",
    fontWeight: 600,
    display: "inline-block",
    transform: "rotate(-2deg)",
    boxShadow: "0 10px 25px -5px rgba(5, 150, 105, 0.2)",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  card: {
    background: "white",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)"
  },
  checklistItem: {
    display: "flex",
    alignItems: "start",
    marginBottom: "1rem"
  },
  checkIcon: {
    flexShrink: 0,
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "9999px",
    background: "linear-gradient(to bottom right, #059669, #10b981)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "1rem",
    marginTop: "0.125rem",
    color: "white"
  },
  glow: {
    position: "absolute",
    width: "40%",
    height: "40%",
    background: "radial-gradient(circle, rgba(5, 150, 105, 0.3) 0%, rgba(5, 150, 105, 0) 70%)",
    borderRadius: "50%",
    zIndex: -1
  },
  step: {
    position: "relative",
    paddingLeft: "3rem",
    marginBottom: "1.5rem"
  },
  stepNumber: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "2rem",
    height: "2rem",
    background: "linear-gradient(to bottom right, #059669, #10b981)",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold"
  },
  highlightBox: {
    background: "linear-gradient(to bottom right, rgba(5, 150, 105, 0.1), rgba(217, 119, 6, 0.1))",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    margin: "2rem 0",
    borderLeft: "4px solid #059669"
  },
  emailSubject: {
    backgroundColor: "rgba(5, 150, 105, 0.1)",
    borderRadius: "0.25rem",
    padding: "0.25rem 0.5rem",
    fontFamily: "monospace"
  },
  emailScreenshot: {
    borderRadius: "0.75rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    margin: "1.5rem auto",
    maxWidth: "100%",
    height: "auto",
    display: "block"
  },
  supportText: {
    textAlign: "center",
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280"
  },
  supportEmail: {
    color: "#059669",
    fontWeight: 500,
    textDecoration: "none"
  }
};

function ConfirmPage() {
  return (
    <>
      <style>{fontStyles}</style>
      <div style={styles.page} className="relative">
        {/* Background glows */}
        <div style={{ ...styles.glow, top: '-10%', right: '-10%' }} />
        <div style={{ ...styles.glow, bottom: '-10%', left: '-10%' }} />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center mb-4">
            <div style={styles.bubble}>
              Almost There!
            </div>
            
            <h1 style={styles.heading} className="text-4xl md:text-5xl font-extrabold mb-6">
              Check Your Email to <span style={styles.gradientText}>Confirm Your Subscription</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              You're one step away from joining 1,000+ builders creating tools fast with AI.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div style={styles.card}>
              <h2 className="text-2xl font-bold text-center mb-6">
                Here's what to do next:
              </h2>
              
              <div className="space-y-6">
                <div style={styles.step}>
                  <div style={styles.stepNumber}>1</div>
                  <h3 className="font-semibold text-lg">Check your inbox</h3>
                  <p className="text-gray-600">
                    Look for an email with the subject: <span style={styles.emailSubject}>
                      Confirm Now: Build Fast with AI Newsletter
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    (If you don't see it, check your spam or promotions folder)
                  </p>
                  
                  <div className="relative my-6">
                    <img 
                      src="/images/newsletter-confirm.png" 
                      alt="Confirmation email example" 
                      style={styles.emailScreenshot}
                    />
                  </div>
                </div>
                
                <div style={styles.step}>
                  <div style={styles.stepNumber}>2</div>
                  <h3 className="font-semibold text-lg">Open the email</h3>
                  <p className="text-gray-600">
                    Find and click the "Confirm my subscription" button inside the email.
                  </p>
                </div>
                
                <div style={styles.step}>
                  <div style={styles.stepNumber}>3</div>
                  <h3 className="font-semibold text-lg">You're in!</h3>
                  <p className="text-gray-600">
                    You'll get immediate access to your AI building toolkit.
                  </p>
                </div>
              </div>
              
              <div style={styles.highlightBox}>
                <h3 className="font-semibold text-lg mb-3">
                  Here's what you'll get after confirming:
                </h3>
                <div style={styles.checklistItem}>
                  <div style={styles.checkIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">50+ ready-to-build prompts</span> to jumpstart your projects.
                  </div>
                </div>
                <div style={styles.checklistItem}>
                  <div style={styles.checkIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">My exact AI tool list</span> to build fast.
                  </div>
                </div>
                <div style={styles.checklistItem}>
                  <div style={styles.checkIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Weekly build tutorials</span> to create games, SaaS products, landing pages, financial models, and more.
                  </div>
                </div>
              </div>
              
              <p style={styles.supportText}>
                Can't find the email? Contact <a href="mailto:support@backofnapkin.co" style={styles.supportEmail}>
                  support@backofnapkin.co
                </a> and we'll help you out.
              </p>
            </div>
          </div>
        </div>
        
        <footer className="py-8 text-center text-gray-500 text-sm">
          <p>© 2025 Build with AI. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default ConfirmPage;