import { useState, useEffect } from "react"; // Removed unnecessary 'React' import
import PropTypes from "prop-types";
import "./AssignedOrderList.css";
import StatusBadge from "../common/StatusBadge";

const AssignedOrderList = ({ orders = [] }) => {
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check permissions and initialize orderStatuses state
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "courier") {
      alert("You do not have permission to access this page.");
      window.location.href = "/login";
    }

    setOrderStatuses(orders.map((order) => ({ ...order, accepted: false })));
  }, [orders]);

  // Early return for empty orders array
  if (!orders || orders.length === 0) {
    return <div>No assigned orders available.</div>;
  }

  // API calls for accepting and declining orders
  const acceptOrderAPI = async (orderId) => {
    const response = await fetch(`/api/orders/accept/${orderId}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to accept order");
    return response.json();
  };

  const declineOrderAPI = async (orderId) => {
    const response = await fetch(`/api/orders/decline/${orderId}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to decline order");
    return response.json();
  };

  // Accept order handler
  const handleAccept = async (orderId) => {
    setLoading(true);
    try {
      await acceptOrderAPI(orderId);
      setOrderStatuses(
        orderStatuses.map((order) =>
          order.id === orderId ? { ...order, accepted: true } : order
        )
      );
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Decline order handler
  const handleDecline = async (orderId) => {
    setLoading(true);
    try {
      await declineOrderAPI(orderId);
      setOrderStatuses(orderStatuses.filter((order) => order.id !== orderId));
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Status indicator styling function
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { color: "orange" };
      case "in transit":
        return { color: "blue" };
      case "delivered":
        return { color: "green" };
      default:
        return { color: "gray" };
    }
  };

  return (
    <div className="assigned-orders-container">
      <h2 className="assigned-orders-header">Assigned Orders</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul>
        {orderStatuses.map((order) => {
          const { color } = getStatusStyle(order.status);
          return (
            <li key={order.id} className="order-card">
              <h3>Order ID: {order.id}</h3>
              <p>Pickup Location: {order.pickupLocation}</p>
              <p>Drop-off Location: {order.dropOffLocation}</p>
              <div className="order-status-indicator" style={{ color }}>
                Status: <StatusBadge status={order.status} />
              </div>
              <div className="button-container">
                {!order.accepted ? (
                  <>
                    <button
                      className="accept-button"
                      onClick={() => handleAccept(order.id)}
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <button
                      className="decline-button"
                      onClick={() => handleDecline(order.id)}
                      disabled={loading}
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <p>Order Accepted</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Define PropTypes for AssignedOrderList
AssignedOrderList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      pickupLocation: PropTypes.string.isRequired,
      dropOffLocation: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AssignedOrderList;
