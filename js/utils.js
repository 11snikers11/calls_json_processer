import * as consts from './constants.js';
import * as toasts from './toast.js';

function createReport(call) {
  const reportType = getReportType();
  switch (reportType) {
    case 'commonReport':
      const commonReport = call.map(elem => createCommonReport(elem));
      const csvCommonResult = returnCsvCommonReport(commonReport);
      return csvCommonResult;
    case 'intentReport':
      const intentReport = call.map(elem => createIntentReport(elem));
      const csvIntentResult = returnCsvIntentReport(intentReport);
      return csvIntentResult;
  }
}

function createCommonReport(call) {
  const steps = call.steps.filter(step => step.node_name === 'Class');
  let slots = [];
  if (steps.length) {
    steps.forEach(step => slots.push(step.slots.filter(slot => slot.name === 'dummy')));
  }
  return {
    sessionId: call.session_id,
    ani: call.ani,
    disconnectReason: call.disconnect_reason,
    isCaseCreated: isCaseCreatedByCall(call),
    isFewCards: isClientHasFewCards(call),
    slots,
  };
}

function createIntentReport(call) {
  const steps = call.steps.filter(step => step.node_name === 'Class');
  let slots = [];
  if (steps.length) {
    steps.forEach(step => {
      step.slots.forEach(slot => {
        if (slot && slot.name === 'dummy') {
          slots.push(`${slot.value},${step.utterance},`);
        }
      });
    });
  }
  return {
    sessionId: call.session_id,
    ani: call.ani,
    slots,
  };
}

function isCaseCreatedByCall(call) {
  const steps = call.steps.filter(step => consts.createCaseNodeIds.includes(step.node_id));
  return steps.length > 0;
}

function isClientHasFewCards(call) {
  const steps = call.steps.filter(step => consts.fewCardsNodeIds.includes(step.node_id));
  return steps.length > 0;
}

function returnCsvCommonReport(processedCalls) {
  const csvString = [
    ['ИД сессии', 'Ani', 'Причина разрыва', 'Обращение создано', 'Несколько карт', 'Шаги'],
    ...processedCalls.map(call => {
      const slots = call.slots.map(slot => (slot[0] ? slot[0].value : 'NONE'));
      return [
        call.sessionId,
        call.ani,
        call.disconnectReason,
        call.isCaseCreated,
        call.isFewCards,
        slots,
      ];
    }),
  ]
    .map(el => el.join(','))
    .join('\n');
  return csvString;
}

function returnCsvIntentReport(processedCalls) {
  const csvString = [
    ['ИД сессии', 'Ani', 'Шаги'],
    ...processedCalls.map(call => {
      return [call.sessionId, call.ani, call.slots];
    }),
  ]
    .map(el => el.join(','))
    .join('\n');
  return csvString;
}

function displayFileName(fileName) {
  // window.alert(fileName + ' DONE, Press F12, then refresh');
  const toast = toasts.initToasts();
  toast.show();
}

function getReportType() {
  const radios = Array.from(document.getElementsByTagName('input'));
  let reporType = '';
  radios.forEach(radio => {
    if (radio.checked) reporType = radio.value;
  });
  return reporType;
}

export { createReport, isCaseCreatedByCall, returnCsvCommonReport, displayFileName };
