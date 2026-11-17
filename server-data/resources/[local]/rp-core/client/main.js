let panelOpen = false;

function setPanelVisible(visible) {
  panelOpen = visible;
  SetNuiFocus(visible, visible);
  SendNuiMessage(
    JSON.stringify({
      type: 'togglePanel',
      open: visible,
    })
  );
}

on('onClientResourceStart', (resourceName) => {
  if (resourceName !== GetCurrentResourceName()) return;
  emitNet('rp-core:server:requestSync');
});

onNet('rp-core:client:syncProfile', (payload) => {
  SendNuiMessage(
    JSON.stringify({
      type: 'syncState',
      ...payload,
    })
  );
});

RegisterCommand(
  'rphud',
  () => {
    setPanelVisible(!panelOpen);
  },
  false
);

RegisterKeyMapping('rphud', 'Mở bảng Ví & Nghề nghiệp RP', 'keyboard', 'F5');

RegisterNuiCallbackType('closePanel');
on('__cfx_nui:closePanel', (_data, cb) => {
  setPanelVisible(false);
  cb({ ok: true });
});

RegisterNuiCallbackType('transferMoney');
on('__cfx_nui:transferMoney', (data, cb) => {
  emitNet('rp-core:server:transferMoney', data);
  cb({ ok: true });
});

RegisterNuiCallbackType('requestRefresh');
on('__cfx_nui:requestRefresh', (_data, cb) => {
  emitNet('rp-core:server:requestSync');
  cb({ ok: true });
});
