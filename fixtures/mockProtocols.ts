import { Static, TSchema } from '@sinclair/typebox'
import { HTTPProtocolFields, HyperProtocolFields, IPFSProtocolFields } from '../api/schemas.js'
import { ProtocolManager } from '../protocols/index.js'
import Protocol, { Ctx, SyncOptions, ProtocolStats } from '../protocols/interfaces.js'

export class MockProtocolManager implements ProtocolManager {
  http: MockHTTPProtocol
  ipfs: MockIPFSProtocol
  hyper: MockHyperProtocol

  constructor () {
    this.ipfs = new MockIPFSProtocol()
    this.http = new MockHTTPProtocol()
    this.hyper = new MockHyperProtocol()
  }

  async load (): Promise<void> {
    const promises = [
      this.ipfs.load(),
      this.hyper.load(),
      this.http.load()
    ]
    await Promise.all(promises)
  }

  async unload (): Promise<void> {
    const promises = [
      this.ipfs.unload(),
      this.hyper.unload(),
      this.http.unload()
    ]
    await Promise.all(promises)
  }
}

abstract class BaseMockProtocol<T extends TSchema> implements Protocol<Static<T>> {
  async load (): Promise<void> {
    return await Promise.resolve()
  }

  async unload (): Promise<void> {
    return await Promise.resolve()
  }

  abstract sync (_id: string, _folderPath: string, _options?: SyncOptions, _ctx?: Ctx): Promise<Static<T>>
  async unsync (_id: string, _site: Static<typeof HTTPProtocolFields>, _ctx?: Ctx): Promise<void> {
    return await Promise.resolve()
  }

  async stats (_id: string): Promise<ProtocolStats> {
    return { peerCount: 0 }
  }
}

class MockHTTPProtocol extends BaseMockProtocol<typeof HTTPProtocolFields> {
  async sync (_id: string, _folderPath: string, _options?: SyncOptions, _ctx?: Ctx): Promise<Static<typeof HTTPProtocolFields>> {
    return {
      enabled: true,
      link: 'https://example-link'
    }
  }
}

class MockIPFSProtocol extends BaseMockProtocol<typeof IPFSProtocolFields> {
  async sync (_id: string, _folderPath: string, _options?: SyncOptions, _ctx?: Ctx): Promise<Static<typeof IPFSProtocolFields>> {
    return {
      enabled: true,
      link: 'ipns://example-link',
      gateway: 'https://example-ipfs-gateway/example-link',
      cid: 'example-cid',
      pubKey: 'ipns://example-pubkey',
      dnslink: '/ipns/example-pubkey'
    }
  }
}

class MockHyperProtocol extends BaseMockProtocol<typeof HyperProtocolFields> {
  async sync (_id: string, _folderPath: string, _options?: SyncOptions, _ctx?: Ctx): Promise<Static<typeof HyperProtocolFields>> {
    return {
      enabled: true,
      link: 'hyper://example-link',
      gateway: 'https://example-hyper-gateway/example-link',
      raw: 'example-raw',
      dnslink: '/hyper/example-raw'
    }
  }
}
