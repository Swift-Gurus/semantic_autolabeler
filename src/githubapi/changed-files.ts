import * as core from '@actions/core';
import * as github from '@actions/github';
import {Client} from '../constants/types';

export const getChangedFiles = async (
  client: Client,
  prNumber: number
): Promise<string[]> => {
  const getFilesOptions = client.rest.pulls.listFiles.endpoint.merge({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: prNumber
  });

  const fileResponse = await client.paginate(getFilesOptions);
  
  const changedFiles = fileResponse.map((f: any) => f.filename);

  core.debug('Changes in files:');
  for (const file of changedFiles) {
    core.debug('  ' + file);
  }

  return changedFiles;
};