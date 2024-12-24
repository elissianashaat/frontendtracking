import React from "react";
import axios from "axios";
import "./OrderForm.css";
import Navbar from "../common/Navbar";
class OrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pickupLocation: "",
      dropoffLocation: "",
      packageDetails: "",
      deliveryTime: "",
      successMessage: "",
      errorMessage: "",
      isLoading: false, // To manage loading state
    };

    // Binding methods to 'this'
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Redirect to login if token is not found
  componentDidMount() {
    if (!localStorage.getItem("token")) {
      alert("You do not have permission to access this page.");
      window.location.href = "/login";
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
      return "Please fill in all fields.";
    }
  }

  // Handle form input changes
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      successMessage: "", // Clear success message on input change
      errorMessage: "", // Clear error message on input change
    });
  }

  // Handle form submission
  async handleSubmit(event) {
    event.preventDefault();

    // Validate form before submission
    const validationError = this.validateForm();
    if (validationError) {
      this.setState({ errorMessage: validationError });
      return;
    }

    this.setState({ isLoading: true });

    try {
      await this.createOrder();
    } catch (error) {
      this.setState({
        errorMessage: "Failed to submit order. Please try again.",
        isLoading: false,
      });
    }
  }

  // API call to create the order
  async createOrder() {
    try {
      const url = "https://backendtracking-v2-git-omar377-dev.apps.rm2.thpm.p1.openshiftapps.com/api/v1/order/add";
      const { pickupLocation, dropoffLocation, packageDetails, deliveryTime } =
        this.state;

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("succes");

      return res.data; // Return the response from the API
    } catch (error) {
      console.error("Error creating order:", error);
      throw error; // Propagate the error to be caught in handleSubmit
    }
  }

  render() {
    return (
      <>
        <Navbar />
        <form onSubmit={this.handleSubmit} className="order-form">
          <h2>Enter Order Details</h2>

          {/* Show error or success message */}
          {this.state.errorMessage && (
            <p className="error-message">{this.state.errorMessage}</p>
          )}
          {this.state.successMessage && (
            <p className="success-message">{this.state.successMessage}</p>
          )}

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

          {/* Display loading state */}
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

export default OrderForm;
