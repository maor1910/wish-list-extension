chrome.storage.sync.get(null, async function(obj) {
    let str = '';
    let flag = true;
	for (let i=0; i<obj.urls.length;i++){
        if(i%4===0 && flag){
            str += '<div class="row" style="height:350px;">'
            flag = !flag;
        } 
        str += '<div class="col-3">'
        str += '<div class="card" style="height:400px;">'
        str += '<img class="card-img" src='
		str += obj.images[i];
        str += ' style="height:150px;">'
        str += '<div class="card-img-overlay d-flex justify-content-end"><a href='
        str += obj.urls[i];
        str += 'class="card-link text-danger like">'
        str += '<i class="fas fa-heart"></i></a></div>'
        str += '<div class="card-body" style="margin:0;"><h6 class="card-title" style="height:100px;">'
        str += obj.products[i];
        str += '</h6><h6 class="card-subtitle mb-2 text-muted">in stock</h6>'
		str += '<div style="margin:0;" class="buy d-flex justify-content-between align-items-center"><div class="price text-success"><h5 class="mt-4">'
        str += obj.prices[i];
        str += '</h5></div>'
        str += '<a href="#" class="btn btn-danger mt-3"><i class="fas fa-shopping-cart"></i> Add to Cart</a></div></div></div></div>'
        if(i%4===0 & flag){
            str += '</div>'
        } 
	}
    document.getElementById("catalog").innerHTML = str;
  	//Need to make this run onlt after get_items finishes
      let del = await Array.prototype.slice.call(document.getElementsByClassName("delete"));
      del.forEach(element =>{
        element.addEventListener("click", function(item) {
          $(this).parent().parent().remove();
          let bg_page = chrome.extension.getBackgroundPage();
          bg_page.delete_item_from_popup_or_page(element.getAttribute("id")); 
          location.reload();
          });
      });
});

$().ready(function(){
    $(document).on('click', '#link', function(element){
	  console.log(element);
      chrome.tabs.create({url: element.currentTarget.getAttribute("action")});
      return false;
    });
  });



