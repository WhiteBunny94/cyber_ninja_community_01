import React, { useState } from "react";
import { useFetchUserQuery, useDeleteUserMutation } from "../store";

export default function Account() {
  const { data: users, refetch } = useFetchUserQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await deleteUser(userId);
        alert(`User "${userName}" has been deleted successfully.`);
        refetch(); // Refresh the user list
      } catch (error) {
        alert("Error deleting user. Please try again.");
        console.error("Delete error:", error);
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users?.filter(user => 
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Separate admin and regular users
  const adminUsers = filteredUsers.filter(user => user.role === "admin");
  const regularUsers = filteredUsers.filter(user => user.role === "user");

  return (
    <div>
      <style>{`
        .account-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 32px 28px;
          background: var(--panel);
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(34,34,59,0.08);
        }
        .search-box {
          width: 100%;
          max-width: 400px;
          padding: 12px 16px;
          margin-bottom: 24px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          background: #f8f8fa;
        }
        .search-box:focus {
          border: 1.5px solid #4285F4;
          outline: none;
        }
        .users-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .users-table th,
        .users-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }
        .users-table th {
          background: #f5f5f5;
          font-weight: 600;
          color: #333;
        }
        .users-table tr:hover {
          background: #f9f9f9;
        }
        .role-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .role-admin {
          background: #e3f2fd;
          color: #1976d2;
        }
        .role-user {
          background: #f3e5f5;
          color: #7b1fa2;
        }
        .delete-btn {
          background: #e63946;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.2s;
        }
        .delete-btn:hover {
          background: #d32f2f;
        }
        .delete-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #4285F4;
        }
        .stat-label {
          color: #666;
          margin-top: 8px;
        }
        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 32px 0 16px 0;
          color: #333;
          padding-bottom: 8px;
          border-bottom: 2px solid #e0e0e0;
        }
        .no-users {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 40px;
        }
      `}</style>

      <header>
        <h1>Account Management</h1>
      </header>

      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/admin/resources">Resources</a>
        <a href="/account" className="active">Account</a>
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

      <div className="account-container">
        <h2>User Account Management</h2>
        
        {/* Statistics Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-number">{users?.length || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{adminUsers.length}</div>
            <div className="stat-label">Administrators</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{regularUsers.length}</div>
            <div className="stat-label">Regular Users</div>
          </div>
        </div>

        {/* Search Box */}
        <input
          type="text"
          className="search-box"
          placeholder="Search by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Admin Users Section */}
        <h3 className="section-title">Administrators</h3>
        {adminUsers.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Points</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.registeredAt).toLocaleDateString()}</td>
                  <td>{user.points}</td>
                  <td>
                    <span className="role-badge role-admin">Admin</span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={user.id === JSON.parse(localStorage.getItem("userData"))?.id}
                      title={user.id === JSON.parse(localStorage.getItem("userData"))?.id ? "Cannot delete your own account" : "Delete user"}
                    >
                      {user.id === JSON.parse(localStorage.getItem("userData"))?.id ? "Current User" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-users">No administrators found</div>
        )}

        {/* Regular Users Section */}
        <h3 className="section-title">Regular Users</h3>
        {regularUsers.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Points</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {regularUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.registeredAt).toLocaleDateString()}</td>
                  <td>{user.points}</td>
                  <td>
                    <span className="role-badge role-user">User</span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-users">No regular users found</div>
        )}
      </div>
    </div>
  );
}