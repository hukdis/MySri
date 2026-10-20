import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const translations=JSON.parse(await fs.readFile(fileURLToPath(new URL('../catalog/figure-translations.json',import.meta.url)),'utf8'))
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')

/** Insert once; subsequent builds preserve translations edited directly in the article. */
export function insertFigureTranslations(content) {
  return content.replace(/<PaperFigure\b[^>]*\/>/g,(figure,offset)=>{
    const src=figure.match(/src="([^"]+)"/)?.[1]
    const entry=translations[src]
    if(!entry)throw new Error('缺少原图翻译：'+src)
    if(content.slice(offset+figure.length).trimStart().startsWith('<!-- figure-translation:'))return figure
    const kind=src.split('/').at(-1).startsWith('table')?'表注':'图注'
    return `${figure}\n\n<!-- figure-translation:${src} -->\n**原文翻译（${kind}）**\n\n${escape(entry.captionChinese)}\n\n**图内文字与标记**\n\n${entry.labelsChinese.map(label=>'- '+escape(label)).join('\n')}\n${entry.translatorNote?'\n**译注**：'+escape(entry.translatorNote)+'\n':''}\n::: details 对照英文原文\n\n${escape(entry.captionEnglish)}\n:::\n\n**图表解读**\n<!-- /figure-translation -->`
  })
}
