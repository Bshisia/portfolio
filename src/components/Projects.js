'use client';
import { useState, useEffect } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPinnedProjects = async () => {
      try {
        const query = `
          query {
            user(login: "bshisia") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    name
                    description
                    url
                    homepageUrl
                    primaryLanguage { name }
                    languages(first: 3) {
                      nodes { name }
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        });

        const data = await response.json();
        const pinnedRepos = data.data?.user?.pinnedItems?.nodes || [];
        
        const formattedProjects = pinnedRepos.map(repo => ({
          title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          tech: repo.languages?.nodes?.map(lang => lang.name).join(', ') || repo.primaryLanguage?.name || 'Code',
          description: repo.description || 'No description available',
          github: repo.url,
          demo: repo.homepageUrl || repo.url
        }));
        
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching pinned projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPinnedProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-orange-400 mb-12 font-mono">&lt;Projects /&gt;</h2>
          <div className="text-orange-300 font-mono">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-orange-400 mb-12 text-center font-mono">
          &lt;Projects /&gt;
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-black/60 border border-orange-500/30 p-6 rounded-lg backdrop-blur-sm hover:border-orange-500/60 transition-colors">
              <h3 className="text-orange-400 font-mono text-xl mb-3">{project.title}</h3>
              <p className="text-orange-300/80 text-sm mb-4">{project.description}</p>
              <p className="text-orange-500 text-xs mb-4 font-mono">{project.tech}</p>
              <div className="flex gap-4">
                <a href={project.github} className="text-orange-400 hover:text-orange-300 text-sm font-mono">GitHub</a>
                <a href={project.demo} className="text-orange-400 hover:text-orange-300 text-sm font-mono">Demo</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}