import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #fee2e2,rgb(114, 109, 109), #dbeafe)",
      padding: "1.5rem"
    }}>
      <div style={{
        color: "#1e3a8a",
        textAlign: "center",
        padding: "1.5rem",
        width: "100%",
        borderRadius: "0.5rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Pharmacy Management System</h1>
        <p style={{ fontSize: "1.875rem", fontWeight: "bold", marginTop: "2.5rem" }}>WELCOME BACK!</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "5rem",
        marginTop: "5rem"
      }}>
        <NavCard link="/inventory" color="linear-gradient(to bottom right, #991b1b, #1e40af, #6b21a8)" width="15rem" height="10rem" text="Add Medicine" icon="💊" />
        <NavCard link="/inventoryDetails" color="linear-gradient(to bottom right, #991b1b, #1e40af, #6b21a8)" width="15rem" height="10rem" text="Medicine List" icon="💊📝" />
        <NavCard link="/billing" color="linear-gradient(to bottom right, #991b1b, #1e40af, #6b21a8)" width="15rem" height="10rem" text="Add Bill" icon="💵" />
        <NavCard link="/billingDetails" color="linear-gradient(to bottom right, #991b1b, #1e40af, #6b21a8)" width="15rem" height="10rem" text="Bill Reports" icon="💵📝" />
      </div>
    </div>
  );
}

const NavCard = ({ link, color, width, height, text, icon }) => {
  return (
    <Link
      to={link}
      style={{
        background: color,
        padding: "1.5rem",
        color: "white",
        fontWeight: "600",
        textAlign: "center",
        borderRadius: "0.5rem",
        width: width,
        height: height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 10px 15px -3px rgba(241, 182, 182, 0.93),   rgba(178, 185, 233, 0.05)",
        transition: "transform 0.3s ease"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.background = "linear-gradient(to right, #ef4444, #3b82f6, #8b5cf6)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.background = color;
      }}
    >
      <span style={{ fontSize: "2.25rem" }}>{icon}</span>
      <p style={{ marginTop: "0.5rem" }}>{text}</p>
    </Link>
  );
};

export default Dashboard;