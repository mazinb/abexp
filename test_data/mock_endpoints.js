const mockResponse = {
    status: "success",
    experimentInfo: {
      experimentName: "MyFirstExperiment",
      experimentId: 17945202,
      createdAt: "2024-02-24T13:14:42.043Z",
      experimentStatus: "Flat B",
      runData: {
        startDate: "2024-02-24T13:30:32.304Z",
        durationDays: 30,
        endDate: "2024-02-25T07:51:07.566Z",
        finalDurationDays: 1,
        finalSampleSize: 8,
        trafficRate: 100,
        allocatedUsers: {
          A: 5,
          B: 3,
        },
      },
    },
  };
  
  // Mock endpoint handler
  function mockEndpointHandler(req, res) {
    res.json(mockResponse);
  }
  
  module.exports = {
    mockEndpointHandler,
  };