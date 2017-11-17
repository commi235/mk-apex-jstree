//@ts-check
/// <reference types="orclapex-js" />

(function( util, item, $ ) {

window.mkApexJsTree = function( pSelector, pOptions ) {
  var gOptions = $.extend({
                    useAjax: false,
                    ajaxIdent: null,
                    data: null,
                    readOnly: false
                  }, pOptions),
      gItem$   = $( pSelector, apex.gPageContext$ );
  
  gItem$.each( function() {
    var jsTreeItem = $("#" + this.id + "_DISPLAY"),
        jsTree,
        lItemImpl = {
          setValue: _setValue,
          getValue: _getValue
        };
    item.create( this.id, lItemImpl);

    function render() {
      if ( gOptions.readOnly ) {
        jsTreeItem.prop("disabled", true)
                  .addClass("apex_disabled");
      }

      if ( gOptions.useAjax === true ) {
        jsTree = jsTreeItem.jstree({ "core" : { "data" : { "url" : apex.server.pluginUrl(gOptions.ajaxIdent, { x01: this.val() }) } }, "plugins" : [ "checkbox" ]});
      }
      else {
        jsTree = jsTreeItem.jstree( { "core" : { "data" : gOptions.data }, "plugins" : [ "checkbox" ]} );
      }
      if ( !gOptions.readOnly ) {
        jsTree.on("changed.jstree", function( e, data ) {
          var setableElements = $.grep( data.selected, function(obj) {
            return jsTree.jstree(true).get_node(obj).data.setValue === true;
          });
          gItem$.val(setableElements.join(":")).change();
        });
      }
      return jsTree;
    }

    render();
  });

  function _setValue( pValue ) {
    var tree = $( pSelector + '_DISPLAY').jstree();
    gItem$.val( pValue );
    tree.deselect_all( true );
    tree.select_node( pValue, true );
  }

  function _getValue() {
    return $( pSelector ).val();
  }

}
}) (apex.util, apex.item, apex.jQuery)
