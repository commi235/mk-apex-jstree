//@ts-check
/// <reference types="orclapex-js" />
/// <reference types="jquery" />
(
  function( util, item, $)
  {
    "use strict";

    window.mkApexJsTreeInit = function( itemId, options ) {
      var out   = util.htmlBuilder()
        , item$ = $("#" + itemId)
        , jsTreeItem
        , selectedValues
        , jsTree;

      function render() {
        out.markup( "<div " )
           .attr( "id", "#" + itemId + "_jstree" )
           .markup( "></div>");
        jsTreeItem = $(out.toString());
        item$.parent().append(jsTreeItem);
        if ( options.useAjax === true ) {
          jsTree = jsTreeItem.jstree( { "core" : { "data" : { "url" : apex.server.pluginUrl(options.ajaxIdent, { x01: item$.val() }) } }, "plugins" : [ "checkbox" ]} );
        }
        else {
          jsTree = jsTreeItem.jstree( { "core" : { "data" : options.data }, "plugins" : [ "checkbox" ]} );
        }
        jsTree.on("changed.jstree", function( e, data ) {
          var setableElements = $.grep( data.selected, function(obj) {
            return jsTreeItem.jstree(true).get_node(obj).data.setValue === true;
          });
          item$.val(setableElements.join(":")).change();
        });     
      }
      
      function setValue(value) {
        item$.val(value);
      }

      function getDisplay(value) {
        return 
      }

      item$.wrap( "<div></div>" );
      render();
      //item.create( itemId );
    }
  }
)( apex.util, apex.item, apex.jQuery );
