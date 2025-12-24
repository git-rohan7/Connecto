import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup, login, resetPass } from "../../config/firebase";
import { toast } from "react-toastify";

function Login() {
  const [currentState, setCurrState] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUserName("");
    setEmail("");
    setPassword("");
    setTermsAccepted(false);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currentState === "Sign Up") {
      if (!userName.trim()) {
        toast.error("Please enter a username.");
        return;
      }
      if (!termsAccepted) {
        toast.error("You must accept the terms & conditions.");
        return;
      }
    } else {
      if (!email || !password) {
        toast.error("Please enter email and password.");
        return;
      }
    }

    if (currentState === "Login") {
      if (!termsAccepted) {
        toast.error("You must accept the terms & conditions.");
        return;
      }
    } else {
      if (!email || !password) {
        toast.error("Please enter email and password.");
        return;
      }
    }

    try {
      setLoading(true);

      if (currentState === "Sign Up") {
        const user = await signup(userName, email, password);
        resetForm();
      } else {
        const userCred = await login(email, password);
      }
    } catch (err) {
      const msg = err?.message || err?.code || "Something went wrong.";
      toast.error(msg);
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address to reset password.");
      return;
    }

    try {
      setLoading(true);
      await resetPass(email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (err) {
      const msg = err?.message || err?.code || "Failed to send reset email.";
      toast.error(msg);
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <img src={assets.logo} alt="logo" className="logo" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currentState}</h2>

        {currentState === "Sign Up" && (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder="username"
            className="form-input"
            required
            disabled={loading}
          />
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email Address"
          className="form-input"
          required
          disabled={loading}
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="password"
          className="form-input"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading} className="submit-btn">
          {loading
            ? currentState === "Sign Up"
              ? "Signing up..."
              : "Logging in..."
            : currentState === "Sign Up"
            ? "Sign Up"
            : "Login"}
        </button>

        <div className="login-term">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="terms">Agree to terms & conditions.</label>
        </div>

        <div className="login-forget">
          {currentState === "Sign Up" ? (
            <p className="login-toggle">
              Already have an account{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  resetForm();
                }}
                style={{ cursor: "pointer", color: "#077eff" }}
              >
                click here
              </span>
            </p>
          ) : (
            <>
              <p className="login-toggle">
                Create a new account{" "}
                <span
                  onClick={() => {
                    setCurrState("Sign Up");
                    resetForm();
                  }}
                  style={{ cursor: "pointer", color: "#077eff" }}
                >
                  click here
                </span>
              </p>

              <p className="login-reset">
                Forgot password?{" "}
                <span
                  onClick={handleResetPassword}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword(e)}
                >
                  Reset Password
                </span>
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
