// ============================================
// 매장 데이터 인덱스
// ============================================

import type { Store, StoreListItem } from '../../types/store'
import { geojeHanaromart } from './geoje-hanaromart'

// 모든 매장 데이터 (나중에 API로 대체 가능)
const storeRegistry: Record<string, Store> = {
  'geoje-hanaromart': geojeHanaromart,
}

// 매장 목록 가져오기
export function getStoreList(): StoreListItem[] {
  return Object.values(storeRegistry).map((store) => ({
    id: store.meta.id,
    name: store.meta.name,
    address: store.meta.address,
    thumbnail: store.meta.thumbnail,
    fixtureCount: store.fixtures.length,
    updatedAt: store.meta.updatedAt,
  }))
}

// 특정 매장 데이터 가져오기
export function getStoreById(id: string): Store | null {
  return storeRegistry[id] || null
}

// 모든 매장 ID 목록
export function getStoreIds(): string[] {
  return Object.keys(storeRegistry)
}

// 기본 매장 ID
export const DEFAULT_STORE_ID = 'geoje-hanaromart'

export { geojeHanaromart }
