/* _optiongroup.js -------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//------------------------------------------------------------------------------
// TODOs:
//  - Add inventory count to the availability message, if someone needs it.
//  - Optimize the _ev-syn-* messages to include optional parameters
//    for the productid/name identifier pair, and the response only provides
//    info for the matching option group.
//      - The current design of the "_ev-syn-*" message is very chatty.
//      - It provides a response for every option group, even though the one
//        who requested it may only need data for a single option group.
//  - Add [data-u-product-json] element to support multiple products on a page
//    and update logic to look up variants under the corresponding productid.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;

  if (bDebug) {
    console.log("[_optiongroup] Initializing");
  }

  let selectors = {
    optiongroup: "._js-optiongroup",
    optiongroup_value: "._js-optiongroup-value",
    option: "._js-option",
    checked_option: "._js-option:checked",
    product_json: "[data-product-json]",
  };

  let attributes = {
    option_value: "value",
    option_index: "data-index",
    option_title: "title",
    data_productid: "data-u-productid",
    data_name: "data-u-name",
  };

  let classes = {
    outofstock: "_x",
    soldout: "_xx",
    unavailable: "_xxx",
    unknown: "_unknown",
  };

  let event_types = {
    syn_optiongroup_info: "_ev-syn-optiongroup-info",
    optiongroup_info: "_ev-optiongroup-info",
  };

  let availabilities = {
    instock: "instock",
    outofstock: "outofstock",
    soldout: "soldout",
    unavailable: "unavailable",
    unknown: "unknown",
  };

  // Abort if no object found.
  if (0 == $(selectors.optiongroup).length) {
    if (bDebug) {
      console.log("[_optiongroup] Aborting: No option group objects found");
    }
    return;
  }

  // Set up the variants object.
  // TODO: Update data structure to allow multiple [data-product-json] elements.
  let variants = null;
  if (0 == $(selectors.product_json).length) {
    if (bDebug) {
      console.log("[_optiongroup]\tAlert: No variants object found");
    }
  } else {
    variants = JSON.parse($(selectors.product_json).html()).variants;
  }

  // Initialize all settings.
  updateOptionGroupLabel();
  updateOptionGroupAvailability();
  broadcastOptionGroupInfo();

  // Set up event handlers.
  $(selectors.optiongroup).on("change", updateOptionGroupLabel);
  $(selectors.optiongroup).on("change", updateOptionGroupAvailability);
  $(selectors.optiongroup).on("change", broadcastOptionGroupInfo);
  $(document).on(event_types.syn_optiongroup_info, broadcastOptionGroupInfo);


  //----------------------------------------------------------------------------
  // This function broadcasts option group info.
  //  - It calls getOptionGroupInfo() with an option group to get its info.
  //  - On page load, it broadcasts an event for every option group's info.
  //  - When the event syn_optiongroup_info is received, it broadcasts an event
  //    for every option group's info.
  //  - When a checked option changes, it only broadcasts that option group's
  //    info.  Broadcasting the selected option allows external modules to
  //    respond to these changes.  For example, an [_infochart] can highlight
  //    a table column associated with a size option.
  //----------------------------------------------------------------------------
  function broadcastOptionGroupInfo(event) {

    if (bDebug) {
      console.log("[_optiongroup] broadcastOptionGroupInfo()");
    }

    // Get the set of affected option groups.
    let $optiongroups = null;

    if (!event || event_types.syn_optiongroup_info == event.type) {
      $optiongroups = $(selectors.optiongroup);
      if (bDebug) {
        console.log("[_optiongroup]\t\tBroadcasting info for all option groups");
      }
    } else {
      $optiongroups = $(event.target.closest(selectors.optiongroup));
      if (bDebug) {
        console.log("[_optiongroup]\t\tBroadcasting info for an option group change");
      }
    }

    // Iterate over the set of affected option groups and broadcast their info.
    $optiongroups.each(function() {
      // Get the current option group's info.
      let $optiongroup = $(this);
      let optiongroup_info = getOptionGroupInfo($optiongroup);
      // Broadcast the info as a custom event that will bubble up the DOM.
      let event_type = event_types.optiongroup_info;
      let event_data = optiongroup_info;
      if (bDebug) {
        console.log("[_optiongroup]\t\tTriggering event type [%s] for [%s/%s]", event_type, $optiongroup.attr(attributes.data_productid), $optiongroup.attr("id"));
        console.debug("[_optiongroup]\t\tEvent data [%o]", event_data);
      }
      $(document).trigger(event_type, event_data);
    });
  }


  //----------------------------------------------------------------------------
  // This function gathers info needed by the framework from an option group.
  //  - Option group info includes any information from an option group set
  //    that is needed by the framework, such as productid, option group name,
  //    option group current value, price, availability, etc.
  //  - Additional information needed by the framework can be added here.
  //----------------------------------------------------------------------------
  // TODOs:
  //  - Make sure the productid of the variants matches the option group's.
  //    This is more apparent when two different sets of [_optiongroup]s are
  //    rendered on the page, and they don't work right.
  //----------------------------------------------------------------------------
  function getOptionGroupInfo($optiongroup) {

    if (bDebug) {
      console.log("[_optiongroup] getOptionGroupInfo($optiongroup)");
    }

    if (!$optiongroup) {
      if (bDebug) {
        console.log("[_optiongroup]\t\tAborting: No $optiongroup provided");
      }
      return;
    }

    // Get the option group set this option group belongs to (by productid).
    let $optiongroups = $(selectors.optiongroup).filter(function() {
      return $(this).attr(attributes.data_productid) == $optiongroup.attr(attributes.data_productid);
    });

    // Build the checked options set, O*.
    let O_star = $.map($optiongroups, function(G) {
      let O_star_G = {
        productid: $(G).attr(attributes.data_productid),
        value: $(G).find(selectors.checked_option).attr(attributes.option_value),
        index: $(G).find(selectors.checked_option).attr(attributes.option_index),
      };
      return O_star_G;
    });

    if (bDebug) {
      console.debug("[_optiongroup]\t\t\t\tO_star=[%o]", O_star);
    }

    // Get V*, the O* variant (if V* exists, it will match all O* options).
    let V_star = null;
    if (variants) {
      variants.forEach(function(variant, index) {
        let match = true;
        O_star.forEach(function(option) { if (match) { match = (option.value == variant[option.index]); } });
        if (match) { V_star = variant; }
      });
    }

    if (bDebug) {
      console.debug("[_optiongroup]\t\t\t\tV_star=[%o]", V_star);
    }

    // Determine needed attributes of V*.
    let availability = null;
    let price = null;
    let compare_at_price = null;

    availability = variantAvailability(V_star);
    if (V_star) {
      price = V_star.price;
      compare_at_price = V_star.compare_at_price;
    }

    // Populate the option group info object.
    let $checked_option = $optiongroup.find(selectors.checked_option);
    let optiongroup_info = {
      "productid": $optiongroup.attr(attributes.data_productid),
      "name": $optiongroup.attr(attributes.data_name),
      "value": $checked_option.attr(attributes.option_value),
      "availability": availability,
      "price": price,
      "compare_at_price": compare_at_price,
    };

    return optiongroup_info;
  }


  //----------------------------------------------------------------------------
  // This function updates option group labels to their checked option value.
  //  - On page load, it sets all labels to the option group's checked option.
  //  - Subsequently, it only updates the group whose checked option changes.
  //----------------------------------------------------------------------------
  function updateOptionGroupLabel(event) {

    if (bDebug) {
      console.log("[_optiongroup] updateOptionGroupLabel()");
    }

    // Get the set of affected option groups.
    if (event) {
      var $optiongroups = $(event.target.closest(selectors.optiongroup));
    } else {
      var $optiongroups = $(selectors.optiongroup);
    }

    // Iterate over the set of affected option groups, and update their caption.
    $optiongroups.each(function() {
      let $optiongroup = $(this);
      let productid = $optiongroup.attr(attributes.data_productid);
      let $optiongroup_value = $optiongroup.find(selectors.optiongroup_value);
      let $checked_option = $optiongroup.find(selectors.checked_option);
      let checked_option_title = $checked_option.attr(attributes.option_title);
      $optiongroup_value.html(checked_option_title);

      if (bDebug) {
        if (event) {
          console.log("[_optiongroup]\t\tOption group [%s/%s] label changed to [%s]", productid, $optiongroup.attr("id"), checked_option_title);
        } else {
          console.log("[_optiongroup]\t\tOption group [%s/%s] label set to [%s]", productid, $optiongroup.attr("id"), checked_option_title);
        }
      }
    });
  }


  //----------------------------------------------------------------------------
  // This function updates the availability of an option group set.
  //  - An option group set is a set of option groups with matching productids.
  //      - This allows for multiple products with options to be rendered.
  //      - The availability of an option in an option group is basically the
  //        "what if" scenario on the availability of the product with that
  //        option checked along with the checked options of the other option
  //        groups in the set.  (See the design patterns document for details.)
  //  - The function expects the global "variants" to exist with product data.
  //    That is where the data to compute availability is found.
  //  - When invoked without an event, it updates all option groups.
  //  - When invoked as handler to an option group change, it only updates
  //    the option groups in the option group set where the change was made.
  //  - One option in an option group *must* be selected, else the code fails.
  //----------------------------------------------------------------------------
  // TODOs:
  //  - When multiple products are on the page, and multiple option group sets
  //    are rendered, update the function to ensure the variants used to
  //    calculate V* for an option group set have a matching productid.
  //----------------------------------------------------------------------------
  function updateOptionGroupAvailability() {

    if (bDebug) {
      console.log("[_optiongroup] updateOptionGroupAvailability()");
    }

    if (!variants) {
      if (bDebug) {
        console.log("[_optiongroup]\t\tAborting: No variants object provided");
      }
      return;
    }

    let productids = new Set();
    let $optiongroups = null;
    let $changed_optiongroup = null;

    // Generate the set of product IDs to update option groups for.
    if (event) {
      // Get the product ID from the changed option group.
      productids.add($(event.target.closest(selectors.optiongroup)).attr(attributes.data_productid));
      $changed_optiongroup = $(event.target.closest(selectors.optiongroup));
    } else {
      // Generate a list of all unique product IDs from all option groups.
      $(selectors.optiongroup).each(function() { productids.add($(this).attr(attributes.data_productid)); });
    }

    if (bDebug) {
      console.log("[_optiongroup]\t\tProduct IDs=[%o]", productids);
    }

    // Iterate over the set of product IDs; update corresponding option groups.
    for (let productid of productids) {

      if (bDebug) {
        console.log("[_optiongroup]\t\tUpdating availability for productid=[%s]", productid);
      }

      // Get the set of option groups with a matching productid.
      $optiongroups = $(selectors.optiongroup).filter(function() {
        return productid == $(this).attr(attributes.data_productid);
      });

      // Iterate over the set of matching option groups.
      $optiongroups.each(function() {

        // Get the current option group.
        let $optiongroup = $(this);

        // Skip the group if the checked option changed on it.
        // (Option groups whose checked option changed do not need updating.)
        if ($optiongroup.is($changed_optiongroup)) {
          if (bDebug) {
            console.log("[_optiongroup]\t\t\tOption group [%s/%s] changed; no update needed", productid, $changed_optiongroup.attr("id"));
          }
          return;
        } else {
          if (bDebug) {
            console.log("[_optiongroup]\t\t\tOption group [%s/%s] needs updating", productid, $optiongroup.attr("id"));
          }
        }

        // Build the partial checked options set, O* - { O*_G }.
        let O_partial = $.map($optiongroups, function(G) {
          if ($(G).is($optiongroup)) {
            let O_star_G = null;
            return O_star_G;
          } else {
            let O_star = {
              productid: $(G).attr(attributes.data_productid),
              value: $(G).find(selectors.checked_option).attr(attributes.option_value),
              index: $(G).find(selectors.checked_option).attr(attributes.option_index),
            };
            return O_star;
          }
        });

        if (bDebug) {
          console.debug("[_optiongroup]\t\t\t\tO_partial=[%o]", O_partial);
        }

        // Iterate over the set of options in the current option group.
        $optiongroup.find(selectors.option).each(function() {

          // Get the current option and its label.
          let $option = $(this);
          let $label = $("[for=" + $option.attr("id") + "]");

          // Build an ordered set of ordered options O+ = O* - { O*_G } + { O }.
          // (Ordering by index assumes index = "option"N with "N" an integer.)
          let O = {
            productid: $option.closest(selectors.optiongroup).attr(attributes.data_productid),
            value: $option.attr(attributes.option_value),
            index: $option.attr(attributes.option_index),
          }
          let O_plus = [...O_partial, O];
          O_plus.sort(function(a, b) { return a.index.slice(-1) - b.index.slice(-1); });

          if (bDebug) {
            console.debug("[_optiongroup]\t\t\t\tO_plus=[%o]", O_plus);
          }

          // Get V+, the O+ variant, if it exists.  V+ will match all O+ options.
          let V_plus = null;
          variants.forEach(function(variant, index) {
            let match = true;
            O_plus.forEach(function(option) { if (match) { match = (option.value == variant[option.index]); } });
            if (match) { V_plus = variant; }
          });

          if (bDebug) {
            console.debug("[_optiongroup]\t\t\t\tV_plus=[%o]", V_plus);
          }

          // Determine the availability of V+ and update O's label to match.
          let availability = variantAvailability(V_plus);

          if (bDebug) {
            console.log("[_optiongroup]\t\t\t\tOption [%s] is [%s]", $.map(O_plus, function(x) { return x["value"]; }).join("/"), availability);
          }

          $label.removeClass(classes.outofstock);
          $label.removeClass(classes.soldout);
          $label.removeClass(classes.unavailable);

          if (availabilities.instock == availability) {
            // Do nothing.
          } else if (availabilities.outofstock == availability) {
            $label.addClass(classes.outofstock);
          } else if (availabilities.soldout == availability) {
            $label.addClass(classes.soldout);
          } else if (availabilities.unavailable == availability) {
            $label.addClass(classes.unavailable);
          } else {
            $label.addClass(classes.unknown);
          }

        });

      });

    }

  }


  //----------------------------------------------------------------------------
  // This function consolidates the availability logic for any variant.
  //----------------------------------------------------------------------------
  function variantAvailability(variant) {

    if (bDebug) {
      console.debug("[_optiongroup] variantAvailability(variant)");
    }

    let availability = null;
    if (variant) {
      if (0 < variant.inventory_quantity) {
        availability = availabilities.instock;
      } else {
        if ("continue" == variant.inventory_policy) {
          availability = availabilities.outofstock;
        } else if ("deny" == variant.inventory_policy) {
          availability = availabilities.soldout;
        } else {
          availability = availabilities.unknown;
        }
      }
    } else {
      availability = availabilities.unavailable;
    }

    if (bDebug) {
      console.debug("[_optiongroup]\t\tVariant [%o] is [%s]", variant, availability);
    }

    return availability;
  }

});
