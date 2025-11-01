import React, { useState, useMemo } from "react";
import { useDeleteResourceMutation, useFetchResourcesQuery, useUpdateResourcesMutation } from "../store";


export default function AdminResources() {
    const { data: resources, isLoading, isError, refetch } = useFetchResourcesQuery();
    const [updateResource] = useUpdateResourcesMutation();
    const [deleteResource] = useDeleteResourceMutation();

    const [statusFilter, setStatusFilter] = useState("pending"); // Default filter

    const filteredResources = useMemo(() => {
        if (!resources) return [];
        if (statusFilter === "all") return resources;
        return resources.filter((r) => r.status === statusFilter);
    }, [resources, statusFilter]);

    const handleApprove = async (id) => {
        try {
            await updateResource({ id: id, status: "approved" }).unwrap();
            alert("✅ Resource approved successfully.");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to approve resource.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this resource?")) return;
        try {
            await deleteResource(id).unwrap();
            alert("🗑️ Resource deleted successfully.");
            refetch();
        } catch (err) {
            console.error(err);
            alert("❌ Failed to delete resource.");
        }
    };

    if (isLoading) return <p className="loading-text">Loading resources...</p>;
    if (isError) return <p className="error-text">Failed to load resources.</p>;

    return (
        <>
            <style>
                {`
                    .admin-container {
                        color: #222;
                    }

                    .admin-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin: 15px;
                        padding-right: 10px;
                        padding-left: 10px;
                    }

                    .admin-title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #fff;
                    }

                    .filter-box {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .filter-label {
                        font-weight: 500;
                    }

                    .filter-select {
                        padding: 6px 10px;
                        border-radius: 4px;
                        border: 1px solid #aaa;
                    }

                    .table-wrapper {
                        overflow-x: auto;
                        border: 1px solid #ccc;
                        border-radius: 6px;
                        margin: 15px;
                    }

                    .resources-table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .resources-table th,
                    .resources-table td {
                        padding: 10px;
                        border-bottom: 1px solid #ddd;
                        text-align: left;
                    }

                    .resources-table th {
                        background-color: #f0f0f0;
                        font-weight: bold;
                    }

                    .resources-table tr:hover {
                        background-color: #f9f9f9;
                    }

                    .status-badge {
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 600;
                        text-transform: capitalize;
                    }

                    .status-approved {
                        background-color: #d1fae5;
                        color: #065f46;
                    }

                    .status-pending {
                        background-color: #fef3c7;
                        color: #92400e;
                    }

                    .status-other {
                        background-color: #e5e7eb;
                        color: #374151;
                    }

                    .btn-approve,
                    .btn-delete {
                        border: none;
                        padding: 6px 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-right: 5px;
                    }

                    .btn-approve {
                        background-color: #3b82f6;
                        color: #fff;
                    }

                    .btn-approve:hover {
                        background-color: #2563eb;
                    }

                    .btn-delete {
                        background-color: #ef4444;
                        color: #fff;
                    }

                    .btn-delete:hover {
                        background-color: #b91c1c;
                    }

                    .no-data {
                        text-align: center;
                        color: #777;
                    }

                    .loading-text {
                        color: #555;
                        padding: 20px;
                    }

                    .error-text {
                        color: #d00;
                        padding: 20px;
                    }

                `}
            </style>
            <div className="admin-container">
                <header>
                    <h1>
                    <span style={{ color: "#fff", verticalAlign: "middle" }}>
                        Dashboard
                    </span>
                    </h1>
                </header>
                <nav>
                    <a href="#/dashboard">
                    Dashboard
                    </a>
                    <a href="#/admin/resources" className="active">Resources</a>
                    <a href="#/admin/account">Account</a>
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
                <div className="admin-header">
                    <div className="filter-box">
                        <label htmlFor="statusFilter" className="filter-label">Filter by Status:</label>
                        <select
                            id="statusFilter"
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                        </select>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="resources-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Uploader ID</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredResources.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="no-data">No resources found for "{statusFilter}" status.</td>
                                </tr>
                            ) : (
                                filteredResources.map((res, index) => (
                                    <tr key={res.id}>
                                        <td>{index + 1}</td>
                                        <td>{res.title}</td>
                                        <td>{res.uploaderId || "Unknown"}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${res.status === "approved"
                                                    ? "status-approved"
                                                    : res.status === "pending"
                                                        ? "status-pending"
                                                        : "status-other"
                                                    }`}
                                            >
                                                {res.status}
                                            </span>
                                        </td>
                                        <td>
                                            {res.status !== "approved" && (
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleApprove(res.id)}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(res.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    );
}
