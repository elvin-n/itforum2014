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
        $(document).on("click", ".uib_w_5", function(evt)
        {
             $('#TestOutput')[0].innerHTML='test city name';
         activate_subpage("#uib_page_1"); 
        });
        $(document).on("click", ".uib_w_8", function(evt)
        {
         activate_subpage("#mainsub"); 
        });
}
 $(document).ready(register_event_handlers);
})();
