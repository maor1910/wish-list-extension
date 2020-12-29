let selectors = 
{
    "images":
        {
            "Amazon": ["landingImage"],
            "Ebay": ["icImg"],
            "Aliexpress": ["poster"],
            "no_match": ["https://whetstonefire.org/wp-content/uploads/2020/06/image-not-available.jpg"]
        },
    "prices":
        {
            "Amazon": ["price_inside_buybox"],
            "Ebay": ["prcIsum"],
            "Aliexpress": ["poster"]
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
    console.log(site);
    console.log(selectors.prices[site]);
    selectors.prices[site].forEach(selector => {
        if(document.getElementById(selector)!=null && document.getElementById(selector)!=undefined){
            price = document.getElementById(selector).innerHTML;
        }
    });
    //let image_src = document.getElementById(selectors.images[site]).getAttribute("src");
    //let price = document.getElementById(selectors.prices[site]).innerHTML;
    await sendResponse({'image': image_src, 'price': price});
});

