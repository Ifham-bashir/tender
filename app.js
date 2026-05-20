// ============================================
// TENDER — SKINCARE WEB APP
// Complete Modern JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollReveal();
    initMoodCheck();
    initGentleDay();
    initAnalyze();
    initProducts();
    initPauseDay();
    initSeasonal();
    initModals();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.pageYOffset > 50);
    }, { passive: true });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
    const els = document.querySelectorAll('.section-header, .mood-card, .ingredient-card, .voice-card, .seasonal-card, .pause-card, .trust-badge, .product-card');
    els.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(el => observer.observe(el));
}

// ============================================
// MOOD + SKIN PROBLEMS ROUTING
// ============================================
function initMoodCheck() {
    const moodCards = document.querySelectorAll('.mood-card');
    const skinProblems = document.getElementById('skinProblems');
    const problemChips = document.querySelectorAll('.problem-chip');
    const problemsDone = document.getElementById('problemsDone');
    const moodResult = document.getElementById('moodResult');

    let selectedMood = null;
    let selectedProblems = [];

    // Mood combos with skin problems
    const moodProblemRoutines = {
        calm: {
            acne: { title: 'Calm but breaking out', desc: 'Even calm skin can flare. The key is gentle consistency — no harsh treatments.', routine: ['Gentle salicylic cleanser', 'Niacinamide serum', 'Light gel moisturizer', 'SPF 30+'] },
            dryness: { title: 'Calm and thirsty', desc: 'Your skin is peaceful but needs more moisture. Time to layer up gently.', routine: ['Cream cleanser', 'Hyaluronic acid serum', 'Rich moisturizer', 'SPF 30+'] },
            sensitivity: { title: 'Calm but reactive', desc: 'Something is irritating your skin despite feeling okay emotionally. Strip back to basics.', routine: ['Micellar water', 'Centella serum', 'Barrier cream', 'Mineral SPF'] },
            redness: { title: 'Calm with warmth', desc: 'A little rosiness is normal. Focus on soothing, not correcting.', routine: ['Gentle cleanser', 'Azelaic acid (low %)', 'Soothing moisturizer', 'SPF 50+'] },
            texture: { title: 'Calm but bumpy', desc: 'Uneven texture needs patience. Gentle exfoliation, not scrubbing.', routine: ['Gentle cleanser', 'PHA exfoliant', 'Moisturizer', 'SPF 30+'] },
            oiliness: { title: 'Calm but shiny', desc: 'Your skin is producing extra sebum. Balance, don't strip.', routine: ['Gel cleanser', 'Niacinamide serum', 'Light moisturizer', 'Matte SPF'] },
            darkspots: { title: 'Calm with marks', desc: 'Old breakouts left their signature. Vitamin C will help fade them gently.', routine: ['Gentle cleanser', 'Vitamin C serum', 'Moisturizer', 'SPF 50+'] },
            lines: { title: 'Calm with softness', desc: 'Fine lines are stories, not flaws. Hydration and gentle retinoids help.', routine: ['Cream cleanser', 'Retinol (introductory)', 'Rich moisturizer', 'SPF 50+'] },
            nothing: { title: 'Everything feels balanced', desc: 'A beautiful place to be. Maintain with gentle care and consistent SPF.', routine: ['Gentle cleanser', 'Hydrating toner', 'Light moisturizer', 'SPF 30+'] }
        },
        stressed: {
            acne: { title: 'Stressed and breaking out', desc: 'Stress hormones trigger breakouts. Be extra gentle — your skin is already fighting.', routine: ['Micellar water', 'Centella serum', 'Barrier cream', 'SPF 30+'] },
            dryness: { title: 'Stressed and tight', desc: 'Stress dehydrates skin. Your barrier needs support, not stripping.', routine: ['Cream cleanser', 'Hyaluronic acid', 'Rich barrier cream', 'SPF 30+'] },
            sensitivity: { title: 'Stressed and stinging', desc: 'Stress lowers your skin's tolerance. Everything needs to be softer today.', routine: ['Water rinse only', 'Centella serum', 'Minimal moisturizer', 'Mineral SPF'] },
            redness: { title: 'Stressed and flushed', desc: 'Stress shows as warmth. Cool, calm, and soothe. No actives today.', routine: ['Cool water cleanse', 'Green tea serum', 'Soothing cream', 'SPF 30+'] },
            texture: { title: 'Stressed and rough', desc: 'Stress disrupts cell turnover. Gentle exfoliation only when calm returns.', routine: ['Gentle cleanser', 'Skip exfoliants today', 'Rich moisturizer', 'SPF 30+'] },
            oiliness: { title: 'Stressed and oily', desc: 'Stress triggers cortisol which boosts oil. Balance with niacinamide.', routine: ['Gentle gel cleanser', 'Niacinamide serum', 'Light moisturizer', 'SPF 30+'] },
            darkspots: { title: 'Stressed with marks', desc: 'Stress can darken old marks. Focus on calming first, fading second.', routine: ['Gentle cleanser', 'Skip vitamin C today', 'Rich moisturizer', 'SPF 50+'] },
            lines: { title: 'Stressed and tired-looking', desc: 'Stress ages skin temporarily. Sleep, water, and gentle care are the cure.', routine: ['Cream cleanser', 'Peptide serum', 'Rich eye cream', 'SPF 30+'] },
            nothing: { title: 'Stressed but skin is okay', desc: 'Your skin is holding up. Protect it while you process the stress.', routine: ['Gentle cleanser', 'Hydrating serum', 'Moisturizer', 'SPF 30+'] }
        },
        tired: {
            acne: { title: 'Tired and breaking out', desc: 'Lack of sleep weakens skin defense. Gentle care, early bedtime tonight.', routine: ['Micellar water', 'Tea tree spot treatment', 'Light moisturizer', 'SPF 30+'] },
            dryness: { title: 'Tired and parched', desc: 'Sleep is when skin repairs. Without it, your barrier is thirsty.', routine: ['Cream cleanser', 'Hyaluronic acid', 'Sleeping mask', 'SPF 30+'] },
            sensitivity: { title: 'Tired and reactive', desc: 'Exhausted skin has no defenses. Minimal routine, maximum rest.', routine: ['Water rinse', 'Minimal moisturizer', 'Mineral SPF', 'Sleep early'] },
            redness: { title: 'Tired and puffy', desc: 'Poor circulation from lack of sleep. Cool compresses and gentle massage.', routine: ['Cool water', 'Caffeine eye serum', 'Light moisturizer', 'SPF 30+'] },
            texture: { title: 'Tired and dull', desc: 'Cell turnover slows when tired. Vitamin C will bring back the glow.', routine: ['Gentle cleanser', 'Vitamin C serum', 'Moisturizer', 'SPF 30+'] },
            oiliness: { title: 'Tired and greasy', desc: 'Sleep deprivation increases oil. Cleanse well, but don't overdo it.', routine: ['Gel cleanser', 'Niacinamide', 'Light moisturizer', 'Matte SPF'] },
            darkspots: { title: 'Tired with dull marks', desc: 'Tired skin heals slower. Brightening helps, but sleep is the real fix.', routine: ['Gentle cleanser', 'Vitamin C serum', 'Moisturizer', 'SPF 50+'] },
            lines: { title: 'Tired and showing it', desc: 'Sleep deprivation shows as lines. Hydration plumps, rest restores.', routine: ['Cream cleanser', 'Hyaluronic acid', 'Rich moisturizer', 'SPF 30+'] },
            nothing: { title: 'Tired but skin survived', desc: 'Your skin is resilient. A simple routine and early night will fix everything.', routine: ['Gentle cleanser', 'Moisturizer', 'SPF 30+', 'Sleep early'] }
        },
        hopeful: {
            acne: { title: 'Hopeful about clearing acne', desc: 'Perfect time to start a gentle salicylic routine. Consistency is key.', routine: ['Salicylic cleanser', 'Niacinamide serum', 'Light moisturizer', 'SPF 30+'] },
            dryness: { title: 'Hopeful about hydration', desc: 'Layering hydration is your new practice. Start with hyaluronic acid.', routine: ['Cream cleanser', 'Hyaluronic essence', 'Rich moisturizer', 'SPF 30+'] },
            sensitivity: { title: 'Hopeful about calming skin', desc: 'Centella and oat are your new best friends. One ingredient at a time.', routine: ['Gentle cleanser', 'Centella serum', 'Barrier cream', 'Mineral SPF'] },
            redness: { title: 'Hopeful about even tone', desc: 'Azelaic acid is gentle but effective. Start low, go slow.', routine: ['Gentle cleanser', 'Azelaic acid (5%)', 'Moisturizer', 'SPF 50+'] },
            texture: { title: 'Hopeful about smooth skin', desc: 'PHAs are the gentle exfoliant you need. No irritation, just glow.', routine: ['Gentle cleanser', 'PHA toner', 'Moisturizer', 'SPF 30+'] },
            oiliness: { title: 'Hopeful about balance', desc: 'Niacinamide will change your skin. Give it 4-6 weeks.', routine: ['Gel cleanser', 'Niacinamide 10%', 'Light moisturizer', 'Matte SPF'] },
            darkspots: { title: 'Hopeful about fading marks', desc: 'Vitamin C + patience = fading. Protect with SPF every single day.', routine: ['Gentle cleanser', 'Vitamin C 15%', 'Moisturizer', 'SPF 50+'] },
            lines: { title: 'Hopeful about graceful aging', desc: 'Introductory retinol is perfect. Start once a week, build slowly.', routine: ['Cream cleanser', 'Retinol 0.3%', 'Rich moisturizer', 'SPF 50+'] },
            nothing: { title: 'Hopeful and ready to begin', desc: 'A 3-step starter kit is all you need. Build from here.', routine: ['Gentle cleanser', 'Moisturizer', 'SPF 30+', 'Patience'] }
        },
        overwhelmed: {
            acne: { title: 'Overwhelmed by breakouts', desc: 'Too many products probably caused this. Strip back to 3 items only.', routine: ['Gentle cleanser', 'Spot treatment', 'Light moisturizer', 'SPF 30+'] },
            dryness: { title: 'Overwhelmed by dryness', desc: 'Over-exfoliation is likely the cause. Stop everything, moisturize only.', routine: ['Water rinse', 'Rich moisturizer', 'SPF 30+', 'No actives for 2 weeks'] },
            sensitivity: { title: 'Overwhelmed and reactive', desc: 'Your skin is crying for simplicity. Three products. That's it.', routine: ['Micellar water', 'Minimal moisturizer', 'Mineral SPF', 'No actives'] },
            redness: { title: 'Overwhelmed and red', desc: 'Too many actives = inflammation. Stop everything except cleanse + moisturize + SPF.', routine: ['Gentle cleanser', 'Soothing moisturizer', 'SPF 30+', 'Rest'] },
            texture: { title: 'Overwhelmed by bumps', desc: 'Over-exfoliation causes texture too. Let your barrier heal first.', routine: ['Gentle cleanser', 'Moisturizer', 'SPF 30+', 'Wait 2 weeks'] },
            oiliness: { title: 'Overwhelmed by shine', desc: 'Stripping oil makes more oil. Gentle cleanse, light moisture, patience.', routine: ['Gentle gel cleanser', 'Light moisturizer', 'SPF 30+', 'No stripping'] },
            darkspots: { title: 'Overwhelmed by marks', desc: 'Fading takes months, not days. One brightening product, consistent SPF.', routine: ['Gentle cleanser', 'Vitamin C serum', 'Moisturizer', 'SPF 50+'] },
            lines: { title: 'Overwhelmed by aging fears', desc: 'No product reverses time. Hydration and SPF are enough. Really.', routine: ['Cream cleanser', 'Rich moisturizer', 'SPF 50+', 'Self-kindness'] },
            nothing: { title: 'Overwhelmed by too many steps', desc: 'Three products is a complete routine. Everything else is optional.', routine: ['Cleanser', 'Moisturizer', 'SPF 30+', 'That's it'] }
        }
    };

    moodCards.forEach(card => {
        card.addEventListener('click', () => {
            moodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedMood = card.dataset.mood;
            selectedProblems = [];
            problemChips.forEach(c => c.classList.remove('active'));

            skinProblems.classList.add('active');
            moodResult.classList.remove('active');

            setTimeout(() => {
                skinProblems.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });
    });

    problemChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const problem = chip.dataset.problem;

            if (problem === 'nothing') {
                problemChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedProblems = ['nothing'];
            } else {
                const nothingChip = document.querySelector('.problem-chip[data-problem="nothing"]');
                if (nothingChip) nothingChip.classList.remove('active');

                if (selectedProblems.includes('nothing')) {
                    selectedProblems = [];
                }

                if (selectedProblems.includes(problem)) {
                    selectedProblems = selectedProblems.filter(p => p !== problem);
                    chip.classList.remove('active');
                } else {
                    selectedProblems.push(problem);
                    chip.classList.add('active');
                }
            }
        });
    });

    problemsDone.addEventListener('click', () => {
        if (!selectedMood) {
            showToast('Select how you're feeling first');
            return;
        }

        const problem = selectedProblems[0] || 'nothing';
        const data = moodProblemRoutines[selectedMood]?.[problem];

        if (data) {
            moodResult.innerHTML = `
                <h4>${data.title}</h4>
                <p>${data.desc}</p>
                <div class="routine-preview">
                    ${data.routine.map(item => `<span class="routine-item">${item}</span>`).join('')}
                </div>
                <button class="btn btn-primary" style="margin-top: 24px;" onclick="showProductsForMood('${selectedMood}', '${problem}')">See matching products</button>
            `;
            moodResult.classList.add('active');
            moodResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// ============================================
// GENTLE DAY
// ============================================
function initGentleDay() {
    const toggle = document.getElementById('gentleToggle');
    toggle.addEventListener('change', () => {
        showToast(toggle.checked ? 'Gentle Day on. Cleanse + moisturize + SPF only.' : 'Gentle Day off. Full routine restored.');
    });
}

// ============================================
// PHOTO ANALYSIS
// ============================================
function initAnalyze() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const processing = document.getElementById('uploadProcessing');
    const results = document.getElementById('analyzeResults');
    const skipBtn = document.getElementById('skipAnalyze');
    const timelineSection = document.getElementById('timelineSection');
    const scanProductsBtn = document.getElementById('scanProductsBtn');

    uploadZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) processImage(e.target.files[0]);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => uploadZone.classList.add('dragover'));
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => uploadZone.classList.remove('dragover'));
    });

    uploadZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) processImage(files[0]);
    });

    function processImage(file) {
        processing.classList.add('active');

        const steps = processing.querySelectorAll('.step');
        let currentStep = 0;

        const stepInterval = setInterval(() => {
            steps.forEach((s, i) => s.classList.toggle('active', i === currentStep));
            currentStep++;
            if (currentStep >= steps.length) clearInterval(stepInterval);
        }, 600);

        setTimeout(() => {
            processing.classList.remove('active');
            results.classList.add('active');
            timelineSection.classList.add('active');

            results.querySelectorAll('.result-fill').forEach((bar, i) => {
                const target = bar.dataset.target;
                bar.style.width = '0%';
                setTimeout(() => bar.style.width = target + '%', i * 200);
            });

            // Save to timeline
            saveToTimeline(file);

            showToast('Analysis complete. Remember — observation, not diagnosis.');
        }, 3000);
    }

    function saveToTimeline(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const scans = JSON.parse(localStorage.getItem('tenderScans') || '[]');
            scans.push({
                date: new Date().toLocaleDateString(),
                image: e.target.result
            });
            localStorage.setItem('tenderScans', JSON.stringify(scans.slice(-5)));
            renderTimeline();
        };
        reader.readAsDataURL(file);
    }

    function renderTimeline() {
        const timeline = document.getElementById('timeline');
        const scans = JSON.parse(localStorage.getItem('tenderScans') || '[]');

        timeline.innerHTML = scans.map(scan => `
            <div class="timeline-item">
                <img src="${scan.image}" alt="Skin scan">
                <span>${scan.date}</span>
            </div>
        `).join('');
    }

    renderTimeline();

    skipBtn.addEventListener('click', () => {
        showToast('No problem. Tell us what you see in the mood check above.');
        document.getElementById('mood').scrollIntoView({ behavior: 'smooth' });
    });

    scanProductsBtn.addEventListener('click', () => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        showToast('Showing products for analyzed skin type');
    });
}

