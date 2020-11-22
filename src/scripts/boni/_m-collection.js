/* _m-collection.js ------------------------------------------------------------
// Copyright (c) 2018 maulomelin@gmail.com.  Released under the MIT license.
//----------------------------------------------------------------------------*/
$(function() {

  let bDebug = window.boni.debug;
  let sModule = "_m-collection";

  let selectors = {
    collection: "._js-collection",
    grid: "._js-collection-grid",
  };

  let variables = {
    rowsmin: 1.25,
  };

  // Initialize the columns.
  updateColumns();

  // Set up all event handlers.
  $(window).on("resize", updateColumns);


  //----------------------------------------------------------------------------
  // This function updates the number of columns in the grid.
  //----------------------------------------------------------------------------
  function updateColumns() {
    let $grid = $(selectors.grid);
    let r = $grid.width() / $(window).height();
    let columns = 1 + Math.floor(variables.rowsmin * 3/2 * r);

    columns = (columns < 2) ? 2 : columns;

    $grid.css("grid-template-columns", "repeat(" + columns + ", 1fr)");

    if (bDebug) { console.log("[%s] updateColumns(): columns=[%d]", sModule, columns); }
  }

});
