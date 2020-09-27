/* _m-contactus.js -------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;
  let sModule = "_m-contactus";

  if (bDebug) { console.log("[%s] Initializing", sModule); }

  let selectors = {
    contactus: "._js-contactus",
    email: "._js-contactus-email",
    message: "._js-contactus-message",
    submitbutton: "._js-contactus-submitbutton",
    formcontrols: "._js-contactus-formcontrols",
    input: "._js-contactus-input",
    inputcontrol: "._js-contactus-inputcontrol",
    response: "._js-contactus-response",
  };

  let attributes = {
    valid: "data-u-valid",
  };

  let classes = {
    hide: "_hide",
  };

  if (bDebug) { console.log("[%s] [%d] modules found.", sModule, $(selectors.contactus).length); }

  // Set up all event handlers.
  $(selectors.submitbutton).on("click", submitForm);
  $(selectors.response).on("click", dismissResponse);
  $(selectors.email).on("input", validateEmail);
  $(selectors.email).on("blur", validateEmail);
  $(selectors.message).on("input", validateMessage);
  $(selectors.message).on("blur", validateMessage);


  //------------------------------------------------------------------------
  // This function blocks the form submission if the e-mail is invalid.
  //------------------------------------------------------------------------
  function submitForm(event) {
/*
    // Get the set of input controls.
    let $inputcontrols = $(selectors.inputcontrol);

    // Iterate over the set of input controls, force validation on each,
    // in case the user has not interacted with any.
    $inputcontrols.each(function() {
      let $inputcontrol = $(this);

      // Call a function on an element.
      // This sets a validity flag on the closest ancestor to the control.
      $inputcontrol.blur();
    });
*/

    // Iterate over the set of inputs, and check if they're all valid.
    let $inputs = $(selectors.input);
    let validform = true;
    $inputs.each(function() {
      let $input = $(this);
      console.log("[%s]", $input.attr(attributes.valid));
      if (!$input.attr(attributes.valid)) {
        validform = false;
      }
    });

    // Block the form unless all input controls are valid.
    // Note: Unlike the [_m-addtocart] script, we are checking for the
    // boolean value resulting from checking all attributes, which is a
    // boolean value of {true, false}, which is different than the actual
    // attribute string {"true", "false"}.
    if (true != validform) {
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
    let valid = regex.test($email.val());

    // Set validity state of this input control on its closest ancestor.
    let $input = $email.closest(selectors.input);
    $input.attr(attributes.valid, valid);

    if (bDebug) { console.log("[%s] validateEmail(): [%s] -> %s", sModule, event.target.value, valid); }
  }


  //------------------------------------------------------------------------
  // This function validates the contents of the message input field.
  //------------------------------------------------------------------------
  function validateMessage(event) {

    // Get the input field element and check if its a valid e-mail entry.
    let $message = $(this);
    let valid = ($.trim($message.val())) ? true : false;

    // Set validity state of this input control on its closest ancestor.
    let $input = $message.closest(selectors.input);
    $input.attr(attributes.valid, valid);

    if (bDebug) { console.log("[%s] validateMessage(): [%s] -> %s", sModule, event.target.value, valid); }
  }


  //----------------------------------------------------------------------------
  // This function dismisses any response dialogs to an add-to-cart form.
  //----------------------------------------------------------------------------
  function dismissResponse() {
    if (bDebug) { console.log("[%s] dismissResponse()", sModule); }
    $(selectors.response).addClass(classes.hide).children().addClass(classes.hide);
  }


});
