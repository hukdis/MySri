import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import {fileURLToPath} from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'), dir=path.join(root,'sources'), manifest=path.join(root,'catalog/source-manifest.json')
await fs.mkdir(dir,{recursive:true});await fs.mkdir(path.dirname(manifest),{recursive:true})
let previous={};try{previous=JSON.parse(await fs.readFile(manifest,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
const current={}, report=[]
async function scan(folder){for(const e of await fs.readdir(folder,{withFileTypes:true})){if(e.name.startsWith('.'))continue;const p=path.join(folder,e.name);if(e.isDirectory()){await scan(p);continue}const relative=path.relative(dir,p).split(path.sep).join('/');if(relative==='README.md')continue;const bytes=await fs.readFile(p), hash=crypto.createHash('sha256').update(bytes).digest('hex');const old=previous[relative];current[relative]={hash,size:bytes.length,articleIds:old?.articleIds??[]};report.push({file:relative,status:!old?'new':old.hash===hash?'unchanged':'changed',...current[relative]})}}
await scan(dir)
for(const file of Object.keys(previous))if(!current[file])report.push({file,status:'missing',...previous[file]})
await fs.writeFile(manifest,JSON.stringify(current,null,2)+'\n')
await fs.writeFile(path.join(root,'catalog/source-report.json'),JSON.stringify(report,null,2)+'\n')
for(const item of report)console.log(`${item.status.padEnd(10)} ${item.file}`)
console.log(`扫描 ${Object.keys(current).length} 个文件。仅记录变化，不修改原文件或生成文章。`)
