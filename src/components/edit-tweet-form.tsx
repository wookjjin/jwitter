import { doc, updateDoc } from "firebase/firestore"
import React, { useState } from "react"
import styled from "styled-components"
import { auth, db, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { IEditTweet } from "./timeline"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0px;
`

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`

const AttachFileInput = styled.input`
  display: none;
`

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`

export default function EditTweetForm({ photo, tweet, userId, id, setEdit }: IEditTweet) {
  const [isLoading, setLoading] = useState(false)
  const [editTweet, setEditTweet] = useState('')
  const [editFile, setEditFile] = useState<File | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value)
  }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e?.target
    if (files && files.length === 1) {
      setEditFile(files[0])
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = auth.currentUser
    const ok = confirm('Are you sure you want to edit this tweet?')
    if (!ok || !user || isLoading || editTweet === '' || editTweet.length > 180) return;

    try {
      setLoading(true)
      const tweetRef = doc(db, 'tweets', id)
      await updateDoc(tweetRef, {
        tweet: editTweet,
      })

      if (editFile) {
        if (photo) {
          const originPhotoRef = ref(storage, `tweets/${userId}/${id}`)
          const result = await uploadBytes(originPhotoRef, editFile)
          const url = await getDownloadURL(result.ref)
          await updateDoc(tweetRef, {
            photo: url,
          })
        }
      }
      setEditTweet('')
      setEditFile(null)
      setEdit(false)
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form onSubmit={onSubmit}>
      <TextArea required rows={5} maxLength={180} onChange={onChange} value={editTweet} placeholder={tweet} />
      <AttachFileButton htmlFor="file">{editFile ? 'Photo added ✅' : 'Add photo'}</AttachFileButton>
      <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
      <SubmitBtn type="submit" value={isLoading ? "Editing..." : "Edit Tweet"} />
    </Form>
  )
}