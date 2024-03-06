import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { auth, db } from "../Firebase"

const Savegames = () => {
  const [savedGames, setSavedGames] = useState([])

  useEffect(() => {
    const fetchSavedGames = async () => {
      try {
        // Check if auth.currentUser is defined
        if (auth.currentUser) {
          const userDocRef = doc(db, "users", auth.currentUser.uid)
          const userDocSnap = await getDoc(userDocRef)

          if (userDocSnap.exists()) {
            setSavedGames(userDocSnap.data().savedGames || [])
          }
        }
      } catch (error) {
        console.error("Error fetching saved games:", error.message)
      }
    }

    fetchSavedGames()
  }, [])

  const fetchGameDetails = async (gameId) => {
    try {
      const res = await fetch(
        "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
      )
      const data = await res.json()

      if (data.events && data.events[gameId]) {
        return data.events[gameId]
      }
    } catch (error) {
      console.error("Error fetching game details from API:", error.message)
    }
    return null
  }

  const getMonthAndDate = (isoDate) => {
    const dateObj = new Date(isoDate)
    const month = dateObj.toLocaleString("en-US", { month: "short" })
    const day = dateObj.toLocaleString("en-US", { weekday: "short" })
    const date = dateObj.getDate()
    return { month, day, date }
  }

  const renderGameDetails = async (gameId, index) => {
    try {
      const gameDetails = await fetchGameDetails(gameId)

      if (gameDetails) {
        const monthAndDate = getMonthAndDate(gameDetails.date)

        return (
          <div className="match" key={index}>
            <div className="flags">
              <div className="home-flag">
                <img
                  className="flag"
                  src={gameDetails.competitions[0].competitors[0].team.logo}
                  alt={`${gameDetails.competitions[0].competitors[0].team.displayName} Logo`}
                />
                <h3 className="home-team">
                  {gameDetails.competitions[0].competitors[0].team.displayName}
                </h3>
                <p className="score">
                  {gameDetails.competitions[0].competitors[0].score}
                </p>
              </div>
              <span className="vs">vs</span>
              <div className="away-flag">
                <img
                  className="flag"
                  src={gameDetails.competitions[0].competitors[1].team.logo}
                  alt={`${gameDetails.competitions[0].competitors[1].team.displayName} Logo`}
                />
                <h3 className="home-team">
                  {gameDetails.competitions[0].competitors[1].team.displayName}
                </h3>
                <p className="score">
                  {gameDetails.competitions[0].competitors[1].score}
                </p>
              </div>
            </div>
            <div className="time-area">
              <div className="time">
                <h4 className="month">{monthAndDate.month}</h4>
                <h4 className="day">{monthAndDate.day}</h4>
                <h4 className="date">{monthAndDate.date}</h4>
              </div>
              <h4 className="match-time">{gameDetails.date.slice(11, 16)}</h4>
            </div>
            <button disabled>Save Games</button>
          </div>
        )
      }
    } catch (error) {
      console.error("Error fetching game details:", error.message)
    }

    return null
  }

  return (
    <div className="content-holders">
      <div className="matchs" id="match-date">
        {savedGames.map((gameId, index) => renderGameDetails(gameId, index))}
      </div>
      <Link to="/teams" className="back-link">
        Back to Teams
      </Link>
    </div>
  )
}

export default Savegames
