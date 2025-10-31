import React, { useEffect, useState } from "react";
import { useAddUserMutation, useFetchMajorQuery } from "../store";

export default function Register() {

  const { data: majorData } = useFetchMajorQuery();

  const [addUser, addResult] = useAddUserMutation();

  const [form, setForm] = useState({
    id: "",
    name: "",
    password: "",
    dob: "",
    majorId: "",
    email: "",
    points: 0,
    role: "user",
    registeredAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (addResult.isSuccess) {
      alert("User registered successfully!");
      window.location.href = "/login"; // redirect to login page
    } else if (addResult.isError) {
      alert("Error registering user: " + addResult.error.message);
    }
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(form);
  };

  return (
    <div>
      <header>
        <h1>Create User Profile</h1>
      </header>

      <div className="container auth">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Student ID:
            <input
              type="text"
              name="id"
              required
              autoComplete="off"
              value={form.id}
              onChange={handleChange}
              placeholder="e.g., 6000001"
            />
          </label>

          <label>
            Name:
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              name="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          <label>
            Date of Birth:
            <input
              type="date"
              name="dob"
              required
              value={form.dob}
              onChange={handleChange}
            />
          </label>

          <label>
            Major:
            <select
              name="majorId"
              required
              value={form.majorId}
              onChange={handleChange}
            >
              <option value="">Select Major</option>
              {
                majorData?.map((major) => {
                  return <option key={major.id} value={major.id}>{major.name}</option>;
                })
              }
            </select>
          </label>

          <label>
            Gmail:
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Create Profile</button>
        </form>

        <a className="signin-link" href="/login">
          Already have an account? Sign in
        </a>
      </div>
    </div>
  );
}
