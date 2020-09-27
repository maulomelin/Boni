/* _m-variantpricing.js --------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - Some code below must be updated to use appropriate currency routines.
//  - We used to have the code to trigger an optiongroup sync as follows:
//      $(selectors.variantpricing).trigger(event_types.syn_optiongroupinfo);
//    but we changed it to $(document).trigger(...); because in the local
//    environment, with the use of a snippet, the pricing module is injected
//    dynamically into the DOM, so it's not there.  Therefore, the event is
//    never triggered.  Moving it to $(document) triggers it because that node
//    will be there.
//  - Why not use visual breakpoints to turn things on and off?
//      - If there are multiple prices on the page, we need to verify which
//        productid a particular module is associated with.  We prefer doing
//        this with a script vs. more complicated CSS rules.
//      - Also, we want prices to be explicitly shown/hidden from the DOM
//        when and as appropriate.
//  - The money format is configured in the Shopify Admin UI:
//        [ Shopify > Settings > General > Store currency: change formatting ]
//      - To see possible values, see \src\scripts\slate\currency.js
//          { "amount", "amount_no_decimals", "amount_with_space_character", "amount_no_deciamsl_with_comma_separator", "amount_no_decimals_with_space_separator" }
//------------------------------------------------------------------------------
// TODOs:
//  - Make the availability messages configurable.
//  - Check to make sure the if (slate) { ... } check works on currency.
//  - Update whenever we add multiple products to a page, and multiple
//    [_pricing] modules on the page, each to a different product.
//  - See about moving to use:
//        let event_types = {
//          syn_selectedvariantinfo: "_ev-syn-selectedvariantinfo",
//          ack_selectedvariantinfo: "_ev-ack-selectedvariantinfo",
//        };
//  - Update our formatPrice() routine and remove any dependencies on the
//    Slate library in currency.js.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;
  let sModule = "_m-variantpricing";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    variantpricing: "._js-variantpricing",
    price: "._js-variantpricing-price",
    compare: "._js-variantpricing-compare",
    availability: "._js-variantpricing-availability",
  };

  let attributes = {
    productid: "data-u-productid",
    label_instock: "data-u-label-instock",
    label_outofstock: "data-u-label-outofstock",
    label_soldout: "data-u-label-soldout",
    label_unavailable: "data-u-label-unavailable",
    label_error: "data-u-label-error",
  };

  let classes = {
    hide: "_hide",
    quiet: "_quiet",
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

  if (bDebug) { console.log("[%s] [%d] modules found.", sModule, $(selectors.variantpricing).length); }

  // First, set up all event handlers.
  $(document).on(event_types.ack_optiongroupinfo, updateVariantPricing);

  // Next, broadcast a sync signal.
  if (bDebug) { console.log("[%s] Send message requesting optiongroup info.", sModule); }
  $(document).trigger(event_types.syn_optiongroupinfo, { requestor: sModule, });


  //----------------------------------------------------------------------------
  // This function updates the pricing elements on an option group update event.
  // NOTE: Code below must be updated to use appropriate currency routines.
  //----------------------------------------------------------------------------
  function updateVariantPricing(event, data) {

    if (!data) {
      if (bDebug) { console.warn("[%s] Aborting updateVariantPricing(): No event data present.", sModule); }
      return;
    }

    // Get the set of pricing elements corresponding to the event's data.
    let $variantpricings = $(selectors.variantpricing).filter(function() {
      return data.productid == $(this).attr(attributes.productid);
    });

    if (bDebug) { console.log("[%s] updateVariantPricing(): [%s] module(s) found", sModule, $variantpricings.length); }

    // If no modules were found, exit.
    if (!$variantpricings.length) {
      return;
    }

    // Get data we are interested in from the event message.
    let availability = data.availability;
    let p = parseInt(data.price);
    let c = parseInt(data.compare_at_price) ||  0;
    let display_p = null;
    let display_c = null;

    // Pick the appropriate formatting routine based on environment.
    if (typeof slate === "undefined") {
      display_p = formatPrice(p);
      display_c = formatPrice(c);
    } else {
      display_p = slate.Currency.formatMoney(p, theme.moneyFormat);
      display_c = slate.Currency.formatMoney(c, theme.moneyFormat);
    }
    // TEMPORARY: For now, always use our home-grown formatPrice() routine.
    display_p = formatPrice(p);
    display_c = formatPrice(c);

    if (bDebug) { console.log("[%s] updateVariantPricing(): A=[%s], P=[%d/%s], C=[%d/%s]", sModule, availability, p, display_p, c, display_c); }

    // Iterate over the set of matching pricing elements and update them.
    $variantpricings.each(function() {

      let $variantpricing = $(this);
      let $price = $variantpricing.find(selectors.price);
      let $compare = $variantpricing.find(selectors.compare);
      let $availability = $variantpricing.find(selectors.availability);

      // Implement pricing logic.
      if (availabilities.instock == availability) {
        $price.html(display_p);
        if (p < c) { $compare.html(display_c); } else { $compare.empty(); }
        $availability.empty();
      } else if (availabilities.outofstock == availability) {
        $price.empty();
        $compare.empty();
        $availability.html($availability.attr(attributes.label_outofstock));
      } else if (availabilities.soldout == availability) {
        $price.empty();
        $compare.empty();
        $availability.html($availability.attr(attributes.label_soldout));
      } else if (availabilities.unavailable == availability) {
        $price.empty();
        $compare.empty();
        $availability.html($availability.attr(attributes.label_unavailable));
      } else if (availabilities.error == availability) {
        $price.empty();
        $compare.empty();
        $availability.html($availability.attr(attributes.label_error));
      } else {
        $price.empty();
        $compare.empty();
        $availability.html($availability.attr(attributes.label_error));
      }

    });
  }


  //----------------------------------------------------------------------------
  // This function formats a value of cents into a price.
  //  - Simplified version of formatMoney() in \src\scripts\slate\currency.js
  //  - We don't just do:
  //        price = "$" + cents/100;
  //    We want price to show cents only when the price has cents to show.
  //----------------------------------------------------------------------------
  function formatPrice(cents) {
    let number = (cents / 100).toFixed(2);
    let number_parts = number.split(".");
    let integer_part = number_parts[0];
    let decimal_part = number_parts[1];

    price = "$" + integer_part;
    if (parseInt(decimal_part)) {
      price = price + "." + decimal_part;
    }

    if (bDebug) { console.log("[%s] formatPrice(): [%s] => [%s]-[%s] => [%s]", sModule, cents, integer_part, decimal_part, price); }

    return price;
  }

});
