import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAddDownloadRecordMutation, useAddReadRecordMutation, useAddResourcesMutation, useFetchCategoryQuery, useFetchResourcesQuery } from "../store";

const Resources = () => {
  const {data: categories} = useFetchCategoryQuery();
  const {data: resourceData} = useFetchResourcesQuery();
  const navigate = useNavigate();
  const [addResource, addResult] = useAddResourcesMutation();
  const [addReadRecord] = useAddReadRecordMutation();
  const [addDownloadRecord, downloadResult] = useAddDownloadRecordMutation();

  const [resources, setResources] = useState({
    title: "",
    uploaderId: "",
    categoryId: "",
    fileUrl: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    downloads: 0,
    reads: 0,
  });

  const [uploadFile, setUploadFile] = useState(null);
  const [category, setCategory] = useState("");

  const approvedResources = resourceData?.filter((r) => r.status === "approved") || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadFile || !category) {
      alert("⚠️ Please select a file and category.");
      return;
    }

    const file = uploadFile;
    const reader = new FileReader();

    reader.onload = async () => {
      const base64FileUrl = reader.result;
      const newResource = {
        title: file.name,
        uploaderId: JSON.parse(localStorage.getItem("userData"))?.id || "unknown",
        categoryId: category,
        fileUrl: base64FileUrl,
        status: "pending",
        createdAt: new Date().toISOString(),
        downloads: 0,
        reads: 0,
      };

      try {
        await addResource(newResource).unwrap();
        alert("✅ Resource uploaded successfully!");

        // Reset input fields
        setUploadFile(null);
        setCategory("");

        // Reset the actual <input type="file" /> in DOM
        const uploadInput = document.getElementById("resourceFile");
        if (uploadInput) uploadInput.value = "";

      } catch (err) {
        console.error("Upload failed:", err);
        alert("❌ Failed to upload resource.");
      }
    };

    reader.onerror = () => {
      alert("⚠️ Failed to read the file.");
    };

    reader.readAsDataURL(file);
  };

  const groupedResources = {};

  if (approvedResources && categories) {
    approvedResources.forEach((res) => {
      const category = categories.find((c) => c.id === res.categoryId)?.name || "Uncategorized";
      if (!groupedResources[category]) groupedResources[category] = [];
      groupedResources[category].push(res);
    });
  }


  // Handle download (save record + trigger browser download)
  const handleDownload = async (res) => {
    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      const record = {
        userId: user?.id || "guest",
        resourceId: res.id,
        timestamp: new Date().toISOString(),
      };

      await addDownloadRecord(record).unwrap();
      alert("✅ Download record saved:", record);
    } catch (err) {
      alert("⚠️ Failed to save download record:", err);
    }
  };

  // Handle Read (save read record + open viewer page)
  const handleRead = async (res) => {
    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      const record = {
        userId: user?.id || "guest",
        resourceId: res.id,
        timestamp: new Date().toISOString(),
      };

  // 🟩 Save the read record to db.json
  await addReadRecord(record).unwrap();

  // 🟩 Navigate to the read page using router (works with HashRouter)
  navigate(`/read/${res.id}`);
    } catch (err) {
      console.error("Read record error:", err);
      alert("⚠️ Failed to save read record.");
    }
  };

  const renderResources = (categoryName, resources) => (
    <div key={categoryName}>
      <h3>{categoryName}</h3>
      {resources.length === 0 ? (
        <p style={{ color: "#777" }}>No resources available.</p>
      ) : (
        <ul className="resource-list">
          {resources.map((res, i) => (
            <li className="resource-item" key={i}>
              <div className="resource-thumb">📄</div>
              <div className="resource-info">
                <span>{res.title}</span>
              </div>
              {/* Download */}
              <a
                className="resource-download"
                href={res.fileUrl}
                download
                onClick={(e) => handleDownload(res)}
              >
                Download
              </a>
              {/* Read button (opens viewer and records read) */}
              <button
                className="resource-download"
                onClick={() => handleRead(res)}
              >
                Read
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );


  return (
    <div>
      <header>
        <h1>Resources</h1>
      </header>
      <nav>
        <a href="#/">Home</a>
        <a href="#/resources" className="active">Resources</a>
        <a href="#/quests">Quests</a>
        <a href="#/leaderboard">Leaderboard</a>
        <a href="#/profile">Profile</a>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("userData");
            window.location.href = "/login"
          }}
          aria-label="Logout"
        >
          Logout
        </button>
      </nav>

      <div className="container">
        <h2>Learning Resources</h2>
        <div className="card">
          <form id="uploadForm" className="upload-form" onSubmit={handleSubmit}>
            <label htmlFor="resourceFile" className="upload-label">
              <strong>Upload Resource:</strong>
            </label>
            <input
              type="file"
              id="resourceFile"
              name="resourceFile"
              required
              className="upload-input"
              accept=".pdf"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
            <select
              id="category"
              className="category-select"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Category</option>
              {
                categories?.map((c) => {
                  return <option key={c.id} value={c.id}>{c.name}</option>;
                })
              }
            </select>
            <button type="submit" className="upload-btn">Upload</button>
          </form>
          <hr />
          {Object.entries(groupedResources).map(([categoryName, resList]) =>
            renderResources(categoryName, resList)
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
