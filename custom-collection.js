<!--==================== Start: product-item-block ====================-->
<section class="product-item-block padding">
   <div class="container">
      <div class="col-md-6">
         <h2 class="main-title-p">{{ section.settings.main-title-p }}</h2>
         <p class="sub-title-p">{{ section.settings.sub-title-p }}</p>
      </div>
      <ul class="collection-main">
         {%- for collection in collections -%}
         <li class="swiper-slide">
            {%- if collection.image -%}
            {%- assign collection_image = collection.image -%}
            {%- elsif collection.products.first and collection.products.first.images != empty -%}
            {%- assign collection_image = collection.products.first.featured_image -%}
            {%- else -%}
            {%- assign collection_image = blank -%}
            {%- endif -%}
            <a href="{{ collection.url }}" aria-controls="{{ collection.title }}">
               <img src="{{ collection_image | img_url: '480x' }}" alt=""> 
               <div class="col-product-title">
                  <span>{{ collection.title }}</span>
               </div>
            </a>
         </li>
         {%- endfor -%}
      </ul>
   </div>
</section>
<!--==================== End: product-item-block ====================-->

{% schema %}
    {
      "name": "Custom Product Collection",
      "settings": [
        {
      "type": "text",
      "id": "main-title-p",
      "label": "Main Title",
      "default": "Unending Summer"
    },
    {
      "type": "text",
      "id": "sub-title-p",
      "label": "Sub Title",
      "default": "Relive the Summertime Romance"
    }
      ],
      "presets": [
        {
          "name": "Custom Product Collection"
        }
      ]
    }
    {% endschema %}
