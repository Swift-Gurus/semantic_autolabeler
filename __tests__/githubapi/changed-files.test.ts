import * as github from '@actions/github';
import * as mock from '../../__mocks__/@actions/github'
import { PullRequestContext, getChangedFiles, getPrContext } from '../../src/githubapi';
import { APIError, PullRequestContextError, Client } from '../../src/constants';

jest.mock('@actions/github');

const defaultExpected = {
  issueNumber: 123,
  headBranch: "Head branch",
  baseBranch: "Base branch",
}
const client = github.getOctokit('_');

afterAll(() => jest.restoreAllMocks());

describe('Test get pull request context', () => {
  let prContext: PullRequestContext;
  describe('when full context is provided', () => {

    it('Returns File names ', async ()  =>  {
      const files = await getChangedFiles(client, 123);
      expect(files).toEqual(mock.fileData.map((f) => f.filename ));
    });

});


})