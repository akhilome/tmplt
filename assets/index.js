const API = 'https://tvng.herokuapp.com/api/v1';

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
};

// Summary
const summary = {
  intro,
  software,
  hardware
};

// Listen for input changes and update specs object accordingly
document.querySelectorAll('input').forEach(e =>
  e.addEventListener('keyup', function() {
    for (const key in specs) {
      specs[key] = getValue(`${key}`);
    }
  })
);

document.querySelectorAll('textarea').forEach(e =>
  e.addEventListener('keyup', function() {
    for (const key in summary) {
      summary[key] = getValue(`${key}`);
    }
  })
);

const toggleLoadingState = () =>
  document.querySelector('.loader-container').classList.toggle('show');

const modalContainer = document.querySelector('.modal-container');
const showModal = () => modalContainer.classList.add('show');
const closeModal = () => modalContainer.classList.remove('show');

const updateModalContent = ({ message, articleId = '#' }) => {
  const messageModal = document.querySelector('.message-modal');
  messageModal.querySelector('h5').innerText = message;
  messageModal.querySelector('#article-id').value = articleId;
};

// close modal
document.querySelector('#close-modal').onclick = closeModal;

// Get Download button
const done = document.querySelector('#done');

// Hit API
const saveArticle = () => {
  fetch(`${API}/articles`, {
    method: 'POST',
    body: JSON.stringify({ title: specs.device, specs, summary }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => {
      toggleLoadingState();
      return res.json();
    })
    .then(response => {
      const handleResponse = () => {
        if (response.success) {
          const { message, id: articleId } = response;
          updateModalContent({ message, articleId });
          toggleLoadingState();
          showModal();
        } else {
          toggleLoadingState();
          console.log('something went wrong');
        }
      };
      setTimeout(handleResponse, 500);
    })
    .catch(e => console.error(e));
};

done.onclick = saveArticle;
