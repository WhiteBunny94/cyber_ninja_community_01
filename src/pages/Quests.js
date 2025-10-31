import React, { useEffect, useState } from "react";
import { useAddPointRecordMutation, useAddTaskCompletionMutation, useEditUserMutation, useFetchDownloadRecordsQuery, useFetchLoginRecordQuery, useFetchPointRecordQuery, useFetchReadRecordsQuery, useFetchResourcesQuery, useFetchTasksQuery } from "../store";

const Quests = () => {

  const { data: questData } = useFetchTasksQuery();
  const { data: downloadRecords } = useFetchDownloadRecordsQuery();
  const { data: resources } = useFetchResourcesQuery();
  const { data: loginRecords } = useFetchLoginRecordQuery();
  const { data: pointRecords } = useFetchPointRecordQuery();
  const { data: readRecords } = useFetchReadRecordsQuery();
  const [addTaskCompletion, addTaskResult] = useAddTaskCompletionMutation();
  const [addPointRecord, addPointResult] = useAddPointRecordMutation();
  const [editUser, editUserResult] = useEditUserMutation(); 

  const userId = JSON.parse(localStorage.getItem("userData"))?.id || "unknown";

  const [dailyQuests, setDailyQuests] = useState([]);
  const [weeklyQuests, setWeeklyQuests] = useState([]);

  const Achievements = [
    { id: "consistency_champion", type: "streak", threshold: 10, points: 200, name: "Consistency Champion", desc: "Login 10 days straight" },
    { id: "resource_hero", type: "uploads", threshold: 10, points: 300, name: "Resource Hero", desc: "Upload 10 resources" },
    { id: "resources_master", type: "uploads", threshold: 20, points: 600, name: "Resources Master", desc: "Upload 20 resources" },
    { id: "resources_legend", type: "uploads", threshold: 30, points: 1000, name: "Resources Legend", desc: "Upload 30 resources" },
    { id: "knowledge_starter", type: "uploads", threshold: 1, points: 50, name: "Knowledge Starter", desc: "Upload 1 resource" },
    { id: "resource_explorer", type: "downloads", threshold: 10, points: 100, name: "Resource Explorer", desc: "Download 10 resources" },
    { id: "resource_seeker", type: "downloads", threshold: 20, points: 250, name: "Resource Seeker", desc: "Download 20 resources" },
    { id: "resource_collector", type: "downloads", threshold: 30, points: 500, name: "Resource Collector", desc: "Download 30 resources" },
  ];

  useEffect(() => {
    const userXp = JSON.parse(localStorage.getItem("userData"))?.points || 0;
    // Rank thresholds and helpers
    const RANKS = [
      { name: "Beginner", min: 0, max: 99, icon: "🟢", desc: "Getting started" },
      { name: "Novice", min: 100, max: 249, icon: "🔵", desc: "Learning the basics" },
      { name: "Intermediate", min: 250, max: 499, icon: "🟣", desc: "Building skills" },
      { name: "Advanced", min: 500, max: 999, icon: "🟠", desc: "Strong contributor" },
      { name: "Expert", min: 1000, max: 999999, icon: "🔶", desc: "Top-tier ninja" },
    ];
    // Quest data
    if (Array.isArray(questData)) {
      setDailyQuests(questData.filter((t) => t.type === "daily"));
      setWeeklyQuests(questData.filter((t) => t.type === "weekly"));
    }

    function getRankInfo(xp) {
      return RANKS.find((r) => xp >= r.min && xp <= r.max) || RANKS[0];
    }
    function getNextRankInfo(xp) {
      const idx = RANKS.findIndex((r) => xp >= r.min && xp <= r.max);
      return idx >= 0 && idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
    }

    function renderUserRank() {
      const userRankInfo = getRankInfo(userXp);
      const nextRankInfo = getNextRankInfo(userXp);
      const container = document.getElementById("user-rank");
      if (!container) return;
      container.innerHTML = "";
      const li = document.createElement("div");
      li.className = "achievement-item unlocked";
      const nextName = nextRankInfo ? nextRankInfo.name : "Max";
      const rangeMin = userRankInfo.min;
      const rangeMax = userRankInfo.max;
      const rangeSpan = Math.max(1, rangeMax - rangeMin);
      const progressPercent = Math.min(
        100,
        Math.round(((userXp - rangeMin) / rangeSpan) * 100)
      );
      const remaining = nextRankInfo ? Math.max(0, nextRankInfo.min - userXp) : 0;
      const progressText = nextRankInfo
        ? `${userXp} XP — ${remaining} XP to ${nextName}`
        : `${userXp} XP (Max rank)`;
      li.innerHTML = `
        <span class="achievement-icon">🏅</span>
        <div class="achievement-details" style="min-width:0">
          <div class="achievement-title">Rank: ${userRankInfo.name}</div>
          <div class="achievement-desc">${userRankInfo.desc} • ${progressText}</div>
          <div class="progress-bar-bg" style="margin-top:10px">
            <div class="progress-bar-fill" style="width:${progressPercent}%"></div>
          </div>
        </div>
        <span class="achievement-xp" style="white-space:nowrap">${progressPercent}%</span>
      `;
      container.appendChild(li);
    }

    renderUserRank();

  }, [questData, downloadRecords, resources, userId]);

  // Helper: get start of today and this week
  const getStartOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay(); // Sunday = 0
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.getFullYear(), now.getMonth(), diff);
  };

  // Helper: check record date in range
  const isInPeriod = (timestamp, type) => {
    const date = new Date(timestamp);
    return type === "daily"
      ? date >= getStartOfToday()
      : date >= getStartOfWeek();
  };

  // Count user actions for current period
  const getDownloadCount = (type) =>
    downloadRecords?.filter(
      (r) => String(r.userId) === String(userId) && isInPeriod(r.timestamp, type)
    ).length;

  const getReadCount = (type) =>
    readRecords?.filter(
      (r) => r.userId === userId && isInPeriod(r.timestamp, type)
    ).length;

  const getUploadCount = (type) =>
    resources?.filter(
      (r) =>
        r.uploaderId === userId &&
        r.createdAt &&
        isInPeriod(r.createdAt, type)
    ).length;

  // count user logins in period
  const getLoginCount = (type) =>
    loginRecords?.filter(
      (r) => r.userId === userId && isInPeriod(r.timestamp, type)
    ).length || 0;

  // Count total (for achievements, not period)
  const totalDownloads = downloadRecords?.filter((r) => r.userId === userId).length || 0;
  const totalUploads = resources?.filter((r) => r.uploaderId === userId).length || 0;
  const totalLogins = loginRecords?.filter((r) => r.userId === userId).length || 0;

  // Calculate login streak (consecutive days)
  const getLoginStreak = () => {
    if (!loginRecords) return 0;
    const userLogs = loginRecords
      .filter((r) => r.userId === userId)
      .map((r) => new Date(r.timestamp))
      .sort((a, b) => b - a);

    let streak = 0;
    let currentDate = getStartOfToday();

    for (let i = 0; i < userLogs.length; i++) {
      const logDate = new Date(userLogs[i].setHours(0, 0, 0, 0));
      if (logDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (logDate < currentDate) break;
    }
    return streak;
  };

  // Determine if a quest is completed (dynamic & scalable)
  const isQuestCompleted = (quest) => {
    const title = quest.title.toLowerCase();
    const type = quest.type;

    // Extract numbers from title
    const numberMatch = title.match(/\d+/);
    const requiredCount = numberMatch ? parseInt(numberMatch[0]) : 1; // default 1

    if (title.includes("login")) return getLoginCount(type) >= requiredCount;
    if (title.includes("download")) return getDownloadCount(type) >= requiredCount;
    if (title.includes("upload")) return getUploadCount(type) >= requiredCount;
    if (title.includes("read")) return getReadCount(type) >= requiredCount;

    return false;
  };

  // Check if quest already claimed from DB
  const isClaimed = (quest) => {
    if (!pointRecords || !quest) return false;
    return pointRecords.some((p) => {
      // p.taskId might be string in DB — compare loosely
      const sameTask = String(p.taskId) === String(quest.id);
      const sameUser = String(p.userId) === String(userId);
      if (!sameTask || !sameUser) return false;
      // ensure record timestamp is inside current period for this quest type
      return isInPeriod(p.timestamp, quest.type);
    });
  };

  const handleClaim = async (questOrAchievement, type = "quest") => {
    const isAchievement = type === "achievement";
    const taskId = questOrAchievement.id;
    const taskTitle = questOrAchievement.name || questOrAchievement.title;
    const userData = JSON.parse(localStorage.getItem("userData"));;

    const alreadyClaimed = pointRecords?.some(
      (p) => p.taskId === taskId && p.userId === userId && (!isAchievement ? isInPeriod(p.timestamp, questOrAchievement.type) : true)
    );

    if (alreadyClaimed) {
      alert("Already claimed.");
      return;
    }

    try {
      // Save task completion to database 
      await addTaskCompletion({ 
        userId: userId, taskId: 
        questOrAchievement.id, 
        timestamp: new Date().toISOString(), 
      });

      // Add point record
      await addPointRecord({
        userId,
        taskId,
        points: questOrAchievement.points,
        reason: `Completed ${isAchievement ? "achievement" : "quest"}: ${taskTitle}`,
        timestamp: new Date().toISOString(),
      });

      await editUser({ id: userId, points: userData.points + questOrAchievement.points });
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...userData, points: userData.points + questOrAchievement.points })
      );

      alert(`🎉 You claimed +${questOrAchievement.points} XP for "${taskTitle}"!`);
    } catch (e) {
      console.error(e);
      alert("Error claiming reward.");
    }
  };

  // 🟩 Achievement helpers
  const getAchievementProgress = (a) => {
    let current = 0;
    if (a.type === "uploads") current = totalUploads;
    else if (a.type === "downloads") current = totalDownloads;
    else if (a.type === "streak") current = getLoginStreak();

    const progress = Math.min(a.threshold, current);
    const percent = Math.min(100, Math.round((progress / a.threshold) * 100));
    return { current: progress, percent };
  };

  const isAchievementCompleted = (a) => {
    const { current } = getAchievementProgress(a);
    return current >= a.threshold;
  };

  const isAchievementClaimed = (a) =>
    pointRecords?.some((p) => p.taskId === a.id && p.userId === userId);

  return (
    <div>
      <header>
        <h1>Quests</h1>
      </header>

      <nav>
        <a href="/">Home</a>
        <a href="/resources">Resources</a>
        <a href="/quests" className="active">
          Quests
        </a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/profile">Profile</a>
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
        <div className="quest-section">
          <h3>Daily Quests</h3>
          <ul className="quest-list" id="daily-quests">
            {
              dailyQuests?.map((quest) => {
                return (
                  <li className={`quest-item ${isQuestCompleted(quest) && 'completed'}`} key={quest.id}>
                    <input
                      type="checkbox"
                      className="quest-checkbox"
                      id={`quest_${quest.id}`}
                      disabled
                      checked={isQuestCompleted(quest)}
                    />
                    <label htmlFor={`quest_${quest.id}`} className="quest-label">
                      {quest.title}
                    </label>
                    <span className="quest-points">+{quest.points} XP</span>
                    <button
                      disabled={isClaimed(quest) || !isQuestCompleted(quest)}
                      className={`claim-btn ${isClaimed(quest) ? 'claimed' : isQuestCompleted(quest) ? 'ready' : ''}`}
                      onClick={() => handleClaim(quest)}>
                        {isClaimed(quest) ? 'Claimed ✅' : isQuestCompleted(quest) ? 'Claim' : 'Incomplete'}
                      </button>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="quest-section">
          <h3>Weekly Quests</h3>
          <ul className="quest-list" id="weekly-quests">
            {
              weeklyQuests?.map((quest) => {
                return (
                  <li className={`quest-item ${isQuestCompleted(quest) && 'completed'}`} key={quest.id}>
                    <input
                      type="checkbox"
                      className="quest-checkbox"
                      id={`quest_${quest.id}`}
                      disabled
                      checked={isQuestCompleted(quest)}
                    />
                    <label htmlFor={`quest_${quest.id}`} className="quest-label">
                      {quest.title}
                    </label>
                    <span className="quest-points">+{quest.points} XP</span>
                    <button
                      disabled={isClaimed(quest) || !isQuestCompleted(quest)}
                      className={`claim-btn ${isClaimed(quest) ? 'claimed' : isQuestCompleted(quest) ? 'ready' : ''}`}
                      onClick={() => handleClaim(quest)}>
                        {isClaimed(quest) ? 'Claimed ✅' : isQuestCompleted(quest) ? 'Claim' : 'Incomplete'}
                      </button>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="quest-section">
          <h3>Achievements</h3>
          <ul className="quest-list">
            {Achievements.map((a) => {
              const { current, percent } = getAchievementProgress(a);
              const completed = isAchievementCompleted(a);
              const claimed = isAchievementClaimed(a);

              return (
                <li key={a.id} className={`achievement-item ${completed ? "completed" : ""}`}>
                  <span className="achievement-icon">{completed ? "🏆" : "🔒"}</span>
                  <div className="achievement-details">
                    <div className="achievement-title">{a.name}</div>
                    <div className="achievement-desc">{a.desc}</div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <small>
                      {current} / {a.threshold} • {percent}%
                    </small>
                  </div>
                  <span className="achievement-xp">+{a.points} XP</span>
                  <button
                    className={`claim-btn ${claimed ? "claimed" : completed ? "ready" : ""}`}
                    onClick={() => handleClaim(a, "achievement")}
                    disabled={!completed || claimed}
                  >
                    {claimed ? "Claimed ✅" : completed ? "Claim" : "In Progress"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="quest-section">
          <h3>Your Rank</h3>
          <div id="user-rank"></div>
        </div>
      </div>
    </div>
  );
};

export default Quests;
