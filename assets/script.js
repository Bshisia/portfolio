document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.scroll-reveal').forEach((element) => {
        observer.observe(element);
    });
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate form submission
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');
    
    // Show success message (in a real implementation, this would depend on the actual form submission result)
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Reset form
    this.reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
});

function handleSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Construct email parameters
    const mailtoLink = `mailto:shisiabrian7@gmail.com?subject=Contact Form Message from ${name}&body=From: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Reset form
    event.target.reset();
    
    return false;
}

// Create particles
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = Math.random() * 100 + 'vh';
    particle.style.animation = `float-up ${15 + Math.random() * 10}s linear infinite`;
    document.querySelector('.animated-bg').appendChild(particle);
}

// Create flow lines
for (let i = 0; i < 20; i++) {
    const line = document.createElement('div');
    line.className = 'flow-line';
    line.style.left = Math.random() * 100 + 'vw';
    line.style.top = Math.random() * 100 + 'vh';
    line.style.transform = `rotate(${Math.random() * 360}deg)`;
    line.style.animation = `pulse ${4 + Math.random() * 4}s ease-in-out infinite`;
    document.querySelector('.animated-bg').appendChild(line);
}

// Create code blocks
const codeSnippets = ['function()', 'const data = [];', '<div>', '{ code }', 'return true;'];
for (let i = 0; i < 15; i++) {
    const code = document.createElement('div');
    code.className = 'code-block';
    code.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    code.style.left = Math.random() * 100 + 'vw';
    code.style.animation = `float-up ${20 + Math.random() * 10}s linear infinite`;
    document.querySelector('.animated-bg').appendChild(code);
}

// Create glow orbs
for (let i = 0; i < 5; i++) {
    const orb = document.createElement('div');
    orb.className = 'glow-orb';
    orb.style.left = Math.random() * 100 + 'vw';
    orb.style.top = Math.random() * 100 + 'vh';
    orb.style.animation = `pulse ${6 + Math.random() * 4}s ease-in-out infinite`;
    document.querySelector('.animated-bg').appendChild(orb);
}