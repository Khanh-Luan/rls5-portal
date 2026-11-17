const test = require('node:test');
const assert = require('node:assert/strict');

const config = require('../server-data/resources/[local]/rp-core/shared/config.js');
const { EconomyStore } = require('../server-data/resources/[local]/rp-core/server/economy.js');

test('initializes player with default cash, bank, and unemployed job', () => {
  const store = new EconomyStore({ config });
  const profile = store.ensurePlayer(1, 'Tester A');

  assert.equal(profile.id, '1');
  assert.equal(profile.name, 'Tester A');
  assert.equal(profile.cash, config.startingCash);
  assert.equal(profile.bank, config.startingBank);
  assert.equal(profile.job, 'unemployed');
});

test('transfers bank funds between players and records history', () => {
  const store = new EconomyStore({ config });
  store.ensurePlayer(1, 'Sender');
  store.ensurePlayer(2, 'Receiver');

  const res = store.transferBank(1, 2, 2500, 'Mua xe cũ');
  assert.equal(res.ok, true);
  assert.equal(res.sender.bank, config.startingBank - 2500);
  assert.equal(res.receiver.bank, config.startingBank + 2500);
  assert.equal(res.sender.transactions[0].type, 'transfer_out');
  assert.equal(res.receiver.transactions[0].type, 'transfer_in');
});

test('rejects invalid or exploitative transfer payloads', () => {
  const store = new EconomyStore({ config });
  store.ensurePlayer(1, 'Player 1');
  store.ensurePlayer(2, 'Player 2');

  assert.equal(store.transferBank(1, 1, 100).ok, false);
  assert.equal(store.transferBank(1, 2, -500).ok, false);
  assert.equal(store.transferBank(1, 2, 10.5).ok, false);
  assert.equal(store.transferBank(1, 2, 99999999).ok, false);
  assert.equal(store.transferBank(1, 99, 100).ok, false);
});

test('updates job and pays configured salary on cycle', () => {
  const store = new EconomyStore({ config });
  store.ensurePlayer(1, 'Officer');

  const jobRes = store.setJob(1, 'police', 2);
  assert.equal(jobRes.ok, true);
  assert.equal(jobRes.profile.job, 'police');
  assert.equal(jobRes.profile.jobGrade, 2);
  assert.equal(jobRes.profile.jobGradeLabel, 'Trung úy');

  const payouts = store.paySalaries();
  assert.equal(payouts.length, 1);
  assert.equal(payouts[0].amount, config.jobs.police.salary);
  assert.equal(store.getProfile(1).bank, config.startingBank + config.jobs.police.salary);
});

test('prevents negative balances on removeMoney', () => {
  const store = new EconomyStore({ config });
  store.ensurePlayer(1, 'Player 1');

  const fail = store.removeMoney(1, 'cash', config.startingCash + 1);
  assert.equal(fail.ok, false);
  assert.equal(store.getProfile(1).cash, config.startingCash);
});
