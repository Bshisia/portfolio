export async function getGitHubLanguages(username) {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  const repos = await response.json();
  
  const languages = new Set();
  
  for (const repo of repos) {
    if (repo.language) {
      languages.add(repo.language);
    }
  }
  
  return Array.from(languages);
}