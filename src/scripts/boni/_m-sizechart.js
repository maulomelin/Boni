/* _m-sizechart.js -------------------------------------------------------------
// Copyright 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//------------------------------------------------------------------------------
// TODOs:
//  - Consider initializing the module based on the content element's display
//    property.  It would make debug CSS rules work correctly.
//  - Clean up the TODOs; they're carry-overs from [_infochart].
//
//  - To set up the [_sizechart] correctly:
//      - First, set up the listener on changes to option groups.
//          - These will highlight any columns that match an updated option.
//          - The listener is set up on the "document" element as the event
//            will bubble from its original unknown event target up to it.
//      - Second, set up the trigger to request a sync with option groups.
//        This event makes all option groups report their checked options.
//          - Trigger the event only after the listener is set up, since the
//            listener will handle the response.
//          - If there is no option group associated with an info chart, then
//            no column should be highlighted.  That is why no columns should
//            be highlighted by default.
//  - Should we trigger the broadcast message on $(document).trigger(...); ?
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;
  let sModule = "_m-sizechart";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    sizechart: "._js-sizechart",
    toggle: "._js-sizechart-toggle",
    content: "._js-sizechart-content",
    tablecolumn: "._js-sizechart-tablecolumn",
  };

  let attributes = {
    productid: "data-u-productid",
    name: "data-u-name",
    value: "data-u-value",
    data_hidelabel: "data-u-hidelabel",
    data_showlabel: "data-u-showlabel",
  };

  let classes = {
    highlight: "_t-highlight",
  };

  let event_types = {
    syn_optiongroupinfo: "_ev-syn-optiongroupinfo",
    ack_optiongroupinfo: "_ev-ack-optiongroupinfo",
  };

  // Abort if no object found.
  if (0 == $(selectors.sizechart).length) {
    if (bDebug) { console.log("[%s] Aborting: No object found.", sModule); }
    return;
  }
  if (bDebug) { console.log("[%s] [%d] modules found.", sModule, $(selectors.sizechart).length); }

  // First, set up all event handlers.
  $(selectors.toggle).on("click", toggleVisibility);
  $(document).on(event_types.ack_optiongroupinfo, highlightSizeChartTableColumn);

  // Next, broadcast a sync signal.
  if (bDebug) { console.log("[%s] Send message requesting optiongroup info.", sModule); }
  $(selectors.sizechart).trigger(event_types.syn_optiongroupinfo, { requestor: "_sizechart", });


  //----------------------------------------------------------------------------
  // This function highlights a column in the size chart table when an event
  // with matching column identifiers (productid + name) are received.
  //----------------------------------------------------------------------------
  function highlightSizeChartTableColumn(event, data) {

    console.log("[%s] highlightSizeChartTableColumn()", sModule);

    if (!data) {
      if (bDebug) { console.warn("[%s] Aborting highlightSizeChartTableColumn(): No event data present.", sModule); }
      return;
    }

    // Get the set of [_sizechart] modules matching to the event's data.
    let $sizecharts = $(selectors.sizechart).filter(function() {
      return (
        data.productid == $(this).attr(attributes.productid) &&
        data.name == $(this).attr(attributes.name)
      );
    });

    // Iterate over the set of matching [_sizechart] modules to clear/highlight columns.
    $sizecharts.each(function() {
      let $sizechart = $(this);
      // Iterate over the infochart's table columns to clear/highlight them.
      $sizechart.find(selectors.tablecolumn).each(function() {
        let $column = $(this);
        if (data.value == $column.attr(attributes.value)) {
          $column.addClass(classes.highlight);
        } else {
          $column.removeClass(classes.highlight);
          if (bDebug) {
            console.log("[%s] highlightInfochartTableColumn(): Highlighted column [%s]", sModule, data.value);
          }
        }
      });
    });
  }


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
    let $sizechart = $toggle.closest(selectors.sizechart);
    let $content = $sizechart.find(selectors.content);
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
