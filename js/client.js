let url = 'http://localhost:8080/items';


function getAll(){
  let html = '';
  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(response =>{
      response.forEach(function(item){
        console.log(item);
        html += `<p>Title :${item.title}</p>`;
      });
      return html;
   
    }).then(html =>{
      $('.containerJS').html(html);
    });
}
  
$(document).ready(function(){
  getAll();
});