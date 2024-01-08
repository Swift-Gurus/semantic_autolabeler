import * as generator from '../../src/labelsgenerator';

const defaultEmptyBranchInfo = () => {
  return {
    type: '',
    semversion: '',
    name: '',
    ticket: '',
  }
};
const defaultFileChanges = ()=> [
      'ci/fullpath/iOS/SDK/Common/file1.swift',
      'ci/fullpath/iOS/SDK/Common/file2.swift',
      'ci/fullpath/Android/SDK/file2.kt',
      'ci/fullpath/Android/SDK/file2.java',
      'ci/fullpath/fastlane/file'
 ];

 const defaultEmptyBranchConfig = () => {
   return {
    useType: false,
    useName: false,
    useSemVer: false
   }
 }

 const defaultEmptyLabelerConfigAutomatic = () => {
   return {
      head: defaultEmptyBranchConfig(),
      base: defaultEmptyBranchConfig(),
   }
 }

 const defaultEmptyPatternConfig = () => {
  return {
    matchConfigs: [] as generator.MatchConfig[],
    automatic: defaultEmptyLabelerConfigAutomatic(),
    files: {'root': 'SDK'}
  }
 }

 const defaultEmptyLabelParams = () => {
  return {
    headInfo: defaultEmptyBranchInfo(),
    baseInfo: defaultEmptyBranchInfo(),
    patternConfig: defaultEmptyPatternConfig(),
    fileChanges: [] as string[]
  }
 }

describe('Labels Generator tests', () => {
    
    describe('When Use Base Type Label set to true', () => {
      it('Returns Base Type Label ', () => {
        let params = defaultEmptyLabelParams()
        params.baseInfo.type = 'release';
        params.patternConfig.automatic.base.useType = true;
        const typeLabels = generator.getLabels(params);
        expect(typeLabels).toEqual([{name: 'release',  "isMatching": true}]);
      });
    });

    describe('When Use Current Type Label set to true', () => {
        it('Returns Current Type Label ', () => {
          let params = defaultEmptyLabelParams()
          params.headInfo.type = 'feature';
          params.patternConfig.automatic.head.useType = true;
          const typeLabels = generator.getLabels(params);
          expect(typeLabels).toEqual([{name: 'feature', "isMatching": true}]);
        
        });
      });

      describe('When Use Autogen Using Sem version from Base set to true', () => {
        it('Returns Sem version from Base ', () => {
          let params = defaultEmptyLabelParams()
          params.baseInfo.type = 'release';
          
          params.baseInfo.semversion = '4.6.1'
          params.patternConfig.automatic.base.useSemVer = true;
          params.patternConfig.automatic.base.useType = true;
          const typeLabels = generator.getLabels(params);
          expect(typeLabels).toEqual([{name: '4.6.1', "isMatching": true}, {name: 'release', "isMatching": true}]);
        });
      });

      describe('Adds label for iOS pattern', () => {
        it('Returns iOS Labels ', () => {
          const iOSPattern = {
             labelname: 'iOS',
             anyPatterns: ['**/iOS/**'],
             allPatterns: []
          }
          let params = defaultEmptyLabelParams()
          params.patternConfig.matchConfigs = [iOSPattern]
          params.fileChanges = defaultFileChanges()
          const typeLabels = generator.getLabels(params);
          expect(typeLabels).toEqual([{name: 'iOS', "isMatching": true}, {name: 'Common', "isMatching": true}]);
        });
      });
    
  })