export async function getDevToArticles(username) {
  const response = await fetch(`https://dev.to/api/articles?username=${username}`);
  return response.json();
}