import React, { useEffect, useRef, useState } from "react"; // 🆕 UPDATED: useState included
import Chart from "chart.js/auto";
import {
  useFetchDownloadRecordsQuery,
  useFetchUserQuery,
} from "../store"; // adjust path

export default function Dashboard() {
  const { data: users } = useFetchUserQuery();
  const { data: downloadRecords } = useFetchDownloadRecordsQuery();

  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  // 🆕 UPDATED: Local states for filter controls (same as before)
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState(
    firstDayOfMonth.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);
  const [viewMode, setViewMode] = useState("weekly"); // "weekly" or "daily"

  useEffect(() => {
    if (!users) return;

    const validUsers = users.filter((u) => u.registeredAt);

    // 🆕 FIXED: Parse start and end and normalize to full-day range to avoid timezone/time issues
    // create start at 00:00:00.000 and end at 23:59:59.999
    const parsedStart = new Date(startDate);
    parsedStart.setHours(0, 0, 0, 0); // 🆕 FIXED

    const parsedEnd = new Date(endDate);
    parsedEnd.setHours(23, 59, 59, 999); // 🆕 FIXED

    // Helper: get start of week (Monday) and normalize time to 00:00:00.000
    const getWeekStart = (date) => {
      const d = new Date(date);
      const day = d.getDay(); // 0 = Sunday
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(d.setDate(diff));
      weekStart.setHours(0, 0, 0, 0); // 🆕 FIXED
      return weekStart;
    };

    // 🆕 UPDATED: Build dateGroups depending on viewMode but always use normalized day ranges
    const dateGroups = [];

    if (viewMode === "weekly") {
      // WEEKLY MODE: start from week that contains parsedStart
      let currentStart = getWeekStart(parsedStart);

      // Ensure we don't skip the first partial week if parsedStart > currentStart + 6
      while (currentStart <= parsedEnd) {
        const currentEnd = new Date(currentStart);
        currentEnd.setDate(currentEnd.getDate() + 6);
        // normalize end of week to end of day and clamp to parsedEnd
        currentEnd.setHours(23, 59, 59, 999); // 🆕 FIXED

        dateGroups.push({
          start: new Date(currentStart),
          end: currentEnd > parsedEnd ? new Date(parsedEnd) : new Date(currentEnd),
        });

        currentStart = new Date(currentStart);
        currentStart.setDate(currentStart.getDate() + 7);
        currentStart.setHours(0, 0, 0, 0); // 🆕 FIXED
      }
    } else {
      // DAILY MODE: create one group per calendar day, normalized
      let current = new Date(parsedStart);
      while (current <= parsedEnd) {
        const dayStart = new Date(current);
        dayStart.setHours(0, 0, 0, 0); // 🆕 FIXED
        const dayEnd = new Date(current);
        dayEnd.setHours(23, 59, 59, 999); // 🆕 FIXED
        dateGroups.push({ start: dayStart, end: dayEnd });

        current = new Date(current);
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0); // 🆕 FIXED
      }
    }

    // 🧮 Count user registrations for each group
    const userCounts = dateGroups.map(({ start, end }) => {
      return validUsers.filter((user) => {
        const regDate = new Date(user.registeredAt);
        return regDate >= start && regDate <= end;
      }).length;
    });

    // 🕒 Labels (Weekly or Daily)
    const labels =
      viewMode === "weekly"
        ? dateGroups.map(
            ({ start, end }) =>
              `${start.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })} - ${end.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}`
          )
        : dateGroups.map(({ start }) =>
            start.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );

    // 🧹 Destroy old charts safely
    if (lineChartInstance.current) lineChartInstance.current.destroy();

    // 📈 Line Chart (Registrations)
    const ctx = lineChartRef.current.getContext("2d");
    lineChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label:
              viewMode === "weekly"
                ? "Registered Students (Weekly)"
                : "Registered Students (Daily)",
            data: userCounts,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.2)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: "#2563eb",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text:
              viewMode === "weekly"
                ? "Student Registrations (Weekly)"
                : "Student Registrations (Daily)",
          },
        },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });

    // 🧱 BAR CHART (Downloads) - group downloads by same dateGroups
    if (!downloadRecords) {
      // destroy bar chart if exists to clear old state when records not yet ready
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
      return;
    }

    const downloadCounts = dateGroups.map(({ start, end }) =>
      downloadRecords.filter((rec) => {
        const t = new Date(rec.timestamp);
        return t >= start && t <= end;
      }).length
    );

    if (barChartInstance.current) barChartInstance.current.destroy();

    const ctx2 = barChartRef.current.getContext("2d");
    barChartInstance.current = new Chart(ctx2, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label:
              viewMode === "weekly" ? "Downloads (Weekly)" : "Downloads (Daily)",
            data: downloadCounts,
            backgroundColor: "rgba(34,197,94,0.6)",
            borderColor: "#16a34a",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text:
              viewMode === "weekly"
                ? "Download Records (Weekly)"
                : "Download Records (Daily)",
          },
        },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });
  }, [users, downloadRecords, startDate, endDate, viewMode]); // 🆕 UPDATED: dependencies include filters

  return (
    <div className="dashboard">
      <header>
        <h1>
          <span style={{ color: "#fff", verticalAlign: "middle" }}>
            Dashboard
          </span>
        </h1>
      </header>
      <nav>
        <a href="#/dashboard" className="active">
          Dashboard
        </a>
        <a href="#/admin/resources">Resources</a>
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

      {/* 🆕 UPDATED: Date Range & View Mode Filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "10px 20px",
          background: "#1e293b",
          color: "white",
          borderRadius: "8px",
          margin: "10px",
        }}
      >
        <div>
          <label>Start Date: </label>
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: "4px" }}
          />
        </div>
        <div>
          <label>End Date: </label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: "4px" }}
          />
        </div>
        <div>
          <label>View Mode: </label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            style={{ padding: "4px" }}
          >
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
      </div>

      {/* CHART SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "80%", margin: "20px auto" }}>
          <canvas ref={lineChartRef} />
        </div>

        <div style={{ width: "80%", margin: "20px auto" }}>
          <canvas ref={barChartRef} />
        </div>
      </div>
    </div>
  );
}
