import * as github from '@actions/github';
import { PullRequestContext, getPrContext } from '../../src/githubapi';
import { PullRequestContextError } from '../../src/constants';



const defaultExpected = {
  issueNumber: 123,
  headBranch: "Head branch",
  baseBranch: "release/4.2.0",
  allLabels: ["User-Defined"]
}
const client = github.getOctokit('_');


afterAll(() => jest.restoreAllMocks());


describe('Test get pull request context', () => {
  let prContext: PullRequestContext;
  describe('when full context is provided',() => {
    beforeEach(() => {
      jest.mock('@actions/github');
    });

    it('Returns Full Config ', async () => {
      jest.spyOn(client, 'paginate').mockReturnValue(<any>[{labels: {name: 'User-Defined'}}]);      
      prContext = await getPrContext(client);
      expect(prContext).toEqual(defaultExpected);
    });

});

  describe('When context is missed', () => {
    beforeEach(() => {
      github.context.payload = {  }
    });

    it('Throws Context Is Missed ', async () => {
      await expect(getPrContext(client)).rejects.toMatch(PullRequestContextError.PULL_REQUEST_CONTEXT_NOT_FOUND);
    });

  });

  describe('When base is missed', () => {
    beforeEach(() => {
      github.context.payload = { pull_request: { number: 123, head: { ref: "HEAD" } } }
    });

    it('Throws Base Is Missed ', async () => {
      await expect(getPrContext(client)).rejects.toMatch(PullRequestContextError.BASE_NAME_NOT_NOT_FOUND);
    });

  });

  describe('When head is missed', () => {
    beforeEach(() => {
      github.context.payload = { pull_request: { number: 123, base: { ref: "BASE" } } }
    });

    it('Throws Head Is Missed ', async () => {
      await expect(getPrContext(client)).rejects.toMatch(PullRequestContextError.HEAD_NAME_NOT_NOT_FOUND);
    });

  });
})