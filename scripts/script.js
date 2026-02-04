document.addEventListener('DOMContentLoaded', () => {
    // Inject Background Elements
    const body = document.body;

    // 1. Matrix Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    body.prepend(canvas);

    // 2. Shield Background
    const shieldDiv = document.createElement('div');
    shieldDiv.className = 'shield-bg';
    shieldDiv.innerHTML = `<img src="images/logos/sheild.png" alt="Shield Background" style="width: 100%; height: 100%; object-fit: contain;">`;
    body.prepend(shieldDiv);

    // Matrix Rain Effect
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const columns = Math.floor(width / 20); // Width of each column
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    const draw = () => {
        // Black background with very slight opacity for trail effect
        ctx.fillStyle = 'rgba(18, 5, 24, 0.05)'; // Using theme bg color
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00ff9d'; // Green text (classic matrix) or use purple? 
        // User asked for "0s and 1s moving". Let's use the theme primary color or classic green?
        // "hacker website" usually implies green, but our theme is purple.
        // Let's use a Matrix Green for the contrast/classic hacker feel, OR the primary Purple.
        // Given the request "hacker website", Green is safer, but "according to the poster" was the previous prompt.
        // I'll mix it: Primary purple color from the theme.
        ctx.fillStyle = '#d500f9'; // Theme Primary

        ctx.font = '15px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = Math.random() > 0.5 ? '1' : '0'; // Only 0s and 1s
            ctx.fillText(text, i * 20, drops[i] * 20);

            if (drops[i] * 20 > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };

    setInterval(draw, 50);

    // Menu Toggle Logic
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');

    function toggleMenu() {
        menuOverlay.classList.toggle('active');
        // Optional: lock body scroll
        if (menuOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', toggleMenu);
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link-overlay').forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth Scrolling
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

    // Header Highlight on Scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }

    // Intersection Observer for Fade-in Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Countdown Timer Logic
    const countdownContainer = document.getElementById('countdown');
    if (countdownContainer) {
        const eventDate = new Date('February 10, 2026 09:00:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                // Event passed
                document.getElementById('days').innerText = "00";
                document.getElementById('hours').innerText = "00";
                document.getElementById('minutes').innerText = "00";
                document.getElementById('seconds').innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = days < 10 ? '0' + days : days;
            document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
            document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
        };

        setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }

});


// Registration Form Logic
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    const fileInput = document.getElementById('paymentProof');
    const fileNameDisplay = document.getElementById('fileName');
    const dropZone = document.getElementById('dropZone');

    // File Upload Interactions
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateFileName();
        }
    });

    fileInput.addEventListener('change', updateFileName);

    function updateFileName() {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
        } else {
            fileNameDisplay.textContent = '';
        }
    }

    // Form Submission
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        const messageDiv = document.getElementById('formMessage');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        messageDiv.textContent = '';
        messageDiv.className = 'form-message';

        try {
            const formData = new FormData(registrationForm);
            const data = Object.fromEntries(formData);

            // Convert file to Base64
            if (fileInput.files.length > 0) {
                data.paymentProof = await toBase64(fileInput.files[0]);
                data.fileName = fileInput.files[0].name;
                data.mimeType = fileInput.files[0].type;
            }

            // REPLACE THIS URL WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
            const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

            if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                throw new Error('Please configure the Backend Script URL in script.js first.');
            }

            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                messageDiv.textContent = 'Registration Successful! We will contact you shortly.';
                messageDiv.classList.add('success');
                registrationForm.reset();
                fileNameDisplay.textContent = '';
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = error.message || 'Something went wrong. Please try again.';
            messageDiv.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Registration';
        }
    });

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}
