import * as github from '@actions/github';
import * as core from '@actions/core';
import { APIError, PullRequestContextError } from '../constants';
import {Client} from '../constants/types';
import {getLabels} from './issue-labels';

export interface PullRequestContext {
    issueNumber: number
    headBranch: String;
    baseBranch: String;
    allLabels: String[];
}

const reject = (error: PullRequestContextError): Promise<PullRequestContext> => { 
    return Promise.reject(error);
}

export const getPrContext = async (client: Client): Promise<PullRequestContext> =>   {
    const prContext = github.context.payload.pull_request;
    
    if (!prContext) {
        return reject(PullRequestContextError.PULL_REQUEST_CONTEXT_NOT_FOUND);
    }
    const prNumber = prContext.number
    if (!prNumber) {
        return reject(PullRequestContextError.ISSUE_NUMBER_NOT_FOUND);
    }
    const branchName = prContext.base?.ref
    const headName = prContext.head?.ref
    
    if (!branchName) {
        return reject(PullRequestContextError.BASE_NAME_NOT_NOT_FOUND);
    }

    if (!headName) {
        return reject(PullRequestContextError.HEAD_NAME_NOT_NOT_FOUND);
    }


    const allLabels = await getLabels(client, prNumber);
    return { 
        issueNumber: prNumber,
        headBranch: headName,
        baseBranch: branchName,
        allLabels: allLabels
    };
  };