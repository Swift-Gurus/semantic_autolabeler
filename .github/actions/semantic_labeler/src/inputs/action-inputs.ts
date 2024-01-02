import * as core from '@actions/core';

export const getActionInputs = () => ({
  token: core.getInput('repo-token'),
  ymlFilePath: core.getInput('yml-path', {required: true}),
  syncLabels: !!core.getInput('sync-labels'),
});