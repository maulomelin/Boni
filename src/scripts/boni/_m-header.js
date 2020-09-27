/* _m-header.js ----------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - For testing & debugging, the first ancestor can be overridden by setting
//    the attribute [data-u-firstancestor="._bodyXXX"] on any ancestor node
//    of the [_m-header] module.  The first ancestor is then the node matching
//    the value of that attribute.  If not present, it defaults to "body".
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;
  let sModule = "_m-header";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    html: "html",
    body: "body",
    header: "._js-header",
    stickyarea: "._js-header-stickyarea",
    button: "._js-header-button",
    overlay: "._js-header-overlay",
    firstancestor: "[data-u-firstancestor]",
  };

  let attributes = {
    drawer: "data-u-drawer",
    firstancestor: "data-u-firstancestor",
  };

  let classes = {
    ancestor: "_m-header-ancestor",
    firstancestor: "_m-header-firstancestor",
  };

  // Abort if no object found.
  if (!$(selectors.header).length) {
    if (bDebug) { console.log("[%s] Aborting: No object found.", sModule); }
    return;
  }
  if (bDebug) { console.log("[%s] [%d] modules found.", sModule, $(selectors.header).length); }

  // Initialize the header's scrolling ancestor and containing block.
  updateHeaderAncestors();

  // Set up event handlers.
  $(selectors.button).on("click", toggleButtonDrawer);
  $(selectors.overlay).on("click", dismissOverlay);


  //----------------------------------------------------------------------------
  // This function responds to a click on any header button.
  //  - When a button is pressed, the global visual brakpoint message is set
  //    with that button's [data-u-drawer] value.  If that value is already
  //    set, then it is removed, essentially toggling it and dismissing all.
  //  - The global visual message flag is html[data-u-drawer].
  //----------------------------------------------------------------------------
  function toggleButtonDrawer() {

    if (bDebug) { console.log("[%s] toggleButtonDrawer()", sModule); }

    let $button = $(this);
    let $html = $(selectors.html);

    let button_drawer = $button.attr(attributes.drawer);
    let html_drawer = $html.attr(attributes.drawer);

    if (bDebug) { console.log("[%s] toggleButtonDrawer(): button[%s] vs html[%s]", sModule, button_drawer, html_drawer); }

    if (button_drawer == html_drawer) {
      $html.removeAttr(attributes.drawer);
    } else {
      $html.attr(attributes.drawer, button_drawer);
    }

  }


  //----------------------------------------------------------------------------
  // This function dismisses the overlay:
  //  - When the overlay is clicked, any open drawer is closed and the
  //    overlay dismissed.
  //  - Since we're doing the transitions via a global breakpoint, removing
  //    the drawer attribute automatically closes overlay and drawers.
  //      - The appropriate CSS rules support this.
  //----------------------------------------------------------------------------
  function dismissOverlay() {

    if (bDebug) { console.log("[%s] dismissOverlay()", sModule); }

    let $html = $(selectors.html);
    $html.removeAttr(attributes.drawer);
  }


  //----------------------------------------------------------------------------
  // This function walks up the DOM from the header and adds a header class
  // to all ancestors, up to the first ancestor.
  //  - The first ancestor is assumed to be "body" unless overridden.
  //      - "body" is actually configured via selector.body.
  //      - The attribute "data-u-firstancestor" in a module's ancestor
  //        overrides the default.
  //      - This was designed to allow the div[data-u-import] tag to work
  //        for mockups and design documents without any changes.
  //  - All ancestors (except the first) get the class "._m-header-ancestor".
  //      - This class defines "display: contents;" causing those ancestors to
  //        essentially move out of the ancestral hierarchy, making the first
  //        ancestor the closest scrolling ancestor and containing block.
  //      - This is what makes "display: sticky;" work on <header>, even if
  //        it is nested under an arbitrary number of containers.
  //  - The first ancestor gets the class "._m-header-firstancestor".
  //      - This class allows the module's stylesheet to target that module
  //        without knowing the exact element ahead of time.
  //----------------------------------------------------------------------------
  function updateHeaderAncestors() {

    if (bDebug) { console.log("[%s] updateHeaderAncestors()", sModule); }

    let firstancestor = $(selectors.header).closest(selectors.firstancestor).attr(attributes.firstancestor);
    firstancestor = firstancestor ? firstancestor : selectors.body;

    if (bDebug) { console.log("[%s] updateHeaderAncestors(): firstancestor=[%s]", sModule, firstancestor); }

    $(selectors.stickyarea).parentsUntil(firstancestor).addClass(classes.ancestor);
    $(firstancestor).addClass(classes.firstancestor);
  }

});
