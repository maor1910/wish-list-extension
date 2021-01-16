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

//Context menu button for adding an item to the wish list
chrome.contextMenus.create({
    "title": "Add item to wishlist",
    "id": "add_item",
});

//Listen for clicks on "add to wishlist"
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if(is_content_script_available(info.pageUrl)){
        add_item(info, tab);
    }
    else{
        alert("Please go to a specific product page from one of the following platforms - Amazon, Ebay, Alixexpress, Walmart");
    }
});

function is_content_script_available(url){
    return(find_site(url)!=="no_match")
}
//Adds an item to the wish list and saves it in the Chrome storage
function add_item(info, tab) {
    let site = find_site(info.pageUrl);
    if (site === "no_match") {
        alert("website not on the list - can't add items from this website ");
        return;
    }
    if(!check_if_item_page(info.pageUrl, site)){
        alert("This is not an item page, can't add to wish list");
        return;
    }
    let site_image = find_site_logo(site);
    check_item_exists(info.pageUrl)
        .then(result => {
            if (result) {
                alert("item alreasy exists, choose a different one");
                return
            }
            chrome.storage.sync.get(null, function (result) {
                chrome.tabs.sendMessage(tab.id, { "site": site }, function (response) {
                    if(response.image.length === 0 && response.price.length === 0){
                        alert("could not add the item");
                        return;
                    }
                    console.log(response);
                    if (response.image !== undefined && response.image.length !== 0) {
                        result.images.push(response.image);
                    }
                    else{
                        result.images.push("https://whetstonefire.org/wp-content/uploads/2020/06/image-not-available.jpg");    //fallback
                    }
                    if(response.price !== undefined && response.price.length !== 0){
                        result.prices.push(response.price);
                    }
                    else {
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

//Delete an item from the Chrome storage
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

//Find the site, the extension was envoked on
function find_site(full_url) {
    return (full_url.indexOf("amazon") != -1) ? "Amazon"
            :(full_url.indexOf("ebay") != -1) ? "Ebay"
            :(full_url.indexOf("aliexpress") != -1) ? "Aliexpress"
            :(full_url.indexOf("walmart") != -1) ? "Walmart"
            :"no_match"
}

function find_site_logo(site){
    return (site == "Amazon") ? "/images/sites_images/amazonLogoBlue.png"
            :(site == "Ebay") ? "/images/sites_images/ebayLogo.png"
            :(site == "Aliexpress") ? "/images/sites_images/aliexpressLogo.png"
            :(site == "Walmart") ? "/images/sites_images/walmartLogo.png"
            :"https://whetstonefire.org/wp-content/uploads/2020/06/image-not-available.jpg"
}

//Check if an item is already in the wish list
function check_item_exists(url) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, function (result) {
            resolve(result.urls.includes(url));
        });
    });
}

function check_if_item_page(url, website){
    if(website === "Amazon"){
        return true;
    }
    else if(website === "Ebay"){
        if(url.indexOf("itm")!==-1){
            return true;
        }
        else{
            return false;
        }
    }
    else if(website === "Aliexpress"){
        if(url.indexOf("item")!==-1){
            return true;
        }
        else{
            return false;
        }
    }
    else if(website === "Walmart"){
        if(url.indexOf("ip")!==-1){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
};