let url = 'http://localhost:8080/items';
let html = '';

function getAll(){
  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(response =>{
      return response.map(function(item){
        console.log(item);
        html += `<p>Title :${item.title}</p>`;
      })
      .then((param) => {
        $('.containerJS').html(param);
        return;
      });
    // .end();
   
  });
}
  
$(function(){



  getAll();
  $('.containerJS').html('<p>hello</p>');
  $('.containerJS').html(html);

});