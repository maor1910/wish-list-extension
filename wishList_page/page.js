chrome.storage.sync.get(null, async function(obj) {
	let str = '';
	for (let i=0; i<obj.urls.length;i++){
		str += '<tr><td class="image"><img src='
		str += obj.images[i];
		str += '></td><td class="product tds">';
		str += obj.products[i];
		str += '</td><td class="price tds">';
		str += obj.prices[i];
		str += '</td><td class="tds">in stock</td><td class="tds"><form id="link" action='
		str += obj.urls[i];
		str += '><button type="button" class="btn btn-success">Go</button></form><form><button type="button" class="btn btn-danger delete" id=';
		str += obj.urls[i];
		str += '>Delete</button></form></td></tr>';	
	}
	document.getElementById("table").innerHTML = str;

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
  //make the go open a new tab
  //Need to make this run only after get_items finishes
  $().ready(function(){
    $(document).on('click', '#link', function(element){
	  console.log(element);
      chrome.tabs.create({url: element.currentTarget.getAttribute("action")});
      return false;
    });
  });


