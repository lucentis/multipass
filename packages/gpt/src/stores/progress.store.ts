import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TABLE_ORDER, computeStars } from '@/utils/multiplication'

function defaultTableState(unlocked = false) {
  return {
    unlocked,
    discovered: false,
    totalAttempts: 0,
    totalCorrect: 0,
    bestStreak: 0,
    stars: 0,
    successRate: 0,
  }
}

export const useProgressStore = defineStore('progress', () => {
  // { [profileId]: { [tableNumber]: tableState } }
  const data = ref({})

  function initProfile(profileId) {
    if (data.value[profileId]) return
    data.value[profileId] = {}
    TABLE_ORDER.forEach((table, index) => {
      data.value[profileId][table] = defaultTableState(index === 0)
    })
  }

  function getTable(profileId, tableNumber) {
    return data.value[profileId]?.[tableNumber] ?? null
  }

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
    _unlockNext(profileId, tableNumber)
  }

  function recordSession(profileId, tableNumber, correct, total, sessionBestStreak) {
    const entry = data.value[profileId]?.[tableNumber]
    if (!entry) return

    entry.totalAttempts += total
    entry.totalCorrect += correct
    entry.successRate = entry.totalCorrect / entry.totalAttempts
    entry.stars = computeStars(entry.successRate)

    if (sessionBestStreak > entry.bestStreak) {
      entry.bestStreak = sessionBestStreak
    }

    _unlockNext(profileId, tableNumber)
  }

  function _unlockNext(profileId, tableNumber) {
    const idx = TABLE_ORDER.indexOf(tableNumber)
    if (idx === -1 || idx >= TABLE_ORDER.length - 1) return
    const next = TABLE_ORDER[idx + 1]
    if (data.value[profileId]?.[next]) {
      data.value[profileId][next].unlocked = true
    }
  }

  function getStats(profileId) {
    const tables = getAllTables(profileId)
    return {
      totalStars: tables.reduce((sum, t) => sum + t.stars, 0),
      tablesComplete: tables.filter(t => t.stars === 3).length,
      bestStreak: Math.max(...tables.map(t => t.bestStreak), 0),
    }
  }

  return {
    data,
    initProfile,
    getTable,
    getAllTables,
    markDiscovered,
    recordSession,
    getStats,
  }
}, {
  persist: true,
})