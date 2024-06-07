$(".custom-cart").click(function () {
  $(".cart-drawer").toggleClass("cart-drawer--active");
  $(".black-bg").addClass("active");
  $(".gradient").css("overflow", "hidden");
});


function openCartDrawer() {
  document.querySelector(".cart-drawer").classList.add("cart-drawer--active");
  document.querySelector(".black-bg").classList.add("active");
  document.querySelector(".gradient").style.overflow = "hidden";
}


function closeCartDrawer() {
  document
    .querySelector(".cart-drawer")
    .classList.remove("cart-drawer--active");
  document.querySelector(".black-bg").classList.remove("active");
  document.querySelector(".gradient").style.removeProperty('overflow');
}

function updateCartItemCounts(count) {
  document.querySelectorAll(".count-text").forEach((e) => {
    e.textContent = count;
  });
}

async function updateCartDrawer() {
  const res = await fetch("/?section_id=cart-drawer");
  const text = await res.text();
  const html = document.createElement("div");
  html.innerHTML = text;

  const newBox = html.querySelector(".cart-drawer").innerHTML;
  document.querySelector(".cart-drawer").innerHTML = newBox;
  addCartDrawerListeners();
}

function addCartDrawerListeners() {

  document
    .querySelectorAll(".cart-drawer-quantity-selector button")
    .forEach((button) => {
      button.addEventListener("click", async () => {

        const rootItem =
          button.parentElement.parentElement.parentElement.parentElement
            .parentElement.parentElement;
        const key = rootItem.getAttribute("data-line-item-key");

        rootItem.querySelector("#loader").classList.add("loader--active");

        const currentQuantity = Number(
          button.parentElement.querySelector("input").value
        );
        const isUp = button.classList.contains(
          "cart-drawer-quantity-selector-plus"
        );
        const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;
        var QtyTotal = $('.drawer_item_qty').attr('value');

        if (newQuantity <= QtyTotal) {
          const res = await fetch("/cart/update.js", {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates: { [key]: newQuantity } }),
          });
          const cart = await res.json();
          updateCartItemCounts(cart.item_count);
          updateCartDrawer();

        } else {
          // updateCartDrawer();
          rootItem.querySelector("#loader").classList.remove("loader--active");
          rootItem.querySelector(".qty-error").classList.add('error');
        }
      });
    });

  document
    .querySelectorAll(".cart-drawer-header-right-close ")
    .forEach((el) => {
      el.addEventListener("click", () => {
        closeCartDrawer();
      });
    });

  document.querySelectorAll('#remove-drawer-item').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const item = a.parentElement.parentElement;
      const datakey = item.getAttribute('data-line-item-key');
      const loader = a.parentElement.parentElement;
      loader.querySelector("#loader").classList.add("loader--active");
      fetch('/cart/change.js',
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: datakey, quantity: 0 })
        }).then(res => {

          $(this).parents('.cart-drawer-item').remove();
          updateCartDrawer();
          loader.querySelector("#loader").classList.remove("loader--active");

        });
    });
  });

  let count = document.querySelector(".cart-drawer-header-right-items").textContent;
  document.querySelector(".count-text").innerHTML = count;
}



addCartDrawerListeners();


$(document).on("click", "#variant-stock-button", function (e) {
  e.preventDefault();
  var var_id = $('#product-variant-id').attr('value');
  var qty = $('#quantity').attr('value');
  var TOTAL = $('#demo').attr('value');

  if (qty > TOTAL) {
    $('.hh').addClass('error').html("Sorry, the desired quantity is not available.");
  }

  function processCart() {
    jQuery.post('/cart/add.js', {
      quantity: qty,
      id: var_id
    },
      null,
      "json"
    ).done(function () {
      openCartDrawer();
      updateCartDrawer();
    })
      .fail(function ($xhr) {
        var data = $xhr.responseJSON;
        $('.product_error').addClass('error').html('<span><b>ERROR: </b>' + data.description);
      });
  }
  processCart();

  jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
    $(product.variants).each(function (i, v) {
      if (v.title == selectedOptions) {
        var_id = v.id;
        processCart();
      }
    });
  });
});

document.querySelectorAll('a[href="/cart"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    openCartDrawer();
  });
});

document.querySelectorAll('.custom-cart').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    openCartDrawer();
  })
});


document.querySelectorAll('.black-bg').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    closeCartDrawer();

  });
});

// home page add to cart

// $('.product-cart').click(function() {
//   var productId = $(this).parents(".btn-inner").find("#product-variant-id").val();
//   console.log(productId);

//   $.ajax({
//         type: "POST",
//         url: "/cart/add.js",
//         data: {
//             id: productId,
//             quantity: 1
//           },
//           dataType: "json",
//           success: function(response) {
//              setTimeout(function() {
//               jQuery.getJSON("/cart.js", function(cart) {
//                 updateCartDrawer() 
//                 openCartDrawer() ;
//               });
//             }, 500);
//           }
//       });
//   });

