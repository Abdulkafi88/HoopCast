import React, { useState, useEffect } from "react"
import img1 from '../assets/nikola.png'
import pg13 from '../assets/pg-13.png'
import { Link } from "react-router-dom"

const Home = () => {
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=6")
        const data = await res.json()
        setNews(data.articles ?? [])
      } catch (err) {
        // silently fail
      }
    }
    fetchNews()
  }, [])

  return (
    <>
      <section className="container">
        <div className="content__container">
          <h1>
            Love Basketball? <br />
            <span className="heading__1">Stay in the Game</span>
            <br />
            <span className="heading__2">with Our Latest NBA News Updates! 🏀🔥</span>
          </h1>
          <p>
            Catch every slam dunk and clutch shot live!
            Our website keeps you on the edge of your seat with up-to-the-minute NBA game updates.
            Click below to dive into the excitement and stay ahead of the game 🏀🔥
          </p>
          <Link to={'/teams'} className="get-info">View Today's Games</Link>
        </div>
        <div className="image__container">
          <img src={img1} alt="header" />
          <img src={pg13} alt="header" />
          <div className="image__content">
            <ul>
              <li>Daily NBA Games! 🏀📰</li>
              <li>Your Quick Live Scores! 🏀🚀</li>
            </ul>
          </div>
        </div>
      </section>

      {news.length > 0 && (
        <section className="news-section content-holders">
          <h2 className="news-title">Latest NBA News</h2>
          <div className="news-grid">
            {news.map((article) => (
              <a
                key={article.id}
                href={article.links?.web?.href ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card"
              >
                {article.images?.[0]?.url && (
                  <img
                    src={article.images[0].url}
                    alt={article.headline}
                    className="news-img"
                  />
                )}
                <div className="news-body">
                  <h3 className="news-headline">{article.headline}</h3>
                  <p className="news-desc">{article.description}</p>
                  <span className="news-date">
                    {new Date(article.published).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default Home
