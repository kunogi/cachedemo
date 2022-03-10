import fs from 'fs'

export function parseStatic(url: string): Promise<Buffer> {
  return new Promise(resolve => {
    resolve(fs.readFileSync(url))
  })
}