import { displayFileName, createReport } from './utils.js';

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
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => onLoadHadler(reader.result);
  displayFileName(file.name);
}

function onLoadHadler(response) {
  const json = JSON.parse(response);
  const allCalls = json.data.stats.calls.filter(call => call.ani !== '500');
  let report = createReport(allCalls);
  console.log(report);
}

export { dragenterHandler, dropHandler, filesHandler, onLoadHadler, clearDropZone };
