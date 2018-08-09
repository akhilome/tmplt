// Helper Function
const getValue = id => document.getElementById(id).value;

// Device Specifications
const specs = {
  device,
  gsm,
  hspa,
  lte,
  sim,
  os,
  dimensions,
  weight,
  build,
  colors,
  displaySize,
  displayType,
  displayResolution,
  displayProtection,
  processorName,
  processorType,
  gpu,
  ram,
  rom,
  sdCardSupport,
  frontCamera,
  rearCamera,
  batteryCapacity,
  batteryType,
  fastCharging,
  bluetooth,
  wifi,
  gps,
  usb,
  otg,
  fm,
  headphone,
  fingerprint,
  extras
}

// Listen for input changes and update specs object accordingly
document.querySelectorAll('input').forEach(e => e.addEventListener('keyup', function() {
  for (const key in specs) {
    specs[key] = getValue(`${key}`);
  }
}));

// Get Download button
const done = document.querySelector('#done');

// Prep download button everytime a key is hit
document.querySelector('html').addEventListener('keyup', function() {
  const data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(specs));
  done.href = `data:${data}`;
  done.download = `${specs.device}.json`;
});
