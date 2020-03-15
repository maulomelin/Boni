//------------------------------------------------------------------------------
// Boni theme script (\src\scripts\boni.js).
//------------------------------------------------------------------------------
// The purpose of this file is to define global javascript functionality,
// and for testing new modules.
//
// We recommend adding javascript here, instead of random <script>...</script>
// tags throughout the code, as jQuery may not be loaded when those Sections
// are executed.  It also keeps it nice and tidy here until we decide where
// to organize it.
//
// Javascript written in this file exists outside Shopify's Section framework.
//
// This file is included in the theme via a "require" statement in theme.js.
// We can, alternatively, add it in theme.liquid like it is done for vendor.js.
//------------------------------------------------------------------------------
// TODOs:
//  - Move the window.boni.strings to the variables settings file, to entries
//    such as the ones shown below in the comments.  Add a note there that the
//    strings must match their equivalents in the .liquid file.
//  - Clean up header.js and decide whether to keep the drawer-based functions
//    there or here.
//  - Items still on this file that need cleanup:
//      1) Global strings
//      2) Image Viewer (PhotoSwipe)
//      3) Pricing
//      4) Spinner
//      5) E-mail notification
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Global strings.
//------------------------------------------------------------------------------
// TODOs:
//  - Move these strings to the variables settings file.
//  - Match these strings to their counterparts in the .liquid file.
//------------------------------------------------------------------------------
window.boni.strings = {
  availableStatusPhrase: "This item is available.", // {{ 'products.product.add_to_cart' | t | json }},
  outOfStockStatusPhrase: "This item is currently out of stock.",
  soldOutStatusPhrase: "This item is sold out.", // {{ 'products.product.sold_out' | t | json }},
  unavailableStatusPhrase: "This item is unavailable.", // {{ 'products.product.unavailable' | t | json }}
  availableStatus: "Available",
  outOfStockStatus: "Out Of Stock",
  soldOutStatus: "Sold Out",
  unavailableStatus: "Unavailable"
};


//------------------------------------------------------------------------------
// TEMPLATE TO DO SOMETHING SPECIFIC
//------------------------------------------------------------------------------
(function() { console.log("Do something here."); })();
$(function() { console.log("Do something here."); });


//------------------------------------------------------------------------------
// E-mail notification on items not available.
//------------------------------------------------------------------------------
(function() {

  $("#notify-me").click(function() {
    $("#notify-me-wrapper").fadeIn();
    return false;
  });

})();


//------------------------------------------------------------------------------
// Set up any spinner controls.
//------------------------------------------------------------------------------
(function() {

  // Set a listener to the plus/minus buttons of any spinner control.
  $("._js-spinner ._js-button").on("click", onSpinnerButtonClick);

  //--------------------------------------------------------------------------
  //  - This function executes on a click to a spinner's plus/minus button.
  //    It updates the value of a hidden <input> field, and it updates the
  //    label of the widget to reflect the updated value.
  //  - Strictly speaking, the label does not need to be updated if the button
  //    submits the form after the function executes.
  //  - Because the function is hooked to the button, and not some parent node,
  //    we can use $(this), instead of $(event.target).
  //--------------------------------------------------------------------------
  function onSpinnerButtonClick() {

    console.log("onSpinnerButtonClick()");

    let $spinner = $(this).closest("._js-spinner");
    let $input = $spinner.find("._js-input");
    let $label = $spinner.find("._js-label");

    let action = $(this).attr("data-action");
    let n = parseInt($input.val());

    console.log("\tCurrent n=[" + n + "]");

    if ("decrement" == action) { n--; }
    if ("increment" == action) { n++; }

    console.log("\tNew n=[" + n + "]");

    $input.val(n);
    $label.html("&times;&nbsp;" + n);
  }

})();


