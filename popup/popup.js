chrome.storage.sync.get(null, async function (obj) {
  let str = '';
  for (let i = 0; i < obj.urls.length; i++) {
    str += '<tr><td><span class="delete" id='
    str += obj.urls[i]
    str += '><i class="fas fa-trash-alt"></i></span></td><td class="image"><img src='
    str += obj.images[i];
    str += '></td>'
    str += '<td class="price">';
    str += obj.prices[i];
    str += '</td><td class="site"><img src='
    str += obj.sites_images[i];
    str += '></td><td class="tds"><form id="link" action='
    str += obj.urls[i];
    str += '><button type="button">Add to Cart</button></form></td></tr>'
  }
  document.getElementById("table").innerHTML = str;
  let del = await Array.prototype.slice.call(document.getElementsByClassName("delete"));
  del.forEach(element => {
    element.addEventListener("click", function () {
      let bg_page = chrome.extension.getBackgroundPage();
      bg_page.delete_item(element.getAttribute("id"));
      location.reload();
    });
  });
});
//make the go open a new tab
$().ready(function () {
  $(document).on('click', '#link', function (element) {
    chrome.tabs.create({ url: element.currentTarget.getAttribute("action") });
    return false;
  });
});

//Redirects to wishlist main page
document.getElementById("view_all_items").addEventListener("click", function () {
  chrome.tabs.create({ url: chrome.extension.getURL("../wishList_page/index.html") });
});



//button to add items from pop up
/*
//Adds a new item to the wishlist
document.getElementById("add_to_wishlist").addEventListener("click", function() {
  let currentURL = window.location.href;
  alert(currentURL);
  let backgroundPage = chrome.extension.getBackgroundPage();
  backgroundPage.add_item_from_popup(currentURL);
  location.reload();
});
*/
