document.addEventListener('DOMContentLoaded', () => {
    // Hide all sections except home on initial load
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.id !== 'home') {
            section.style.display = 'none';
        }
    });

    // Handle navigation clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            document.querySelectorAll('.nav-links a').forEach(a => {
                a.classList.remove('active');
            });

            // Add active class to clicked link
            e.currentTarget.classList.add('active');

            // Get section id from data-section attribute
            const sectionId = e.currentTarget.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Handle initial load and browser navigation
    function handleHash() {
        const hash = window.location.hash.slice(1) || 'home';
        showSection(hash);

        // Update active state in navigation
        const activeLink = document.querySelector(`.nav-links a[data-section="${hash}"]`);
        if (activeLink) {
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            activeLink.classList.add('active');
        }
    }

    window.addEventListener('hashchange', handleHash);
    handleHash(); // Handle initial load

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn')) {
        showAdminDashboard();
    }

    // Handle admin login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.removeEventListener('submit', handleAdminLogin);
        loginForm.addEventListener('submit', handleAdminLogin);
    }

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Handle tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Handle project addition
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', showAddProjectForm);
    }
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('active');

        // Load projects when projects section is shown
        if (sectionId === 'projects') {
            loadProjects();
        }
    }
}

async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        const projectsGrid = document.getElementById('projectsGrid');

        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">No projects found</p>';
            return;
        }

        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <img src="${project.image_url}" alt="${project.title}">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.split(',').map(tag => `
                            <span class="tag">${tag.trim()}</span>
                        `).join('')}
                    </div>
                    <a href="${project.project_url}" target="_blank" class="project-link">View Project</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projectsGrid').innerHTML =
            '<p class="error">Error loading projects</p>';
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            showAdminDashboard();
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
    }
}

function showAdminDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadAdminProjects();
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'block';
    showSection('home');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    document.getElementById(`${tabId}Tab`).style.display = 'block';

    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');

    if (tabId === 'profile') {
        loadProfileData();
    }
}

async function loadAdminProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        const projectsList = document.getElementById('adminProjectsList');

        projectsList.innerHTML = projects.map(project => `
            <div class="project-item">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description.substring(0, 100)}...</p>
                    <div class="project-meta">
                        <span class="project-tags">${project.tags}</span>
                        <a href="${project.project_url}" target="_blank" class="project-link">View Project</a>
                    </div>
                </div>
                <div class="project-item-actions">
                    <button onclick="editProject(${project.id})" class="edit-button">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteProject(${project.id})" class="delete-button">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsList.innerHTML = '<p class="error">Error loading projects</p>';
    }
}

async function editProject(id) {
    try {
        const response = await fetch(`/api/projects/${id}`);
        const project = await response.json();

        // Fill form with project data
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectImageUrl').value = project.image_url;
        document.getElementById('projectUrl').value = project.project_url;
        document.getElementById('projectTags').value = project.tags;

        // Show modal
        document.getElementById('projectFormModal').style.display = 'flex';
    } catch (error) {
        console.error('Error loading project:', error);
        alert('Failed to load project details');
    }
}

async function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadAdminProjects();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    }
}

// Add these functions to your existing main.js
function showAddProjectForm() {
    const modal = document.getElementById('projectFormModal');
    const form = document.getElementById('projectForm');
    const closeBtn = document.querySelector('.close-modal');

    // Clear form
    form.reset();
    document.getElementById('projectId').value = '';

    modal.style.display = 'flex';

    // Close modal handlers
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    }

    // Form submit handler
    form.onsubmit = handleProjectSubmit;
}

// Add this after your existing showAddProjectForm function
async function handleProjectSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('projectTitle').value);
    formData.append('description', document.getElementById('projectDescription').value);
    formData.append('image', document.getElementById('projectImage').files[0]);
    formData.append('project_url', document.getElementById('projectUrl').value);
    formData.append('tags', document.getElementById('projectTags').value);

    const projectId = document.getElementById('projectId').value;
    const isEditing = projectId !== '';

    try {
        const response = await fetch(`/api/projects${isEditing ? `/${projectId}` : ''}`, {
            method: isEditing ? 'PUT' : 'POST',
            body: formData, // Send as FormData instead of JSON
        });

        if (response.ok) {
            document.getElementById('projectFormModal').style.display = 'none';
            loadAdminProjects();
        } else {
            alert('Failed to save project');
        }
    } catch (error) {
        console.error('Error saving project:', error);
        alert('An error occurred while saving the project');
    }
}

// Add image preview functionality
document.getElementById('projectImage').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
});

// Update the profile form handler
document.getElementById('profileForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('profileName').value);
    formData.append('title', document.getElementById('profileTitle').value);
    formData.append('bio', document.getElementById('profileBio').value);

    const profileImage = document.getElementById('profileImage').files[0];
    if (profileImage) {
        formData.append('image', profileImage);
    }

    try {
        // Change from PUT to POST method
        const response = await fetch('/api/profile', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            loadHomeContent();
            showSection('home');
        } else {
            const errorText = await response.text();
            console.error('Profile update failed:', errorText);
            alert('Failed to update profile: ' + errorText);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating profile');
    }
});

// Update the settings form handler
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/admin/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword })
        });

        if (response.ok) {
            alert('Password updated successfully');
            document.getElementById('settingsForm').reset();
        } else {
            alert('Failed to update password');
        }
    } catch (error) {
        console.error('Error updating password:', error);
        alert('An error occurred while updating the password');
    }
});


// Load profile data when profile tab is selected
function loadProfileData() {
    fetch('/api/profile')
        .then(response => response.json())
        .then(profile => {
            document.getElementById('profileName').value = profile.name;
            document.getElementById('profileTitle').value = profile.title;
            document.getElementById('profileBio').value = profile.bio;
            document.getElementById('profileSkills').value = profile.skills;
            if (profile.image_url) {
                document.getElementById('profileImagePreview').innerHTML =
                    `<img src="${profile.image_url}" alt="Profile Preview">`;
            }
        })
        .catch(error => console.error('Error loading profile:', error));
}

// Handle profile image preview
document.getElementById('profileImage').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profileImagePreview').innerHTML =
                `<img src="${e.target.result}" alt="Profile Preview">`;
        }
        reader.readAsDataURL(file);
    }
});

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('profileName').value);
    formData.append('title', document.getElementById('profileTitle').value);
    formData.append('bio', document.getElementById('profileBio').value);

    const profileImage = document.getElementById('profileImage').files[0];
    if (profileImage) {
        formData.append('image', profileImage);
    }

    try {
        const response = await fetch('/api/profile', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            // Reload home content and show home section
            loadHomeContent();
            showSection('home');
        } else {
            alert('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating profile');
    }
});

// Add this function to load home content
function loadHomeContent() {
    fetch('/api/profile')
        .then(response => response.json())
        .then(profile => {
            // Update the home section content
            const ownerContent = document.querySelector('.owner-content');
            if (ownerContent) {
                ownerContent.querySelector('h1').textContent = `Hi, I'm ${profile.name}`;
                ownerContent.querySelector('p').textContent = profile.title;
                
                // Update skills
                const techStack = ownerContent.querySelector('.tech-stack');
                if (techStack && profile.skills) {
                    techStack.innerHTML = profile.skills.split(',').map(skill => `
                        <span class="tech-item">${skill.trim()}</span>
                    `).join('');
                }
            }

            // Update profile image if it exists
            const ownerImage = document.querySelector('.owner-image');
            if (ownerImage && profile.image_url) {
                ownerImage.src = profile.image_url;
            }
        })
        .catch(error => console.error('Error loading home content:', error));
}