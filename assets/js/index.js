const API = 'https://tvng.herokuapp.com/api/v1';

// Helper Functions
const getInputField = id => document.getElementById(id);
const getValue = id => document.getElementById(id).value;

let specs = {};
let summary = {};

// Populate input fields from localStorage
(() => {
  console.groupCollapsed('populate 🤞🏾');
  console.log('populating...');
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
  console.log('populated 🔥🔥🔥');
  console.groupEnd();
})();

const updateLocalStorage = () =>
  localStorage.setItem(
    'store',
    JSON.stringify({
      specs: { ...specs },
      summary: { ...summary }
    })
  );

const inputNodes = document.querySelectorAll('input:not(#article-id)');
const textAreaNodes = document.querySelectorAll('textarea');

// Listen for input changes and update specs object accordingly
inputNodes.forEach(e =>
  e.addEventListener('keyup', e => {
    const {
      target: { id: key }
    } = e;
    specs[key] = getValue(key);
    updateLocalStorage();
  })
);

textAreaNodes.forEach(e =>
  e.addEventListener('keyup', e => {
    const {
      target: { id: key }
    } = e;
    summary[key] = getValue(key);
    updateLocalStorage();
  })
);

const forceSync = () => {
  console.groupCollapsed('sync 🤟🏾');
  console.log('syncing...');
  textAreaNodes.forEach(node => (summary[node.id] = node.value));
  inputNodes.forEach(node => (specs[node.id] = node.value));
  updateLocalStorage();
  console.log('done syncing 🔥🔥🔥');
  console.groupEnd();
  return true;
};

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

// close modal & copy id
document.querySelector('#close-modal').onclick = () => {
  document.getElementById('article-id').select();
  document.execCommand('copy');
  closeModal();
  Swal.fire({
    text: 'Article Id copied to clipboard',
    type: 'success',
    confirmButtonColor: '#2eb8b3',
    confirmButtonText: 'Done 💪🏾'
  });
};

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
    console.warn('incomplete entries');
    return false;
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
  forceSync() &&
  Swal.fire({
    title: 'Are you sure?',
    text: 'This operation permanently saves the article to the database',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2eb8b3',
    cancelButtonColor: '#b82e33',
    confirmButtonText: 'Yes, save it!'
  }).then(async result => {
    if (result.value) {
      (await saveArticle()) === false
        ? Swal.fire({
            text: 'Some fields are missing',
            type: 'error',
            confirmButtonColor: '#2eb8b3',
            confirmButtonText: 'Confirm & Try Again 🤞🏾'
          })
        : undefined;
    }
  });
