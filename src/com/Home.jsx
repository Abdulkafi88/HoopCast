import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import usePageTitle from "../hooks/usePageTitle"
import { getGameStatus, getTeams, getStatusDetail, StatusPill } from "./GameCard"
import { ArrowRightIcon, StarIcon } from "./Icons"

const WESTERN_TEAMS = new Set([
  "OKC", "HOU", "LAL", "DEN", "LAC", "MIN", "GS", "MEM",
  "SAC", "DAL", "PHX", "POR", "SA", "NO", "UTAH",
])

const STATUS_ORDER = { live: 0, upcoming: 1, final: 2 }

const pickFeatured = (games, favoriteTeam) => {
  if (!games.length) return null
  const hasFav = (g) => {
    const { home, away } = getTeams(g)
    return [home.team.displayName, away.team.displayName].includes(favoriteTeam)
  }
  return [...games].sort((a, b) => {
    if (favoriteTeam && hasFav(a) !== hasFav(b)) return hasFav(b) - hasFav(a)
    return STATUS_ORDER[getGameStatus(a)] - STATUS_ORDER[getGameStatus(b)]
  })[0]
}

const StripGame = ({ game }) => {
  const { home, away } = getTeams(game)
  const status = getGameStatus(game)
  const row = (c, other) => (
    <span className="hc-strip__row">
      <img src={c.team.logo} alt="" className="hc-strip__logo" loading="lazy" />
      <span className="hc-strip__abbr">{c.team.abbreviation}</span>
      <span className="hc-strip__rec">{c.records?.[0]?.summary}</span>
      <span className={`hc-strip__score${status !== "upcoming" && Number(c.score) < Number(other.score) ? " is-losing" : ""}`}>
        {status === "upcoming" ? "" : c.score}
      </span>
    </span>
  )
  return (
    <Link to={`/game/${game.id}`} className="hc-strip__game">
      <span className="hc-strip__top">
        <StatusPill status={status} />
        <span className="hc-strip__detail">{getStatusDetail(game)}</span>
      </span>
      {row(away, home)}
      {row(home, away)}
    </Link>
  )
}

const FeaturedGame = ({ game }) => {
  const { home, away } = getTeams(game)
  const status = getGameStatus(game)
  const showScore = status !== "upcoming"
  const lines = [away, home].map((c) => ({
    abbr: c.team.abbreviation,
    periods: (c.linescores ?? []).map((l) => l.value ?? l.displayValue),
    total: c.score,
  }))
  const periodCount = Math.max(...lines.map((l) => l.periods.length), 0)
  const venue = game.competitions?.[0]?.venue?.fullName

  const side = (c, label, align) => (
    <div className={`hc-feature__team hc-feature__team--${align}`}>
      <img src={c.team.logo} alt="" className="hc-feature__logo" />
      <div>
        <div className="hc-feature__city">{c.team.location}</div>
        <div className="hc-feature__name">{c.team.name ?? c.team.shortDisplayName}</div>
        <div className="hc-feature__meta">{c.records?.[0]?.summary ? `${c.records[0].summary} · ` : ""}{label}</div>
      </div>
    </div>
  )

  return (
    <section className={`hc-panel hc-feature hc-feature--${status}`} aria-label="Featured game">
      <div className="hc-feature__head">
        <StatusPill status={status} />
        <span className="hc-feature__detail">{getStatusDetail(game)}</span>
        {venue && <span className="hc-feature__venue">{venue}</span>}
      </div>

      <div className="hc-feature__body">
        {side(away, "Away", "left")}
        <div className="hc-feature__score">
          {showScore ? (
            <>
              <span className={Number(away.score) < Number(home.score) ? "is-losing" : ""}>{away.score}</span>
              <span className="hc-feature__dash">–</span>
              <span className={Number(home.score) < Number(away.score) ? "is-losing" : ""}>{home.score}</span>
            </>
          ) : (
            <span className="hc-feature__vs">VS</span>
          )}
        </div>
        {side(home, "Home", "right")}
      </div>

      <div className="hc-feature__foot">
        {periodCount > 0 ? (
          <div className="hc-table-scroll">
            <table className="hc-linescore">
              <thead>
                <tr>
                  <th scope="col">Team</th>
                  {Array.from({ length: periodCount }).map((_, i) => (
                    <th scope="col" key={i}>{i < 4 ? `Q${i + 1}` : `OT${i - 3}`}</th>
                  ))}
                  <th scope="col">T</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.abbr}>
                    <th scope="row">{l.abbr}</th>
                    {Array.from({ length: periodCount }).map((_, i) => <td key={i}>{l.periods[i] ?? "-"}</td>)}
                    <td className="hc-linescore__total">{l.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <span className="hc-muted">Tip-off {new Date(game.date).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })}</span>
        )}
        <Link to={`/game/${game.id}`} className="hc-btn hc-btn--primary hc-btn--lg">
          Open game center <ArrowRightIcon size={16} />
        </Link>
      </div>
    </section>
  )
}

const MiniStandings = ({ rows, loading }) => (
  <aside className="hc-panel hc-mini-standings" aria-labelledby="mini-stand-h">
    <div className="hc-section-head">
      <h2 id="mini-stand-h" className="hc-h2">East standings</h2>
      <Link to="/standings" className="hc-more">All →</Link>
    </div>
    <div className="hc-mini-standings__head">
      <span>#</span><span>Team</span><span>W–L</span><span>GB</span>
    </div>
    {loading
      ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="hc-mini-standings__row hc-shimmer" />)
      : rows.map((t) => (
          <Link to={`/team/${t.team.id}`} key={t.team.id} className="hc-mini-standings__row">
            <span className="hc-muted">{t.seed}</span>
            <span className="hc-mini-standings__team">
              <img src={t.team.logos?.[0]?.href} alt="" />
              {t.team.shortDisplayName}
            </span>
            <span>{t.wins}–{t.losses}</span>
            <span className="hc-muted">{t.gb}</span>
          </Link>
        ))}
    <Link to="/teams" className="hc-tip">
      <StarIcon size={20} />
      <span>Star a team on the Games page to pin its games here.</span>
    </Link>
  </aside>
)