// ============================================
// PRODUCTS
// ============================================
function initProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const products = [
        {
            id: 1, brand: 'CeraVe', name: 'Hydrating Cleanser', price: '$15',
            category: 'cleanser', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
            why: 'Gentle, non-stripping cleanse with ceramides that protect your barrier.',
            ingredients: ['Ceramides', 'Hyaluronic Acid', 'Glycerin'],
            link: 'https://www.cerave.com'
        },
        {
            id: 2, brand: 'The Ordinary', name: 'Niacinamide 10% + Zinc', price: '$6',
            category: 'serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop',
            why: 'Balances oil, reduces redness, and strengthens skin barrier over time.',
            ingredients: ['Niacinamide', 'Zinc PCA', 'Glycerin'],
            link: 'https://theordinary.com'
        },
        {
            id: 3, brand: 'La Roche-Posay', name: 'Toleriane Double Repair', price: '$20',
            category: 'moisturizer', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop',
            why: 'Lightweight but deeply hydrating. Restores barrier without heaviness.',
            ingredients: ['Ceramides', 'Niacinamide', 'Glycerin'],
            link: 'https://www.laroche-posay.com'
        },
        {
            id: 4, brand: 'Supergoop', name: 'Unseen Sunscreen SPF 40', price: '$38',
            category: 'spf', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
            why: 'Invisible, weightless protection. The sunscreen that feels like nothing.',
            ingredients: ['Avobenzone', 'Homosalate', 'Red Algae'],
            link: 'https://supergoop.com'
        },
        {
            id: 5, brand: 'Paula's Choice', name: 'Skin Perfecting 2% BHA', price: '$35',
            category: 'serum', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop',
            why: 'Gentle salicylic acid that clears pores without irritation. Start slow.',
            ingredients: ['Salicylic Acid', 'Green Tea', 'Methylpropanediol'],
            link: 'https://www.paulaschoice.com'
        },
        {
            id: 6, brand: 'Vanicream', name: 'Daily Facial Moisturizer', price: '$9',
            category: 'moisturizer', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop',
            why: 'The most gentle moisturizer on the market. Zero irritants, pure comfort.',
            ingredients: ['Ceramides', 'Squalane', 'Hyaluronic Acid'],
            link: 'https://www.vanicream.com'
        },
        {
            id: 7, brand: 'Cetaphil', name: 'Gentle Skin Cleanser', price: '$10',
            category: 'cleanser', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
            why: 'Dermatologist-recommended for 70 years. As gentle as water, but cleansing.',
            ingredients: ['Water', 'Cetyl Alcohol', 'Propylene Glycol'],
            link: 'https://www.cetaphil.com'
        },
        {
            id: 8, brand: 'EltaMD', name: 'UV Clear SPF 46', price: '$39',
            category: 'spf', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
            why: 'The dermatologist favorite. Niacinamide + zinc for acne-prone skin.',
            ingredients: ['Zinc Oxide', 'Niacinamide', 'Hyaluronic Acid'],
            link: 'https://eltamd.com'
        },
        {
            id: 9, brand: 'The Inkey List', name: 'Hyaluronic Acid Serum', price: '$8',
            category: 'serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop',
            why: 'Pure hydration in a bottle. Plumps skin instantly, holds moisture all day.',
            ingredients: ['Hyaluronic Acid', 'Matrixyl 3000', 'Glycerin'],
            link: 'https://www.theinkeylist.com'
        }
    ];

    function renderProducts(filter = 'all') {
        const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

        productsGrid.innerHTML = filtered.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-content">
                    <span class="product-brand">${product.brand}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">${product.price}</div>
                    <p class="product-why">${product.why}</p>
                    <div class="product-ingredients">
                        ${product.ingredients.map(i => `<span class="product-ingredient">${i}</span>`).join('')}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="showProductDetail(${product.id})">View</button>
                        <a href="${product.link}" target="_blank" class="btn btn-secondary">Shop</a>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-observe new cards
        const newCards = productsGrid.querySelectorAll('.product-card');
        newCards.forEach(card => {
            card.classList.add('reveal');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(card);
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });

    renderProducts();
}

