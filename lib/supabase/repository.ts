/**
 * CATALYST - Supabase CRUD Repository Factory
 */

import type {
  CrudListOptions,
  CrudMutationOptions,
  CrudPagination,
  CrudUpsertOptions,
} from "@/lib/supabase/crud"
import type { SupabaseResponse } from "@/lib/supabase/crud"
import { unwrapSupabaseResponse } from "@/lib/supabase/crud"

export type CrudClient<TModel> = {
  list: (options?: CrudListOptions<TModel>) => Promise<SupabaseResponse<TModel[]>>
  listPage: (
    pagination: CrudPagination,
    options?: CrudListOptions<TModel>
  ) => Promise<SupabaseResponse<TModel[]>>
  getById: (
    id: string | number,
    options?: CrudListOptions<TModel>
  ) => Promise<SupabaseResponse<TModel>>
  create: (
    payload: Partial<TModel> | Partial<TModel>[],
    options?: CrudMutationOptions<TModel>
  ) => Promise<SupabaseResponse<TModel[]>>
  update: (
    id: string | number,
    values: Partial<TModel>,
    options?: CrudMutationOptions<TModel>
  ) => Promise<SupabaseResponse<TModel>>
  remove: (
    id: string | number,
    options?: CrudMutationOptions<TModel>
  ) => Promise<SupabaseResponse<TModel>>
  upsert: (
    payload: Partial<TModel> | Partial<TModel>[],
    options?: CrudUpsertOptions<TModel>
  ) => Promise<SupabaseResponse<TModel[]>>
}

export type CrudRepositoryOptions<TModel, TCreate, TUpdate, TList> = {
  listSelect?: string
  listQuery?: (query: any) => any
  listMap?: (item: TModel) => TList
  createMap?: (payload: TCreate) => Partial<TModel>
  createDefaults?: Partial<TModel>
  updateMap?: (payload: TUpdate) => Partial<TModel>
}

/**
 * Create a configured repository for any Supabase entity.
 * 
 * KEY FEATURE: One repository definition per model, no controller needed.
 */
export function createCrudRepository<TModel, TCreate, TUpdate, TList>(
  getClient: () => CrudClient<TModel>,
  options: CrudRepositoryOptions<TModel, TCreate, TUpdate, TList> = {}
) {
  const listMap = options.listMap ?? ((item) => item as unknown as TList)
  const createMap = options.createMap ?? ((payload) => payload as Partial<TModel>)
  const updateMap = options.updateMap ?? ((payload) => payload as Partial<TModel>)

  return {
    async list(): Promise<TList[]> {
      const client = getClient()
      const response = await client.list({
        select: options.listSelect,
        query: options.listQuery,
      })

      const data = unwrapSupabaseResponse<TModel[] | null>(response) ?? []
      return data.map(listMap)
    },

    async listPage(pagination: CrudPagination): Promise<TList[]> {
      const client = getClient()
      const response = await client.listPage(pagination, {
        select: options.listSelect,
        query: options.listQuery,
      })

      const data = unwrapSupabaseResponse<TModel[] | null>(response) ?? []
      return data.map(listMap)
    },

    async getById(id: string | number): Promise<TModel | null> {
      const client = getClient()
      const response = await client.getById(id)
      return unwrapSupabaseResponse<TModel | null>(response)
    },

    async create(payload: TCreate): Promise<TModel[] | null> {
      const client = getClient()
      const values = {
        ...options.createDefaults,
        ...createMap(payload),
      }
      const response = await client.create(values)
      return unwrapSupabaseResponse<TModel[] | null>(response)
    },

    async update(id: string | number, payload: TUpdate): Promise<TModel | null> {
      const client = getClient()
      const response = await client.update(id, updateMap(payload))
      return unwrapSupabaseResponse<TModel | null>(response)
    },

    async remove(id: string | number): Promise<TModel | null> {
      const client = getClient()
      const response = await client.remove(id)
      return unwrapSupabaseResponse<TModel | null>(response)
    },

    async upsert(
      payload: Partial<TModel> | Partial<TModel>[],
      options?: CrudUpsertOptions<TModel>
    ): Promise<TModel[] | null> {
      const client = getClient()
      const response = await client.upsert(payload, options)
      return unwrapSupabaseResponse<TModel[] | null>(response)
    },
  }
}
