/* _infochart.js ---------------------------------------------------------------
// Copyright 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - To set up the [_infochart] correctly:
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
//------------------------------------------------------------------------------
// TODOs:
//  - Should we trigger the broadcast message on $(document).trigger(...); ?
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = window.boni.debug;

  if (bDebug) {
    console.log("[_infochart] Initializing");
  }

  let selectors = {
    infochart: "._js-infochart",
    table_column: "._js-infochart-table-column",
  };

  let attributes = {
    productid: "data-u-productid",
    name: "data-u-name",
    value: "data-u-value",
  };

  let classes = {
    highlight: "_t-highlight",
  };

  let event_types = {
    syn_optiongroup_info: "_ev-syn-optiongroup-info",
    optiongroup_info: "_ev-optiongroup-info",
  };

  // Abort if no object found.
  if (0 == $(selectors.infochart).length) {
    if (bDebug) {
      console.log("[_infochart] Aborting: No object found");
    }
    return;
  }

  // Set listeners for changes to option group checked options.
  $(document).on(event_types.optiongroup_info, highlightInfochartTableColumn);

  function highlightInfochartTableColumn(event, data) {

    if (bDebug) {
      console.log("[_infochart] highlightInfochartTableColumn()");
      console.log("[_infochart]\tReceived event [%s] with data [%s]", event.type, $.map(data, function(x) { return x; }).join("/"));
      //console.log("[_infochart] Received event [%s] with data [%o]", event.type, data);
    }

    if (!data) { return; }

    // Iterate over the set of infochart elements.
    $(selectors.infochart).each(function() {

      // Look for a infochart that matches the optiongroup identifiers.
      let $infochart = $(this);
      if (
        data.productid == $infochart.attr(attributes.productid) &&
        data.name == $infochart.attr(attributes.name)
      ) {
        // Iterate over the infochart's table columns; highlight matching ones.
        $infochart.find(selectors.table_column).each(function() {
          let $column = $(this);
          if (data.value == $column.attr(attributes.value)) {
            $column.toggleClass(classes.highlight, true);
          } else {
            $column.toggleClass(classes.highlight, false);

            if (bDebug) {
              console.log("[_infochart]\t\tHighlighted column [%s]", data.value);
            }
          }
        });
      }
    });
  }

  // Trigger the event requesting all option group info.
  if (bDebug) {
    console.log("[_infochart] Triggering event type [%s]", event_types.syn_optiongroup_info);
  }
  $(selectors.infochart).trigger(event_types.syn_optiongroup_info);
});
