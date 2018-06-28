//------------------------------------------------------------------------------
// _XXX section script (\src\scripts\sections\_XXX.js).
//------------------------------------------------------------------------------
// Write javascript within an object designed in Shopify's Section framework.
// Shopify's Theme Editor will fire events that invoke specific object methods
// to ensure sections work correctly in the editor.  Place custom listeners in
// the onLoad method; under this framework, page load events will trigger it.
//------------------------------------------------------------------------------
// TODOs:
//  - This is a template file for code designed for a Shopify section.
//  - Copy this file and rename it to the section it's intended for.
//  - Add the filename reference in the theme.js file.
//  - Rename all instances of "_XXX" with the new section name.
//  - Register the object and its associated HTML section attribute in theme.js.
//------------------------------------------------------------------------------

theme._XXX = (function() {

  // _XXX section constructor.
  // Runs on page load as well as Theme Editor "shopify:section:load" events.
  function _XXX() {

    // Initialize anything we want...

    // Execute the onLoad() callback
    this.onLoad();
  }

  // Extend the object to support callbacks for other events triggered by
  // the framework (mostly triggered by Shopify's Theme Editor).
  _XXX.prototype = $.extend({}, _XXX.prototype, {

    // Event callback for Theme Editor "shopify:section:load" event
    onLoad: function() {

      alert("_XXX inside");

    },

    // Event callback for Theme Editor "shopify:section:unload" event
    onUnload: function() {},

    // Event callback for Theme Editor "shopify:section:select" event
    onSelect: function() {},

    // Event callback for Theme Editor "shopify:section:deselect" event
    onDeselect: function() {},

    // Event callback for Theme Editor "shopify:section:reorder" event
    onReorder: function() {},

    // Event callback for Theme Editor "shopify:block:select" event
    onBlockSelect: function() {},

    // Event callback for Theme Editor "shopify:block:deselect" event
    onBlockDeselect: function() {}
  });

  return _XXX;
})();
