/* _m-details.js ---------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - Script assumes the module is correctly set up with the correct label on
//    the toggle control and visibility state on the content element.
//------------------------------------------------------------------------------
// TODOs:
//  - Consider initializing the module based on the content element's display
//    property.  It would make debug CSS rules work correctly.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = window.boni.debug;
  let sModule = "_m-details";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    details: "._js-details",
    toggle: "._js-details-toggle",
    content: "._js-details-content",
  };

  let attributes = {
    data_hidelabel: "data-u-hidelabel",
    data_showlabel: "data-u-showlabel",
  };

  if (bDebug) { console.log("[%s] [%d] modules found.", sModule, $(selectors.details).length); }

  // Set up all event handlers.
  $(selectors.toggle).on("click", toggleVisibility);


  //----------------------------------------------------------------------------
  // This function toggles the visibility of the content module.
  //----------------------------------------------------------------------------
  function toggleVisibility(event) {

    // Prevent the click from happening.
    event.preventDefault();
    // Get label information.
    let $toggle = $(this);
    let hidelabel = $toggle.attr(attributes.data_hidelabel);
    let showlabel = $toggle.attr(attributes.data_showlabel);
    // Get a reference to the content element associated with the clicked link.
    let $details = $toggle.closest(selectors.details);
    let $content = $details.find(selectors.content);
    // Toggle the toggle control's label and the content's visibility.
    if ("none" === $content.css("display")) {
      $toggle.html(hidelabel);
      $content.toggle(true);
    } else {
      $toggle.html(showlabel);
      $content.toggle(false);
    }
  }

});
