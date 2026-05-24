export interface User {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'non-binary' | 'other'
  orientation: string
  location: string
  distance: number
  bio: string
  photos: string[]
  interests: string[]
  goal: 'friendship' | 'dating' | 'serious' | 'casual' | 'networking'
  verified: boolean
  premium: boolean
  online: boolean
  lastActive: Date
  height?: number
  religion?: string
  lifestyle?: string[]
  compatibility?: number
  prompts?: { question: string; answer: string }[]
  badges?: string[]
}

export interface Match {
  id: string
  user: User
  matchedAt: Date
  lastMessage?: Message
  unread: number
  status: 'new' | 'active' | 'archived'
  muted: boolean
}

export interface Message {
  id: string
  matchId: string
  senderId: string
  text?: string
  image?: string
  audio?: string
  emoji?: string
  type: 'text' | 'image' | 'audio' | 'sticker' | 'emoji'
  sentAt: Date
  readAt?: Date
  status: 'sent' | 'delivered' | 'read'
}

export interface Notification {
  id: string
  type: 'match' | 'message' | 'like' | 'superlike' | 'suggestion' | 'reminder' | 'security'
  title: string
  body: string
  userId?: string
  userPhoto?: string
  createdAt: Date
  read: boolean
}

export interface FilterPreferences {
  ageMin: number
  ageMax: number
  distanceMax: number
  gender: string[]
  orientation: string[]
  goals: string[]
  interests: string[]
  heightMin?: number
  heightMax?: number
  onlyVerified: boolean
  onlyActive: boolean
}

export type SwipeDirection = 'left' | 'right' | 'up' | null
