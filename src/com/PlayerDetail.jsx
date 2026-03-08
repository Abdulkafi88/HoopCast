import React, { useState, useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"

const StatCard = ({ label, value }) => (
  <div className="pd-stat-card">
    <span className="pd-stat-val">{value ?? "-"}</span>
    <span className="pd-stat-lbl">{label}</span>
  </div>
)

const PlayerDetail = () => {
  const { playerId } = useParams()
  const location = useLocation()
  const playerFromState = location.state?.player ?? null

  const [stats, setStats] = useState(null)
  const [gameLog, setGameLog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${playerId}/overview`
        )
        const data = await res.json()
        setStats(data.statistics ?? null)
        setGameLog(data.gameLog ?? null)
      } catch (err) {
        setError("Could not load stats.")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [playerId])

  const getSeason = () => stats?.splits?.find((s) => s.displayName === "Regular Season")?.stats ?? []
  const getCareer = () => stats?.splits?.find((s) => s.displayName === "Career")?.stats ?? []
  const labels = stats?.labels ?? []

  const getVal = (arr, key) => {
    const idx = labels.indexOf(key)
    return idx >= 0 ? arr[idx] : "-"
  }

  const heightInFeet = (inches) => {
    if (!inches) return "-"
    const ft = Math.floor(inches / 12)
    const inch = Math.round(inches % 12)
    return `${ft}'${inch}"`
  }

  const formatDOB = (dob) => {
    if (!dob) return "-"
    return new Date(dob).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const season = getSeason()
  const career = getCareer()

  return (
    <div className="content-holders pd-page">
      <Link to="/players" className="back-link">← Back to Players</Link>

      {playerFromState && (
        <div className="pd-hero">
          <div className="pd-hero-left">
            {playerFromState.headshot?.href ? (
              <img src={playerFromState.headshot.href} alt={playerFromState.fullName} className="pd-headshot" />
            ) : (
              <div className="pd-headshot placeholder">?</div>
            )}
          </div>

          <div className="pd-hero-info">
            <div className="pd-jersey">#{playerFromState.jersey}</div>
            <h1 className="pd-name">{playerFromState.fullName}</h1>
            <p className="pd-position">{playerFromState.position?.displayName}</p>

            <div className="pd-bio-grid">
              <div className="pd-bio-item">
                <span className="pd-bio-lbl">Height</span>
                <span className="pd-bio-val">{playerFromState.displayHeight ?? heightInFeet(playerFromState.height)}</span>
              </div>
              <div className="pd-bio-item">
                <span className="pd-bio-lbl">Weight</span>
                <span className="pd-bio-val">{playerFromState.displayWeight ?? "-"}</span>
              </div>
              <div className="pd-bio-item">
                <span className="pd-bio-lbl">Age</span>
                <span className="pd-bio-val">{playerFromState.age ?? "-"}</span>
              </div>
              <div className="pd-bio-item">
                <span className="pd-bio-lbl">Experience</span>
                <span className="pd-bio-val">
                  {playerFromState.experience?.years != null
                    ? playerFromState.experience.years === 0
                      ? "Rookie"
                      : `${playerFromState.experience.years} yr${playerFromState.experience.years > 1 ? "s" : ""}`
                    : "-"}
                </span>
              </div>
              <div className="pd-bio-item">
                <span className="pd-bio-lbl">Born</span>
                <span className="pd-bio-val">{formatDOB(playerFromState.dateOfBirth)}</span>
              </div>
              <div className="pd-bio-item">
                <span className="pd-bio-lbl">Birthplace</span>
                <span className="pd-bio-val">
                  {[playerFromState.birthPlace?.city, playerFromState.birthPlace?.country]
                    .filter(Boolean).join(", ") || "-"}
                </span>
              </div>
              <div className="pd-bio-item">
                <span className="pd-bio-lbl">College</span>
                <span className="pd-bio-val">{playerFromState.college?.name ?? "N/A"}</span>
              </div>
              <div className="pd-bio-item">
                <span className="pd-bio-lbl">Debut Year</span>
                <span className="pd-bio-val">{playerFromState.debutYear ?? "-"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <p style={{ color: "#777", margin: "2rem 0" }}>Loading stats...</p>}
      {error && <p style={{ color: "red", margin: "1rem 0" }}>{error}</p>}

      {!loading && stats && (
        <>
          {season.length > 0 && (
            <div className="pd-stats-section">
              <h2 className="pd-stats-title">2024-25 Season Averages</h2>
              <div className="pd-stats-grid">
                <StatCard label="Games" value={getVal(season, "GP")} />
                <StatCard label="Points" value={getVal(season, "PTS")} />
                <StatCard label="Rebounds" value={getVal(season, "REB")} />
                <StatCard label="Assists" value={getVal(season, "AST")} />
                <StatCard label="Steals" value={getVal(season, "STL")} />
                <StatCard label="Blocks" value={getVal(season, "BLK")} />
                <StatCard label="Minutes" value={getVal(season, "MIN")} />
                <StatCard label="FG%" value={getVal(season, "FG%")} />
                <StatCard label="3P%" value={getVal(season, "3P%")} />
                <StatCard label="FT%" value={getVal(season, "FT%")} />
                <StatCard label="Turnovers" value={getVal(season, "TO")} />
                <StatCard label="Fouls" value={getVal(season, "PF")} />
              </div>
            </div>
          )}

          {career.length > 0 && (
            <div className="pd-stats-section">
              <h2 className="pd-stats-title">Career Averages</h2>
              <div className="pd-stats-grid">
                <StatCard label="Games" value={getVal(career, "GP")} />
                <StatCard label="Points" value={getVal(career, "PTS")} />
                <StatCard label="Rebounds" value={getVal(career, "REB")} />
                <StatCard label="Assists" value={getVal(career, "AST")} />
                <StatCard label="Steals" value={getVal(career, "STL")} />
                <StatCard label="Blocks" value={getVal(career, "BLK")} />
                <StatCard label="Minutes" value={getVal(career, "MIN")} />
                <StatCard label="FG%" value={getVal(career, "FG%")} />
                <StatCard label="3P%" value={getVal(career, "3P%")} />
                <StatCard label="FT%" value={getVal(career, "FT%")} />
                <StatCard label="Turnovers" value={getVal(career, "TO")} />
                <StatCard label="Fouls" value={getVal(career, "PF")} />
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !stats && !error && (
        <p style={{ color: "#777", margin: "2rem 0" }}>No stats available for this player.</p>
      )}

      {/* Game Log */}
      {!loading && gameLog && (() => {
        const glStats = gameLog.statistics?.[0]
        const labels = glStats?.labels ?? []
        const evStats = glStats?.events ?? []
        const evDetails = gameLog.events ?? {}

        if (!evStats.length) return null

        const ptsIdx = labels.indexOf("PTS")
        const rebIdx = labels.indexOf("REB")
        const astIdx = labels.indexOf("AST")
        const minIdx = labels.indexOf("MIN")

        return (
          <div className="pd-stats-section">
            <h2 className="pd-stats-title">Recent Games</h2>
            <div className="gamelog-table-wrapper">
              <table className="gamelog-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Opponent</th>
                    <th>Result</th>
                    <th>MIN</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                  </tr>
                </thead>
                <tbody>
                  {evStats.map((ev, i) => {
                    const detail = evDetails[ev.eventId] ?? {}
                    const result = detail.gameResult
                    const score = detail.score
                    const opponent = detail.opponent
                    const date = detail.gameDate ? new Date(detail.gameDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"
                    return (
                      <tr key={i}>
                        <td>{date}</td>
                        <td className="gamelog-opp">
                          {opponent?.logo && <img src={opponent.logo} alt="" className="gamelog-opp-logo" />}
                          {detail.atVs} {opponent?.abbreviation ?? "-"}
                        </td>
                        <td className={result === "W" ? "streak-win" : result === "L" ? "streak-loss" : ""}>
                          {result ? `${result} ${score}` : "-"}
                        </td>
                        <td>{ev.stats?.[minIdx] ?? "-"}</td>
                        <td className="stat-bold">{ev.stats?.[ptsIdx] ?? "-"}</td>
                        <td>{ev.stats?.[rebIdx] ?? "-"}</td>
                        <td>{ev.stats?.[astIdx] ?? "-"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

export default PlayerDetail
