# KNUST TimeTable Manager

A full frontend web application for managing academic schedules at KNUST. Built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies.

## 📁 Project Structure

```
knust-timetable/
├── index.html      ← The entire application (open this in a browser)
└── README.md       ← You are here
```

## 🚀 How to Open

### Option 1 — Direct browser (quickest)
Double-click `index.html` — it opens directly in Chrome, Firefox, Edge, or Safari.

### Option 2 — VS Code Live Server (recommended for development)
1. Open the `knust-timetable` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. The app opens at `http://127.0.0.1:5500`

## 👤 User Roles

| Role | Login | Dashboard |
|------|-------|-----------|
| **Lecturer** | Select "Lecturer" on login | Full schedule management, clash resolution, edit schedule |
| **Student** | Select "Student" on login | View timetable, report clashes, notifications |

## 📄 Pages Included

### Lecturer Side
- Landing Page
- Login / Sign Up / Forgot Password
- Dashboard (stats, weekly overview, charts)
- Timetable (weekly grid, clickable events)
- Clash Reports (view, resolve, filter, search)
- Profile
- Settings
- Notifications
- Edit Schedule

### Student Side
- Dashboard
- Timetable (weekly grid, colour-coded)
- Report Clash (submit + track reports)
- Notifications
- Profile
- Settings

## Interactive Features
- Role-based routing (Student vs Lecturer)
- Resolve clash with confirmation modal + live table update
- Click any timetable event to see class details
- Search and filter clash reports
- Save profile with toast notifications
- Toggle settings (notifications, dark mode, 2FA)
- Keyboard shortcuts: `Esc` to close modals, `Cmd/Ctrl+K` to search

## 🛠 Tech Stack
- **HTML5** — structure
- **CSS3** — styling (CSS custom properties / variables)
- **Vanilla JavaScript** — all interactivity, no libraries
- **Google Fonts** — Inter typeface
- **Figma** — original design source

## Design Colors (from Figma)
| Token | Value | Usage |
|-------|-------|-------|
| Primary green | `#00a63e` | Buttons, active states, accents |
| Text | `#101828` | Headings |
| Text muted | `#4a5565` | Body text |
| Border | `#d1d5dc` | Input borders |
| Red | `#e7000b` | Errors, clash alerts |
| Amber | `#f59e0b` | Warnings, pending |

## Next Steps (Backend Integration)
- Connect to a REST API or Firebase for real data
- Add authentication (JWT or sessions)
- Store timetable and clash data in a database
- Enable real-time updates with WebSockets or polling
