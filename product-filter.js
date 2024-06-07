function getPriceRange() {
  const rangeInput = document.querySelectorAll(".range-input input"),
      range = document.querySelector(".slider-range .progress");

  rangeInput.forEach((input) => {
      input.addEventListener("input", (e) => {
          let minVal = parseInt(rangeInput[0].value),
              maxVal = parseInt(rangeInput[1].value);
          $(".input-min").val(minVal);
          $(".input-max").val(maxVal);
          $(".input-min").attr("value", minVal);
          $(".input-max").attr("value", maxVal);

          if (minVal > maxVal) {
              let slider = maxVal;
              maxVal = minVal;
              minVal = slider;
              $(".input-max").val(maxVal);
              $(".input-min").val(minVal);
              $(".input-min").attr("value", minVal);
              $(".input-max").attr("value", maxVal);
          }

          range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
          range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";

          $(".progress").attr("left", range.style.left);
          $(".progress").attr("right", range.style.right);


          $(".loading-state").addClass("loader--active");
          const RangeData = $('.filter-form').closest('form').serialize();
          const url_range_data = new URL(window.location.origin + window.location.pathname + '?' + RangeData);
          window.history.pushState({}, '', url_range_data);
          $.ajax({
              url: url_range_data,
              type: 'GET',
              dataType: 'html',
              success: function(response) {
                  setTimeout(function() {
                      $('.custom-product').html($(response).find('.custom-product').html());
                      $('.filter').html($(response).find('.filter').html());
                      $(".progress").attr("left", range.style.left);
                      $(".progress").attr("right", range.style.right);
                      $(".progress").css("left", range.style.left);
                      $(".progress").css("right", range.style.right);
                      quickView();
                      getPriceRange();
                      $(".loading-state").removeClass("loader--active");
                      dropdown();
                      CloseFilter();
                  }, 1000);
              }
          });
      });
  });
}

function getprocessor() {
  var leftVal = $(".input-min").attr("value");
  var rightVal = $(".input-max").attr("value");
  rangeMax = (leftVal / 600) * 100 + "%";
  rangeMin = 100 - (rightVal / 600) * 100 + "%";
  $(".progress").attr("left", rangeMax);
  $(".progress").attr("right", rangeMin);
  $(".progress").css("left", rangeMax);
  $(".progress").css("right", rangeMin);
}

function CloseFilter() {
  $(".btn-close-lg ").on('click', function(event) {
      event.preventDefault();
      $('.filter.scroll-trigger').removeClass('active');
      $(".black-bg").removeClass("active");
      $(".gradient").removeAttr("style");
  });
}

function getprogress() {
  var right = $(".progress").attr("right");
  var left = $(".progress").attr("left");
  $(".progress").attr("left", left);
  $(".progress").attr("right", right);
  $(".progress").css("left", left);
  $(".progress").css("right", right);
}


function dropdown() {
  let menu = document.querySelectorAll(".filter-main-title");
  menu.forEach(function(element) {
      element.addEventListener("click", function() {
          this.classList.toggle("active");
          var subMenu = this.nextElementSibling;
          if (subMenu.classList.contains("filter-option")) {
              subMenu.classList.toggle("active");
          }
      });
  });
}

function clearbtn() {
  if ($('.selected-filter').html().trim() == "") {
      $('.remove').css("display", "none");
  } else {
      $('.remove').css("display", "block");
  }
}

getprocessor();
clearbtn();
getPriceRange();
CloseFilter();
dropdown();

$(".black-bg").on('click', function(event) {
  event.preventDefault();
  $('.filter.scroll-trigger').removeClass('active');
  $(this).removeClass("active");
  $(".gradient").removeAttr("style");
  $('.input-search').css("display", "none");
});

// checkbox

$(document).on('change', '.input-checkbox  , .color-text ', function(event) {
  event.preventDefault();
  const formData = $(this).closest('form').serialize();
  $(".loading-state").addClass("loader--active");
  const url_data = new URL(window.location.origin + window.location.pathname + '?' + formData);
  window.history.pushState({}, '', url_data);
  $.ajax({
      url: url_data,
      type: 'GET',
      dataType: 'html',
      success: function(response) {
          $('.custom-product').html($(response).find('.custom-product').html());
          $('.filter').html($(response).find('.filter').html());
          getprocessor();
          quickView();
          getPriceRange();
          $(".loading-state").removeClass("loader--active");
          dropdown();
          CloseFilter();
      }
  });
});


