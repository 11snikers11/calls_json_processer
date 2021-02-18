import * as consts from './constants.js';

function proceedCalls(call) {
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

function isCaseCreatedByCall(call) {
  const steps = call.steps.filter(step => consts.createCaseNodeIds.includes(step.node_id));
  return steps.length > 0;
}

function isClientHasFewCards(call) {
  const steps = call.steps.filter(step => consts.fewCardsNodeIds.includes(step.node_id));
  return steps.length > 0;
}

function returnCsvFromArray(processedCalls) {
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

function displayFileName(fileName) {
  const fileNameCaption = document.createElement('h3');
  fileNameCaption.append(fileName + ' DONE, Press F12, then refresh');
  document.body.append(fileNameCaption);
}

export { proceedCalls, isCaseCreatedByCall, returnCsvFromArray, displayFileName };
