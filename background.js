
chrome.runtime.onInstalled.addListener(function() {
    let images = [];
    let products = [];
    let prices = [];
    let urls = [];
    let sites = [];
    chrome.storage.sync.set({images: images, products: products, prices: prices, urls: urls, sites: sites});
  });

chrome.contextMenus.create({
    "title": "Add item to wishlist",
   // "onclick": add_item,
    "id": "add_item",
});
chrome.contextMenus.create({
    "title": "delete item from wishlist",
   // "onclick": delete_item,
    "id": "delete_item"
});
chrome.contextMenus.onClicked.addListener((info,tab)=>{
    if(info.menuItemId == "add_item"){
        add_item(info, tab);
    }
    else{
        delete_item(info, tab);
    }
});

 function add_item(info, tab){
    let site = find_site(info.pageUrl);
    check_item_exists(info.pageUrl)
    .then(result => {
        if(result){
            alert("item alreasy exists, choose a different one");
            return
        }
        chrome.storage.sync.get(null, function(result){
            chrome.tabs.sendMessage(tab.id, {"site": site}, function(response){
                if(response != undefined){
                    alert("if");
                    result.images.push(response.image);
                    result.prices.push(response.price);
                }
                else{
                    alert("else");
                    result.images.push("https://whetstonefire.org/wp-content/uploads/2020/06/image-not-available.jpg");    //fallback
                    result.prices.push("unknown, please check website");
    
                }
                result.products.push(tab.title);
                result.urls.push(info.pageUrl);
                let site = find_site(info.pageUrl);
                result.sites.push(site);
                chrome.storage.sync.set(result);
            });
        });
    })
    .catch(error => {
        alert("error adding the item, please refresh the page and try again");
    });
};

function add_item_from_popup(url){
        chrome.storage.sync.get(null, function(result){
            chrome.tabs.getCurrent(function (tab){
                chrome.tabs.sendMessage(tab.id, {}, function(response){
                if(response != undefined){
                    alert("if");
                    result.images.push(response.image);
                    result.prices.push(response.price);
                }
                else{
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




function delete_item(info, tab){
    check_item_exists(info.pageUrl)
    .then((response)=>{
        console.log(response);
        if(!response){
            alert("item is not in the list - can't delete");
            return;
        }
        let index = -1;
        chrome.storage.sync.get(null, function(result){
            result.urls.forEach((item) => {
                index++;
                if(info.pageUrl === item){
                    return;
                }
            });
            const keys = Object.keys(result);
            keys.forEach((key) =>{
                result[key].splice(index-1, 1);
            });
            console.log(result); 
            chrome.storage.sync.set(result);
        });
    })
    .catch(error => {
        alert("error deleting the item, please refresh the page and try again");
    });
};

function delete_item_from_popup_or_page(url){
    check_item_exists(url)
    .then((response)=>{
        if(!response){
            alert("item is not in the list - can't delete");
            return;
        }
        let index = -1;
        chrome.storage.sync.get(null, function(result){
            result.urls.forEach((item) => {
                index++;
                if(url === item){
                    return;
                }
            });
            const keys = Object.keys(result);
            keys.forEach((key) =>{
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

function find_site(full_url){
    if(full_url.indexOf("https://www.amazon") != -1){
        return ("Amazon"); 
    }
    else if (full_url.indexOf("https://www.ebay") != -1) {
        return ("Ebay");
    }
    else if (full_url.indexOf("aliexpress.com") != -1) {
        return ("Aliexpress");
    }
    else{
        return("no_match");
    }
}



function check_item_exists(url){
    return new Promise((resolve,reject)=>{
        chrome.storage.sync.get(null, function(result){
        resolve(result.urls.includes(url));
        });
    });
}
