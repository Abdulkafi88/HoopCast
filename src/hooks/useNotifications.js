import { useEffect } from "react"
import { auth, db } from "../Firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

const useNotifications = () => {
  useEffect(() => {
    if (!("Notification" in window)) return
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }

    const checkGames = async () => {
      if (Notification.permission !== "granted") return
      if (!auth.currentUser) return

      try {
        const q = query(collection(db, "games"), where("userId", "==", auth.currentUser.uid))
        const snap = await getDocs(q)
        const now = new Date()

        snap.forEach((doc) => {
          const game = doc.data().game
          if (!game?.date) return
          const gameTime = new Date(game.date)
          const diffMin = (gameTime - now) / 60000

          if (diffMin > 0 && diffMin <= 60) {
            const home = game.competitions?.[0]?.competitors?.[0]?.team?.displayName ?? "Home"
            const away = game.competitions?.[0]?.competitors?.[1]?.team?.displayName ?? "Away"
            const minsLeft = Math.round(diffMin)
            new Notification("🏀 HoopCast — Game Starting Soon!", {
              body: `${away} vs ${home} starts in ${minsLeft} minute${minsLeft !== 1 ? "s" : ""}!`,
              icon: "/HoopCast/basketball.png",
            })
          }
        })
      } catch (err) {
        console.error("Notification check failed:", err)
      }
    }

    checkGames()
    const interval = setInterval(checkGames, 60000)
    return () => clearInterval(interval)
  }, [])
}

export default useNotifications
