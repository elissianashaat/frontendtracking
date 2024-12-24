import PropTypes from "prop-types"; // Import PropTypes
import "./StatusBadge.css";

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case "delivered":
        return "status-badge delivered";
      case "pending":
        return "status-badge pending";
      case "in transit":
        return "status-badge in-transit";
      default:
        return "status-badge unknown";
    }
  };

  return <span className={getStatusClass()}>{status}</span>;
};

// PropTypes validation
StatusBadge.propTypes = {
  status: PropTypes.string.isRequired, // `status` must be a string and is required
};

export default StatusBadge;
