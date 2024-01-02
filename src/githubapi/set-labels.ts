import * as github from '@actions/github';
import {Client} from '../constants/types';

export const setLabels = async (
  client: Client,
  prNumber: number,
  labels: string[]
) => {
  await client.rest.issues.setLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: prNumber,
    labels: labels
  });
};
