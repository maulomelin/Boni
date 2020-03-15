/* _infochart-button.js --------------------------------------------------------
// Copyright 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - The design assumes every button is initially hidden with ._hide.
//    The initialization routine iterates over all buttons and if a matching
//    infochart is found (via {productid, name}), the button is made visible.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;

  if (bDebug) {
    console.log("[_infochart-button] Initializing");
  }

  let selectors = {
    infochart_buttons: "._js-infochart-button",
    infocharts: "._js-infochart",
  };

  let attributes = {
    productid: "data-u-productid",
    name: "data-u-name",
  };

  let classes = {
    hide: "_hide",
  };

  // Abort if no object found.
  if (0 == $(selectors.infochart_buttons).length) {
    if (bDebug) {
      console.log("[_infochart-button] Aborting: No object found");
    }
    return;
  }

  // Iterate over all buttons.  If we find a matching infochart, expose them.
  $(selectors.infochart_buttons).each(function() {
    let $button = $(this);
    let productid = $button.attr(attributes.productid);
    let name = $button.attr(attributes.name);

    if (bDebug) {
      console.log("[_infochart-button]\t\tFound button [%s/%s]", productid, name);
    }
    // Iterate over the set of infocharts, looking for a match to expose.
    $(selectors.infocharts).each(function() {
      let $infochart = $(this);
      if (
        productid == $infochart.attr(attributes.productid) &&
        name == $infochart.attr(attributes.name)
      ) {
        $button.toggleClass(classes.hide, false);

        if (bDebug) {
          console.log("[_infochart-button]\t\tExposed button [%s/%s]", productid, name);
        }
      }
    });
  });

  // Set listeners on clicks to the infochart buttons.
  $(selectors.infochart_buttons).on("click", function() {
    let $button = $(this);
    let productid = $button.attr(attributes.productid);
    let name = $button.attr(attributes.name);

    if (bDebug) {
      console.log("[_infochart-button] Clicked button with productid/name=[%s/%s]", productid, name);
    }

    // Iterate over the set of infocharts, looking for a match.
    $(selectors.infocharts).each(function() {
      let $infochart = $(this);
      if (
        productid == $infochart.attr(attributes.productid) &&
        name == $infochart.attr(attributes.name)
      ) {
        $infochart.toggleClass(classes.hide);

        if (bDebug) {
          console.log("[_infochart-button]\tToggled infochart productid/name=[%s/%s]", productid, name);
        }
      }
    });
  });
});
