import xml2js from "xml2js";

export type SitemapItemType = {
  loc: string[],
  lastmod: string[] | undefined
  priority?: number
  changefreq?: string
  'image:image': {
    'image:loc': string[]
  } | undefined
}

export type SitemapType = {
  sitemapindex: {
    sitemap: Omit<SitemapItemType, 'image:image'>[]
  } | undefined
  urlset: {
    url: SitemapItemType[]
  } | undefined
}

export async function parseSitemap(url: string) {
  try {
    const res = await fetch(url);
    const xml = await res.text();

    const parser = new xml2js.Parser();
    const result: SitemapType = await parser.parseStringPromise(xml);

    return result;
  } catch (error) {
    console.error('Error parsing sitemap:', error);
    return null;
  }
}