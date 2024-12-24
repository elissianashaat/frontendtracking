import { useState, useEffect } from "react"; // Importing React hooks: useState and useEffect for managing state and side-effects.
import PropTypes from "prop-types"; // Importing PropTypes to validate props passed to the component.
import "./AssignedOrderList.css"; // Importing the CSS file for the styling of the component.
import StatusBadge from "../common/StatusBadge"; // Importing the StatusBadge component used to display order status.

const AssignedOrderList = ({ orders = [] }) => {
  // Initializing state for order statuses, loading state, and error state.
  const [orderStatuses, setOrderStatuses] = useState([]); // To store the orders' statuses with added "accepted" flag.
  const [loading, setLoading] = useState(false); // To track whether an API request is in progress.
  const [error, setError] = useState(null); // To store any error messages from API requests.

  // useEffect hook to check the user's role and initialize orderStatuses when the component is mounted or when orders prop changes.
  useEffect(() => {
    const role = localStorage.getItem("userRole"); // Fetch user role from local storage.
    
    // If the user is not a courier, alert them and redirect to login.
    if (role !== "courier") {
      alert("You do not have permission to access this page.");
      window.location.href = "/login"; // Redirect to login if role is not courier.
    }

    // Initialize orderStatuses with orders passed in the prop, adding a new "accepted" flag to each order.
    setOrderStatuses(orders.map((order) => ({ ...order, accepted: false })));
  }, [orders]); // This effect runs when the `orders` prop changes.

  // Early return: if no orders are provided or the orders array is empty, display a message.
  if (!orders || orders.length === 0) {
    return <div>No assigned orders available.</div>; // Show this message if there are no orders.
  }

  // Async function to accept an order through an API call.
  const acceptOrderAPI = async (orderId) => {
    const response = await fetch(`/api/orders/accept/${orderId}`, { method: "POST" }); // Send POST request to accept order.
    if (!response.ok) throw new Error("Failed to accept order"); // If the response is not ok, throw an error.
    return response.json(); // Return the response in JSON format if successful.
  };

  // Async function to decline an order through an API call.
  const declineOrderAPI = async (orderId) => {
    const response = await fetch(`/api/orders/decline/${orderId}`, { method: "POST" }); // Send POST request to decline order.
    if (!response.ok) throw new Error("Failed to decline order"); // If the response is not ok, throw an error.
    return response.json(); // Return the response in JSON format if successful.
  };

  // Handle accepting an order: update the order status and track loading/error states.
  const handleAccept = async (orderId) => {
    setLoading(true); // Set loading to true before making the API request.
    try {
      await acceptOrderAPI(orderId); // Call the API to accept the order.
      // Update the state to mark this order as accepted by changing the "accepted" flag to true.
      setOrderStatuses(
        orderStatuses.map((order) =>
          order.id === orderId ? { ...order, accepted: true } : order
        )
      );
      setError(null); // Clear any previous error messages.
    } catch (error) {
      setError(error.message); // If there's an error, set it in the state to be displayed.
    } finally {
      setLoading(false); // Set loading to false after the API call finishes.
    }
  };

  // Handle declining an order: remove the order from the list and track loading/error states.
  const handleDecline = async (orderId) => {
    setLoading(true); // Set loading to true before making the API request.
    try {
      await declineOrderAPI(orderId); // Call the API to decline the order.
      // Remove the order from the list by filtering out the declined order.
      setOrderStatuses(orderStatuses.filter((order) => order.id !== orderId));
      setError(null); // Clear any previous error messages.
    } catch (error) {
      setError(error.message); // If there's an error, set it in the state to be displayed.
    } finally {
      setLoading(false); // Set loading to false after the API call finishes.
    }
  };

  // Function to determine the style (color) for the order's status.
  const getStatusStyle = (status) => {
    // Return different colors depending on the order's status.
    switch (status) {
      case "pending":
        return { color: "orange" }; // Pending orders are orange.
      case "in transit":
        return { color: "blue" }; // In transit orders are blue.
      case "delivered":
        return { color: "green" }; // Delivered orders are green.
      default:
        return { color: "gray" }; // Any other status is gray.
    }
  };

  return (
    <div className="assigned-orders-container">
      {/* Header for the list of assigned orders */}
      <h2 className="assigned-orders-header">Assigned Orders</h2>
      
      {/* Display loading message if the loading state is true */}
      {loading && <p>Loading...</p>}
      
      {/* Display error message if there's an error */}
      {error && <p className="error-message">{error}</p>}
      
      <ul>
        {/* Map through each order in the orderStatuses array to render individual order details */}
        {orderStatuses.map((order) => {
          // Get the color style for the current order's status
          const { color } = getStatusStyle(order.status);
          
          return (
            <li key={order.id} className="order-card">
              <h3>Order ID: {order.id}</h3> {/* Display the Order ID */}
              <p>Pickup Location: {order.pickupLocation}</p> {/* Display the pickup location */}
              <p>Drop-off Location: {order.dropOffLocation}</p> {/* Display the drop-off location */}
              
              <div className="order-status-indicator" style={{ color }}>
                Status: <StatusBadge status={order.status} /> {/* Display status with color and StatusBadge component */}
              </div>

              <div className="button-container">
                {/* Show "Accept" and "Decline" buttons if the order hasn't been accepted */}
                {!order.accepted ? (
                  <>
                    <button
                      className="accept-button"
                      onClick={() => handleAccept(order.id)} // Handle accepting the order
                      disabled={loading} // Disable button if loading
                    >
                      Accept
                    </button>
                    <button
                      className="decline-button"
                      onClick={() => handleDecline(order.id)} // Handle declining the order
                      disabled={loading} // Disable button if loading
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <p>Order Accepted</p> // If the order is already accepted, show this message.
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Prop validation using PropTypes. This ensures that the 'orders' prop passed to the component follows the expected structure.
AssignedOrderList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // 'id' should be a required number
      pickupLocation: PropTypes.string.isRequired, // 'pickupLocation' should be a required string
      dropOffLocation: PropTypes.string.isRequired, // 'dropOffLocation' should be a required string
      status: PropTypes.string.isRequired, // 'status' should be a required string
    })
  ).isRequired, // The 'orders' prop should be an array of objects following the above shape.
};

export default AssignedOrderList; // Export the component as default for use in other parts of the app.
