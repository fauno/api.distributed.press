import { NewSite, UpdateSite, Site } from '../api/schemas'
import { Static } from '@sinclair/typebox'
import { Config } from './store.js'
import { nanoid } from 'nanoid'

export const DEFAULT_SITE_CFG = {
  dns: { // TODO: what is a good default DNS to use here?
    server: '',
    domains: []
  },
  links: {}
}

export class SiteConfigStore extends Config<Static<typeof Site>> {
  async create (cfg: Static<typeof NewSite>): Promise<Static<typeof Site>> {
    const id = nanoid()
    const obj = {
      id,
      ...DEFAULT_SITE_CFG,
      ...cfg
    }
    return await this.db.put(id, obj).then(() => obj)
  }

  async update (id: string, cfg: Static<typeof UpdateSite>): Promise<void> {
    const old = await this.get(id)
    const obj = {
      ...old,
      ...cfg
    }
    return await this.db.put(id, obj)
  }

  async get (id: string): Promise<Static<typeof Site>> {
    return await this.db.get(id)
  }

  async delete (id: string): Promise<void> {
    return await this.db.del(id)
  }
}
