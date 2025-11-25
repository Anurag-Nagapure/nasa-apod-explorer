import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // ---------- Today APOD state ----------
  const [todayApod, setTodayApod] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  // ---------- Date-based APOD state ----------
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  );
  const [dateApod, setDateApod] = useState(null);
  const [dateLoading, setDateLoading] = useState(false);
  const [dateError, setDateError] = useState(null);

  // ---------- Recent gallery state ----------
  const [recentApods, setRecentApods] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState(null);
  const [recentDays] = useState(8); // you can change to 10 or 12 if you like

  // ---------- Fetch helpers ----------
  async function fetchTodayApod() {
    try {
      setTodayLoading(true);
      setTodayError(null);

      const response = await fetch('http://localhost:8080/api/apod/today');

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      setTodayApod(data);
    } catch (err) {
      console.error(err);
      setTodayError("Failed to load today's APOD. Please try again.");
    } finally {
      setTodayLoading(false);
    }
  }

  async function fetchApodByDate(date) {
    try {
      setDateLoading(true);
      setDateError(null);
      setDateApod(null);

      const response = await fetch(`http://localhost:8080/api/apod?date=${date}`);

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      setDateApod(data);
    } catch (err) {
      console.error(err);
      setDateError('Failed to load APOD for that date.');
    } finally {
      setDateLoading(false);
    }
  }

  async function fetchRecentApods(days) {
    try {
      setRecentLoading(true);
      setRecentError(null);

      const response = await fetch(
        `http://localhost:8080/api/apod/recent?days=${days}`
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      setRecentApods(data);
    } catch (err) {
      console.error(err);
      setRecentError('Failed to load recent APODs.');
    } finally {
      setRecentLoading(false);
    }
  }

  // ---------- Load data on first render ----------
  useEffect(() => {
    fetchTodayApod();
    fetchRecentApods(recentDays);
  }, [recentDays]);

  // ---------- Handlers ----------
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleFetchDateApod = () => {
    if (!selectedDate) return;
    fetchApodByDate(selectedDate);
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>🚀 NASA APOD Explorer</h1>
        <p>Astronomy Picture of the Day – Java Spring Boot + React</p>
      </header>

      <main className="app-main">
        {/* ---------- Today&apos;s APOD card ---------- */}
        <section className="card">
          <h2>Today&apos;s APOD</h2>

          {todayLoading && <p>Loading today&apos;s picture...</p>}

          {todayError && <p className="error-text">{todayError}</p>}

          {!todayLoading && !todayError && todayApod && (
            <div className="today-apod">
              <h3>{todayApod.title}</h3>
              <p className="meta-text">
                {todayApod.date}{' '}
                {todayApod.copyright && <>· © {todayApod.copyright}</>}
              </p>

              {todayApod.media_type === 'image' && (
                <img
                  src={todayApod.url}
                  alt={todayApod.title}
                  className="apod-image"
                />
              )}

              {todayApod.media_type === 'video' && (
                <div className="apod-video-wrapper">
                  <iframe
                    src={todayApod.url}
                    title={todayApod.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <p className="apod-explanation">{todayApod.explanation}</p>
            </div>
          )}
        </section>

        {/* ---------- Date picker card ---------- */}
        <section className="card">
          <h2>View APOD by Date</h2>
          <p className="hint-text">
            Select a date and click &quot;Load APOD&quot; to see that day&apos;s picture.
          </p>

          <div className="date-picker-container">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="date-input"
            />
            <button
              onClick={handleFetchDateApod}
              className="primary-button"
            >
              Load APOD
            </button>
          </div>

          {dateLoading && <p>Loading APOD for {selectedDate}...</p>}

          {dateError && <p className="error-text">{dateError}</p>}

          {!dateLoading && !dateError && dateApod && (
            <div className="date-apod">
              <h3>{dateApod.title}</h3>
              <p className="meta-text">
                {dateApod.date}{' '}
                {dateApod.copyright && <>· © {dateApod.copyright}</>}
              </p>

              {dateApod.media_type === 'image' && (
                <img
                  src={dateApod.url}
                  alt={dateApod.title}
                  className="apod-image"
                />
              )}

              {dateApod.media_type === 'video' && (
                <div className="apod-video-wrapper">
                  <iframe
                    src={dateApod.url}
                    title={dateApod.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <p className="apod-explanation">{dateApod.explanation}</p>
            </div>
          )}
        </section>

        {/* ---------- Recent gallery card ---------- */}
        <section className="card">
          <h2>Recent APOD Gallery (last {recentDays} days)</h2>

          {recentLoading && <p>Loading recent APODs...</p>}

          {recentError && <p className="error-text">{recentError}</p>}

          {!recentLoading && !recentError && recentApods.length > 0 && (
            <div className="gallery-grid">
              {recentApods.map((apod) => (
                <div key={apod.date} className="gallery-item">
                  {apod.media_type === 'image' ? (
                    <img
                      src={apod.url}
                      alt={apod.title}
                      className="gallery-thumb"
                    />
                  ) : (
                    <div className="gallery-thumb video-thumb">
                      <span>Video</span>
                    </div>
                  )}
                  <div className="gallery-meta">
                    <p className="gallery-title">{apod.title}</p>
                    <p className="gallery-date">{apod.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <small>Built by Anurag · Spring Boot + React · NASA APOD Explorer 🌌</small>
      </footer>
    </div>
  );
}

export default App;
