# NASA APOD Explorer 🚀

A full-stack mini-project that shows **NASA's Astronomy Picture of the Day (APOD)** using:

- **Backend:** Java 17, Spring Boot
- **Frontend:** React (Create React App)
- **External API:** [NASA APOD API](https://api.nasa.gov/)

---

## 🎯 Features

### Backend (Spring Boot)
- RESTful API endpoints:
  - `GET /api/apod/today` – today’s APOD
  - `GET /api/apod?date=YYYY-MM-DD` – APOD for a specific date
  - `GET /api/apod/recent?days=N` – recent APODs (gallery)
- In-memory caching:
  - Max size: 50 entries
  - Expiry: 60 minutes
  - Reduces repeated external API calls
- External API key handled using environment variable:
  - `NASA_API_KEY` (falls back to `DEMO_KEY` if not set)
- Runs locally on `http://localhost:8080`

### Frontend (React)
- Dashboard UI with:
  - **Today’s APOD** (image / video + title + explanation)
  - **Date picker** to view APOD by date
  - **Recent gallery** grid (last N days)
- Responsive layout (CSS grid)
- Calls backend REST APIs (no direct call to NASA from frontend)

---

## 🏗 Project Structure

```text
nasa-apod-explorer/
├── backend/                 # Spring Boot project
│   ├── src/main/java/...   # Controllers, services, models
│   ├── src/main/resources/ # application.properties
│   └── pom.xml
└── frontend/
    └── nasa-apod-ui/       # React app (Create React App)
        ├── src/
        └── package.json
