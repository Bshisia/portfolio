export default function Contact() {
  return (
    <section id="contact" className="py-20 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-orange-400 mb-12 font-mono">
          &lt;Contact /&gt;
        </h2>
        <p className="text-orange-300 mb-8 font-mono text-lg">
          Let's build something amazing together
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <a href="mailto:bshisia@example.com" className="bg-black/60 border border-orange-500/30 p-6 rounded-lg backdrop-blur-sm hover:border-orange-500/60 transition-colors group">
            <div className="text-orange-400 text-2xl mb-3"><i className="fas fa-envelope"></i></div>
            <h3 className="text-orange-400 font-mono mb-2">Email</h3>
            <p className="text-orange-300/80 text-sm">shisiabrian7@gmail.com</p>
          </a>
          
          <a href="https://github.com/bshisia" target="_blank" rel="noopener noreferrer" className="bg-black/60 border border-orange-500/30 p-6 rounded-lg backdrop-blur-sm hover:border-orange-500/60 transition-colors group">
            <div className="text-orange-400 text-2xl mb-3"><i className="fab fa-github"></i></div>
            <h3 className="text-orange-400 font-mono mb-2">GitHub</h3>
            <p className="text-orange-300/80 text-sm">@bshisia</p>
          </a>
          
          <a href="https://www.linkedin.com/in/brian-shisia-217815304" target="_blank" rel="noopener noreferrer" className="bg-black/60 border border-orange-500/30 p-6 rounded-lg backdrop-blur-sm hover:border-orange-500/60 transition-colors group">
            <div className="text-orange-400 text-2xl mb-3"><i className="fab fa-linkedin"></i></div>
            <h3 className="text-orange-400 font-mono mb-2">LinkedIn</h3>
            <p className="text-orange-300/80 text-sm">Brian Shisia</p>
          </a>
        </div>
        
        <div className="bg-black/60 border border-orange-500/30 p-8 rounded-lg backdrop-blur-sm">
          <p className="text-orange-300 font-mono mb-4">
            Ready to discuss your next project?
          </p>
          <a href="mailto:shisiabrian7@gmail.com" className="bg-orange-500/20 border border-orange-500 text-orange-400 px-8 py-3 rounded-lg font-mono hover:bg-orange-500/30 transition-colors inline-block">
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}