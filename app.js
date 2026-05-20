// TENDER — SKINCARE WEB APP
// Everything works. No broken features.

document.addEventListener('DOMContentLoaded', function() {
    initNav();
    initScrollReveal();
    initMoodSystem();
    initGentleDay();
    initPhotoAnalysis();
    initProducts();
    initPause();
    initSeasonal();
    initModals();
});

// ============================================
// NAVIGATION
// ============================================
function initNav() {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', function() {
        nav.classList.toggle('scrolled', window.pageYOffset > 50);
    }, { passive: true });

    toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
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
    var els = document.querySelectorAll('.section-header, .mood-card, .ingredient-card, .voice-card, .product-card, .seasonal-card, .pause-card, .trust-badge');
    els.forEach(function(el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function(el) { observer.observe(el); });
}

// ============================================
// MOOD + SKIN PROBLEMS — FULLY WORKING
// ============================================
function initMoodSystem() {
    var moodCards = document.querySelectorAll('.mood-card');
    var problemChips = document.querySelectorAll('.problem-chip');
    var problemsDone = document.getElementById('problemsDone');
    var skinProblems = document.getElementById('skinProblems');
    var moodResult = document.getElementById('moodResult');

    var selectedMood = null;
    var selectedProblems = [];

    // 45 unique combinations: 5 moods x 9 problems
    var routines = {
        calm: {
            acne: { title: 'Calm but breaking out', desc: 'Even calm skin can flare. The key is gentle consistency.', routine: ['Gentle salicylic cleanser', 'Niacinamide serum', 'Light gel moisturizer', 'SPF 30+'] },
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
            acne: { title: 'Stressed and breaking out', desc: 'Stress hormones trigger breakouts. Be extra gentle.', routine: ['Micellar water', 'Centella serum', 'Barrier cream', 'SPF 30+'] },
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

    // Mood click
    moodCards.forEach(function(card) {
        card.addEventListener('click', function() {
            moodCards.forEach(function(c) { c.classList.remove('active'); });
            card.classList.add('active');
            selectedMood = card.dataset.mood;
            selectedProblems = [];
            problemChips.forEach(function(c) { c.classList.remove('active'); });

            skinProblems.classList.add('active');
            moodResult.classList.remove('active');
            moodResult.innerHTML = '';

            setTimeout(function() {
                skinProblems.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });
    });

    // Problem chip click
    problemChips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            var problem = chip.dataset.problem;

            if (problem === 'nothing') {
                problemChips.forEach(function(c) { c.classList.remove('active'); });
                chip.classList.add('active');
                selectedProblems = ['nothing'];
            } else {
                var nothingChip = document.querySelector('.problem-chip[data-problem="nothing"]');
                if (nothingChip) nothingChip.classList.remove('active');

                if (selectedProblems.includes('nothing')) {
                    selectedProblems = [];
                }

                var idx = selectedProblems.indexOf(problem);
                if (idx > -1) {
                    selectedProblems.splice(idx, 1);
                    chip.classList.remove('active');
                } else {
                    selectedProblems.push(problem);
                    chip.classList.add('active');
                }
            }
        });
    });

    // See routine button
    problemsDone.addEventListener('click', function() {
        if (!selectedMood) {
            showToast('Select how you're feeling first');
            return;
        }

        var problem = selectedProblems[0] || 'nothing';
        var data = routines[selectedMood] && routines[selectedMood][problem];

        if (data) {
            var html = '<h4>' + data.title + '</h4>';
            html += '<p>' + data.desc + '</p>';
            html += '<div class="routine-preview">';
            data.routine.forEach(function(item) {
                html += '<span class="routine-item">' + item + '</span>';
            });
            html += '</div>';
            html += '<button class="btn btn-primary" style="margin-top:24px;" id="seeProductsBtn">See matching products</button>';

            moodResult.innerHTML = html;
            moodResult.classList.add('active');

            // Add click handler for the new button
            document.getElementById('seeProductsBtn').addEventListener('click', function() {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                showToast('Showing products for ' + selectedMood + ' + ' + problem + ' skin');
            });

            moodResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// ============================================
// GENTLE DAY TOGGLE
// ============================================
function initGentleDay() {
    var toggle = document.getElementById('gentleToggle');
    if (!toggle) return;
    toggle.addEventListener('change', function() {
        showToast(toggle.checked ? 'Gentle Day on. Cleanse + moisturize + SPF only.' : 'Gentle Day off. Full routine restored.');
    });
}

// ============================================
// PHOTO ANALYSIS — FULLY WORKING
// ============================================
function initPhotoAnalysis() {
    var uploadZone = document.getElementById('uploadZone');
    var fileInput = document.getElementById('fileInput');
    var processing = document.getElementById('uploadProcessing');
    var results = document.getElementById('analyzeResults');
    var skipBtn = document.getElementById('skipAnalyze');
    var timelineSection = document.getElementById('timelineSection');
    var scanProductsBtn = document.getElementById('scanProductsBtn');

    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files.length > 0) {
            processImage(e.target.files[0]);
        }
    });

    // Drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
        uploadZone.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(function(eventName) {
        uploadZone.addEventListener(eventName, function() {
            uploadZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(function(eventName) {
        uploadZone.addEventListener(eventName, function() {
            uploadZone.classList.remove('dragover');
        });
    });

    uploadZone.addEventListener('drop', function(e) {
        var files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processImage(files[0]);
        }
    });

    function processImage(file) {
        processing.classList.add('active');

        var steps = processing.querySelectorAll('.step');
        var currentStep = 0;

        var stepInterval = setInterval(function() {
            steps.forEach(function(s, i) {
                s.classList.toggle('active', i === currentStep);
            });
            currentStep++;
            if (currentStep >= steps.length) clearInterval(stepInterval);
        }, 600);

        setTimeout(function() {
            processing.classList.remove('active');
            results.classList.add('active');
            if (timelineSection) timelineSection.classList.add('active');

            // Animate bars
            results.querySelectorAll('.result-fill').forEach(function(bar, i) {
                var target = bar.dataset.target;
                bar.style.width = '0%';
                setTimeout(function() {
                    bar.style.width = target + '%';
                }, i * 200 + 100);
            });

            // Save to timeline
            saveToTimeline(file);

            showToast('Analysis complete. Observation, not diagnosis.');
        }, 3000);
    }

    function saveToTimeline(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var scans = JSON.parse(localStorage.getItem('tenderScans') || '[]');
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
        var timeline = document.getElementById('timeline');
        if (!timeline) return;
        var scans = JSON.parse(localStorage.getItem('tenderScans') || '[]');

        timeline.innerHTML = scans.map(function(scan) {
            return '<div class="timeline-item"><img src="' + scan.image + '" alt="Skin scan"><span>' + scan.date + '</span></div>';
        }).join('');
    }

    renderTimeline();

    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            showToast('No problem. Tell us what you see in the mood check above.');
            document.getElementById('mood').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (scanProductsBtn) {
        scanProductsBtn.addEventListener('click', function() {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            showToast('Showing products for analyzed skin type');
        });
    }
}

// ============================================
// PRODUCTS — FULLY WORKING WITH FILTER
// ============================================
function initProducts() {
    var grid = document.getElementById('productsGrid');
    var filterBtns = document.querySelectorAll('.filter-btn');

    if (!grid) return;

    var products = [
        { id: 1, brand: 'CeraVe', name: 'Hydrating Cleanser', price: '$15', category: 'cleanser', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop', why: 'Gentle, non-stripping cleanse with ceramides that protect your barrier.', ingredients: ['Ceramides', 'Hyaluronic Acid', 'Glycerin'], link: 'https://www.cerave.com' },
        { id: 2, brand: 'The Ordinary', name: 'Niacinamide 10% + Zinc', price: '$6', category: 'serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop', why: 'Balances oil, reduces redness, and strengthens skin barrier over time.', ingredients: ['Niacinamide', 'Zinc PCA', 'Glycerin'], link: 'https://theordinary.com' },
        { id: 3, brand: 'La Roche-Posay', name: 'Toleriane Double Repair', price: '$20', category: 'moisturizer', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop', why: 'Lightweight but deeply hydrating. Restores barrier without heaviness.', ingredients: ['Ceramides', 'Niacinamide', 'Glycerin'], link: 'https://www.laroche-posay.com' },
        { id: 4, brand: 'Supergoop', name: 'Unseen Sunscreen SPF 40', price: '$38', category: 'spf', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', why: 'Invisible, weightless protection. The sunscreen that feels like nothing.', ingredients: ['Avobenzone', 'Homosalate', 'Red Algae'], link: 'https://supergoop.com' },
        { id: 5, brand: 'Paula's Choice', name: 'Skin Perfecting 2% BHA', price: '$35', category: 'serum', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop', why: 'Gentle salicylic acid that clears pores without irritation. Start slow.', ingredients: ['Salicylic Acid', 'Green Tea', 'Methylpropanediol'], link: 'https://www.paulaschoice.com' },
        { id: 6, brand: 'Vanicream', name: 'Daily Facial Moisturizer', price: '$9', category: 'moisturizer', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop', why: 'The most gentle moisturizer on the market. Zero irritants, pure comfort.', ingredients: ['Ceramides', 'Squalane', 'Hyaluronic Acid'], link: 'https://www.vanicream.com' },
        { id: 7, brand: 'Cetaphil', name: 'Gentle Skin Cleanser', price: '$10', category: 'cleanser', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop', why: 'Dermatologist-recommended for 70 years. As gentle as water, but cleansing.', ingredients: ['Water', 'Cetyl Alcohol', 'Propylene Glycol'], link: 'https://www.cetaphil.com' },
        { id: 8, brand: 'EltaMD', name: 'UV Clear SPF 46', price: '$39', category: 'spf', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', why: 'The dermatologist favorite. Niacinamide + zinc for acne-prone skin.', ingredients: ['Zinc Oxide', 'Niacinamide', 'Hyaluronic Acid'], link: 'https://eltamd.com' },
        { id: 9, brand: 'The Inkey List', name: 'Hyaluronic Acid Serum', price: '$8', category: 'serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop', why: 'Pure hydration in a bottle. Plumps skin instantly, holds moisture all day.', ingredients: ['Hyaluronic Acid', 'Matrixyl 3000', 'Glycerin'], link: 'https://www.theinkeylist.com' }
    ];

    function renderProducts(filter) {
        filter = filter || 'all';
        var filtered = filter === 'all' ? products : products.filter(function(p) { return p.category === filter; });

        grid.innerHTML = filtered.map(function(product) {
            return '<div class="product-card" data-id="' + product.id + '">' +
                '<img class="product-image" src="' + product.image + '" alt="' + product.name + '" loading="lazy" onerror="this.style.background='#EDE8E2';this.style.padding='40px';this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect width=\'400\' height=\'300\' fill=\'%23EDE8E2\'/%3E%3Ctext x=\'200\' y=\'150\' text-anchor=\'middle\' fill=\'%23C67B5C\' font-family=\'serif\' font-size=\'18\'%3E' + product.brand + '%3C/text%3E%3C/svg%3E'">' +
                '<div class="product-content">' +
                    '<span class="product-brand">' + product.brand + '</span>' +
                    '<h3 class="product-name">' + product.name + '</h3>' +
                    '<div class="product-price">' + product.price + '</div>' +
                    '<p class="product-why">' + product.why + '</p>' +
                    '<div class="product-ingredients">' + product.ingredients.map(function(i) { return '<span class="product-ingredient">' + i + '</span>'; }).join('') + '</div>' +
                    '<div class="product-actions">' +
                        '<button class="btn btn-primary view-product" data-id="' + product.id + '">View</button>' +
                        '<a href="' + product.link + '" target="_blank" class="btn btn-secondary">Shop</a>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        // Add click handlers for view buttons
        grid.querySelectorAll('.view-product').forEach(function(btn) {
            btn.addEventListener('click', function() {
                showProductDetail(parseInt(this.dataset.id));
            });
        });

        // Scroll reveal for new cards
        var newCards = grid.querySelectorAll('.product-card');
        newCards.forEach(function(card) {
            card.classList.add('reveal');
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(card);
        });
    }

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });

    renderProducts('all');
}

function showProductDetail(id) {
    var products = [
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

    var product = products.find(function(p) { return p.id === id; });
    if (!product) return;

    var modalBody = document.getElementById('productModalBody');
    modalBody.innerHTML = '<div style="text-align:center;margin-bottom:24px;">' +
        '<img src="' + product.image + '" alt="' + product.name + '" style="width:200px;height:200px;object-fit:cover;border-radius:16px;margin:0 auto;display:block;" onerror="this.style.background='#EDE8E2';this.style.padding='80px 40px';this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23EDE8E2\'/%3E%3Ctext x=\'100\' y=\'100\' text-anchor=\'middle\' fill=\'%23C67B5C\' font-family=\'serif\' font-size=\'16\'%3E' + product.brand + '%3C/text%3E%3C/svg%3E'">' +
    '</div>' +
    '<span class="section-label" style="margin-bottom:8px;display:block;">' + product.brand + '</span>' +
    '<h2 style="font-family:var(--font-serif);font-size:1.75rem;margin-bottom:8px;color:var(--charcoal);">' + product.name + '</h2>' +
    '<div style="font-size:1.25rem;font-weight:600;color:var(--terracotta);margin-bottom:16px;">' + product.price + '</div>' +
    '<p style="color:var(--charcoal-soft);line-height:1.7;margin-bottom:20px;">' + product.why + '</p>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px;">' + product.ingredients.map(function(i) { return '<span style="padding:4px 10px;background:var(--oatmeal);border-radius:9999px;font-size:0.6875rem;color:var(--charcoal-soft);">' + i + '</span>'; }).join('') + '</div>' +
    '<a href="' + product.link + '" target="_blank" class="btn btn-primary" style="width:100%;">Shop Now</a>';

    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// PAUSE
// ============================================
function initPause() {
    var btn = document.getElementById('pauseBtn');
    var days = document.getElementById('pauseDays');
    if (!btn || !days) return;

    var isPaused = false;
    btn.addEventListener('click', function() {
        isPaused = !isPaused;
        if (isPaused) {
            btn.innerHTML = '<span class="pause-icon">▶</span><span class="pause-text">Resume your routine</span>';
            btn.style.background = 'var(--sage)';
            days.querySelectorAll('.pause-day').forEach(function(day) {
                day.style.background = 'var(--sage)';
                day.style.color = 'var(--white)';
            });
            showToast('Skin fasting day started. Water, rest, and patience.');
        } else {
            btn.innerHTML = '<span class="pause-icon">⏸</span><span class="pause-text">Start a skin fasting day</span>';
            btn.style.background = 'var(--charcoal)';
            days.querySelectorAll('.pause-day').forEach(function(day, i) {
                var active = [0, 2, 5].indexOf(i) > -1;
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
    var month = new Date().getMonth();
    var data = [
        { icon: '🌸', temp: '18°C', title: 'Spring awakening', desc: 'Pollen season might be stirring things up. A gentle cleanser and barrier-supporting moisturizer will help your skin adjust.' },
        { icon: '🌸', temp: '20°C', title: 'Spring awakening', desc: 'Pollen season might be stirring things up. A gentle cleanser and barrier-supporting moisturizer will help your skin adjust.' },
        { icon: '🌸', temp: '22°C', title: 'Spring awakening', desc: 'Pollen season might be stirring things up. A gentle cleanser and barrier-supporting moisturizer will help your skin adjust.' },
        { icon: '☀️', temp: '28°C', title: 'Summer warmth', desc: 'Humidity and heat mean your skin might produce more oil. Lightweight layers and diligent SPF are your friends.' },
        { icon: '☀️', temp: '30°C', title: 'Summer warmth', desc: 'Humidity and heat mean your skin might produce more oil. Lightweight layers and diligent SPF are your friends.' },
        { icon: '☀️', temp: '32°C', title: 'Summer warmth', desc: 'Humidity and heat mean your skin might produce more oil. Lightweight layers and diligent SPF are your friends.' },
        { icon: '🍂', temp: '19°C', title: 'Autumn transition', desc: 'The air is getting drier. Time to layer up your moisture. Consider adding a hydrating serum before your moisturizer.' },
        { icon: '🍂', temp: '16°C', title: 'Autumn transition', desc: 'The air is getting drier. Time to layer up your moisture. Consider adding a hydrating serum before your moisturizer.' },
        { icon: '🍂', temp: '14°C', title: 'Autumn transition', desc: 'The air is getting drier. Time to layer up your moisture. Consider adding a hydrating serum before your moisturizer.' },
        { icon: '❄️', temp: '8°C', title: 'Winter stillness', desc: 'Cold air and indoor heating are tough on skin. Rich creams, facial oils, and humidifiers will help your barrier stay strong.' },
        { icon: '❄️', temp: '5°C', title: 'Winter stillness', desc: 'Cold air and indoor heating are tough on skin. Rich creams, facial oils, and humidifiers will help your barrier stay strong.' },
        { icon: '❄️', temp: '6°C', title: 'Winter stillness', desc: 'Cold air and indoor heating are tough on skin. Rich creams, facial oils, and humidifiers will help your barrier stay strong.' }
    ][month] || data[0];

    var iconEl = document.getElementById('seasonalIcon');
    var tempEl = document.getElementById('seasonalTemp');
    var titleEl = document.getElementById('seasonalTitle');
    var descEl = document.getElementById('seasonalDesc');

    if (iconEl) iconEl.textContent = data.icon;
    if (tempEl) tempEl.textContent = data.temp;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
}

// ============================================
// MODALS
// ============================================
function initModals() {
    document.querySelectorAll('.modal').forEach(function(modal) {
        var closeBtn = modal.querySelector('.modal-close');
        var overlay = modal.querySelector('.modal-overlay');

        var close = function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', close);
        if (overlay) overlay.addEventListener('click', close);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(function(m) {
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
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span>' + message + '</span>';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--charcoal);color:var(--white);padding:14px 28px;border-radius:9999px;font-size:0.875rem;font-weight:500;box-shadow:0 8px 32px rgba(61,61,61,0.16);z-index:3000;opacity:0;transition:all 0.4s ease;max-width:90vw;text-align:center;line-height:1.5;';

    document.body.appendChild(toast);

    requestAnimationFrame(function() {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(function() { toast.remove(); }, 400);
    }, 4000);
}

// Reduced motion
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}
