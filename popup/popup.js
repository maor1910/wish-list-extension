let selectors = {
  images: {
    Amazon: ["landingImage"],
    Ebay: ["icImg"],
    Aliexpress: ["poster", "magnifier-image"],
    Walmart: ["prod-hero-image-image, hover-zoom-hero-image"],
  },
  prices: {
    Amazon: ["price_inside_buybox", "priceblock_ourprice"],
    Ebay: ["prcIsum", "mm-saleDscPrc"],
    Aliexpress: ["product-price-value"],
    Walmart: ["price-characteristic"],
  },
};
//let updated_prices_arr;
chrome.storage.sync.get(null, async function (obj) {
  //updated_prices_arr = await get_updated_prices(obj.prices, obj.urls);
  let str = "";
  let number_of_items_to_display = obj.urls.length;
  if (number_of_items_to_display > 6) {
    number_of_items_to_display = 6;
  }
  for (let i = 0; i < number_of_items_to_display; i++) {
    str += '<tr><td><span class="delete" id=';
    str += obj.urls[i];
    str +=
      '><i class="fas fa-trash-alt"></i></span></td><td class="image"><img src=';
    str += obj.images[i];
    str += "></td>";
    str += '<td class="tds"> <p class="price">';
    str += obj.prices[i]; //updated_prices_arr[i];
    str += '</p></td><td class="site"><img src=';
    str += obj.sites_images[i];
    str += '></td><td class="tds"><form id="link" action=';
    str += obj.urls[i];
    str += '><button type="button">Add to Cart</button></form></td></tr>';
  }
  document.getElementById("table").innerHTML = str;
  let del = await Array.prototype.slice.call(
    document.getElementsByClassName("delete")
  );
  del.forEach((element) => {
    element.addEventListener("click", function () {
      let r = confirm("Are you sure you want to delete this item?");
      if (r) {
        let bg_page = chrome.extension.getBackgroundPage();
        bg_page.delete_item(element.getAttribute("id"));
        location.reload();
      }
    });
  });
});
//make the go open a new tab
$().ready(function () {
  $(document).on("click", "#link", function (element) {
    chrome.tabs.create({ url: element.currentTarget.getAttribute("action") });
    return false;
  });
  $(document).on("click", ".remove_heart", function (element) {
    chrome.tabs.create({ url: element.currentTarget.getAttribute("action") });
    return false;
  });
});

//Redirects to wishlist main page
document
  .getElementById("view_all_items")
  .addEventListener("click", function () {
    chrome.tabs.create({
      url: chrome.extension.getURL("../wishList_page/index.html"),
    });
  });
/*
function get_updated_prices(prices_arr, urls_arr) {
  return new Promise((resolve, reject) => {
    let updated_prices = [];
    let promises = [];
    urls_arr.forEach((url, index) => {
      promises.push(
        new Promise((resolve, reject) => {
          $.get(url, (response) => {
            console.log(response);
            selectors.prices[find_site(url)].forEach((price) => {
              if (
                $(response).find(price).html() != null &&
                $(response).find(price).html() != undefined
              ) {
                if ($(response).find(price).html() !== prices_arr[index]) {
                  updated_prices.push($(response).find(price).html());
                } else {
                  updated_prices.push(prices_arr[i]);
                }
              }
              resolve();
            });
          });
        })
      );
    });
    Promise.all(promises).then(() => {
      resolve(updated_prices);
    });
  });
}

function find_site(full_url) {
  return full_url.indexOf("amazon") != -1
    ? "Amazon"
    : full_url.indexOf("ebay") != -1
    ? "Ebay"
    : full_url.indexOf("aliexpress") != -1
    ? "Aliexpress"
    : full_url.indexOf("walmart") != -1
    ? "Walmart"
    : "no_match";
}

//button to add items from pop up

//Adds a new item to the wishlist
document.getElementById("add_to_wishlist").addEventListener("click", function() {
  let currentURL = window.location.href;
  alert(currentURL);
  let backgroundPage = chrome.extension.getBackgroundPage();
  backgroundPage.add_item_from_popup(currentURL);
  location.reload();
});
*/
