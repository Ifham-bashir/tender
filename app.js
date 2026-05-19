/* Tender — Main Application Logic */
/* Gentle on you */

(function() {
    'use strict';

    // State
    const state = {
        mood: null,
        skinType: null,
        age: null,
        concerns: [],
        budget: null,
        climate: null,
        pregnancy: false,
        gentleDay: false,
        sensorResult: null,
        paused: false
    };

    // Mood reflections
    const moodReflections = {
        calm: "Your skin is probably feeling cooperative today. We'll keep things simple and nourishing.",
        stressed: "Stress shows up on skin. We'll focus on calming ingredients and a shorter routine.",
        tired: "You barely slept. We'll skip anything irritating and focus on hydration and rest.",
        hopeful: "You want to try something new. We'll suggest one gentle change, not a whole overhaul.",
        overwhelmed: "Too many steps already. We'll give you the bare minimum that still cares for your skin."
    };

    // Routine database
    const routineDB = {
        cleanser: {
            name: "Gentle Cleanser",
            desc: "Wash with something that doesn't strip your skin.",
            why: "Because even on tired days, your skin needs to breathe.",
            tags: ["fragrance-free", "pH-balanced"],
            alternatives: ["Micellar water", "Oil cleanse"]
        },
        moisturizer: {
            name: "Moisturizer",
            desc: "Seal in hydration with something your skin recognizes.",
            why: "Your barrier works hard. This is its support system.",
            tags: ["ceramides", "niacinamide"],
            alternatives: ["Light gel cream", "Rich balm"]
        },
        sunscreen: {
            name: "Sunscreen",
            desc: "Protection that feels like skincare, not a chore.",
            why: "The best anti-aging is prevention. But more than that, it's self-respect.",
            tags: ["SPF 30+", "no white cast"],
            alternatives: ["Tinted sunscreen", "Mineral powder SPF"]
        },
        serum: {
            name: "Hydrating Serum",
            desc: "A drink of water for your skin, under your moisturizer.",
            why: "When you're stressed, your skin loses water faster. This helps it hold on.",
            tags: ["hyaluronic acid", "glycerin"],
            alternatives: ["Essence", "Facial mist"]
        },
        treatment: {
            name: "Gentle Treatment",
            desc: "One active ingredient, used sparingly.",
            why: "We're not fixing you. Just helping your skin find its balance.",
            tags: ["azelaic acid", "low concentration"],
            alternatives: ["Skip tonight", "Spot treatment only"]
        },
        nightCream: {
            name: "Night Cream",
            desc: "A little richer than your day moisturizer. Let it work while you rest.",
            why: "Sleep is when your skin repairs. This gives it the tools.",
            tags: ["peptides", "squalane"],
            alternatives: ["Sleeping mask", "Facial oil"]
        }
    };

    // DOM refs
    const els = {
        moodGrid: document.getElementById('moodGrid'),
        moodReflection: document.getElementById('moodReflection'),
        fitzGrid: document.getElementById('fitzGrid'),
        ageGrid: document.getElementById('ageGrid'),
        concernsGrid: document.getElementById('concernsGrid'),
        budgetGrid: document.getElementById('budgetGrid'),
        climateGrid: document.getElementById('climateGrid'),
        pregnancyToggle: document.getElementById('pregnancyToggle'),
        generateBtn: document.getElementById('generateBtn'),
        resetBtn: document.getElementById('resetBtn'),
        sensorStart: document.getElementById('sensorStart'),
        sensorSkip: document.getElementById('sensorSkip'),
        sensorIdle: document.getElementById('sensorIdle'),
        sensorProcessing: document.getElementById('sensorProcessing'),
        sensorResult: document.getElementById('sensorResult'),
        sensorStatus: document.getElementById('sensorStatus'),
        sensorSubstatus: document.getElementById('sensorSubstatus'),
        sensorResultText: document.getElementById('sensorResultText'),
        sensorConfirm: document.getElementById('sensorConfirm'),
        sensorCorrect: document.getElementById('sensorCorrect'),
        resultsSection: document.getElementById('results'),
        resultsProfile: document.getElementById('resultsProfile'),
        resultsDesc: document.getElementById('resultsDesc'),
        stepsAm: document.getElementById('stepsAm'),
        stepsPm: document.getElementById('stepsPm'),
        tabAm: document.getElementById('tabAm'),
        tabPm: document.getElementById('tabPm'),
        routineAm: document.getElementById('routineAm'),
        routinePm: document.getElementById('routinePm'),
        pauseBtn: document.getElementById('pauseBtn'),
        pauseModal: document.getElementById('pauseModal'),
        pauseOverlay: document.getElementById('pauseOverlay'),
        resumeBtn: document.getElementById('resumeBtn'),
        notSureModal: document.getElementById('notSureModal'),
        notSureOverlay: document.getElementById('notSureOverlay'),
        notSureText: document.getElementById('notSureText'),
        notSureAlternatives: document.getElementById('notSureAlternatives'),
        notSureSkip: document.getElementById('notSureSkip'),
        notSureClose: document.getElementById('notSureClose'),
        gentleToggle: document.getElementById('gentleToggle'),
        navMenuBtn: document.getElementById('navMenuBtn'),
        navLinks: document.getElementById('navLinks')
    };

    // Helpers
    function selectRadio(group, selected) {
        group.querySelectorAll('[role="radio"]').forEach(el => {
            el.setAttribute('aria-checked', 'false');
            el.setAttribute('tabindex', '-1');
        });
        selected.setAttribute('aria-checked', 'true');
        selected.setAttribute('tabindex', '0');
    }

    function toggleCheckbox(el) {
        const checked = el.getAttribute('aria-checked') === 'true';
        el.setAttribute('aria-checked', !checked);
        return !checked;
    }

    function scrollTo(el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Mood selection
    els.moodGrid.addEventListener('click', e => {
        const card = e.target.closest('.mood-card');
        if (!card) return;

        selectRadio(els.moodGrid, card);
        state.mood = card.dataset.mood;

        els.moodReflection.textContent = moodReflections[state.mood];
        els.moodReflection.classList.add('active');
    });

    // Fitzpatrick
    els.fitzGrid.addEventListener('click', e => {
        const card = e.target.closest('.fitz-card');
        if (!card) return;
        selectRadio(els.fitzGrid, card);
        state.skinType = card.dataset.type;
    });

    // Age
    els.ageGrid.addEventListener('click', e => {
        const card = e.target.closest('.age-card');
        if (!card) return;
        selectRadio(els.ageGrid, card);
        state.age = card.dataset.age;
    });

    // Concerns (multi-select)
    els.concernsGrid.addEventListener('click', e => {
        const chip = e.target.closest('.option-chip');
        if (!chip) return;
        const checked = toggleCheckbox(chip);
        const concern = chip.dataset.concern;
        if (checked) {
            state.concerns.push(concern);
        } else {
            state.concerns = state.concerns.filter(c => c !== concern);
        }
    });

    // Budget
    els.budgetGrid.addEventListener('click', e => {
        const card = e.target.closest('.budget-card');
        if (!card) return;
        selectRadio(els.budgetGrid, card);
        state.budget = card.dataset.budget;
    });

    // Climate
    els.climateGrid.addEventListener('click', e => {
        const card = e.target.closest('.climate-card');
        if (!card) return;
        // Allow deselect
        const wasChecked = card.getAttribute('aria-checked') === 'true';
        els.climateGrid.querySelectorAll('[role="radio"]').forEach(el => {
            el.setAttribute('aria-checked', 'false');
        });
        if (!wasChecked) {
            card.setAttribute('aria-checked', 'true');
            state.climate = card.dataset.climate;
        } else {
            state.climate = null;
        }
    });

    // Pregnancy toggle
    els.pregnancyToggle.addEventListener('click', () => {
        const checked = els.pregnancyToggle.getAttribute('aria-checked') === 'true';
        els.pregnancyToggle.setAttribute('aria-checked', !checked);
        state.pregnancy = !checked;
    });

    // Skip buttons
    document.querySelectorAll('.btn-skip').forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.closest('.form-group');
            field.style.opacity = '0.6';
            btn.textContent = 'Skipped';
            btn.disabled = true;
        });
    });

    // Generate routine
    els.generateBtn.addEventListener('click', () => {
        if (!state.mood) {
            alert('Please tell us how you're feeling first.');
            scrollTo(els.moodGrid);
            return;
        }

        buildRoutine();
        els.resultsSection.hidden = false;
        scrollTo(els.resultsSection);
    });

    // Reset
    els.resetBtn.addEventListener('click', () => {
        state.mood = null;
        state.skinType = null;
        state.age = null;
        state.concerns = [];
        state.budget = null;
        state.climate = null;
        state.pregnancy = false;
        state.sensorResult = null;

        document.querySelectorAll('[role="radio"]').forEach(el => {
            el.setAttribute('aria-checked', 'false');
            el.setAttribute('tabindex', '-1');
        });
        document.querySelectorAll('[role="checkbox"]').forEach(el => {
            el.setAttribute('aria-checked', 'false');
        });
        els.pregnancyToggle.setAttribute('aria-checked', 'false');
        els.moodReflection.classList.remove('active');
        els.resultsSection.hidden = true;

        document.querySelectorAll('.form-group').forEach(g => {
            g.style.opacity = '1';
        });
        document.querySelectorAll('.btn-skip').forEach(b => {
            b.textContent = 'I'm not sure — skip this';
            b.disabled = false;
        });

        scrollTo(document.getElementById('mood'));
    });

    // Build routine
    function buildRoutine() {
        const amSteps = [];
        const pmSteps = [];

        // Base steps
        amSteps.push(createStep(1, routineDB.cleanser, 'am'));
        amSteps.push(createStep(2, routineDB.serum, 'am'));
        amSteps.push(createStep(3, routineDB.moisturizer, 'am'));
        amSteps.push(createStep(4, routineDB.sunscreen, 'am'));

        pmSteps.push(createStep(1, routineDB.cleanser, 'pm'));

        if (state.concerns.includes('acne') || state.concerns.includes('texture')) {
            pmSteps.push(createStep(2, routineDB.treatment, 'pm'));
        } else {
            pmSteps.push(createStep(2, routineDB.serum, 'pm'));
        }

        pmSteps.push(createStep(3, routineDB.moisturizer, 'pm'));
        pmSteps.push(createStep(4, routineDB.nightCream, 'pm'));

        // Gentle day: reduce steps
        if (state.gentleDay || state.mood === 'overwhelmed') {
            amSteps.length = Math.min(amSteps.length, 3);
            pmSteps.length = Math.min(pmSteps.length, 3);
        }

        // Budget: drugstore alternatives
        if (state.budget === 'nothing') {
            amSteps.forEach(s => s.budgetNote = 'Drugstore pick: CeraVe, Vanicream, or The Ordinary');
            pmSteps.forEach(s => s.budgetNote = 'Drugstore pick: CeraVe, Vanicream, or The Ordinary');
        }

        // Pregnancy filter
        if (state.pregnancy) {
            pmSteps.forEach(s => {
                if (s.tags.includes('retinol') || s.tags.includes('salicylic acid')) {
                    s.pregnancyNote = 'Skipped during pregnancy. Using azelaic acid instead.';
                }
            });
        }

        els.stepsAm.innerHTML = amSteps.map(renderStep).join('');
        els.stepsPm.innerHTML = pmSteps.map(renderStep).join('');

        els.resultsProfile.innerHTML = renderProfile();
        els.resultsDesc.textContent = `For when you're feeling ${state.mood}. This is a suggestion, not a rule.`;
    }

    function createStep(num, db, time) {
        return {
            num,
            ...db,
            time,
            budgetNote: null,
            pregnancyNote: null
        };
    }

    function renderStep(step) {
        return `
            <div class="step-card">
                <div class="step-number">${step.num}</div>
                <div class="step-content">
                    <h4 class="step-title">${step.name}</h4>
                    <p class="step-desc">${step.desc}</p>
                    <p class="step-why">${step.why}</p>
                    <div class="step-tags">
                        ${step.tags.map(t => `<span class="step-tag">${t}</span>`).join('')}
                        ${step.budgetNote ? `<span class="step-tag" style="background:#EDE8E0;color:#8C8680">${step.budgetNote}</span>` : ''}
                        ${step.pregnancyNote ? `<span class="step-tag" style="background:#C9A9A6;color:#fff">${step.pregnancyNote}</span>` : ''}
                    </div>
                    <button class="step-unsure" data-step="${step.name}" onclick="window.showNotSure('${step.name}', ${JSON.stringify(step.alternatives).replace(/"/g, '&quot;')})">
                        I'm not sure about this
                    </button>
                </div>
            </div>
        `;
    }

    function renderProfile() {
        const items = [
            { label: 'Mood', value: state.mood ? state.mood.charAt(0).toUpperCase() + state.mood.slice(1) : 'Not set' },
            { label: 'Skin type', value: state.skinType ? `Type ${state.skinType}` : 'Not set' },
            { label: 'Age', value: state.age ? state.age.charAt(0).toUpperCase() + state.age.slice(1) : 'Not set' },
            { label: 'Budget', value: state.budget ? state.budget.charAt(0).toUpperCase() + state.budget.slice(1) : 'Not set' },
            { label: 'Concerns', value: state.concerns.length ? state.concerns.join(', ') : 'None selected' },
            { label: 'Pregnancy safe', value: state.pregnancy ? 'Yes' : 'No' }
        ];

        return `
            <div class="profile-summary">
                ${items.map(item => `
                    <div class="profile-item">
                        <div class="profile-label">${item.label}</div>
                        <div class="profile-value">${item.value}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Not sure modal
    window.showNotSure = function(stepName, alternatives) {
        els.notSureText.textContent = `We suggested ${stepName} because it usually works well for your skin type and concerns. But you know your skin better than we do.`;

        const alts = JSON.parse(alternatives);
        els.notSureAlternatives.innerHTML = alts.map(alt => 
            `<button class="modal-alt-btn" onclick="window.swapStep('${stepName}', '${alt}')">Try ${alt} instead</button>`
        ).join('');

        els.notSureModal.hidden = false;
    };

    window.swapStep = function(oldStep, newStep) {
        els.notSureModal.hidden = false;
        // In a real app, this would swap the step in the DOM
        alert(`Swapped ${oldStep} for ${newStep}. (In the full app, this updates your routine live.)`);
    };

    els.notSureSkip.addEventListener('click', () => {
        els.notSureModal.hidden = true;
        alert("That's okay. Your routine works without it.");
    });

    els.notSureClose.addEventListener('click', () => {
        els.notSureModal.hidden = true;
    });

    els.notSureOverlay.addEventListener('click', () => {
        els.notSureModal.hidden = true;
    });

    // Sensor
    els.sensorStart.addEventListener('click', () => {
        // Simulate file picker
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
            if (input.files.length) {
                startSensorProcess();
            }
        };
        input.click();
    });

    els.sensorSkip.addEventListener('click', () => {
        scrollTo(document.getElementById('profile'));
    });

    function startSensorProcess() {
        els.sensorIdle.hidden = true;
        els.sensorProcessing.hidden = false;
        els.sensorResult.hidden = true;

        const statuses = [
            { main: 'Looking gently...', sub: 'Noticing texture' },
            { main: 'Looking gently...', sub: 'Noticing tone' },
            { main: 'Looking gently...', sub: 'Noticing hydration' },
            { main: 'Almost there...', sub: 'Putting it together' }
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < statuses.length) {
                els.sensorStatus.textContent = statuses[i].main;
                els.sensorSubstatus.textContent = statuses[i].sub;
                i++;
            } else {
                clearInterval(interval);
                showSensorResult();
            }
        }, 1200);
    }

    function showSensorResult() {
        els.sensorProcessing.hidden = true;
        els.sensorResult.hidden = false;

        // Mock result based on concerns
        let text = "We noticed your skin looks a bit dry today, with some texture around the cheeks.";
        if (state.concerns.includes('acne')) {
            text = "We noticed some active areas that might benefit from a gentler approach today.";
        } else if (state.concerns.includes('redness')) {
            text = "We noticed some rosiness that suggests your skin might be feeling sensitive right now.";
        }

        els.sensorResultText.textContent = text;
        state.sensorResult = text;
    }

    els.sensorConfirm.addEventListener('click', () => {
        scrollTo(document.getElementById('profile'));
    });

    els.sensorCorrect.addEventListener('click', () => {
        const correction = prompt("What did we get wrong?");
        if (correction) {
            alert("Thank you for telling us. We'll learn from this.");
            state.sensorResult = null;
            els.sensorResult.hidden = true;
            els.sensorIdle.hidden = false;
        }
    });

    // Routine tabs
    els.tabAm.addEventListener('click', () => {
        els.tabAm.classList.add('active');
        els.tabAm.setAttribute('aria-selected', 'true');
        els.tabPm.classList.remove('active');
        els.tabPm.setAttribute('aria-selected', 'false');
        els.routineAm.classList.add('active');
        els.routineAm.hidden = false;
        els.routinePm.classList.remove('active');
        els.routinePm.hidden = true;
    });

    els.tabPm.addEventListener('click', () => {
        els.tabPm.classList.add('active');
        els.tabPm.setAttribute('aria-selected', 'true');
        els.tabAm.classList.remove('active');
        els.tabAm.setAttribute('aria-selected', 'false');
        els.routinePm.classList.add('active');
        els.routinePm.hidden = false;
        els.routineAm.classList.remove('active');
        els.routineAm.hidden = true;
    });

    // Pause
    els.pauseBtn.addEventListener('click', () => {
        state.paused = true;
        els.pauseModal.hidden = false;
    });

    els.resumeBtn.addEventListener('click', () => {
        state.paused = false;
        els.pauseModal.hidden = true;
    });

    els.pauseOverlay.addEventListener('click', () => {
        els.pauseModal.hidden = true;
    });

    // Gentle Day toggle
    els.gentleToggle.addEventListener('click', () => {
        const pressed = els.gentleToggle.getAttribute('aria-pressed') === 'true';
        els.gentleToggle.setAttribute('aria-pressed', !pressed);
        state.gentleDay = !pressed;

        if (state.gentleDay) {
            els.gentleToggle.querySelector('.gentle-toggle__text').textContent = 'Gentle Day On';
            document.body.style.background = '#F0EDE6';
        } else {
            els.gentleToggle.querySelector('.gentle-toggle__text').textContent = 'Gentle Day';
            document.body.style.background = '#F5F1EB';
        }
    });

    // Mobile nav
    els.navMenuBtn.addEventListener('click', () => {
        const expanded = els.navMenuBtn.getAttribute('aria-expanded') === 'true';
        els.navMenuBtn.setAttribute('aria-expanded', !expanded);
        els.navLinks.classList.toggle('active');
    });

    // Keyboard navigation for radio groups
    function handleRadioKeys(group) {
        const radios = group.querySelectorAll('[role="radio"]');

        group.addEventListener('keydown', e => {
            const current = document.activeElement;
            const idx = Array.from(radios).indexOf(current);
            let next;

            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    next = radios[(idx + 1) % radios.length];
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    next = radios[(idx - 1 + radios.length) % radios.length];
                    break;
                case 'Home':
                    e.preventDefault();
                    next = radios[0];
                    break;
                case 'End':
                    e.preventDefault();
                    next = radios[radios.length - 1];
                    break;
            }

            if (next) {
                next.focus();
                next.click();
            }
        });
    }

    [els.moodGrid, els.fitzGrid, els.ageGrid, els.budgetGrid].forEach(handleRadioKeys);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                scrollTo(target);
            }
        });
    });

    console.log('Tender is ready. Gentle on you.');
})();
