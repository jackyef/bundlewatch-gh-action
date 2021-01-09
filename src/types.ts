// Reference: https://bundlewatch.io/#/reference/configuration

type File = {
  // Glob pattern used for matching file(s)
  path: string;

  // String like '100kB' determining maximum size. If the file size is over this value,
  // the CI fails. Defaults to Infinity
  maxSize?: string;

  compression?: 'none' | 'gzip' | 'brotli';
};

type CIProperties = {
  githubAccessToken: string;
  repoOwner: string;
  repoName: string;
  repoCurrentBranch: string;
  repoBranchBase: string;
  commitSha: string;
  trackBranches?: string[];
};

export type BundlewatchConfig = {
  files?: File[];
  bundlewatchServiceHost?: string; // URL to a bundlewatch service
  ci?: CIProperties;
};

// Reference: https://bundlewatch.io/#/reference/nodejs
import { STATUSES } from 'bundlewatch';

type valueOf<T> = T[keyof T];

export type Result = {
  filePath: string;
  message?: string;

  // https://github.com/bundlewatch/bundlewatch/blob/master/src/app/analyze/analyzeFiles/index.js
  status: valueOf<STATUSES>;

  size?: number;
  baseBranchSize?: number;
  maxSize?: number;

  error?: string;
};

export type BundlewatchResults = {
  status: string;
  fullResults: Result[];
  summary: string;
  url: string;
};