const NewsSkeleton = () => (
  <div className="hc-news">
    <div className="hc-news__lead hc-shimmer" style={{ aspectRatio: "16 / 9" }} />
    <div className="hc-news__list">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="hc-news__item hc-shimmer" style={{ height: 70 }} />)}
    </div>
  </div>
)

const Home = () => {
  const [games, setGames] = useState([])
  const [gamesLoading, setGamesLoading] = useState(true)
  const [east, setEast] = useState([])
  const [standingsLoading, setStandingsLoading] = useState(true)
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState(false)
  const favoriteTeam = localStorage.getItem("favoriteTeam") ?? ""
  usePageTitle("Home")

  useEffect(() => {
    let timer
    const fetchScores = async () => {
      try {
        const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard")
        const data = await res.json()
        setGames(data.events ?? [])
      } catch {
        // keep whatever we had
      } finally {
        setGamesLoading(false)
      }
    }
    fetchScores()
    timer = setInterval(fetchScores, 30000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch("https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings?region=us&lang=en&type=0&level=1")
        const data = await res.json()
        const rows = (data?.standings?.entries ?? []).map((entry) => {
          const stats = {}
          entry.stats.forEach((s) => { stats[s.name] = s.displayValue })
          return {
            team: entry.team,
            wins: stats.wins ?? "-",
            losses: stats.losses ?? "-",
            gb: stats.gamesBehind ?? "-",
            seed: parseInt(stats.playoffSeed ?? "99"),
          }
        })
        setEast(rows.filter((r) => !WESTERN_TEAMS.has(r.team.abbreviation)).sort((a, b) => a.seed - b.seed).slice(0, 6))
      } catch {
        setEast([])
      } finally {
        setStandingsLoading(false)
      }
    }
    fetchStandings()
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=5")
        const data = await res.json()
        setNews(data.articles ?? [])
      } catch {
        setNewsError(true)
      } finally {
        setNewsLoading(false)
      }
    }
    fetchNews()
  }, [])

  const featured = pickFeatured(games, favoriteTeam)
  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  const sortedStrip = [...games].sort((a, b) => STATUS_ORDER[getGameStatus(a)] - STATUS_ORDER[getGameStatus(b)])
  const [lead, ...rest] = news
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <main className="hc-page">
      <section aria-labelledby="today-h" className="hc-stack">
        <div className="hc-section-head">
          <h2 id="today-h" className="hc-h2">Today <span className="hc-muted">· {todayLabel}</span></h2>
          <Link to="/teams" className="hc-more">Full schedule →</Link>
        </div>
        <div className="hc-strip">
          {gamesLoading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="hc-strip__game hc-shimmer" style={{ height: 118 }} />)
            : games.length === 0
            ? <p className="hc-empty">No games today. <Link to="/teams">See the schedule</Link>.</p>
            : sortedStrip.map((g) => <StripGame key={g.id} game={g} />)}
        </div>
      </section>

      <div className="hc-home-grid">
        {gamesLoading ? (
          <section className="hc-panel hc-feature hc-shimmer" style={{ minHeight: 360 }} aria-hidden="true" />
        ) : featured ? (
          <FeaturedGame game={featured} />
        ) : (
          <section className="hc-panel hc-feature hc-feature--empty">
            <h1 className="hc-feature__empty-title">Live NBA scores, standings and stats</h1>
            <p className="hc-muted">There are no games today. Browse the schedule to see what's coming up.</p>
            <Link to="/teams" className="hc-btn hc-btn--primary hc-btn--lg">See the schedule <ArrowRightIcon size={16} /></Link>
          </section>
        )}
        <MiniStandings rows={east} loading={standingsLoading} />
      </div>

      <section aria-labelledby="news-h" className="hc-stack">
        <h2 id="news-h" className="hc-h2">Latest news</h2>
        {newsLoading ? (
          <NewsSkeleton />
        ) : newsError || !lead ? (
          <p className="hc-empty">Couldn't load NBA news. Check your connection and refresh.</p>
        ) : (
          <div className="hc-news">
            <a href={lead.links?.web?.href ?? "#"} target="_blank" rel="noopener noreferrer" className="hc-news__lead">
              {lead.images?.[0]?.url && <img src={lead.images[0].url} alt="" className="hc-news__lead-img" />}
              <span className="hc-news__tag">TOP STORY</span>
              <span className="hc-news__lead-title">{lead.headline}</span>
              {lead.description && <span className="hc-news__desc">{lead.description}</span>}
              <span className="hc-news__date">{fmtDate(lead.published)}</span>
            </a>
            <div className="hc-news__list">
              {rest.map((a) => (
                <a key={a.id} href={a.links?.web?.href ?? "#"} target="_blank" rel="noopener noreferrer" className="hc-news__item">
                  {a.images?.[0]?.url ? <img src={a.images[0].url} alt="" loading="lazy" /> : <span className="hc-news__thumb" />}
                  <span className="hc-news__item-text">
                    <span className="hc-news__item-title">{a.headline}</span>
                    <span className="hc-news__date">{fmtDate(a.published)}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Home
