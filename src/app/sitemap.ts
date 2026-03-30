import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'database.sqlite');

async function getDb() {
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });
}

export default async function sitemap() {
  const db = await getDb();
  const articles = await db.all("SELECT slug, created_at FROM articles");

  const baseUrl = 'https://businessimport.ru';

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.created_at),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...articleUrls,
  ];
}
