async function RemoveCart() {
  const res = await fetch("/cart");
  const text = await res.text();
  const html = document.createElement("div");
  html.innerHTML = text;
  const newdiv = html.querySelector("#cart").innerHTML;
  document.querySelector("#cart").innerHTML = newdiv;
  addCartpage();
  let count = document.querySelector(".total-product").textContent;
  document.querySelector(".count-text").innerHTML = count;
}

function addCartpage() {
  document.querySelectorAll('.custom-cart-qty-button button').forEach((button) => {
      button.addEventListener("click", (e) => {
          e.preventDefault();
          const input = button.parentElement.querySelector("input");
          const value = Number(input.value);
          const isplus = button.classList.contains("plus");
          const key = button.closest('.cart-page-inner-item').getAttribute("data-key");
          const loader = button.parentElement.parentElement.parentElement;
          loader.querySelector(".loading-item").classList.add("loader--active");

          if (isplus) {
              const Newval = value + 1;
              input.value = Newval;
              changeItemQuantity(key, Newval);
          } else if (value > 0) {
              const Newval = value - 1;
              input.value = Newval;
              changeItemQuantity(key, Newval);
          }
      });
  });

  document.querySelectorAll('.remove-inner-item').forEach((r) => {
      r.addEventListener("click", (e) => {
          e.preventDefault();
          const item = r.closest(".cart-page-inner-item");
          const product_key = item.getAttribute("data-key");
          item.querySelector(".loading-item").classList.add("loader--active");
          fetch('/cart/change.js', {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: product_key, quantity: 0 })
          }).then(res => {
              item.remove();
              console.log('Item removed successfully');
              RemoveCart();
          });
      });
  });
}

function changeItemQuantity(key, quantity) {
  fetch('/cart/change.js', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
  }).then(res => {
      RemoveCart();
  }).catch(error => {
      console.error('Error:', error);
  });
}

addCartpage();


document.addEventListener("input", (e) => {
  if (e.target && e.target.classList.contains('cart-qty-input')) {
      e.preventDefault();
      const newQuantity = e.target.value;
      const dataKey = e.target.closest('.cart-page-inner-item').getAttribute('data-key');
      const productId = dataKey;
      const loader = e.target.closest('.cart-page-inner-item').querySelector(".loading-item");

      loader.classList.add("loader--active");
      fetch('/cart/change.js', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: productId, quantity: newQuantity })
      })
      .then(res => {
          if (res.ok) {
              return res.text();
            }
            loader.classList.remove("loader--active");
      })
      .then(text => {
        loader.classList.remove("loader--active");
          RemoveCart();
      })
  }
});
