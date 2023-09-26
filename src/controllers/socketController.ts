import { SitemapType, parseSitemap } from "../services/sitemap.ts";
import { formatSocketData } from "../services/utils.ts";
import PQueue from "p-queue";
import { JSDOM } from "jsdom";
import db from "../config/db.ts";

const queue = new PQueue({concurrency: 4})

export const startScanInSocket = async (
  url: string | undefined, 
) => {
  if (global.scanStatus) return 

  global.scanStatus = true
  global.clients.forEach(v => v.ws.send( formatSocketData("status", global.scanStatus) ))

  let listUrls = []

  if (url?.includes('thanhnien.vn')) {
    listUrls.push(url + '/sitemap.xml')
  }

  await recursiveSitemap(listUrls[0])

  await queue.onIdle()

  global.clients.forEach(v => v.ws.send( formatSocketData("message", "Successfully Completed") ))
}

export const stopScanInSocket = async () => {
  global.scanStatus = false
  global.clients.forEach(v => v.ws.send( formatSocketData("status", global.scanStatus) ))
  
  console.log('stop')
}

export const getScanStatus = async () => {
  global.clients.forEach(v => v.ws.send( formatSocketData("status", global.scanStatus) ))
}

const recursiveSitemap = async (url: string) => {
  if (!global.scanStatus) return

  const sitemap = await parseSitemap(url)

  if (sitemap?.sitemapindex) {
    const urls = sitemap.sitemapindex.sitemap
    for (let i = 0; i < urls.length; i++) {
      if (!global.scanStatus) return

      let lastmod = urls[i]?.lastmod?.length > 0 ? urls[i]?.lastmod[0] : undefined
      if ( new Date(lastmod).toDateString() == new Date().toDateString() && urls[i].loc[0]) {
        await recursiveSitemap(urls[i].loc[0])
      }
    }
  }
  else if (sitemap?.urlset) {
    const urls = sitemap.urlset.url

    for (let i = 0; i < urls.length; i++) {
      if (!global.scanStatus) return
      
      let lastmod = urls[i]?.lastmod?.length > 0 ? urls[i]?.lastmod[0] : undefined

      if ( new Date(lastmod).toDateString() == new Date().toDateString() && urls[i].loc[0] && urls[i]["image:image"] ) {
        queue.add(async () => {
          // const post = await getDataInUrl(urls[i].loc[0])
          // global.clients.forEach(v => v.ws.send( formatSocketData("url", {
          //   url: urls[i].loc[0],
          //   time: new Date(lastmod),
          //   status: post ? 'success' : 'error'
          // }) ))
        })
      }
    }
  }
}

const getDataInUrl = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) return

  const body = await res.text()

  const document = new JSDOM(body)

  const title = document.window.document.head.title
  const description = (document.window.document.head.querySelector('meta[name="description"]') as HTMLMetaElement)?.content
  const image = (document.window.document.head.querySelector('meta[name="og:image"]') as HTMLMetaElement)?.content
  const content = document.window.document.querySelector('.detail-cmain').innerHTML

  const post = await db.post.create({
    data: {
      title,
      description,
      image,
      body: content
    }
  }).catch(e => null)

  return post
}