'use client';
import { useState, useEffect } from 'react';
import { getDevToArticles } from '../../lib/devto';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const articles = await getDevToArticles('bshisia');
        setPosts(articles.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-orange-400 mb-12 text-center font-mono">
          &lt;Blog /&gt;
        </h2>
        {loading ? (
          <div className="text-center text-orange-400 font-mono">Loading articles...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-black/60 border border-orange-500/30 p-6 rounded-lg backdrop-blur-sm hover:border-orange-500/60 transition-colors">
                <div className="text-orange-500 text-sm font-mono mb-2">{new Date(post.published_at).toLocaleDateString()}</div>
                <h3 className="text-orange-400 font-mono text-xl mb-3">{post.title}</h3>
                <p className="text-orange-300/80 text-sm mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tag_list.map((tag, tagIndex) => (
                    <span key={tagIndex} className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 text-sm font-mono">Read More →</a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}