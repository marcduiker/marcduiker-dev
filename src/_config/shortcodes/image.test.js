import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeLoading} from './image.js';

test('passes through valid values', () => {
  assert.equal(normalizeLoading('lazy'), 'lazy');
  assert.equal(normalizeLoading('eager'), 'eager');
});

test('defaults to lazy for undefined', () => {
  assert.equal(normalizeLoading(undefined), 'lazy');
});

test('coerces a widths-array (the bug) to lazy', () => {
  assert.equal(normalizeLoading([960]), 'lazy');
  assert.equal(normalizeLoading([0]), 'lazy');
});

test('coerces numbers and junk strings to lazy', () => {
  assert.equal(normalizeLoading(960), 'lazy');
  assert.equal(normalizeLoading('960'), 'lazy');
});
