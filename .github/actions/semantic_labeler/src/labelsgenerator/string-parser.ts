
const defaultPatternMatch = /([^/]+)\/(\d+)-(.+)/;
const semVersionRegEx = /([^/]+)\/(\d+\.\d+\.\d+)(?:-([^/]+))?/;

export interface BranchInfo {
    type: string
    semversion: string
    name: string
    ticket: string
}

const emptyBranchInfo = (): BranchInfo => {
 return {
    type: '',
    semversion: '',
    name: '',
    ticket: ''
 };
};

export const getBranchInfo = (branchName: String): BranchInfo => {
    const defBranchInfo = getBranchInfoViaDefaultPattern(branchName);
    const semBranchInfo = getBranchInfoViaSemVersion(branchName);
    return {
        name: defBranchInfo.name.length > 0 ? defBranchInfo.name : semBranchInfo.name,
        type: defBranchInfo.type.length > 0 ? defBranchInfo.type : semBranchInfo.type,
        semversion: defBranchInfo.semversion.length > 0 ? defBranchInfo.semversion : semBranchInfo.semversion,
        ticket: defBranchInfo.ticket.length > 0 ? defBranchInfo.ticket : semBranchInfo.ticket
    }
}

export const getBranchInfoViaDefaultPattern = (branchName: String): BranchInfo => {
    const splits = splitBranchName(branchName, defaultPatternMatch)
    if (splits.length < 3) {
        return emptyBranchInfo();
    }
    let info = {
        type: splits[0].toString() ?? '',
        semversion: '',
        ticket: splits[1].toString() ?? '',
        name: splits[2].toString() ?? ''
    }
    if (info.type.length <= 0 || info.ticket.length <= 0 || info.name.length <= 0) {
        return emptyBranchInfo();
    }

    return info;
}

export const getBranchInfoViaSemVersion = (branchName: String): BranchInfo => {
    const splits = splitBranchName(branchName, semVersionRegEx)
    if (splits.length < 2) {
        return emptyBranchInfo();
    }
    let info = {
        type: splits[0].toString() ?? '',
        semversion: splits[1].toString() ?? '',
        ticket: '',
        name: ''
    }
    if (info.type.length <= 0 || info.semversion.length <= 0) {
        return emptyBranchInfo();
    }

    return info;

}

export const getBranchType = (branchName: String, regexPattern: { [Symbol.match](string: string): RegExpMatchArray | null; } = defaultPatternMatch): String => {
    const splitArray = splitBranchName(branchName,regexPattern);
    if (splitArray.length >= 1) {
        return splitArray[0]
    }
    return '';
}

export const splitBranchName = (branchName: String, regexPattern: { [Symbol.match](string: string): RegExpMatchArray | null; }, numberOfElements: number = 3): String[] => {
    const match = branchName.match(regexPattern);
    if (match) {
        return Array.from({ length: numberOfElements }, (_, i) => match[i + 1]);
    } else {
        return [];
    }
    
}

export const getSemNumber = (branchName: String): String => {
    const splitArray = splitBranchName(branchName, semVersionRegEx);
    if (splitArray.length < 3) { return '' }
    return splitArray[1];
}
