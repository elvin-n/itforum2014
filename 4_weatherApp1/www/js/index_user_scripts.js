(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
var geolocationSuccess = function(position){
                $('#TestOutput')[0].innerHTML="lat + " + position.coords.latitude + "lon " + position.coords.longitude;
                intel.xdk.services.openweathermapgetByGPSCoordinates({"lat":" " + position.coords.latitude  
                                                                      + "","lon":" " + position.coords.longitude})
                .then(function (response) {
                    // console.log(response)
                    //response.main
                    $('#GPSCity').html(response.name);
                    $('#GPSTemp').html((parseFloat(response.main.temp-273)).toFixed(1));
                    activate_subpage("#uib_page_1");
                });
            }

 function register_event_handlers()
 {
    
    
         $(document).on("click", ".uib_w_4", function(evt)
        {
            navigator.geolocation.getCurrentPosition(geolocationSuccess);
            
          
        });
        
        $(document).on("click", ".uib_w_8", function(evt)
        {
         activate_subpage("#mainsub"); 
        });
        
        $(document).on("click", "#CityInfoButton", function(evt)
        {
            var cityName = $('#idCityName')[0].value;
            if( !cityName.length ) 
                cityName = $('#idCityName')[0].placeholder;
            intel.xdk.services.openweathermapgetByGPSCoordinates({"q":" " + cityName })
            .then ( function (response ) {
                    $('#GPSCity').html(response.name);
                    $('#GPSTemp').html((parseFloat(response.main.temp-273)).toFixed(1));
                activate_subpage("#uib_page_1");
            });
        /* your code goes here */ 
        });
}
 $(document).ready(register_event_handlers);
})();
