import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>PTS</h1>
      <div className="navbar-links">
        {/* User Links */}
        <>
          <NavLink to="/create-order" activeClassName="active-link">
            Create Order
          </NavLink>
          <NavLink to="/my-orders" activeClassName="active-link">
            My Orders
          </NavLink>
        </>

        {/* Courier Links */}
        <>
          <NavLink to="/assigned-orders" activeClassName="active-link">
            Assigned Orders
          </NavLink>
        </>

        {/* Admin Links */}
        <>
          <NavLink to="/manage-orders" activeClassName="active-link">
            Manage Orders
          </NavLink>
          <NavLink to="/courier-orders" activeClassName="active-link">
            Assign to Couriers
          </NavLink>
        </>

        {/* Common Links */}

        <Link to="/">logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
