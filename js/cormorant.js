/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */

angular.module('reelyactive.cormorant', [])

  .factory('cormorant', function cormorantFactory($http) {

    var stories = {};

    function extractFromHtml(html) {
      var tagIndex = html.search(/(<script\s*?type\s*?=\s*?"application\/ld\+json">)/);
      if(tagIndex < 0) {
        return null;
      }
      var startIndex = html.indexOf('>', tagIndex) + 1;
      var stopIndex = html.indexOf('</script>', startIndex);
      var jsonString = html.substring(startIndex, stopIndex);

      try {
        json = JSON.parse(jsonString);
      }
      catch(e) {
        console.log(e);
        console.log(jsonString);
        return null;
      }
      return json;
    }

    function getStoryTypes(story) {
      var types = [];

      if(story && story.hasOwnProperty('@graph') &&
         story['@graph'] instanceof Array) {
        for(var cType = 0; cType < story['@graph'].length; cType++) {
          types.push(story['@graph'][cType]['@type']);
        }
      }

      return types;
    }

    function combine(story1, story2) {
      var types1 = getStoryTypes(story1);
      var types2 = getStoryTypes(story2);

      if(types1.length > 0) {
        for(var cType = 0; cType < types2.length; cType++) {
          if(types1.indexOf(types2[cType]) < 0) {
            story1['@graph'].push(story2['@graph'][cType]);
          }
        }
      }

      return story1;
    }

    var get = function(url, callback) {
      if(!url || (typeof url !== 'string')) {
        return callback(null, null);
      }
      if(stories.hasOwnProperty(url)) {
        return callback(stories[url], url);
      }
      $http.defaults.headers.common.Accept = 'application/json, text/plain';
      $http.get(url)
        .success(function(data, status, headers, config) {
          switch(typeof data) {
            case 'string':
              data = extractFromHtml(data);
            case 'object':
              stories[url] = data;
              callback(data, url);
          }
        })
        .error(function(data, status, headers, config) {
          console.log('cormorant: GET ' + url + ' returned status ' + status);
          stories[url] = null;
          callback(null, url);
        });
    };

    var getCombined = function(url1, url2, id, callback) {
      get(url1, function(story1) {
        if(!story1) {
          return callback(null, id);
        }
        get(url2, function(story2) {
          if(!story2) {
            return callback(story1, id);
          }
          var combinedStory = combine(story1, story2);
          callback(combinedStory, id);
        });
      });
    };

    return {
      getStory: get,
      getCombinedStory: getCombined,
      getStories: function() { return stories; }
    }
  });
