import * as core from '@actions/core';
import * as github from '@actions/github';

import {Client} from '../constants/types';

export const getLabels = async (
  client: Client,
  prNumber: number
): Promise<string[]> => {

  const labels = client.rest.pulls.get.endpoint.merge({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: prNumber
  });

  const labelsResponse = await client.paginate(labels);
  const currentLabels = labelsResponse.flatMap((response: any) => response.labels)
                                      .map((l: any) => l.name);

  core.debug('Current Labels:');
  for (const label of currentLabels) {
    core.debug('  ' + label);
  }

  return currentLabels;
};