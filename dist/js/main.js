// Mengambil elemen lingkaran
const outerCircle = document.querySelector('.circle-outer');
const innerCircle = document.querySelector('.circle-inner');

// Fungsi untuk memulai animasi rotasi dengan sudut acak
function startRandomRotation() {
    // Menghasilkan sudut acak antara 0 dan 360 derajat
    function getRandomAngle() {
        return Math.floor(Math.random() * 360);
    }

    // Memulai rotasi acak setiap 5 detik
    setInterval(() => {
        const randomAngleOuter = getRandomAngle();
        const randomAngleInner = getRandomAngle();

        // Mengatur rotasi dengan transisi
        outerCircle.style.transition = 'transform 2s ease'; // Durasi animasi untuk luar
        innerCircle.style.transition = 'transform 1.5s ease'; // Durasi animasi untuk dalam

        outerCircle.style.transform = `rotate(${randomAngleOuter}deg)`;
        innerCircle.style.transform = `rotate(${randomAngleInner}deg)`;
    }, 5000); // Rotasi acak setiap 5 detik
}

// Memulai rotasi ketika halaman dimuat
window.onload = startRandomRotation;

// ------------------------------------------------------------------------------------------------

console.clear();

// Select the circle element
const cursorElement = document.querySelector('.cursor');

// Create objects to track mouse position and custom cursor position
const mouse = { x: 0, y: 0 }; // Track current mouse position
const previousMouse = { x: 0, y: 0 } // Store the previous mouse position
const cursor = { x: 0, y: 0 }; // Track the cursor position

// Initialize variables to track scaling and rotation
let currentScale = 0; // Track current scale value
let currentAngle = 0; // Track current angle value
let isShrinking = false; // Track if the cursor is shrinking
let shrinkTimeout = null;

// Update mouse position on the 'mousemove' event
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;

    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        cursorElement.classList.add('big');

    } else {
        cursorElement.classList.remove('big'); // Remove 'big' class otherwise
    }
});

window.addEventListener('click', () => {
    // Temporarily shrink the cursor by scaling it down
    cursorElement.style.transform += ' scale(-1)';
    cursorElement.classList.add('big'); // Add 'big' class to cursor when hovering over a link/button

    // Restore the cursor scale after 150ms
    setTimeout(() => {
        cursorElement.classList.remove('big');
        cursorElement.style.transform = cursorElement.style.transform.replace(' scale(-1)', '');
    }, 250);
});

// Smoothing factor for cursor movement speed (0 = smoother, 1 = instant)
const speed = 0.17;

// Start animation
const tick = () => {
    // MOVE
    // Calculate cursor movement based on mouse position and smoothing
    cursor.x += (mouse.x - cursor.x) * speed;
    cursor.y += (mouse.y - cursor.y) * speed;
    // Create a transformation string for cursor translation
    const translateTransform = `translate(${cursor.x}px, ${cursor.y}px)`;

    // SQUEEZE
    // 1. Calculate the change in mouse position (deltaMouse)
    const deltaMouseX = mouse.x - previousMouse.x;
    const deltaMouseY = mouse.y - previousMouse.y;
    // Update previous mouse position for the next frame
    previousMouse.x = mouse.x;
    previousMouse.y = mouse.y;
    // 2. Calculate mouse velocity using Pythagorean theorem and adjust speed
    const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150);
    // 3. Convert mouse velocity to a value in the range [0, 0.5]
    const scaleValue = (mouseVelocity / 150) * 0.5;
    // 4. Smoothly update the current scale
    currentScale += (scaleValue - currentScale) * speed;
    // 5. Create a transformation string for scaling
    const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

    // ROTATE
    // 1. Calculate the angle using the atan2 function
    const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
    // 2. Check for a threshold to reduce shakiness at low mouse velocity
    if (mouseVelocity > 20) {
        currentAngle = angle;
    }
    // 3. Create a transformation string for rotation
    const rotateTransform = `rotate(${currentAngle}deg)`;

    // Apply all transformations to the cursor element in a specific order: translate -> rotate -> scale
    cursorElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

    // Request the next frame to continue the animation
    window.requestAnimationFrame(tick);
}

// Start the animation loop
tick();

