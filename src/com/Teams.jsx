import React, { useState, useEffect, useRef } from "react"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "../Firebase"
import GameCard from "./GameCard"
import Skeleton from "./Skeleton"

// Build a list of dates: 7 days back, today, 7 days ahead
const buildDateRange = () => {
  const dates = []
  const today = new Date()
  for (let i = -7; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d)
  }
  return dates
}

const toESPNDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}${m}${d}`
}

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const Teams = () => {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const [nba, setNba] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [savedIds, setSavedIds] = useState({})
  const [saveMessage, setSaveMessage] = useState("")
  const [search, setSearch] = useState("")
  const [favoriteTeam, setFavoriteTeam] = useState(() => localStorage.getItem("favoriteTeam") ?? "")
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const intervalRef = useRef(null)
  const dateStripRef = useRef(null)

  const dateRange = buildDateRange()

  const fetchGames = async (date, isInitial = false) => {
    try {
      const espnDate = toESPNDate(date)
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${espnDate}`
      )
      const data = await res.json()
      if (data.events) {
        setNba(data.events)
        setLastRefresh(new Date())
      } else {
        setNba([])
      }
    } catch (err) {
      if (isInitial) setError("Failed to load games. Please try again.")
    } finally {
      if (isInitial) setLoading(false)
    }
  }

  const fetchAlreadySaved = async () => {
    if (!auth.currentUser) return
    try {
      const q = query(collection(db, "games"), where("userId", "==", auth.currentUser.uid))
      const snapshot = await getDocs(q)
      const ids = {}
      snapshot.forEach((doc) => {
        const gameId = doc.data().game?.id
        if (gameId) ids[gameId] = true
      })
      setSavedIds(ids)
    } catch (err) {}
  }

  // Fetch when selected date changes
  useEffect(() => {
    setLoading(true)
    setError(null)
    setNba([])
    fetchGames(selectedDate, true)
    fetchAlreadySaved()

    // Auto-refresh only for today
    clearInterval(intervalRef.current)
    if (isSameDay(selectedDate, today)) {
      intervalRef.current = setInterval(() => fetchGames(selectedDate, false), 30000)
    }
    return () => clearInterval(intervalRef.current)
  }, [selectedDate])

  // Scroll selected date into view
  useEffect(() => {
    if (dateStripRef.current) {
      const active = dateStripRef.current.querySelector(".date-pill.active")
      if (active) active.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" })
    }
  }, [selectedDate])

  const handleSaveGame = async (game) => {
    if (!auth.currentUser || savedIds[game.id]) return
    try {
      await addDoc(collection(db, "games"), { game, userId: auth.currentUser.uid })
      setSavedIds((prev) => ({ ...prev, [game.id]: true }))
      setSaveMessage("Game saved!")
    } catch (err) {
      setSaveMessage("Failed to save game.")
    } finally {
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  const handleFavorite = (teamName, teamLogo) => {
    if (favoriteTeam === teamName) {
      setFavoriteTeam("")
      localStorage.removeItem("favoriteTeam")
      localStorage.removeItem("favoriteTeamLogo")
    } else {
      setFavoriteTeam(teamName)
      localStorage.setItem("favoriteTeam", teamName)
      localStorage.setItem("favoriteTeamLogo", teamLogo)
    }
  }

  const filteredGames = nba.filter((game) => {
    const home = game.competitions[0].competitors[0].team.displayName.toLowerCase()
    const away = game.competitions[0].competitors[1].team.displayName.toLowerCase()
    return home.includes(search.toLowerCase()) || away.includes(search.toLowerCase())
  })

  // Sort: favorite team games first
  const sortedGames = [...filteredGames].sort((a, b) => {
    const aHasFav = [
      a.competitions[0].competitors[0].team.displayName,
      a.competitions[0].competitors[1].team.displayName,
    ].includes(favoriteTeam)
    const bHasFav = [
      b.competitions[0].competitors[0].team.displayName,
      b.competitions[0].competitors[1].team.displayName,
    ].includes(favoriteTeam)
    return bHasFav - aHasFav
  })

  const isToday = isSameDay(selectedDate, today)
  const isPast = selectedDate < today && !isToday

  return (
    <div className="content-holders">
      {/* Date strip */}
      <div className="date-strip" ref={dateStripRef}>
        {dateRange.map((d, i) => {
          const isActive = isSameDay(d, selectedDate)
          const isT = isSameDay(d, today)
          const isPastDay = d < today && !isSameDay(d, today)
          return (
            <button
              key={i}
              className={`date-pill${isActive ? " active" : ""}${isPastDay ? " past" : ""}${isT ? " today" : ""}`}
              onClick={() => setSelectedDate(new Date(d))}
            >
              <span className="date-pill-day">
                {isT ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="date-pill-num">
                {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </button>
          )
        })}
      </div>

      <div className="teams-header">
        <input
          className="search-input"
          type="text"
          placeholder="Search by team name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {saveMessage && <p className="save-toast">{saveMessage}</p>}
        {isToday && (
          <span className="refresh-label">
            Auto-refreshes every 30s · Last: {lastRefresh.toLocaleTimeString()}
          </span>
        )}
        {isPast && (
          <span className="refresh-label past-label">Past games</span>
        )}
        {!isToday && !isPast && (
          <span className="refresh-label upcoming-label">Upcoming games</span>
        )}
      </div>

      {favoriteTeam && (
        <p className="fav-label">
          ⭐ Showing <strong>{favoriteTeam}</strong> games first
          <button className="clear-fav" onClick={() => handleFavorite(favoriteTeam, "")}>
            Clear
          </button>
        </p>
      )}

      <div className="matchs" id="match-date">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
        ) : error ? (
          <p style={{ color: "red", gridColumn: "1/-1" }}>{error}</p>
        ) : sortedGames.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#777" }}>
            {search
              ? `No games found for "${search}"`
              : isPast
              ? "No games were played on this day."
              : isToday
              ? "No games scheduled today. Check back later!"
              : "No games scheduled for this day yet."}
          </p>
        ) : (
          sortedGames.map((game, index) => (
            <GameCard
              key={index}
              gameDetails={game}
              isSaved={!!savedIds[game.id]}
              onSave={auth.currentUser ? () => handleSaveGame(game) : null}
              favoriteTeam={favoriteTeam}
              onFavorite={handleFavorite}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Teams
