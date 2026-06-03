export type Challenge = {
  id: string
  name: string
  description: string
  duration: string
  category: string
  penalties: string
  strikeLostIf: string
  tags: string[]
  isPrivate: boolean
  approved: boolean
  members: string[]
  dueToday: boolean
}

export type User = {
  id: string
  name: string
  friends: string[]
  challenges: string[]
  isCurrentUser?: boolean
}

export type Post = {
  id: string
  challengeId: string
  authorId: string
  type: 'photo' | 'note' | 'file'
  message: string
  createdAt: string
}
