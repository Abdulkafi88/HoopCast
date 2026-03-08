import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const NBA_TEAMS = [
  { id: "1", name: "Atlanta Hawks", abbr: "ATL" },
  { id: "2", name: "Boston Celtics", abbr: "BOS" },
  { id: "3", name: "New Orleans Pelicans", abbr: "NO" },
  { id: "4", name: "Chicago Bulls", abbr: "CHI" },
  { id: "5", name: "Cleveland Cavaliers", abbr: "CLE" },
  { id: "6", name: "Dallas Mavericks", abbr: "DAL" },
  { id: "7", name: "Denver Nuggets", abbr: "DEN" },
  { id: "8", name: "Detroit Pistons", abbr: "DET" },
  { id: "9", name: "Golden State Warriors", abbr: "GS" },
  { id: "10", name: "Houston Rockets", abbr: "HOU" },
  { id: "11", name: "Indiana Pacers", abbr: "IND" },
  { id: "12", name: "LA Clippers", abbr: "LAC" },
  { id: "13", name: "Los Angeles Lakers", abbr: "LAL" },
  { id: "14", name: "Miami Heat", abbr: "MIA" },
  { id: "15", name: "Milwaukee Bucks", abbr: "MIL" },
  { id: "16", name: "Minnesota Timberwolves", abbr: "MIN" },
  { id: "17", name: "Brooklyn Nets", abbr: "BKN" },
  { id: "18", name: "New York Knicks", abbr: "NY" },
  { id: "19", name: "Orlando Magic", abbr: "ORL" },
  { id: "20", name: "Philadelphia 76ers", abbr: "PHI" },
  { id: "21", name: "Phoenix Suns", abbr: "PHX" },
  { id: "22", name: "Portland Trail Blazers", abbr: "POR" },
  { id: "23", name: "Sacramento Kings", abbr: "SAC" },
  { id: "24", name: "San Antonio Spurs", abbr: "SA" },
  { id: "25", name: "Oklahoma City Thunder", abbr: "OKC" },
  { id: "26", name: "Utah Jazz", abbr: "UTAH" },
  { id: "27", name: "Washington Wizards", abbr: "WSH" },
  { id: "28", name: "Toronto Raptors", abbr: "TOR" },
  { id: "29", name: "Memphis Grizzlies", abbr: "MEM" },
  { id: "30", name: "Charlotte Hornets", abbr: "CHA" },
]

const Onboarding = ({ onComplete }) => {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  const handleDone = () => {
    if (selected) {
      const logo = `https://a.espncdn.com/i/teamlogos/nba/500/${selected.abbr.toLowerCase()}.png`
      localStorage.setItem("favoriteTeam", selected.name)
      localStorage.setItem("favoriteTeamLogo", logo)
    }
    localStorage.setItem("onboardingDone", "true")
    onComplete()
    navigate("/home")
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-box">
        <h1 className="onboarding-title">🏀 Welcome to HoopCast</h1>
        <p className="onboarding-sub">Pick your favorite team to get started</p>

        <div className="onboarding-grid">
          {NBA_TEAMS.map((team) => {
            const logo = `https://a.espncdn.com/i/teamlogos/nba/500/${team.abbr.toLowerCase()}.png`
            return (
              <button
                key={team.id}
                className={`onboarding-team ${selected?.id === team.id ? "selected" : ""}`}
                onClick={() => setSelected(team)}
              >
                <img src={logo} alt={team.name} className="onboarding-logo" />
                <span className="onboarding-name">{team.name}</span>
              </button>
            )
          })}
        </div>

        <div className="onboarding-actions">
          <button className="onboarding-btn" onClick={handleDone}>
            {selected ? `Go with ${selected.name} →` : "Skip for now →"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
