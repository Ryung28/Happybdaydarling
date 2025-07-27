// ===== GLOBAL VARIABLES =====
let heartTrailContainer;
let musicPlaying = false;
let backgroundMusic;
let mouseX = 0;
let mouseY = 0;
let heartTrailActive = true;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core features without external dependencies
    
    initializeHeartTrail();
    initializeCustomCursor();
    initializeMusicControl();
    initializeAnimations();
    initializePageSpecificFeatures();
    createFloatingHearts();
    createSparkles();
    
    // Initialize background music
    initBackgroundMusic();
    
    // Show floating message
    setTimeout(() => {
        const floatingMsg = document.getElementById('floating-message');
        if (floatingMsg) {
            floatingMsg.classList.add('show');
            setTimeout(() => {
                floatingMsg.classList.remove('show');
            }, 5000);
        }
    }, 3000);

    // Auto-play music on user interaction
    function initBackgroundMusic() {
        backgroundMusic = document.getElementById('birthday-song');
        const musicToggleBtn = document.getElementById('music-toggle');
        const musicTooltip = document.querySelector('.music-tooltip');

        if (backgroundMusic && musicToggleBtn) {
            // Attempt to play music on first user interaction
            document.body.addEventListener('click', function playMusicOnce() {
                if (!musicPlaying) {
                    backgroundMusic.play().then(() => {
                        musicPlaying = true;
                        musicToggleBtn.classList.add('playing');
                        musicToggleBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
                        if (musicTooltip) musicTooltip.textContent = 'Pause Music';
                    }).catch(error => {
                        console.log('Autoplay prevented:', error);
                    });
                }
                document.body.removeEventListener('click', playMusicOnce);
            });

            musicToggleBtn.addEventListener('click', function() {
                if (musicPlaying) {
                    backgroundMusic.pause();
                    musicPlaying = false;
                    musicToggleBtn.classList.remove('playing');
                    musicToggleBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
                    if (musicTooltip) musicTooltip.textContent = 'Play Music';
                } else {
                    backgroundMusic.play().then(() => {
                        musicPlaying = true;
                        musicToggleBtn.classList.add('playing');
                        musicToggleBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
                        if (musicTooltip) musicTooltip.textContent = 'Pause Music';
                    }).catch(error => {
                        console.log('Manual play prevented:', error);
                    });
                }
            });
        }
    }
});

// ===== HEART TRAIL SYSTEM =====
function initializeHeartTrail() {
    heartTrailContainer = document.getElementById('heart-trail');
    if (!heartTrailContainer) {
        heartTrailContainer = document.createElement('div');
        heartTrailContainer.id = 'heart-trail';
        document.body.appendChild(heartTrailContainer);
    }

    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (heartTrailActive) {
            createHeartTrail(e.clientX, e.clientY);
        }
    });

    // Create hearts on click
    document.addEventListener('click', function(e) {
        createHeartBurst(e.clientX, e.clientY);
    });
}

function createHeartTrail(x, y) {
    const hearts = ['💖', '💕', '💗', '💓', '💝', '💘', '💞', '💟'];
    const heart = document.createElement('div');
    heart.className = 'heart-trail';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
    heart.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    heartTrailContainer.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 2000);
}

