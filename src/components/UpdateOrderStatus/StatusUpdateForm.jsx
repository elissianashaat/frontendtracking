// Import React hooks and PropTypes for prop type validation
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Import the CSS file for styling the StatusUpdateForm component
import "./StatusUpdateForm.css";

// Define the StatusUpdateForm functional component
const StatusUpdateForm = ({ orderId, onUpdateStatus }) => {
  // State to manage the selected status
  const [status, setStatus] = useState("");
  // State to display a success message
  const [successMessage, setSuccessMessage] = useState("");
  // State to display an error message
  const [errorMessage, setErrorMessage] = useState("");

  // Check user role to ensure only couriers have access
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "courier") {
      alert("You do not have permission to access this page."); // Alert unauthorized users
      window.location.href = "/login"; // Redirect to the login page
    }
  }, []); // The empty dependency array ensures this runs only once when the component mounts

  // Handle changes to the status dropdown
  const handleChange = (e) => {
    setStatus(e.target.value); // Update the status in state
    setSuccessMessage(""); // Clear any previous success message
    setErrorMessage(""); // Clear any previous error message
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!status) {
      // If no status is selected, show an error message
      setErrorMessage("Please select a status.");
      return;
    }

    try {
      // Call the onUpdateStatus callback with the order ID and new status
      await onUpdateStatus(orderId, status);
      setSuccessMessage("Status updated successfully!"); // Show a success message
    } catch (error) {
      // Handle any errors during the status update
      setErrorMessage("Failed to update status."); // Show an error message
    }
  };

  // Render the status update form
  return (
    <form onSubmit={handleSubmit} className="status-update-form">
      {/* Form heading */}
      <h2>Update Order Status</h2>

      {/* Display error or success messages */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Status dropdown */}
      <div className="form-group">
        <label htmlFor="status">Select New Status:</label>
        <select id="status" value={status} onChange={handleChange} required>
          <option value="">-- Select Status --</option>
          <option value="pending">Pending</option>
          <option value="in transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Submit button */}
      <button type="submit" className="submit-button">
        Update Status
      </button>
    </form>
  );
};

// Define PropTypes to validate the props passed to the component
StatusUpdateForm.propTypes = {
  // The ID of the order whose status is being updated (required, numeric)
  orderId: PropTypes.number.isRequired,
  // Callback function to handle the status update (required, function)
  onUpdateStatus: PropTypes.func.isRequired,
};

// Export the component as the default export
export default StatusUpdateForm;
