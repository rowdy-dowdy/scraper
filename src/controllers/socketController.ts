import { SitemapType, parseSitemap } from "../services/sitemap.ts";
import { formatSocketData } from "../services/utils.ts";
import PQueue from "p-queue";

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

        console.log(urls[i].loc[0])
        await new Promise(res => setTimeout(() => {
          res(1)
        }, 1000))

        queue.add(async () => {
          console.log('ok')
        })
        // global.clients.forEach(v => v.ws.send( formatSocketData("url", urls[i]) ))
      }
    }
  }
}