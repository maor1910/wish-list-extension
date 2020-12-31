let selectors = 
{
    "images":
        {
            "Amazon": ["landingImage"],
            "Ebay": ["icImg"],
            "Aliexpress": ["poster"]
        },
    "prices":
        {
            "Amazon": ["price_inside_buybox"],
            "Ebay": ["prcIsum"],
            "Aliexpress": ["product-price-value"]
        },
    "product_names":
        {
            "Amazon": ["productTitle"],
            "Ebay": ["it-ttl"],
            "Aliexpress": ["product-title-text"]
        }
}
// Listen for messages
chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
    let site = msg['site'];
    let image_src = "";
    let price = "?";
    selectors.images[site].forEach(selector => {
        if(document.getElementById(selector)!=null){
            image_src = document.getElementById(selector).getAttribute("src");
        }
    });
    selectors.prices[site].forEach(selector => {
        if(document.getElementById(selector)!=null && document.getElementById(selector)!=undefined){
            price = document.getElementById(selector).innerHTML;
        }
    });    
    await sendResponse({'image': image_src, 'price': price});
});

