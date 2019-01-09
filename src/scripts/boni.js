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
//------------------------------------------------------------------------------

// TODO: Move these strings to the variables settings file.
// TODO: Match these strings to their counterparts in the .liquid file.
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
(function() {
  console.log("Do something here.");
})();

//------------------------------------------------------------------------------
// TEST FOR SHOWING/HIDING AN ELEMENT ON THE PAGE
//------------------------------------------------------------------------------
(function() {
  $("._js-test-showhide").on("click", function(event) {

    // Hijack the click; ok in a no-js scenario.
    event.preventDefault();

    $("._js-test-showhide-target").toggleClass("_hide");
  });
})();


//------------------------------------------------------------------------------
// Size Chart
//------------------------------------------------------------------------------
$(function() {

  let bDebug = true;

  if (bDebug) {
    console.log("Initialize [_sizeChart]");
  }

  let selectors = {
    sizechart_button: "._js-sizechart-button",
    sizechart_diagram: "._js-sizechart-diagram",
    sizechart_table: "._js-sizechart-table",
    sizechart_table_cells: "._js-sizechart-table > *",

    sizeoption: "._js-option-size",
    sizeoption_selected: "._js-option-size:checked",
  };

  let attributes = {
    sizechart_target: "data-u-sizechart-target",
  };

  let classes = {
    highlight: "_t-highlight",
    hide: "_hide",
  };

  $(selectors.sizechart_button).on("click", function(){
    $(selectors.sizechart_table).toggleClass(classes.hide);
    $(selectors.sizechart_diagram).toggleClass(classes.hide);

    if (bDebug) {
      console.log("[_sizeChart] Showing/Hiding sizechart");
    }
  });

  highlightSizeChartColumn();

  $(selectors.sizeoption).on("change", highlightSizeChartColumn);

  function highlightSizeChartColumn(event) {
    // First, remove any highlight from the table.
    $(selectors.sizechart_table_cells).toggleClass(classes.highlight, false);
    // Next, get the sizechart target from the selected option.
    let target_class = $(selectors.sizeoption_selected).attr(attributes.sizechart_target);
    // Last, highlight the target.
    $(target_class).toggleClass(classes.highlight);

    if (bDebug) {
      console.log("[_sizeChart] Highlighted [" + target_class + "]");
    }
  }

});


//------------------------------------------------------------------------------
// Carousel.
//------------------------------------------------------------------------------
(function() {

  console.log("Initialize [_carousel]");

  var bDebug = false;

  var selectors = {
    viewport: "._js-viewport",
    slides: "._js-slides",
    slide: "._js-slide",
    state: "._js-state",
    current_state: "._js-state:checked",
    target: "data-target",
  };

  //----------------------------------------------------------------------------
  // Update the carousel's current state variable when it is scrolled.
  //----------------------------------------------------------------------------
  $(selectors.viewport).scroll(function(e) {

    var slides_offset = Math.abs($(selectors.slides).position().left);
    var viewport_width = $(selectors.viewport ).outerWidth(true);
    var viewport_center = slides_offset + 1/2 * viewport_width;

    if (bDebug) {
      console.log("VIEWPORT SCROLLED offset=[" + slides_offset + "] width=[" + viewport_width + "] center=[" + viewport_center + "]");
    }

    var closest_distance = $(selectors.slides).outerWidth(true);
    var slide_distance = 0;
    var closest_slide = 0;
    var closest_state_selector = 0;
    $(selectors.slide).each(function(index, element) {
      var slide_offset = $(this).position().left;
      var slide_width = $(this).outerWidth(true);
      var slide_center = slide_offset + 1/2 * slide_width;

      slide_distance = Math.abs(viewport_center - slide_center);

      if (bDebug) {
          console.log("\tSLIDE index=[" + index + "] offset=[" + slide_offset + "] width=[" + slide_width + "] center=[" + slide_center + "] distance=[" + slide_distance + "]");
      }

      if (slide_distance < closest_distance) {
        closest_distance = slide_distance;
        closest_slide = index + 1;
        closest_state_selector = $(this).attr(selectors.target);
      }
    });

    if (bDebug) {
      console.log("\tCLOSEST index=[" + closest_slide + "] distance=[" + closest_distance + "] target=[" + closest_state_selector + "]");
    }

    $(closest_state_selector).prop("checked", true);
  });

  //----------------------------------------
  // Scroll the carousel when the current state variable changes.
  //----------------------------------------
  $(selectors.state).change(function(e) {
    var slide_selector = $(this).attr("data-target");
    var slide_offset = $(slide_selector).position().left;
    $(selectors.viewport).animate({scrollLeft: slide_offset}, 200);

    if (bDebug) {
      console.log("STATE target=[" + slide_selector + "] offset=[" + slide_offset + "]");
    }
  });

})();


