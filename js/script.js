// Portfolio Interactive Functionality
class PortfolioManager {
    constructor() {
        this.originalData = {};
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupEditControls();
        this.setupSkillsManagement();
        this.loadTheme();
        this.saveOriginalData();
    }

    // Theme Management
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            
            // Update icon
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            
            // Save theme preference
            localStorage.setItem('portfolio-theme', this.currentTheme);
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = document.querySelector('#theme-toggle i');
        icon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Save original data for cancel functionality
    saveOriginalData() {
        // Save about section data
        this.originalData.about = {};
        document.querySelectorAll('#about .editable').forEach(element => {
            const field = element.getAttribute('data-field');
            this.originalData.about[field] = element.textContent;
        });

        // Save contact section data
        this.originalData.contact = {};
        document.querySelectorAll('#contact .editable').forEach(element => {
            const field = element.getAttribute('data-field');
            this.originalData.contact[field] = element.textContent;
        });

        // Save skills data
        this.originalData.skills = [];
        document.querySelectorAll('.skill-item').forEach(item => {
            const skill = {
                name: item.querySelector('.skill-name').textContent,
                rating: parseInt(item.querySelector('.star-rating').getAttribute('data-rating'))
            };
            this.originalData.skills.push(skill);
        });
    }

    // Edit Controls Setup
    setupEditControls() {
        // Edit button handlers
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.getAttribute('data-section');
                this.enableEdit(section);
            });
        });

        // Save button handlers
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.getAttribute('data-section');
                this.saveChanges(section);
            });
        });

        // Cancel button handlers
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.getAttribute('data-section');
                this.cancelChanges(section);
            });
        });
    }

    enableEdit(section) {
        const sectionElement = document.getElementById(section);
        const editControls = sectionElement.querySelector('.edit-controls');
        
        if (section === 'about') {
            // Make about fields editable
            sectionElement.querySelectorAll('.editable').forEach(element => {
                element.contentEditable = true;
                element.classList.add('editing');
            });
        } else if (section === 'contact') {
            // Make contact fields editable
            sectionElement.querySelectorAll('.editable').forEach(element => {
                element.contentEditable = true;
                element.classList.add('editing');
            });
        } else if (section === 'skills') {
            this.enableSkillsEdit();
        }

        // Show edit controls
        if (editControls) {
            editControls.style.display = 'flex';
        }

        // Hide edit button
        const editBtn = sectionElement.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.style.display = 'none';
        }
    }

    saveChanges(section) {
        const sectionElement = document.getElementById(section);
        const editControls = sectionElement.querySelector('.edit-controls');
        
        if (section === 'about') {
            // Save about changes and update original data
            sectionElement.querySelectorAll('.editable').forEach(element => {
                element.contentEditable = false;
                element.classList.remove('editing');
                const field = element.getAttribute('data-field');
                this.originalData.about[field] = element.textContent;
            });
        } else if (section === 'contact') {
            // Save contact changes and update original data
            sectionElement.querySelectorAll('.editable').forEach(element => {
                element.contentEditable = false;
                element.classList.remove('editing');
                const field = element.getAttribute('data-field');
                this.originalData.contact[field] = element.textContent;
            });
        } else if (section === 'skills') {
            this.saveSkillsChanges();
        }

        // Hide edit controls
        if (editControls) {
            editControls.style.display = 'none';
        }

        // Show edit button
        const editBtn = sectionElement.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.style.display = 'flex';
        }

        this.showNotification('Changes saved successfully!', 'success');
    }

    cancelChanges(section) {
        const sectionElement = document.getElementById(section);
        const editControls = sectionElement.querySelector('.edit-controls');
        
        if (section === 'about') {
            // Restore original about data
            sectionElement.querySelectorAll('.editable').forEach(element => {
                element.contentEditable = false;
                element.classList.remove('editing');
                const field = element.getAttribute('data-field');
                element.textContent = this.originalData.about[field];
            });
        } else if (section === 'contact') {
            // Restore original contact data
            sectionElement.querySelectorAll('.editable').forEach(element => {
                element.contentEditable = false;
                element.classList.remove('editing');
                const field = element.getAttribute('data-field');
                element.textContent = this.originalData.contact[field];
            });
        } else if (section === 'skills') {
            this.cancelSkillsChanges();
        }

        // Hide edit controls
        if (editControls) {
            editControls.style.display = 'none';
        }

        // Show edit button
        const editBtn = sectionElement.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.style.display = 'flex';
        }

        this.showNotification('Changes cancelled', 'info');
    }

    // Skills Management
    setupSkillsManagement() {
        // Add skill button
        const addSkillBtn = document.querySelector('.add-skill-btn');
        addSkillBtn.addEventListener('click', () => {
            this.showAddSkillModal();
        });

        // Modal controls
        const modal = document.getElementById('add-skill-modal');
        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = modal.querySelector('#cancel-skill-btn');
        const saveBtn = modal.querySelector('#save-skill-btn');

        closeBtn.addEventListener('click', () => this.hideAddSkillModal());
        cancelBtn.addEventListener('click', () => this.hideAddSkillModal());
        saveBtn.addEventListener('click', () => this.addNewSkill());

        // Star rating input
        this.setupStarRatingInput();

        // Click outside modal to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideAddSkillModal();
            }
        });
    }

    setupStarRatingInput() {
        const starBtns = document.querySelectorAll('.star-btn');
        let selectedRating = 0;

        starBtns.forEach((star, index) => {
            star.addEventListener('click', () => {
                selectedRating = index + 1;
                this.updateStarDisplay(selectedRating);
            });

            star.addEventListener('mouseenter', () => {
                this.updateStarDisplay(index + 1, true);
            });
        });

        document.querySelector('.star-input').addEventListener('mouseleave', () => {
            this.updateStarDisplay(selectedRating);
        });

        // Store rating for retrieval
        this.getSelectedRating = () => selectedRating;
        this.setSelectedRating = (rating) => {
            selectedRating = rating;
            this.updateStarDisplay(rating);
        };
    }

    updateStarDisplay(rating, hover = false) {
        const starBtns = document.querySelectorAll('.star-btn');
        starBtns.forEach((star, index) => {
            if (index < rating) {
                star.classList.add(hover ? 'hover' : 'active');
                if (!hover) star.classList.remove('hover');
            } else {
                star.classList.remove('active', 'hover');
            }
        });
    }

    showAddSkillModal() {
        const modal = document.getElementById('add-skill-modal');
        const nameInput = document.getElementById('new-skill-name');
        
        modal.style.display = 'flex';
        nameInput.focus();
        nameInput.value = '';
        this.setSelectedRating(0);
    }

    hideAddSkillModal() {
        const modal = document.getElementById('add-skill-modal');
        modal.style.display = 'none';
    }

    addNewSkill() {
        const nameInput = document.getElementById('new-skill-name');
        const skillName = nameInput.value.trim();
        const rating = this.getSelectedRating();

        if (!skillName) {
            this.showNotification('Please enter a skill name', 'error');
            return;
        }

        if (rating === 0) {
            this.showNotification('Please select a rating', 'error');
            return;
        }

        // Check if skill already exists
        const existingSkills = Array.from(document.querySelectorAll('.skill-name')).map(el => el.textContent.toLowerCase());
        if (existingSkills.includes(skillName.toLowerCase())) {
            this.showNotification('This skill already exists', 'error');
            return;
        }

        this.createSkillElement(skillName, rating);
        this.hideAddSkillModal();
        this.showNotification('Skill added successfully!', 'success');
    }

    createSkillElement(name, rating) {
        const skillsList = document.getElementById('skills-list');
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.setAttribute('data-skill', name.toLowerCase().replace(/\s+/g, '-'));

        skillItem.innerHTML = `
            <span class="skill-name">${name}</span>
            <div class="star-rating" data-rating="${rating}">
                ${this.generateStars(rating)}
            </div>
            <button class="delete-skill-btn" style="display: none;">
                <i class="fas fa-trash"></i>
            </button>
        `;

        // Add event listeners
        this.setupSkillItemEvents(skillItem);
        skillsList.appendChild(skillItem);
    }

    generateStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`;
        }
        return starsHTML;
    }

    setupSkillItemEvents(skillItem) {
        const deleteBtn = skillItem.querySelector('.delete-skill-btn');
        const starRating = skillItem.querySelector('.star-rating');
        const stars = skillItem.querySelectorAll('.star');

        deleteBtn.addEventListener('click', () => {
            this.deleteSkill(skillItem);
        });

        // Make star rating interactive in edit mode
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                if (skillItem.classList.contains('editing')) {
                    const newRating = index + 1;
                    starRating.setAttribute('data-rating', newRating);
                    this.updateSkillStars(starRating, newRating);
                }
            });
        });
    }

    deleteSkill(skillItem) {
        if (confirm('Are you sure you want to delete this skill?')) {
            skillItem.remove();
            this.showNotification('Skill deleted', 'info');
        }
    }

    enableSkillsEdit() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            item.classList.add('editing');
            const deleteBtn = item.querySelector('.delete-skill-btn');
            const skillName = item.querySelector('.skill-name');
            
            deleteBtn.style.display = 'inline-block';
            skillName.contentEditable = true;
            skillName.classList.add('editing');
        });
    }

    saveSkillsChanges() {
        const skillItems = document.querySelectorAll('.skill-item');
        this.originalData.skills = [];
        
        skillItems.forEach(item => {
            item.classList.remove('editing');
            const deleteBtn = item.querySelector('.delete-skill-btn');
            const skillName = item.querySelector('.skill-name');
            const rating = parseInt(item.querySelector('.star-rating').getAttribute('data-rating'));
            
            deleteBtn.style.display = 'none';
            skillName.contentEditable = false;
            skillName.classList.remove('editing');
            
            // Update original data
            this.originalData.skills.push({
                name: skillName.textContent,
                rating: rating
            });
        });
    }

    cancelSkillsChanges() {
        // Restore original skills
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = '';

        this.originalData.skills.forEach(skill => {
            this.createSkillElement(skill.name, skill.rating);
        });
    }

    updateSkillStars(starRating, rating) {
        const stars = starRating.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '500',
            zIndex: '3000',
            animation: 'slideInRight 0.3s ease',
            minWidth: '200px',
            textAlign: 'center'
        };

        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db'
        };

        Object.assign(notification.style, styles);
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Initialize portfolio manager
    const portfolio = new PortfolioManager();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    function updateNavbarOpacity() {
        if (window.scrollY > 50) {
            navbar.style.background = 'var(--nav-bg)';
        } else {
            navbar.style.background = 'var(--nav-bg)';
        }
    }

    window.addEventListener('scroll', updateNavbarOpacity);

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.project-card, .contact-item, .about-card, .skills-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Enhanced skill item interactions
    document.querySelectorAll('.skill-item').forEach(item => {
        portfolio.setupSkillItemEvents(item);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC key to cancel editing
        if (e.key === 'Escape') {
            const editingSection = document.querySelector('.edit-controls[style*="flex"]');
            if (editingSection) {
                const sectionName = editingSection.querySelector('.cancel-btn').getAttribute('data-section');
                portfolio.cancelChanges(sectionName);
            }
            
            // Close modal if open
            const modal = document.getElementById('add-skill-modal');
            if (modal.style.display === 'flex') {
                portfolio.hideAddSkillModal();
            }
        }

        // Ctrl+S to save changes
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            const editingSection = document.querySelector('.edit-controls[style*="flex"]');
            if (editingSection) {
                const sectionName = editingSection.querySelector('.save-btn').getAttribute('data-section');
                portfolio.saveChanges(sectionName);
            }
        }

        // T key to toggle theme
        if (e.key === 't' || e.key === 'T') {
            if (!e.target.matches('input, textarea, [contenteditable="true"]')) {
                document.getElementById('theme-toggle').click();
            }
        }
    });

    // Add CSS for animations
    const animationStyles = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }

        .nav-link.active {
            color: var(--primary-color) !important;
        }

        .nav-link.active::after {
            width: 80% !important;
        }

        .notification {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .skill-item.editing .skill-name:focus {
            box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
        }

        /* Enhanced hover effects */
        .edit-btn:hover {
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        .save-btn:hover {
            box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        }

        .cancel-btn:hover {
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        }

        /* Loading states */
        .btn-loading {
            position: relative;
            color: transparent !important;
        }

        .btn-loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            transform: translate(-50%, -50%);
            color: white;
        }

        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Focus management */
        .editable.editing:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }

        /* Mobile enhancements */
        @media (max-width: 768px) {
            .notification {
                left: 10px;
                right: 10px;
                top: 10px;
                min-width: auto;
            }
        }
    `;

    // Inject animation styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);

    // Auto-save functionality (optional)
    let autoSaveTimeout;
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('editable') && e.target.classList.contains('editing')) {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                // Show auto-save indicator
                const indicator = document.createElement('span');
                indicator.textContent = ' ✓';
                indicator.style.color = '#27ae60';
                indicator.style.fontSize = '0.8em';
                indicator.className = 'auto-save-indicator';
                
                const existing = e.target.parentNode.querySelector('.auto-save-indicator');
                if (existing) existing.remove();
                
                e.target.parentNode.appendChild(indicator);
                
                setTimeout(() => indicator.remove(), 2000);
            }, 1000);
        }
    });

    // Enhanced error handling
    window.addEventListener('error', (e) => {
        console.error('Portfolio error:', e.error);
        portfolio.showNotification('Something went wrong. Please refresh the page.', 'error');
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Portfolio loaded in ${Math.round(loadTime)}ms`);
        });
    }

    // Data persistence warning
    window.addEventListener('beforeunload', (e) => {
        const hasUnsavedChanges = document.querySelector('.edit-controls[style*="flex"]');
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    });

    console.log('🎨 Portfolio initialized successfully!');
    console.log('💡 Keyboard shortcuts:');
    console.log('  - T: Toggle theme');
    console.log('  - ESC: Cancel editing');
    console.log('  - Ctrl+S: Save changes');
});