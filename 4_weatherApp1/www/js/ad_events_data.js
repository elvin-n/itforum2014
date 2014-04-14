(function()
 {
     window.data_event_handlers = {
                                    on_init_proplist:{},
                                    on_data_proplist:{},      //<-- this is really more on_render
                                    on_click_proplist:{},     
                                    tags:{"standard-list":{child:"li", parent:"ul"}}
                                  };    
     
     
     window.data_event_handlers.on_click_proplist["standard-list"] = function(selector)
                                                        { 
                                                            //var safe_name = (selector === "#party-boat") ? "party_boat"  : "uib_w_2"; // temp
                                                            var safe_name = data_support.safe_name(selector);
                                                            return function(entry){  $(document).trigger(safe_name+"_data", [entry]); };
                                                        };
 })();