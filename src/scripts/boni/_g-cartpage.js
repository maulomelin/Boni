/* _g-cartpage.js --------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - The value variables.* must be updated as necessary.
//    They define the various regions for all visual breakpoints.
//  - The specific layout for the cart page is based on the window width alone.
//    Width-based intervals are defined in an array that encodes a sequence of
//    region names flanked by that region's min-/max-width values.
//      - The first region's min-width must be "0" and the last region's
//        max-width must be "Infinity" to always yield a defined interval.
//      - This design was selected for its simplicity and practicality.
//        With the upper and lower bounds correctly set, no error can occurr.
//      - Sample:
//            [0, "small", 400, "medium", 800, "large", Infinity]
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = window.boni.debug;
  let sModule = "_g-cartpage";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    html: "html",
    grid: "._js-cartpage",
  };

  let attributes = {
    layout: "data-u-layout",
  };

  let layout_width_intervals = [0, "compact", 360, "narrow", 500, "wide", 800, "full", Infinity]

  // Abort if no object found.
  if (0 == $(selectors.grid).length) {
    if (bDebug) { console.warn("[%s] Aborting: No grid object found", sModule); }
    return;
  }
  if (bDebug) { console.log("[%s] [%d] grid found.", sModule, $(selectors.grid).length); }

  // Initialize all settings.
  updateLayout();

  // Set up all event handlers.
  $(window).on("resize", updateLayout);


  //----------------------------------------------------------------------------
  // This function updates the visual breakpoint message.
  //----------------------------------------------------------------------------
  function updateLayout(event) {

    // Get some data.
    let width = $(window).width();

    // Initialize variables.
    let layout = null;
    let intervals = layout_width_intervals;

    // Iterate through intervals, as long as there's sufficient data for one.
    while (3 <= intervals.length) {
      // Destructure the intervals array to extract the current interval.
      [min, label, max] = intervals;
      // If the viewport falls within that interval, break; we found a match.
      if (min <= width && width < max) {
        layout = label;
        break;
      }
      // Discard the current interval and move on to the next one.
      [,,...intervals] = intervals;
    }

    // Broadcast the layout to the root node.
    let $html = $(selectors.html);
    $html.attr(attributes.layout, layout);

    if (bDebug) { console.debug("[%s] updateLayout(): width=[%d] => layout=[%s].", sModule, width, layout); }
  }

});
