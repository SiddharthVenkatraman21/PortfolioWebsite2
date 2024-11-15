const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lines = [];
const mouse = { x: undefined, y: undefined };
let currentFlickerIndex = -1;
let flickerOpacity = 0.1;
let fadingIn = true;
const isMobileView = window.innerWidth < 768;

// Resize the canvas when the window size changes
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Track mouse position
canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Line class to create network lines
function Line(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.baseOpacity = 0.1;
}

// Draw lines with increased opacity if near the mouse, and flicker if not on mobile
Line.prototype.draw = function (isFlickering) {
  const distance1 = Math.sqrt(Math.pow(this.x1 - mouse.x, 2) + Math.pow(this.y1 - mouse.y, 2));
  const distance2 = Math.sqrt(Math.pow(this.x2 - mouse.x, 2) + Math.pow(this.y2 - mouse.y, 2));

  let opacity;
  if (distance1 < 100 || distance2 < 100) {
    opacity = 0.6 + (1 - Math.max(distance1, distance2) / 100) * 0.4;
  } else {
    opacity = isFlickering && !isMobileView ? flickerOpacity : this.baseOpacity;
  }

  ctx.strokeStyle = `rgba(173, 216, 230, ${opacity})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.stroke();
};

// Generate background lines
function generateLines() {
  const lineCount = isMobileView ? 100 : 200;
  for (let i = 0; i < lineCount; i++) {
    const x1 = Math.random() * canvas.width;
    const y1 = Math.random() * canvas.height;
    const x2 = Math.random() * canvas.width;
    const y2 = Math.random() * canvas.height;
    lines.push(new Line(x1, y1, x2, y2));
  }
}

// Update flickering line
function updateFlickerLine() {
  currentFlickerIndex = Math.floor(Math.random() * lines.length);
  flickerOpacity = 0.1;
  fadingIn = true;
}

// Animate lines with or without flickering
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply flickering if not on mobile
  if (!isMobileView) {
    if (fadingIn) {
      flickerOpacity += 0.02;
      if (flickerOpacity >= 1) {
        flickerOpacity = 1;
        fadingIn = false;
      }
    } else {
      flickerOpacity -= 0.04;
      if (flickerOpacity <= 0.1) {
        flickerOpacity = 0.1;
        updateFlickerLine();
      }
    }
  }

  // Draw each line; only flicker selected one if not on mobile
  lines.forEach((line, index) => line.draw(index === currentFlickerIndex));
  requestAnimationFrame(animate);
}

// Initialize and start animation
generateLines();
animate();

// Get the image and mobile overlay elements
const image = document.getElementById('imageClick');
const overlayMobile = document.getElementById('overlayMobile');

// Listen for a click on the image (for mobile)
image.addEventListener('click', function(event) {
    // Prevent event from bubbling up to the document (to prevent closing immediately after opening)
    event.stopPropagation();

    // Toggle the visibility of the mobile overlay
    overlayMobile.classList.toggle('opacity-0');
    overlayMobile.classList.toggle('opacity-100');
});

// Listen for click events on the document to close the overlay when clicked outside
document.addEventListener('click', function(event) {
    if (!image.contains(event.target)) {
        // Hide the overlay if clicked outside the image
        overlayMobile.classList.add('opacity-0');
        overlayMobile.classList.remove('opacity-100');
    }
});