function showProductDetail(id) {
    const products = [
        { id: 1, brand: 'CeraVe', name: 'Hydrating Cleanser', price: '$15', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop', why: 'Gentle, non-stripping cleanse with ceramides that protect your barrier.', ingredients: ['Ceramides', 'Hyaluronic Acid', 'Glycerin'], link: 'https://www.cerave.com' },
        { id: 2, brand: 'The Ordinary', name: 'Niacinamide 10% + Zinc', price: '$6', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop', why: 'Balances oil, reduces redness, and strengthens skin barrier over time.', ingredients: ['Niacinamide', 'Zinc PCA', 'Glycerin'], link: 'https://theordinary.com' },
        { id: 3, brand: 'La Roche-Posay', name: 'Toleriane Double Repair', price: '$20', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop', why: 'Lightweight but deeply hydrating. Restores barrier without heaviness.', ingredients: ['Ceramides', 'Niacinamide', 'Glycerin'], link: 'https://www.laroche-posay.com' },
        { id: 4, brand: 'Supergoop', name: 'Unseen Sunscreen SPF 40', price: '$38', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', why: 'Invisible, weightless protection. The sunscreen that feels like nothing.', ingredients: ['Avobenzone', 'Homosalate', 'Red Algae'], link: 'https://supergoop.com' },
        { id: 5, brand: 'Paula's Choice', name: 'Skin Perfecting 2% BHA', price: '$35', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop', why: 'Gentle salicylic acid that clears pores without irritation. Start slow.', ingredients: ['Salicylic Acid', 'Green Tea', 'Methylpropanediol'], link: 'https://www.paulaschoice.com' },
        { id: 6, brand: 'Vanicream', name: 'Daily Facial Moisturizer', price: '$9', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop', why: 'The most gentle moisturizer on the market. Zero irritants, pure comfort.', ingredients: ['Ceramides', 'Squalane', 'Hyaluronic Acid'], link: 'https://www.vanicream.com' },
        { id: 7, brand: 'Cetaphil', name: 'Gentle Skin Cleanser', price: '$10', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop', why: 'Dermatologist-recommended for 70 years. As gentle as water, but cleansing.', ingredients: ['Water', 'Cetyl Alcohol', 'Propylene Glycol'], link: 'https://www.cetaphil.com' },
        { id: 8, brand: 'EltaMD', name: 'UV Clear SPF 46', price: '$39', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', why: 'The dermatologist favorite. Niacinamide + zinc for acne-prone skin.', ingredients: ['Zinc Oxide', 'Niacinamide', 'Hyaluronic Acid'], link: 'https://eltamd.com' },
        { id: 9, brand: 'The Inkey List', name: 'Hyaluronic Acid Serum', price: '$8', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop', why: 'Pure hydration in a bottle. Plumps skin instantly, holds moisture all day.', ingredients: ['Hyaluronic Acid', 'Matrixyl 3000', 'Glycerin'], link: 'https://www.theinkeylist.com' }
    ];

    const product = products.find(p => p.id === id);
    if (!product) return;

    const modalBody = document.getElementById('productModalBody');
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: var(--radius-md); object-fit: cover;">
            <div>
                <span class="section-label" style="margin-bottom: 8px;">${product.brand}</span>
                <h2 style="font-family: var(--font-serif); font-size: 1.75rem; margin-bottom: 8px; color: var(--charcoal);">${product.name}</h2>
                <div style="font-size: 1.25rem; font-weight: 600; color: var(--terracotta); margin-bottom: 16px;">${product.price}</div>
                <p style="color: var(--charcoal-soft); line-height: 1.7; margin-bottom: 20px;">${product.why}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px;">
                    ${product.ingredients.map(i => `<span style="padding: 4px 10px; background: var(--oatmeal); border-radius: var(--radius-full); font-size: 0.6875rem; color: var(--charcoal-soft);">${i}</span>`).join('')}
                </div>
                <a href="${product.link}" target="_blank" class="btn btn-primary" style="width: 100%;">Shop Now</a>
            </div>
        </div>
    `;

    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showProductsForMood(mood, problem) {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    showToast(`Showing products for ${mood} + ${problem} skin`);
}

// ============================================
// PAUSE
// ============================================
function initPauseDay() {
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseDays = document.getElementById('pauseDays');
    let isPaused = false;

    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;

        if (isPaused) {
            pauseBtn.innerHTML = '<span class="pause-icon">▶</span><span class="pause-text">Resume your routine</span>';
            pauseBtn.style.background = 'var(--sage)';
            pauseDays.querySelectorAll('.pause-day').forEach(day => {
                day.style.background = 'var(--sage)';
                day.style.color = 'var(--white)';
            });
            showToast('Skin fasting day started. Water, rest, and patience.');
        } else {
            pauseBtn.innerHTML = '<span class="pause-icon">⏸</span><span class="pause-text">Start a skin fasting day</span>';
            pauseBtn.style.background = 'var(--charcoal)';
            pauseDays.querySelectorAll('.pause-day').forEach((day, i) => {
                const active = [0, 2, 5].includes(i);
                day.style.background = active ? 'var(--sage)' : 'var(--oatmeal)';
                day.style.color = active ? 'var(--white)' : 'var(--charcoal-soft)';
            });
            showToast("Welcome back. Your routine is here when you're ready.");
        }
    });
}

// ============================================
// SEASONAL
// ============================================
function initSeasonal() {
    const month = new Date().getMonth();
    const data = {
        0: { icon: '🌸', temp: '18°C', title: 'Spring awakening', desc: 'Pollen season might be stirring things up. A gentle cleanser and barrier-supporting moisturizer will help your skin adjust.' },
        1: { icon: '🌸', temp: '20°C', title: 'Spring awakening', desc: 'Pollen season might be stirring things up. A gentle cleanser and barrier-supporting moisturizer will help your skin adjust.' },
        2: { icon: '🌸', temp: '22°C', title: 'Spring awakening', desc: 'Pollen season might be stirring things up. A gentle cleanser and barrier-supporting moisturizer will help your skin adjust.' },
        3: { icon: '☀️', temp: '28°C', title: 'Summer warmth', desc: 'Humidity and heat mean your skin might produce more oil. Lightweight layers and diligent SPF are your friends.' },
        4: { icon: '☀️', temp: '30°C', title: 'Summer warmth', desc: 'Humidity and heat mean your skin might produce more oil. Lightweight layers and diligent SPF are your friends.' },
        5: { icon: '☀️', temp: '32°C', title: 'Summer warmth', desc: 'Humidity and heat mean your skin might produce more oil. Lightweight layers and diligent SPF are your friends.' },
        6: { icon: '🍂', temp: '19°C', title: 'Autumn transition', desc: 'The air is getting drier. Time to layer up your moisture. Consider adding a hydrating serum before your moisturizer.' },
        7: { icon: '🍂', temp: '16°C', title: 'Autumn transition', desc: 'The air is getting drier. Time to layer up your moisture. Consider adding a hydrating serum before your moisturizer.' },
        8: { icon: '🍂', temp: '14°C', title: 'Autumn transition', desc: 'The air is getting drier. Time to layer up your moisture. Consider adding a hydrating serum before your moisturizer.' },
        9: { icon: '❄️', temp: '8°C', title: 'Winter stillness', desc: 'Cold air and indoor heating are tough on skin. Rich creams, facial oils, and humidifiers will help your barrier stay strong.' },
        10: { icon: '❄️', temp: '5°C', title: 'Winter stillness', desc: 'Cold air and indoor heating are tough on skin. Rich creams, facial oils, and humidifiers will help your barrier stay strong.' },
        11: { icon: '❄️', temp: '6°C', title: 'Winter stillness', desc: 'Cold air and indoor heating are tough on skin. Rich creams, facial oils, and humidifiers will help your barrier stay strong.' }
    }[month] || data[0];

    document.getElementById('seasonalIcon').textContent = data.icon;
    document.getElementById('seasonalTemp').textContent = data.temp;
    document.getElementById('seasonalTitle').textContent = data.title;
    document.getElementById('seasonalDesc').textContent = data.desc;
}

// ============================================
// MODALS
// ============================================
function initModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        const close = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', close);
        if (overlay) overlay.addEventListener('click', close);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(m => {
                m.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// ============================================
// TOAST
// ============================================
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: var(--charcoal);
        color: var(--white);
        padding: 14px 28px;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(61,61,61,0.16);
        z-index: 3000;
        opacity: 0;
        transition: all 0.4s ease;
        max-width: 90vw;
        text-align: center;
        line-height: 1.5;
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}
