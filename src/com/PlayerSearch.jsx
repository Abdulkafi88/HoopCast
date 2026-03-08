import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const NBA_TEAMS = [
  { id: "1",  name: "Atlanta Hawks" },
  { id: "2",  name: "Boston Celtics" },
  { id: "3",  name: "New Orleans Pelicans" },
  { id: "4",  name: "Chicago Bulls" },
  { id: "5",  name: "Cleveland Cavaliers" },
  { id: "6",  name: "Dallas Mavericks" },
  { id: "7",  name: "Denver Nuggets" },
  { id: "8",  name: "Detroit Pistons" },
  { id: "9",  name: "Golden State Warriors" },
  { id: "10", name: "Houston Rockets" },
  { id: "11", name: "Indiana Pacers" },
  { id: "12", name: "LA Clippers" },
  { id: "13", name: "Los Angeles Lakers" },
  { id: "14", name: "Miami Heat" },
  { id: "15", name: "Milwaukee Bucks" },
  { id: "16", name: "Minnesota Timberwolves" },
  { id: "17", name: "Brooklyn Nets" },
  { id: "18", name: "New York Knicks" },
  { id: "19", name: "Orlando Magic" },
  { id: "20", name: "Philadelphia 76ers" },
  { id: "21", name: "Phoenix Suns" },
  { id: "22", name: "Portland Trail Blazers" },
  { id: "23", name: "Sacramento Kings" },
  { id: "24", name: "San Antonio Spurs" },
  { id: "25", name: "Oklahoma City Thunder" },
  { id: "26", name: "Utah Jazz" },
  { id: "27", name: "Washington Wizards" },
  { id: "28", name: "Toronto Raptors" },
  { id: "29", name: "Memphis Grizzlies" },
  { id: "30", name: "Charlotte Hornets" },
]

const heightInFeet = (inches) => {
  if (!inches) return "-"
  const ft = Math.floor(inches / 12)
  const inch = inches % 12
  return `${ft}'${inch}"`
}

const PlayerSearch = () => {
  const [selectedTeam, setSelectedTeam] = useState("")
  const [roster, setRoster] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!selectedTeam) return
    const fetchRoster = async () => {
      setLoading(true)
      setError(null)
      setRoster([])
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${selectedTeam}/roster`
        )
        const data = await res.json()
        setRoster(data.athletes ?? [])
      } catch (err) {
        setError("Failed to load roster.")
      } finally {
        setLoading(false)
      }
    }
    fetchRoster()
  }, [selectedTeam])

  const filtered = roster.filter((p) =>
    p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    p.position?.displayName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="content-holders">
      <h2 className="page-title">Player Search</h2>

      <div className="player-search-controls">
        <select
          className="team-select"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">Select a team...</option>
          {NBA_TEAMS.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {roster.length > 0 && (
          <input
            className="search-input"
            type="text"
            placeholder="Search by name or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {loading && <p style={{ marginTop: "2rem", color: "#777" }}>Loading roster...</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {!loading && !selectedTeam && (
        <p style={{ color: "#777", marginTop: "2rem" }}>Select a team to see their players.</p>
      )}

      <div className="player-grid">
        {filtered.map((player) => (
          <Link
            to={`/player/${player.id}`}
            state={{ player }}
            className="player-card-link"
            key={player.id}
          >
          <div className="player-card">
            <div className="player-card-top">
              {player.headshot?.href ? (
                <img src={player.headshot.href} alt={player.fullName} className="player-card-img" />
              ) : (
                <div className="player-card-img placeholder">?</div>
              )}
              <span className="player-card-jersey">#{player.jersey}</span>
            </div>
            <div className="player-card-info">
              <h3 className="player-card-name">{player.fullName}</h3>
              <p className="player-card-pos">{player.position?.displayName ?? "-"}</p>
              <div className="player-card-stats">
                <div className="player-stat-item">
                  <span className="player-stat-val">{heightInFeet(player.height)}</span>
                  <span className="player-stat-lbl">Height</span>
                </div>
                <div className="player-stat-item">
                  <span className="player-stat-val">{player.displayWeight ?? "-"}</span>
                  <span className="player-stat-lbl">Weight</span>
                </div>
                <div className="player-stat-item">
                  <span className="player-stat-val">{player.age ?? "-"}</span>
                  <span className="player-stat-lbl">Age</span>
                </div>
                <div className="player-stat-item">
                  <span className="player-stat-val">{player.experience?.years ?? "R"}</span>
                  <span className="player-stat-lbl">Exp</span>
                </div>
              </div>
              {player.college && (
                <p className="player-college">{player.college.name}</p>
              )}
              <p className="player-card-cta">Tap for full stats →</p>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PlayerSearch
