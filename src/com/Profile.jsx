import React, { useState, useEffect } from "react"
import { auth, db } from "../Firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const [savedCount, setSavedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = auth.currentUser
  const favoriteTeam = localStorage.getItem("favoriteTeam") || null
  const favoriteLogo = localStorage.getItem("favoriteTeamLogo") || null

  useEffect(() => {
    const fetchCount = async () => {
      if (!user) return
      try {
        const q = query(collection(db, "games"), where("userId", "==", user.uid))
        const snap = await getDocs(q)
        setSavedCount(snap.size)
      } catch (err) {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchCount()
  }, [user])

  const handleSignOut = async () => {
    await signOut(auth)
    navigate("/home")
  }

  if (!user) {
    return (
      <div className="content-holders" style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>You are not logged in.</h2>
        <button onClick={() => navigate("/register")} style={{ marginTop: "1rem" }}>
          Go to Login
        </button>
      </div>
    )
  }

  const joinDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      })
    : "-"

  return (
    <div className="content-holders profile-page">
      <h2 className="page-title">My Profile</h2>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.email?.[0]?.toUpperCase()}
        </div>
        <div className="profile-info">
          <h3 className="profile-email">{user.email}</h3>
          <p className="profile-joined">Member since {joinDate}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat-box">
          <span className="profile-stat-val">{loading ? "..." : savedCount}</span>
          <span className="profile-stat-lbl">Saved Games</span>
        </div>
        <div className="profile-stat-box">
          {favoriteLogo ? (
            <img src={favoriteLogo} alt={favoriteTeam} style={{ width: "40px", height: "40px", objectFit: "contain" }} />
          ) : (
            <span className="profile-stat-val">-</span>
          )}
          <span className="profile-stat-lbl">{favoriteTeam ?? "No Favorite Team"}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={() => navigate("/savegames")} className="profile-btn">
          View Saved Games
        </button>
        <button onClick={() => navigate("/teams")} className="profile-btn">
          Browse Games
        </button>
        <button onClick={handleSignOut} className="profile-btn danger">
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile
