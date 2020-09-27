/* _g-productpage.js -----------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - The value variables.m must be updated as necessary.  It is the largest
//    of the smallest widths that [info] and [cart] are designed for:
//        m = max(min([info].width), min([cart].width))
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;
  let sModule = "_g-productpage";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    html: "html",
    grid: "._js-productpage",
  };

  let attributes = {
    layout: "data-u-layout",
  };

  let layouts = {
    region1: "region1",
    region2: "region2",
    region3: "region3",
    region4: "region4",
    region5: "region5",
    region6: "region6",
    region7: "region7",
  };

  let variables = {
    m: 350,
  };

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
  // This function sets the visual breakpoint message to the window size region.
  //  - See the documentation for each region's name and charateristics.
  //----------------------------------------------------------------------------
  function updateLayout(event) {

    // Get some data.
    let width = $(window).width();
    let height = $(window).height();
    let m = variables.m;

    // Calculate some variables.
    let vline = 2*m;
    let diag1 = 3/2*width;
    let diag2 = 3/2*width - 3/2*m;
    let diag3 = 3/2*width - 3*m;

    if (bDebug) { console.debug("[%s] updateLayout():\n\t[width]=[%d]\n\t[height]=[%d]\n\t[vline]=[%d]\n\t[diag1]=[%d]\n\t[diag2]=[%d]\n\t[diag3]=[%d]", sModule, width, height, vline, diag1, diag2, diag3); }

    // Determine the matching layout.
    if (width < vline) {
      if (diag1 <= height) {                          layout = layouts.region1;
      } else if (diag2 <= height && height < diag1) { layout = layouts.region2;
      } else if (height < diag2) {                    layout = layouts.region3;
      } else {                                        layout = layouts.error;
      }
    } else if (vline <= width) {
      if (diag1 <= height) {                          layout = layouts.region4;
      } else if (diag2 <= height && height < diag1) { layout = layouts.region5;
      } else if (diag3 <= height && height < diag2) { layout = layouts.region6;
      } else if (height < diag3) {                    layout = layouts.region7;
      } else {                                        layout = layouts.error;
      }
    } else {                                          layout = layouts.error;
    }

    // Broadcast the layout to the root node.
    let $html = $(selectors.html);
    $html.attr(attributes.layout, layout);

    if (bDebug) { console.debug("[%s] updateLayout(): (%d, %d) => [%s].", sModule, width, height, layout); }
  }

});