//------------------------------------------------------------------------------
// Header drawer actions.
//------------------------------------------------------------------------------
(function() {
  $("._js-menu-button").on("click", function() {
    $("._js-overlay-drawer").toggleClass("_t-slide");
    $("._js-menu-drawer").toggleClass("_t-slide");
    $("._js-cart-drawer").toggleClass("_t-slide", false);
    $("._js-search-drawer").toggleClass("_t-slide", false);
    return false;
  });

  $("._js-search-button").on("click", function() {
    $("._js-overlay-drawer").toggleClass("_t-slide", false);
    $("._js-menu-drawer").toggleClass("_t-slide", false);
    $("._js-cart-drawer").toggleClass("_t-slide", false);
    $("._js-search-drawer").toggleClass("_t-slide");
    return false;
  });

  $("._js-cart-button").on("click", function() {
    $("._js-overlay-drawer").toggleClass("_t-slide", false);
    $("._js-menu-drawer").toggleClass("_t-slide", false);
    $("._js-cart-drawer").toggleClass("_t-slide");
    $("._js-search-drawer").toggleClass("_t-slide", false);
    return false;
  });

  $("._js-overlay-drawer").on("click", function() {
    $("._js-overlay-drawer").toggleClass("_t-slide", false);
    $("._js-menu-drawer").toggleClass("_t-slide", false);
    $("._js-cart-drawer").toggleClass("_t-slide", false);
    $("._js-search-drawer").toggleClass("_t-slide", false);
    return false;
  });

})();


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
// Set up individual select options.
// TODO: Clean it up to use module-specific selectors.
//------------------------------------------------------------------------------
(function() {

  console.log("Initialize: DesignPattern(_selectOptions)");

  var selectors = {
    singleOptionSelector: "[data-single-option-selector]",
    selectedOption: "input:checked + ._option",
    option: "._option",
    optionLabel: "._option-label",
  };

  // Set a listener on changes to our single option selectors.
  $(selectors.singleOptionSelector).on("change", updateSingleOptionSelectorsAvailability);

  // Run the script when loaded, to update options based on default settings.
  updateSingleOptionSelectorsAvailability();

  //--------------------------------------------------------------------------
  // This function updates "[data-single-option-selector] + label" elements
  // to show which options are unavailable given the currently-selected ones.
  // It basically toggles a class attribute (i.e. "._x") on unavailable ones
  // to draw them as unavailabile (e.g. add an "X" across).
  //
  // This functions assumes the following data elements:
  //    input[data-single-option-selector] + label[data-option]
  //    input[data-single-option-selector] + label[data-options-unavailable-for]
  //
  // [data-option] gives the name of the option the label is associated with.
  // this is required.
  //
  // [data-options-unavailable-for] gives the names of the options the given
  // one is unavailable for, in a space-delimited list.  This is optional.
  //----------------------------------------------------------------------------
  // TODOs:
  //  - Update the filter function so it works with labels that are "0".
  //  - Update the code to "cross out" labels to work when 3 options are used.
  //--------------------------------------------------------------------------
  function updateSingleOptionSelectorsAvailability(event) {

    if (event) {
      console.log("\nOption changed.  option.name=[" + event.target.name + "]");
    } else {
      console.log("\nUpdating options based on default settings.");
    }

    // Get out-of-stock and unavailable options from currently-selected ones.
    // Use attr() to get data from data-* attributes.  data() tries to convert
    // the string into a js value, causing issues with options like "0".
    // i.e. Do not use: let options = $(this).data("optionsUnavailableFor");
    let oos_options = [];
    let un_options = [];
    $(selectors.selectedOption).each( function(index) {

      // Get out-of-stock options from the data-* attribute.
      let options = $(this).attr("data-outofstock-for");
      console.log($(this).attr("for") + " data-outofstock-for=[" + options + "]");
      // If out-of-stock exist, extract them, remove blanks, and store them.
      if (undefined != options) {
        oos_options = oos_options.concat(options.split(" ").filter(function(e){ return e; }));
      }

      // Get the unavailable options from the data-* attribute.
      options = $(this).attr("data-unavailable-for");
      console.log($(this).attr("for") + " data-unavailable-for=[" + options + "]");
      // If unavailables exist, extract them, remove blanks, and store them.
      if (undefined != options) {
        un_options = un_options.concat(options.split(" ").filter(function(e){ return e; }));
      }

    });

    // Loop through all options, to cross off out-of-stock and unavailable ones.
    $(selectors.option).each( function(index) {
      // First, reset the option by uncrossing it.
      $(this).find(selectors.optionLabel).toggleClass("_x", false);
      $(this).find(selectors.optionLabel).toggleClass("_xx", false);
      // Last, cross off the option only if it is in one of the sets.
      let option = $(this).data("option");
      if (undefined != option) {
        // Check against the out-of-stock set.
        for (let i = 0; i < oos_options.length; i++) {
          if (option == oos_options[i]) {
            console.log("\tX! data-option=[" + option + "]");
            $(this).find(selectors.optionLabel).toggleClass("_x", true);
          }
        }
        // Check against the unavailable set.
        for (let i = 0; i < un_options.length; i++) {
          if (option == un_options[i]) {
            console.log("\tXX! data-option=[" + option + "]");
            $(this).find(selectors.optionLabel).toggleClass("_xx", true);
          }
        }
      }
    });

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
//      - Second, set up the trigger to request synchronization with option groups.
//        This event will cause all option groups to report their checked options.
//          - Trigger the event only after the listener is set up, since the
//            listener will handle the response.
//          - If there is no associated option group, nothing will be highlighted.
//            That is why no columns should be highlighted by default.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;

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


/* _infochart-button.js --------------------------------------------------------
// Copyright 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - Requires jQuery.
//  - The design assumes every button is initially hidden with ._hide.
//    The initialization routine iterates over all buttons and if a matching
//    infochart is found (via {productid, name}), the button is made visible.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = true;

  if (bDebug) {
    console.log("[_infochart-button] Initializing");
  }

  let selectors = {
    infochart_buttons: "._js-infochart-button",
    infocharts: "._js-infochart",
  };

  let attributes = {
    productid: "data-u-productid",
    name: "data-u-name",
  };

  let classes = {
    hide: "_hide",
  };

  // Abort if no object found.
  if (0 == $(selectors.infochart_buttons).length) {
    if (bDebug) {
      console.log("[_infochart-button] Aborting: No object found");
    }
    return;
  }

  // Iterate over all buttons.  If we find a matching infochart, expose them.
  $(selectors.infochart_buttons).each(function() {
    let $button = $(this);
    let productid = $button.attr(attributes.productid);
    let name = $button.attr(attributes.name);

    if (bDebug) {
      console.log("[_infochart-button]\t\tFound button [%s/%s]", productid, name);
    }
    // Iterate over the set of infocharts, looking for a match to expose.
    $(selectors.infocharts).each(function() {
      let $infochart = $(this);
      if (
        productid == $infochart.attr(attributes.productid) &&
        name == $infochart.attr(attributes.name)
      ) {
        $button.toggleClass(classes.hide, false);

        if (bDebug) {
          console.log("[_infochart-button]\t\tExposed button [%s/%s]", productid, name);
        }
      }
    });
  });

  // Set listeners on clicks to the infochart buttons.
  $(selectors.infochart_buttons).on("click", function() {
    let $button = $(this);
    let productid = $button.attr(attributes.productid);
    let name = $button.attr(attributes.name);

    if (bDebug) {
      console.log("[_infochart-button] Clicked button with productid/name=[%s/%s]", productid, name);
    }

    // Iterate over the set of infocharts, looking for a match.
    $(selectors.infocharts).each(function() {
      let $infochart = $(this);
      if (
        productid == $infochart.attr(attributes.productid) &&
        name == $infochart.attr(attributes.name)
      ) {
        $infochart.toggleClass(classes.hide);

        if (bDebug) {
          console.log("[_infochart-button]\tToggled infochart productid/name=[%s/%s]", productid, name);
        }
      }
    });
  });
});


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
      var _debugid = "[_optiongroup] broadcastOptionGroupInfo()";
      console.log(_debugid);
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

// TODO: THIS IS NOT WORKING!
      $form_instockalert_option.val(option_value);
      $form_instockalert_availability.val(availability);
console.log("Option + Availability");
console.log($form_instockalert.attr(""))
console.log($form_instockalert_option.val());
console.log($form_instockalert_availability.val());

      if (availabilities.instock == availability) {
// CASE: The following line must use appropriate currency routines.
//  WHEN "in Shopify"
        $price.html(slate.Currency.formatMoney(p, theme.moneyFormat));
//  WHEN "NOT in Shopify"
//        $price.html("$" + p);
// /CASE
        $price.removeClass(classes.quiet);
        if (p < c) {
// CASE: The following line must use appropriate currency routines.
//  WHEN "in Shopify"
          $compare.html(slate.Currency.formatMoney(c, theme.moneyFormat));
//  WHEN "NOT in Shopify"
//          $compare.html("$" + c);
// /CASE
        } else {
          $compare.empty();
        }
        $message.html("&check; In stock");
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
//        $price.html("$" + p);
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
