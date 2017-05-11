// let URL = 'https://safe-earth-98661.herokuapp.com/items';
let URL = 'http://localhost:8080/items';

function getAll(){
  let html = '';
  fetch(URL)
    .then(response => {
      return response.json();
    })
    .then(response =>{
      response.forEach(function(item){
        let shortContent = item.content;
        if (item.content.length > 250){
          shortContent = item.content.substr(0, 250)+`<a class = 'read-more' href = '${URL}/${item.id}'>...</a>`;
        }
        html += `<li class = 'item' id = '${item.id}'>
                  <div class = 'main-container'>
                    <h3 class = 'subject'>${item.subject}</h3>
                    <p class = 'author'>Author: ${item.author}</p>
                    <p class = 'credentials'>Credentials: ${item.credentials}</p>
                    <p class = 'title'>${item.title}</p>
                    <p class = 'content'>${shortContent}</p>
                    <a class = 'read-more' href = '${URL}/${item.id}'>Read More</a>
                    <button class = "edit-button" type="button"> Edit </button>
                  </div>
                    
                  <form class = 'edit-form hidden'>
                     Subject<br> <textarea rows='1' cols='25' class='edit-subject' type="text" name = 'content'>${item.subject}</textarea><br>
                      Credentials<br> <textarea rows='1' cols='25' class='edit-credentials' type="text" name = 'content'>${item.credentials}</textarea><br>
                      Title<br> <textarea rows='1' cols='25' class='edit-title' type="text" name = 'content'>${item.title}</textarea><br>
                      Content<br> <textarea rows='10' cols='80' class='edit-content' type="text" name = 'content'>${item.content}</textarea><br>
                      <input class='edit-submit' type="button" value="Submit">
                      <button class = "delete-submit" type="button"> Delete </button>
                  </form>
                  
                 </li>`;
      });
      return html;
    }).then(html =>{
      $('.containerJS').html(html);
    });
}

function deleteItemById(id){
  return fetch(`${URL}/${id}`, {
    method: 'DELETE',
  });
}

function getItemById(id){
  let thisURL = `${URL}/${id}`;
  return fetch(thisURL)
  .then((res) => {
    return res.json();
  })
  .catch(err => console.error(err));
}

function hideReadMore(){
  $('.readmoreJS').addClass('hidden');
  $('.hideReadMore').addClass('hidden');
}

function showReadMore(){
  if ($('.readmoreJS').hasClass('hidden')){
    $('.readmoreJS').removeClass('hidden');
    $('.hideReadMore').removeClass('hidden');
  } else return;
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

function updateData(id, body){
  let thisURL = `${URL}/${id}`;
  // fetch(thisURL)
  // .then(res => res.json())
  // .then(res => {
  //   console.log(res);
  // });
  fetch(thisURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: body,
  })
  .then( (res) => {
    console.log(res, 'response');
    return;
  })
  .catch(err => console.error(err));
}
  
$(document).ready(function(){

  getAll();

  $('.containerJS').on('click', '.edit-button', function(){
    $(this).closest('.main-container').addClass('hidden');
    $(this).closest('li').find('.edit-form').removeClass('hidden');
  });

  $('.containerJS').on('click', '.edit-submit', function(){
    let thisId = $(this).closest('li').attr('id');
    // let thisItem = getItemById(thisId);
    let body = JSON.stringify({
      id: thisId,
      subject: $(this).siblings('.edit-subject').val(),
      author: $(this).siblings('.edit-author').val(),
      credentials: $(this).siblings('.edit-credentials').val(),
      title: $(this).siblings('.edit-title').val(),
      content: $(this).siblings('.edit-content').val()
    });
    console.log(body);

    return Promise.all([updateData(thisId, body), getAll()]);
    
    
    // return new Promise((resolve, reject) => {
    //   return updateData(thisId)
    //   .then(() =>{
    //     getAll();
    //     resolve();
    //   })
    //   .catch(err => {
    //     return reject(err);
    //   }); 
    // });
  });

  
  $('#submit-button').on('click', function(){
    // event.preventDefault();
    return new Promise((resolve, reject) => {
      addData()
      .then(() =>{
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
      deleteItemById(thisId)
      .then(() =>{
        getAll();
        resolve();
      })
      .catch(err => {
        return reject(err);
      }); 
    });
  });


  $('.containerJS').on('click', '.read-more', function(event){
    event.preventDefault();
    
    let thisId = $(this).closest('li').attr('id');
    return getItemById(thisId)
    .then(result => {
      $('.readmoreJS').empty();
      showReadMore();
      $('.readmoreJS').append(`<h4>${result.title}</h4><br><p>${result.content}</p>`);
    });
  });


  $('.hideReadMore').on('click', function(){
    hideReadMore();
  });
});


//passport bearer strat
//oAth
//post /login endpoint