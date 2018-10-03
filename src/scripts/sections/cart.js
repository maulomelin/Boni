//------------------------------------------------------------------------------
// Cart section script (\src\scripts\sections\cart.js).
//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
// TODOs:
//  -
//------------------------------------------------------------------------------
boni.Cart = (function() {

  // Cart section constructor.
  // Runs on page load as well as Theme Editor "shopify:section:load" events.
  function Cart() {

    // Initialize anything we want...
    console.log("boni.Cart()");

    // Execute the onLoad() callback
    this.onLoad();
  }

  // Extend the object to support callbacks for other events triggered by
  // the framework (mostly triggered by Shopify's Theme Editor).
  Cart.prototype = $.extend({}, Cart.prototype, {

    // Event callback for Theme Editor "shopify:section:load" event
    onLoad: function() {
      console.log("boni.Cart.onLoad()");
    },

    // Event callback for Theme Editor "shopify:section:unload" event
    onUnload: function() {
      console.log("boni.Cart.onUnload()");
    },

    // Event callback for Theme Editor "shopify:section:select" event
    onSelect: function() {
      console.log("boni.Cart.onSelect()");
    },

    // Event callback for Theme Editor "shopify:section:deselect" event
    onDeselect: function() {
      console.log("boni.Cart.onDeselect()");
    },

    // Event callback for Theme Editor "shopify:section:reorder" event
    onReorder: function() {
      console.log("boni.Cart.onReorder()");
    },

    // Event callback for Theme Editor "shopify:block:select" event
    onBlockSelect: function() {
      console.log("boni.Cart.onBlockSelect()");
    },

    // Event callback for Theme Editor "shopify:block:deselect" event
    onBlockDeselect: function() {
      console.log("boni.Cart.onBlockDeselect()");
    }

  });

  return Cart;
})();
