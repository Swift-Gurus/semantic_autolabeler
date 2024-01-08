
export const labelerMockConfig = ()  => {
 return {
        'automatic': {
            'base': {
                'useTypesAsLabels': [],
                'namesForTypes': ['epic'],
                'semVersionsForTypes': ['release'],
            },
            'head': {
                'useTypesAsLabels': [],
                'namesForTypes': [],
                'semVersionsForTypes': [],
            },
            'files': {
                'subfoldersInRoot': 'SDK',
            },
            
        },
        
        'files':  [{
            'labelname': 'iOS',
            'anyPatterns': ['**/iOS/**'],
            'allPatterns': []
            },
            {
            'labelname': 'Android',
            'anyPatterns': ['**/Android/**'],
            'allPatterns': []
            },
            {
                "labelname": "CI",
                "allPatterns": ['!**/Android/**','!**/iOS/**'],
                "anyPatterns": []
            }
        ]
    }
}