const API = 'https://tvng.herokuapp.com/api/v1';

// Helper Functions
const getInputField = id => document.getElementById(id);
const getValue = id => document.getElementById(id).value;

let specs = {};
let summary = {};

// Populate input fields from localStorage
(() => {
  console.log('Populating ....', '🤞🏾');
  const store = JSON.parse(localStorage.getItem('store'));
  if (!store || !store.specs || !store.summary)
    return console.log('Nothing to populate 🙁');
  specs = { ...store.specs };
  summary = { ...store.summary };
  Object.keys(store.specs).forEach(
    e => (getInputField(e).value = store.specs[e])
  );
  Object.keys(store.summary).forEach(
    e => (getInputField(e).value = store.summary[e])
  );
  console.log('Populated', '🔥🔥🔥🔥');
})();

const store = JSON.parse(localStorage.getItem('store')) || {
  specs: null,
  summary: null
};

const updateLocalStorage = () => {
  localStorage.setItem(
    'store',
    JSON.stringify({
      specs: { ...store.specs },
      summary: { ...store.summary }
    })
  );
};

// Listen for input changes and update specs object accordingly
document.querySelectorAll('input:not(#article-id)').forEach(e =>
  e.addEventListener('keyup', e => {
    const {
      target: { id: key }
    } = e;
    specs[key] = getValue(key);
    store.specs = { ...specs };
    updateLocalStorage();
  })
);

document.querySelectorAll('textarea').forEach(e =>
  e.addEventListener('keyup', e => {
    const {
      target: { id: key }
    } = e;
    summary[key] = getValue(key);
    store.summary = { ...summary };
    updateLocalStorage();
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
