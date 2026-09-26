const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSizeInput = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');

let drawing = false;
let lastX = 0;
let lastY = 0;

function getPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function startDrawing(event) {
  drawing = true;
  const point = getPoint(event);
  lastX = point.x;
  lastY = point.y;
  drawLine(point.x, point.y, point.x, point.y);
}

function drawLine(fromX, fromY, toX, toY) {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = Number(brushSizeInput.value);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function continueDrawing(event) {
  if (!drawing) return;
  const point = getPoint(event);
  drawLine(lastX, lastY, point.x, point.y);
  lastX = point.x;
  lastY = point.y;
}

function stopDrawing() {
  drawing = false;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function saveCanvas() {
  const dataUrl = canvas.toDataURL('image/png');

  if (!window.pywebview || !window.pywebview.api || !window.pywebview.api.save_png) {
    alert('The Python API is not available in this environment.');
    return;
  }

  try {
    const savedPath = await window.pywebview.api.save_png(dataUrl);
    alert(`Saved to: ${savedPath}`);
  } catch (error) {
    alert(error.message || 'Could not save the image.');
  }
}

canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', continueDrawing);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointerleave', stopDrawing);
clearBtn.addEventListener('click', clearCanvas);
saveBtn.addEventListener('click', saveCanvas);

clearCanvas();
