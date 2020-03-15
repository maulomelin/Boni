/* _carousel.js ----------------------------------------------------------------
// Copyright 2018 maulomelin@gmail.com.  Released under the MIT license.
//------------------------------------------------------------------------------
// Notes:
//  - The distance calculations do not take padding into account.
//  - Requires jQuery.
//------------------------------------------------------------------------------
// TODOs:
//  - Make the carousel more robust.  Abrupt changes in window size can still
//    cause jumps between images, changing state and scrolling position.
//    Figure out how to set state separately from transitioning to a new state.
//  - Consider taking padding into account with the distance calculation.
//    Given we've only used padding for debugging, this is a wish-list feature.
//  - Look at design guidelines for JS hooks to follow: ._js-carousel[-<item>]
//----------------------------------------------------------------------------*/

$(function() {

  var bDebug = true;

  if (bDebug) {
    console.log("[_carousel] Initializing");
  }

  var selectors = {
    carousel: "._js-carousel",
    viewport: "._js-viewport",
    slides: "._js-slides",
    slide: "._js-slide",
    state: "._js-state",
    current_state: "._js-state:checked",
  };

  var attributes = {
    targetid: "data-u-target-id",
  };

  // Abort if no object found.
  if (!$(selectors.carousel).length) {
    if (bDebug) {
      console.log("[_carousel] Aborting: No object found");
    }
    return;
  }

  // Initialize settings.
  initializeScrollPosition();

  // Set up event handlers.
  $(selectors.state).on("change", updateScrollPosition);
  $(selectors.viewport).on("scroll", updateStateVariable);
  $(window).on("resize", initializeScrollPosition);


  //----------------------------------------------------------------------------
  // This function centers the currently-selected slide in the viewport.
  //----------------------------------------------------------------------------
  function initializeScrollPosition() {

    if (bDebug) {
      console.log("[_carousel] initializeScrollPosition()");
    }

    let current_state = $(selectors.current_state);
    let current_slide = $(current_state).attr(attributes.targetid);
    let slide_offset = $(current_slide).position().left;

    $(selectors.viewport).css("scroll-behavior", "auto");
    $(selectors.viewport).scrollLeft(slide_offset);
    $(selectors.viewport).css("scroll-behavior", "smooth");

    if (bDebug) {
      console.log("[_carousel]\t\ttarget=[%s] @ offset=[%d]", current_slide, slide_offset);
    }
  }


  //----------------------------------------------------------------------------
  // This function scrolls the carousel when the state variable changes.
  //  - The state variables are set up as radio buttons.
  //  - It scrolls the carousel to the slide associated with the new state.
  //  - The carousel can loop past the last slide to the first (and vice-versa)
  //    by moving across all the slides in the appropriate direction.
  //  - "change()" and "click()" seem to work the same on a radio button.
  //----------------------------------------------------------------------------
  function updateScrollPosition() {

    if (bDebug) {
      console.log("[_carousel] updateScrollPosition()");
    }

    let slide_selector = $(this).attr(attributes.targetid);
    let slide_offset = $(slide_selector).position().left;

    $(selectors.viewport).scrollLeft(slide_offset);

    if (bDebug) {
      console.log("[_carousel]\t\tscroll to id=[%s] @ offset=[%d]", slide_selector, slide_offset);
    }

  }


  //----------------------------------------------------------------------------
  // This function updates the state variable when the carousel is scrolled.
  //  - When the slides are scrolled:
  //      - Calculate the center of the viewport.
  //      - Calculate the center of each slide and compare it to the viewport's.
  //      - Select the closest slide and its associated state selector.
  //      - Update the state variable of the closest slide to be current one.
  //  - We could have optimized the function by calculating the slide centers
  //    once and only compared when the viewport center moves (using the slides
  //    as frame of reference).  We did not, opting instead for simplicity.
  //----------------------------------------------------------------------------
  // TODOs:
  //  - Update the distance calculations to take any padding into account.
  //----------------------------------------------------------------------------
  function updateStateVariable() {

    if (bDebug) {
      console.log("[_carousel] updateStateVariable()");
    }

    // Calculate the center of the viewport.
    let slides_offset = Math.abs($(selectors.slides).position().left);
    let viewport_width = $(selectors.viewport).outerWidth(true);
    let viewport_center = slides_offset + 1/2 * viewport_width;

    if (bDebug) {
      console.log("[_carousel]\t\tviewport scrolled offset=[%d] width=[%d] center=[%d]", slides_offset, viewport_width, viewport_center);
    }

    // Calculate the center of each slide, and compare it to the viewport's.
    let closest_distance = $(selectors.slides).outerWidth(true); // Big-M.
    let slide_distance = 0;
    let closest_slide = 0;
    let closest_state_selector = 0;
    $(selectors.slide).each(function(index, element) {

      // Calculate the center of each slide.
      let slide_offset = $(this).position().left;
      let slide_width = $(this).outerWidth(true);
      let slide_center = slide_offset + 1/2 * slide_width;

      // Compare the center of the slide to the center of the viewport.
      slide_distance = Math.abs(viewport_center - slide_center);

      if (bDebug) {
        console.log("[_carousel]\t\tslide#[%d]: offset=[%d] width=[%d] center=[%d] distance=[%d]", index+1, slide_offset, slide_width, slide_center, slide_distance);
      }

      // If it's the closest slide we've seen, record it.
      if (slide_distance < closest_distance) {
        closest_distance = slide_distance;
        closest_slide = index + 1;
        closest_state_selector = $(this).attr(attributes.targetid);
      }
    });

    // Check the state variable corresponding to the closest slide.
    $(closest_state_selector).prop("checked", true);

    if (bDebug) {
      console.log("[_carousel]\t\tclosest slide=[%d] state=[%s] distance=[%d]", closest_slide, closest_state_selector, closest_distance);
    }

  }

});
