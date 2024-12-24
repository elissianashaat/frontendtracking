import { useEffect } from "react";
import PropTypes from "prop-types";
import StatusBadge from "../common/StatusBadge";
import "./OrderTable.css";

const OrderTable = ({ orders, onUpdateStatus, onDeleteOrder }) => {
  useEffect(() => {
    // Check if user has admin permissions
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      alert("You do not have permission to access this page.");
      window.location.href = "/login"; // Redirect to login or an appropriate page
    }
  }, []);

  return (
    <div className="manage-orders-container">
      <h2>Manage Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Pickup Location</th>
            <th>Drop-off Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.pickupLocation}</td>
              <td>{order.dropOffLocation}</td>
              <td>
                <StatusBadge status={order.status} />
              </td>{" "}
              {/* Using StatusBadge */}
              <td>
                <button
                  className="update-status-button"
                  onClick={() => onUpdateStatus(order.id)}
                >
                  Update Status
                </button>
                <button
                  className="delete-order-button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this order?"
                      )
                    ) {
                      onDeleteOrder(order.id);
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

// Define PropTypes for OrderTable
OrderTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      pickupLocation: PropTypes.string.isRequired,
      dropOffLocation: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onDeleteOrder: PropTypes.func.isRequired,
};

export default OrderTable;