function createHeartBurst(x, y, count = 8) {
    const burstCount = count;
    const hearts = ['💖', '💕', '💗', '💓', '💘', '💝', '❤️', '💞'];
    const colors = ['#ff69b4', '#ff1493', '#ff0066', '#ff3366', '#ff6b81', '#ff4d6d'];
    
    // Create a burst container for better performance
    const burstContainer = document.createElement('div');
    burstContainer.className = 'heart-burst-container';
    burstContainer.style.position = 'absolute';
    burstContainer.style.left = '0';
    burstContainer.style.top = '0';
    burstContainer.style.width = '100%';
    burstContainer.style.height = '100%';
    burstContainer.style.pointerEvents = 'none';
    burstContainer.style.zIndex = '9999';
    document.body.appendChild(burstContainer);
    
    // Create initial burst effect
    const burstRing = document.createElement('div');
    burstRing.className = 'burst-ring';
    burstRing.style.position = 'absolute';
    burstRing.style.left = x + 'px';
    burstRing.style.top = y + 'px';
    burstRing.style.width = '10px';
    burstRing.style.height = '10px';
    burstRing.style.borderRadius = '50%';
    burstRing.style.backgroundColor = 'rgba(255, 105, 180, 0.3)';
    burstRing.style.boxShadow = '0 0 20px rgba(255, 105, 180, 0.5)';
    burstRing.style.transform = 'translate(-50%, -50%)';
    burstRing.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
    burstContainer.appendChild(burstRing);
    
    // Animate the burst ring
    setTimeout(() => {
        burstRing.style.width = '100px';
        burstRing.style.height = '100px';
        burstRing.style.opacity = '0';
    }, 10);
    
    // Create hearts in a burst pattern
    for (let i = 0; i < burstCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-trail';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Calculate angle and distance for burst pattern
        const angle = (360 / burstCount) * i + Math.random() * 20 - 10; // Add some randomness
        const distance = Math.random() * 120 + 60; // Increased distance
        const finalX = x + Math.cos(angle * Math.PI / 180) * distance;
        const finalY = y + Math.sin(angle * Math.PI / 180) * distance;
        
        // Set initial position and style
        heart.style.position = 'absolute';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = (Math.random() * 15 + 20) + 'px';
        heart.style.transition = 'all 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)'; // Smoother easing
        heart.style.textShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`;
        heart.style.zIndex = '9999';
        heart.style.transform = 'scale(0.5) rotate(0deg)';
        
        burstContainer.appendChild(heart);
        
        // Animate to final position with delay based on index
        setTimeout(() => {
            heart.style.left = finalX + 'px';
            heart.style.top = finalY + 'px';
            heart.style.opacity = '0';
            heart.style.transform = `scale(0.3) rotate(${Math.random() * 180 - 90}deg)`;
        }, 10 + i * 30); // Staggered animation
    }
    
    // Remove the burst container after animation completes
    setTimeout(() => {
        if (burstContainer.parentNode) {
            burstContainer.parentNode.removeChild(burstContainer);
        }
    }, 1500);
}

// ===== CUSTOM CURSOR =====
function initializeCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '💖';
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.fontSize = '20px';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'all 0.1s ease';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Show default cursor on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.innerHTML = '👆💖';
            cursor.style.fontSize = '16px';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.innerHTML = '💖';
            cursor.style.fontSize = '20px';
        });
    });
}

// ===== FLOATING BACKGROUND HEARTS =====
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    if (!container) return;
    
    const hearts = ['💖', '💕', '💗', '💓', '💝', '💘', '💞', '💟'];
    
    setInterval(() => {
        if (document.querySelectorAll('.heart-bg').length < 15) {
            const heart = document.createElement('div');
            heart.className = 'heart-bg';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
            heart.style.opacity = Math.random() * 0.3 + 0.1;
            
            container.appendChild(heart);
            
            // Remove after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 20000);
        }
    }, 2000);
}

// ===== SPARKLE EFFECTS =====
function createSparkles() {
    const container = document.querySelector('.sparkles');
    if (!container) return;
    
    const sparkleSymbols = ['✨', '⭐', '🌟', '💫', '⚡'];
    
    setInterval(() => {
        if (document.querySelectorAll('.sparkle').length < 10) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = (Math.random() * 10 + 15) + 'px';
            sparkle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            container.appendChild(sparkle);
            
            // Remove after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 4000);
        }
    }, 1500);
}

// ===== MUSIC CONTROL =====
function initializeMusicControl() {
    const musicBtn = document.querySelector('.music-btn');
    const audioElement = document.getElementById('birthday-song');
    
    if (musicBtn && audioElement) {
        backgroundMusic = audioElement;
        
        musicBtn.addEventListener('click', function() {
            if (musicPlaying) {
                backgroundMusic.pause();
                musicBtn.classList.remove('playing');
                musicBtn.querySelector('i').classList.replace('fa-pause', 'fa-music');
                musicBtn.title = 'Play Music';
                musicPlaying = false;
                
                // Update tooltip
                const tooltip = musicBtn.querySelector('.music-tooltip');
                if (tooltip) tooltip.textContent = 'Play Music';
            } else {
                backgroundMusic.play().catch(e => {
                    console.log('Audio play failed:', e);
                });
                musicBtn.classList.add('playing');
                musicBtn.title = 'Pause Music';
                musicPlaying = true;
                
                // Update tooltip
                const tooltip = musicBtn.querySelector('.music-tooltip');
                if (tooltip) tooltip.textContent = 'Pause Music';
            }
        });
        
        // Auto-play attempt (may be blocked by browser)
        setTimeout(() => {
            backgroundMusic.play().then(() => {
                musicBtn.classList.add('playing');
                musicPlaying = true;
                
                // Update tooltip
                const tooltip = musicBtn.querySelector('.music-tooltip');
                if (tooltip) tooltip.textContent = 'Pause Music';
            }).catch(e => {
                console.log('Auto-play blocked:', e);
            });
        }, 1000);
    } else {
        // If elements not found, call initBackgroundMusic to create them
        initBackgroundMusic();
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Animate title words
    const titleWords = document.querySelectorAll('.word');
    titleWords.forEach((word, index) => {
        word.style.animationDelay = (index * 0.2) + 's';
    });
    
    // Animate cards using AOS (handled by data-aos attributes in HTML)
    // No custom IntersectionObserver needed here for initial visibility

}

// ===== PAGE-SPECIFIC FEATURES =====
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeMainPage();
            break;
        case 'memories.html':
            initializeMemoriesPage();
            break;
        case 'birthday.html':
            // Birthday page initialization
            break;
        case 'confirmation.html':
            initializeConfirmationPage();
            break;
    }
}

// ===== MAIN PAGE FEATURES =====
function initializeMainPage() {
    // Love meter animation with interactive elements
    const meterFill = document.querySelector('.meter-fill');
    const meterValue = document.querySelector('.meter-value');
    const meterIcons = document.querySelector('.meter-icons');
    const meterBar = document.querySelector('.meter-bar');

    if (meterFill && meterValue) {
        let percentage = 0;
        const targetPercentage = 100;
        const duration = 2000; // 2 seconds
        const intervalTime = 20; // milliseconds
        const increment = (targetPercentage / (duration / intervalTime));

        const animateMeter = setInterval(() => {
            percentage += increment;
            if (percentage >= targetPercentage) {
                percentage = targetPercentage;
                clearInterval(animateMeter);
            }
            meterFill.style.width = `${percentage}%`;
            meterValue.textContent = `${Math.floor(percentage)}%`;
        }, intervalTime);
        
        // Add floating icons animation
        if (meterIcons) {
            const icons = ['❤️', '💖', '💕', '💓', '💗', '💘', '💝'];
            setInterval(() => {
                if (Math.random() > 0.6) { // Increased frequency of icons
                    const icon = document.createElement('span');
                    icon.className = 'meter-icon';
                    icon.textContent = icons[Math.floor(Math.random() * icons.length)];
                    icon.style.left = `${Math.random() * 100}%`;
                    icon.style.top = `${Math.random() * 100}%`;
                    // Add random size variation
                    const size = 14 + Math.random() * 8; // Random size between 14px and 22px
                    icon.style.fontSize = `${size}px`;
                    // Add random animation duration
                    const duration = 2 + Math.random() * 2; // Random duration between 2s and 4s
                    icon.style.animationDuration = `${duration}s`;
                    
                    meterIcons.appendChild(icon);
                    
                    // Remove the icon after animation completes
                    setTimeout(() => {
                        if (icon && icon.parentNode) {
                            icon.parentNode.removeChild(icon);
                        }
                    }, duration * 1000);
                }
            }, 250); // Slightly faster interval
        }
    }
    
    // Make the meter interactive
    if (meterBar) {
        meterBar.addEventListener('click', function(e) {
            // Calculate percentage based on click position
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.min(100, Math.max(0, Math.round((x / rect.width) * 100)));
            
            // Animate to the new percentage
            meterFill.style.width = `${percentage}%`;
            if (meterValue) meterValue.textContent = `${percentage}%`;
            
            // Always return to 100% after a delay
            setTimeout(() => {
                meterFill.style.width = '100%';
                if (meterValue) meterValue.textContent = '100%';
            }, 2000);
            
            // Create enhanced heart burst at click position
            createHeartBurst(e.clientX, e.clientY, 15); // More hearts
            
            // Add a special message based on the percentage
            let message = '';
            if (percentage < 20) {
                message = 'Just the beginning of our journey! ❤️';
            } else if (percentage < 40) {
                message = 'Growing stronger every day! 💖';
            } else if (percentage < 60) {
                message = 'Our love is blooming! 💕';
            } else if (percentage < 80) {
                message = 'So deeply in love with you! 💓';
            } else {
                message = 'Infinite love, forever and always! 💘';
            }
            
            // Display the message
            const meterMessage = document.querySelector('.meter-message');
            if (meterMessage) {
                meterMessage.textContent = message;
                meterMessage.style.animation = 'none';
                setTimeout(() => {
                    meterMessage.style.animation = 'underlineGlow 3s infinite';
                }, 10);
            }
        });
    }
    
    // Continue button effects with enhanced interaction
    const continueBtn = document.querySelector('.continue-btn');
    if (continueBtn) {
        // Add hover effect with heart burst
        continueBtn.addEventListener('mouseenter', function() {
            createHeartBurst(this.offsetLeft + this.offsetWidth/2, this.offsetTop + this.offsetHeight/2, 12);
            this.classList.add('btn-hover');
            
            // Animate the button hearts
            const btnHearts = this.querySelectorAll('.fa-heart');
            btnHearts.forEach((heart, index) => {
                heart.style.animation = `btnHeartBeat 1s ${index * 0.1}s`;
            });
        });
        
        // Reset animations on mouse leave
        continueBtn.addEventListener('mouseleave', function() {
            this.classList.remove('btn-hover');
            
            // Reset heart animations
            const btnHearts = this.querySelectorAll('.fa-heart');
            btnHearts.forEach(heart => {
                heart.style.animation = '';
            });
        });
        
        // Add click effect
        continueBtn.addEventListener('click', function() {
            // Create a larger heart burst
            createHeartBurst(this.offsetLeft + this.offsetWidth/2, this.offsetTop + this.offsetHeight/2, 20);
            
            // Add a transition effect before navigation
            document.body.classList.add('page-transition');
            
            // Delay navigation slightly for effect
            setTimeout(() => {
                window.location.href = 'memories.html';
            }, 500);
        });
    }
    
    // Image hover effects
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('click', function() {
            createHeartBurst(
                this.offsetLeft + this.offsetWidth/2,
                this.offsetTop + this.offsetHeight/2
            );
        });
    }
}

// ===== MEMORIES PAGE FEATURES =====
function initializeMemoriesPage() {
    // Photo gallery interactions
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(item => {
        item.addEventListener('click', function() {
            const rect = this.getBoundingClientRect();
            createHeartBurst(
                rect.left + rect.width/2,
                rect.top + rect.height/2
            );
        });
    });
    
    // Animate stats counters
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(currentValue);
            }
        }, 50);
    });
}

// ===== DATE PLANNER PAGE FEATURES =====
function initializeDatePlannerPage() {
    const form = document.querySelector('.planning-form');
    const dateInput = document.getElementById('date-input');
    const timeOptions = document.querySelectorAll('input[name="time"]');
    const activityOptions = document.querySelectorAll('input[name="activity"]');
    const specialRequests = document.getElementById('special-requests');
    const previewSection = document.querySelector('.date-preview');
    
    // Set minimum date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set default date to next weekend
        const nextWeekend = new Date();
        nextWeekend.setDate(nextWeekend.getDate() + (6 - nextWeekend.getDay()));
        dateInput.value = nextWeekend.toISOString().split('T')[0];
    }
    
    // Form validation and preview update
    function updatePreview() {
        const selectedDate = dateInput?.value;
        const selectedTime = document.querySelector('input[name="time"]:checked')?.value;
        const selectedActivity = document.querySelector('input[name="activity"]:checked')?.value;
        const requests = specialRequests?.value;
        
        if (selectedDate && selectedTime && selectedActivity) {
            updateDatePreview(selectedDate, selectedTime, selectedActivity, requests);
            if (previewSection) {
                previewSection.style.display = 'block';
            }
        }
    }
    
    // Add event listeners
    if (dateInput) dateInput.addEventListener('change', updatePreview);
    timeOptions.forEach(option => option.addEventListener('change', updatePreview));
    activityOptions.forEach(option => option.addEventListener('change', updatePreview));
    if (specialRequests) specialRequests.addEventListener('input', updatePreview);
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                date: dateInput?.value,
                time: document.querySelector('input[name="time"]:checked')?.value,
                activity: document.querySelector('input[name="activity"]:checked')?.value,
                requests: specialRequests?.value || ''
            };
            
            // Store data in localStorage
            localStorage.setItem('plannedDate', JSON.stringify(formData));
            
            // Navigate to confirmation page
            window.location.href = 'confirmation.html';
        });
    }
    
    // Initialize preview
    setTimeout(updatePreview, 500);
}

function updateDatePreview(date, time, activity, requests) {
    const preview = document.querySelector('.date-preview');
    if (!preview) return;
    
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const timeLabels = {
        'morning': '☀️ Morning (10:00 AM)',
        'afternoon': '🌤️ Afternoon (2:00 PM)',
        'evening': '🌅 Evening (6:00 PM)',
        'night': '🌙 Night (8:00 PM)'
    };
    
    const activityLabels = {
        'pizza': '🍕 Pizza Date',
        'london': '🏛️ London Adventure',
        'movie': '🎬 Movie Night'
    };
    
    preview.innerHTML = `
        <h3>✨ Our Perfect Date Preview ✨</h3>
        <div class="preview-content">
            <div class="preview-item">
                <i class="fas fa-calendar-alt"></i>
                <span>${formattedDate}</span>
            </div>
            <div class="preview-item">
                <i class="fas fa-clock"></i>
                <span>${timeLabels[time] || time}</span>
            </div>
            <div class="preview-item">
                <i class="fas fa-heart"></i>
                <span>${activityLabels[activity] || activity}</span>
            </div>
            ${requests ? `
            <div class="preview-item">
                <i class="fas fa-star"></i>
                <span>Special: ${requests}</span>
            </div>
            ` : ''}
        </div>
    `;
}

// ===== CONFIRMATION PAGE FEATURES =====
function initializeConfirmationPage() {
    // Load planned date data
    const plannedDate = JSON.parse(localStorage.getItem('plannedDate') || '{}');
    
    if (plannedDate.date) {
        populateConfirmationDetails(plannedDate);
        initializeCountdown(plannedDate.date, plannedDate.time);
    }
    
    // Initialize celebration effects
    createCelebrationEffects();
    
    // Initialize action buttons
    initializeActionButtons();
    
    // Initialize calendar integration
    initializeCalendarIntegration(plannedDate);
}

function populateConfirmationDetails(dateData) {
    const dateObj = new Date(dateData.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const timeLabels = {
        'morning': 'Morning (10:00 AM)',
        'afternoon': 'Afternoon (2:00 PM)',
        'evening': 'Evening (6:00 PM)',
        'night': 'Night (8:00 PM)'
    };
    
    const activityDetails = {
        'pizza': {
            name: 'Romantic Pizza Date',
            icon: '🍕',
            description: 'A cozy evening sharing delicious pizza and creating sweet memories together.'
        },
        'london': {
            name: 'London Adventure',
            icon: '🏛️',
            description: 'Exploring the beautiful city of London, hand in hand, discovering new places together.'
        },
        'movie': {
            name: 'Movie Night',
            icon: '🎬',
            description: 'Snuggling together while watching a romantic movie with popcorn and cuddles.'
        }
    };
    
    // Update date details
    const dateElement = document.querySelector('[data-detail="date"] p');
    if (dateElement) dateElement.textContent = formattedDate;
    
    const timeElement = document.querySelector('[data-detail="time"] p');
    if (timeElement) timeElement.textContent = timeLabels[dateData.time] || dateData.time;
    
    const activityElement = document.querySelector('[data-detail="activity"] p');
    if (activityElement) activityElement.textContent = activityDetails[dateData.activity]?.name || dateData.activity;
    
    const requestsElement = document.querySelector('[data-detail="requests"] p');
    if (requestsElement) {
        requestsElement.textContent = dateData.requests || 'No special requests';
        if (!dateData.requests) {
            requestsElement.parentElement.style.display = 'none';
        }
    }
    
    // Update activity preview
    const activityPreview = document.querySelector('.activity-preview');
    if (activityPreview && activityDetails[dateData.activity]) {
        const activity = activityDetails[dateData.activity];
        activityPreview.innerHTML = `
            <div class="preview-content">
                <div class="preview-icon">${activity.icon}</div>
                <div class="preview-text">
                    <h4>${activity.name}</h4>
                    <p>${activity.description}</p>
                </div>
            </div>
        `;
    }
}

function initializeCountdown(dateString, timeString) {
    const targetDate = new Date(dateString);
    
    // Set time based on selection
    const timeMap = {
        'morning': [10, 0],
        'afternoon': [14, 0],
        'evening': [18, 0],
        'night': [20, 0]
    };
    
    if (timeMap[timeString]) {
        targetDate.setHours(timeMap[timeString][0], timeMap[timeString][1], 0, 0);
    }
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const daysElement = document.querySelector('[data-time="days"]');
            const hoursElement = document.querySelector('[data-time="hours"]');
            const minutesElement = document.querySelector('[data-time="minutes"]');
            const secondsElement = document.querySelector('[data-time="seconds"]');
            
            if (daysElement) daysElement.textContent = days;
            if (hoursElement) hoursElement.textContent = hours;
            if (minutesElement) minutesElement.textContent = minutes;
            if (secondsElement) secondsElement.textContent = seconds;
        } else {
            // Date has passed
            const countdownSection = document.querySelector('.countdown-section');
            if (countdownSection) {
                countdownSection.innerHTML = `
                    <h3>🎉 It's Date Time! 🎉</h3>
                    <p style="font-size: 1.2rem; color: #ff1493; text-align: center;">Hope you're having the most amazing time together! 💕</p>
                `;
            }
        }
    }
    
    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function createCelebrationEffects() {
    // Create confetti
    const celebration = document.querySelector('.celebration');
    if (celebration) {
        // Add balloons
        const balloons = document.createElement('div');
        balloons.className = 'balloons';
        
        const balloonEmojis = ['🎈', '🎀', '💖', '🌹'];
        for (let i = 0; i < 4; i++) {
            const balloon = document.createElement('div');
            balloon.className = `balloon balloon-${i + 1}`;
            balloon.textContent = balloonEmojis[i];
            balloons.appendChild(balloon);
        }
        
        celebration.appendChild(balloons);
    }
}

function initializeActionButtons() {
    // Birthday surprise button
    const birthdaySurpriseBtn = document.querySelector('[data-action="change-plans"]');
    if (birthdaySurpriseBtn) {
        birthdaySurpriseBtn.addEventListener('click', function() {
            window.location.href = 'birthday.html';
        });
    }
    
    // Start over button
    const startOverBtn = document.querySelector('[data-action="start-over"]');
    if (startOverBtn) {
        startOverBtn.addEventListener('click', function() {
            localStorage.removeItem('plannedDate');
            window.location.href = 'index.html';
        });
    }
    
    // Share date button
    const shareDateBtn = document.querySelector('[data-action="share-date"]');
    if (shareDateBtn) {
        shareDateBtn.addEventListener('click', function() {
            openShareModal();
        });
    }
}

function initializeCalendarIntegration(dateData) {
    if (!dateData.date) return;
    
    const dateObj = new Date(dateData.date);
    const timeMap = {
        'morning': [10, 0],
        'afternoon': [14, 0],
        'evening': [18, 0],
        'night': [20, 0]
    };
    
    if (timeMap[dateData.time]) {
        dateObj.setHours(timeMap[dateData.time][0], timeMap[dateData.time][1], 0, 0);
    }
    
    const endDate = new Date(dateObj.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
    
    const activityNames = {
        'pizza': 'Romantic Pizza Date',
        'london': 'London Adventure',
        'movie': 'Movie Night'
    };
    
    const eventTitle = activityNames[dateData.activity] || 'Special Date';
    const eventDescription = `${eventTitle}${dateData.requests ? ` - ${dateData.requests}` : ''}`;
    
    // Google Calendar
    const googleBtn = document.querySelector('[data-calendar="google"]');
    if (googleBtn) {
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${formatDateForGoogle(dateObj)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(eventDescription)}`;
        googleBtn.href = googleUrl;
    }
    
    // Outlook
    const outlookBtn = document.querySelector('[data-calendar="outlook"]');
    if (outlookBtn) {
        const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=${dateObj.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(eventDescription)}`;
        outlookBtn.href = outlookUrl;
    }
    
    // ICS Download
    const icsBtn = document.querySelector('[data-calendar="ics"]');
    if (icsBtn) {
        icsBtn.addEventListener('click', function() {
            downloadICSFile(dateObj, endDate, eventTitle, eventDescription);
        });
    }
}

function formatDateForGoogle(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function downloadICSFile(startDate, endDate, title, description) {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Birthday Website//EN
BEGIN:VEVENT
UID:${Date.now()}@birthday-website.com
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'our-special-date.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function formatDateForICS(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// ===== MODAL FUNCTIONS =====
function openShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeShareModal();
            }
        });
    }
}

function closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle heart trail creation for better performance
const throttledHeartTrail = debounce(createHeartTrail, 50);

// Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    heartTrailActive = false;
    document.documentElement.style.setProperty('--animation-duration', '0.5s');
}

// Pause animations when page is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        heartTrailActive = false;
        if (backgroundMusic && musicPlaying) {
            backgroundMusic.pause();
        }
    } else {
        heartTrailActive = true;
        if (backgroundMusic && musicPlaying) {
            backgroundMusic.play().catch(e => console.log('Resume play failed:', e));
        }
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.log('Script error:', e.error);
    // Gracefully handle errors without breaking the experience
});

// ===== ACCESSIBILITY =====
// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heartTrailActive = false;
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeShareModal();
    }
});

// Focus management for modals
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Initialize focus trapping for modals
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (modal.style.display === 'block') {
                        trapFocus(modal);
                        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                        if (firstFocusable) firstFocusable.focus();
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    });
});

// ===== BACKGROUND MUSIC FUNCTION =====
function initBackgroundMusic() {
    // Create music button if it doesn't exist
    let musicBtn = document.querySelector('.music-btn');
    if (!musicBtn) {
        const musicControl = document.createElement('div');
        musicControl.className = 'music-control';
        musicControl.innerHTML = `
            <button class="music-btn" title="Play Music">
                <i class="fas fa-music"></i>
                <span class="music-tooltip">Play Music</span>
            </button>
        `;
        document.body.appendChild(musicControl);
        musicBtn = musicControl.querySelector('.music-btn');
    }
    
    // Create audio element if it doesn't exist
    let audioElement = document.getElementById('birthday-song');
    if (!audioElement) {
        audioElement = document.createElement('audio');
        audioElement.id = 'birthday-song';
        audioElement.loop = true;
        
        // Add multiple sources for better browser compatibility
        const sources = [
            { src: 'music.mp3', type: 'audio/mpeg' },
            { src: 'happy-birthday-master/happy-birthday-master/music.mp3', type: 'audio/mpeg' },
            { src: 'Happy Birthday_files/music.mp3', type: 'audio/mpeg' }
        ];
        
        sources.forEach(source => {
            const sourceElement = document.createElement('source');
            sourceElement.src = source.src;
            sourceElement.type = source.type;
            audioElement.appendChild(sourceElement);
        });
        
        document.body.appendChild(audioElement);
    }
    
    // Set up music control
    backgroundMusic = audioElement;
    
    musicBtn.addEventListener('click', function() {
        if (musicPlaying) {
            backgroundMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
            musicBtn.title = 'Play Music';
            musicPlaying = false;
            
            // Update tooltip
            const tooltip = musicBtn.querySelector('.music-tooltip');
            if (tooltip) tooltip.textContent = 'Play Music';
        } else {
            backgroundMusic.play().catch(e => {
                console.log('Audio play failed:', e);
            });
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
            musicBtn.classList.add('playing');
            musicBtn.title = 'Pause Music';
            musicPlaying = true;
            
            // Update tooltip
            const tooltip = musicBtn.querySelector('.music-tooltip');
            if (tooltip) tooltip.textContent = 'Pause Music';
        }
    });
    
    // Add pulsing effect to music button when playing
    if (musicPlaying) {
        musicBtn.classList.add('playing');
    }
    
    // Auto-play attempt (may be blocked by browser)
    setTimeout(() => {
        backgroundMusic.play().then(() => {
            musicBtn.classList.add('playing');
            musicPlaying = true;
            
            // Update tooltip
            const tooltip = musicBtn.querySelector('.music-tooltip');
            if (tooltip) tooltip.textContent = 'Pause Music';
        }).catch(e => {
            console.log('Auto-play blocked:', e);
        });
    }, 1000);
}

// ===== AOS INITIALIZATION FOR INDEX.HTML =====
// Initialize AOS if the library is available (for index.html compatibility)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
}

// ===== PARTICLES.JS INITIALIZATION FOR INDEX.HTML =====
// Initialize particles.js if available and container exists
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        particles: {
            number: { value: 50 },
            color: { value: '#ff69b4' },
            shape: { type: 'circle' },
            opacity: { value: 0.3 },
            size: { value: 3 },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' }
            }
        }
    });
}

console.log('🎉 Birthday website loaded successfully! 💖');