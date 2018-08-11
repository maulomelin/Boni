/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    statusPhrase: '._js-status-phrase',

    addToCartButton: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',

    pricingWrapper: '[data-pricing-wrapper]',
    priceWrapper: '[data-price-wrapper]',
    productPrice: '[data-product-price]',
    compareWrapper: '[data-compare-wrapper]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',

    originalSelectorId: '[data-product-select]',
    singleOptionSelector: '[data-single-option-selector]',

    productFeaturedImage: '[data-product-featured-image]',
    productThumbs: '[data-product-single-thumbnail]',

    productJson: '[data-product-json]'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag
    // when loading section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';
    this.variants = new slate.Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

    if (this.$featuredImage.length > 0) {
      this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
      slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      console.log("updateAddToCartState:()"); /*dbg*/
      console.log("\tvariant="); /*dbg*/
      console.log(variant); /*dbg*/

// TODO: Break up selectors.priceWrapper into distinct "price" and "comparison" elements.
// TODO: Remove compare text.
// TODO: Update "contact[title]", even with unavailable variants.
// TODO: Dismiss success and error messages.  See Bootstrap.

      if (variant) {
        if (0 < variant.inventory_quantity) {
          console.log("\tvariant is AVAILABLE (0 < inventory_quantity)"); /*dbg*/
          $(selectors.addToCartText, this.$container).html(boni.strings.availableStatus); //.html(theme.strings.addToCart);
          $(selectors.addToCartButton, this.$container).prop('disabled', false);
          $(selectors.pricingWrapper, this.$container).removeClass("_hide");
          $(selectors.compareWrapper, this.$container).removeClass("_hide");
          $(selectors.statusPhrase, this.$container).html(boni.strings.availableStatusPhrase);
          $("._js-form").addClass("_hide");
          $("._js-f-waitlist-status-input").prop("value", boni.strings.availableStatus);
        } else {
          if ("continue" == variant.inventory_policy) {
            console.log("\tvariant is OUT OF STOCK (continue == inventory_policy)"); /*dbg*/
            $(selectors.addToCartText, this.$container).html(boni.strings.outOfStockStatus); //.html(theme.strings.soldOut);
            $(selectors.addToCartButton, this.$container).prop('disabled', false);
            $(selectors.pricingWrapper, this.$container).removeClass("_hide");
            $(selectors.compareWrapper, this.$container).addClass("_hide");
            $(selectors.statusPhrase, this.$container).html(boni.strings.outOfStockStatusPhrase);
            $("._js-form").removeClass("_hide");
            $("._js-f-waitlist-status-input").prop("value", boni.strings.outOfStockStatus);
          } else {
            console.log("\tvariant is SOLD OUT (deny == inventory_policy)"); /*dbg*/
            $(selectors.addToCartText, this.$container).html(boni.strings.soldOutStatus); //.html(theme.strings.unavailable);
            $(selectors.addToCartButton, this.$container).prop('disabled', true);
            $(selectors.pricingWrapper, this.$container).addClass("_hide");
            $(selectors.compareWrapper, this.$container).addClass("_hide");
            $(selectors.statusPhrase, this.$container).html(boni.strings.soldOutStatusPhrase);
            $("._js-form").removeClass("_hide");
            $("._js-f-waitlist-status-input").prop("value", boni.strings.soldOutStatus);
          }
        }
      } else {
        console.log("\tvariant UNAVAILABLE (!variant)"); /*dbg*/
        $(selectors.addToCartText, this.$container).html(boni.strings.unavailableStatus); //.html(theme.strings.unavailable);
        $(selectors.addToCartButton, this.$container).prop('disabled', true);
        $(selectors.pricingWrapper, this.$container).addClass("_hide");
        $(selectors.compareWrapper, this.$container).addClass("_hide");
        $(selectors.statusPhrase, this.$container).html(boni.strings.unavailableStatusPhrase);
        $("._js-form").removeClass("_hide");
        $("._js-f-waitlist-status-input").prop("value", boni.strings.unavailableStatus);
      }

      $("._js-f-waitlist-option1-input").prop("value", $("[data-single-option-selector][data-index=option1]:checked").prop("value"));
      $("._js-f-waitlist-option2-input").prop("value", $("[data-single-option-selector][data-index=option2]:checked").prop("value"));
      $("._js-f-waitlist-option3-input").prop("value", $("[data-single-option-selector][data-index=option3]:checked").prop("value"));

      console.log(""); /*dbg*/
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);
      var $compareEls = $compareEls.add(selectors.compareWrapper, this.$container);

      $(selectors.productPrice, this.$container).html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass("_hide");
      } else {
        $comparePrice.html("");
        $compareEls.addClass("_hide");
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      this.$featuredImage.attr('src', sizedImgUrl);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();
