import minimatch, { Minimatch } from 'minimatch';
import * as parser from '../labelsgenerator';
import { BranchInfo } from '../labelsgenerator';

export interface LabelConfig {
    name: String
    isMatching: Boolean
}


export interface PatternConfig {
    matchConfigs: MatchConfig[]
    automatic: BranchPatterns
    files: ChangesAutoPatterns
}

export interface BranchPatterns {
    head: BranchAutomatic
    base: BranchAutomatic
}

export interface ChangesAutoPatterns {
    root: String
}

export interface BranchAutomatic {
    useType: Boolean
    useName: Boolean
    useSemVer: Boolean
}

export interface MatchConfig {
    allPatterns: String[]
    anyPatterns: String[]
    labelname: String
}

export interface LabelsParams {
    headInfo: BranchInfo
    baseInfo: BranchInfo
    patternConfig: PatternConfig
    fileChanges: string[]
}

export const getLabels = (params: LabelsParams): LabelConfig[] =>   {
    let sets: Set<LabelConfig>[] = params.patternConfig.matchConfigs.map ((pattern) => getOrGenerateLabel(pattern, params.fileChanges));
    sets.push(generateAutomaticLabels(params.baseInfo, params.patternConfig.automatic.base))
    sets.push(generateAutomaticLabels(params.headInfo, params.patternConfig.automatic.head))
    sets.push(generateAutomaticLabelsForFiles(params))

    const outputSet = new Set();
    
    const mergedSet = sets.reduce((acc, set) => new Set([...acc, ...set]), new Set<LabelConfig>())
    const arr = Array.from(mergedSet).filter((cfg) => cfg.name.length > 1);

    return arr.filter(item => !outputSet.has(JSON.stringify(item)) 
    ? outputSet.add(JSON.stringify(item)) 
    : false
    );
    
}

const generateAutomaticLabels =(branchInfo: BranchInfo, automatic: BranchAutomatic): Set<LabelConfig> => {
    const labels: Set<LabelConfig> = new Set<LabelConfig>();
    if (automatic.useName) {
        labels.add({ name: branchInfo.name, isMatching: true })
    }

    if (automatic.useSemVer) {
        labels.add({ name: branchInfo.semversion, isMatching: true })
    }

    if (automatic.useType) {
        labels.add({ name: branchInfo.type, isMatching: true })
    }

    return labels
}

const generateAutomaticLabelsForFiles = (params: LabelsParams): Set<LabelConfig> => {
    const labels: Set<LabelConfig> = new Set<LabelConfig>();
    const root = params.patternConfig.files.root;
    const fileChanges = params.fileChanges.filter((file) => file.includes(root.toString()))
                                          .flatMap((file) => extractLabelNameFromFile(file, root.toString()))
                                          .filter((file) => file.length > 1)
                                          .map((file) => ({ name: file, isMatching: true }))

     for (const file of fileChanges) {
        labels.add(file)
     }                                     

    return labels
}

const extractLabelNameFromFile = (file: String, root: String): string => {
    if (!file.includes(`\/${root.toString()}\/`)) {
        return '';
    }
    let input = (file.split(`\/${root.toString()}\/`)[1] ?? '')
    let split = input.split('/')
    if (split.length < 2) {
        return '';
    }
    // const regex = new RegExp(/\/([^\/]+)\/[^\/]+$/);
    // const match = input.match(regex);
    // let value = ''
    // if (match && match[1]) {
    //     value = match[1];
    // }
    return split[0] ?? '';
}


const getOrGenerateLabel = (params: MatchConfig, fileChanges: string[]): Set<LabelConfig> => {
    const labels: Set<LabelConfig> = new Set<LabelConfig>();

    labels.add(getLabelsBasedOnMatching(params, fileChanges))

    return labels;
}

const getLabelsBasedOnMatching = (params: MatchConfig, fileChanges: string[]): LabelConfig => {
    let config = params ?? { labelname: '', patterns: []};
    const anyMatchers =  config.anyPatterns.map((p) => new Minimatch(p.toString())) ?? [];
    const allMatchers =  config.allPatterns.map((p) => new Minimatch(p.toString())) ?? [];
    let anyMatch = anyMatchers.some(matcher => matchesAtLeastOne(fileChanges, matcher));
    anyMatch = anyMatchers.length === 0 ? true : anyMatch;
    let allMatch = allMatchers.every(matcher => matchesAtLeastOne(fileChanges, matcher));
    allMatch = allMatchers.length === 0 ? true : allMatch;
    let matches = anyMatch && allMatch;
    return {name: config.labelname, isMatching: matches }
    
}

const matchesAtLeastOne = (fileChanges: string[], matcher: Minimatch): Boolean => {
    return fileChanges.some(fileName => matcher.match(fileName.toString()))
}

const getLabelForBranchType = (branchName: String): String => {
    return parser.getBranchType(branchName);
}