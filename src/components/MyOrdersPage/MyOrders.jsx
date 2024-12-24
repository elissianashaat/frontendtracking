import { useEffect, useState } from "react";
import axios from "axios"; // Make sure axios is imported
import StatusBadge from "../common/StatusBadge";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // Proper state initialization

  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = "https://backendtracking-v2-git-omar377-dev.apps.rm2.thpm.p1.openshiftapps.com/api/v1/order/list";
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(response.data.data); // Set the fetched orders
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    }

    fetchOrders();
  }, []); // Empty array means it will run only once when the component mounts

  function show(id) {
    localStorage.setItem("orderID", id);
    window.location.href = "/order-details/";
  }

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>
      <ul className="orders-list">
        {orders.map((order) => (
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

export default MyOrders;
