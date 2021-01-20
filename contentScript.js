let selectors = {
  images: {
    Amazon: ["landingImage"],
    Ebay: ["icImg"],
    Aliexpress: ["poster", "magnifier-image"],
    Walmart: ["prod-hero-image-image", "hover-zoom-hero-image"],
  },
  prices: {
    Amazon: ["price_inside_buybox", "priceblock_ourprice"],
    Ebay: ["prcIsum", "mm-saleDscPrc"],
    Aliexpress: ["product-price-value"],
    Walmart: ["price-characteristic"],
  },
};

// Listen for messages
chrome.runtime.onMessage.addListener(async function (msg,sender,sendResponse) {
  let site = msg["site"];
  let image_src = "";
  let price = "";
  selectors.images[site].forEach((selector) => {
    if (document.getElementById(selector) != null && document.getElementById(selector) != undefined) {
      image_src = document.getElementById(selector).getAttribute("src");
    } else if (document.getElementsByClassName(selector).length != 0 && site !== "Walmart") {
      image_src = document
        .getElementsByClassName(selector)[0]
        .getAttribute("src");
    }
    else if (document.getElementsByClassName(selector).length != 0 && site === "Walmart") {
      image_src = "https:" + document
        .getElementsByClassName(selector)[0]
        .getAttribute("src");
    } 
    else {
    }
  });
  selectors.prices[site].forEach((selector) => {
    if (
      document.getElementById(selector) != null &&
      document.getElementById(selector) != undefined
    ) {
      price = document.getElementById(selector).innerHTML;
    } else if (
      document.getElementsByClassName(selector).length != 0 &&
      site !== "Walmart"
    ) {
      price = document.getElementsByClassName(selector)[0].innerHTML;
    } else if (
      document.getElementsByClassName(selector).length != 0 &&
      site === "Walmart"
    ) {
      price = document
        .getElementsByClassName(selector)[0]
        .getAttribute("content");
    } else {
    }
  });
  await sendResponse({ image: image_src, price: price });
});

