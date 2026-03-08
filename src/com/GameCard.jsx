import React from "react"
import { Link } from "react-router-dom"

const getStatusLabel = (game) => {
  const statusName = game.competitions?.[0]?.status?.type?.name
  if (statusName === "STATUS_IN_PROGRESS") return { label: "LIVE", color: "#e53e3e" }
  if (statusName === "STATUS_FINAL") return { label: "FINAL", color: "#718096" }
  return { label: "UPCOMING", color: "#38a169" }
}

const GameCard = ({
  gameDetails,
  onSave,
  onRemove,
  isSaved,
  confirmRemoveId,
  onConfirmRemove,
  onCancelRemove,
  cardId,
  favoriteTeam,
  onFavorite,
}) => {
  const home = gameDetails.competitions[0].competitors[0]
  const away = gameDetails.competitions[0].competitors[1]
  const status = getStatusLabel(gameDetails)
  const isConfirming = confirmRemoveId === cardId

  const isHomeFav = favoriteTeam === home.team.displayName
  const isAwayFav = favoriteTeam === away.team.displayName

  const getMonthAndDate = (isoDate) => {
    const dateObj = new Date(isoDate)
    const month = dateObj.toLocaleString("en-US", { month: "short" })
    const day = dateObj.toLocaleString("en-US", { weekday: "short" })
    const date = dateObj.getDate()
    return { month, day, date }
  }

  const { month, day, date } = getMonthAndDate(gameDetails.date)

  const handleShare = (e) => {
    e.preventDefault()
    const url = `${window.location.origin}${window.location.pathname}#/game/${gameDetails.id}`
    navigator.clipboard.writeText(url).then(() => {
      alert("Game link copied to clipboard!")
    })
  }

  return (
    <div className={`match ${isHomeFav || isAwayFav ? "fav-highlight" : ""}`}>

      {/* Top bar: status + favorite + share */}
      <div className="card-top-bar">
        <div className="game-status-badge" style={{ backgroundColor: status.color }}>
          {status.label}
        </div>
        <div className="card-actions">
          {onFavorite && (
            <button
              className="icon-btn"
              title={isHomeFav || isAwayFav ? "Remove favorite" : "Set as favorite team"}
              onClick={() => {
                const isFav = isHomeFav || isAwayFav
                const team = isHomeFav ? home : away
                onFavorite(
                  isFav ? favoriteTeam : team.team.displayName,
                  isFav ? "" : team.team.logo
                )
              }}
            >
              {isHomeFav || isAwayFav ? "⭐" : "☆"}
            </button>
          )}
          <button className="icon-btn" title="Share this game" onClick={handleShare}>
            🔗
          </button>
        </div>
      </div>

      {/* Clickable area — goes to game detail */}
      <Link to={`/game/${gameDetails.id}`} className="game-card-link">
        <div className="flags">
          <div className="home-flag">
            <img className="flag" src={home.team.logo} alt={`${home.team.displayName} Logo`} />
            <h3 className="home-team">{home.team.displayName}</h3>
            <p className="score">{home.score}</p>
          </div>
          <span className="vs">vs</span>
          <div className="away-flag">
            <img className="flag" src={away.team.logo} alt={`${away.team.displayName} Logo`} />
            <h3 className="away-team">{away.team.displayName}</h3>
            <p className="score">{away.score}</p>
          </div>
        </div>

        <div className="time-area">
          <div className="time">
            <h4 className="month">{month}</h4>
            <h4 className="day">{day}</h4>
            <h4 className="date">{date}</h4>
          </div>
          <h4 className="match-time">
            {new Date(gameDetails.date).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </h4>
        </div>
      </Link>

      {onSave && (
        <button className="save-btn" onClick={onSave} disabled={isSaved}>
          {isSaved ? "✓ Saved!" : "Save Game"}
        </button>
      )}

      {!onSave && !onRemove && (
        <Link to="/register" className="login-prompt-btn">
          Login to save this game
        </Link>
      )}

      {onRemove && (
        isConfirming ? (
          <div className="confirm-remove">
            <p>Remove this game?</p>
            <div className="confirm-btns">
              <button className="confirm-yes" onClick={onConfirmRemove}>Yes, Remove</button>
              <button className="confirm-no" onClick={onCancelRemove}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="remove-btn" onClick={onRemove}>Remove</button>
        )
      )}
    </div>
  )
}

export default GameCard
