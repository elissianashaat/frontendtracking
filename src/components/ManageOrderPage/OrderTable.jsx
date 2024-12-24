// Import the useEffect hook for performing side effects
import { useEffect } from "react";
// Import PropTypes for defining expected prop types for the component
import PropTypes from "prop-types";
// Import the StatusBadge component to display order statuses visually
import StatusBadge from "../common/StatusBadge";
// Import the CSS file for styling the component
import "./OrderTable.css";

// Define the OrderTable component, which accepts three props: orders, onUpdateStatus, and onDeleteOrder
const OrderTable = ({ orders, onUpdateStatus, onDeleteOrder }) => {
  // useEffect hook to perform a side effect after the component mounts
  useEffect(() => {
    // Retrieve the user role from local storage
    const role = localStorage.getItem("userRole");
    // Redirect the user to the login page if their role is not "admin"
    if (role !== "admin") {
      alert("You do not have permission to access this page.");
      window.location.href = "/login"; // Redirect to login or another appropriate page
    }
  }, []); // The empty dependency array ensures this effect runs only once after the component mounts

  // Render the table to display and manage orders
  return (
    <div className="manage-orders-container">
      {/* Heading for the manage orders section */}
      <h2>Manage Orders</h2>
      {/* Table to display order details */}
      <table className="orders-table">
        <thead>
          <tr>
            {/* Table headers for the orders data */}
            <th>Order ID</th>
            <th>Pickup Location</th>
            <th>Drop-off Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through the orders array to generate table rows */}
          {orders.map((order) => (
            <tr key={order.id}>
              {/* Display the order ID */}
              <td>{order.id}</td>
              {/* Display the pickup location */}
              <td>{order.pickupLocation}</td>
              {/* Display the drop-off location */}
              <td>{order.dropOffLocation}</td>
              {/* Display the order status using the StatusBadge component */}
              <td>
                <StatusBadge status={order.status} />
              </td>
              <td>
                {/* Button to update the status of the order */}
                <button
                  className="update-status-button"
                  onClick={() => onUpdateStatus(order.id)} // Trigger onUpdateStatus with the order ID
                >
                  Update Status
                </button>
                {/* Button to delete the order */}
                <button
                  className="delete-order-button"
                  onClick={() => {
                    // Show a confirmation dialog before deleting the order
                    if (
                      window.confirm(
                        "Are you sure you want to delete this order?"
                      )
                    ) {
                      onDeleteOrder(order.id); // Trigger onDeleteOrder with the order ID
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Define the expected prop types for the OrderTable component
OrderTable.propTypes = {
  // orders must be an array of objects, each with specific properties
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Each order must have a numeric ID
      pickupLocation: PropTypes.string.isRequired, // Each order must have a pickup location
      dropOffLocation: PropTypes.string.isRequired, // Each order must have a drop-off location
      status: PropTypes.string.isRequired, // Each order must have a status
    })
  ).isRequired, // The orders array itself is required
  // onUpdateStatus must be a function to handle status updates
  onUpdateStatus: PropTypes.func.isRequired,
  // onDeleteOrder must be a function to handle order deletions
  onDeleteOrder: PropTypes.func.isRequired,
};

// Export the component as the default export of this file
export default OrderTable;
