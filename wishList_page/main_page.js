chrome.storage.sync.get(null, async function (obj) {
    let str = '';
    let flag = true;
    for (let i = 0; i < obj.urls.length; i++) {
        if (i % 4 === 0 && flag) {
            str += '<div class="row pb-5 mb-4">'
            flag = !flag;
        }
        str += '<div class="col-lg-3 col-md-6 mb-4 mb-lg-4">';
        str += '<div class="card rounded shadow-sm border-0">';
        str += '<div class="card-body p-4"><img src=';
        str += obj.images[i];
        str += ' alt="" class="d-block mx-auto mb-3">';
        str += '<div class="card-img-overlay d-flex justify-content-end"><a href="#" class="card-link text-danger like remove_heart" id=';
        str += obj.urls[i];
        str += '><i class="fas fa-heart"></i></a></div>';
        str += '<span class="price-new">';
        str += obj.prices[i];
        str += '</span><br>';
        str += '<h5> <a href="#" class="text-dark">';
        str += obj.products[i].substring(0, 65);
        str += '</a></h5>';
        str += '<a class="btn-sm btn-success mt-2 float-right" href=';
        str += obj.urls[i];
        str += '><i class="fas fa-shopping-cart"></i> Add to Cart</a></div></div></div>';
        if (i % 4 === 0 && flag) {
            str += '</div>';
        };
    };
    document.getElementById("catalog").innerHTML = str;
    //Need to make this run onlt after get_items finishes
    let del = await Array.prototype.slice.call(document.getElementsByClassName("remove_heart"));
    del.forEach(element => {
        element.addEventListener("click", function () {
            let r = confirm("Are you sure you want to delete this item?");
            if(r){
                let bg_page = chrome.extension.getBackgroundPage();
                bg_page.delete_item(element.getAttribute("id"));
                location.reload();
            }
        });
    });
});

$().ready(function () {
    $(document).on('click', '#link', function (element) {
        console.log(element);
        chrome.tabs.create({ url: element.currentTarget.getAttribute("action") });
        return false;
    });
});



