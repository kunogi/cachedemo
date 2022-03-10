import Koa from 'koa';
import { parseStatic } from './utils'
import crypto from 'crypto'
import path from 'path'

const app = new Koa();

app.listen(8828, () => {
  console.log('server started at port 8828')
})

app.use(async ctx => {
  const url: string = ctx.request.url
  if (url === '/') {
    ctx.set('Content-Type', 'text/html');
    ctx.body = await parseStatic(path.resolve(__dirname, 'index.html'));
  } else {
    ctx.set('Cache-Control', 'no-cache');// 设置协商缓存
    setEtag(ctx, path.resolve(__dirname, `.${url}`))
  }
})

async function setEtag(ctx: Koa.Context, filePath: string) {
  const file: Buffer = await parseStatic(filePath);
  const etag: string = crypto.createHash('md5').update(file).digest('hex')
  const savedEtag = ctx.request.header['if-none-match']
  if (savedEtag === etag) {
    ctx.status = 304
    //ctx.body = ''
  } else {
    ctx.set('ETag', etag)
    ctx.body = file
  }
}