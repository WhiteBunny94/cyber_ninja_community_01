import React, { useEffect } from "react";
import { useFetchUserQuery } from "../store";

const HomePage = () => {

  const {data: userList} = useFetchUserQuery();

  useEffect(() => {
    // USER XP (replace with real value)
    const userXP = JSON.parse(localStorage.getItem("userData"))?.points || 0;
    const xpEl = document.getElementById("xp");
    const rankEl = document.getElementById("rank");
    const xpBar = document.getElementById("xp-bar");
    if (!xpEl || !rankEl || !xpBar) return;

    xpEl.textContent = userXP;

    // Rank logic
    function getRank(xp) {
      if (xp < 100) return "Beginner";
      if (xp < 250) return "Novice";
      if (xp < 500) return "Intermediate";
      if (xp < 1000) return "Advanced";
      return "Expert";
    }
    rankEl.textContent = getRank(userXP);

    // Progress bar logic
    let minXP = 0,
      maxXP = 100;
    if (userXP < 100) {
      minXP = 0;
      maxXP = 100;
    } else if (userXP < 250) {
      minXP = 100;
      maxXP = 250;
    } else if (userXP < 500) {
      minXP = 250;
      maxXP = 500;
    } else if (userXP < 1000) {
      minXP = 500;
      maxXP = 1000;
    } else {
      minXP = 1000;
      maxXP = 1500;
    }
    const percent = Math.min(
      100,
      Math.round(((userXP - minXP) / (maxXP - minXP)) * 100)
    );
    xpBar.style.width = percent + "%";

    function renderTop3(list) {

      const top3 = list?.slice().sort((a, b) => b.points - a.points).slice(0, 3);
      const ul = document.getElementById("top3-list");
      if (!ul) return;
      ul.innerHTML = "";
      const medals = ["🥇", "🥈", "🥉"];
      top3?.forEach((p, i) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        li.style.padding = "8px 6px";
        li.style.borderRadius = "8px";
        li.style.marginBottom = "8px";
        li.style.background =
          i === 0 ? "linear-gradient(90deg,#fff8e1,#fff)" : "#fff";
        li.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px">
            <div style="font-size:1.4rem">${medals[i]}</div>
            <div>
              <div style="font-weight:700">${p.name}</div>
              <div class="muted" style="font-size:0.9rem">${p.points} XP</div>
            </div>
          </div>
          <div style="font-weight:700;color:var(--muted)">${
            i === 0 ? "Top" : i + 1
          }</div>
        `;
        ul.appendChild(li);
      });
    }
    renderTop3(userList?.filter(u => u.role !== 'admin'));

    // ---------------------------------
    // Achievements data
    // ---------------------------------
    const achievements = [
      { xp: 20, name: "Active Sharer", desc: "First upload completed" },
      { xp: 50, name: "Top Contributor", desc: "Shared multiple resources" },
      {
        xp: 100,
        name: "Knowledge Seeker",
        desc: "Consistent learning and engagement",
      },
      { xp: 200, name: "Master Ninja", desc: "High-level contributor" },
      { xp: 400, name: "Community Leader", desc: "Recognized as a role model" },
    ];

    // Render unlocked achievements
    function renderUnlockedAchievements(xp) {
      const ul = document.getElementById("progress-achievements");
      if (!ul) return;
      ul.innerHTML = "";
      const unlocked = achievements.filter((a) => xp >= a.xp);
      if (!unlocked.length) {
        const li = document.createElement("li");
        li.className = "achievement-item";
        li.style.padding = "8px";
        li.innerHTML = `<div class="achievement-details muted">No achievements yet</div>`;
        ul.appendChild(li);
        return;
      }
      unlocked.forEach((a) => {
        const li = document.createElement("li");
        li.className = "achievement-item unlocked";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        li.style.padding = "8px";
        li.style.marginBottom = "8px";
        li.style.borderRadius = "8px";
        li.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;flex:1">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-details">
              <div class="achievement-title">${a.name} • ${a.xp} XP</div>
              <div class="achievement-desc">${a.desc}</div>
            </div>
          </div>
          <div style="min-width:72px;text-align:right;font-weight:700;color:var(--success)">Unlocked</div>
        `;
        ul.appendChild(li);
      });
    }

    renderUnlockedAchievements(userXP);
  }, [userList]);

  return (
    <div>
      <header>
        <h1>Cyber Ninjas Community</h1>
      </header>
      <nav>
        <a href="/" className="active">
          Home
        </a>
        <a href="/resources">Resources</a>
        <a href="/quests">Quests</a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/profile">Profile</a>
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
        <div className="dashboard-section">
          <h2>Welcome back, Student!</h2>

          <div className="card">
            <h3>Progress Tracker</h3>
            <div className="progress-label">
              Current Rank:{" "}
              <strong>
                <span id="rank">Beginner</span>
              </strong>
            </div>
            <div className="progress-label">
              XP: <span id="xp">0</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" id="xp-bar"></div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <h4 style={{ margin: "0 0 8px 0" }}>Achievements (Unlocked)</h4>
              <ul
                id="progress-achievements"
                className="quest-list"
                style={{ padding: 0, margin: 0 }}
              ></ul>
            </div>
          </div>

          <div className="card">
            <h3>Top 3 — Leaderboard</h3>
            <ul
              id="top3-list"
              style={{
                listStyle: "none",
                padding: 0,
                margin: "8px 0 0 0",
              }}
            ></ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
