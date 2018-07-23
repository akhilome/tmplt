// Helper Function
const getValue = id => document.getElementById(id).value;

// Device Specifications
const specs = {
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
document.querySelectorAll('input').forEach(e => e.addEventListener('change', function() {
  for (const key in specs) {
    specs[key] = getValue(`${key}`);
  }
}));
