# MyMap: Rothenburg / Tauber
##### Udacity FEND Neighborhood Map (Project 5)

**MyMap: Rothenburg / Tauber** is a simple map application to explore my top tips to visit should you ever find yourself in _Rothenburg ob der Tauber, Germany_.

## How to use it
* Use the live version at http://spinne.github.io/Neighborhood-Map/
* Download the Git Repo and open **dist/index.html** in a browser _(only tested in Chorme and Firefox)_
 
And then just click on the markers or search my tips.

##### Admin Mode
There is a hidden admin mode to `console.log()` or `clear()` LocalStorage. To access it type 'admin' into the search field.

## Dependencies & Resources
Needed to run (included in the Git Repo):
* jQuery 2.1.4
* Knockout 3.4.0 

The application also uses:
* Google Maps API
* Foursquare API
* and uses LocalStorage

There is a fallback, if
* Either API can't becalled
* LocalStorage is empty or unavailable

... but the MyMap won't be as much fun.

### Resources
Since I got stuck on this project I've read a lot of stuff, and to tell the truth I can't remember even half of it. But there are a few resources I've used a lot: 
* Udacity Discussion Forum
* Google Maps API Documentation
* Knockout Documentation and Tutorials
* jQuery Documentation
* http://www.selfhtml.de
* http://www.w3schools.com/
* http://www.smashingmagazine.com/
* http://stackoverflow.com
* http://jshint.com/
* https://css-tricks.com/three-line-menu-navicon/
* http://www.sitepoint.com/shorthand-javascript-techniques/
* http://charliegleason.com/articles/deploying-to-github-pages-with-gulp

**Thank you!**

## Issues
* Google Docs Extenstion: For some reason I had trouble with Google Maps (not click or movable) when I couldn't use my fallback data for Foursquare (Empty LocalStorage). Once I deactivated the Google Docs Chrome Extenstions it worked. 

## License
Knockout and jQuery are licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
Foursquare has its own license [here](https://de.foursquare.com/legal/api/licenseagreement).
And the terms and usage limits for Google Maps API can be found [here](https://developers.google.com/maps/)