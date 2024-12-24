import { useEffect, useState } from "react";
import axios from "axios";
import "./OrderDetails.css";

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `https://backendtracking-v2-git-omar377-dev.apps.rm2.thpm.p1.openshiftapps.com/api/v1/order/get/${localStorage.getItem(
            "orderID"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        setOrder(response.data.data.date);
      } catch (err) {
        alert("Failed to load order details.");
        console.error("Error fetching order details:", err);
      }
    };

    fetchOrderDetails();
  }, []);

  const cancelOrder = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/admin/order/delete/${localStorage.getItem(
          "orderID"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order canceled successfully.");
      window.location.href = "/my-orders";
    } catch (err) {
      alert("Failed to cancel order.");
      console.error("Error canceling order:", err);
    }
  };

  return (
    <div className="order-details">
      <h2>Order Details</h2>
      {order ? (
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
          {order.status === "PENDING" && (
            <button onClick={cancelOrder} className="cancel-button">
              Cancel Order
            </button>
          )}
        </>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderDetailsPage;