// ------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(CSSRulePlugin);
    const cursor = document.querySelector('.cursor');

    let activeItemIndicator = CSSRulePlugin.getRule(".menu-item p#active::after");
    const toggleButton = document.querySelector(".burger");
    let isOpen = false;

    gsap.set(".menu-item p", { y: 225 });

    const timeline = gsap.timeline({ paused: true });
    const overlayTimeline = gsap.timeline({ paused: true });
    overlayTimeline.to(".overlay, .hero", {
        duration: 2.5, // Adjust duration as needed
        // Animates overlay to open smoothly from bottom to top
        y: -1000,
        ease: "power3.inOut"
    });


    timeline.to(".overlay", {
        duration: 1.5,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power4.inOut"
    });

    timeline.to(".menu-item p", {
        duration: 1.5,
        y: 0,
        stagger: 0.2,
        ease: "power4.out"
    }, "-=1");

    timeline.to(activeItemIndicator, {
        width: "100%",
        duration: 1,
        ease: "power4.out",
        delay: 0.5
    }, "<");

    timeline.to(".sub-nav", {
        bottom: "10%",
        opacity: 1,
        duration: 0.5,
        delay: 0.5
    }, "<");

    toggleButton.addEventListener("click", function () {
        if (isOpen) {
            timeline.reverse();
            cursor.classList.remove('black');
            cursor.classList.remove('hoverblack');

            // Remove the 'mousemove' event listener to prevent hover effects when closed
            window.removeEventListener('mousemove', handleMouseMove);
        } else {
            timeline.play();
            cursor.classList.add('black');

            // Add the 'mousemove' event listener to enable hover effects when open
            window.addEventListener('mousemove', handleMouseMove);
        }
        isOpen = !isOpen;
    });

    // Define the event handler function separately for easier management
    function handleMouseMove(e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            cursor.classList.add('hoverblack');
        } else {
            cursor.classList.remove('hoverblack');
        }
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default navigation

            const target = event.target.dataset.target;

            // Play overlay hide animation before navigating
            overlayTimeline.play();

            // Navigate to the target after the overlay animation finishes
            overlayTimeline.then(() => {
                window.location.href = target;
            });
        });
    });
});

// ------------------------------------------------------------------------------------------------

// Get the element where the random number will be displayed
const randomNumberElement = document.getElementById('random-number');

// Function to generate a random number between 1 and 99
function generateRandomNumber() {
    return Math.floor(Math.random() * 99) + 1;
}

// Function to update the random number
function updateRandomNumber() {
    const randomNumber = generateRandomNumber();
    randomNumberElement.textContent = randomNumber;
}

// Initial call to update the number
updateRandomNumber();

// Set an interval to update the number every 5 seconds (adjust as needed)
setInterval(updateRandomNumber, 100);

// -------------
// Define the available project categories and their data
const categories = ['website', 'mobile', 'etc'];
const projects = {
    website: [
        { id: 1, title: 'E-commerce Platform', description: 'A robust online store with secure payment gateways.' },
        { id: 2, title: 'Portfolio Website', description: 'Showcasing creative works with elegant design.' },
        { id: 3, title: 'Blog System', description: 'Content management system for dynamic articles.' },
    ],
    mobile: [
        { id: 4, title: 'Fitness Tracker App', description: 'Track workouts and health metrics on the go.' },
        { id: 5, title: 'Food Delivery App', description: 'Order food from local restaurants with ease.' },
        { id: 6, title: 'Messaging App', description: 'Real-time communication with secure encryption.' },
    ],
    etc: [
        { id: 7, title: '3D Product Configurator', description: 'Interactive 3D models for product customization.' },
        { id: 8, title: 'Smart Home Automation', description: 'Control home devices from a centralized dashboard.' },
        { id: 9, title: 'Data Visualization Tool', 'description': 'Interactive charts and graphs for complex data.' },
    ],
};

// Get references to DOM elements
const categoryLinks = document.querySelectorAll('#category-navigation a');
const projectsDisplay = document.getElementById('projects-display');

// State variable for active category (default to 'website')
let activeCategory = 'website';

/**
 * Renders the projects for the given category.
 * @param {string} category - The category to display projects for.
 */
function renderProjects(category) {
    projectsDisplay.innerHTML = ''; // Clear existing projects
    const currentProjects = projects[category];

    currentProjects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-primary transition-all duration-300';
        projectDiv.innerHTML = `
                                    <h3 class="text-xl font-semibold text-primary mb-2">${project.title}</h3>
                                    <p class="text-gray-300">${project.description}</p>
                                `;
        projectsDisplay.appendChild(projectDiv);
    });
}

/**
 * Updates the active category styling.
 * @param {string} newActiveCategory - The category to set as active.
 */
function updateActiveCategoryStyling(newActiveCategory) {
    categoryLinks.forEach(link => {
        const category = link.dataset.category;
        if (category === newActiveCategory) {
            link.classList.add('bg-primary', 'text-background');
            link.classList.remove('hover:bg-primary', 'hover:text-background'); /* Ensure hover styles are removed when active */
        } else {
            link.classList.remove('bg-primary', 'text-background');
            /* Re-add hover styles if it's not the active category */
            link.classList.add('hover:bg-primary', 'hover:text-background');
        }
    });
}

/**
 * Handles the click event on a category link.
 * @param {Event} event - The click event object.
 */
function handleCategoryClick(event) {
    const clickedCategory = event.currentTarget.dataset.category;
    if (activeCategory !== clickedCategory) {
        activeCategory = clickedCategory;
        updateActiveCategoryStyling(activeCategory);
        renderProjects(activeCategory);
    }
}

// Add event listeners to each category link
categoryLinks.forEach(link => {
    link.addEventListener('click', handleCategoryClick);
    // Removed mouseenter/mouseleave for content-slider as it's no longer used
});

// Initial render on page load
document.addEventListener('DOMContentLoaded', () => {
    updateActiveCategoryStyling(activeCategory);
    renderProjects(activeCategory);
});