$(document).on('change', '.collection-inner', function(event) {
  event.preventDefault();
  const sort1 = $('.collection-inner').val();
  $(".collection-filter-inner").val(sort1);
  const formData = $('.filter-form').closest('form').serialize();
  $(".loading-state").addClass("loader--active");
  $(".black-bg").addClass("active");
  const url_data = new URL(window.location.origin + window.location.pathname + '?' + formData);
  window.history.pushState({}, '', url_data);
  $.ajax({
      url: url_data,
      type: 'GET',
      dataType: 'html',
      success: function(response) {
          $('.custom-product').html($(response).find('.custom-product').html());
          $('.filter').html($(response).find('.filter').html());
          getprocessor();
          quickView();
          $(".loading-state").removeClass("loader--active");
          $(".black-bg").removeClass("active");
          getPriceRange();
          dropdown();
          CloseFilter();
      }
  });
});

//  collection menu filter

$('.collection-inner-title a').on('click', function(e) {
  e.preventDefault();
  var collectionUrl = $(this).attr('href');
  $(".loading-state").addClass("loader--active");
  $(".black-bg").addClass("active");
  window.history.pushState({}, '', collectionUrl);

  $.ajax({
      url: collectionUrl,
      type: 'GET',
      success: function(data) {
          window.localStorage.setItem('activeTab', collectionUrl);
          $('.collection-inner-title a').removeClass('selected');
          $(e.target).addClass('selected');

          $('.breadcrumbs').html($(data).find('.breadcrumbs').html());
          $('.custom-product').html($(data).find('.custom-product').html());
          $('.filter').html($(data).find('.filter').html());
          clearbtn();
          quickView();
          getPriceRange();
          CloseFilter();
          dropdown();
          $(".black-bg").removeClass("active");
          $(".loading-state").removeClass("loader--active");
      }
  });
});

var activeTab = window.localStorage.getItem('activeTab');
if (activeTab) {
  $('.collection-inner-title a[href="' + activeTab + '"]').addClass('selected');
}

$(document).ready(function() {
  $('.collection-inner-title a').removeClass('selected');
  var URL = window.location.origin + window.location.pathname;
  $('li.collections_title a').each(function() {
      if (URL == this.href) {
          $(this).addClass('selected');
      }
  });
});

// close filter

$(document).on('click', '.remove-filter-btn', function(event) {
  event.preventDefault();
  var collectionUrl = $(this).attr('href');
  $(".loading-state").addClass("loader--active");
  $(".black-bg").addClass("active");
  const url_data_remove = new URL(window.location.origin + collectionUrl);
  window.history.pushState({}, '', url_data_remove);
  $.ajax({
      url: url_data_remove,
      type: 'GET',
      datatype: 'html',
      success: function(response) {
          $('.custom-product').html($(response).find('.custom-product').html());
          $('.filter').html($(response).find('.filter').html());
          getprocessor();
          quickView();
          getPriceRange();
          CloseFilter();
          dropdown();
          $(".loading-state").removeClass("loader--active");
      }
  });
});

// clear all filters btn

$(document).on('click', '.remove', function(event) {
  event.preventDefault();
  $(".loading-state").addClass("loader--active");
  $(".black-bg").addClass("active");
  const url_data_remove = new URL(window.location.origin + window.location.pathname);
  window.history.pushState({}, '', url_data_remove);
  $.ajax({
      url: url_data_remove,
      type: 'GET',
      datatype: 'html',
      success: function(response) {
          $('.custom-product').html($(response).find('.custom-product').html());
          $('.filter').html($(response).find('.filter').html());
          getprocessor();
          quickView();
          getPriceRange();
          CloseFilter();
          dropdown();
          $(".remove").css("display", "none");
          $(".loading-state").removeClass("loader--active");
      }
  });
});

$(".shop-filter").on('click', function() {
  $('.filter.scroll-trigger').addClass('active');
  $(".black-bg").addClass("active");
  $(".gradient").css("overflow", "hidden");
});


document.addEventListener("DOMContentLoaded", function() {
  var endlessScroll = new Ajaxinate({
      container: '#Huratips-Loop',
      pagination: '#more',
      loadingText: 'Loading...',
      method: 'click'
  });
});
