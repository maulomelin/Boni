/* _header.js ------------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;

  if (bDebug) {
    console.log("[_header] Initializing");
  }

  let selectors = {
    header: "._js-header",
    navbar: "._js-navbar",
    mininavbar: "._js-mininavbar",
    menubutton: "._js-button-menu",
    cartbutton: "._js-button-cart",
    menudrawer: "._js-drawer-menu",
    overlaydrawer: "._js-drawer-overlay",
    searchdrawer: "._js-drawer-search",
  };

  let classes = {
    sticky: "_t-sticky",
    slide: "_t-slide",
  };

  // Abort if no object found.
  if (!$(selectors.header).length) {
    if (bDebug) {
      console.log("[_header] Aborting: No object found.");
    }
    return;
  }

  // Initialize all settings.
  updateHeaderState();

  // Set up event handlers.
  $(window).on("scroll", updateHeaderState);

  let $menudrawer = $(selectors.menudrawer);
  let $overlaydrawer = $(selectors.overlaydrawer);
  let $searchdrawer = $(selectors.searchdrawer);

  $(selectors.menubutton).on("click", function() {
    console.log("[_header] MENU button clicked");
    $menudrawer.toggleClass(classes.slide);
    $overlaydrawer.toggleClass(classes.slide);
    $searchdrawer.removeClass(classes.slide);
  });

  $(selectors.overlaydrawer).on("click", function() {
    console.log("[_header] OVERLAY drawer clicked");
    $menudrawer.removeClass(classes.slide);
    $overlaydrawer.removeClass(classes.slide);
    $searchdrawer.removeClass(classes.slide);
  });

  $(selectors.cartbutton).on("click", function() {
    console.log("[_header] CART button clicked");
    $menudrawer.removeClass(classes.slide);
    $overlaydrawer.removeClass(classes.slide);
    $searchdrawer.toggleClass(classes.slide);
  });

  //----------------------------------------------------------------------------
  // This function sets the state of the header (sticky vs. normal).
  //  - It compares the lower edges of the normal and mini navbars.
  //    Once the mini-navbar is below the normal one, the header turns sticky.
  //      - We compare the lower edges to allow the mini-navbar to be shorter
  //        than the normal navbar.  If we compared the top of the navbars,
  //        the state would change too early.
  //      - We need the mini-navbar to be available in order to get its height.
  //        We use "visibility: hidden;" instead of "display: none;".  This
  //        works because it's not in the normal flow due to "position: fixed".
  //  - "Stickiness" is a class appended to the header element.
  //  - The CSS file determines what a "normal" or "sticky" header looks like.
  //----------------------------------------------------------------------------
  function updateHeaderState() {

    if (bDebug) {
      console.log("[_header] updateHeaderState");
    }

    // Get the elements we need.
    let $header = $(selectors.header);
    let $navbar = $(selectors.navbar);
    let $mininavbar = $(selectors.mininavbar);

    // Calculate the position of the navbar's bottom edge.
    let height_navbar = $navbar.height();
    let y_top_navbar = $navbar.offset().top;
    let y_bottom_navbar = y_top_navbar + height_navbar;

    // Calculate the position of the mini-navbar's bottom edge.
    let height_mininavbar = $mininavbar.height();
    let y_top_mininavbar = $mininavbar.offset().top;
    let y_bottom_mininavbar = y_top_mininavbar + height_mininavbar;

    // Calculate the difference between bottom edges.
    let delta_y = y_bottom_mininavbar - y_bottom_navbar;

    // Update the header's state depending on the difference.
    if (delta_y < 0) {
      console.log("[_header]\tdy[%d] < 0; NORMAL header", delta_y);
      $header.removeClass(classes.sticky);
    } else {
      console.log("[_header]\tdy[%d] >= 0; STICKY header", delta_y);
      $header.addClass(classes.sticky);
    }

  };

});
