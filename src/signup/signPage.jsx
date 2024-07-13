import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalHooks } from "../context";
const LoginPage = () => {
  const [toggleLogin, setToggleLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const Navigate = useNavigate();
  const {
    errorPop,
    handleLogin,
    handleRegister,
    errorMessage,
    loading,
    setErrorPop,
    setErrorMessage,
    setLoading,
  } = useGlobalHooks();

  const LoginUser = () => {
    if (!email || !password) {
      setErrorPop(true);
      setErrorMessage("Please enter email and password.");
      setLoading(false);

      return;
    }
    handleLogin(email, password);
    Navigate("/");
  };
  const RegisterUser = () => {
    if (password !== confirmPassword) {
      setErrorPop(true);
      setErrorMessage("password not match.");
      setLoading(false);

      return;
    }
    handleRegister(username, confirmPassword, email, password);
    Navigate("/");
  };
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-3/4 px-5  shadow-2xl flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 ">
          <div className="text-center">
            <h1 className="text-4xl">{toggleLogin ? "Register" : "Login"}</h1>
          </div>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="grow"
              placeholder="Email"
            />
          </label>
          {toggleLogin && (
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="grow"
                placeholder="Username"
              />
            </label>
          )}
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="grow"
              placeholder="password"
            />
          </label>
          {toggleLogin && (
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="grow"
                placeholder="confirmPassword"
              />
            </label>
          )}
          {toggleLogin ? (
            <label className=" flex items-center gap-2">
              <button
                disabled={loading}
                onClick={RegisterUser}
                className="btn btn-primary"
              >
                {loading ? "Loading.." : "Sign up"}
              </button>
            </label>
          ) : (
            <label className=" flex items-center gap-2">
              <button
                disabled={loading}
                onClick={LoginUser}
                className="btn btn-primary"
              >
                {loading ? "Loading.." : "Sign In"}
              </button>
            </label>
          )}

          <button
            onClick={() => {
              setErrorPop(false);
              setToggleLogin(!toggleLogin);
            }}
            className="btn no-animation"
          >
            {toggleLogin ? "Login to your account" : "Don't have an account?"}
          </button>
        </div>
      </div>
      {errorPop && (
        <div className="toast toast-end">
          <div className="alert alert-error">
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
