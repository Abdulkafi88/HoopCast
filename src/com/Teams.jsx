import React, { useState, useEffect, useRef } from "react"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "../Firebase"
import GameCard from "./GameCard"
import Skeleton from "./Skeleton"

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

const fetchDayGames = async (date) => {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${toESPNDate(date)}`
    )
    const data = await res.json()
    return data.events ?? []
  } catch {
    return []
  }
}

const TODAY = new Date()
const DATE_RANGE = buildDateRange()

const Teams = () => {
  const today = TODAY
  const dateRange = DATE_RANGE

  const [selectedDate, setSelectedDate] = useState(today)
  const [nba, setNba] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [savedIds, setSavedIds] = useState({})
  const [saveMessage, setSaveMessage] = useState("")
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([]) // [{date, games}]
  const [searchLoading, setSearchLoading] = useState(false)
  const [favoriteTeam, setFavoriteTeam] = useState(() => localStorage.getItem("favoriteTeam") ?? "")
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const intervalRef = useRef(null)
  const dateStripRef = useRef(null)
  const searchDebounceRef = useRef(null)

  const fetchGames = async (date, isInitial = false) => {
    try {
      const events = await fetchDayGames(date)
      setNba(events)
      setLastRefresh(new Date())
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

  // Fetch when selected date changes (only when not searching)
  useEffect(() => {
    if (search.trim()) return
    setLoading(true)
    setError(null)
    setNba([])
    fetchGames(selectedDate, true)
    fetchAlreadySaved()

    clearInterval(intervalRef.current)
    if (isSameDay(selectedDate, today)) {
      intervalRef.current = setInterval(() => fetchGames(selectedDate, false), 30000)
    }
    return () => clearInterval(intervalRef.current)
  }, [selectedDate, search])

  // Scroll selected date into view
  useEffect(() => {
    if (dateStripRef.current) {
      const active = dateStripRef.current.querySelector(".date-pill.active")
      if (active) active.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" })
    }
  }, [selectedDate])

  // Search across all 14 dates when query changes
  useEffect(() => {
    clearTimeout(searchDebounceRef.current)
    if (!search.trim()) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    searchDebounceRef.current = setTimeout(async () => {
      const results = await Promise.all(
        dateRange.map(async (date) => {
          const games = await fetchDayGames(date)
          const matched = games.filter((game) => {
            const home = game.competitions[0].competitors[0].team.displayName.toLowerCase()
            const away = game.competitions[0].competitors[1].team.displayName.toLowerCase()
            return home.includes(search.toLowerCase()) || away.includes(search.toLowerCase())
          })
          return { date, games: matched }
        })
      )
      setSearchResults(results.filter((r) => r.games.length > 0))
      setSearchLoading(false)
    }, 400)
    return () => clearTimeout(searchDebounceRef.current)
  }, [search])

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
  const isSearching = search.trim().length > 0

  const formatDateLabel = (date) => {
    if (isSameDay(date, today)) return "Today"
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  }

  return (
    <div className="content-holders">
      {/* Date strip — hidden while searching */}
      {!isSearching && (
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
      )}

      <div className="teams-header">
        <input
          className="search-input"
          type="text"
          placeholder="Search past & upcoming games by team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {saveMessage && <p className="save-toast">{saveMessage}</p>}
        {!isSearching && isToday && (
          <span className="refresh-label">
            Auto-refreshes every 30s · Last: {lastRefresh.toLocaleTimeString()}
          </span>
        )}
        {!isSearching && isPast && <span className="refresh-label past-label">Past games</span>}
        {!isSearching && !isToday && !isPast && (
          <span className="refresh-label upcoming-label">Upcoming games</span>
        )}
        {isSearching && (
          <span className="refresh-label" style={{ color: "#5c48ee" }}>
            Searching across past &amp; upcoming games...
          </span>
        )}
      </div>

      {favoriteTeam && !isSearching && (
        <p className="fav-label">
          ⭐ Showing <strong>{favoriteTeam}</strong> games first
          <button className="clear-fav" onClick={() => handleFavorite(favoriteTeam, "")}>
            Clear
          </button>
        </p>
      )}

      {/* Search results across all dates */}
      {isSearching ? (
        searchLoading ? (
          <div className="matchs">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : searchResults.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777", marginTop: "2rem" }}>
            No games found for &ldquo;{search}&rdquo; in the past or upcoming week.
          </p>
        ) : (
          searchResults.map(({ date, games }) => (
            <div key={toESPNDate(date)} className="search-date-group">
              <h3 className="search-date-label">
                {formatDateLabel(date)}
                <span className={`search-date-tag ${date > today && !isSameDay(date, today) ? "upcoming" : date < today ? "past" : "today"}`}>
                  {isSameDay(date, today) ? "Today" : date > today ? "Upcoming" : "Past"}
                </span>
              </h3>
              <div className="matchs">
                {games.map((game, i) => (
                  <GameCard
                    key={i}
                    gameDetails={game}
                    isSaved={!!savedIds[game.id]}
                    onSave={auth.currentUser ? () => handleSaveGame(game) : null}
                    favoriteTeam={favoriteTeam}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            </div>
          ))
        )
      ) : (
        /* Normal single-date view */
        <div className="matchs" id="match-date">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
          ) : error ? (
            <p style={{ color: "red", gridColumn: "1/-1" }}>{error}</p>
          ) : sortedGames.length === 0 ? (
            <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#777" }}>
              {isPast
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
      )}
    </div>
  )
}

export default Teams
