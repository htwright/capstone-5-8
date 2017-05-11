let URL = 'https://safe-earth-98661.herokuapp.com/items';
// let URL = 'http://localhost:8080/items';


function render(){
  let html = '';
  return fetch(URL)
  .then(res => res.json())
  .then(res => {
    res.forEach(function(item){
      let shortContent = item.content;
      if (item.content.length > 250){
        shortContent = item.content.substr(0, 250)+`<a class = 'read-more' href = '${URL}/${item.id}'>...</a>`;
      }
      html += 
`<li class = 'item' id = '${item.id}'>
<div class = 'main-container'>
  <h3 class = 'subject'>${item.subject}</h3>
  <p class = 'author'>Author: ${item.author}</p>
  <p class = 'credentials'>Credentials: ${item.credentials}</p>
  <p class = 'title'>${item.title}</p>
  <p class = 'truncated-content'>${shortContent}</p>
  <p class = 'full-content hidden'>${item.content}</p>
  <button class = 'read-more'>Read More</button>
  <button class = 'read-more hidden'>Read Less</button>
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
    return res;
  })
    .then((res)=>{
      $('.containerJS').html(html); 
      $('.containerJS').find('li').each(function(){
        if ($(this).find('.full-content').text().length < 250){
          $(this).find('.read-more').remove();
        }
      });

      return res;
    })
    .catch(err => console.error(err));
}

function deleteItemById(id){
  return fetch(`${URL}/${id}`, {
    method: 'DELETE',
  });
}


function postItem(){
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
    return res.json();
  })
  .catch(err => console.error(err));
}

function updateItemById(id, thisBody){
  let thisURL = `${URL}/${id}`;
  return fetch(thisURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(thisBody)
  })
  .then((res) => {
    return res.json();
  })
  .catch(err => console.error(err));
}

$(document).ready(function(){
  
  render();

  $('#submit-button').on('click', function(event){
    event.preventDefault();
    // return new Promise((resolve, reject) => {
    return postItem()
      .then(() =>{
        render();
      })
      .catch(err => console.error(err));
    // });
  });

  $('.containerJS').on('click', '.delete-submit', function(){
    let thisId = $(this).closest('li').attr('id');
    return deleteItemById(thisId)
      .then(() =>{
        render();
      })
      .catch(err => {
        console.error(err);
      }); 
  });


  $('.containerJS').on('click', '.edit-button', function(){
    $(this).closest('.main-container').addClass('hidden');
    $(this).closest('li').find('.edit-form').removeClass('hidden');
  });

  $('.containerJS').on('click', '.edit-submit', function(){
    let thisId = $(this).closest('li').attr('id');
    
    let updateBody = {
      id: thisId,
      subject: $(this).siblings('.edit-subject').val(),
      author: $(this).siblings('.edit-author').val(),
      credentials: $(this).siblings('.edit-credentials').val(),
      title: $(this).siblings('.edit-title').val(),
      content: $(this).siblings('.edit-content').val()
    };
   
    updateItemById(thisId, updateBody)
      .then((upRes) =>{
        render();
      })
      .catch(err =>{
        console.error(err);
      }); 
  });


  $('.containerJS').on('click', '.read-more', function(event){
    event.preventDefault();
    $(this).closest('li').find('.full-content').toggleClass('hidden');
    $(this).closest('li').find('.truncated-content').toggleClass('hidden');
    $(this).closest('li').find('.read-more').toggleClass('hidden');
  });

});
