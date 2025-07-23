import { useEffect, useState } from "react"

import { firestore } from "@/firebase/config"
import { collection, onSnapshot, query, where } from "firebase/firestore"

import { useAppSelector } from "@/redux/config"

export const useUnreadNotificationsCount = () => {
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)
  const uid = useAppSelector(({ user }) => user.uid)

  useEffect(() => {
    if (!uid) {
      return
    }

    const notificationsRef = query(
      collection(firestore, "users", uid, "notifications"),
      where("viewed", "==", false)
    )

    const removeNotificationsListener = onSnapshot(
      notificationsRef,
      (snapshot) => {
        const snapshotSize = snapshot.size

        setUnreadNotificationsCount(snapshotSize)
      }
    )

    return removeNotificationsListener
  }, [uid])

  return { unreadNotificationsCount }
}
