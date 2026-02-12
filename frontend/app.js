/* ===== Elements ===== */
const imageInput   = document.getElementById("imageInput");
const removeBtn    = document.getElementById("removeBtn");
const beforeImage  = document.getElementById("beforeImage");
const resultImage  = document.getElementById("resultImage");
const downloadLink = document.getElementById("downloadLink");
const loader       = document.getElementById("loader");
const dropZone     = document.getElementById("dropZone");
const browse       = document.getElementById("browse");
const themeBtn     = document.getElementById("themeBtn");

/* ===== Theme ===== */
themeBtn.onclick = () => {
  document.body.classList.toggle("light");
  themeBtn.textContent =
    document.body.classList.contains("light") ? "🌞" : "🌙";
};

/* ===== Image Upload ===== */
browse.onclick = () => imageInput.click();
dropZone.onclick = () => imageInput.click();

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  beforeImage.src = URL.createObjectURL(file);
  resultImage.src = "";
  downloadLink.style.display = "none";
};

/* ===== Background Removal ===== */
removeBtn.onclick = async () => {
  const file = imageInput.files[0];
  if (!file) return alert("Upload an image first");

  loader.style.display = "block";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:8000/remove-bg", {
      method: "POST",
      body: formData
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    resultImage.src = url;
    downloadLink.href = url;
    downloadLink.style.display = "inline";
  } finally {
    loader.style.display = "none";
  }
};

/* ===== Magnetic Sparkles Background ===== */
const canvas = document.getElementById("energy-field");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

const mouse = { x: w / 2, y: h / 2 };
document.onmousemove = e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

const SPARKLE_COUNT = 999;
const sparkles = [];

for (let i = 0; i < SPARKLE_COUNT; i++) {
  sparkles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    ox: 0,
    oy: 0,
    vx: 0,
    vy: 0,
    size: Math.random() * 1.6 + 0.8
  });
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  const light = document.body.classList.contains("light");

  sparkles.forEach(s => {
    if (!s.ox && !s.oy) {
      s.ox = s.x;
      s.oy = s.y;
    }

    const dx = mouse.x - s.x;
    const dy = mouse.y - s.y;
    const d  = Math.hypot(dx, dy) || 1;
    const r  = 150;

    if (d < r) {
      const f = (1 - d / r) * 1.35;
      s.vx += (dx / d) * f;
      s.vy += (dy / d) * f;
    } else {
      s.vx += (s.ox - s.x) * 0.0015;
      s.vy += (s.oy - s.y) * 0.0015;
    }

    s.vx *= 0.82;
    s.vy *= 0.82;

    s.x += s.vx;
    s.y += s.vy;

    ctx.beginPath();
    ctx.fillStyle = light
      ? "rgba(37,99,235,0.95)"
      : "rgba(180,210,255,0.85)";
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
