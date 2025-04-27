import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Remove default body margin and padding
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #fee2e2, rgb(114, 109, 109), #dbeafe)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated background elements */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "8rem", 
          height: "8rem", 
          backgroundColor: "rgba(0, 0, 9, 0.1)", 
          borderRadius: "50%", 
          transform: "translate(-4rem, -4rem)" 
        }}></div>
        <div style={{ 
          position: "absolute", 
          bottom: 0, 
          right: 0, 
          width: "16rem", 
          height: "16rem", 
          backgroundColor: "rgba(239, 68, 68, 0.1)", 
          borderRadius: "50%", 
          transform: "translate(8rem, 8rem)" 
        }}></div>
        <div style={{ 
          position: "absolute", 
          top: "50%", 
          left: "25%", 
          width: "10rem", 
          height: "10rem", 
          backgroundColor: "rgba(139, 92, 246, 0.1)", 
          borderRadius: "50%" 
        }}></div>
      </div>

      {/* Header card with animation */}
      <div style={{
        textAlign: "center",
        padding: "2rem",
        width: "75%",
        borderRadius: "0.75rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        background: "rgba(30, 58, 138, 0.1)",
        backdropFilter: "blur(8px)",
        transform: isLoaded ? "translateY(0)" : "translateY(-2.5rem)",
        opacity: isLoaded ? 1 : 0,
        transition: "all 1s ease"
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          fontWeight: "bold",
          background: "linear-gradient(to right, #1e3a8a, #6b21a8, #991b1b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>Pharmacy Management System</h1>
        
        <div style={{ 
          height: "0.25rem", 
          width: "8rem", 
          margin: "1.5rem auto", 
          background: "linear-gradient(to right, #ef4444, #3b82f6, #8b5cf6)", 
          borderRadius: "9999px" 
        }}></div>
        
        <p style={{ 
          fontSize: "1.875rem", 
          fontWeight: "bold", 
          marginTop: "1rem", 
          color: "#f8fafc" 
        }}>WELCOME BACK!</p>
      </div>

      {/* Navigation cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "auto auto",
        gap: "3rem 5rem",
        marginTop: "4rem",
        width: "75%"
      }}>
        {/* Top row */}
        <div style={{
          transform: isLoaded ? "translateY(0)" : "translateY(2.5rem)",
          opacity: isLoaded ? 1 : 0,
          transition: "all 1s ease",
          transitionDelay: "100ms"
        }}>
          <NavCard 
            link="/inventory" 
            text="Add Medicine" 
            icon="💊" 
          />
        </div>
        <div style={{
          transform: isLoaded ? "translateY(0)" : "translateY(2.5rem)",
          opacity: isLoaded ? 1 : 0,
          transition: "all 1s ease",
          transitionDelay: "200ms"
        }}>
          <NavCard 
            link="/inventoryDetails" 
            text="Medicine List" 
            icon="📋" 
          />
        </div>

        {/* Bottom row */}
        <div style={{
          transform: isLoaded ? "translateY(0)" : "translateY(2.5rem)",
          opacity: isLoaded ? 1 : 0,
          transition: "all 1s ease",
          transitionDelay: "300ms",
          gridColumnStart: 1,
          gridColumnEnd: 2
        }}>
          <NavCard 
            link="/billing" 
            text="Add Bill" 
            icon="💵" 
          />
        </div>
        <div style={{
          transform: isLoaded ? "translateY(0)" : "translateY(2.5rem)",
          opacity: isLoaded ? 1 : 0,
          transition: "all 1s ease",
          transitionDelay: "400ms",
          gridColumnStart: 2,
          gridColumnEnd: 3
        }}>
          <NavCard 
            link="/billingDetails" 
            text="Bill Reports" 
            icon="📊" 
          />
        </div>
      </div>
    </div>
  );
}

const NavCard = ({ link, text, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    width: "100%",
    height: "12rem",
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    borderRadius: "0.75rem",
    position: "relative",
    overflow: "hidden",
    background: isHovered 
      ? "linear-gradient(to right, #ef4444, #3b82f6, #8b5cf6)" 
      : "linear-gradient(to bottom right, #991b1b, #1e40af, #6b21a8)",
    boxShadow: isHovered 
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    transition: "all 0.5s ease"
  };

  return (
    <Link
      to={link}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative corners */}
      <div style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        width: "3rem", 
        height: "3rem", 
        borderTop: "2px solid rgba(255, 255, 255, 0.3)", 
        borderLeft: "2px solid rgba(255, 255, 255, 0.3)", 
        borderTopLeftRadius: "0.5rem" 
      }}></div>
      
      <div style={{ 
        position: "absolute", 
        bottom: 0, 
        right: 0, 
        width: "3rem", 
        height: "3rem", 
        borderBottom: "2px solid rgba(255, 255, 255, 0.3)", 
        borderRight: "2px solid rgba(255, 255, 255, 0.3)", 
        borderBottomRightRadius: "0.5rem" 
      }}></div>
      
      {/* Content */}
      <div style={{ 
        position: "relative", 
        zIndex: 10, 
        transform: isHovered ? "scale(1.1)" : "scale(1)", 
        transition: "transform 0.5s ease" 
      }}>
        <span style={{ fontSize: "3rem", marginBottom: "1rem", display: "block" }}>{icon}</span>
        <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{text}</p>
      </div>
    </Link>
  );
};

export default Dashboard;
