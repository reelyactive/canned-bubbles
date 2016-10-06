/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */


/**
 * bubblescape Module
 * All of the JavaScript specific to the dashboard is contained inside this
 * angular module.  The only external dependencies are:
 * - cormorant and cuttlefish (reelyActive)
 * - ngSanitize (angular)
 */
angular.module('bubblescape', ['reelyactive.cormorant',
                               'reelyactive.cuttlefish', 'ngSanitize'])

/**
 * InteractionCtrl Controller
 * Handles the manipulation of all variables accessed by the HTML view.
 */
.controller('InteractionCtrl', function($scope, $attrs, $window, cormorant) {

  // Variables accessible in the HTML scope
  $scope.devices = {};
  $scope.stories = cormorant.getStories();
  $scope.visible = $attrs.visible;

  // Extract the demo type from the location, if applicable
  var demo = $window.location.search.split("demo=").pop().split('&').shift();
  var hasDemo = $window.location.search.indexOf("demo=") != -1;
  if(!hasDemo) {
    demo = 'everything';
  }

  // Create the devices based on the demo type
  switch(demo) {
    case 'everything':
      $scope.devices['00'] = JEFF_COWORKING;
  }

  // Fetch all the stories
  for(device in $scope.devices) {
    var deviceUrl = $scope.devices[device].event.deviceUrl;
    var receiverUrl = $scope.devices[device].event.receiverUrl;

    cormorant.getCombinedStory(deviceUrl, receiverUrl, function(story) {
      $scope.devices[device].story = story;
    });
  }

  // Verify if the device's story has been fetched
  $scope.hasFetchedStory = function(device) {
    return device.hasOwnProperty('story');
  };
  
});
