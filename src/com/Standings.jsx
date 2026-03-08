import React, { useState, useEffect } from "react"
import Skeleton from "./Skeleton"

const WESTERN_TEAMS = new Set([
  "OKC", "HOU", "LAL", "DEN", "LAC", "MIN", "GS", "MEM",
  "SAC", "DAL", "PHX", "POR", "SA", "NO", "UTAH"
])

const Standings = () => {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [conference, setConference] = useState("all")

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch(
          "https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings?region=us&lang=en&contentorigin=espn&type=0&level=1&sort=gamesbehind%3Aasc&season=2025"
        )
        const data = await res.json()
        const entries = data?.standings?.entries ?? []

        const teams = entries.map((entry) => {
          const stats = {}
          entry.stats.forEach((s) => { stats[s.name] = s.displayValue })
          return {
            team: entry.team,
            wins: stats["wins"] ?? "-",
            losses: stats["losses"] ?? "-",
            pct: stats["winPercent"] ?? "-",
            gb: stats["gamesBehind"] ?? "-",
            streak: stats["streak"] ?? "-",
            last10: stats["Last Ten Games"] ?? "-",
            home: stats["Home"] ?? "-",
            away: stats["Road"] ?? "-",
            ppg: stats["avgPointsFor"] ?? "-",
            seed: parseInt(stats["playoffSeed"] ?? "99"),
            conference: WESTERN_TEAMS.has(entry.team.abbreviation) ? "west" : "east",
          }
        })

              setStandings(teams)
      } catch (err) {
        setError("Failed to load standings.")
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [])

  const east = standings.filter((t) => t.conference === "east").sort((a, b) => a.seed - b.seed)
  const west = standings.filter((t) => t.conference === "west").sort((a, b) => a.seed - b.seed)
  const displayed = conference === "east" ? east : conference === "west" ? west : [...east, ...west]

  return (
    <div className="content-holders">
      <div className="standings-header">
        <h2 className="standings-title">NBA Standings 2024-25</h2>
        <div className="conf-tabs">
          {["all", "east", "west"].map((c) => (
            <button
              key={c}
              className={`conf-tab ${conference === c ? "active" : ""}`}
              onClick={() => setConference(c)}
            >
              {c === "all" ? "All" : c === "east" ? "Eastern" : "Western"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="matchs">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : error ? (
        <p style={{ color: "red", marginTop: "2rem" }}>{error}</p>
      ) : (
        <div className="standings-table-wrapper">
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>W</th>
                <th>L</th>
                <th>PCT</th>
                <th>GB</th>
                <th>Home</th>
                <th>Away</th>
                <th>L10</th>
                <th>Streak</th>
                <th>PPG</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((team, index) => (
                <tr key={team.team.id} className={index < 6 ? "playoff-team" : index < 10 ? "playin-team" : ""}>
                  <td className="seed-num">{index + 1}</td>
                  <td className="team-cell">
                    <img
                      src={team.team.logos?.[0]?.href ?? team.team.logo}
                      alt={team.team.displayName}
                      className="standings-logo"
                    />
                    <span className="standings-team-name">{team.team.displayName}</span>
                  </td>
                  <td className="stat-bold">{team.wins}</td>
                  <td>{team.losses}</td>
                  <td>{team.pct}</td>
                  <td>{team.gb}</td>
                  <td>{team.home}</td>
                  <td>{team.away}</td>
                  <td>{team.last10}</td>
                  <td className={team.streak?.startsWith("W") ? "streak-win" : "streak-loss"}>{team.streak}</td>
                  <td>{team.ppg}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="standings-legend">
            <span className="legend-dot playoff"></span> Playoff
            <span className="legend-dot playin"></span> Play-In
          </div>
        </div>
      )}
    </div>
  )
}

export default Standings
