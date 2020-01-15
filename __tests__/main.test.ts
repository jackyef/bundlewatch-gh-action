import { getBranchNameFromRef } from '../src/main';
// import * as process from 'process';
// import * as cp from 'child_process';
// import * as path from 'path';

test('get branch name correctly from ref', async () => {
  await expect(getBranchNameFromRef('refs/heads/master')).toEqual('master');
  await expect(getBranchNameFromRef('refs/heads/branch1')).toEqual('branch1');
});
