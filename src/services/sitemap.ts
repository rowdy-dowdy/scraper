import xml2js from "xml2js";

export async function parseSitemap(url: string) {
  try {
    const res = await fetch(url);
    const xml = await res.text();

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    return result;
  } catch (error) {
    console.error('Error parsing sitemap:', error);
    return null;
  }
}