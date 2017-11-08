(
  function( util, item, $)
  {
    "use strict";

    window.mkApexJsTreeInit = function( itemId, ajaxIdent ) {
      var out   = util.htmlBuilder()
        , item$ = $("#" + itemId)
        , jsTreeItem
        , selectedValues
        , jsTree;

      out.markup( "<div " )
         .attr( "id", "#" + itemId + "_jstree" )
         .markup( "></div>");
      jsTreeItem = $(out.toString());
      item$.parent().append(jsTreeItem);
      jsTree = jsTreeItem.jstree( { "core" : { "data" : { "url" : apex.server.pluginUrl(ajaxIdent, { x01: item$.val() }) } }, "plugins" : [ "checkbox" ]} );
      jsTree.on("changed.jstree", function( e, data ) {
        item$.val(data.selected.join(":"));
      });
    }
  }
)( apex.util, apex.item, apex.jQuery );
