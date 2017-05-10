// const {URL} = require('./../../config');

let URL = 'https://safe-earth-98661.herokuapp.com/items';

function getAll(){
  let html = '';
  fetch(URL)
    .then(response => {
      return response.json();
    })
    .then(response =>{
      response.forEach(function(item){
        console.log(item);
        html += `<li class = item>
                 <h3 class = subject>${item.subject}</h3>
                 <p class = author>Author: ${item.author}</p>
                 <p class = credentials>Credentials: ${item.credentials}</p>
                 <p class = title>${item.title}</p>
                 <p class = content>${item.content}</p>
                 </li>`;
      });
      return html;
    }).then(html =>{
      $('.containerJS').html(html);
    });
}

// var form = new FormData(document.getElementById('login-form'));
// fetch("/login", {
//   method: "POST",
//   body: form
// });

// let form = new FormData($('#submit-form'));
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
  $('#submit-button').on('click', function(event){
    event.preventDefault();
    console.log('hello');
    addData();
  });
});