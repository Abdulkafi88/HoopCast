// Savegames.jsx
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

  return (
    <div className="content-holders">
      <div className="matchs" id="match-date">
        {savedGames.map(async (gameId, index) => {
          try {
            const gameDocRef = doc(db, "games", gameId)
            const gameDocSnap = await getDoc(gameDocRef)

            if (gameDocSnap.exists()) {
              const game = gameDocSnap.data()

              return (
                <div className="match" key={index}>
                  <div className="flags">
                    <div className="home-flag">
                      <img
                        className="flag"
                        src={game.team1?.logo}
                        alt={`${game.team1?.displayName} Logo`}
                      />
                      <h3 className="home-team">{game.team1?.displayName}</h3>
                      <p className="score">{game.team1?.score}</p>
                    </div>
                    <span className="vs">vs</span>
                    <div className="away-flag">
                      <img
                        className="flag"
                        src={game.team2?.logo}
                        alt={`${game.team2?.displayName} Logo`}
                      />
                      <h3 className="home-team">{game.team2?.displayName}</h3>
                      <p className="score">{game.team2?.score}</p>
                    </div>
                  </div>
                  <div className="time-area">
                    <div className="time">
                      <h4 className="month">Month</h4>
                      <h4 className="day">Day</h4>
                      <h4 className="date">Date</h4>
                    </div>
                    <h4 className="match-time">Time</h4>
                  </div>
                  <button disabled>Save Games</button>
                </div>
              )
            }
          } catch (error) {
            console.error("Error fetching game details:", error.message)
          }

          return null
        })}
      </div>
      <Link to="/teams" className="back-link">
        Back to Teams
      </Link>
    </div>
  )
}

export default Savegames
