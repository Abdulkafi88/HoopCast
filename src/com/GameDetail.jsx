import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Skeleton from "./Skeleton"

const InjuryReport = ({ injuries }) => {
  if (!injuries?.length) return null
  const allInjured = injuries.flatMap((t) =>
    (t.injuries ?? []).map((inj) => ({ ...inj, teamName: t.team.displayName, teamLogo: t.team.logo }))
  )
  if (!allInjured.length) return null

  const statusColor = (s) => {
    if (s === "Out") return "#e53e3e"
    if (s === "Doubtful") return "#dd6b20"
    if (s === "Questionable" || s === "Day-To-Day") return "#d69e2e"
    return "#718096"
  }

  return (
    <div className="injury-section">
      <h2 className="section-heading">Injury Report</h2>
      <div className="injury-list">
        {allInjured.map((inj, i) => (
          <div key={i} className="injury-row">
            <img src={inj.athlete.headshot?.href} alt={inj.athlete.displayName} className="injury-headshot" onError={(e) => e.target.style.display = "none"} />
            <div className="injury-info">
              <span className="injury-name">{inj.athlete.displayName}</span>
              <span className="injury-team">{inj.teamName} · {inj.athlete.position?.abbreviation}</span>
            </div>
            <span className="injury-status" style={{ color: statusColor(inj.status) }}>{inj.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const HeadToHead = ({ seasonseries, competitors }) => {
  if (!seasonseries?.length) return null
  const series = seasonseries[0]
  const events = series.events ?? []
  if (!events.length) return null

  return (
    <div className="h2h-section">
      <h2 className="section-heading">Season Series</h2>
      <p className="h2h-summary">{series.summary}</p>
      <div className="h2h-games">
        {events.map((event, i) => {
          const home = event.competitors?.find((c) => c.homeAway === "home")
          const away = event.competitors?.find((c) => c.homeAway === "away")
          const homeComp = competitors?.find((c) => c.team?.id === home?.team?.id)
          const awayComp = competitors?.find((c) => c.team?.id === away?.team?.id)
          return (
            <div key={i} className="h2h-game">
              <span className="h2h-date">
                {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <span className="h2h-teams">
                {away?.team?.displayName ?? "Away"} @ {home?.team?.displayName ?? "Home"}
              </span>
              <span className={`h2h-status ${event.statusType?.completed ? "final" : "upcoming"}`}>
                {event.statusType?.completed ? event.statusType.detail : "Upcoming"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PlayByPlay = ({ plays }) => {
  const [showAll, setShowAll] = useState(false)
  if (!plays?.length) return null

  const scoring = plays.filter((p) => p.scoringPlay).reverse()
  const displayed = showAll ? scoring : scoring.slice(0, 10)
  if (!displayed.length) return null

  return (
    <div className="pbp-section">
      <h2 className="section-heading">Scoring Plays</h2>
      <div className="pbp-list">
        {displayed.map((play, i) => (
          <div key={i} className="pbp-row">
            <span className="pbp-period">{play.period?.displayValue}</span>
            <span className="pbp-clock">{play.clock?.displayValue}</span>
            <span className="pbp-text">{play.text}</span>
            <span className="pbp-score">{play.awayScore}-{play.homeScore}</span>
          </div>
        ))}
      </div>
      {scoring.length > 10 && (
        <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : `Show All ${scoring.length} Scoring Plays`}
        </button>
      )}
    </div>
  )
}

const StatBox = ({ label, value }) => (
  <div className="stat-box">
    <span className="stat-value">{value ?? "-"}</span>
    <span className="stat-label">{label}</span>
  </div>
)

const PlayerRow = ({ athlete, stats, labels, starter }) => {
  const get = (key) => stats[labels.indexOf(key)] ?? "-"
  return (
    <div className={`player-row ${starter ? "starter" : "bench"}`}>
      <div className="player-info">
        {athlete.headshot?.href ? (
          <img className="player-headshot" src={athlete.headshot.href} alt={athlete.displayName} />
        ) : (
          <div className="player-headshot placeholder">?</div>
        )}
        <div className="player-meta">
          <span className="player-name">{athlete.displayName}</span>
          <span className="player-sub">
            #{athlete.jersey} · {athlete.position?.abbreviation}
            {starter && <span className="starter-badge">Starter</span>}
          </span>
        </div>
      </div>
      <div className="player-stats">
        <StatBox label="MIN" value={get("MIN")} />
        <StatBox label="PTS" value={get("PTS")} />
        <StatBox label="REB" value={get("REB")} />
        <StatBox label="AST" value={get("AST")} />
        <StatBox label="STL" value={get("STL")} />
        <StatBox label="BLK" value={get("BLK")} />
        <StatBox label="FG" value={get("FG")} />
      </div>
    </div>
  )
}

const TeamSection = ({ teamData }) => {
  const { team, statistics } = teamData
  if (!statistics?.length) return null
  const { athletes, labels } = statistics[0]
  const starters = athletes.filter((a) => a.starter)
  const bench = athletes.filter((a) => !a.starter)

  return (
    <div className="team-section">
      <div className="team-section-header">
        <img src={team.logo} alt={team.displayName} className="team-logo-large" />
        <h2>{team.displayName}</h2>
      </div>
      <h3 className="lineup-title">Starting Five</h3>
      {starters.map((a, i) => (
        <PlayerRow key={i} athlete={a.athlete} stats={a.stats} labels={labels} starter={true} />
      ))}
      {bench.length > 0 && (
        <>
          <h3 className="lineup-title bench-title">Bench</h3>
          {bench.map((a, i) => (
            <PlayerRow key={i} athlete={a.athlete} stats={a.stats} labels={labels} starter={false} />
          ))}
        </>
      )}
    </div>
  )
}

const TopPerformers = ({ players }) => {
  const allAthletes = []
  players.forEach((teamData) => {
    const stats = teamData.statistics?.[0]
    if (!stats) return
    const { athletes, labels } = stats
    const ptsIdx = labels.indexOf("PTS")
    athletes.forEach((a) => {
      const pts = parseInt(a.stats?.[ptsIdx] ?? "0")
      allAthletes.push({
        name: a.athlete.displayName,
        headshot: a.athlete.headshot?.href,
        team: teamData.team.displayName,
        teamLogo: teamData.team.logo,
        pts,
        reb: a.stats?.[labels.indexOf("REB")] ?? "-",
        ast: a.stats?.[labels.indexOf("AST")] ?? "-",
      })
    })
  })

  const top3 = allAthletes.sort((a, b) => b.pts - a.pts).slice(0, 3)
  if (top3.every((p) => p.pts === 0)) return null

  return (
    <div className="top-performers">
      <h2 className="section-heading">Top Performers</h2>
      <div className="top-performers-grid">
        {top3.map((p, i) => (
          <div key={i} className="top-performer-card">
            <span className="top-rank">#{i + 1}</span>
            {p.headshot ? (
              <img src={p.headshot} alt={p.name} className="top-headshot" />
            ) : (
              <div className="top-headshot placeholder">?</div>
            )}
            <h3 className="top-name">{p.name}</h3>
            <div className="top-team">
              <img src={p.teamLogo} alt={p.team} className="top-team-logo" />
              <span>{p.team}</span>
            </div>
            <div className="top-stats">
              <div className="top-stat"><span className="top-val">{p.pts}</span><span className="top-lbl">PTS</span></div>
              <div className="top-stat"><span className="top-val">{p.reb}</span><span className="top-lbl">REB</span></div>
              <div className="top-stat"><span className="top-val">{p.ast}</span><span className="top-lbl">AST</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const QuarterScores = ({ competitors }) => {
  const home = competitors?.find((c) => c.homeAway === "home")
  const away = competitors?.find((c) => c.homeAway === "away")
  const homeLinescore = home?.linescores ?? []
  const awayLinescore = away?.linescores ?? []
  if (!homeLinescore.length && !awayLinescore.length) return null

  const periods = Math.max(homeLinescore.length, awayLinescore.length)
  const labels = Array.from({ length: periods }, (_, i) =>
    i < 4 ? `Q${i + 1}` : `OT${i - 3}`
  )

  return (
    <div className="quarter-scores">
      <h3 className="quarter-title">Quarter Breakdown</h3>
      <div className="quarter-table-wrapper">
        <table className="quarter-table">
          <thead>
            <tr>
              <th>Team</th>
              {labels.map((l) => <th key={l}>{l}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="quarter-team">
                <img src={away?.team.logos?.[0]?.href ?? away?.team.logo} alt="" className="quarter-logo" />
                {away?.team.abbreviation}
              </td>
              {awayLinescore.map((q, i) => <td key={i}>{q.displayValue}</td>)}
              <td className="total-score">{away?.score ?? "-"}</td>
            </tr>
            <tr>
              <td className="quarter-team">
                <img src={home?.team.logos?.[0]?.href ?? home?.team.logo} alt="" className="quarter-logo" />
                {home?.team.abbreviation}
              </td>
              {homeLinescore.map((q, i) => <td key={i}>{q.displayValue}</td>)}
              <td className="total-score">{home?.score ?? "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const GameDetail = () => {
  const { gameId } = useParams()
  const [gameData, setGameData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${gameId}`
        )
        const data = await res.json()
        setGameData(data)
      } catch (err) {
        setError("Failed to load game details. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchGameDetail()
  }, [gameId])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (loading) return (
    <div className="content-holders">
      <div className="matchs">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}</div>
    </div>
  )

  if (error) return (
    <div className="content-holders" style={{ textAlign: "center", marginTop: "3rem" }}>
      <p style={{ color: "red" }}>{error}</p>
      <Link to="/teams" className="back-link">Back to Games</Link>
    </div>
  )

  const players = gameData?.boxscore?.players ?? []
  const header = gameData?.header
  const competitors = header?.competitions?.[0]?.competitors ?? []
  const homeTeam = competitors.find((c) => c.homeAway === "home")
  const awayTeam = competitors.find((c) => c.homeAway === "away")
  const status = header?.competitions?.[0]?.status?.type?.description ?? ""
  const noStats = !players.length || !players[0]?.statistics?.length
  const injuries = gameData?.injuries ?? []
  const seasonseries = gameData?.seasonseries ?? []
  const plays = gameData?.plays ?? []

  return (
    <div className="content-holders game-detail">
      <div className="detail-top-bar">
        <Link to="/teams" className="back-link">← Back to Games</Link>
        <button className="share-btn" onClick={handleShare}>
          {copied ? "✓ Copied!" : "🔗 Share Game"}
        </button>
      </div>

      {/* Scoreboard */}
      {homeTeam && awayTeam && (
        <div className="game-scoreboard">
          <div className="scoreboard-team">
            <img src={awayTeam.team.logos?.[0]?.href ?? awayTeam.team.logo} alt={awayTeam.team.displayName} />
            <span className="scoreboard-name">{awayTeam.team.displayName}</span>
            <span className="scoreboard-score">{awayTeam.score ?? "-"}</span>
          </div>
          <div className="scoreboard-middle">
            <span className="scoreboard-status">{status}</span>
            <span className="scoreboard-vs">VS</span>
          </div>
          <div className="scoreboard-team">
            <img src={homeTeam.team.logos?.[0]?.href ?? homeTeam.team.logo} alt={homeTeam.team.displayName} />
            <span className="scoreboard-name">{homeTeam.team.displayName}</span>
            <span className="scoreboard-score">{homeTeam.score ?? "-"}</span>
          </div>
        </div>
      )}

      {/* Quarter Scores */}
      <QuarterScores competitors={competitors} />

      <InjuryReport injuries={injuries} />
      <HeadToHead seasonseries={seasonseries} competitors={competitors} />

      {noStats ? (
        <p className="no-stats-msg">Player stats will be available once the game starts.</p>
      ) : (
        <>
          <TopPerformers players={players} />
          <PlayByPlay plays={plays} />
          <div className="game-detail-teams">
            {players.map((teamData, i) => <TeamSection key={i} teamData={teamData} />)}
          </div>
        </>
      )}
    </div>
  )
}

export default GameDetail
