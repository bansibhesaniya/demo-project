quickView();

// alert('quick view');

function reset() {
  $(".qv-product-description").empty();
  $(".qv-product-options").empty();
  $(".qv-product-title").empty();
  $(".qv-product-type").empty();
  $(".qv-product-images").empty();
  $(".qv-product").empty();
  $("#quick-quantity").val('1');
  $(".qv-product-price").empty();
  $(".qv-product-original-price").empty();
  $(".qv-add-to-cart-response").empty();
  $(".quick-qty").empty();
  $(".qv-add").empty();
  $('#quick-view').removeClass();
  $(".qv-add-to-cart").empty();
}

function quickView() {


    $(".quick-view").on("click", function () {

      var product_handle = $(this).data('handle');
      $('.quick').addClass('active');
      $(".black-bg").addClass("active");
      $('#quick-view').addClass(product_handle);
      $(".gradient").css("overflow", "hidden");

      jQuery.getJSON('/products/' + product_handle + '.js', function (product) {

        var title = product.title;
        var type = product.type;
        var price = product.price;
        var original_price = product.compare_at_price;
        var desc = product.description;
        var images = product.images;
        var variants = product.variants;
        var options = product.options;

        var productId = product.id;
        $('.qv-add-to-cart').append('<input name="id"  id="product-variant-id" value="' + productId + '" type="hidden" />');


        var url = '/products/' + product_handle;
        $('.qv-product-title').text(title);
        $('.qv-product-type').text(type);
        $('.qv-product-description').html(desc);
        $('.qv-product').attr('href', url);

        var price = parseFloat(product.price / 100).toFixed(2);
        var original_price = parseFloat(product.compare_at_price / 100).toFixed(2);


        $('.qv-product-price').text('₹' + price);

        $('.qv-product-original-price').text('₹' + original_price);
        $('.qv-add').append('<input type="submit" class="qv-add-button" id="quantity-add" value="Add to Cart"></input>');

        var image_embed = '<img src="' + product.featured_image + '">'
        $('.qv-product-images').append(image_embed);


        $(options).each(function (i, option) {
          var opt = option.name;
          var selectClass = '.option.' + opt.toLowerCase();
          $('.qv-product-options').append('<div class="option-selection-' + opt.toLowerCase() + '"><span class="option">' + opt + '</span><select class="option-' + i + ' option ' + opt.toLowerCase() + '"></select></div>');
          $(option.values).each(function (i, value) {
            $('.option.' + opt.toLowerCase()).append('<option value="' + value + '">' + value + '</option>');
          });
        });

        if (product.available == true) {
          $('.qv-add-button').prop('disabled', false).val('Add to Cart');
        } else {
          if (product.available == false) {
            $('.qv-add-button').css({ "background-color": "#e4e4e4", "border": "none", "color": "#0000007d", "cursor": "not-allowed" }).val('Out of stock');
          }
        }
      });
        
      $(document).on("change", "#quick-view select", function () {
        var selectedOptions = '';
        $('#quick-view select').each(function (i) {
          if (selectedOptions == '') {
            selectedOptions = $(this).val();
          } else {
            selectedOptions = selectedOptions + ' / ' + $(this).val();
          }
        });
      
        jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
          

          $(product.variants).each(function (i, v) {
            if (v.title == selectedOptions) {
              var price = parseFloat(v.price / 100).toFixed(2);
              var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
              
            
              $('.qv-product-price').text('₹' + price);

              if(original_price == 0.00) {
              $('.qv-product-original-price').css("display", "none");
              }else{
                $('.qv-product-original-price').css("display", "inline-block");
                $('.qv-product-original-price').text('₹' + original_price);
              }

              if (v.available == true) {
                $('.qv-add-button').css({ "background-color": "#000", "border": "none", "color": "#fff", "cursor": "pointer" }).val('Add to Cart');
              } else {
                if (v.available == false) {
                  $('.qv-add-button').css({ "background-color": "#e4e4e4", "border": "none", "color": "#0000007d", "cursor": "not-allowed" }).val('Out of stock');
                }
              }
            }
          });
        });
      });
    });
};



$(document).on("click", "input.qv-add-button", function () {
  var product_handle = $('#quick-view').attr('class');
  var qty = $('#quick-quantity').val();
  var selectedOptions = '';
  var var_id = '';
  $('#quick-view select').each(function (i) {
    if (selectedOptions == '') {
      selectedOptions = $(this).val();
    } else {
      selectedOptions = selectedOptions + ' / ' + $(this).val();
    }
  });

  function processCart() {
    jQuery.post('/cart/add.js', {
      quantity: qty,
      id: var_id
    },
      null,
      "json"
    ).done(function () {
      reset();
      $('.quick').removeClass('active');
      openCartDrawer();
      updateCartDrawer();
    })
      .fail(function ($xhr) {
        var data = $xhr.responseJSON;
        $('.qv-add-to-cart-response').addClass('error').html('<span><b>ERROR: </b>' + data.description);
      });
  }

  jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
    $(product.variants).each(function (i, v) {
      if (v.title == selectedOptions) {
        var_id = v.id;
        processCart();
      }
    });
  });
});

$(document).on("click", ".qv-product-close", function () {
  $('.quick').removeClass('active');
  $(".black-bg").removeClass("active");
  $(".gradient").removeAttr("style");
  reset();
})


$(document).on("click", ".black-bg", function () {
  $('.quick').removeClass('active');
  reset();
})
