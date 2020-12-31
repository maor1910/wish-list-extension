//initialize chrome storage with empty object that will be modified when the user adds items
chrome.runtime.onInstalled.addListener(function () {
    let images = [];
    let products = [];
    let prices = [];
    let urls = [];
    let sites = [];
    let sites_images = [];
    chrome.storage.sync.set({ images: images, products: products, prices: prices, urls: urls, sites: sites, sites_images: sites_images });
});

chrome.contextMenus.create({
    "title": "Add item to wishlist",
    "id": "add_item",
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    add_item(info, tab);
});

function add_item(info, tab) {
    let site = find_site(info.pageUrl);
    let site_image = find_site_image(site);
    if (site === "no_match") {
        alert("website not on the list - can't add items from this website ");
        return;
    }
    check_item_exists(info.pageUrl)
        .then(result => {
            if (result) {
                alert("item alreasy exists, choose a different one");
                return
            }
            chrome.storage.sync.get(null, function (result) {
                chrome.tabs.sendMessage(tab.id, { "site": site }, function (response) {
                    if (response != undefined) {
                        result.images.push(response.image);
                        result.prices.push(response.price);
                    }
                    else {
                        alert("else");
                        result.images.push("https://whetstonefire.org/wp-content/uploads/2020/06/image-not-available.jpg");    //fallback
                        result.prices.push("unknown, please check website");

                    }
                    result.products.push(tab.title);
                    result.urls.push(info.pageUrl);
                    result.sites.push(site);
                    result.sites_images.push(site_image);
                    chrome.storage.sync.set(result);
                });
            });
        })
        .catch(error => {
            alert("error adding the item, please refresh the page and try again");
        });
};

function delete_item(url) {
    check_item_exists(url)
        .then((response) => {
            if (!response) {
                alert("item is not in the list - can't delete");
                return;
            }
            let index = -1;
            chrome.storage.sync.get(null, function (result) {
                for(let i=0; i<result.urls.length;i++){
                    index++;
                    if (result.urls[i] === url) {
                        break;
                    }
                }
                const keys = Object.keys(result);
                keys.forEach((key) => {
                    result[key].splice(index, 1)
                });
                console.log(result);
                chrome.storage.sync.set(result);
            });
        })
        .catch(error => {
            alert("error deleting the item, please refresh the page and try again");
        });
};

function find_site(full_url) {
    return (full_url.indexOf("https://www.amazon") != -1) ? "Amazon"
            :(full_url.indexOf("https://www.ebay") != -1) ? "Ebay"
            :(full_url.indexOf("aliexpress.com") != -1) ? "Aliexpress"
            :"no_match"
}
function find_site_image(site){
    return (site == "Amazon") ? "../sites_images/amazonLogo.png"
            :(site == "Ebay") ? "../sites_images/ebayLogo.png"
            :(site == "Aliexpress") ? "../sites_images/aliexpressLogo.png"
            :"https://whetstonefire.org/wp-content/uploads/2020/06/image-not-available.jpg"
}


function check_item_exists(url) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, function (result) {
            resolve(result.urls.includes(url));
        });
    });
}


/*
function add_item_from_popup(url) {
    chrome.storage.sync.get(null, function (result) {
        chrome.tabs.getCurrent(function (tab) {
            chrome.tabs.sendMessage(tab.id, {}, function (response) {
                if (response != undefined) {
                    alert("if");
                    result.images.push(response.image);
                    result.prices.push(response.price);
                }
                else {
                    alert("else");
                    result.images.push("https://whetstonefire.org/wp-content/uploads/2020/06/image-not-available.jpg");    //fallback
                    result.prices.push("unknown, please check website");
                }
            });
            result.products.push(url);
            result.urls.push(url);
            let site = find_site(url);
            result.sites.push(site);
            chrome.storage.sync.set(result);
        });
    });
}
*/