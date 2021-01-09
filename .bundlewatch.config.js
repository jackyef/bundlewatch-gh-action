module.exports = {
  files: [
    {
      path: './lib/main.js',
      maxSize: '300 KB',
    },
  ],
  ci: {
    trackBranches: ['master', 'testing-branch-do-not-delete'],
  },
};
