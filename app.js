// Tender Skincare - Main Application
// Rebuilt to match the actual markup in index.html / style.css

document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       NAV / MOBILE MENU
       ===================================================== */
    var navToggle = document.getElementById('navToggle');
    var mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    /* =====================================================
       MOOD SELECTION
       ===================================================== */
    var moodCards = document.querySelectorAll('.mood-card');
    var skinProblems = document.getElementById('skinProblems');
    var moodResult = document.getElementById('moodResult');

    var moodCopy = {
        calm: "Good — let's keep it that way. Nothing fancy needed today.",
        stressed: "Stress shows up on skin too. We'll keep today's routine short and soothing.",
        tired: "Tired skin needs hydration more than actives right now. Let's go gentle.",
        hopeful: "Love that energy. Let's find a step worth adding.",
        overwhelmed: "Then we'll keep this simple — just the essentials, promise."
    };

    moodCards.forEach(function (card) {
        card.addEventListener('click', function () {
            moodCards.forEach(function (c) { c.classList.remove('active'); });
            this.classList.add('active');

            var mood = this.getAttribute('data-mood');
            localStorage.setItem('tender_mood', mood);

            if (moodResult) {
                moodResult.innerHTML =
                    '<h4>Noted.</h4><p>' + (moodCopy[mood] || '') + '</p>' +
                    '<div class="routine-preview"><span class="routine-item">Scroll down</span>' +
                    '<span class="routine-item">Tell us what your skin is showing today</span></div>';
                moodResult.classList.add('active');
            }

            if (skinProblems) {
                skinProblems.classList.add('active');
                skinProblems.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    /* =====================================================
       SKIN PROBLEM CHIPS + ROUTINE MODAL
       ===================================================== */
    var problemChips = document.querySelectorAll('.problem-chip');
    var problemsDoneBtn = document.getElementById('problemsDone');
    var selectedProblems = [];

    problemChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            this.classList.toggle('selected');
            var problem = this.getAttribute('data-problem');

            if (this.classList.contains('selected')) {
                selectedProblems.push(problem);
            } else {
                selectedProblems = selectedProblems.filter(function (p) { return p !== problem; });
            }
        });
    });

    if (problemsDoneBtn) {
        problemsDoneBtn.addEventListener('click', function () {
            if (selectedProblems.length === 0) {
                showToast('Pick at least one, or "Nothing particular" — totally fine either way.');
                return;
            }
            var body = document.getElementById('routineModalBody');
            if (body) {
                body.innerHTML = buildRoutine(selectedProblems);
            }
            openModal('routineModal');
        });
    }

    function buildRoutine(problems) {
        var steps = [];

        function has() {
            for (var i = 0; i < arguments.length; i++) {
                if (problems.indexOf(arguments[i]) !== -1) return true;
            }
            return false;
        }

        if (has('acne')) {
            steps.push('<li><strong>Cleanser:</strong> Salicylic acid cleanser — unclogs pores gently</li>');
            steps.push('<li><strong>Treatment:</strong> Benzoyl peroxide 2.5% — calms breakouts</li>');
        }
        if (has('dryness')) {
            steps.push('<li><strong>Hydration:</strong> Hyaluronic acid serum — draws in moisture</li>');
            steps.push('<li><strong>Moisturizer:</strong> Rich ceramide cream — repairs the barrier</li>');
        }
        if (has('sensitivity')) {
            steps.push('<li><strong>Cleanser:</strong> Micellar water — no-rinse and gentle</li>');
            steps.push('<li><strong>Soothing:</strong> Centella asiatica serum — calms irritation</li>');
        }
        if (has('redness')) {
            steps.push('<li><strong>Soothing:</strong> Oat + centella cream — reduces visible redness</li>');
        }
        if (has('texture')) {
            steps.push('<li><strong>Exfoliant:</strong> Gentle AHA 5% — smooths uneven texture</li>');
        }
        if (has('oiliness')) {
            steps.push('<li><strong>Cleanser:</strong> Foaming gel cleanser — controls shine</li>');
            steps.push('<li><strong>Treatment:</strong> Niacinamide 10% — balances oil</li>');
        }
        if (has('darkspots')) {
            steps.push('<li><strong>Treatment:</strong> Vitamin C 15% — fades marks over time</li>');
        }
        if (has('lines')) {
            steps.push('<li><strong>Treatment:</strong> Peptide serum — supports softness (PM)</li>');
        }

        if (steps.length === 0) {
            steps.push('<li><strong>Cleanser:</strong> Gentle pH-balanced cleanser</li>');
            steps.push('<li><strong>Moisturizer:</strong> Lightweight daily moisturizer</li>');
        }

        steps.push('<li><strong>Always finish with:</strong> SPF 30+ every morning</li>');

        var label = problems.length && problems[0] !== 'nothing'
            ? 'Based on: ' + problems.join(', ')
            : 'A simple, steady routine — nothing urgent, just consistent care.';

        return '<h3>Your personalized routine</h3>' +
            '<p style="color:#6b6b6b;margin-bottom:20px;">' + label + '</p>' +
            '<ol class="routine-steps">' + steps.join('') + '</ol>' +
            '<button class="btn btn-primary js-goto-products" style="margin-top:20px;width:100%;">See products for my skin</button>';
    }

    /* =====================================================
       PHOTO ANALYSIS (fully client-side — nothing is uploaded)
       ===================================================== */
    var uploadZone = document.getElementById('uploadZone');
    var fileInput = document.getElementById('fileInput');
    var uploadProcessing = document.getElementById('uploadProcessing');
    var analyzeResults = document.getElementById('analyzeResults');
    var timelineSection = document.getElementById('timelineSection');
    var timeline = document.getElementById('timeline');
    var skipAnalyze = document.getElementById('skipAnalyze');
    var scanProductsBtn = document.getElementById('scanProductsBtn');

    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', function (e) {
            if (e.target === fileInput) return;
            fileInput.click();
        });

        uploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', function () {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            if (e.dataTransfer.files[0]) {
                handlePhotoUpload(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', function (e) {
            if (e.target.files[0]) {
                handlePhotoUpload(e.target.files[0]);
            }
        });
    }

    function handlePhotoUpload(file) {
        if (!uploadProcessing) return;

        var steps = uploadProcessing.querySelectorAll('.step');
        var stepIndex = 0;
        steps.forEach(function (s) { s.classList.remove('active'); });
        if (steps[0]) steps[0].classList.add('active');

        uploadProcessing.classList.add('active');

        var stepTimer = setInterval(function () {
            stepIndex++;
            steps.forEach(function (s) { s.classList.remove('active'); });
            if (steps[stepIndex]) steps[stepIndex].classList.add('active');
        }, 700);

        setTimeout(function () {
            clearInterval(stepTimer);
            uploadProcessing.classList.remove('active');

            if (analyzeResults) {
                analyzeResults.classList.add('active');
                analyzeResults.querySelectorAll('.result-fill').forEach(function (fill) {
                    var target = fill.getAttribute('data-target') || 0;
                    requestAnimationFrame(function () {
                        fill.style.width = target + '%';
                    });
                });
                analyzeResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            addTimelineEntry(file);
        }, 3000);
    }

    function addTimelineEntry(file) {
        if (!timeline || !timelineSection) return;

        var item = document.createElement('div');
        item.className = 'timeline-item';

        var dateLabel = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        if (file && window.URL && window.URL.createObjectURL) {
            var img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = 'Skin check on ' + dateLabel;
            item.appendChild(img);
        }

        var span = document.createElement('span');
        span.textContent = dateLabel;
        item.appendChild(span);

        timeline.appendChild(item);
        timelineSection.classList.add('active');
    }

    if (skipAnalyze) {
        skipAnalyze.addEventListener('click', function () {
            scrollToId('products');
        });
    }

    if (scanProductsBtn) {
        scanProductsBtn.addEventListener('click', function () {
            scrollToId('products');
        });
    }

    /* =====================================================
       PRODUCTS: render, filter, view details
       ===================================================== */
    var products = [
        { id: 'p1', brand: 'Tender Lab', name: 'Oat Cream Cleanser', price: '$18', category: 'cleanser', why: 'A pH-balanced, fragrance-free cleanser that never strips.', ingredients: ['Oat Extract', 'Glycerin'], color: '#E8D5C4' },
        { id: 'p2', brand: 'Tender Lab', name: 'Foaming Clarity Wash', price: '$20', category: 'cleanser', why: 'Light foaming gel that clears excess oil without tightness.', ingredients: ['Niacinamide', 'Green Tea'], color: '#D4E4C4' },
        { id: 'p3', brand: 'Tender Lab', name: 'Hyaluronic Layer Serum', price: '$32', category: 'serum', why: 'Multi-weight hyaluronic acid for all-day, all-depth hydration.', ingredients: ['Hyaluronic Acid', 'Panthenol'], color: '#F5E6D3' },
        { id: 'p4', brand: 'Tender Lab', name: 'Centella Calm Serum', price: '$28', category: 'serum', why: 'Soothes redness and reactivity — good for sensitive days.', ingredients: ['Centella Asiatica', 'Allantoin'], color: '#E4DED4' },
        { id: 'p5', brand: 'Tender Lab', name: 'Vitamin C Brightening Drops', price: '$34', category: 'serum', why: 'Gentle 15% vitamin C that fades marks without irritation.', ingredients: ['Vitamin C', 'Ferulic Acid'], color: '#F0DCC0' },
        { id: 'p6', brand: 'Tender Lab', name: 'Ceramide Rich Cream', price: '$26', category: 'moisturizer', why: 'Barrier-repairing cream for dry, tight, or over-exfoliated skin.', ingredients: ['Ceramides', 'Squalane'], color: '#EAD9C8' },
        { id: 'p7', brand: 'Tender Lab', name: 'Weightless Gel Moisturizer', price: '$24', category: 'moisturizer', why: 'Oil-free hydration that layers well under makeup.', ingredients: ['Jojoba Oil', 'Aloe'], color: '#D9E2D1' },
        { id: 'p8', brand: 'Tender Lab', name: 'Everyday Mineral SPF 30', price: '$22', category: 'spf', why: 'Zinc-based, no white cast, gentle enough for daily use.', ingredients: ['Zinc Oxide', 'Rosehip Oil'], color: '#F2E8DC' },
        { id: 'p9', brand: 'Tender Lab', name: 'Tinted Mineral SPF 50', price: '$27', category: 'spf', why: 'Higher protection with a sheer tint for evened-out tone.', ingredients: ['Zinc Oxide', 'Iron Oxides'], color: '#E6CFC0' }
    ];

    var productsGrid = document.getElementById('productsGrid');
    var filterBtns = document.querySelectorAll('.filter-btn');

    function renderProducts(list) {
        if (!productsGrid) return;
        productsGrid.innerHTML = list.map(function (p) {
            return '<div class="product-card" data-category="' + p.category + '">' +
                '<div class="product-image" style="background:' + p.color + ';"></div>' +
                '<div class="product-content">' +
                '<div class="product-brand">' + p.brand + '</div>' +
                '<div class="product-name">' + p.name + '</div>' +
                '<div class="product-price">' + p.price + '</div>' +
                '<p class="product-why">' + p.why + '</p>' +
                '<div class="product-ingredients">' +
                p.ingredients.map(function (ing) { return '<span class="product-ingredient">' + ing + '</span>'; }).join('') +
                '</div>' +
                '<div class="product-actions">' +
                '<button class="btn btn-primary view-product-btn" data-product-id="' + p.id + '">View details</button>' +
                '</div></div></div>';
        }).join('');

        productsGrid.querySelectorAll('.view-product-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                openProductModal(this.getAttribute('data-product-id'));
            });
        });
    }

    function openProductModal(id) {
        var product = products.filter(function (p) { return p.id === id; })[0];
        var body = document.getElementById('productModalBody');
        if (!product || !body) return;

        body.innerHTML =
            '<div class="product-image" style="background:' + product.color + ';height:220px;border-radius:12px;margin-bottom:20px;"></div>' +
            '<div class="product-brand">' + product.brand + '</div>' +
            '<h3 class="product-name">' + product.name + '</h3>' +
            '<div class="product-price">' + product.price + '</div>' +
            '<p class="product-why">' + product.why + '</p>' +
            '<div class="product-ingredients">' +
            product.ingredients.map(function (ing) { return '<span class="product-ingredient">' + ing + '</span>'; }).join('') +
            '</div>';

        openModal('productModal');
    }

    renderProducts(products);

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            var filter = this.getAttribute('data-filter') || 'all';
            var filtered = filter === 'all' ? products : products.filter(function (p) { return p.category === filter; });
            renderProducts(filtered);
        });
    });

    /* =====================================================
       MODALS (shared open/close logic)
       ===================================================== */
    function openModal(id) {
        var modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.modal').forEach(function (modal) {
        var overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function () { closeModal(modal); });
        }
    });

    var productModalClose = document.getElementById('productModalClose');
    var routineModalClose = document.getElementById('routineModalClose');
    if (productModalClose) productModalClose.addEventListener('click', function () { closeModal(document.getElementById('productModal')); });
    if (routineModalClose) routineModalClose.addEventListener('click', function () { closeModal(document.getElementById('routineModal')); });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(function (m) { closeModal(m); });
        }
    });

    // "See products for my skin" buttons rendered inside modal HTML
    document.addEventListener('click', function (e) {
        if (e.target.classList && e.target.classList.contains('js-goto-products')) {
            document.querySelectorAll('.modal.active').forEach(function (m) { closeModal(m); });
            scrollToId('products');
        }
    });

    /* =====================================================
       GENTLE DAY TOGGLE
       ===================================================== */
    var gentleToggle = document.getElementById('gentleToggle');
    if (gentleToggle) {
        gentleToggle.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('gentle-mode');
                showToast('Gentle Day on — just cleanse, moisturize, and SPF today.');
            } else {
                document.body.classList.remove('gentle-mode');
            }
        });
    }

    /* =====================================================
       PAUSE / SKIN FASTING
       ===================================================== */
    var pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        var pauseText = pauseBtn.querySelector('.pause-text');
        pauseBtn.addEventListener('click', function () {
            document.body.classList.toggle('fasting-mode');
            var isFasting = document.body.classList.contains('fasting-mode');

            if (pauseText) {
                pauseText.textContent = isFasting ? 'Stop skin fasting' : 'Start a skin fasting day';
            }
            showToast(isFasting ? 'Skin fasting mode on. Water, rest, and time.' : 'Routine resumed — whenever you\'re ready.');
        });
    }

    /* =====================================================
       SCROLL REVEAL ANIMATIONS
       ===================================================== */
    var revealTargets = document.querySelectorAll(
        '.mood-card, .product-card, .ingredient-card, .voice-card, .timeline-item, .seasonal-card, .pause-card'
    );
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
    // Products render after this runs on first load, so observe them separately too
    document.querySelectorAll('.product-card').forEach(function (el) {
        el.classList.add('reveal');
        observer.observe(el);
    });

    /* =====================================================
       HELPERS
       ===================================================== */
    function scrollToId(id) {
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    function showToast(message) {
        var toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = [
            'position:fixed', 'left:50%', 'bottom:32px', 'transform:translateX(-50%)',
            'background:#3D3D3D', 'color:#fff', 'padding:12px 20px', 'border-radius:999px',
            'font-size:0.875rem', 'z-index:3000', 'box-shadow:0 8px 24px rgba(0,0,0,0.2)',
            'opacity:0', 'transition:opacity 0.3s ease'
        ].join(';');
        document.body.appendChild(toast);

        requestAnimationFrame(function () { toast.style.opacity = '1'; });

        setTimeout(function () {
            toast.style.opacity = '0';
            setTimeout(function () { toast.remove(); }, 300);
        }, 2800);
    }
});
