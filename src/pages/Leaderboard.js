import React, { useEffect } from "react";
import { useFetchUserQuery } from "../store";

const Leaderboard = () => {

  const {data: userList} = useFetchUserQuery();

  useEffect(() => {
    const filteredUsers = (userList || []).filter(user => user.role !== 'admin');
    // Sort by XP descending
    const sortedList = [...(filteredUsers || [])].sort((a, b) => b.points - a.points);

    const tbody = document.getElementById("leaderboard");
    if (!tbody) return;

    tbody.innerHTML = "";
    sortedList.forEach((user, idx) => {
      const tr = document.createElement("tr");

      if (idx === 0) tr.classList.add("top-1");
      else if (idx === 1) tr.classList.add("top-2");
      else if (idx === 2) tr.classList.add("top-3");

      tr.innerHTML = `
        <td class="leaderboard-rank">${idx + 1}</td>
        <td class="leaderboard-name">${user.name}</td>
        <td class="leaderboard-xp">${user.points}</td>
      `;
      tbody.appendChild(tr);
    });
  }, [userList]);

  return (
    <div>
      <header>
        <h1>Leaderboard</h1>
      </header>

      <nav>
        <a href="#/">Home</a>
        <a href="#/resources">Resources</a>
        <a href="#/quests">Quests</a>
        <a href="#/leaderboard" className="active">
          Leaderboard
        </a>
        <a href="#/profile">Profile</a>
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
        <h2>Leaderboard</h2>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>#</th>
              <th>Name</th>
              <th style={{ width: "100px" }}>XP</th>
            </tr>
          </thead>
          <tbody id="leaderboard"></tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
