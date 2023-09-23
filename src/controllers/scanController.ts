import { Context } from "@stricjs/router";
import { parseSitemap } from "../services/sitemap.ts";

export const scan = async (ctx: Context<"json", any>) => {
  const url: string = ctx.data.url

  const sitemap = await parseSitemap(url + '/sitemap.xml')

  console.log(sitemap.sitemapindex.sitemap.length)

  if (!sitemap || !sitemap.sitemapindex.sitemap) {
    console.error('Invalid sitemap format')
    return []
  }

  const urls = sitemap.sitemapindex.sitemap

  console.log({urls})

  return Response.json(urls)

  return Response.json("Successfully Completed")
}