[![Build Status](https://travis-ci.org/htwright/capstone-5-8.svg?branch=master)](https://travis-ci.org/htwright/capstone-5-8)]


Rendering - 

renderSelector -> get function -> render function

the renderSelector accepts two parameters - opt and terms. opt is how we select how we want to generate our array to render. Terms is an array that defaults to empty, therefore we can simply call renderSelector('full')
to run our getAll and return an array of all DB items to our render, however our getBySearchTerm and getBySubject need an array of terms in order to function.

based on the parameters renderSelector is called with, it will pass a formatted array into render(). Render accepts
an array of objects and renders their HTML to the screen.

!!!!!!!getBySubject, getBySearchTerm, and render are ONLY to EVER be called by the renderSelector!!!!!!

search bar - 

When the user presses the submit button next to the search box, their input is split into an array of strings.
Then we iterate over every item in our database and return an array with database items who have at least one
of the strings in the search array in their content. Some protections are done - I.E. if no search results,
we log out no results and render all data, all items in the seach term array and each item content array is
forced toLowerCase().

Subject search -

The search button triggers us to get all tiems from the database and return an array to our render function
containing items who's subject field matches the subject passed by the button exactly.