import * as yaml from 'js-yaml';
import fs from 'fs';
import { MatchConfig } from '../labelsgenerator';


export const getMatchConfigs = (configurationPath: string): LabelerConfig  => {
    return getYmlConfig(configurationPath);
}

const getYmlConfig = (configurationPath: string): LabelerConfig  => {
    if (!fs.existsSync(configurationPath)) {
        throw Error('Config file is not found');
    }

    const configData = fs.readFileSync(configurationPath, {
        encoding: 'utf8'
    })
    const file = yaml.load(configData) as YMLFile
    return {
        files: getFilesRules(file.file),
        automatic: file.automatic, 
    }
}

const getFilesRules = (objects: Map<string,PatternMatch[]>[]): MatchConfig[] =>  {
    return objects.map((o) => getFilesRulesFromMap(o)).flat();
}

const getFilesRulesFromMap = (object: Map<string,PatternMatch[]>): MatchConfig[] =>  {
    return Object.entries(object).map(([key, value]) =>constructPatternConfig(key, value))
}

const constructPatternConfig = (key: string, object: PatternMatch): MatchConfig => {
    return {
        labelname: key,
        anyPatterns: object.any ?? [],
        allPatterns: object.all ?? []
    }
}

export interface LabelerConfig {
    files: MatchConfig[]
    automatic: LabelerConfigAutomatic
}

interface YMLFile {
    file: Map<string,PatternMatch[]>[]
    automatic: LabelerConfigAutomatic
}

interface PatternMatch {
    any: string[]
    all: string[]
}

interface LabelerConfigAutomatic {
    head: BranchConfig
    base: BranchConfig
    files: FoldersConfig
}

interface BranchConfig {
    useTypesAsLabels: string[]
    namesForTypes: string[]
    semVersionsForTypes: string[]
}

interface FoldersConfig {
    subfoldersInRoot: string
}