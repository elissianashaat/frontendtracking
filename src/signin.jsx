import "./App.css";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Signin() {
  const [ema, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [type, setType] = useState("instructor");
  //   const [isLoggedIn, setIsLoggedIn] = useState(false);

  const Signin = async () => {
    try {
      const protocol = "http://";
      const url =
        type === "instructor"
          ? `${protocol}127.0.0.1:3000/api/v1/users/login/`
          : `${protocol}127.0.0.1:4000/api/v1/users/login/`;
      const res = await axios.post(url, { email: ema, password: pass });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.data.user.id);
      localStorage.setItem("name", res.data.data.user.name);
      //   setIsLoggedIn(true);
      if (type === "instructor") {
        window.location.href = "./instructor/home";
      } else {
        window.location.href = "./user/home";
      }
    } catch (err) {
      console.error(err);
    }
  };

  //   if (isLoggedIn) {
  //     if (type === "instructor") {
  //       // window.location.href = "/instructor/home";
  //     }
  //     // window.location.href = "/user/home";
  //   }
  // if (isLoggedIn) {
  //   if (type === "instructor") {
  //     return <Redirect to="/instructor/home" />

  //       }
  //       // window.location.href = "/user/home";
  //   return <Redirect to="/home" />;
  // }

  return (
    <div className="App">
      <div>
        <h1>hello</h1>
        <label>Email</label>
        <input
          type="text"
          value={ema}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <br />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="instructor">Instructor</option>
          <option value="user">User</option>
        </select>
        <br />
        <button onClick={Signin}>Sign in</button>

        <br />
        <br />
        <Link to="/inctructorSign">Sign as inctructor</Link>
        <br />
        <Link to="/userSign">Sign as user</Link>
      </div>
    </div>
  );
}

export default Signin;
