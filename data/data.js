export const dashboardData = {
  user: {
    name: "Akash",
    title: "Operations Manager",
    location: "Hydrogen Hub - Pune",
    message: "Operational efficiency is trending up by 8% this week."
  },
  summaryCards: [
    {
      id: "overall-readiness",
      label: "Overall Readiness",
      value: "92%",
      change: "+5.2%",
      changeDirection: "up",
      description: "Across 18 production sites",
      accent: "#1455FE"
    },
    {
      id: "active-alerts",
      label: "Active Alerts",
      value: 6,
      change: "-3",
      changeDirection: "down",
      description: "3 critical • 3 warning",
      accent: "#FFAA3D"
    },
    {
      id: "compliance-status",
      label: "Compliance Status",
      value: "98%",
      change: "+2.1%",
      changeDirection: "up",
      description: "Audit ready in all zones",
      accent: "#2EBE72"
    },
    {
      id: "energy-optimization",
      label: "Energy Optimization",
      value: "84%",
      change: "+6.7%",
      changeDirection: "up",
      description: "vs. regional benchmark",
      accent: "#6B5CFF"
    }
  ],
  readinessBreakdown: [
    { facility: "Pune Refinery", readiness: 97, status: "Green" },
    { facility: "Vizag Terminal", readiness: 88, status: "Amber" },
    { facility: "Jamnagar Unit", readiness: 76, status: "Amber" },
    { facility: "Kochi Depot", readiness: 68, status: "Red" }
  ],
  maintenanceSchedule: [
    {
      id: "MT-202",
      task: "Catalyst replacement",
      facility: "Pune Refinery",
      owner: "Riya Patel",
      dueInDays: 4,
      status: "In progress",
      priority: "High"
    },
    {
      id: "MT-219",
      task: "Compressor vibration analysis",
      facility: "Vizag Terminal",
      owner: "Zaid Khan",
      dueInDays: 2,
      status: "Blocked",
      priority: "Critical"
    },
    {
      id: "MT-231",
      task: "Stack emission sampling",
      facility: "Jamnagar Unit",
      owner: "Chloe Dsouza",
      dueInDays: 9,
      status: "Scheduled",
      priority: "Medium"
    }
  ],
  alerts: [
    {
      id: "AL-88",
      title: "Nitrogen flow variance detected",
      description: "Variance exceeded threshold by 12% in Jamnagar Unit.",
      time: "14 min ago",
      type: "Critical"
    },
    {
      id: "AL-92",
      title: "Permit-to-work expiring",
      description: "Permit #PTW-431 expires in 8 hours at Vizag Terminal.",
      time: "1 hr ago",
      type: "Warning"
    },
    {
      id: "AL-93",
      title: "Ambient sensor offline",
      description: "Sensor Cluster B3 inactive for 27 minutes, Pune Refinery.",
      time: "2 hr ago",
      type: "Warning"
    }
  ],
  efficiencyHighlights: [
    {
      id: "steam",
      label: "Steam efficiency",
      score: 87,
      benchmark: 82,
      trend: "up"
    },
    {
      id: "water",
      label: "Water recovery",
      score: 74,
      benchmark: 79,
      trend: "down"
    },
    {
      id: "emission",
      label: "Emission intensity",
      score: 91,
      benchmark: 88,
      trend: "up"
    }
  ],
  quickActions: [
    {
      id: "forecast",
      label: "Demand forecast",
      description: "View next-week offtake forecast",
      href: "#"
    },
    {
      id: "incident",
      label: "Log an incident",
      description: "Start a deviation workflow",
      href: "#"
    },
    {
      id: "report",
      label: "Download daily report",
      description: "PDF • 1.7 MB",
      href: "#"
    }
  ],
  modal: {
    title: "Site Readiness Drilldown",
    subtitle: "Jamnagar Unit • Updated 12 minutes ago",
    description:
      "Maintenance backlog reduced by 18% week-on-week. Two high-impact actions remain pending sign-off.",
    checklist: [
      "Verify compressor inspection photographs",
      "Upload calibration certificates for emission sensors",
      "Schedule standby crew for night shift readiness test"
    ],
    owner: {
      name: "Chloe Dsouza",
      role: "Plant Superintendent",
      contact: "+91 87345 22341"
    }
  }
};

export const filters = {
  status: ["All", "Green", "Amber", "Red"],
  timeRange: ["Last 24 hours", "Last 7 days", "Last 30 days"]
};
