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
    jsTree.on("changed.jstree", function( e, data ) {
      var setableElements = $.grep( data.selected, function(obj) {
        return jsTree.jstree(true).get_node(obj).data.setValue === true;
      });
      gItem$.val(setableElements.join(":")).change();
    });
  });

  function _setValue( pValue ) {
    gItem$.val( pValue );
  }

  function _getValue() {
    return $( pSelector ).val();
  }

  function _render() {
    return;
  }
}
}) (apex.util, apex.item, apex.jQuery)
