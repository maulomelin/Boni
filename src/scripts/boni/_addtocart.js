/* _addtocart.js ---------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - There are some lines that need to be uncommented depending on whether
//    the script is running in Shopify or outside of it.
//    See "// SWITCH" sections below.
//------------------------------------------------------------------------------
// TODOs:
//  - Add error reporting when ("unknown" == availability).
//  - Figure out if we can remove the "// SWITCH" sections below and instead
//    figure out if the proper subroutines exist or not, programmatically.
//  - Try to get rid of needing to set/unset "._quiet" by only using CSS.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;

  if (bDebug) {
    console.log("[_addtocart] Initializing");
  }

  let selectors = {
    addtocart: "._js-addtocart",
    compare: "._js-addtocart-info-compare",
    price: "._js-addtocart-info-price",
    message: "._js-addtocart-info-message",
    request_product: "._js-addtocart-request-product",
    request_instockalert: "._js-addtocart-request-instockalert",
    form_product: "._js-addtocart-form-product",
    form_instockalert: "._js-addtocart-form-instockalert",
    form_instockalert_option: "._js-addtocart-form-instockalert-option",
    form_instockalert_availability: "._js-addtocart-form-instockalert-availability",
    response: "._js-addtocart-response",
  };

  let attributes = {
    productid: "data-u-productid",
    name: "data-u-name",
  };

  let classes = {
    hide: "_hide",
    red: "_text-red",
    green: "_text-green",
    quiet: "_quiet",
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
  };

  // Set up event handlers and broadcast a sync signal.
  $(selectors.response).on("click", dismissResponse);
  $(document).on(event_types.optiongroup_info, updateAddToCart);
  $(document).trigger(event_types.syn_optiongroup_info);


  //----------------------------------------------------------------------------
  // This function dismisses any response dialogs to an add-to-cart form.
  //  - AKA:  $(selectors.response).on("click", function() { $(selectors.response).addClass(classes.hide); });
  //----------------------------------------------------------------------------
  function dismissResponse() {

    if (bDebug) {
      console.log("[_addtocart] dismissResponse()");
    }

    $(selectors.response).addClass(classes.hide);
  }


  //----------------------------------------------------------------------------
  // This function updates all [_addtocart] elements on an option group change.
  // NOTE: Uncomment appropriate code below to render money figures correctly.
  //----------------------------------------------------------------------------
  function updateAddToCart(event, data) {

    if (bDebug) {
      console.log("[_addtocart] updateAddToCart()");
      console.debug("[_addtocart]\t\tevent=[%o] data=[%o]", event, data);
    }

    if (!data) { return; }

    // Get the set of addtocart elements corresponding to the event's data.
    let $addtocarts = $(selectors.addtocart).filter(function() {
      return data.productid == $(this).attr(attributes.productid);
    });
    // Iterate over the set of matching elements and update them.
    $addtocarts.each(function() {
      let $addtocart = $(this);
      let $compare = $addtocart.find(selectors.compare);
      let $price = $addtocart.find(selectors.price);
      let $message = $addtocart.find(selectors.message);
      let $request_product = $addtocart.find(selectors.request_product);
      let $request_instockalert = $addtocart.find(selectors.request_instockalert);
      let $form_instockalert = $addtocart.find(selectors.form_instockalert);
      let $form_instockalert_option = $form_instockalert.find(selectors.form_instockalert_option).filter(function() {
        return data.name == $(this).attr(attributes.name);
      });
      let $form_instockalert_availability = $form_instockalert.find(selectors.form_instockalert_availability);

      // Get data we are interested in from the event message.
      let availability = data.availability;
      let option_value = data.value;
      let p = parseInt(data.price);
      let c = parseInt(data.compare_at_price) ||  0;

      if (bDebug) {
        console.log("[_addtocart]\t\tavailability/price/compare=[%s/%d/%d]", availability, p, c);
      }

      // Implement update logic.
      $form_instockalert_option.val(option_value);
      $form_instockalert_availability.val(availability);

      if (availabilities.instock == availability) {
// CASE: The following line must use appropriate currency routines.
//  WHEN "in Shopify"
        $price.html(slate.Currency.formatMoney(p, theme.moneyFormat));
//  WHEN "NOT in Shopify"
//        $price.html("$" + p/100);
// /CASE
        $price.removeClass(classes.quiet);
        if (p < c) {
// CASE: The following line must use appropriate currency routines.
//  WHEN "in Shopify"
          $compare.html(slate.Currency.formatMoney(c, theme.moneyFormat));
//  WHEN "NOT in Shopify"
//          $compare.html("$" + c/100);
// /CASE
        } else {
          $compare.empty();
        }
        $message.empty();
        $request_product.removeClass(classes.hide);
        $request_instockalert.addClass(classes.hide);
      } else if (
        availabilities.soldout == availability ||
        availabilities.outofstock == availability
      ) {
// CASE: The following line must use appropriate currency routines.
//  WHEN "in Shopify"
        $price.html(slate.Currency.formatMoney(p, theme.moneyFormat));
//  WHEN "NOT in Shopify"
//        $price.html("$" + p/100);
// /CASE
        $price.addClass(classes.quiet);
        $compare.empty();
        $message.html("&cross; Not in stock.  Be notified when it's in stock.");
        $request_product.addClass(classes.hide);
        $request_instockalert.removeClass(classes.hide);
      } else if (availabilities.unavailable == availability) {
        $price.empty();
        $compare.empty();
        $message.html("&cross; Not in stock.  Be notified when it's in stock.");
        $request_product.addClass(classes.hide);
        $request_instockalert.removeClass(classes.hide);
      } else {
        $price.empty();
        $compare.empty();
        $message.html("&cross; Availability is unknown.");
        $request_product.addClass(classes.hide);
        $request_instockalert.addClass(classes.hide);
      }

    });

  }

});
