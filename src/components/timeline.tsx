import { Unsubscribe, collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { db } from "../firebase"
import Tweet from "./tweet"

export interface ITweet {
  id: string
  photo?: string
  tweet: string
  userId: string
  username: string
  createdAt: number
}

export interface IEditTweet {
  id: string
  photo?: string
  tweet: string
  userId: string
  setEdit(isEdit: boolean): void
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`

export default function TimeLine() {
  const [tweets, setTweet] = useState<ITweet[]>([])

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      )
      // const snapshot = await getDocs(tweetsQuery)
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data()
      //   return {
      //     tweet,
      //     createdAt,
      //     userId,
      //     username,
      //     photo,
      //     id: doc.id,
      //   }
      // })
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data()
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          }
        })
        setTweet(tweets)
      })
    }
    fetchTweets()
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])

  return (
    <Wrapper>
      {tweets.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
    </Wrapper>
  )
}