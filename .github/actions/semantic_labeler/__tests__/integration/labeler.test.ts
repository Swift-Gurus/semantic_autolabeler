import {run} from '../../src/labeler/labeler';
import * as github from '@actions/github';
import * as core from '@actions/core';
import path from 'path';
import fs from 'fs';
import {RequestInterface, EndpointOptions} from '@octokit/types';

jest.mock('@actions/core');
jest.mock('@actions/github');

const gh = github.getOctokit('_');
const setLabelsMock = jest.spyOn(gh.rest.issues, 'setLabels');
const reposMock = jest.spyOn(gh.rest.repos, 'getContent');
const paginateMock = jest.spyOn(gh, 'paginate');
const readFileSyncMock = jest.spyOn(fs, 'readFileSync');
const existsSyncMock = jest.spyOn(fs, 'existsSync');
const coreErrorMock = jest.spyOn(core, 'error');
const coreWarningMock = jest.spyOn(core, 'warning');
const coreSetFailedMock = jest.spyOn(core, 'setFailed');
const setOutputSpy = jest.spyOn(core, 'setOutput');


const yamlMocks = {
  'defaultMock': fs.readFileSync('__tests__/fixtures/ymlMock.yml')
};
  
const configureInput = (
  mockInput: Partial<{
    'repo-token': string;
    'yml-path': string;
    'sync-labels': boolean;
  }>
) => {
  jest
    .spyOn(core, 'getInput')
    .mockImplementation((name: string, ...opts) => mockInput[name]);
  jest
    .spyOn(core, 'getMultilineInput')
    .mockImplementation((name: string, ...opts) => mockInput[name]);
  jest
    .spyOn(core, 'getBooleanInput')
    .mockImplementation((name: string, ...opts) => mockInput[name]);
};

afterAll(() => jest.restoreAllMocks());


describe('run', () => {
  it('adds labels to PRs that match our glob patterns for iOS', async () => {
    configureInput({'yml-path': '__tests__/fixtures/ymlMock.yml'});
    usingLabelerConfigYaml('defaultMock');
    mockGitHubResponseChangedFiles(['iOS/SDK/Public/SourceCode/Private/Core/Device/HeaderBiddingTokenReader/ScarHeaderBidding/UADSHeaderBiddingTokenReaderWithSCARSignalsBaseStrategy+Internal.h']);

    await run();

    expect(setLabelsMock).toHaveBeenCalledTimes(1);

    expect(setLabelsMock).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 123,
      labels: ['iOS','4.2.0', 'Public']
    });
  });

  it('adds labels to PRs that match our glob patterns for Android', async () => {
    configureInput({'yml-path': '__tests__/fixtures/ymlMock.yml'});
    usingLabelerConfigYaml('defaultMock');
    mockGitHubResponseChangedFiles(['ci/Android/file.kt']);;

    await run();

    expect(setLabelsMock).toHaveBeenCalledTimes(1);

    expect(setLabelsMock).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 123,
      labels: ['Android','4.2.0']
    });
  });

  
  it('adds labels to PRs that match our glob patterns for CI', async () => {
    configureInput({'yml-path': '__tests__/fixtures/ymlMock.yml'});
    usingLabelerConfigYaml('defaultMock');
    mockGitHubResponseChangedFiles(['.github/labeler.yml']);

    await run();

    expect(setLabelsMock).toHaveBeenCalledTimes(1);

    expect(setLabelsMock).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 123,
      labels: ['CI','4.2.0']
    });
  });

  it('removes labels from the list when the condition changed', async () => {
    configureInput({'yml-path': '__tests__/fixtures/ymlMock.yml', "sync-labels": true});
    usingLabelerConfigYaml('defaultMock');
    mockGitHubResponseChangedFiles(['ci/Android/file.kt']);
    github.context.payload.labels = [{name: 'iOS'}];

    await run();

    expect(setLabelsMock).toHaveBeenCalledTimes(1);

    expect(setLabelsMock).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 123,
      labels: ['Android','4.2.0']
    });
  });


  it('keeps custom labels in the list', async () => {
    configureInput({'yml-path': '__tests__/fixtures/ymlMock.yml'});
    usingLabelerConfigYaml('defaultMock');
    mockGitHubResponseChangedFiles(['ci/Android/file.kt'], ['User Defined']);
    await run();

    expect(setLabelsMock).toHaveBeenCalledTimes(1);

    expect(setLabelsMock).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 123,
      labels: ['User Defined','Android','4.2.0']
    });
  });
  
})

function usingLabelerConfigYaml(fixtureName: keyof typeof yamlMocks): void {
  reposMock.mockResolvedValue(<any>{
    data: {content: yamlMocks[fixtureName], encoding: 'utf8'}
  });
}

function mockGitHubResponseChangedFiles(files: String[], labels: String[]= []): void {
  const returnValue = files.map(f => ({filename: f}));
  const lableReturnedValues = labels.map(l => ({name: l}));
  paginateMock.mockReturnValueOnce(Promise.resolve([{labels: lableReturnedValues}]))
              .mockReturnValue(Promise.resolve(returnValue));
}