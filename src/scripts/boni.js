//------------------------------------------------------------------------------
// Boni theme script (\src\scripts\boni.js).
//------------------------------------------------------------------------------
// The purpose of this file is to define global javascript functionality,
// and for testing new modules.
//
// We recommend adding javascript here, instead of random <script>...</script>
// tags throughout the code, as jQuery may not be loaded when those Sections
// are executed.  It also keeps it nice and tidy here until we decide where
// to organize it.
//
// Javascript written in this file exists outside Shopify's Section framework.
//
// This file is included in the theme via a "require" statement in theme.js.
// We can, alternatively, add it in theme.liquid like it is done for vendor.js.
//------------------------------------------------------------------------------
// TODOs:
//  - Move the window.boni.strings to the variables settings file, to entries
//    such as the ones shown below in the comments.  Add a note there that the
//    strings must match their equivalents in the .liquid file.
//  - Clean up header.js and decide whether to keep the drawer-based functions
//    there or here.
//  - Items still on this file that need cleanup:
//      1) Global strings
//      2) Image Viewer (PhotoSwipe)
//      3) Pricing
//      4) Spinner
//      5) E-mail notification
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Global strings.
//------------------------------------------------------------------------------
// TODOs:
//  - Move these strings to the variables settings file.
//  - Match these strings to their counterparts in the .liquid file.
//------------------------------------------------------------------------------
window.boni.strings = {
  availableStatusPhrase: "This item is available.", // {{ 'products.product.add_to_cart' | t | json }},
  outOfStockStatusPhrase: "This item is currently out of stock.",
  soldOutStatusPhrase: "This item is sold out.", // {{ 'products.product.sold_out' | t | json }},
  unavailableStatusPhrase: "This item is unavailable.", // {{ 'products.product.unavailable' | t | json }}
  availableStatus: "Available",
  outOfStockStatus: "Out Of Stock",
  soldOutStatus: "Sold Out",
  unavailableStatus: "Unavailable"
};


//------------------------------------------------------------------------------
// TEMPLATE TO DO SOMETHING SPECIFIC
//------------------------------------------------------------------------------
(function() { /* console.log("1) Do something here."); */ })();
$(function() { /* console.log("2) Do something here."); */ });
