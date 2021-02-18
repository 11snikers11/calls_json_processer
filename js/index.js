import * as handlers from './event-handlers.js';

const filseInput = document.getElementById('filesInput');
const processFileBtn = document.getElementById('processFile');

processFileBtn.addEventListener('click', () => {
  const file = filseInput.files[0];
  if (file) {
    handlers.filesHandler(file);
  } else {
    window.alert('Выбрери файл сначала!');
    return;
  }
});

// filseInput.addEventListener('change', () => {
//   const file = filseInput.files[0];
//   handlers.filesHandler(file);
// });

document.addEventListener('dragenter', e => e.preventDefault());
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => e.preventDefault());

// inputBtn.addEventListener('dragleave', handlers.clearDropZone);
// inputBtn.addEventListener('drop', handlers.dropHandler);
// inputBtn.addEventListener('dragenter', handlers.dragenterHandler);