//Currently not used, may be used in later versions
/*
const priceSelectors = {
    'com.au': ['#olp-upd-new > span > a > span.a-size-base.a-color-price'],
    'cn': ['#priceblock_ourprice'],
    'de': ['#priceblock_ourprice'],
    'com': ['#priceblock_ourprice'],
    'ca': ['#priceblock_ourprice','#olp-upd-new > span > a > span.a-size-base.a-color-price'],
    'nl': ['#priceblock_ourprice'],
    'co.jp': ['#priceblock_ourprice'],
    'co.uk': ['#price_inside_buybox'],
    "com.br": ['#priceblock_ourprice'],
    'fr': ['#priceblock_ourprice'],
    'es': ['#priceblock_ourprice'],
    'ru': ['#priceblock_ourprice'],
    'co.in': ['#priceblock_ourprice'],
    'com.ms': ['#priceblock_ourprice'], 
    'it': ['#priceblock_ourprice']
  }
  const selectors2 = 
    {
        "productPage": {
            "ASIN": "#ftSelectAsin",
            "ASIN2": "#detail-bullets",
            "name": "#productTitle",
            "name2": "#mas-title",
            "brand": {
                "name": "#bylineInfo",
                "name2": "#centerCol > div > div > div > div > a",
                "name3": "#logoByLine",
                "name4": "#brand",
                "name5": "div#bylineInfo",
                "name6": "#merchant-info"
            },
            "image": {
                "main": "#landingImage",
                "main2": "#comparison_image",
                "main3": "#imgTagWrapperId > img",
                "main4": "span[data-thumb-action]",
                "main4Helper": "span > span > span > span > img"
            },
            "rate": "#acrPopover > span > a > i > span",
            "rate2": "#detail-bullets > table > tbody > tr > td > div > ul > li > span > span > a > i",
            "numberOfReviews": "#acrCustomerReviewText",
            "numberOfReviews2": "#detail-bullets > table > tbody > tr > td > div > ul > li > span > span > a.a-link-normal",
            "price": "#priceblock_ourprice",
            "price2": "#unqualified > div > span.a-color-price",
            "price3": "#price_inside_buybox",
            "cupon": "#vpcButton > div > labal > span > span.a-color-success",
            "firstSponsoredRelatedProductsCarousel": "#sp_detail",
            "firstSponsoredRelatedProductsCarouselElements": "[id^='sp_detail_B']:not([id$='_badge']):not([id$='_badge_text'])",
            "secondSponsoredRelatedProductsCarousel": "#sp_detail2",
            "secondSponsoredRelatedProductsCarouselElements": "[id^='sp_detail2_B']:not([id$='_badge']):not([id$='_badge_text'])",
            "sponsoredRelatedProductImg": "a > img",
            "sponsoredProductsUnderAddToCart": "#hero-quick-promo",
            "idAttribute": "id",
            "srcAttribute": "src",
            "altAttribute": "alt",
            "dataOldHiresAttribute": "data-old-hires",
            "dataADynamicImageAttribute": "data-a-dynamic-image"
        },
        "searchPage": {
            "sponsoredBrand": {
                "brandName": "#hsaSponsoredByBrandName",
                "brandImage": "img.mediaCentralImage.imageContainer__image",
                "adHeadline": "#pdagDesktopSparkleHeadline",
                "productsBlock": "#pdagDesktopSparkleAsinsContainer",
                "productsImages": ".mediaCentralImage .imageContainer__image",
                "productNamePrefix": "#pdagDesktopSparkleDescription",
                "firstProductDesc": "#pdagDesktopSparkleDescription1",
                "secondProductDesc": "#pdagDesktopSparkleDescription2",
                "thirdProductDesc": "#pdagDesktopSparkleDescription3",
                "productsAsins": "div.asinImage"
            },
            "sponsoredProducts": {
                "sponsoredProductsBlocks": ".AdHolder",
                "productsBlocks": "li[id^='result_']",
                "sponsoredHeadline": "div > div > div > div > h5",
                "ASIN": "a.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal",
                "productName": "div > div > div > div.a-fixed-left-grid-col.a-col-right div > div > a > h2",
                "productName2": "div > div.a-row.a-spacing-none.s-color-subdued > div > a > h2",
                "productName3": "div > div.a-row.a-spacing-none > div > a > h2",
                "brandName": "div > div > div > div.a-fixed-left-grid-col.a-col-right div > div",
                "brandName2": "div > div.a-row.a-spacing-small.a-grid-vertical-align.a-grid-center > div > img",
                "brandName3": "div > div.a-row.a-spacing-small.a-grid-vertical-align.a-grid-center > div > span",
                "priceCurrency": "sup.sx-price-currency",
                "priceWhole": "span.sx-price-whole",
                "priceFractional": "sup.sx-price-fractional",
                "fullPrice": ".a-color-price.s-price",
                "rate": "span.a-icon-alt",
                "numberOfReviews": "div.a-row.a-spacing-mini > a.a-size-small.a-link-normal.a-text-normal",
                "coupon": "i.a-icon.a-icon-addon.a-align-bottom.sx-bestseller-badge-primary",
                "IdPrefix": "result_",
                "brandNamePrefix": "li[data-asin=\"",
                "brandNameSuffix": "\"] > div > div > div > div > div > div > div > div > div > div.a-row.a-size-base.a-color-secondary"
            }
        },
        "attributes": {
            "id": "id",
            "href": "href",
            "dataAsin": "data-asin",
            "src": "src",
            "alt": "alt",
            "title": "title",
            "dataOldHires": "data-old-hires",
            "dataADynamicImage": "data-a-dynamic-image"
        },
        "tags": {
            "img": "img",
            "span": "span"
        },
        "regex": {
            "asin": "^[B].*",
            "coupon": "^(\\$|\\₹|CDN\\$|EUR|\\￥|\\£)?\\d+([\\.\\,]\\d+)*\\%?$",
            "price": "^(\\$|\\₹|CDN\\$|EUR|\\￥|\\£)[ ]?\\d+([\\.\\,]\\d+)?( - (\\$|\\₹|CDN\\$|EUR|\\￥|\\£)[ ]?\\d+([\\.\\,]\\d+)?)?$"
        },
        "strings": {
            "byStrings": ["by", "von", "di", "de", "por", "door"],
            "prime": "Prime",
            "noRate": "No rate",
            "save": "Save ",
            "none": "None"
        },
        "chars": {
            "leftBracket": "[",
            "rightBracket": "]",
            "tab": "\t",
            "newLine": "\n",
            "empty": "",
            "dot": ".",
            "comma": ",",
            "space": " ",
            "percent": "%",
            "dollar": "$",
            "slash": "/",
            "B": "B"
        },
        "marketplaces": {
            "US": "US",
            "AU": "AU",
            "CA": "CA",
            "FR": "FR",
            "DE": "DE",
            "IN": "IN",
            "IT": "IT",
            "JP": "JP",
            "MX": "MX",
            "ES": "ES",
            "UK": "UK",
            "TR": "TR",
            "BR": "BR",
            "NL": "NL"
        },
        "currencies": {
            "rupee": "₹",
            "dollar": "$",
            "canadianDollar": "CDN$",
            "euro": "EUR",
            "yen": "￥",
            "pound": "£"
        }
    }
   
   "product_names":
   {
       "Amazon": ["productTitle"],
       "Ebay": ["it-ttl"],
       "Aliexpress": ["product-title-text"],
       "Walmart": ["prod-ProductTitle"]
   }
    */
