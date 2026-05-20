import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TABLE_ORDER, computeStars } from '@/utils/multiplication'

const defaultTableState = () => ({
  unlocked: false,
  discovered: false,
  totalAttempts: 0,
  totalCorrect: 0,
  bestStreak: 0,
  stars: 0,
  successRate: 0,
})

export const useProgressStore = defineStore('progress', () => {
  // Shape: { [profileId]: { [tableNumber]: tableState } }
  const data = ref({})

  function initProfile(profileId) {
    if (data.value[profileId]) return
    data.value[profileId] = {}
    TABLE_ORDER.forEach((table, index) => {
      data.value[profileId][table] = {
        ...defaultTableState(),
        unlocked: index === 0, // only ×1 starts unlocked
      }
    })
  }

  function getTable(profileId, tableNumber) {
    return data.value[profileId]?.[tableNumber] ?? null
  }

  // Returns all tables in unlock order, augmented with their number
  function getAllTables(profileId) {
    return TABLE_ORDER.map(n => ({
      number: n,
      ...(data.value[profileId]?.[n] ?? defaultTableState()),
    }))
  }

  function markDiscovered(profileId, tableNumber) {
    const entry = data.value[profileId]?.[tableNumber]
    if (!entry) return
    entry.discovered = true
    unlockNext(profileId, tableNumber)
  }

  // Called after a practice session ends
  function recordSession(profileId, tableNumber, correctCount, totalCount, bestStreak) {
    const entry = data.value[profileId]?.[tableNumber]
    if (!entry) return

    entry.totalAttempts += totalCount
    entry.totalCorrect += correctCount
    entry.successRate = entry.totalCorrect / entry.totalAttempts
    entry.stars = computeStars(entry.successRate)

    if (bestStreak > entry.bestStreak) entry.bestStreak = bestStreak

    // Unlock next table as soon as any practice session is done
    unlockNext(profileId, tableNumber)
  }

  function unlockNext(profileId, tableNumber) {
    const idx = TABLE_ORDER.indexOf(tableNumber)
    if (idx === -1 || idx >= TABLE_ORDER.length - 1) return
    const nextTable = TABLE_ORDER[idx + 1]
    if (data.value[profileId]?.[nextTable]) {
      data.value[profileId][nextTable].unlocked = true
    }
  }

  // Aggregate stats for the progress view
  function getStats(profileId) {
    const tables = getAllTables(profileId)
    return {
      totalXp: 0, // driven by profiles store
      totalStars: tables.reduce((sum, t) => sum + t.stars, 0),
      tablesComplete: tables.filter(t => t.stars === 3).length,
      bestStreak: Math.max(...tables.map(t => t.bestStreak), 0),
    }
  }

  return { data, initProfile, getTable, getAllTables, markDiscovered, recordSession, getStats }
}, {
  persist: true,
})