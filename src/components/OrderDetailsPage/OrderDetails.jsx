// Import the useEffect and useState hooks from React
import { useEffect, useState } from "react";
// Import axios for making HTTP requests
import axios from "axios";
// Import the CSS file for styling the OrderDetailsPage component
import "./OrderDetails.css";

// Define the OrderDetailsPage component
const OrderDetailsPage = () => {
  // State to store the order details
  const [order, setOrder] = useState(null); // Initialize with `null` to indicate loading state

  // useEffect hook to fetch the order details when the component mounts
  useEffect(() => {
    // Define an asynchronous function to fetch order details
    const fetchOrderDetails = async () => {
      try {
        // API call to fetch order details based on the order ID stored in localStorage
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/order/get/${localStorage.getItem(
            "orderID"
          )}`,
          {
            headers: {
              // Include the authorization token in the request headers
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response); // Log the response for debugging
        setOrder(response.data.data.date); // Set the order details in state
      } catch (err) {
        alert("Failed to load order details."); // Alert the user in case of failure
        console.error("Error fetching order details:", err); // Log the error for debugging
      }
    };

    // Call the fetchOrderDetails function
    fetchOrderDetails();
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Function to cancel the order
  const cancelOrder = async () => {
    try {
      // API call to delete the order using its ID from localStorage
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/admin/order/delete/${localStorage.getItem(
          "orderID"
        )}`,
        {
          headers: {
            // Include the authorization token in the request headers
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order canceled successfully."); // Notify the user of successful cancellation
      window.location.href = "/my-orders"; // Redirect to the My Orders page
    } catch (err) {
      alert("Failed to cancel order."); // Notify the user of a failure
      console.error("Error canceling order:", err); // Log the error for debugging
    }
  };

  // Render the order details or a loading message
  return (
    <div className="order-details">
      {/* Heading for the order details section */}
      <h2>Order Details</h2>
      {order ? (
        // If order details are available, display them
        <>
          <p>
            <strong>Pickup Location:</strong> {order.pickupLocation}
          </p>
          <p>
            <strong>Drop-off Location:</strong> {order.dropOffLocation}
          </p>
          <p>
            <strong>Package Details:</strong> {order.details}
          </p>
          <p>
            <strong>Courier Info:</strong>{" "}
            {order.courierId ? order.courierId : "Not assigned"}
          </p>
          <p>
            <strong>Delivery Time:</strong> {order.deliveryTime}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          {/* Display a cancel button if the order status is "PENDING" */}
          {order.status === "PENDING" && (
            <button onClick={cancelOrder} className="cancel-button">
              Cancel Order
            </button>
          )}
        </>
      ) : (
        // If order details are not yet available, show a loading message
        <p>Loading order details...</p>
      )}
    </div>
  );
};

// Export the component as the default export
export default OrderDetailsPage;
