/* _m-optiongroup.js -----------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - The script supports multiple [data-product-json] elements on a page.
//      - This allows debug/testing of multiple different [_m-optiongroup]
//        modules on a design patterns doc.
//      - This will also allow for multiple [_addtocart] modules to eventually
//        be designed on a page.
//      - In this model, every [_m-optiongroup]'s productid is used to retrieve
//        the associated set of variants.  The [_m-optiongroup] is then
//        checked/validated against those variants.
//  - The availability breakpoint messaging only works today because there's
//    a single product on the page (even though modules support multiple
//    products on the page).  As soon as we show more than one product,
//    which product's availability do we post on the breakpoint message?
//    html[data-u-availability] refers to availability for which product's
//    selected variant?
//------------------------------------------------------------------------------
// TODOs:
//  - Migrate away from html[data-u-availability] once we show more than one
//    product on the page.
//      - We'll have to redo the CSS rules.
//      - We'll have to update scripts to register to the appropriate
//        _evt-ack-* messages.
//  - Determine if we need *selected_variant_info messages; clean up if not.
//  - Add inventory count to the availability message, if someone needs it.
//  - Optimize the _ev-syn-* messages to include optional parameters
//    for the productid/name identifier pair, and the response only provides
//    info for the matching option group.
//      - The current design of the "_ev-syn-*" message is very chatty.
//      - It provides a response for every option group, even though the one
//        who requested it may only need data for a single option group.
//  - Review the usage/implementation of a selectedVariantInfo event message.
//      - The basic function is at the bottom of this script.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;
  let sModule = "_m-optiongroup";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    html: "html",
    optiongroup: "._js-optiongroup",
    optiongroup_label: "._js-optiongroup-label",
    option: "._js-option",
    checked_option: "._js-option:checked",
    product_json: "[data-product-json]",
  };

  let attributes = {
    option_value: "value",
    data_index: "data-u-index",
    data_title: "data-u-title",
    data_productid: "data-u-productid",
    data_name: "data-u-name",
    data_availability: "data-u-availability",
  };

  let classes = {
    outofstock: "_x",
    soldout: "_xx",
    unavailable: "_xxx",
    error: "_error",
  };

  let event_types = {
    syn_optiongroupinfo: "_ev-syn-optiongroupinfo",
    ack_optiongroupinfo: "_ev-ack-optiongroupinfo",
  };

  let availabilities = {
    instock: "instock",
    outofstock: "outofstock",
    soldout: "soldout",
    unavailable: "unavailable",
    error: "error",
  };

  // Abort if no [_optiongroup] objects found.
  if (0 == $(selectors.optiongroup).length) {
    if (bDebug) { console.warn("[%s] Aborting: No optiongroup objects found", sModule); }
    return;
  }
  if (bDebug) { console.log("[%s] [%d] modules found.", sModule, $(selectors.optiongroup).length); }

  // Set up the products object to support multiple [data-product-json] objects.
  let products = null;
  let $product_jsons = $(selectors.product_json);
  if (0 == $product_jsons.length) {
    if (bDebug) { console.warn("[%s] Aborting: No [data-product-json] objects found", sModule); }
    return;
  } else {
    if (bDebug) { console.log("[%s] [%d] [data-product-json] objects found", sModule, $product_jsons.length); }

    products = $.map($product_jsons, function(J) {
      let product_json = JSON.parse($(J).html());
      let product_data = {
        productid: product_json.id,
        variants: product_json.variants,
      };
      return product_data;
    });

    // Verify the products object by iterating over it.
    if (bDebug) { for (let product of products) { console.log("[%s] product=[%o]", sModule, product); } }
  }

  // Initialize all settings.
  updateOptionGroupLabel();
  updateOptionGroupAvailability();
  broadcastOptionGroupInfo();

  // Set up all event handlers.
  $(selectors.optiongroup).on("change", updateOptionGroupLabel);
  $(selectors.optiongroup).on("change", updateOptionGroupAvailability);
  $(selectors.optiongroup).on("change", broadcastOptionGroupInfo);
  $(document).on(event_types.syn_optiongroupinfo, broadcastOptionGroupInfo);


  //----------------------------------------------------------------------------
  // This function broadcasts each optiongroup's info.
  //  - It calls getOptionGroupInfo() with an optiongroup to get its info.
  //  - On page load, it broadcasts an event for every optiongroup's info.
  //  - When the event syn_optiongroup_info is received, it broadcasts an event
  //    for every optiongroup's info.
  //  - When a checked option changes, it only broadcasts that optiongroup's
  //    info.  Broadcasting the selected option allows external modules to
  //    respond to these changes.  For example, an [_infochart] can highlight
  //    a table column associated with a size option.
  //----------------------------------------------------------------------------
  function broadcastOptionGroupInfo(event, data) {

//    if (bDebug) { console.groupCollapsed("[%s] broadcastOptionGroupInfo()", sModule); }

    // Get the set of affected optiongroups.
    let $optiongroups = null;
    if (!event) {
      if (bDebug) { console.log("[%s] broadcastOptionGroupInfo(): Initial broadcast of info on all optiongroups.", sModule); }
      $optiongroups = $(selectors.optiongroup);
    } else if (event_types.syn_optiongroupinfo == event.type) {
      if (bDebug) { console.log("[%s] broadcastOptionGroupInfo(): Request by [%s] for info on all optiongroups.", sModule, ("undefined" === typeof data ? "undefined" : data.requestor)); }
      $optiongroups = $(selectors.optiongroup);
    } else {
      if (bDebug) { console.log("[%s] broadcastOptionGroupInfo(): Broadcast triggered by a change in an optiongroup's selection.", sModule); }
      $optiongroups = $(event.target.closest(selectors.optiongroup));
    }

    // Iterate over the set of optiongroups and broadcast their info.
    $optiongroups.each(function() {

      let $optiongroup = $(this);
      let event_type = event_types.ack_optiongroupinfo;
      let event_data = getOptionGroupInfo($optiongroup);

      if (bDebug) {
        let productid = $optiongroup.attr(attributes.data_productid);
        let optiongroup_name = $optiongroup.attr(attributes.data_name);

        console.groupCollapsed("[%s] Broadcasting optiongroup [%s/%s].", sModule, productid, optiongroup_name);
        console.debug("[%s] Event type [%o]", sModule, event_type);
        console.debug("[%s] Event data [%o]", sModule, event_data);
        console.groupEnd();
      }

      // Broadcast the availability to the root node.
      // TODO: THIS ONLY WORKS FOR ONE PRODUCT, NOT IF MORE THAN ONE PRODUCT'S
      // OPTIONGROUPS ARE ON THE PAGE.
      let $html = $(selectors.html);
      $html.attr(attributes.data_availability, event_data.availability);

      // Broadcast the event message.
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
  function getOptionGroupInfo($optiongroup) {

    if (!$optiongroup) {
      if (bDebug) { console.log("[%s] Aborting getOptionGroupInfo(): No optiongroup provided", sModule); }
      return;
    }

    // Get some optiongroup info.
    let productid = $optiongroup.attr(attributes.data_productid);
    let optiongroup_name = $optiongroup.attr(attributes.data_name);

    if (bDebug) { console.groupCollapsed("[%s] getOptionGroupInfo(optiongroup=[%s/%s])", sModule, productid, optiongroup_name); }

    // Get the selected variant of this productid.
    let V_star = getSelectedVariant(productid);

    // Populate the option group info object.
    let $checked_option = $optiongroup.find(selectors.checked_option);
    let optiongroup_info = {
      productid: $optiongroup.attr(attributes.data_productid),        // IMPORTANT: productid
      name: $optiongroup.attr(attributes.data_name),                  // IMPORTANT: the option that changed
      value: $checked_option.attr(attributes.option_value),           // IMPORTANT: the option that changed
      availability: getVariantAvailability(V_star),                   // IMPORTANT: variant's availability
      price: V_star ? V_star.price : null,                            // REDUNDANT
      compare_at_price: V_star ? V_star.compare_at_price : null,      // REDUNDANT
      variant: V_star,
    };

    if (bDebug) { console.groupEnd(); }

    return optiongroup_info;
  }


  //----------------------------------------------------------------------------
  // This function updates option group labels to their checked option value.
  //  - On page load, it sets all labels to the option group's checked option.
  //  - Subsequently, it only updates the group whose checked option changes.
  //----------------------------------------------------------------------------
  function updateOptionGroupLabel(event) {

    if (bDebug) { console.group("[%s] updateOptionGroupLabel()", sModule); }

    // Get the set of affected option groups.
    let $optiongroups = null;
    if (event) {
      $optiongroups = $(event.target.closest(selectors.optiongroup));
    } else {
      $optiongroups = $(selectors.optiongroup);
    }

    // Iterate over the set of affected option groups, and update their caption.
    $optiongroups.each(function() {

      let $optiongroup = $(this);
      let $checked_option = $optiongroup.find(selectors.checked_option);
      let checked_option_title = $checked_option.attr(attributes.data_title);
      let $optiongroup_label = $optiongroup.find(selectors.optiongroup_label);
      $optiongroup_label.html(checked_option_title);

      if (bDebug) {
        let productid = $optiongroup.attr(attributes.data_productid);
        let optiongroup_name = $optiongroup.attr(attributes.data_name);
        if (event) {
          console.log("[%s] Option group [%s/%s] label changed to [%s]", sModule, productid, optiongroup_name, checked_option_title);
        } else {
          console.log("[%s] Option group [%s/%s] label set to [%s]", sModule, productid, optiongroup_name, checked_option_title);
        }
      }
    });

    if (bDebug) { console.groupEnd(); }
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
  //  - When multiple products are on the page, and multiple option group sets
  //    are rendered, the variants used to check availability come from the
  //    same productid.
  //----------------------------------------------------------------------------
  function updateOptionGroupAvailability(event) {

    // DOING: allow multiple product jsons
    if (!products) {
      if (bDebug) { console.log("[%s] Aborting updateOptionGroupAvailability(): No products object found", sModule); }
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

    // Iterate over the set of product IDs; update corresponding option groups.
    for (let productid of productids) {

      // Get the set of option groups with a matching productid.
      $optiongroups = $(selectors.optiongroup).filter(function() {
        return productid == $(this).attr(attributes.data_productid);
      });

      // Iterate over the set of matching option groups.
      $optiongroups.each(function() {

        // Get the current option group.
        let $optiongroup = $(this);

        // Skip the group if the checked option changed on it.
        //  - Option groups whose checked option changed do not need checking.
        if ($optiongroup.is($changed_optiongroup)) {
          if (bDebug) { console.log("[%s] updateOptionGroupAvailability(): Skip [%s/%s]; it changed.", sModule, productid, $changed_optiongroup.attr("id")); }
          return;
        } else {
          if (bDebug) { console.groupCollapsed("[%s] updateOptionGroupAvailability(): Check [%s/%s].", sModule, productid, $optiongroup.attr("id")); }
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
              index: $(G).find(selectors.checked_option).attr(attributes.data_index),
            };
            return O_star;
          }
        });

        // Iterate over the set of options in the current option group.
        $optiongroup.find(selectors.option).each(function() {

          // Get the current option and its label.
          let $option = $(this);
          let $label = $("[for=" + $option.attr("id") + "]");

          // Build an ordered set of ordered options O+ = O* - { O*_G } + { O }.
          //  - This is basically a candidate group of selected options.
          //  - Ordering by index assumes index = "option"N with "N" an integer.
          let O = {
            productid: $option.closest(selectors.optiongroup).attr(attributes.data_productid),
            value: $option.attr(attributes.option_value),
            index: $option.attr(attributes.data_index),
          };
          let O_plus = [...O_partial, O];
          O_plus.sort(function(a, b) { return a.index.slice(-1) - b.index.slice(-1); });

          // Get V+, the O+ variant, if it exists.
          let V_plus = getOptionsVariant(O_plus, productid);

          if (bDebug) {
            console.groupCollapsed("[%s] Checking option [%s].", sModule, $.map(O_plus, function(x) { return x["value"]; }).join("/"));
            console.log("[%s] Associated variant=[%s].", sModule, V_plus ? V_plus.title : null);
            console.debug("[%s] O_partial=[%o]", sModule, O_partial);
            console.debug("[%s] O_plus=[%o]", sModule, O_plus);
            console.debug("[%s] V_plus=[%o]", sModule, V_plus);
          }

          // Determine the availability of V+ and update O's label to match.
          let availability = getVariantAvailability(V_plus);

          if (bDebug) {
            console.groupEnd();
            console.log("[%s] Option [%s] is [%s].", sModule, $.map(O_plus, function(x) { return x["value"]; }).join("/"), availability);
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
            $label.addClass(classes.error);
          }

        });

        if (bDebug) { console.groupEnd(); }
      });
    }
  }


  //----------------------------------------------------------------------------
  // This function returns the given product's currently selected variant.
  //  - The combined set of optiongroup selections yields a variant.
  //  - The function combines the selections, looks up the matching variant
  //    in the variants object, and broadcasts that variant's info.
  //  - The function handles optiongroup choices that do not have a matching
  //    variant.  These are represented as "unavailable" in the system.
  //  - If there are not enough optiongroups for all productid options,
  //    it simply returns the first variant that matches the available options.
  //    For example, if the product data includes options for color/size/style,
  //    but there are only optiongroups for color/size, then it will return
  //    the first variant that matches the given values for color/size.
  //----------------------------------------------------------------------------
  function getSelectedVariant(productid) {

    // Get the optiongroups of this productid.
    let $optiongroups = $(selectors.optiongroup).filter(function() {
      return productid == $(this).attr(attributes.data_productid);
    });

    // Build the selected/checked options set, O*.
    let O_star = $.map($optiongroups, function(G) {
      let O_star_G = {
        productid: $(G).attr(attributes.data_productid),
        value: $(G).find(selectors.checked_option).attr(attributes.option_value),
        index: $(G).find(selectors.checked_option).attr(attributes.data_index),
      };
      return O_star_G;
    });

    // Get V*, the O* variant, if it exists.
    let V_star = getOptionsVariant(O_star, productid);

    if (bDebug) {
      console.groupCollapsed("[%s] getSelectedVariant(productid=[%s]) = [%s]", sModule, productid, V_star ? V_star.title : null);
      console.debug("[%s] O_star=[%o]", sModule, O_star);
      console.debug("[%s] V_star=[%o]", sModule, V_star);
      console.groupEnd();
    }

    return V_star;
  }


  //----------------------------------------------------------------------------
  // This function returns the variant associated with the given set of options.
  //  - The variant is from the set of variants from the given productid.
  //----------------------------------------------------------------------------
  function getOptionsVariant(O_plus, productid) {

    // Get the set of variants associated with this productid.
    let variants = null;
    for (let product of products) {
      if (productid == product.productid) {
        variants = product.variants;
        break;
      }
    }

    // Get V+, the O+ variant, if it exists.  V+ will match all O+ options.
    let V_plus = null;
    if (variants) {
      variants.forEach(function(variant, index) {
        let match = true;
        O_plus.forEach(function(option) { if (match) { match = (option.value == variant[option.index]); } });
        if (match) { V_plus = variant; }
      });
    }

    return V_plus;
  }


  //----------------------------------------------------------------------------
  // This function consolidates the availability logic for any variant.
  //  - The availability state logic is shared with a server-side script
  //    that is used by various subroutines.
  //  - Server-side script file:
  //
  //          \src\snippets\_util-variant-availability.liquid
  //  
  //    - The server-side and client-side logic that calculates availability
  //      state must be kept in sync for the UI to work as expected.
  //----------------------------------------------------------------------------
  function getVariantAvailability(variant) {

    let variant_title = null;
    let availability = null;
    if (variant) {
      variant_title = variant.title;
      if (0 < variant.inventory_quantity) {
        availability = availabilities.instock;
      } else {
        if ("continue" == variant.inventory_policy) {
          availability = availabilities.outofstock;
        } else if ("deny" == variant.inventory_policy) {
          availability = availabilities.soldout;
        } else {
          availability = availabilities.error;
        }
      }
    } else {
      availability = availabilities.unavailable;
    }

    if (bDebug) { console.log("[%s] getVariantAvailability([%s]) = [%s]", sModule, variant_title, availability); }

    return availability;
  }


  //----------------------------------------------------------------------------
  // NOTE: THIS FUNCTION IS CURRENTLY NOT IN USE.
  // TO MAKE IT WORK, OTHER MODULES MUST EXPECT IT / REQUEST IT:
  //      let event_types = {
  //        syn_selectedvariantinfo: "_ev-syn-selectedvariantinfo",
  //        ack_selectedvariantinfo: "_ev-ack-selectedvariantinfo",
  //      };
  //      // Initialize all settings.
  //      broadcastSelectedVariantInfo();
  //      // Set up all event handlers.
  //      $(selectors.optiongroup).on("change", broadcastSelectedVariantInfo);
  //      $(document).on(event_types.syn_selectedvariantinfo, broadcastSelectedVariantInfo);
  //----------------------------------------------------------------------------
  // This function broadcasts the selected variant's info.
  //  - If a given selection does not have a matching variant in the product
  //    data, then a null value is returned.  The caller should expect that.
  // TODOs:
  //  - This function is currently not being called; bring it back once
  //    we support it globally on all modules, to reduce event msg chatter.
  //  - This function will not replace broadcastOptionGroupInfo()
  //  - Updates to support multiple products on the page.
  //----------------------------------------------------------------------------
  function broadcastSelectedVariantInfo(event, data) {

    if (bDebug) { console.group("[%s] broadcastSelectedVariantInfo()", sModule); }

    // Generate a list of all unique product IDs from all option groups.
    let productids = new Set();
    $(selectors.optiongroup).each(function(index) {
      productids.add($(this).attr(attributes.data_productid));
    });

    // Iterate over the product IDs and broadcast the selected variant of each.
    for (let productid of productids) {

      let event_type = event_types.ack_selectedvariantinfo;
      let event_data = getSelectedVariant(productid);

      if (bDebug) {
        console.groupCollapsed("[%s] Broadcasting variant [%s].", sModule, event_data.title);
        console.debug("[%s] Event type [%o]", sModule, event_type);
        console.debug("[%s] Event data [%o]", sModule, event_data);
        console.groupEnd();
      }

      $(document).trigger(event_type, event_data);
    }

    if (bDebug) { console.groupEnd(); }
  }


});
