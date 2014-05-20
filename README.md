##Prison Data Visualization

This is a small frontend web app using AngularJS and D3 to visualize worldwide incarceration data from prisonstudies.org. You can [see it in action here](http://stuartsan.github.io/prisonstudies). Uses [angular-seed](https://github.com/angular/angular-seed), a bare-bones sensible starting point for Angular apps, hence all the contributors and long commit history.

###Run locally
Just clone the repo, `cd` into it and `npm install`. Then you can do `npm start` to start the server (which is just serving static files -- there is no backend here, just a couple JSON files). Then navigate your browser to `localhost:8000`. Run `grunt watch` to compile SASS, concatenate JS, and livereload the browser on save.

###Scraper
The project also includes a scraper, written in Python using Scrapy, which collects data from prisonstudies.org. To run a fresh scrape and dump it into a JSON file you can `cd` into scraper/scraper and run `scrapy crawl prisonstudies -o data.json -t json`.

###Todo
- Write more tests
- Find out from researchers and others interested in the subject what would make the tool more useful
- Clean up some general formatting issues, esp. in the formatted display of numbers
- Style for smaller screens
