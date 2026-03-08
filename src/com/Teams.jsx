import React, { useState, useEffect, useRef } from "react"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "../Firebase"
import GameCard from "./GameCard"
import Skeleton from "./Skeleton"

const Teams = () => {
  const [nba, setNba] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [savedIds, setSavedIds] = useState({})
  const [saveMessage, setSaveMessage] = useState("")
  const [search, setSearch] = useState("")
  const [favoriteTeam, setFavoriteTeam] = useState(() => localStorage.getItem("favoriteTeam") ?? "")
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const intervalRef = useRef(null)

  const fetchGames = async (isInitial = false) => {
    try {
      const res = await fetch(
        "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
      )
      const data = await res.json()
      if (data.events) {
        setNba(data.events)
        setLastRefresh(new Date())
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

  useEffect(() => {
    fetchGames(true)
    fetchAlreadySaved()

    // Auto-refresh every 30 seconds
    intervalRef.current = setInterval(() => fetchGames(false), 30000)
    return () => clearInterval(intervalRef.current)
  }, [])

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

  return (
    <div className="content-holders">
      <div className="teams-header">
        <input
          className="search-input"
          type="text"
          placeholder="Search by team name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {saveMessage && <p className="save-toast">{saveMessage}</p>}
        <span className="refresh-label">
          Auto-refreshes every 30s · Last: {lastRefresh.toLocaleTimeString()}
        </span>
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
            {search ? `No games found for "${search}"` : "No games scheduled today. Check back later!"}
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
