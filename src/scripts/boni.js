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
//  -
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
      console.log("COLOR CHANGE!  FILTER OUT IMAGES\n");
      var turn_off = "[data-gallery-id]:not([data-gallery-id=" + event.target.value.toLowerCase() + "])";
      var turn_on = "[data-gallery-id=" + event.target.value.toLowerCase() + "]";
      console.log("TURN OFF: " + turn_off);
      console.log("TURN ON: " + turn_on);
      console.log("");
      $(turn_off).toggleClass("_hide", true);
      $(turn_on).toggleClass("_hide", false);
//      $("li [data-color=c" + event.target.value + "])").css("background-color", "blue");
//      $("li [data-color] :not([data-color=c" + event.target.value + "])").css("background-color", "blue");
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

// This is to figure out why the gallery viewer is causing a submit.
//  $("[data-add-to-cart]").on("submit", function(event) {
//    event.preventDefault();
//    console.log("Submitted!  Default suppressed.");
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

    // Open the gallery viewer with the right URL params (i.e. "#&pid=1&gid=3").
    var p = getHashParams();
    if (p.pid && p.gid) {
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

  // TODO: Rename this to initializeGalleryViewer().
  boniPhotos("._gallery");


// TODO: It should be this easy to launch the gallery viewer.  Make this work.
//  $("#_btn").on("click", function(event) {
//    boniPhotos.openGalleryViewer(0, 0);
//  });

})();
