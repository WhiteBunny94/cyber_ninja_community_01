import React, { useState, useEffect } from "react";
import { useEditUserMutation, useFetchMajorQuery, useFetchResourcesByUserQuery } from "../store";

export default function Profile() {
  const {data: majorData} = useFetchMajorQuery();
  const {data: resourceData} = useFetchResourcesByUserQuery(JSON.parse(localStorage.getItem("userData")).id);
  const [editUser, editResult] = useEditUserMutation();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    id: "",
    username: "",
    email: "@gmail.com",
    dob: "",
    majorId: "",
  });

  const [uploads, setUploads] = useState([]);

  // Load uploads from IndexedDB (mock if none)
  useEffect(() => {
    setProfile(JSON.parse(localStorage.getItem("userData")) || profile);
  }, [profile]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  const handleMajorChange = (e) => {
    setProfile({ 
      ...profile, 
      majorId: e.target.value, 
      majorName: majorData.find(m => m.id === e.target.value)?.name || "" 
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedProfile = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      dob: profile.dob,
      majorId: profile.majorId,
    }
    editUser(updatedProfile);
    if(editResult.isSuccess) {
      localStorage.setItem("userData", JSON.stringify(profile));
    } else if(editResult.isError) {
      alert("Error updating profile: " + editResult.error.message);
    }
    setEditing(false);
  };

  return (
    <div>
      <header>
        <h1>
          <span style={{ color: "#fff", verticalAlign: "middle" }}>Profile</span>
        </h1>
      </header>

      <nav>
        <a href="/">Home</a>
        <a href="/resources">Resources</a>
        <a href="/quests">Quests</a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/profile" className="active">
          Profile
        </a>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("userData");
            window.location.href = "/login";
          }}
          aria-label="Logout"
        >
          Logout
        </button>
      </nav>

      <div className="container">
        <h2>Your Profile</h2>

        {/* Display Profile */}
        {editing? 
          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Student ID:
              <input
                type="text"
                name="id"
                value={profile.id}
                onChange={handleChange}
                disabled
              />
            </label>
            <label>
              Gmail:
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Major:
              <select
                name="majorId"
                value={profile.majorId}
                onChange={handleMajorChange}
                required
              >
                <option value="">Select Major</option>
                {
                  majorData?.map((major) => {
                    return <option key={major.id} value={major.id}>{major.name}</option>;
                  })
                }
              </select>
            </label>
            <div className="form-btn-row">
              <button type="submit" className="save-btn" onClick={handleSubmit}>
                Save
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        :<div className="profile-info" id="profileDisplay">
            <table className="profile-table">
              <tbody>
                <tr>
                  <td className="label">Name:</td>
                  <td className="value">{profile.name}</td>
                </tr>
                <tr>
                  <td className="label">Student ID:</td>
                  <td className="value">{profile.id}</td>
                </tr>
                <tr>
                  <td className="label">Gmail:</td>
                  <td className="value">{profile.email}</td>
                </tr>
                <tr>
                  <td className="label">Date of Birth:</td>
                  <td className="value">{profile.dob}</td>
                </tr>
                <tr>
                  <td className="label">Major:</td>
                  <td className="value">{profile.majorName}</td>
                </tr>
              </tbody>
            </table>
            <button className="edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          </div>
        }
        {/* Upload List */}
        <div className="card" style={{ marginTop: 18 }}>
          <h3>Upload List</h3>
          <p className="muted" style={{ margin: "6px 0 12px" }}>
            Files you uploaded. Status shows whether an admin approved each file.
          </p>
          <ul
            id="user-uploads-list"
            className="resource-list"
            style={{ maxHeight: 360, overflow: "auto" }}
          >
            {resourceData?.map((item) => (
              <li key={item.id} className="resource-item">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  <div className="resource-thumb">📄</div>
                  <div className="resource-info">
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div className="muted" style={{ fontSize: "0.9rem" }}>
                      {new Date(item.createdAt || Date.now()).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 110 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: item.status === "approved"
                        ? "var(--success)"
                        : "var(--muted)",
                    }}
                  >
                    {item.status === "approved" ? "Approved" : "Pending"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