//------------------------------------------------------------------------------
// Set up the image viewer.
//------------------------------------------------------------------------------
(function() {

  // Figuring out events.
  $("[data-single-option-selector]").on("change", function(event) {
    console.log("EVENT:");
    console.log("\tselector=[data-single-option-selector]");
    console.log("\tevent.type=[" + event.type + "]");
    console.log("\tevent.target=[" + event.target + "]");
    console.log("\tevent.target.tagName=[" + event.target.tagName + "]");
    console.log("\tevent.target.className=[" + event.target.className + "]");
    console.log("\tevent.target.name=[" + event.target.name + "]");
    console.log("\tevent.target.value=[" + event.target.value + "]");
    console.log("\tevent.target.name.toLowerCase()=[" + event.target.name.toLowerCase() + "]");
    console.log("");

    if ("color" == event.target.name.toLowerCase()) {
      console.log("COLOR CHANGE!  CHANGE IMAGES\n");
      var turn_off = "[data-gallery-id]:not([data-gallery-id=" + event.target.value.toLowerCase() + "])";
      var turn_on = "[data-gallery-id=" + event.target.value.toLowerCase() + "]";
      console.log("TURN OFF: " + turn_off);
      console.log("TURN ON: " + turn_on);
      console.log("");
      $(turn_off).toggleClass("_hide", true);
      $(turn_on).toggleClass("_hide", false);
//      $("li [data-color=c" + event.target.value + "])").css("background-color", "blue");
//      $("li [data-color] :not([data-color=c" + event.target.value + "])").css("background-color", "blue");

      console.log("COLOR CHANGE!  CHANGE LABEL\n");
      $("._js-options-color-label").html("COLOR: " + event.target.value);
    }

    if ("size" == event.target.name.toLowerCase()) {
      console.log("SIZE CHANGE!  CHANGE LABEL\n");
      $("._js-options-size-label").html("SIZE: " + event.target.value);
    }

// TODO: Make sure this is ok.
    if ("unknown" == event.target.name.toLowerCase()) {
      console.log("UNKNOWN CHANGE!  CHANGE LABEL\n");
      $("._js-options-unknown-label").html("UNKNOWN: " + event.target.value);
    }

  });

  $("[XXXdata-section-id]").on("variantChange", function(event) {
    console.log("EVENT:");
    console.log("\tselector=[data-section-id]");
    console.log("\tevent.type=[" + event.type + "]");
    console.log("\tevent.target=[" + event.target + "]");
    console.log("\tevent.target.tagName=[" + event.target.tagName + "]");
    console.log("\tevent.target.className=[" + event.target.className + "]");
    if (!event.variant) {
      console.log("\tno event variant");
    } else {
      console.log("\tevent.variant.id=[" + event.variant.id + "]");
    }
    console.log("");
  });

  // This is a global event handler. (tag where event took place) --> (ancestor tags) --> <body> --> <html> --> document --> window
  if (false) {
    $(window).on("change", function(event) {
      console.log("window registered a change event");
    });
  }


  // TODO: Rename this to initializeGalleryViewer().
  boniPhotos("._js-gallery");


// TODO: It should be this easy to launch the gallery viewer.  Make this work.
//  $("#_btn").on("click", function(event) {
//    boniPhotos.openGalleryViewer(0, 0);
//  });

  //----------------------------------------------------------------------------
  // This function sets up a gallery image viewer with gesture support.
  // It sets up the click event handlers on gallery images to launch it.
  // It launches the viewer automatically if directed via URL parameters.
  //
  // @param {string} gallerySelector - Selector for image galleries on the page.
  //----------------------------------------------------------------------------
  // TODOs:
  //  - Create a boni namespace: window.boni = window.boni || {};
  //    and boniPhotos a method of it:  boni.Photos = function(gallerySelector) { ... };
  //  - Turn this into an object and expose a few methods for debugging.
  //  - Rename this to something more appropriate to what it does, like initializeGalleryViewer()
  //----------------------------------------------------------------------------
  function boniPhotos(gallerySelector) {

    console.log("boniPhotos()");

    // Bind a click handler to each gallery, to listen for clicks on thumbnails.
    $(gallerySelector).each( function(index) {
      $(this).on("click", onThumbnailClick);
    });

    // Open the gallery viewer if hash params present (i.e. "#&pid=1&gid=3").
    var p = getHashParams();

console.log("p.gID & p.pID:");
console.log(p.gID);
console.log(p.pID);

    if (p.gID && p.pID) {
      openGalleryViewer(p.gid, p.pid);
    }

    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    function onThumbnailClick(event) {

      // Hijack the click; ok in a no-js scenario.
      event.preventDefault();

      // Extract the gallery ID and picture ID from the clicked element.
      var gID = $(event.target).data("gallery-id");
      var pID = $(event.target).data("picture-id");

      // Open the gallery viewer if IDs are present (i.e. click on a thumbnail).
// BUG: DOESN'T WORK WITH THE FIRST SLIDE, IF IT'S A 0-BASED INDEX.
      if (gID && pID) {
        openGalleryViewer(gID, pID);
      } else {
        return false;
      }
    }

    //--------------------------------------------------------------------------
    // This function initializes the gallery viewer and launches it.
    //
    // @param {string} gID - Gallery ID to show.
    // @param {string} pID - Picture ID to show.
    //----------------------------------------------------------------------------
    // TODOs:
    //  - Memoize each slides object that is created.
    //--------------------------------------------------------------------------
    function openGalleryViewer(gID, pID) {

      var galleryID;
      var galleryElement;

      // Validate the gID (match against a [data-gallery-id]).
      $(gallerySelector).each( function() {
        if (gID == $(this).data("gallery-id")) {
          // If gID matches a [data-gallery-id] on the page, grab its DOM node.
          galleryID = gID;
          galleryElement = this;
          return false;
        }
      });

      if (!galleryElement) {
        // If gID did not match a [data-gallery-id], grab the first one.
        galleryID = 0;
        galleryElement = $(gallerySelector)[0];
      }

      // Validate the pID (no validation for now).
      var pictureID = pID;

      // Parse the selected gallery and generate the slides object for it.
      var slides = parseGalleryThumbnails(galleryElement);

      // Define any options needed.
      var options = defineOptions(galleryID, pictureID);

      // Target the photoswipe root element on the page.
      var pswpElement = $(".pswp")[0];

      // Launch the gallery viewer.
      var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
      gallery.init();
    }

    //--------------------------------------------------------------------------
    // This function parses the image gallery and generates the slides object
    // the viewer needs to render images.
    //--------------------------------------------------------------------------
    function parseGalleryThumbnails(galleryElement) {

console.log("parseGalleryThumbnails()");

      var slides = [];
      var slide = {};
      var pic_url, pic_w, pic_h;

      $(galleryElement).children("._thumbnail").each( function(index, element) {
        if (pic_url = $(this).data("item-pic-url")) {
          pic_w = $(this).data("item-pic-width");
          pic_h = $(this).data("item-pic-height");

          slide = { src: pic_url, w: pic_w, h: pic_h };

          slides.push(slide);
        }
      });

      return slides;
    }

    //--------------------------------------------------------------------------
    // This function defines default gallery viewer options.
    // See http://photoswipe.com/documentation/options.html
    //--------------------------------------------------------------------------
    function defineOptions(galleryID, pictureID) {

      var options = {
        galleryUID: galleryID,
        index: pictureID,
        focus: false,
        showAnimationDuration: 0,
        hideAnimationDuration: 0,
      };

      return options;
    }

    //--------------------------------------------------------------------------
    // Parse hash params that launch the gallery viewer (i.e. "#&pid=1&gid=3").
    //--------------------------------------------------------------------------
    function getHashParams() {

      var hashParams = {};

      location.hash.slice(1).split("&").map(kvpair => {
        let kvarray = kvpair.split("=");
        hashParams[kvarray[0]] = kvarray[1];
      });

      return hashParams;
    }
  };

})();


