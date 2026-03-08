import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"
import { auth, db } from "../Firebase"
import GameCard from "./GameCard"
import Skeleton from "./Skeleton"

const Savegames = () => {
  const [savedGames, setSavedGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmRemoveId, setConfirmRemoveId] = useState(null)

  useEffect(() => {
    fetchSavedGames()
  }, [])

  const fetchSavedGames = async () => {
    try {
      if (auth.currentUser) {
        const q = query(
          collection(db, "games"),
          where("userId", "==", auth.currentUser.uid)
        )
        const querySnapshot = await getDocs(q)
        const arr = []
        querySnapshot.forEach((docSnap) => {
          const value = docSnap.data()
          arr.push({ ...value.game, docId: docSnap.id })
        })
        setSavedGames(arr)
      } else {
        setError("You must be logged in to see saved games.")
      }
    } catch (err) {
      setError("Failed to load saved games.")
    } finally {
      setLoading(false)
    }
  }

  const removeFromSaved = async (docId) => {
    try {
      await deleteDoc(doc(db, "games", docId))
      setSavedGames((prev) => prev.filter((g) => g.docId !== docId))
      setConfirmRemoveId(null)
    } catch (err) {
      console.error("Error removing game:", err.message)
    }
  }

  return (
    <div className="content-holders">
      <Link to="/teams" className="back-link">
        Back to Teams
      </Link>
      <div className="matchs" id="match-date">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
        ) : error ? (
          <p style={{ color: "red", gridColumn: "1/-1" }}>{error}</p>
        ) : savedGames.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#777" }}>
            No saved games yet. Go to <Link to="/teams">Teams</Link> to save some!
          </p>
        ) : (
          savedGames.map((gameDetails, index) => (
            <GameCard
              key={index}
              cardId={gameDetails.docId}
              gameDetails={gameDetails}
              confirmRemoveId={confirmRemoveId}
              onRemove={() => setConfirmRemoveId(gameDetails.docId)}
              onConfirmRemove={() => removeFromSaved(gameDetails.docId)}
              onCancelRemove={() => setConfirmRemoveId(null)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Savegames
