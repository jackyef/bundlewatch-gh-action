module.exports = {
  files: [
    {
      path: './lib/main.js',
      maxSize: '200 KB',
    },
  ],
  ci: {
    trackBranches: ['master', 'testing-branch-do-not-delete'],
  },
};
