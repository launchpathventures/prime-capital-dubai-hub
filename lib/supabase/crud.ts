/**
 * CATALYST - Supabase CRUD Utilities
 */

import type { SupabaseClient } from "@supabase/supabase-js"

export type CrudTableConfig = {
  table: string
  schema?: string
  primaryKey?: string
  select?: string
}

export type CrudListOptions = {
  select?: string
   
  query?: (query: unknown) => unknown
}

export type CrudPagination = {
  page: number
  pageSize: number
}

export type CrudMutationOptions = {
  select?: string
   
  query?: (query: unknown) => unknown
}

export type CrudUpsertOptions = CrudMutationOptions & {
  onConflict?: string
  ignoreDuplicates?: boolean
}

function getTableQuery(client: SupabaseClient, config: CrudTableConfig) {
  const scopedClient = config.schema ? client.schema(config.schema) : client
  return scopedClient.from(config.table)
}

/**
 * Create a reusable CRUD client for a single table.
 * 
 * KEY FEATURES:
 * - One factory for all tables/models
 * - Optional schema + default select
 * - Custom query hook for filters/order without reimplementing CRUD
 */
export function createCrudClient<T extends Record<string, unknown>>(
  client: SupabaseClient,
  config: CrudTableConfig
) {
  const primaryKey = config.primaryKey || "id"
  const defaultSelect = config.select || "*"

  return {
    async list(options: CrudListOptions<T> = {}) {
      const select = options.select || defaultSelect
      const query = getTableQuery(client, config).select(select)
      const finalQuery = options.query ? options.query(query) : query
      return await finalQuery
    },

    async getById(id: string | number, options: CrudListOptions<T> = {}) {
      const select = options.select || defaultSelect
      const query = getTableQuery(client, config)
        .select(select)
        .eq(primaryKey, id)
        .maybeSingle()
      const finalQuery = options.query ? options.query(query) : query
      return await finalQuery
    },

    async create(payload: Partial<T> | Partial<T>[], options: CrudMutationOptions<T> = {}) {
      const select = options.select || defaultSelect
      const query = getTableQuery(client, config).insert(payload).select(select)
      const finalQuery = options.query ? options.query(query) : query
      return await finalQuery
    },

    async update(
      id: string | number,
      values: Partial<T>,
      options: CrudMutationOptions<T> = {}
    ) {
      const select = options.select || defaultSelect
      const query = getTableQuery(client, config)
        .update(values)
        .eq(primaryKey, id)
        .select(select)
        .maybeSingle()
      const finalQuery = options.query ? options.query(query) : query
      return await finalQuery
    },

    async remove(id: string | number, options: CrudMutationOptions<T> = {}) {
      const select = options.select || defaultSelect
      const query = getTableQuery(client, config)
        .delete()
        .eq(primaryKey, id)
        .select(select)
        .maybeSingle()
      const finalQuery = options.query ? options.query(query) : query
      return await finalQuery
    },

    async upsert(
      payload: Partial<T> | Partial<T>[],
      options: CrudUpsertOptions<T> = {}
    ) {
      const select = options.select || defaultSelect
      const query = getTableQuery(client, config)
        .upsert(payload, {
          onConflict: options.onConflict,
          ignoreDuplicates: options.ignoreDuplicates,
        })
        .select(select)
      const finalQuery = options.query ? options.query(query) : query
      return await finalQuery
    },

    async listPage(
      pagination: CrudPagination,
      options: CrudListOptions<T> = {}
    ) {
      const select = options.select || defaultSelect
      const from = (pagination.page - 1) * pagination.pageSize
      const to = from + pagination.pageSize - 1
      const query = getTableQuery(client, config).select(select).range(from, to)
      const finalQuery = options.query ? options.query(query) : query
      return await finalQuery
    },
  }
}

/**
 * Create a CRUD repository factory with a client getter.
 *
 * KEY FEATURE: Keeps client creation in one place (browser or server).
 */
export function createCrudClientFactory<T extends Record<string, unknown>>(
  getClient: () => SupabaseClient,
  config: CrudTableConfig
) {
  return () => createCrudClient<T>(getClient(), config)
}

export type SupabaseResponse<T> = {
  data: T | null
  error: unknown | null
}

/**
 * Unwrap Supabase responses with a shared error path.
 *
 * KEY FEATURE: Keeps controllers thin and consistent.
 */
export function unwrapSupabaseResponse<T>(response: SupabaseResponse<T>): T {
  if (response.error) {
    throw response.error
  }
  return response.data as T
}
