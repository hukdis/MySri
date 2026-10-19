import { withBase } from 'vitepress'

export function siteLink(url: string): string {
  const [, pathname, suffix] = url.match(/^([^?#]*)(.*)$/s)!
  return withBase((pathname.endsWith('/') || pathname.endsWith('.html') ? pathname : `${pathname}.html`) + suffix)
}
