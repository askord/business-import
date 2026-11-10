interface Article {
  slug: string;
  created_at: string;
}

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || 'http://localhost:5000';

export default async function sitemap() {
  const baseUrl = 'https://businessimport.ru';
  let articles: Article[] = [];

  try {
    const res = await fetch(`${BACKEND_URL}/api/articles`, {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      articles = await res.json();
    }
  } catch (e) {
    console.error('Error fetching articles for sitemap:', e);
  }

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.created_at ? new Date(article.created_at) : new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...articleUrls,
  ];
}
