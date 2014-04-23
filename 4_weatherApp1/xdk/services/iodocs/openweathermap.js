(function (credentials) {
  var exports = {};
  
  exports.getByGPSCoordinates = function(params) {
    var url = 'http://api.openweathermap.org/data/2.5/weather';
    
    url = url + '?' + $.param(params);
    return $.ajax({url: url, type: 'GET'});
  };

  exports.getByCityName = function(params) {
    var url = 'http://api.openweathermap.org/data/2.5/weather';
    
    url = url + '?' + $.param(params);
    return $.ajax({url: url, type: 'GET'});
  };    
    
  return exports;
})