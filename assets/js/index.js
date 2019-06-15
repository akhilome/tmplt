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

const loader = document.querySelector('.loader-container');
const toggleLoadingState = () => loader.classList.toggle('show');
const clearLoader = () => loader.classList.remove('show');

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
const saveArticle = async () => {
  const emptyFields = [
    ...Object.keys(specs).filter(e => !specs[e]),
    ...Object.keys(summary).filter(e => !summary[e])
  ];

  if (
    Object.keys(specs).length !== 34 ||
    Object.keys(summary).length !== 3 ||
    emptyFields.length
  ) {
    return console.warn('incomplete entries');
  }
  toggleLoadingState();
  try {
    const data = await fetch(`${API}/articles`, {
      method: 'POST',
      body: JSON.stringify({ title: specs.device, specs, summary }),
      headers: { 'Content-Type': 'application/json' }
    });
    const response = await data.json();
    if (response.success) {
      const { message, id: articleId } = response;
      updateModalContent({ message, articleId });
      toggleLoadingState();
      showModal();
    } else {
      toggleLoadingState();
      console.warn('something went wrong');
    }
  } catch (e) {
    console.error(e);
    clearLoader();
  }
};

done.onclick = () =>
  Swal.fire({
    title: 'Are you sure?',
    text: 'This operation saves the article to the database',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2eb8b3',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, save it!'
  }).then(result => {
    if (result.value) saveArticle();
  });
