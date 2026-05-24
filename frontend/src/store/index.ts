import { create } from 'zustand'
import type { User, Match, Message, Notification, FilterPreferences } from '../types'
import { mockProfiles, mockCurrentUser, mockMatches, mockMessages, mockNotifications } from '../data/mockData'

interface AppState {
  // Auth
  isAuthenticated: boolean
  currentUser: User | null
  theme: 'light' | 'dark'

  // Discover
  profiles: User[]
  currentIndex: number
  likedProfiles: string[]
  dislikedProfiles: string[]
  superlikes: number
  boosts: number
  lastAction: { profile: User; action: 'like' | 'dislike' | 'superlike' } | null

  // Matches
  matches: Match[]

  // Chat
  messages: Record<string, Message[]>
  typingUsers: Record<string, boolean>

  // Notifications
  notifications: Notification[]

  // Filters
  filters: FilterPreferences

  // Actions
  login: (user?: User) => void
  logout: () => void
  toggleTheme: () => void
  swipeProfile: (direction: 'like' | 'dislike' | 'superlike') => void
  undoLastAction: () => void
  sendMessage: (matchId: string, text: string) => void
  markMatchRead: (matchId: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  archiveMatch: (matchId: string) => void
  muteMatch: (matchId: string) => void
  updateFilters: (f: Partial<FilterPreferences>) => void
  updateProfile: (u: Partial<User>) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  currentUser: null,
  theme: 'dark',

  profiles: mockProfiles,
  currentIndex: 0,
  likedProfiles: [],
  dislikedProfiles: [],
  superlikes: 3,
  boosts: 1,
  lastAction: null,

  matches: mockMatches,
  messages: mockMessages,
  typingUsers: {},

  notifications: mockNotifications,

  filters: {
    ageMin: 18,
    ageMax: 45,
    distanceMax: 50,
    gender: [],
    orientation: [],
    goals: [],
    interests: [],
    onlyVerified: false,
    onlyActive: false,
  },

  login: (user) => set({
    isAuthenticated: true,
    currentUser: user ?? mockCurrentUser,
  }),

  logout: () => set({ isAuthenticated: false, currentUser: null }),

  toggleTheme: () => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    return { theme: next }
  }),

  swipeProfile: (action) => set((s) => {
    const profile = s.profiles[s.currentIndex]
    if (!profile) return s

    const newIndex = s.currentIndex + 1
    const isMatch = action !== 'dislike' && Math.random() > 0.4

    let newMatches = s.matches
    if (isMatch) {
      const match: Match = {
        id: `m_${Date.now()}`,
        user: profile,
        matchedAt: new Date(),
        unread: 0,
        status: 'new',
        muted: false,
      }
      newMatches = [match, ...s.matches]
    }

    return {
      currentIndex: newIndex,
      lastAction: { profile, action },
      likedProfiles: action !== 'dislike' ? [...s.likedProfiles, profile.id] : s.likedProfiles,
      dislikedProfiles: action === 'dislike' ? [...s.dislikedProfiles, profile.id] : s.dislikedProfiles,
      superlikes: action === 'superlike' ? Math.max(0, s.superlikes - 1) : s.superlikes,
      matches: newMatches,
    }
  }),

  undoLastAction: () => set((s) => {
    if (!s.lastAction || s.currentIndex === 0) return s
    return {
      currentIndex: s.currentIndex - 1,
      lastAction: null,
      likedProfiles: s.likedProfiles.filter((id) => id !== s.lastAction?.profile.id),
      dislikedProfiles: s.dislikedProfiles.filter((id) => id !== s.lastAction?.profile.id),
    }
  }),

  sendMessage: (matchId, text) => set((s) => {
    const msg: Message = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId: 'me',
      text,
      type: 'text',
      sentAt: new Date(),
      status: 'sent',
    }
    const prev = s.messages[matchId] ?? []
    return {
      messages: { ...s.messages, [matchId]: [...prev, msg] },
      matches: s.matches.map((m) =>
        m.id === matchId ? { ...m, lastMessage: msg } : m
      ),
    }
  }),

  markMatchRead: (matchId) => set((s) => ({
    matches: s.matches.map((m) => m.id === matchId ? { ...m, unread: 0 } : m),
  })),

  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
  })),

  markAllNotificationsRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
  })),

  archiveMatch: (matchId) => set((s) => ({
    matches: s.matches.map((m) => m.id === matchId ? { ...m, status: 'archived' } : m),
  })),

  muteMatch: (matchId) => set((s) => ({
    matches: s.matches.map((m) => m.id === matchId ? { ...m, muted: !m.muted } : m),
  })),

  updateFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),

  updateProfile: (u) => set((s) => ({
    currentUser: s.currentUser ? { ...s.currentUser, ...u } : s.currentUser,
  })),
}))
