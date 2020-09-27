window.slate = window.slate || {};
window.theme = window.theme || {};
window.boni = window.boni || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/cart.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js

/*================ Sections ================*/
// =require sections/product.js
// =require sections/header.js
// =require sections/cart.js
// =require sections/_XXX.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js

/*===== Boni ================================*/
/*----- Layouts -----------------------------*/
// =require boni/_g-cartpage.js
// =require boni/_g-productpage.js
/*----- Modules -----------------------------*/
// =require boni/_m-addtocart.js
// =require boni/_m-carousel.js
// =require boni/_m-categories.js
// =require boni/_m-details.js
// =require boni/_m-header.js
// =require boni/_m-optiongroup.js
// =require boni/_m-sizechart.js
// =require boni/_m-variantpricing.js
// =require boni/_m-collection.js
// =require boni/_m-supportmenu.js
// =require boni/_m-contactus.js
/*----- ToDo:InProgress ---------------------*/
/*----- ToDo:Pending ------------------------*/
/*----- ToDo:Deprecate ----------------------*/
// =require boni.js
// =require boni/_infochart.js
// =require boni/_infochart-button.js
/*----- /ToDo -------------------------------*/

$(document).ready(function() {
  var sections = new slate.Sections();
/*****
  If we choose to, these each need a file in \src\scripts\sections
  However, registering a section looks for elements with the attribute
  [data-section-type], which the theme tag "section" does not generate.
  So...it seems pointless to use, unless we manually add those extra divs.
/*****/
/*****
  sections.register("collection", theme.Collection);
  sections.register("footer", boni.Footer);
/*****/
  sections.register("product", theme.Product);
  sections.register("header", boni.Header);
  sections.register("cart", boni.Cart);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
});
