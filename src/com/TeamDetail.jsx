import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Skeleton from "./Skeleton"

const TeamDetail = () => {
  const { teamId } = useParams()
  const [team, setTeam] = useState(null)
  const [roster, setRoster] = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("schedule")

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [teamRes, rosterRes, scheduleRes] = await Promise.all([
          fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}`),
          fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`),
          fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/schedule`),
        ])
        const [teamData, rosterData, scheduleData] = await Promise.all([
          teamRes.json(), rosterRes.json(), scheduleRes.json()
        ])
        setTeam(teamData.team)
        setRoster(rosterData.athletes ?? [])

        // Get next 10 upcoming + last 5 games
        const events = scheduleData.events ?? []
        const now = new Date()
        const upcoming = events.filter((e) => new Date(e.date) >= now).slice(0, 8)
        const past = events.filter((e) => new Date(e.date) < now).slice(-5).reverse()
        setSchedule([...past, ...upcoming])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [teamId])

  const heightInFeet = (inches) => {
    if (!inches) return "-"
    return `${Math.floor(inches / 12)}'${Math.round(inches % 12)}"`
  }

  if (loading) return (
    <div className="content-holders">
      <div className="matchs">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}</div>
    </div>
  )

  if (!team) return (
    <div className="content-holders" style={{ marginTop: "3rem", textAlign: "center" }}>
      <p>Team not found.</p>
      <Link to="/teams" className="back-link">Back to Games</Link>
    </div>
  )

  const logo = team.logos?.[0]?.href ?? team.logo
  const record = team.record?.items?.[0]?.summary ?? "-"
  const teamColor = `#${team.color ?? "5c48ee"}`

  return (
    <div className="content-holders team-detail-page">
      <Link to="/teams" className="back-link">← Back to Teams</Link>

      {/* Hero */}
      <div className="team-hero" style={{ background: `linear-gradient(135deg, ${teamColor}cc, #0f1e6a)` }}>
        <img src={logo} alt={team.displayName} className="team-hero-logo" />
        <div className="team-hero-info">
          <h1 className="team-hero-name">{team.displayName}</h1>
          <p className="team-hero-record">Record: <strong>{record}</strong></p>
        </div>
      </div>

      {/* Tabs */}
      <div className="team-tabs">
        {["schedule", "roster"].map((t) => (
          <button
            key={t}
            className={`team-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Schedule */}
      {tab === "schedule" && (
        <div className="team-schedule">
          {schedule.length === 0 && <p style={{ color: "#777" }}>No schedule available.</p>}
          {schedule.map((event, i) => {
            const comp = event.competitions?.[0]
            const home = comp?.competitors?.find((c) => c.homeAway === "home")
            const away = comp?.competitors?.find((c) => c.homeAway === "away")
            const isHome = home?.team?.id === teamId
            const opponent = isHome ? away : home
            const isPast = new Date(event.date) < new Date()
            const myScore = isHome ? (home?.score?.displayValue ?? home?.score) : (away?.score?.displayValue ?? away?.score)
            const oppScore = isHome ? (away?.score?.displayValue ?? away?.score) : (home?.score?.displayValue ?? home?.score)
            const result = isPast ? (parseInt(myScore) > parseInt(oppScore) ? "W" : "L") : null

            return (
              <div key={i} className={`schedule-row ${isPast ? "past" : "upcoming"}`}>
                <span className="schedule-date">
                  {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className="schedule-ha">{isHome ? "vs" : "@"}</span>
                <img
                  src={opponent?.team?.logos?.[0]?.href ?? opponent?.team?.logo}
                  alt={opponent?.team?.displayName}
                  className="schedule-opp-logo"
                />
                <span className="schedule-opp">{opponent?.team?.displayName ?? "-"}</span>
                {isPast && result && (
                  <span className={`schedule-result ${result === "W" ? "win" : "loss"}`}>
                    {result} {myScore}-{oppScore}
                  </span>
                )}
                {!isPast && (
                  <span className="schedule-time">
                    {new Date(event.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Roster */}
      {tab === "roster" && (
        <div className="player-grid" style={{ marginTop: "1.5rem" }}>
          {roster.map((player) => (
            <Link
              key={player.id}
              to={`/player/${player.id}`}
              state={{ player }}
              className="player-card-link"
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
                      <span className="player-stat-val">{player.displayHeight ?? heightInFeet(player.height)}</span>
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
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeamDetail
