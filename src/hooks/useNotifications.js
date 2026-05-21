import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../Firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

const useNotifications = () => {
  useEffect(() => {
    if (!("Notification" in window)) return

    let interval = null

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearInterval(interval)
      if (!user) return

      // Only ask for permission once the user is logged in
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }

      const checkGames = async () => {
        if (Notification.permission !== "granted") return

        try {
          const q = query(collection(db, "games"), where("userId", "==", user.uid))
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
      interval = setInterval(checkGames, 60000)
    })

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])
}

export default useNotifications
