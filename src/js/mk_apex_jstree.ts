/// <reference types="orclapex-js" />
/// <reference types="jquery" />
(
  function( util, item, $)
  {
    "use strict";

    window.mkApexJsTreeInit = function( itemId: string, ajaxIdent: string ) {
      var out: apex.util.htmlBuilderPrototype = util.htmlBuilder()
        , item$: JQuery<HTMLElement> = $("#" + itemId)
        , jsTreeItem: JQuery<HTMLElement>
        , jsTree: JQuery<HTMLElement>;

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
