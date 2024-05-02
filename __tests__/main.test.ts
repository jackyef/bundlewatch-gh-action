import { getBranchNameFromRef } from '../src/main';

test('get branch name correctly from ref', async () => {
  await expect(getBranchNameFromRef('refs/heads/master')).toEqual('master');
  await expect(getBranchNameFromRef('refs/heads/branch1')).toEqual('branch1');
});
