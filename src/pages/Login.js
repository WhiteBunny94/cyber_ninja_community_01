import React, { useState } from "react";
import { useAddLoginRecordMutation, useFetchUserQuery } from "../store";

export default function Login() {

  const {data: userData} = useFetchUserQuery();
  const [addLoginRecord] = useAddLoginRecordMutation();
  const [form, setForm] = useState({
    id: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async(e) => {
    e.preventDefault();
    let loginUser = userData.filter((user) => {
      return user.id === form.id
    });
    if (loginUser.length > 0) {
      let isMatch = false;
      loginUser.map((e) => {
        if (e.password === form.password) {
          isMatch = true;
        }
      });
      if (isMatch) {
        localStorage.setItem("userData", JSON.stringify(loginUser[0]));
        await addLoginRecord({
          userId: loginUser[0].id,
          timestamp: new Date().toISOString(),
        });
        if ((loginUser[0].role || "").toLowerCase() === "admin") {
          window.location.href = "#/dashboard";
        } else {
          window.location.href = "/";
        }
        
      } else {
        alert("Password is wrong!!!");
      }
    } else {
      alert("ID is wrong!!!");
    }
  };

  return (
    <div>
      <style>{`
        body {
          background: #f4f6fb;
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        header {
          background: #22223b;
          color: #fff;
          padding: 24px 0 12px 0;
          text-align: center;
          letter-spacing: 2px;
          margin-bottom: 0;
        }
        .container {
          background: #fff;
          max-width: 400px;
          margin: 40px auto 0 auto;
          padding: 32px 28px 28px 28px;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(34,34,59,0.08);
          text-align: center;
        }
        h2 {
          margin-bottom: 18px;
          color: #22223b;
        }
        form {
          margin-top: 18px;
          text-align: left;
        }
        label {
          display: block;
          margin-bottom: 12px;
          color: #22223b;
          font-size: 1rem;
        }
        input[type="text"], input[type="password"] {
          width: 96%;
          padding: 8px;
          margin-top: 4px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          background: #f8f8fa;
          transition: border 0.2s;
        }
        input[type="text"]:focus, input[type="password"]:focus {
          border: 1.5px solid #4285F4;
          outline: none;
        }
        button[type="submit"] {
          width: 100%;
          padding: 12px 0;
          background: #22223b;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }
        button[type="submit"]:hover {
          background: #4a4e69;
        }
        .create-profile-link {
          display: block;
          margin-top: 20px;
          color: #4285F4;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .create-profile-link:hover {
          color: #22223b;
          text-decoration: underline;
        }
      `}</style>

      <header>
        <h1>Sign In</h1>
      </header>

      <div className="container">
        <h2>Sign in</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Student ID:
            <input
              type="text"
              name="id"
              required
              autoComplete="username"
              value={form.id}
              onChange={handleChange}
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Sign In</button>
        </form>

        <a className="create-profile-link" href="/register">
          Create Account
        </a>
      </div>
    </div>
  );
}
