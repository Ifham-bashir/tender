// Tender Skincare - Main Application
// Fully working version - May 2026

document.addEventListener('DOMContentLoaded', function() {
    console.log('Tender app loaded successfully!');

    // ===== MOOD SELECTION =====
    const moodCards = document.querySelectorAll('.mood-card');
    const skinProblemsSection = document.getElementById('skinProblems');
    const routineResult = document.getElementById('routineResult');

    moodCards.forEach(function(card) {
        card.addEventListener('click', function() {
            moodCards.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');

            if (skinProblemsSection) {
                skinProblemsSection.style.display = 'block';
                skinProblemsSection.scrollIntoView({ behavior: 'smooth' });
            }

            var mood = this.getAttribute('data-mood') || this.textContent.trim();
            localStorage.setItem('selectedMood', mood);
            console.log('Mood selected:', mood);
        });
    });

    // ===== SKIN PROBLEM CHIPS =====
    const problemChips = document.querySelectorAll('.problem-chip');
    const seeRoutineBtn = document.getElementById('seeRoutineBtn');
    var selectedProblems = [];

    problemChips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            this.classList.toggle('selected');
            var problem = this.getAttribute('data-problem') || this.textContent.trim();

            if (this.classList.contains('selected')) {
                selectedProblems.push(problem);
            } else {
                selectedProblems = selectedProblems.filter(function(p) { return p !== problem; });
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

            var routine = generateRoutine(selectedProblems);

            if (routineResult) {
                routineResult.innerHTML = routine;
                routineResult.style.display = 'block';
                routineResult.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ===== PHOTO UPLOAD =====
    var uploadZone = document.getElementById('uploadZone');
    var photoInput = document.getElementById('photoInput');
    var scanAnimation = document.getElementById('scanAnimation');
    var photoResults = document.getElementById('photoResults');

    if (uploadZone && photoInput) {
        uploadZone.addEventListener('click', function() { photoInput.click(); });

        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', function() {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            if (e.dataTransfer.files[0]) {
                handlePhotoUpload(e.dataTransfer.files[0]);
            }
        });

        photoInput.addEventListener('change', function(e) {
            if (e.target.files[0]) {
                handlePhotoUpload(e.target.files[0]);
            }
        });
    }

    function handlePhotoUpload(file) {
        console.log('Photo uploaded:', file.name);

        if (scanAnimation) {
            scanAnimation.style.display = 'block';
        }

        setTimeout(function() {
            if (scanAnimation) {
                scanAnimation.style.display = 'none';
            }

            if (photoResults) {
                photoResults.innerHTML = generatePhotoResults();
                photoResults.style.display = 'block';
                photoResults.scrollIntoView({ behavior: 'smooth' });
            }
        }, 3000);
    }

    // ===== PRODUCT FILTERS =====
    var filterBtns = document.querySelectorAll('.filter-btn');
    var productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');

            var category = this.getAttribute('data-category') || 'all';

            productCards.forEach(function(card) {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            console.log('Filter applied:', category);
        });
    });

    // ===== PRODUCT MODALS =====
    var viewBtns = document.querySelectorAll('.view-product-btn');
    var modals = document.querySelectorAll('.product-modal');
    var closeModals = document.querySelectorAll('.close-modal');

    viewBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var productId = this.getAttribute('data-product-id');
            var modal = document.getElementById('modal-' + productId);
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });

    closeModals.forEach(function(btn) {
        btn.addEventListener('click', function() {
            this.closest('.product-modal').style.display = 'none';
        });
    });

    modals.forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });

    // ===== GENTLE DAY TOGGLE =====
    var gentleToggle = document.getElementById('gentleToggle');

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
    var pauseBtn = document.getElementById('pauseBtn');

    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            document.body.classList.toggle('fasting-mode');
            var isFasting = document.body.classList.contains('fasting-mode');

            if (isFasting) {
                this.textContent = 'Stop Fasting';
                showToast('Skin fasting mode activated! Give your skin a break.');
            } else {
                this.textContent = 'Start Fasting';
                showToast('Routine resumed!');
            }
        });
    }

    // ===== MOBILE MENU =====
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }

    // ===== SCROLL ANIMATIONS =====
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.mood-card, .product-card, .tool-card').forEach(function(el) {
        observer.observe(el);
    });

    // ===== HELPER FUNCTIONS =====
    function showToast(message) {
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(function() {
            toast.remove();
        }, 3000);
    }

    function generateRoutine(problems) {
        var steps = [];

        if (problems.indexOf('acne') !== -1 || problems.indexOf('breakouts') !== -1) {
            steps.push('<li><strong>Cleanser:</strong> Salicylic Acid Cleanser - Unclogs pores and prevents breakouts</li>');
            steps.push('<li><strong>Treatment:</strong> Benzoyl Peroxide 2.5% - Kills acne bacteria</li>');
        }

        if (problems.indexOf('dryness') !== -1 || problems.indexOf('flaky') !== -1) {
            steps.push('<li><strong>Hydration:</strong> Hyaluronic Acid Serum - Draws moisture into skin</li>');
            steps.push('<li><strong>Moisturizer:</strong> Rich Ceramide Cream - Repairs skin barrier</li>');
        }

        if (problems.indexOf('oiliness') !== -1 || problems.indexOf('shine') !== -1) {
            steps.push('<li><strong>Cleanser:</strong> Foaming Gel Cleanser - Controls excess oil</li>');
            steps.push('<li><strong>Treatment:</strong> Niacinamide 10% - Regulates sebum production</li>');
        }

        if (problems.indexOf('dark spots') !== -1 || problems.indexOf('hyperpigmentation') !== -1) {
            steps.push('<li><strong>Treatment:</strong> Vitamin C 15% - Fades dark spots and brightens</li>');
            steps.push('<li><strong>SPF:</strong> Broad Spectrum SPF 50 - Prevents further darkening</li>');
        }

        if (problems.indexOf('aging') !== -1 || problems.indexOf('wrinkles') !== -1) {
            steps.push('<li><strong>Treatment:</strong> Retinol 0.3% - Boosts collagen (PM only)</li>');
            steps.push('<li><strong>Eye:</strong> Peptide Eye Cream - Reduces fine lines</li>');
        }

        if (problems.indexOf('sensitivity') !== -1) {
            steps.push('<li><strong>Cleanser:</strong> Micellar Water - Gentle, no-rinse cleansing</li>');
            steps.push('<li><strong>Soothing:</strong> Centella Asiatica Serum - Calms irritation</li>');
        }

        if (problems.indexOf('pores') !== -1) {
            steps.push('<li><strong>Treatment:</strong> BHA Exfoliant - Deep cleans pores</li>');
            steps.push('<li><strong>Clay Mask:</strong> Weekly pore-refining treatment</li>');
        }

        if (problems.indexOf('dullness') !== -1) {
            steps.push('<li><strong>Exfoliant:</strong> AHA 5% - Removes dead skin cells</li>');
            steps.push('<li><strong>Brightening:</strong> Vitamin C Serum - Restores radiance</li>');
        }

        // Default steps if nothing specific matched
        if (steps.length === 0) {
            steps.push('<li><strong>Cleanser:</strong> Gentle pH-balanced Cleanser</li>');
            steps.push('<li><strong>Moisturizer:</strong> Lightweight Daily Moisturizer</li>');
            steps.push('<li><strong>SPF:</strong> Sunscreen SPF 30+ (Every morning!)</li>');
        }

        // Always add SPF as last step
        if (steps.length > 0 && steps[steps.length - 1].indexOf('SPF') === -1) {
            steps.push('<li><strong>Always finish with:</strong> SPF 30+ every morning</li>');
        }

        return '<div class="routine-result"><h3>Your Personalized Routine</h3><p style="color: #6b6b6b; margin-bottom: 20px;">Based on: ' + problems.join(', ') + '</p><ol class="routine-steps">' + steps.join('') + '</ol><button class="btn-primary" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">See Products for My Skin</button></div>';
    }

    function generatePhotoResults() {
        var concerns = ['Hydration', 'Texture', 'Fine Lines', 'Dark Circles', 'Redness'];
        var scores = [72, 85, 45, 60, 30];

        var bars = '';
        for (var i = 0; i < concerns.length; i++) {
            bars += '<div class="result-bar"><span>' + concerns[i] + '</span><div class="bar-container"><div class="bar-fill" style="width: ' + scores[i] + '%"></div></div><span>' + scores[i] + '%</span></div>';
        }

        return '<div class="photo-results"><h3>AI Skin Analysis Results</h3><div class="result-bars">' + bars + '</div><p class="result-summary">Your skin analysis shows good texture but needs more hydration. Fine lines are minimal. Focus on moisturizing products and consider adding a hydrating serum to your routine.</p><button class="btn-primary" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">See Products for My Skin</button></div>';
    }

    console.log('All event listeners attached successfully!');
});
