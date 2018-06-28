//------------------------------------------------------------------------------
// Header section script (\src\scripts\sections\header.js).
//------------------------------------------------------------------------------
// Write javascript within an object designed in Shopify's Section framework.
// Shopify's Theme Editor will fire events that invoke specific object methods
// to ensure sections work correctly in the editor.  Place custom listeners in
// the onLoad method; under this framework, page load events will trigger it.
//------------------------------------------------------------------------------
// TODOs:
//  - Is it a bug if the sliding menu stays slid across breakpoint boundaries?
//------------------------------------------------------------------------------

theme.SectionHeader = (function() {

  // Header section constructor.
  // Runs on page load as well as Theme Editor "shopify:section:load" events.
  // @param <parameter(s) e.g. "{string} container"> - <description>
  function Header() {

    // Initialize anything we want...
// https://www.w3schools.com/jquery/html_toggleclass.asp
// To remove a class we toggle it $("#sliding-menu").toggleClass("show", false)
// We could initialize an array here with all menus and define a function that
// expands/collapses all appropriate menus...
//    this.selectors = {
//      hamburgerMenu: "#sliding-menu"
//    };

    // Execute the onLoad() callback
    this.onLoad();
  }

  // Extend the object to support callbacks for other events triggered by
  // the framework (mostly triggered by Shopify's Theme Editor).
  Header.prototype = $.extend({}, Header.prototype, {

    // WHY DO WE HAVE THIS???  WHOSE EVENT IS THIS???
    menu: function() {},

    // Event callback for Theme Editor "shopify:section:load" event
    onLoad: function() {

      // When the Menu button is clicked
      $("._js-slide-menu-drawer").on("click", function() {
        // Open the menu drawer and the overlay
        $("._menu-drawer").toggleClass("_t-slide");
        $("._overlay").toggleClass("_t-slide");
        // Close any other drawers
        $("._search-drawer").toggleClass("_t-slide", false);
      });

      // When the Search button is clicked
      $("._js-slide-search-drawer").on("click", function() {
        // Open the search drawer
        $("._search-drawer").toggleClass("_t-slide");
        // Close any other drawers
        $("._menu-drawer").toggleClass("_t-slide", false);
        $("._overlay").toggleClass("_t-slide", false);
      });

      // When the Overlay region is clicked
      $("._overlay").on("click", function() {
        // Close all drawers
        $("._menu-drawer").toggleClass("_t-slide", false);
        $("._overlay").toggleClass("_t-slide", false);
        $("._search-drawer").toggleClass("_t-slide", false);
      });

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

  return Header;
})();
