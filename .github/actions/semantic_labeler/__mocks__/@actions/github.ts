const fileBaseInfo = {
  sha: 'sha',
  blob_url: 'blob_url',
  raw_url: 'raw_url',
  contents_url: 'content_url',
};

export const fileData = [
  { filename: 'ci/iOS/SDK/file1.txt', changes: 3, additions: 7, deletions: 4, status: 'modified', ...fileBaseInfo },
  { filename: 'ci/Android/SDK/file2.txt', changes: 2, additions: 6, deletions: 4, status: 'modified', ...fileBaseInfo },
  { filename: 'ci/fastlane/server.js', changes: 8, additions: 6, deletions: 4, status: 'modified', ...fileBaseInfo },
];

export const context = {
    payload: {
      pull_request: {
        number: 123,
        base: { ref: "release/4.2.0" },
        head: { ref: "Head branch" }
      }
    },
    repo: {
      owner: 'unity-ads-team',
      repo: 'unity-ads'
    },
    data: {
      labels: [
        { name: 'User-Defined' },
      ]
    }
  };
  
  export const mockApi = {
    rest: {
      issues: {
        setLabels: jest.fn(),
      },
      pulls: {
        get: {
          endpoint: {
            merge: jest.fn().mockReturnValue({})
          },
          data: [{labels: {name: 'User-Defined'}}]
        },
        listFiles: {
          endpoint: {
            merge: jest.fn().mockReturnValue({})
          },
          data: fileData
        }
      },
      repos: {
        getContent: jest.fn()
      }
    },
    paginate: jest.fn().mockReturnValue(fileData)
  };
  


  export const getOctokit = jest.fn().mockImplementation(() => mockApi);