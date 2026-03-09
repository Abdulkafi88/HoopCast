import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

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

const GlobalSearch = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)

    if (!val.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    // Team matches (instant)
    const teamMatches = NBA_TEAMS
      .filter((t) => t.name.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 3)
      .map((t) => ({ type: "team", ...t }))

    setResults(teamMatches)
    setOpen(true)

    // Player search (debounced)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (val.length < 3) return
      setLoading(true)
      try {
        const teamIds = Array.from({ length: 30 }, (_, i) => i + 1)
        const responses = await Promise.all(
          teamIds.map((id) =>
            fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${id}/roster`)
              .then((r) => r.json())
              .catch(() => ({ athletes: [] }))
          )
        )
        const allPlayers = responses.flatMap((data) => data.athletes ?? [])
        const players = allPlayers
          .filter((p) => p.fullName.toLowerCase().includes(val.toLowerCase()))
          .slice(0, 5)
          .map((p) => ({ type: "player", id: p.id, name: p.fullName, player: p }))
        setResults([...teamMatches, ...players])
      } catch (err) {}
      setLoading(false)
    }, 400)
  }

  const handleSelect = (item) => {
    setQuery("")
    setOpen(false)
    if (item.type === "team") {
      navigate(`/team/${item.id}`)
    } else {
      navigate(`/player/${item.id}`, { state: { player: item.player } })
    }
  }

  return (
    <div className="global-search" ref={wrapperRef}>
      <input
        className="global-search-input"
        type="text"
        placeholder="Search teams or players..."
        value={query}
        onChange={handleChange}
        onFocus={() => query && setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="global-search-dropdown">
          {results.map((item, i) => (
            <button key={i} className="search-result-item" onClick={() => handleSelect(item)}>
              <span className="search-result-type">{item.type === "team" ? "🏀 Team" : "👤 Player"}</span>
              <span className="search-result-name">{item.name}</span>
            </button>
          ))}
          {loading && <p className="search-loading">Searching players...</p>}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
