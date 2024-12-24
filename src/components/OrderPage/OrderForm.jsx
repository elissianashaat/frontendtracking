// Import React for creating the component
import React from "react";
// Import axios for making HTTP requests
import axios from "axios";
// Import the CSS file for styling the OrderForm component
import "./OrderForm.css";
// Import the Navbar component for consistent navigation
import Navbar from "../common/Navbar";

// Define the OrderForm class component
class OrderForm extends React.Component {
  constructor(props) {
    super(props);
    // Initialize the component state
    this.state = {
      pickupLocation: "", // Stores the pickup location
      dropoffLocation: "", // Stores the drop-off location
      packageDetails: "", // Stores details about the package
      deliveryTime: "", // Stores the selected delivery time
      successMessage: "", // Stores success message to show to the user
      errorMessage: "", // Stores error message to show to the user
      isLoading: false, // Tracks whether the form is being submitted
    };

    // Bind methods to the class instance to ensure correct `this` context
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Check for authentication when the component mounts
  componentDidMount() {
    if (!localStorage.getItem("token")) {
      alert("You do not have permission to access this page."); // Show an alert if no token
      window.location.href = "/login"; // Redirect to the login page
    }
  }

  // Validate the form data
  validateForm() {
    const { pickupLocation, dropoffLocation, packageDetails, deliveryTime } =
      this.state;
    if (
      !pickupLocation ||
      !dropoffLocation ||
      !packageDetails ||
      !deliveryTime
    ) {
      return "Please fill in all fields."; // Return error message if any field is empty
    }
  }

  // Handle input changes and update the state
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value, // Dynamically update the corresponding field in the state
      successMessage: "", // Clear any previous success messages
      errorMessage: "", // Clear any previous error messages
    });
  }

  // Handle form submission
  async handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Validate the form before making the API call
    const validationError = this.validateForm();
    if (validationError) {
      this.setState({ errorMessage: validationError }); // Show validation error
      return;
    }

    // Show loading state
    this.setState({ isLoading: true });

    try {
      // Attempt to create the order
      await this.createOrder();
    } catch (error) {
      this.setState({
        errorMessage: "Failed to submit order. Please try again.", // Show error message
        isLoading: false, // Reset loading state
      });
    }
  }

  // Function to send the order data to the backend API
  async createOrder() {
    try {
      const url = "http://127.0.0.1:8000/api/v1/order/add"; // API endpoint for adding an order
      const { pickupLocation, dropoffLocation, packageDetails, deliveryTime } =
        this.state;

      // Make the POST request with the order data
      const res = await axios.post(
        url,
        {
          pickup: pickupLocation,
          dropOff: dropoffLocation,
          details: packageDetails,
          deliveryTime: deliveryTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token
          },
        }
      );

      alert("Success"); // Show a success alert
      return res.data; // Return the response data
    } catch (error) {
      console.error("Error creating order:", error); // Log the error
      throw error; // Rethrow the error to be caught in handleSubmit
    }
  }

  // Render the form
  render() {
    return (
      <>
        {/* Include the Navbar component */}
        <Navbar />
        {/* Form for submitting the order */}
        <form onSubmit={this.handleSubmit} className="order-form">
          <h2>Enter Order Details</h2>

          {/* Display error or success messages */}
          {this.state.errorMessage && (
            <p className="error-message">{this.state.errorMessage}</p>
          )}
          {this.state.successMessage && (
            <p className="success-message">{this.state.successMessage}</p>
          )}

          {/* Pickup Location field */}
          <div className="form-group">
            <label>
              Pickup Location:
              <input
                type="text"
                name="pickupLocation"
                value={this.state.pickupLocation}
                onChange={this.handleChange}
                required
              />
            </label>
          </div>

          {/* Drop-off Location field */}
          <div className="form-group">
            <label>
              Drop-off Location:
              <input
                type="text"
                name="dropoffLocation"
                value={this.state.dropoffLocation}
                onChange={this.handleChange}
                required
              />
            </label>
          </div>

          {/* Package Details field */}
          <div className="form-group">
            <label>
              Package Details:
              <textarea
                name="packageDetails"
                value={this.state.packageDetails}
                onChange={this.handleChange}
                required
              />
            </label>
          </div>

          {/* Delivery Time field */}
          <div className="form-group">
            <label>
              Delivery Time:
              <select
                name="deliveryTime"
                value={this.state.deliveryTime}
                onChange={this.handleChange}
                required
              >
                <option value="">Select a time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </label>
          </div>

          {/* Display loading message or submit button */}
          {this.state.isLoading ? (
            <p>Submitting your order...</p>
          ) : (
            <button type="submit" className="submit-button">
              Submit Order
            </button>
          )}
        </form>
      </>
    );
  }
}

// Export the component as the default export
export default OrderForm;
