const filseInput = document.getElementById('filesInput');
const inputBtn = document.getElementById('inputBtn');

inputBtn.addEventListener('click', () => {
  filseInput.click();
  filseInput.addEventListener('change', () => {
    const file = filseInput.files[0];
    filesHandler(file);
  });
});

document.addEventListener('dragenter', e => e.preventDefault());
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => e.preventDefault());

inputBtn.addEventListener('dragleave', clearDropZone);
inputBtn.addEventListener('drop', dropHandler);
inputBtn.addEventListener('dragenter', dragenterHandler);

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

function proceedCalls(call) {
  const steps = call.steps.filter(step => step.node_name === 'Class');

  let slots = [];
  if (steps.length) {
    steps.forEach(step => slots.push(step.slots.filter(slot => slot.name === 'dummy')));
  }
  return {
    id: call._id,
    ani: call.ani,
    disconnectReason: call.disconnect_reason,
    isCaseCreated: isCaseCreatedByCall(call),
    slots,
  };
}

function isCaseCreatedByCall(call) {
  const createCaseNodeIds = [
    '0d0d98db-8a42-449b-bb59-8991b5b39283',
    'e1b89b02-fe66-4c46-9f27-7e40a1270511',
    'cc4fabb6-c377-4bcf-a2c0-78b7a3c8a756',
    '4da933a5-ddca-4d6a-9bc5-db75a34edcd1',
  ];
  const steps = call.steps.filter(step => createCaseNodeIds.includes(step.node_id));
  return steps.length > 0;
}

function returnCsvFromArray(processedCalls) {
  const csvString = processedCalls
    .map(call => {
      const slots = call.slots.map(slot => (slot[0] ? slot[0].value : 'NONE'));
      return [call.id, call.ani, call.disconnectReason, call.isCaseCreated, slots];
    })
    .map(el => el.join(','))
    .join('\n');
  return csvString;
}

function displayFileName(fileName) {
  const fileNameCaption = document.createElement('h3');
  fileNameCaption.append(fileName + ' DONE, Press F12');
  document.body.append(fileNameCaption);
}
