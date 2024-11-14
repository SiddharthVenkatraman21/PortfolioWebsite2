const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lines = [];
const mouse = { x: undefined, y: undefined };
let currentFlickerIndex = -1; // Track which line is currently flickering
let flickerOpacity = 0.1; // Current opacity level for the flickering effect
let fadingIn = true; // Track whether the flicker is fading in or out

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
  this.baseOpacity = 0.1; // Base opacity for all lines
}

// Draw the lines with increased opacity if near the mouse or flickering
Line.prototype.draw = function (isFlickering) {
  const distance1 = Math.sqrt(Math.pow(this.x1 - mouse.x, 2) + Math.pow(this.y1 - mouse.y, 2));
  const distance2 = Math.sqrt(Math.pow(this.x2 - mouse.x, 2) + Math.pow(this.y2 - mouse.y, 2));

  // Calculate opacity based on mouse proximity or flickering effect
  let opacity;
  if (distance1 < 100 || distance2 < 100) {
    opacity = 0.6 + (1 - Math.max(distance1, distance2) / 100) * 0.4;
  } else {
    opacity = isFlickering ? flickerOpacity : this.baseOpacity;
  }

  ctx.strokeStyle = `rgba(173, 216, 230, ${opacity})`; // Light blue with varying opacity
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.stroke();
};

// Generate background lines across the canvas
function generateLines() {
  for (let i = 0; i < 200; i++) {
    const x1 = Math.random() * canvas.width;
    const y1 = Math.random() * canvas.height;
    const x2 = Math.random() * canvas.width;
    const y2 = Math.random() * canvas.height;
    lines.push(new Line(x1, y1, x2, y2));
  }
}

// Choose a new line to start flickering
function updateFlickerLine() {
  currentFlickerIndex = Math.floor(Math.random() * lines.length);
  flickerOpacity = 0.1; // Start with low opacity
  fadingIn = true; // Begin with fading in
}

// Draw all lines and animate the flicker effect
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update opacity for flickering effect
  if (fadingIn) {
    flickerOpacity += 0.02; // Gradually increase opacity
    if (flickerOpacity >= 1) {
      flickerOpacity = 1;
      fadingIn = false; // Start fading out after reaching full opacity
    }
  } else {
    flickerOpacity -= 0.04; // Gradually decrease opacity
    if (flickerOpacity <= 0.1) {
      flickerOpacity = 0.1;
      updateFlickerLine(); // Switch to a new line after fully fading out
    }
  }

  // Draw each line, making only the selected one flicker
  lines.forEach((line, index) => line.draw(index === currentFlickerIndex));

  requestAnimationFrame(animate);
}

// Initialize the background lines
generateLines();

// Start animation loop
animate();

// const arrow = document.querySelector('.scroll-arrow');
// arrow.addEventListener('click', function (e) {
//   e.preventDefault(); // Prevent default anchor click behavior
  
//   // Slow scroll to the "about" section
//   const target = document.querySelector('#about');
  
//   // Custom slow scroll logic using requestAnimationFrame
//   let start = window.pageYOffset;
//   let distance = target.offsetTop - start;
//   let duration = 1200; // Duration of scroll in milliseconds
//   let startTime = null;
  
//   // Custom scroll function
//   function scrollAnimation(currentTime) {
//     if (!startTime) startTime = currentTime;
//     let timeElapsed = currentTime - startTime;
//     let run = ease(timeElapsed, start, distance, duration);
//     window.scrollTo(0, run);
//     if (timeElapsed < duration) {
//       requestAnimationFrame(scrollAnimation);
//     }
//   }
  
//   // Ease-in-out function for smooth scroll
//   function ease(t, b, c, d) {
//     let ts = (t/=d)*t;
//     let tc = ts*t;
//     return b+c*(tc+(-3*ts+4*t)*t);
//   }

//   requestAnimationFrame(scrollAnimation);
// });


  function openModal(id, title, text) {
    // Set modal content dynamically
    document.getElementById(`modal-${id}`).classList.remove('hidden');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = text;
  }
  
  // Close Modal function
  function closeModal(id) {
    document.getElementById(`modal-${id}`).classList.add('hidden');
  }





