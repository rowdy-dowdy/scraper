import { Context, WSContext } from "@stricjs/router";
import { parseSitemap } from "../services/sitemap.ts";
import { ServerWebSocket } from "bun";
import { formatSocketData } from "../services/utils.ts";

export const startScanInSocket = async (
  ws: ServerWebSocket<WSContext<"/ws">>,
  url: string | undefined, 
) => {
  if (global.scanStatus) return

  global.scanStatus = true
  ws.publish('all',formatSocketData("status", global.scanStatus))

  const sitemap = await parseSitemap(url + '/sitemap.xml')

  console.log(sitemap.sitemapindex.sitemap.length)

  if (!sitemap || !sitemap.sitemapindex.sitemap) {
    console.error('Invalid sitemap format')
    return []
  }

  const urls = sitemap.sitemapindex.sitemap

  for (let i = 0; i < urls.length; i++) {
    if (!global.scanStatus) return
    console.log(i)
    await new Promise(res => setTimeout(() => res(1), 1000))
    // ws.publish('all',formatSocketData("url", urls[i]))
    ws.send(formatSocketData("url", urls[i]))
  }

  ws.publish('all',formatSocketData("message", "Successfully Completed"))
}

export const stopScanInSocket = async (ws: ServerWebSocket<WSContext<"/ws">>) => {
  global.scanStatus = false
  // ws.publish('all',formatSocketData("status", global.scanStatus))
  ws.send(formatSocketData("status", global.scanStatus))
}

export const getScanStatus = async ( ws: ServerWebSocket<WSContext<"/ws">>) => {
  const data = formatSocketData("status", global.scanStatus)
  // ws.publish('all',data)
  ws.send(data)
}