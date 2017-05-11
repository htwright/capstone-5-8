let URL = 'https://safe-earth-98661.herokuapp.com/items';
// let URL = 'http://localhost:8080/items';

function getAll(){
  let html = '';
  fetch(URL)
    .then(response => {
      return response.json();
    })
    .then(response =>{
      response.forEach(function(item){
        console.log(item);
        html += `<li class = 'item' id = '${item.id}'>
                <div class = main-container>
                 <h3 class = 'subject'>${item.subject}</h3>
                 <p class = 'author'>Author: ${item.author}</p>
                 <p class = 'credentials'>Credentials: ${item.credentials}</p>
                 <p class = 'title'>${item.title}</p>
                 </div>
                 <p class = 'content'>${item.content}</p>
                 <button class = "delete-submit" type="button"> Delete </button>
                 </li>`;
      });
      return html;
    }).then(html =>{
      $('.containerJS').html(html);
    });
}


function deleteData(id){
  return fetch(`${URL}/${id}`, {
    method: 'DELETE',
   
  });
}

function addData(){
  console.log(URL, 'post URL');
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      subject: $('#subject-input').val(),
      author: $('#author-input').val(),
      credentials: $('#credentials-input').val(),
      title: $('#title-input').val(),
      content: $('#content-input').val()
    })
  }).then( (res) => {
    console.log(res, 'response');
    return res.json();
  });
}
  
$(document).ready(function(){
  getAll();
  $('#submit-button').on('click', function(){
    // event.preventDefault();
    return new Promise((resolve, reject) => {
      addData().then(() =>{
        getAll();
        resolve();
      })
      .catch(err => {
        return reject(err);
      }); 
    });
  });
  $('.containerJS').on('click', '.delete-submit', function(){
    let thisId = $(this).closest('li').attr('id');
    return new Promise((resolve, reject) => {
      deleteData(thisId).then(() =>{
        getAll();
        resolve();
      })
      .catch(err => {
        return reject(err);
      }); 
    });
  });
});


//passport bearer strat
//oAth
//post /login endpoint