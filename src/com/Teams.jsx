// Teams.jsx
import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getDoc, doc, updateDoc } from "firebase/firestore"
import { auth, db } from "../Firebase"

const Teams = () => {
  const [nba, setNba] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getTeamInfo = async () => {
      try {
        const res = await fetch(
          "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
        )
        const data = await res.json()

        if (data.events) {
          setNba(data.events)
        }
      } catch (error) {
        console.error("Error fetching data:", error.message)
      }
    }

    getTeamInfo()
  }, [])

  const handleSaveGame = async (userId, gameId) => {
    try {
      const userDocRef = doc(db, "users", userId)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        const savedGames = [...userDocSnap.data().savedGames, gameId]

        // Save the game details to the "games" collection
        const gameDocRef = doc(db, "games", gameId)
        await updateDoc(gameDocRef, {
          team1: {
            logo: nba[gameId].competitions[0].competitors[0].team.logo,
            displayName:
              nba[gameId].competitions[0].competitors[0].team.displayName,
            score: nba[gameId].competitions[0].competitors[0].score,
          },
          team2: {
            logo: nba[gameId].competitions[0].competitors[1].team.logo,
            displayName:
              nba[gameId].competitions[0].competitors[1].team.displayName,
            score: nba[gameId].competitions[0].competitors[1].score,
          },
          date: nba[gameId].date,
        })

        // Update the user's savedGames array
        await updateDoc(userDocRef, {
          savedGames,
        })

        // After saving the game, navigate to the Savegames route
        navigate("/Savegames")
      }
    } catch (error) {
      console.error("Error saving game:", error.message)
    }
  }

  const getMonthAndDate = (isoDate) => {
    const dateObj = new Date(isoDate)
    const month = dateObj.toLocaleString("en-US", { month: "short" })
    const day = dateObj.toLocaleString("en-US", { weekday: "short" })
    const date = dateObj.getDate()
    return { month, day, date }
  }

  return (
    <div className="content-holders">
      <div className="matchs" id="match-date">
        {nba.map((teams, index) => (
          <div className="match" key={index}>
            <div className="flags">
              <div className="home-flag">
                <img
                  className="flag"
                  src={teams.competitions[0].competitors[0].team.logo}
                  alt={`${teams.competitions[0].competitors[0].team.displayName} Logo`}
                />
                <h3 className="home-team">
                  {teams.competitions[0].competitors[0].team.displayName}
                </h3>
                <p className="score">
                  {teams.competitions[0].competitors[0].score}
                </p>
              </div>
              <span className="vs">vs</span>
              <div className="away-flag">
                <img
                  className="flag"
                  src={teams.competitions[0].competitors[1].team.logo}
                  alt={`${teams.competitions[0].competitors[1].team.displayName} Logo`}
                />
                <h3 className="home-team">
                  {teams.competitions[0].competitors[1].team.displayName}
                </h3>
                <p className="score">
                  {teams.competitions[0].competitors[1].score}
                </p>
              </div>
            </div>
            <div className="time-area">
              <div className="time">
                <h4 className="month">{getMonthAndDate(teams.date).month}</h4>
                <h4 className="day">{getMonthAndDate(teams.date).day}</h4>
                <h4 className="date">{getMonthAndDate(teams.date).date}</h4>
              </div>
              <h4 className="match-time">{teams.date.slice(11, 16)}</h4>
            </div>
            <button
              onClick={() =>
                auth.currentUser && handleSaveGame(auth.currentUser.uid, index)
              }
            >
              Save Games
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Teams
    