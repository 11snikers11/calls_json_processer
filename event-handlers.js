import { returnCsvFromArray, displayFileName, proceedCalls } from './utils.js';

function dragenterHandler(event) {
  if (event.dataTransfer.items[0].type !== 'application/json') {
    event.target.classList.toggle('file-not-allowed');
  }
  event.target.classList.toggle('dragover');
}

function clearDropZone(dropEvent) {
  dropEvent.target.classList.remove('dragover');
  dropEvent.target.classList.remove('file-not-allowed');
}

function dropHandler(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  filesHandler(file);
  clearDropZone(event);
}

function filesHandler(file) {
  if (file.type !== 'application/json') return;
  displayFileName(file.name);
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => onLoadHadler(reader.result);
}

function onLoadHadler(response) {
  const json = JSON.parse(response);
  const allCalls = json.data.stats.calls;
  let processedCalls = allCalls.map(proceedCalls);
  const result = returnCsvFromArray(processedCalls);
  console.log(result);
}

export { dragenterHandler, clearDropZone, dropHandler, filesHandler, onLoadHadler };
