
import { PullRequestContext, getChangedFiles, getPrContext } from '../githubapi';
import { getMatchConfigs, getActionInputs } from '../inputs';
import { LabelsParams, getLabels, getBranchInfo } from '../labelsgenerator';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { Client } from '../constants';
import { setLabels } from '../githubapi/set-labels';


interface PullRequestInfo extends PullRequestContext {
    fileChanges: string[]
}

export const run = () =>
  labeler().catch(error => {
    core.error(error);
    core.setFailed(error.message);
  });


async function labeler() {
    core.debug('Reading Inputs')
    const inputs = getActionInputs();    

    core.debug('Getting PR Context')
    const client: Client = github.getOctokit(inputs.token, {});
    const prContext = await getPrContext(client);

    core.debug('Getting Filechanges: ');
    const changes = await getChangedFiles(client, prContext.issueNumber);

    const prInfo = {
        ...prContext,
        fileChanges: changes
    }

    core.debug('Getting Matching Patterns');
    const patterns = getPatterns(inputs.ymlFilePath, prInfo);

    core.debug('Getting Labels');
    const labels = getLabels(patterns);
    const allLabels: Set<String> = new Set<String>(prInfo.allLabels);
    for (const config of labels) {
        if (config.isMatching) {
          allLabels.add(config.name);
        } else if (inputs.syncLabels) {
          allLabels.delete(config.name);
        }
      }
    const labelNames =  Array.from(allLabels).map((l) => l.toString());
    core.debug(`Setting labels: ${labelNames}`);
    
    await setLabels(client, prContext.issueNumber, labelNames);
    core.setOutput('added-labels', labelNames.join(','));
};

export const getPatterns = (configurationPath: string, prInfo: PullRequestInfo): LabelsParams => {
    const config = getMatchConfigs(configurationPath);
    const baseBranchInfo = getBranchInfo(prInfo.baseBranch);
    const headBranchInfo = getBranchInfo(prInfo.headBranch);
    const baseAuto = {
        useType: config.automatic.base.useTypesAsLabels.includes(baseBranchInfo.type),
        useName: config.automatic.base.namesForTypes.includes(baseBranchInfo.type),
        useSemVer: config.automatic.base.semVersionsForTypes.includes(baseBranchInfo.type),
    }

    const headAuto = {
        useType: config.automatic.head.useTypesAsLabels.includes(headBranchInfo.type),
        useName: config.automatic.head.namesForTypes.includes(headBranchInfo.type),
        useSemVer: config.automatic.head.semVersionsForTypes.includes(headBranchInfo.type),
    }
    
    const automatic = {
        head: headAuto,
        base: baseAuto
    }

    const patternConfig = {
        matchConfigs: config.files,
        automatic: automatic,
        files: {
            root: config.automatic.files.subfoldersInRoot
        }
    }

    return {
        headInfo: headBranchInfo,
        baseInfo: baseBranchInfo,
        patternConfig: patternConfig,
        fileChanges: prInfo.fileChanges
    }
}