/* _pricing.js -----------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - Some code below must be updated to use appropriate currency routines.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;

  if (bDebug) {
    console.log("[_pricing] Initializing");
  }

  let selectors = {
    pricing: "._js-pricing",
    price: "._js-price",
    compare: "._js-compare",
  };

  let attributes = {
    productid: "data-u-productid",
  };

  let classes = {
    hide: "_hide",
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

  // Set up event handlers.
  $(document).on(event_types.optiongroup_info, updatePricing);

  // Trigger the option group info broadcast message.
  $(selectors.pricing).trigger(event_types.syn_optiongroup_info);


  //----------------------------------------------------------------------------
  // This function updates the pricing elements on an option group update event.
  // NOTE: Code below must be updated to use appropriate currency routines.
  //----------------------------------------------------------------------------
  function updatePricing(event, data) {

    if (bDebug) {
      console.log("[_pricing] updatePricing()");
      console.debug("[_pricing]\t\tevent=[%o] data=[%o]", event, data);
    }

    if (!data) { return; }

    // Get the set of pricing elements corresponding to the event's data.
    let $pricings = $(selectors.pricing).filter(function() {
      return data.productid == $(this).attr(attributes.productid);
    });
    // Iterate over the set of matching pricing elements and update them.
    $pricings.each(function() {
      let $pricing = $(this);
      let $price = $pricing.find(selectors.price);
      let $compare = $pricing.find(selectors.compare);

      // Get data we are interested in from the event message.
      let availability = data.availability;
// TODO: The following lines must use appropriate currency routines.
      let p = parseInt(data.price);
      let c = parseInt(data.compare_at_price) ||  0;
// /TODO

      if (bDebug) {
        console.log("[_pricing]\t\tavailability/price/compare=[%s/%d/%d]", availability, p, c);
      }

      // Implement pricing logic.
      if (availabilities.instock == availability) {
// TODO: The following line must use appropriate currency routines.
        $price.html("$" + p).removeClass(classes.quiet); // NOTE: This line must use appropriate currency routines.
// /TODO
        if (p < c) {
// TODO: The following line must use appropriate currency routines.
          $compare.html("$" + c);
// /TODO
        } else {
          $compare.empty();
        }
      } else if (availabilities.soldout == availability || availabilities.outofstock == availability) {
        $price.html("$" + p).addClass(classes.quiet); // NOTE: This line must be updated to use the appropriate currency routines.
        $compare.empty();
      } else {
        $price.empty();
        $compare.empty();
      }

    });

  }

});
