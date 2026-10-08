import { withBase } from 'vitepress'

export function siteLink(url: string): string {
  return withBase(url.endsWith('/') ? url : `${url}.html`)
}
