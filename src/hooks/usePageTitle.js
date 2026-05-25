import { useEffect } from "react"

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | HoopCast` : "HoopCast"
    return () => { document.title = "HoopCast" }
  }, [title])
}

export default usePageTitle
