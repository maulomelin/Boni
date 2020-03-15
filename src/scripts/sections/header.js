//------------------------------------------------------------------------------
// ALERT:
//  - THE HEADER IS MOSTLY RENDERED AS A SNIPPET INSIDE THIS SECTION.
//------------------------------------------------------------------------------
// Header section script (\src\scripts\sections\header.js).
//------------------------------------------------------------------------------
// Write javascript within an object designed in Shopify's Section framework.
// Shopify's Theme Editor will fire events that invoke specific object methods
// to ensure sections work correctly in the editor.  Place custom listeners in
// the onLoad method; under this framework, page load events will trigger it.
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
boni.Header = (function() {

  // Header section constructor.
  // Runs on page load as well as Theme Editor "shopify:section:load" events.
  // @param <parameter(s) e.g. "{string} container"> - <description>
  function Header() {

    // Initialize anything we want...
    console.log("boni.Header()");

    // Execute the onLoad() callback
    this.onLoad();
  }

  // Extend the object to support callbacks for other events triggered by
  // the framework (mostly triggered by Shopify's Theme Editor).
  Header.prototype = $.extend({}, Header.prototype, {

    // WHY DO WE HAVE THIS???  WHOSE EVENT IS THIS???
    menu: function() {
      console.log("boni.Header.menu()");
    },

    // Event callback for Theme Editor "shopify:section:load" event
    onLoad: function() {
      console.log("boni.Header.onLoad()");
    },

    // Event callback for Theme Editor "shopify:section:unload" event
    onUnload: function() {
      console.log("boni.Header.onUnload()");
    },

    // Event callback for Theme Editor "shopify:section:select" event
    onSelect: function() {
      console.log("boni.Header.onSelect()");
    },

    // Event callback for Theme Editor "shopify:section:deselect" event
    onDeselect: function() {
      console.log("boni.Header.onDeselect()");
    },

    // Event callback for Theme Editor "shopify:section:reorder" event
    onReorder: function() {
      console.log("boni.Header.onReorder()");
    },

    // Event callback for Theme Editor "shopify:block:select" event
    onBlockSelect: function() {
      console.log("boni.Header.onBlockSelect()");
    },

    // Event callback for Theme Editor "shopify:block:deselect" event
    onBlockDeselect: function() {
      console.log("boni.Header.onBlockDeselect()");
    }

  });

  return Header;
})();
