import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('all articles pass the editorial quality gate', () => {
  const run = spawnSync(process.execPath, ['scripts/articles/validate.mjs'], { encoding: 'utf8' });
  assert.equal(run.status, 0, `${run.stdout}\n${run.stderr}`);
});
