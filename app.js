
# Create a clean, working app.js file
app_js = '''// Tender Skincare - Main Application
// Fully working version

document.addEventListener('DOMContentLoaded', function() {
    console.log('Tender app loaded successfully!');
    
    // ===== MOOD SELECTION =====
    const moodCards = document.querySelectorAll('.mood-card');
    const skinProblemsSection = document.getElementById('skinProblems');
    const routineResult = document.getElementById('routineResult');
    
    moodCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active from all
            moodCards.forEach(c => c.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            // Show skin problems
            if (skinProblemsSection) {
                skinProblemsSection.style.display = 'block';
                skinProblemsSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Store selected mood
            const mood = this.dataset.mood || this.textContent.trim();
            localStorage.setItem('selectedMood', mood);
            console.log('Mood selected:', mood);
        });
    });
    
    // ===== SKIN PROBLEM CHIPS =====
    const problemChips = document.querySelectorAll('.problem-chip');
    const seeRoutineBtn = document.getElementById('seeRoutineBtn');
    let selectedProblems = [];
    
    problemChips.forEach(chip => {
        chip.addEventListener('click', function() {
            this.classList.toggle('selected');
            const problem = this.dataset.problem || this.textContent.trim();
            
            if (this.classList.contains('selected')) {
                selectedProblems.push(problem);
            } else {
                selectedProblems = selectedProblems.filter(p => p !== problem);
            }
            
            console.log('Selected problems:', selectedProblems);
        });
    });
    
    // ===== SEE ROUTINE BUTTON =====
    if (seeRoutineBtn) {
        seeRoutineBtn.addEventListener('click', function() {
            if (selectedProblems.length === 0) {
                alert('Please select at least one skin concern!');
                return;
            }
            
            // Generate routine based on problems
            const routine = generateRoutine(selectedProblems);
            
            if (routineResult) {
                routineResult.innerHTML = routine;
                routineResult.style.display = 'block';
                routineResult.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // ===== PHOTO UPLOAD =====
    const uploadZone = document.getElementById('uploadZone');
    const photoInput = document.getElementById('photoInput');
    const scanAnimation = document.getElementById('scanAnimation');
    const photoResults = document.getElementById('photoResults');
    
    if (uploadZone && photoInput) {
        uploadZone.addEventListener('click', () => photoInput.click());
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            handlePhotoUpload(e.dataTransfer.files[0]);
        });
        
        photoInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                handlePhotoUpload(e.target.files[0]);
            }
        });
    }
    
    function handlePhotoUpload(file) {
        console.log('Photo uploaded:', file.name);
        
        // Show scanning animation
        if (scanAnimation) {
            scanAnimation.style.display = 'flex';
        }
        
        // Simulate scan for 3 seconds
        setTimeout(() => {
            if (scanAnimation) {
                scanAnimation.style.display = 'none';
            }
            
            // Show results
            if (photoResults) {
                photoResults.innerHTML = generatePhotoResults();
                photoResults.style.display = 'block';
                photoResults.scrollIntoView({ behavior: 'smooth' });
            }
        }, 3000);
    }
    
    // ===== PRODUCT FILTERS =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category || 'all';
            
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            console.log('Filter applied:', category);
        });
    });
    
    // ===== PRODUCT MODALS =====
    const viewBtns = document.querySelectorAll('.view-product-btn');
    const modals = document.querySelectorAll('.product-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const modal = document.getElementById('modal-' + productId);
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });
    
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.product-modal').style.display = 'none';
        });
    });
    
    // Close modal on outside click
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // ===== GENTLE DAY TOGGLE =====
    const gentleToggle = document.getElementById('gentleToggle');
    
    if (gentleToggle) {
        gentleToggle.addEventListener('change', function() {
            if (this.checked) {
                showToast('Gentle Day mode activated! Simplified routine enabled.');
                document.body.classList.add('gentle-mode');
            } else {
                document.body.classList.remove('gentle-mode');
            }
        });
    }
    
    // ===== PAUSE / SKIN FASTING =====
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            document.body.classList.toggle('fasting-mode');
            const isFasting = document.body.classList.contains('fasting-mode');
            
            if (isFasting) {
                this.textContent = 'Resume Routine';
                showToast('Skin fasting mode activated! Give your skin a break.');
            } else {
                this.textContent = 'Pause';
                showToast('Routine resumed!');
            }
        });
    }
    
    // ===== MOBILE MENU =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // ===== HELPER FUNCTIONS =====
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    function generateRoutine(problems) {
        let steps = [];
        
        if (problems.includes('acne') || problems.includes('breakouts')) {
            steps.push('<li><strong>Cleanser:</strong> Salicylic Acid Cleanser</li>');
            steps.push('<li><strong>Treatment:</strong> Benzoyl Peroxide Spot Treatment</li>');
        }
        
        if (problems.includes('dryness') || problems.includes('flaky')) {
            steps.push('<li><strong>Hydration:</strong> Hyaluronic Acid Serum</li>');
            steps.push('<li><strong>Moisturizer:</strong> Rich Ceramide Cream</li>');
        }
        
        if (problems.includes('oiliness') || problems.includes('shine')) {
            steps.push('<li><strong>Cleanser:</strong> Foaming Gel Cleanser</li>');
            steps.push('<li><strong>Treatment:</strong> Niacinamide Serum</li>');
        }
        
        if (problems.includes('dark spots') || problems.includes('hyperpigmentation')) {
            steps.push('<li><strong>Treatment:</strong> Vitamin C Serum</li>');
            steps.push('<li><strong>SPF:</strong> Broad Spectrum SPF 50</li>');
        }
        
        if (problems.includes('aging') || problems.includes('wrinkles')) {
            steps.push('<li><strong>Treatment:</strong> Retinol Serum (PM only)</li>');
            steps.push('<li><strong>Eye:</strong> Peptide Eye Cream</li>');
        }
        
        // Default steps if nothing specific matched
        if (steps.length === 0) {
            steps.push('<li><strong>Cleanser:</strong> Gentle Cleanser</li>');
            steps.push('<li><strong>Moisturizer:</strong> Daily Moisturizer</li>');
            steps.push('<li><strong>SPF:</strong> Sunscreen SPF 30+</li>');
        }
        
        return `
            <div class="routine-result">
                <h3>Your Personalized Routine</h3>
                <p>Based on: ${problems.join(', ')}</p>
                <ol class="routine-steps">
                    ${steps.join('')}
                </ol>
                <button class="btn-primary" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">
                    See Products for My Skin
                </button>
            </div>
        `;
    }
    
    function generatePhotoResults() {
        const concerns = ['Dryness', 'Uneven Texture', 'Fine Lines'];
        const scores = [65, 80, 45];
        
        let bars = '';
        concerns.forEach((concern, i) => {
            bars += `
                <div class="result-bar">
                    <span>${concern}</span>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${scores[i]}%"></div>
                    </div>
                    <span>${scores[i]}%</span>
                </div>
            `;
        });
        
        return `
            <div class="photo-results">
                <h3>Skin Analysis Results</h3>
                <div class="result-bars">
                    ${bars}
                </div>
                <p class="result-summary">Your skin shows mild dehydration and early signs of aging. Focus on hydration and antioxidant protection.</p>
                <button class="btn-primary" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">
                    See Products for My Skin
                </button>
            </div>
        `;
    }
    
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translate(-50%, 100px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        .fade-in {
            animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .bar-fill {
            animation: fillBar 1s ease forwards;
        }
        @keyframes fillBar {
            from { width: 0; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('All event listeners attached successfully!');
});
'''

# Save to file
with open('/mnt/agents/output/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("app.js created successfully!")
print(f"File size: {len(app_js)} characters")
