import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { ProfileProgress, TableProgress } from '@/types/progress'

// Unlock order — easiest tables first
const TABLE_ORDER = [1, 2, 5, 10, 3, 4, 6, 7, 8, 9]

function defaultTableState(unlocked = false): TableProgress {
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

function computeStars(successRate: number): 0 | 1 | 2 | 3 {
  if (successRate >= 0.9) return 3
  if (successRate >= 0.7) return 2
  if (successRate >= 0.5) return 1
  return 0
}

// Shape: { [profileId]: ProfileProgress }
export const useProgressStore = defineStore('progress', () => {
  const data = ref<Record<string, ProfileProgress>>({})

  // Called once when a profile is first selected
  function init(profileId: string): void {
    if (data.value[profileId]) return
    data.value[profileId] = {}
    TABLE_ORDER.forEach((table, index) => {
      data.value[profileId][table] = defaultTableState(index === 0)
    })
  }

  function getTable(profileId: string, tableNumber: number): TableProgress | null {
    return data.value[profileId]?.[tableNumber] ?? null
  }

  function getAllTables(profileId: string): Array<TableProgress & { number: number }> {
    return TABLE_ORDER.map(n => ({
      number: n,
      ...(data.value[profileId]?.[n] ?? defaultTableState()),
    }))
  }

  function markDiscovered(profileId: string, tableNumber: number): void {
    const entry = data.value[profileId]?.[tableNumber]
    if (!entry) return
    entry.discovered = true
    unlockNext(profileId, tableNumber)
  }

  function recordSession(
    profileId: string,
    tableNumber: number,
    correct: number,
    total: number,
    sessionBestStreak: number,
  ): void {
    const entry = data.value[profileId]?.[tableNumber]
    if (!entry) return

    entry.totalAttempts += total
    entry.totalCorrect += correct
    entry.successRate = entry.totalCorrect / entry.totalAttempts
    entry.stars = computeStars(entry.successRate)

    if (sessionBestStreak > entry.bestStreak) {
      entry.bestStreak = sessionBestStreak
    }

    unlockNext(profileId, tableNumber)
  }

  function unlockNext(profileId: string, tableNumber: number): void {
    const idx = TABLE_ORDER.indexOf(tableNumber)
    if (idx === -1 || idx >= TABLE_ORDER.length - 1) return
    const next = TABLE_ORDER[idx + 1]
    if (data.value[profileId]?.[next]) {
      data.value[profileId][next].unlocked = true
    }
  }

  // Wipe all progress for a profile and restart from scratch
  function resetProfile(profileId: string): void {
    delete data.value[profileId]
    init(profileId)
  }

  // Remove all data for a deleted profile
  function removeProfile(profileId: string): void {
    delete data.value[profileId]
  }

  function getStats(profileId: string) {
    const tables = getAllTables(profileId)
    console.log(tables);
    
    return {
      totalStars: tables.reduce((sum, t) => sum + t.stars, 0),
      tablesComplete: tables.filter(t => t.stars === 3).length,
      bestStreak: Math.max(...tables.map(t => t.bestStreak), 0),
    }
  }

  return {
    data,
    TABLE_ORDER,
    init,
    getTable,
    getAllTables,
    markDiscovered,
    recordSession,
    resetProfile,
    removeProfile,
    getStats,
  }
}, {
  persist: true,
})