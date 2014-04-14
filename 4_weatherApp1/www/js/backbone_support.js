(function()
 {
     'use strict';
   
     window.data_support = {}; //namespace
    
     window.backbone_mvc = {};  //global
     window.backbone_data = {}; //global
     
     
     data_support.safe_name = function(name)
    {
        return name.replace("#", "").replace(".", "").replace("-", "_").replace(":", "");
    };
     
     
     //configure underscore templates to use handlebar syntax ({{) not <%
     //_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g };
     
      function compile_template(str)
      {
          var replace_in = function(rep, pre, prop_name, val)
          {
              if(typeof val == "object")
              {
                  if(rep.search(new RegExp("\\{\\{" + pre + prop_name , "g")) >= 0)
                  {
                    _.each(val, function(v, k){ rep = replace_in(rep, pre + prop_name + ".", k, v); });
                  }
                  return rep;
              }
              else
              {
                  return rep.replace(new RegExp("\\{\\{" + pre + prop_name + "\\}\\}", "g"), val);
              }
          };
        return  function(obj)
                {
                  var representation = str;
                  _.each(obj, function(v, k)
                  {
                      representation = replace_in(representation, "", k, v);
                  });
                  return representation;
                };
      }
     
     function get_compiled_string(selector)
    {
        var template_str = $(selector)[0].outerHTML;   
        template_str = template_str.replace("template", "");    //remove the class
        template_str = template_str.replace(/id="[^"]*"/g, ""); //remove any id
        template_str = template_str.replace(/>/, ' data-adidx="{{ad_idx}}">'); //explicitly insert index.
        //var compiled = _.template(template_str);
        var compiled = compile_template(template_str);
        return compiled;
    }
     
    /*
        used for side effects. Realizes str into a domnode and then moves all attributes and inner HTML to the domNode
        $.replaceWith is too destructive for our purposes
    */
    function absorb_html(domNode, str)
    {
        var $node = $(domNode);
        var $transient_node = $(str);
        
        $node.html($transient_node.html());
        
        _.each($transient_node[0].attributes, function(attr_pair)
        {
            $node.attr(attr_pair.name, attr_pair.value);
        });
    }
     
     /*
        @param {String} safe_name == "uib_w_2" or "party_boat".   Name with no #, ., - or other illegal punctuation etc.
        @param {String} selector -- ".uib_w_2" or "#party-boat", etc.
        @param {String|null| event_key -- "standard-list" et al
        @param {Object} data_views    -- example:  { group:[{parent:".uib_w_1", child:".uib_w_2", model:{song:null, artist:null}}],  single:["#party-boat"]};
    */
    function prepare_group_mvc(safe_name, selector, data_event, data_path_array, event_key, data_views)
    {
        var dview_entry = _.find(data_views.group, function(entry){ return entry.child == selector; }); 
        var Model    = Backbone.Model.extend(dview_entry ? dview_entry.model : {});
      
        //non-destructive reverse
        var nd_reverse = function(arr){ return _.initial(arr, 0).reverse(); };
            
        var List     = Backbone.Collection.extend({model:Model});
        
        var click_handler_f = data_event_handlers.on_click_proplist[event_key](selector);
        
        var get_data_handler = data_event_handlers.on_data_proplist[event_key];
        var render_f         = get_data_handler ? get_data_handler(selector) : function(data){};
        
        var View     = Backbone.View.extend({
                                                tagName:    data_event_handlers.tags[event_key].child, //"li"
                                                initialize: function()
                                                            {
                                                                this.compiled = get_compiled_string(selector);
                                                            },
                                                render:     function()
                                                            {
                                                                absorb_html(this.el, this.compiled(this.model.toJSON()));
                                                                return this;
                                                            },
                                                events:     {
                                                                "click": "on_click"
                                                            },
                                                on_click:   function(evt)
                                                            {
                                                                console.log("CLICK", this.model);
                                                                if(click_handler_f){ click_handler_f(this.model.toJSON()); }
                                                                //var action_f        = get_event_handler(selector);
                                                                //if(action_f){ action_f(evt); }
                                                            }
                                            });
        var ListView = Backbone.View.extend({
                                                initialize: function()
                                                            {
                                                                var self = this;
                                                                self.insertions_count = 0;
                                                                this.$el = $(dview_entry.parent); this.el = this.$el[0];
                                    
                                                            },
                                                selector:   selector,
                                                take_data:  function(data)
                                                            {
                                                                data = _.filter(data, _.isObject);
                                                                data = _.map(data, function(entry, index){ return _.extend(entry, {ad_idx:index}); });
                                                                this.empty();
                                                                this.collection = new List(data); 
                                                                this.render();
                                                                this.insertions_count = data.length;
                                                            },
                                                empty:      function()
                                                            {
                                                                var self = this;
                                                                var previously_inserted = _.take($(self.selector+".template").nextAll(), self.insertions_count);
                                                                $(previously_inserted).remove();
                                                            },
                                                render:     function()
                                                            {
                                                                var self = this;
                                                                _.each(nd_reverse(this.collection.models), function(item){ self.renderItem(item); }, this);

                                                                render_f(self.collection.toJSON()); 
                                                                return this;
                                                            },
                                                renderItem: function(item)
                                                            {
                                                                var viewInstance = new View({ model:item });
                                                                
                                                                
                                                                //insert new
                                                               var $template_item = $(this.selector + ".template");
                                                               $template_item.after(viewInstance.render().el);
                                                               
                                                            }
                                            });
        
        //window.backbone_mvc[safe_name].privileged = {ListView:ListView, View:View, List:List, Model:Model, dview_entry:dview_entry}; 
        
        
        $(document).ready(function()
                          {
                              var list_view = new ListView();
                              window.backbone_mvc[safe_name].view = list_view;
                              $(document).on(data_event, function(evt, data)
                              { 
                                data_path_array.forEach(function(d){ data = data[d]; });
                                list_view.take_data(data); 
                                backbone_data[selector] = data; 
                              });
                          });
    }
     
   
     /*
        @param {String} safe_name == "uib_w_2" or "party_boat".   Name with no #, ., - or other illegal punctuation etc.
        @param {String} selector -- ".uib_w_2" or "#party-boat", etc.
        @param {String|null| event_key -- "standard-list" et al
        @param {Object} data_views    -- example:  { group:[{parent:".uib_w_1", child:".uib_w_2", model:{song:null, artist:null}}],  single:["#party-boat"]};
    */
    function prepare_single_mvc(safe_name, selector, data_event, data_path_array, event_key, data_views)
    {
        var SingleView   = Backbone.View.extend({
                                                        initialize: function()
                                                                    {
                                                                        var self = this;
                                                                        this.$el = $(selector); this.el = this.$el[0];
                                                                        //this.compiled = _.template($(selector).html()); 
                                                                        this.compiled = compile_template($(selector).html());
                                                                        this.modelBinder = new Backbone.ModelBinder();
                                                                    },
                                                        set_data:   function(data)
                                                                    {
                                                                        //this.model = data;
                                                                        this.model =  new Backbone.Model(data); //Backbone.Model.extend(data);
                                                                        this.render();
                                                                        return this.model;
                                                                    },
                                                        render:     function()
                                                                    {
                                                                        var self = this;
                                                                        this.$el.children().remove();
                                                                        this.$el.html(self.compiled(this.model.toJSON()));
                                                                        
                                                                        //var editorViewBindings = {"name": '[name="name"]', "description": '[name="description"]'};
                                                                        //var editorViewBindings = {"name":".uib_w_6 input", "description":".uib_w_21 textarea"};
                                                                        var editorViewBindings = data_views.bindings[selector];
                                                                        this.modelBinder.bind(this.model, this.el, editorViewBindings);
                                                                        return this;
                                                                    }
                                                    });
        
        $(document).ready(function()
                          { 
                              var single_view = new SingleView();
                              window.backbone_mvc[safe_name].view = single_view;
                              $(document).on(data_event, function(evt, data)
                              { 
                                data_path_array.forEach(function(d){ data = data[d]; });
                                backbone_data[selector] = single_view.set_data(data);  
                              });
                          }); 
    }
     
     
     
     
     data_support.prepare_mvc = function(selector, data_event, data_path_array, event_key, data_views)
    {
         var safe_name = data_support.safe_name(selector);
        
        window.backbone_mvc[safe_name] = {};
        var prepare_mvc_f = (data_views.single.indexOf(selector) >= 0) ? prepare_single_mvc : prepare_group_mvc; 
        prepare_mvc_f(safe_name, selector, data_event, data_path_array, event_key, data_views);
       
    };
     
     data_support.ready = function(f)
     {
       document.addEventListener("deviceready", f, false) ;
       //$(document).ready(f);

     };
     
     data_support.entry_from_$this = function($this, selector)
     {
         console.log("entry_from_event", $this);
         var data = backbone_data[selector];
         var index = parseInt($this.attr("data-adidx"));
         if(data && ! _.isNaN(index))
         {
             return data[index];
         }
         else{ return undefined; }
     };
     
 })();