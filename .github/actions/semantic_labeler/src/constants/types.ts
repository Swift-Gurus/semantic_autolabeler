import * as github from '@actions/github';
export type Client = ReturnType<typeof github.getOctokit>;

export enum PullRequestContextError {
    ISSUE_NUMBER_NOT_FOUND = "Issue Number Not Found",
    BASE_NAME_NOT_NOT_FOUND = "Require to have base branch name",
    HEAD_NAME_NOT_NOT_FOUND = "Require to have head branch name",
    PULL_REQUEST_CONTEXT_NOT_FOUND = "PR Context Not Found"
}

export const APIError = (prError: PullRequestContextError): Error => {
    return new Error(prError);
}