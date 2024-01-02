import { getMatchConfigs, LabelerConfig } from '../../src/inputs';
import * as yaml from 'js-yaml';
import fs from 'fs';
import { PatternConfig } from '../../src/labelsgenerator';
import * as mock from '../../__mocks__/@actions/labeler-config'

var readFileSync = jest.spyOn(fs, 'readFileSync')
var existsSync = jest.spyOn(fs, 'existsSync')


const getConfigs = (): LabelerConfig => {
    return getMatchConfigs('__tests__/fixtures/ymlMock.yml')
}

afterAll(() => jest.restoreAllMocks());
describe('Test get pull request context', () => {

    let config: LabelerConfig;
    describe('when full context is provided', () => {
        it('Returns File names ',  ()  =>  {
            config = getConfigs()
            expect(config).toEqual(mock.labelerMockConfig());
        });
    })
});