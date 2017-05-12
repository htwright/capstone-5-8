let URL = 'https://safe-earth-98661.herokuapp.com/items';
// let URL = 'http://localhost:8080/items';


//!!!!!!!getBySubject, getBySearchTerm, and render are ONLY to EVER be called //       by the renderSelector!!!!!!
function getAll(){
  return fetch(URL)
  .then(res => res.json())
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
//accepts an array of terms (for compatability with the renderSelector).
//the array should only contain one string per our event listeners and //renderSelector. Returns an array of processed database objects who have
//subject fields that match the term passed in exactly
function getBySubject(subject){
  let resultArr = [];
  return fetch(URL)
  .then(res => res.json())
  .then(res => {
    console.log(res);
    console.log(subject);
    subject = subject.toString();
    subject = subject.toLowerCase();
    res.forEach(function(item){
      item.subject = item.subject.toLowerCase();
      if(item.subject === subject){
        resultArr.push(item);
      }
    });
    console.log(resultArr);
    if (resultArr.length > 0){
      console.log('searching...');
     
      return resultArr;
    } else {
      alert('Search returned no matches!');
      return;
    }
    
  })
  .catch(err => console.error(err));

}
//accepts an array of terms and returns an array of processed database 
//objects that have one of the search term strings in their content 
function getBySearchTerm(term){
  let resultArr = [];
  let splitArr = [];
  return fetch(URL)
  .then(res => res.json())
  .then(res => {
    console.log(res);
    res.forEach(function(item){
      splitArr = item.content.split(' ');
      splitArr.forEach(function(item1) {
        item1 = item1.toLowerCase();
        if(term.includes(item1)){
          return resultArr.push(item);
        }
      });
    });
    console.log(resultArr);
    if (resultArr.length > 0){
      console.log('searching...');
      return resultArr;
    } else {
      alert('no matched items in database!');
      return;
    }
    
  })
  .catch(err => console.error(err));
}
//render selector is a versatile function that can be called independantly
//or at the head of a promise chain. NEVER render except via this function 
function renderSelector(opt, terms = []){
  for (let i = 0; i < terms.length; i++){
    terms[i] = terms[i].toLowerCase();
  }
  if (opt === 'full'){
    return getAll()
    .then(res =>{
      render(res);
      return;
    })
    .then(() =>{
      hideReadAlls();
      return;
    })
    .catch(err => console.error(err));
  } else if (opt === 'search'){
    return new Promise((resolve, reject)=>{
      return getBySearchTerm(terms)
    .then(res => {
      render(res);
      return;
    })
    .then(() =>{
      hideReadAlls();
      return;
    })
    .catch(err => console.error(err)); 
    });
  } else if (opt === 'subject'){
    return new Promise((resolve, reject)=>{
      return getBySubject(terms)
    .then(res => {
      render(res);
      return;
    })
    .then(() =>{
      hideReadAlls();
      return;
    })
    .catch(err => console.error(err)); 
    });

  }
}
//render accepts an array of database objects that've been extracted via .json //and/or filtered by our get functions
function render(arr){
  let html = '';
  let shortContent;
  // let toRender = [];
  console.log(arr);
  arr.forEach(function(item){
    shortContent = item.content;
    if(item.content.length > 250){
      shortContent = item.content.substring(0, 250)+'...';
    }
    html += 
`<li class = 'item' id = '${item.id}'>
<div class = 'main-container'>
  <div class='header-container'>
    <p class = 'title'>${item.title}</p>
    <h3 class = 'subject'>${item.subject}</h3>
  </div>
  <div class='content-container'>
    <p class = 'author'>Author: ${item.author}</p>
    <p class = 'credentials'>Credentials: ${item.credentials}</p>
    <p class = 'truncated-content'>${shortContent}</p>
    <p class = 'full-content hidden'>${item.content}</p>
  </div>
  <div class ='controls-container'>
    <button class = 'read-more'>Read More</button>
    <button class = 'read-more hidden'>Read Less</button>
    <button class = "edit-button" type="button"> Edit </button>
  </div>
</div>
  
<form class = 'edit-form hidden'>
  <label>
    Title<br> <input class='edit-title' type="text" name = 'content' value = '${item.title}'><br>
  </label>
  <label>
    Subject<br> <input class='edit-subject' type="text" name = 'content' value = '${item.subject}'><br>
    </label>
    <label>
    Credentials<br> <input class='edit-credentials' type="text" name = 'content' value = '${item.credentials}'><br>
    </label>
    <label>
    Content<br> <textarea rows='10' cols='80' class='edit-content' type="text" name = 'content'>${item.content}</textarea><br>
    </label>
    <input class='edit-submit' type="submit" value="Submit">
    <button class = "delete-submit" type="button"> Delete </button>
  <button class = "edit-cancel" type="button"> Cancel </button>

</form>
</li>`;
    $('.containerJS').html(html);
  });
}

function hideReadAlls(){
  $('.containerJS').find('li').each(function(){
    if ($(this).find('.full-content').text().length < 250){
      console.log($(this).find('.controls-container').find('.read-more'));
      $(this).find('.controls-container').find('.read-more').remove();
    }
  });
}

$(document).ready(function(){
//initial render  
  renderSelector('full');

//Search listeners
  $('#search-form').on('submit', function(event){
    event.preventDefault();
    let termsArr = [];
    let rawTerms = ($(this).children('#search-box').val());
    termsArr = rawTerms.split(' ');
    console.log(termsArr);
    renderSelector('search', termsArr);
    this.reset();
  });
//Subject search buttons
  $('#show-gaming-button').on('click', function(){
    renderSelector('subject', 'gaming');
  });

  $('#show-technology-button').on('click', function(){
    renderSelector('subject', 'technology');
  });
  $('#show-history-button').on('click', function(){
    renderSelector('subject', 'history');
  });
  $('#show-television-button').on('click', function(){
    renderSelector('subject', 'television');
  });
//Show all button
  $('#show-all-button').on('click', function(){
    renderSelector('full');
  });

//Edit listeners
  $('.containerJS').on('click', '.delete-submit', function(){
    let thisId = $(this).closest('li').attr('id');
    return deleteItemById(thisId)
      .then(() => {
        renderSelector('full');
      })
      .catch(err => {
        console.error(err);
      }); 
  });

  $('.containerJS').on('click', '.edit-button', function(){
    $(this).closest('li').find('.main-container').addClass('hidden');
    $(this).closest('li').find('.edit-form').removeClass('hidden');
  });

  $('.containerJS').on('click', '.edit-cancel', function(){
    $(this).closest('li').find('.main-container').removeClass('hidden');
    $(this).closest('li').find('.edit-form').addClass('hidden');
  });

  $('.containerJS').on('submit', '.edit-form', function(event){
    event.preventDefault();
    let thisId = $(this).closest('li').attr('id');
    let updateBody = {
      id: thisId,
      subject: $(this).find('.edit-subject').val(),
      author: $(this).find('.edit-author').val(),
      credentials: $(this).find('.edit-credentials').val(),
      title: $(this).find('.edit-title').val(),
      content: $(this).find('.edit-content').val()
    };
    return updateItemById(thisId, updateBody)
        .then(res => {
          console.log(res);
          renderSelector('full');
          this.reset();
        })
      .catch(err => console.error(err));
  });

  $('.containerJS').on('click', '.read-more', function(event){
    event.preventDefault();
    $(this).closest('li').find('.full-content').toggleClass('hidden');
    $(this).closest('li').find('.truncated-content').toggleClass('hidden');
    $(this).closest('li').find('.read-more').toggleClass('hidden');
  });
//Create listeners

  $('#submit-form').on('submit', function(event){
    event.preventDefault();
    $('#myModal').css('display', 'none');
    return postItem()
      .then(() => {
        renderSelector('full');
        this.reset();
      })
      .catch(err => console.error(err));
  });

  $('#create-button').on('click', function(){
    $('#myModal').css('display', 'block');
    this.reset();

  });

  $('.close').on('click', function(){
    $('#myModal').css('display', 'none');
  });
});
