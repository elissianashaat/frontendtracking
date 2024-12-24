// Import useState hook for managing state variables
import { useState } from "react";
// Import axios for making HTTP requests
import axios from "axios";
// Import useNavigate hook for navigation between routes
import { useNavigate } from "react-router-dom";
// Import CSS file for styling the component
import "./loginSignUp.css";

// Define the LoginSignUp functional component
const LoginSignUp = () => {
  // State to track whether the user is in "sign-up" mode or "login" mode
  const [isSignUp, setIsSignUp] = useState(false);
  // State to hold user input for name (sign-up only)
  const [Name, setName] = useState("");
  // State to hold user input for phone number (sign-up only)
  const [number, setNumber] = useState("");
  // State to hold user input for email
  const [em, setEmail] = useState("");
  // State to hold user input for password
  const [pass, setPassword] = useState("");
  // State to hold the selected user role (default: "user")
  const [role, setRole] = useState("user");
  // State to display feedback messages to the user
  const [feedback, setFeedback] = useState("");
  // Hook to handle navigation to different routes
  const navigate = useNavigate();

  // Handler for user sign-up
  const UserSignup = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    try {
      const url = `http://127.0.0.1:8000/api/v1/auth/signup`; // API endpoint for sign-up
      const res = await axios.post(
        url,
        {
          name: Name, // User's name from state
          email: em, // User's email from state
          password: pass, // User's password from state
        },
        { timeout: 10000 } // Timeout set to 10 seconds
      );

      console.log(res.data); // Log the response data for debugging
      localStorage.setItem("token", res.data.token); // Store the token in localStorage

      // Navigate to different pages based on the selected role
      if (role === "user") navigate("/create-order");
      else if (role === "admin") navigate("/manage-orders");

      setFeedback("Sign up successful!"); // Display success message
    } catch (err) {
      console.error(err); // Log any errors for debugging
      // If there's a server response, display the error message
      if (err.response) {
        setFeedback(
          `Error: ${err.response.data.message || "Unable to sign up"}`
        );
      } else {
        // If no response (e.g., network error), display a generic error
        setFeedback("Error: Unable to connect");
      }
    }
  };

  // Handler for user login
  const Signin = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    try {
      const url = `http://127.0.0.1:8000/api/v1/auth/signin`; // API endpoint for login
      const res = await axios.post(
        url,
        { email: em, password: pass }, // User's email and password from state
        { timeout: 10000 } // Timeout set to 10 seconds
      );

      console.log(res.data); // Log the response data for debugging
      localStorage.setItem("token", res.data.token); // Store the token in localStorage

      // Navigate to different pages based on the selected role
      if (role === "user") navigate("/create-order");
      else if (role === "courier") navigate("/assigned-orders");
      else if (role === "admin") navigate("/manage-orders");

      setFeedback("Login successful!"); // Display success message
    } catch (err) {
      console.error(err); // Log any errors for debugging
      // If there's a server response, display the error message
      if (err.response) {
        setFeedback(
          `Error: ${err.response.data.message || "Unable to connect"}`
        );
      } else {
        // If no response (e.g., network error), display a generic error
        setFeedback("Error: Unable to connect");
      }
    }
  };

  // Render the login and sign-up form
  return (
    <div className="auth-container">
      {/* Card-like container for authentication UI */}
      <div className="auth-card">
        {/* Toggle between Login and Sign-Up modes */}
        <div className="auth-toggle">
          {/* Button to switch to Login mode */}
          <button
            onClick={() => setIsSignUp(false)}
            className={!isSignUp ? "active" : ""}
          >
            Login
          </button>
          {/* Button to switch to Sign-Up mode */}
          <button
            onClick={() => setIsSignUp(true)}
            className={isSignUp ? "active" : ""}
          >
            Sign Up
          </button>
        </div>
        {/* Form for login or sign-up, depending on the mode */}
        <form onSubmit={isSignUp ? UserSignup : Signin} className="auth-form">
          {/* Display feedback messages, if any */}
          {feedback && <p className="feedback">{feedback}</p>}

          {/* Render additional fields for sign-up mode */}
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Your name"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
              {/* Dropdown to select user role */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="user">User</option>
                <option value="courier">Courier</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}

          {/* Input field for email */}
          <input
            type="email"
            placeholder="Your email"
            value={em}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Input field for password */}
          <input
            type="password"
            placeholder="Your password"
            value={pass}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Submit button */}
          <button type="submit" className="auth-submit">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Export the component as the default export
export default LoginSignUp;

