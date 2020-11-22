/* _m-supportmenu.js -----------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - We do not initialize the page to show; the script assumes the page shown
//    initially is the correct one.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = window.boni.debug;
  let sModule = "_m-supportmenu";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    menu: "._js-supportmenu",
    dropdownmenu: "._js-supportmenu-dropdownmenu",
  };

  // Abort if no object found.
  if (0 == $(selectors.menu).length) {
    if (bDebug) { console.warn("[%s] Aborting: No object found", sModule); }
    return;
  }

  // Set up all event handlers.
  $(selectors.dropdownmenu).on("change", gotoPage);


  //----------------------------------------------------------------------------
  // This function redirects the browser to the user selection.
  //----------------------------------------------------------------------------
  function gotoPage(event) {

    // Get some data.
    let $dropdownmenu = $(this);
    let url = $dropdownmenu.val();

    if (bDebug) { console.debug("[%s] gotoPage(): [%s]", sModule, url); }

    // Redirect browser window.
    window.location.href = url;
  }

});
