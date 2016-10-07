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
    case 'coworking':
      $scope.devices['000000000000'] = JEFF_FITBIT_COWORKING;
      $scope.devices['000000000010'] = BRIAN_IPHONE_COWORKING;
      $scope.devices['000000000020'] = BENOIT_REELYAPP_COWORKING;
      $scope.devices['000000000030'] = VINCENT_IPHONE_COWORKING;
      $scope.devices['000000000040'] = VAUGHN_TAG_COWORKING;
      $scope.devices['000000000050'] = SIMON_WEWORK_COWORKING;
      $scope.devices['000000000060'] = JARRED_WEWORK_COWORKING;
      $scope.devices['000000000070'] = MARTA_WEWORK_COWORKING;
      break;
    case 'gym':
      $scope.devices['000000000000'] = JEFF_FITBIT_GYM;
      $scope.devices['000000000010'] = BRIAN_IPHONE_GYM;
      $scope.devices['000000000020'] = BENOIT_REELYAPP_GYM;
      $scope.devices['000000000030'] = VINCENT_IPHONE_GYM;
      $scope.devices['000000000040'] = VAUGHN_TAG_GYM;
      $scope.devices['000000000050'] = HUGO_BMR_GYM;
      break;
    default:
      $scope.devices['000000000000'] = JEFF_FITBIT_COWORKING;
      $scope.devices['000000000010'] = BRIAN_IPHONE_GYM;
      $scope.devices['000000000020'] = BENOIT_REELYAPP_COWORKING;
      $scope.devices['000000000030'] = VINCENT_IPHONE_GYM;
      $scope.devices['000000000040'] = VAUGHN_TAG_COWORKING;
      $scope.devices['000000000050'] = SIMON_WEWORK_COWORKING;
      $scope.devices['000000000060'] = JARRED_WEWORK_COWORKING;
      $scope.devices['000000000070'] = MARTA_WEWORK_COWORKING;
  }

  // Fetch all the combined stories
  for(device in $scope.devices) { 
    var deviceUrl = $scope.devices[device].event.deviceUrl;
    var receiverUrl = $scope.devices[device].event.receiverUrl;
    cormorant.getCombinedStory(deviceUrl, receiverUrl, device,
                               function(story, id) {
      $scope.devices[id].story = story;
    });
  }

  // Verify if the device's story has been fetched
  $scope.hasFetchedStory = function(device) {
    return device.hasOwnProperty('story');
  };
  
});
