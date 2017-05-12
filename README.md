[![Build Status](https://travis-ci.org/htwright/capstone-5-8.svg?branch=master)](https://travis-ci.org/htwright/capstone-5-8)]

# Knowledge Bomb

 ### Rendering  
The renderSelector accepts two parameters: opt and terms. Opt is how we select how to generate our array to render. Terms is an array that defaults to empty, therefore we can simply call renderSelector('full') to run our getAll function and return an array of all Database items to our render function. 
RenderSelector will pass a formatted array into render(). Render accepts an array of objects and renders their HTML to the screen.

### Search Bar
When the user presses the submit button next to the search box, their input is split into an array of strings.
Then we iterate over every item in our database and return an array with database items that have at least one of the strings in the search array in their content. 

### Subject Search
The search buttons allows users to search for a particular topic when they click it.  Only the items containing the subject that was clicked will appear.

### Screenshots 
Homepage: https://gyazo.com/a6157eecd943af4c38113d9f760632fb

Create Page: https://gyazo.com/a4aeb7e1ec7097c7270b13a2d1c99fd6

ReadMore: https://gyazo.com/15299d9faa2e7b5fde922bde07477280

Edit: https://gyazo.com/a6a4fa675bc8c56852c9f59a66e11a81

### Summary
Knowledge Bomb is a place where users can go to learn about anything, as well as share their expertise in something they're passionate about. The idea behind Knowledge Bomb is to give people an easy place to share their knowledge of what they love, and give everyone the ability to learn whatever they want from others who have a unique perspective on a particular subject. From my experience it’s always much more fun to learn when you are able to read something from a writer who is clearly passionate and knowledgeable about what they are writing. With the click of a button, you can learn about Math, Science, or maybe even Cooking, from people who are willing to share their knowledge with the world. 

### Technology Used
HTML, CSS, Javascript, Jquery, Mongo, Mongoose
