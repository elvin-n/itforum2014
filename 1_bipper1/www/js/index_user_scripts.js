(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
    
         $(document).on("click", ".uib_w_1", function(evt)
        {
            intel.xdk.notification.beep(5);
        /* your code goes here */ 
        });
        $(document).on("click", ".uib_w_2", function(evt)
        {
            intel.xdk.notification.vibrate();
        /* your code goes here */ 
        });
        $(document).on("click", ".uib_w_3", function(evt)
        {
            intel.xdk.player.playSound('sounds/boble1.wav');
        /* your code goes here */ 
        });
}
 $(document).ready(register_event_handlers);
})();
