// Import the useEffect and useState hooks from React for managing state and side effects
import { useEffect, useState } from "react";
// Import axios for making HTTP requests
import axios from "axios";
// Import the StatusBadge component for visually displaying order statuses
import StatusBadge from "../common/StatusBadge";
// Import the CSS file for styling the MyOrders component
import "./MyOrders.css";

// Define the MyOrders component
const MyOrders = () => {
  // State to hold the list of orders
  const [orders, setOrders] = useState([]); // Initialize orders as an empty array

  // useEffect hook to fetch orders when the component mounts
  useEffect(() => {
    // Define an asynchronous function to fetch orders
    async function fetchOrders() {
      try {
        const url = "http://127.0.0.1:8000/api/v1/order/list"; // API endpoint for fetching orders
        const response = await axios.get(url, {
          headers: {
            // Include the authorization token in the request headers
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Set the orders state with the data from the response
        setOrders(response.data.data);
      } catch (err) {
        // Log any errors encountered during the API request
        console.error("Error fetching orders:", err);
      }
    }

    // Call the fetchOrders function
    fetchOrders();
  }, []); // Empty dependency array ensures this effect runs only once after the component mounts

  // Function to navigate to the order details page for a specific order
  function show(id) {
    localStorage.setItem("orderID", id); // Store the order ID in localStorage
    window.location.href = "/order-details/"; // Redirect to the order details page
  }

  // Render the list of orders
  return (
    <div className="my-orders-container">
      {/* Heading for the page */}
      <h2>My Orders</h2>
      {/* Render the list of orders as a set of list items */}
      <ul className="orders-list">
        {orders.map((order) => (
          // Use the order ID as the key for each list item
          <li key={order.id} className="order-item">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Pickup Location:</strong> {order.pickupLocation}
            </p>
            <p>
              <strong>Drop-off Location:</strong> {order.dropOffLocation}
            </p>
            <p>
              <strong>Status:</strong> <StatusBadge status={order.status} />
            </p>
            {/* Button to view order details, calls the show function */}
            <button
              onClick={() => show(order._id)}
              className="view-details-link"
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export the component as the default export of this file
export default MyOrders;
