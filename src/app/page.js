import MatrixBackground from '../components/MatrixBackground';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <MatrixBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-6xl font-bold text-orange-400 mb-4 font-mono">
            &lt;Brian Shisia/&gt;
          </h1>
          <p className="text-xl text-orange-300 mb-8 font-mono">
            Full Stack Developer | Problem Solver | Code Architect
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-black/50 border border-orange-500/30 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-orange-400 font-mono text-lg mb-3">Frontend</h3>
              <p className="text-orange-300 text-sm">React, Next.js, Sveltekit, TypeScript, Tailwind CSS</p>
            </div>
            <div className="bg-black/50 border border-orange-500/30 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-orange-400 font-mono text-lg mb-3">Backend</h3>
              <p className="text-orange-300 text-sm">Golang, Node.js, Python, PostgreSQL, MySql</p>
            </div>
            <div className="bg-black/50 border border-orange-500/30 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-orange-400 font-mono text-lg mb-3">Tools</h3>
              <p className="text-orange-300 text-sm">Git, Docker, Linux, Figma</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center mt-8">
            <a href="#projects" className="bg-orange-500/20 border border-orange-500 text-orange-400 px-6 py-3 rounded-lg font-mono hover:bg-orange-500/30 transition-colors">
              View Projects
            </a>
            <a href="#contact" className="border border-orange-500/50 text-orange-400 px-6 py-3 rounded-lg font-mono hover:border-orange-500 transition-colors">
              Contact Me
            </a>
          </div>
        </div>
      </main>
      <Projects />
      <Blog />
      <Contact />
    </div>
  );
}
