// Import React's useEffect hook for performing side effects
import { useEffect } from "react";
// Import PropTypes for defining expected prop types for the component
import PropTypes from "prop-types";
// Import a StatusBadge component for displaying order statuses
import StatusBadge from "../common/StatusBadge";
// Import the CSS file for styling this component
import "./CourierOrderList.css";

// Define the CourierOrderList component, which accepts two props: assignedOrders and onReassignOrder
const CourierOrderList = ({ assignedOrders, onReassignOrder }) => {
  // useEffect hook to perform a side effect after the component mounts
  useEffect(() => {
    // Retrieve the user role from local storage
    const role = localStorage.getItem("userRole");
    // Redirect the user to the login page if their role is not "admin"
    if (role !== "admin") {
      alert("You do not have permission to access this page.");
      window.location.href = "/login";
    }
  }, []); // The empty dependency array ensures this effect runs only once after the component mounts

  // If there are no assigned orders or the array is empty, display a fallback message
  if (!assignedOrders || assignedOrders.length === 0) {
    return <div>No orders assigned to couriers.</div>;
  }

  // Render the list of assigned orders
  return (
    <div className="assigned-orders-to-courier-container">
      {/* Display a heading for the section */}
      <h2>Assigned Orders to Courier</h2>
      {/* Render an unordered list for the assigned orders */}
      <ul className="assigned-orders-list">
        {/* Iterate over the assignedOrders array using map */}
        {assignedOrders.map((order) => (
          <li key={order.id} className="assigned-order-card">
            {/* Display order details such as ID, locations, and courier name */}
            <h3>Order ID: {order.id}</h3>
            <p>Pickup Location: {order.pickupLocation}</p>
            <p>Drop-off Location: {order.dropOffLocation}</p>
            <p>Assigned Courier: {order.courierName}</p>

            {/* Display the order status using the StatusBadge component */}
            <StatusBadge status={order.status} />
            {/* Button to reassign the order, triggering the onReassignOrder callback with the order ID */}
            <button
              className="reassign-button"
              onClick={() => onReassignOrder(order.id)}
            >
              Reassign Order
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Define the expected prop types for the CourierOrderList component
CourierOrderList.propTypes = {
  // assignedOrders must be an array of objects, each with specific properties
  assignedOrders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Each order must have a numeric ID
      pickupLocation: PropTypes.string.isRequired, // Each order must have a pickup location
      dropOffLocation: PropTypes.string.isRequired, // Each order must have a drop-off location
      courierName: PropTypes.string.isRequired, // Each order must have an assigned courier name
      status: PropTypes.string, // The status is optional but preferred
    })
  ).isRequired, // The assignedOrders array itself is required
  onReassignOrder: PropTypes.func.isRequired, // onReassignOrder must be a function
};

// Export the component as the default export of this file
export default CourierOrderList;
