 
$(document).ready(function () {
  var SearchInput = $('#search-input');
  var SearchResults = $('#search-results');
 
  SearchInput.on('input', function () {
        var query = SearchInput.val();
        if (query.length >= 1) {
          $.ajax({
            url: '/search/suggest.json?q=' + query,
            dataType: 'json',
            success: function (data) {
              updateSearchResults_list(data.resources.results);
              updateSearchResults_suggestion(data.resources.results);
            },
            error: function (xhr, status, error) {
              console.error('Error fetching suggestions:', error);
            }
          });
        } else {
          updateSearchResults([]);
        }
      });

  function updateSearchResults_list(results) {
    SearchResults.empty();
    if (results.products) {
      $(".search-records").addClass('data');
      if (results.products.length != 0) {
        $('.search-records #search-results').prepend("<h3 id='predictive_product' class='predictive-searchbox-title'>Product</h3>"); 
        results.products.forEach(function (result) {
          let ItemImage = result.image;
          let ItemTitle = result.title;
          let ItemPrice = result.price;
          let str = `<li class="product_listing">
                                  <div class="product-inner">
  
                                    <div class="product_image">
                                      <a href="${result.url}">
                                        <img src="${ItemImage}" alt="Item Image">
                                      </a>
                                    </div>
                                  
                                    <div class="product-details">
                                      <div class="inner-title">
                                        <div class="product_title">
                                          <a href="${result.url}">${ItemTitle}</a>
                                        </div>
                                      </div>
                                      <div class="product_price">
                                        <p>RS. ${ItemPrice}</p>
                                      </div>
                                    </div>
                                  </div>
                                </li>`;
          SearchResults.append(str);
        });
      } else {
        var str = $('<li>').text(results.title || 'No results found');
        SearchResults.append(str);
      }
    } else {
      var noResultsItem = $('<li>').text('No results found');
      SearchResults.append(noResultsItem);
    }
  }


  function updateSearchResults_suggestion(results) {
      
    var searchResults = $('#search-results ul.products');
    var searchsuggestion = $('#search-results ul.suggestion');
    var searchpages = $('#search-results ul.pages');
    searchResults.empty();
    searchsuggestion.empty();
    searchpages.empty();

    if ( results.collections || results.pages || results.queries ) {

      $(".search-records").addClass('suggestion');
      
      if(results.queries.length != 0 || results.collections.length != 0){

        if($("body .product-search-suggestion").length == 0){
          $('.search-records').prepend("<div class='product-search-suggestion'><div class='suggest_main_title'><ul class='suggestion'></ul></div></div>"); 
        }
        if($("body .product-search-suggestion .suggest_main_title").length == 0){
          $('.product-search-suggestion').prepend("<div class='suggest_main_title'><ul class='suggestion'></ul></div>"); 
        }
        if($("body .product-search-suggestion #product-search-suggestion").length == 0){
          $(".product-search-suggestion .suggest_main_title").prepend("<h3 id='product-search-suggestion' class='predictive-searchbox-title'>Collections</h3>");
        }

        results.queries.forEach(function(suggestresult) {

          var list_suggest = `<li><a href="`+suggestresult.url+`">
              <div class="suggest_main_title">`
                +suggestresult.text+`
              </div></a></li>`
          $('.search-records ul.suggestion').append(list_suggest);

        });

        setTimeout(function() {
          results.collections.forEach(function(suggest_collection) {
                
            var list_collection = `<li><a href="`+suggest_collection.url+`">
                <div class="suggest_main_title collection_title">`
                  +suggest_collection.title+`
                </div></a></li>`
            $('.search-records ul.suggestion').append(list_collection);

          });
        }, 200);

      } 

      if(results.pages.length != 0 ){

        if($("body .product-search-suggestion .suggest_pages").length == 0){
          $('.product-search-suggestion').append("<div class='suggest_pages'><ul class='pages'></ul></div>"); 
        }
        if($("body .product-search-suggestion #product-search-pages").length == 0){
          $(".product-search-suggestion .suggest_pages").prepend("<h3 id='product-search-pages' class='predictive-searchbox-title'>Pages</h3>");
        }

        results.pages.forEach(function(suggest_pages) {
          var list_page = `<li><a href="`+suggest_pages.url+`"><div class="suggest_main_title pages_title">`+suggest_pages.title+`</div></a></li>`
          $('.search-records ul.pages').append(list_page);

        });

      }else{
        $(".suggest_pages").remove();
      }

      if(results.queries.length == 0 && results.collections.length == 0){
        $(".suggest_main_title").remove();
      }

      if(results.queries.length == 0 && results.collections.length == 0 && results.pages.length == 0){
        $(".product-search-suggestion").remove();
        $(".search-records ").removeClass('suggestion');
      }
    }
  }

  $(".close-icon").click(function () {
        $("#search-results").empty();
        $(".search-records").removeClass('data');
        $('#search-input').val('');
        $(".product-search-suggestion").remove();
        $(".search-records ").removeClass('suggestion');
      });


});

