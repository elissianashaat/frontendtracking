import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./loginSignUp.css";

const LoginSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [Name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [em, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate(); // This is the correct hook to use for navigation

  // Sign-up handler
  const UserSignup = async (e) => {
    e.preventDefault(); // Prevent form from default submission
    try {
      const url = `https://backendtracking-v2-git-omar377-dev.apps.rm2.thpm.p1.openshiftapps.com/api/v1/auth/signup`;
      const res = await axios.post(
        url,
        {
          name: Name,
          email: em,
          password: pass,
        },
        { timeout: 10000 }
      ); // 10 seconds timeout

      console.log(res.data);
      localStorage.setItem("token", res.data.token);

      // Navigate based on role using react-router's navigate function
      if (role === "user") navigate("/create-order");
      else if (role === "admin") navigate("/manage-orders");

      setFeedback("Sign up successful!");
    } catch (err) {
      console.error(err);
      if (err.response) {
        setFeedback(
          `Error: ${err.response.data.message || "Unable to sign up"}`
        );
      } else {
        setFeedback("Error: Unable to connect");
      }
    }
  };

  // Login handler
  const Signin = async (e) => {
    e.preventDefault(); // Prevent form from default submission
    try {
      const url = `https://backendtracking-v2-git-omar377-dev.apps.rm2.thpm.p1.openshiftapps.com/api/v1/auth/signin`;
      const res = await axios.post(
        url,
        { email: em, password: pass },
        { timeout: 10000 }
      ); // 10 seconds timeout

      console.log(res.data);
      localStorage.setItem("token", res.data.token);

      // Navigate based on role using react-router's navigate function
      if (role === "user") navigate("/create-order");
      else if (role === "courier") navigate("/assigned-orders");
      else if (role === "admin") navigate("/manage-orders");

      setFeedback("Login successful!");
    } catch (err) {
      console.error(err);
      if (err.response) {
        setFeedback(
          `Error: ${err.response.data.message || "Unable to connect"}`
        );
      } else {
        setFeedback("Error: Unable to connect");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-toggle">
          <button
            onClick={() => setIsSignUp(false)}
            className={!isSignUp ? "active" : ""}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={isSignUp ? "active" : ""}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={isSignUp ? UserSignup : Signin} className="auth-form">
          {feedback && <p className="feedback">{feedback}</p>}

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

          <input
            type="email"
            placeholder="Your email"
            value={em}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Your password"
            value={pass}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-submit">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignUp;
