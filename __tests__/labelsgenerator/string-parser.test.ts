import * as parser from '../../src/labelsgenerator';


describe('Test branch name parsing', () => {
  describe('when type is provided', () => {
    it('Returns type ', () => {
      const type = parser.getBranchType('release/2500-sdk-new-feature');
      expect(type).toEqual('release');
    });
  });
  describe('when type is not provided', () => {
    it('Returns empty ', () => {
      const type = parser.getBranchType('2500-sdk-new-feature');
      expect(type).toEqual('');
    });
  });

  describe('when semver is provided', () => {
    it('Returns string with versions ', () => {
      const type = parser.getSemNumber('release/4.4.1');
      expect(type).toEqual('4.4.1');
    });
  });

  describe('when semver is not provided', () => {
    it('Returns empty ', () => {
      const type = parser.getSemNumber('release/2340-sdk-d');
      expect(type).toEqual('');
    });
  });
  
})


describe('Test branch info', () => {
  describe('When base case for naming <type>/<ticket-number>-<message>', () => {
    it('Returns info ', () => {
      const info = parser.getBranchInfo('release/2500-sdk-new-feature');
      const expected =  {
        type: 'release',
        semversion: '',
        name: 'sdk-new-feature',
        ticket: '2500' 
    }
      expect(info).toEqual(expected);
    });
  });
  describe('When release case for naming <type>/<semversion>', () => {
    it('Returns info ', () => {
      const info = parser.getBranchInfo('release/4.6.1');
      const expected =  {
        type: 'release',
        semversion: '4.6.1',
        name: '',
        ticket: '' 
    }
      expect(info).toEqual(expected);
    });
  });


  describe('when semver is not provided', () => {
    it('Returns empty ', () => {
      const type = parser.getSemNumber('release/2340-sdk-d');
      expect(type).toEqual('');
    });
  });
})