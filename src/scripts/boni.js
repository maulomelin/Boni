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
  $("[XXXdata-single-option-selector]").on("change", function(event) {
    console.log("EVENT:");
    console.log("\tselector=[data-single-option-selector]");
    console.log("\tevent.type=[" + event.type + "]");
    console.log("\tevent.target=[" + event.target + "]");
    console.log("\tevent.target.tagName=[" + event.target.tagName + "]");
    console.log("\tevent.target.className=[" + event.target.className + "]");
    console.log("\tevent.target.name=[" + event.target.name + "]");
    console.log("\tevent.target.value=[" + event.target.value + "]");
    console.log("");
    if("color" == event.target.name) {
      console.log("COLOR CHANGE!  FILTER OUT IMAGES\n");
      var turn_off = "[data-color]:not([data-color=" + event.target.value + "])";
      var turn_on = "[data-color=" + event.target.value + "]";
      console.log("TURN OFF: " + turn_off);
      console.log("TURN ON: " + turn_on);
      console.log("");
      $(turn_off).css("outline", "");
      $(turn_on).css("outline", "solid 2px black");
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
if(false) {
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

    // Iterate through all galleries; tag them and bind events to each.
    $(gallerySelector).each(function(index) {
      $(this).attr("data-pswp-uid", $(this).attr("data-gallery-id")); // VERIFY WE DON'T NEED THIS IF WE USE data-gallery-id
      $(this).on("click", onThumbnailClick);
    });

    // Get URL params that can launch the gallery viewer (i.e. "#&pid=1&gid=3")
    // and open the viewer automatically.
    var p = getHashParams();
    if(p.pid && p.gid) {
console.log("launch from the URL");
      openGalleryViewer(p.gid, p.pid);
    }

    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    function onThumbnailClick(event) {

console.log("onThumbnailClick()");

      // Prevent click from launching the large image; ok in a no-js scenario.
      event.preventDefault();

      // Extract the galleryID and pictureID from the clicked element.
      var galleryID = $(event.target).data("gallery-id");
      var pictureID = $(event.target).data("picture-id");

console.log("\tgalleryID/pictureID=[" + galleryID + "/" + pictureID + "]");

      openGalleryViewer(galleryID, pictureID);
    }

    //--------------------------------------------------------------------------
    // This function initializes the gallery viewer for the given gallery and
    // launches it.
    //
    // @param {string} gID - XXX.
    // @param {string} pID - XXX.
    //----------------------------------------------------------------------------
    // TODOs:
    //  - Memoize each slides object that is created.
    //--------------------------------------------------------------------------
    function openGalleryViewer(gID, pID) {

console.log("openGalleryViewer()");

      // Validate the gID as a gallery ID and get its corresponding DOM element.
      var galleryID;
      var galleryElement;

      $(gallerySelector).each(function() {
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

console.log("\tgallerySelector=[" + gallerySelector + "]");
console.log("\tgalleryID=[" + galleryID + "]");
console.log("\tgalleryElement=[" + $(galleryElement) + "]");
console.log("\t_test div=[" + document.getElementById("_test") + "]");

      // Parse the selected gallery and generate the slides object for it.
      var slides = parseGalleryThumbnails(galleryElement);

      // Define any options needed.
      var options = defineOptions(galleryID);

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

console.log("parseGalleryThumbnails");

      var thumbnailElements = galleryElement.childNodes;
//console.log("galleryElement.childNodes.length=[" + galleryElement.childNodes.length + "]");

//      for (var i = 0; i < galleryElement.childNodes.length, i++) {

//      }


      var slides = [
        { src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg', w: 964, h: 1024 },
        { src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg', w: 1024, h: 683 },
        { src: "https://farm3.staticflickr.com/2567/5697107145_a4c2eaa0cd_o.jpg", w: 1024, h: 1024 },
        { src: "https://farm6.staticflickr.com/5023/5578283926_822e5e5791_b.jpg", w: 1024, h: 768 },
      ];

      return slides;
    }

    //--------------------------------------------------------------------------
    // This function defines default gallery viewer options.
    // See http://photoswipe.com/documentation/options.html
    // Specific overrides or settings should be made right before the gallery
    // viewer is launched.
    //--------------------------------------------------------------------------
    function defineOptions(galleryID) {
      var options = {
        galleryUID: galleryID,
        history: false,
        focus: false,
        showAnimationDuration: 0,
        hideAnimationDuration: 0,

        /* Options reference (http://photoswipe.com/documentation/options.html):
        index: , // [{integer} index[ = 0 ]]
        getThumbBoundsFn: , // [ {function} getThumbBoundsFn({integer})[ = {see docs} ]]
        showHideOpacity: , // [ {boolean} showHideOpacity[ = false ]]
        showAnimationDuration: , // [ {integer} showAnimationDuration[ = 333 ]]
        hideAnimationDuration: , // [ {integer} hideAnimationDuration[ = 333 ]]
        bgOpacity: , // [ {number} bgOpacity[ = 1 ]]
        spacing: , // [ {number} spacing[ = 0.12 ]]
        allowPanToNext: , // [ {boolean} allowPanToNext[ = true ]]
        maxSpreadZoom: , // [ {number} maxSpreadZoom[ = 2 ]]
        getDoubleTapZoom: , // [ {function} getDoubleTapZoom({boolean}, {object})[ = {see docs} ]]
        loop: , // [ {boolean} loop[ = true ]]
        pinchToClose: , // [ {boolean} pinchToClose[ = true ]]
        closeOnScroll: , // [ {boolean} closeOnScroll[ = true ]]
        closeOnVerticalDrag: , // [ {boolean} closeOnVerticalDrag[ = true ]]
        mouseUsed: , // [ {boolean} x[ = false ]]
        escKey: , // [ {boolean} escKey[ = true ]]
        arrowKeys: , // [ {boolean} arrowsKeys[ = true ]]
        history: , // [ {boolean} history[ = true ]]
        galleryUID: , // [ {integer} galleryUID[ = 1 ]]
        galleryPIDs: , // [ {boolean} galleryPIDs[ = false ]]
        errorMsg: , // [ {string} errorMsg[ = {see docs} ]]
        preload: , // [ {array} preload[ = [1,1] ]]
        mainClass: , // [ {string} mainClass[ = {see docs} ]]
        getNumItemsFn: , // [ {function} getNumItemsFn({see docs})[ = {see docs} ]]
        focus: , // [ {boolean} focus[ = true ]]
        isClickableElement: , // [ {function} isClickableElement({element})[ = {see docs} ]]
        modal: , // [ {boolean} modal[ = true ]]
        *****/
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
      console.log("hash parameters = [" + JSON.stringify(hashParams) + "]");

      return hashParams;
    }
  };

  // TODO: Rename this to initializeGalleryViewer().
  boniPhotos("._gallery");


// This is how easy it is to launch the gallery viewer
// VERIFY THAT THIS WORKS!  THIS SHOULD WORK...
//  $("#_btn").on("click", openGalleryViewer(0, 0));

})();
