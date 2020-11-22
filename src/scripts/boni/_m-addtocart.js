/* _m-addtocart.js -------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = window.boni.debug;
  let sModule = "_m-addtocart";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    addtocart: "._js-addtocart",
    variantselect: "._js-addtocart-variantselect",
    cartform: "._js-addtocart-cartform",
    alertform: "._js-addtocart-alertform",
    alertcontrols: "._js-addtocart-alertcontrols",
    alertemail: "._js-addtocart-alertemail",
    alertbutton: "._js-addtocart-alertbutton",
    alertoption: "._js-addtocart-alertoption",
    alertavailability: "._js-addtocart-alertavailability",
    response: "._js-addtocart-response",
  };

  let attributes = {
    productid: "data-u-productid",
    name: "data-u-name",
    validform: "data-u-validform",
  };

  let classes = {
    hide: "_hide",
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

  if (bDebug) { console.log("[%s] [%d] modules found.", sModule, $(selectors.addtocart).length); }

  // First, set up all event handlers.
  $(selectors.response).on("click", dismissResponse);
  $(selectors.alertemail).on("input", validateEmail);
  $(selectors.alertemail).on("blur", validateEmail);
  $(selectors.alertbutton).on("click", submitAlert);
  $(document).on(event_types.ack_optiongroupinfo, updateModule);

  // Next, broadcast a sync signal.
  $(document).trigger(event_types.syn_optiongroupinfo, { requestor: sModule });


  //----------------------------------------------------------------------------
  // This function updates all [_addtocart] forms on an option group change.
  //  - The alert form are updated with data on the currently selected product.
  //  - The cart form is updated by setting the value of the master select
  //    to the variant corresponding to the currently-selected options.
  //      - The routine assumes the master select is a <select> element.
  //      - The event message contains the selected variant.  All the work
  //        to figure it out has already been done.
  //      - Based on Shopify's Slate theme's variants.js and product.js scripts.
  //----------------------------------------------------------------------------
  function updateModule(event, data) {

    if (!data) {
      if (bDebug) { console.warn("[%s] Aborting updateModule(): No event data present.", sModule); }
      return;
    }

    // Get the set of addtocart elements corresponding to the event's data.
    let $addtocarts = $(selectors.addtocart).filter(function() {
      return data.productid == $(this).attr(attributes.productid);
    });

    if (bDebug) { console.log("[%s] updateModule(): [%s] module(s) found", sModule, $addtocarts.length); }

    // Iterate over the set of matching elements and update them.
    $addtocarts.each(function() {

      // Get references to the appropriate module and forms.
      let $addtocart = $(this);
      let $cartform = $addtocart.find(selectors.cartform);
      let $alertform = $addtocart.find(selectors.alertform);

      // Update the alert form's variant-based fields.
      let $alertoption = $alertform.find(selectors.alertoption).filter(function() { return data.name == $(this).attr(attributes.name); });
      let $alertavailability = $alertform.find(selectors.alertavailability);

      $alertoption.val(data.value);
      $alertavailability.val(data.availability);

      // Update the cart/product form, which submits the selected variant.
      //  - The selected variant is already a part of the broadcast message.
      //  - This is where we take over from Shopify's Slate theme's variants.js
      //    and product.js scripts.
      //  - Setting the value of the <select> element causes any previously
      //    element to be deselected.
      //  - Setting the value using the method below does not cause the dispatch
      //    of the "change" event.  This is by design, since this element
      //    is designed to capture the current state of the optiongroups.
      //    To execute the event, if we ever need, call ".trigger('change')"
      //    after setting the value.
      //  - Verify the variant exists before looking up its variant.id property.
      //      - A variant can be non-existent (i.e. availability="unavailable").
      //      - This happens if combination of product options results in a
      //        variant that is not in inventory (recall: all possible options
      //        are derived from what's loaded, not the other way around).
      //        Unless every possible combination of options is loaded, some
      //        combinations will yield a null product variant, and thus,
      //        variant.id will result in an error.
      let $variantselect = $cartform.find(selectors.variantselect);

      if (data.variant) {
        $variantselect.val(data.variant.id);
      }

      // Update any visuals.
      //  - We currently show/hide the ._submit controls via CSS.  But, if we
      //    wanted to show/hide them via script, we'd do it here, like this:
      //      - Get availability from the event data.
      //          let availability = data.availability;
      //      - Get hooks into the $productcontrols and $alertcontrols.
      //          let $productcontrols = $addtocart.find(selectors.productcontrols);
      //          let $alertcontrols = $addtocart.find(selectors.alertcontrols);
      //      - Toggle visibility of the controls areas.
      //          if (availabilities.instock == availability) {
      //            $productcontrols.removeClass(classes.hide);
      //            $alertcontrols.addClass(classes.hide);
      //          } else {
      //            $productcontrols.addClass(classes.hide);
      //            $alertcontrols.removeClass(classes.hide);
      //          }
    });
  }


  //------------------------------------------------------------------------
  // This function blocks the Alert form submission if the e-mail is invalid.
  //------------------------------------------------------------------------
  function submitAlert(event) {
    // Get the button element.
    let $button = $(this);
    // Find its ancestral Alert Controls container.
    let $alert = $button.closest(selectors.alertcontrols);
    // Get the validity of the input controls.
    let validform = $alert.attr(attributes.validform);
    // Block the form unless it is explicitly valid.
    if ("true" != validform) {
      return false;
    }
  }


  //------------------------------------------------------------------------
  // This function validates the contents of the e-mail input field.
  //------------------------------------------------------------------------
  function validateEmail(event) {

    // Get the input field element and check if its a valid e-mail entry.
    let $email = $(this);
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let validform = regex.test($email.val());

    // Find the parent Alert Controls container and set validity state.
    let $alert = $email.closest(selectors.alertcontrols);
    $alert.attr(attributes.validform, validform);

    if (bDebug) { console.log("[%s] validateEmail(): [%s] -> %s", sModule, event.target.value, validform); }
  }


  //----------------------------------------------------------------------------
  // This function dismisses any response dialogs to an add-to-cart form.
  //----------------------------------------------------------------------------
  function dismissResponse() {
    if (bDebug) { console.log("[%s] dismissResponse()", sModule); }
    $(selectors.response).addClass(classes.hide).children().addClass(classes.hide);
  }


});
