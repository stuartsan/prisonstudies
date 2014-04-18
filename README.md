##Prison Data Visualization

This is a small frontend web app using AngularJS and D3 to visualize worldwide incarceration data from prisonstudies.org. You can [see it in action here](http://stuartsan.github.io/prisonstudies).

###Run locally
Just clone the repo, `cd` into it and `npm install`. Then you can do `npm start` to start the server (which is just serving static files -- there is really no backend here, just a couple JSON files). Then navigate your browser to `localhost:8000`. Run `grunt watch` to compile SASS, concatenate JS, and livereload the browser on save.

###Scraper
The project also includes a scraper, written in Python using Scrapy, which collects data from prisonstudies.org. To run a fresh scrape and dump it into a JSON file you can `cd` into scraper/scraper and run `scrapy crawl prisonstudies -o data.json -t json`.
