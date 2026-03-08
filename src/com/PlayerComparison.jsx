import React, { useState, useEffect } from "react"

const NBA_TEAMS = [
  { id: "1", name: "Atlanta Hawks" }, { id: "2", name: "Boston Celtics" },
  { id: "3", name: "New Orleans Pelicans" }, { id: "4", name: "Chicago Bulls" },
  { id: "5", name: "Cleveland Cavaliers" }, { id: "6", name: "Dallas Mavericks" },
  { id: "7", name: "Denver Nuggets" }, { id: "8", name: "Detroit Pistons" },
  { id: "9", name: "Golden State Warriors" }, { id: "10", name: "Houston Rockets" },
  { id: "11", name: "Indiana Pacers" }, { id: "12", name: "LA Clippers" },
  { id: "13", name: "Los Angeles Lakers" }, { id: "14", name: "Miami Heat" },
  { id: "15", name: "Milwaukee Bucks" }, { id: "16", name: "Minnesota Timberwolves" },
  { id: "17", name: "Brooklyn Nets" }, { id: "18", name: "New York Knicks" },
  { id: "19", name: "Orlando Magic" }, { id: "20", name: "Philadelphia 76ers" },
  { id: "21", name: "Phoenix Suns" }, { id: "22", name: "Portland Trail Blazers" },
  { id: "23", name: "Sacramento Kings" }, { id: "24", name: "San Antonio Spurs" },
  { id: "25", name: "Oklahoma City Thunder" }, { id: "26", name: "Utah Jazz" },
  { id: "27", name: "Washington Wizards" }, { id: "28", name: "Toronto Raptors" },
  { id: "29", name: "Memphis Grizzlies" }, { id: "30", name: "Charlotte Hornets" },
]

const STAT_LABELS = ["GP", "PTS", "REB", "AST", "STL", "BLK", "MIN", "FG%", "3P%", "FT%", "TO", "PF"]

const PlayerPicker = ({ label, onSelect, selected }) => {
  const [teamId, setTeamId] = useState("")
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!teamId) return
    setLoading(true)
    fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`)
      .then((r) => r.json())
      .then((d) => setRoster(d.athletes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [teamId])

  return (
    <div className="compare-picker">
      <h3 className="compare-picker-label">{label}</h3>
      <select className="team-select" value={teamId} onChange={(e) => { setTeamId(e.target.value); onSelect(null) }}>
        <option value="">Select team...</option>
        {NBA_TEAMS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      {loading && <p style={{ color: "#aaa", fontSize: "0.85rem" }}>Loading...</p>}
      {roster.length > 0 && (
        <select className="team-select" style={{ marginTop: "0.5rem" }} onChange={(e) => {
          const p = roster.find((r) => r.id === e.target.value)
          onSelect(p ?? null)
        }}>
          <option value="">Select player...</option>
          {roster.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
        </select>
      )}
      {selected && (
        <div className="compare-selected-player">
          {selected.headshot?.href && (
            <img src={selected.headshot.href} alt={selected.fullName} className="compare-headshot" />
          )}
          <div>
            <p className="compare-player-name">{selected.fullName}</p>
            <p className="compare-player-pos">{selected.position?.displayName} · #{selected.jersey}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const PlayerComparison = () => {
  const [playerA, setPlayerA] = useState(null)
  const [playerB, setPlayerB] = useState(null)
  const [statsA, setStatsA] = useState(null)
  const [statsB, setStatsB] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = async (player, setStat) => {
    if (!player) { setStat(null); return }
    try {
      const res = await fetch(
        `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/overview`
      )
      const data = await res.json()
      setStat(data.statistics ?? null)
    } catch (err) { setStat(null) }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchStats(playerA, setStatsA), fetchStats(playerB, setStatsB)])
      .finally(() => setLoading(false))
  }, [playerA, playerB])

  const getVal = (stats, label) => {
    if (!stats) return null
    const labels = stats.labels ?? []
    const split = stats.splits?.find((s) => s.displayName === "Regular Season")
    if (!split) return null
    const idx = labels.indexOf(label)
    return idx >= 0 ? parseFloat(split.stats[idx]) : null
  }

  const canCompare = playerA && playerB && statsA && statsB

  return (
    <div className="content-holders">
      <h2 className="page-title">Player Comparison</h2>

      <div className="compare-pickers">
        <PlayerPicker label="Player 1" selected={playerA} onSelect={setPlayerA} />
        <div className="compare-vs">VS</div>
        <PlayerPicker label="Player 2" selected={playerB} onSelect={setPlayerB} />
      </div>

      {loading && <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>Loading stats...</p>}

      {canCompare && !loading && (
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th>{playerA.fullName}</th>
                <th>STAT</th>
                <th>{playerB.fullName}</th>
              </tr>
            </thead>
            <tbody>
              {STAT_LABELS.map((label) => {
                const a = getVal(statsA, label)
                const b = getVal(statsB, label)
                const aWins = a !== null && b !== null && a > b
                const bWins = a !== null && b !== null && b > a
                return (
                  <tr key={label}>
                    <td className={aWins ? "compare-winner" : ""}>{a ?? "-"}</td>
                    <td className="compare-stat-label">{label}</td>
                    <td className={bWins ? "compare-winner" : ""}>{b ?? "-"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {!playerA && !playerB && (
        <p style={{ textAlign: "center", color: "#777", marginTop: "3rem" }}>
          Select two players above to compare their stats.
        </p>
      )}
    </div>
  )
}

export default PlayerComparison
