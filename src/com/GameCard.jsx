import React, { useState } from "react"
import { Link } from "react-router-dom"
import { BookmarkIcon, StarIcon, ShareIcon } from "./Icons"

export const getGameStatus = (game) => {
  const statusName = game.competitions?.[0]?.status?.type?.name
  if (statusName === "STATUS_IN_PROGRESS" || statusName === "STATUS_HALFTIME" || statusName === "STATUS_END_PERIOD") return "live"
  if (statusName === "STATUS_FINAL") return "final"
  return "upcoming"
}

const STATUS_LABEL = { live: "LIVE", final: "FINAL", upcoming: "UPCOMING" }

// ESPN lists competitors with a homeAway field; fall back to array order.
export const getTeams = (game) => {
  const comps = game.competitions?.[0]?.competitors ?? []
  const home = comps.find((c) => c.homeAway === "home") ?? comps[0]
  const away = comps.find((c) => c.homeAway === "away") ?? comps[1]
  return { home, away }
}

export const getStatusDetail = (game) => {
  const status = getGameStatus(game)
  if (status === "upcoming") {
    return new Date(game.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }
  return game.competitions?.[0]?.status?.type?.shortDetail ?? STATUS_LABEL[status]
}

export const StatusPill = ({ status }) => (
  <span className={`hc-pill hc-pill--${status}`}>
    {status === "live" && <span className="hc-pill__dot" />}
    {STATUS_LABEL[status]}
  </span>
)

const TeamRow = ({ comp, side, status, otherScore }) => {
  const score = status === "upcoming" ? "" : comp.score
  const losing = status !== "upcoming" && Number(comp.score) < Number(otherScore)
  return (
    <div className="hc-card__team">
      <img className="hc-card__logo" src={comp.team.logo} alt="" loading="lazy" />
      <div className="hc-card__team-text">
        <span className="hc-card__team-name">{comp.team.displayName}</span>
        <span className="hc-card__team-meta">
          {comp.records?.[0]?.summary ? `${comp.records[0].summary} · ` : ""}{side}
        </span>
      </div>
      <span className={`hc-card__score${losing ? " is-losing" : ""}`}>{score}</span>
    </div>
  )
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
  const [copied, setCopied] = useState(false)
  const { home, away } = getTeams(gameDetails)
  const status = getGameStatus(gameDetails)
  const isConfirming = confirmRemoveId === cardId

  const isHomeFav = favoriteTeam === home.team.displayName
  const isAwayFav = favoriteTeam === away.team.displayName
  const isFav = isHomeFav || isAwayFav

  const dateLabel = new Date(gameDetails.date).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  })
  const venue = gameDetails.competitions?.[0]?.venue?.fullName

  const handleShare = () => {
    const url = `${window.location.origin}/HoopCast/game/${gameDetails.id}`
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <article className={`hc-card hc-card--${status}${isFav ? " is-fav" : ""}`}>
      <div className="hc-card__top">
        <StatusPill status={status} />
        <span className="hc-card__detail">{getStatusDetail(gameDetails)}</span>
        <div className="hc-card__actions">
          {onFavorite && (
            <button
              type="button"
              className={`hc-icon-btn${isFav ? " is-on" : ""}`}
              aria-label={isFav ? "Remove favorite team" : "Set favorite team"}
              aria-pressed={isFav}
              onClick={() => {
                const team = isHomeFav ? home : away
                onFavorite(isFav ? favoriteTeam : team.team.displayName, isFav ? "" : team.team.logo)
              }}
            >
              <StarIcon size={17} filled={isFav} />
            </button>
          )}
          {onSave && (
            <button
              type="button"
              className={`hc-icon-btn${isSaved ? " is-on" : ""}`}
              aria-label={isSaved ? "Saved" : "Save game"}
              aria-pressed={!!isSaved}
              onClick={onSave}
              disabled={isSaved}
            >
              <BookmarkIcon size={17} filled={isSaved} />
            </button>
          )}
          <button type="button" className="hc-icon-btn" aria-label="Copy game link" onClick={handleShare}>
            <ShareIcon size={17} />
          </button>
        </div>
      </div>

      <Link to={`/game/${gameDetails.id}`} className="hc-card__teams">
        <TeamRow comp={away} side="Away" status={status} otherScore={home.score} />
        <TeamRow comp={home} side="Home" status={status} otherScore={away.score} />
      </Link>

      <div className="hc-card__foot">
        <span className="hc-card__venue">{copied ? "Link copied" : venue ?? dateLabel}</span>
        {onRemove ? (
          isConfirming ? (
            <span className="hc-card__confirm">
              <button type="button" className="hc-link-btn hc-link-btn--danger" onClick={onConfirmRemove}>Remove</button>
              <button type="button" className="hc-link-btn" onClick={onCancelRemove}>Cancel</button>
            </span>
          ) : (
            <button type="button" className="hc-link-btn" onClick={onRemove}>Remove</button>
          )
        ) : !onSave ? (
          <Link to="/register" className="hc-card__more">Sign in to save</Link>
        ) : (
          <Link to={`/game/${gameDetails.id}`} className="hc-card__more">Game center →</Link>
        )}
      </div>
    </article>
  )
}

export default GameCard
