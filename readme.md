# Hub List
Hub List is an [open source GTD style productivity app](http://hublistapp.com) written entirely in JavaScript using [Ext JS 4](http://www.sencha.com/products/extjs/). It's a [CouchApp](http://couchapp.org/page/what-is-couchapp) which means it can be served directly from any CouchDB instance without the need for a seperate server side application stack!

![Screenshots](http://dl.dropbox.com/u/946636/HL-Readme-Screnshots.png)

## Status
The app is currently under heavy development and not ready for situations where data loss will ruin your day. I'm in the process of replicating the functionality from the previous version of Hub List which was built with Ext JS 3.x. As soon as the core functionality is complete the app will be ready for everyday use. The first screenshot is what the app currently looks like. The second and third screenshots are where it's headed.

## App Requirements
- [CouchDB](http://www.couchbase.com/downloads) (1.1+)
- A modern web browser

## Deployment Requirements
This version is forked to be deployed with reupholster.

1. clone this repo
```
git clone  https://github.com/ryanramage/Hub-List_GTD-Productivity Hub-List
```

2. open reupholster
To start reupholster, click on the launch button on this page:
```
http://reupholster.iriscouch.com/reupholster/_design/app/index.html
```
Choose the directory containing the project. Change the couch settings to your likings. Click start.
You should see the app get launched in your browser. Changes you make to the code will be updated
in realtime.



## Wishlist
- Distribute CouchApps as native desktop applications.

I'd love to distribute native desktop versions of Hub List for Mac, Windows and Linux. If anyone has experience or a desire to hack the CouchDB source code and existing platform intallers so desktop versions of CouchDB could immediately launch into a CouchApp, let me know.

## Developer Contributions & Discussion
Contributions are welcome! To contribute code or design simply fork this repo and initiate a pull request when you're ready to merge. For best results get in touch via twitter [@hublistapp](http://twitter.com/#!/hublistapp) with questions. 

## License
The Hub List source is available under an open source or commercial license. The open source license is the [GPL v3 License](http://opensource.org/licenses/gpl-3.0.html). A commercial license is available for those interested in including Hub List source code in non-open source applications. Please [get in touch](http://twitter.com/#!/hublistapp) for more information on the commercial license.

## Links
[Main Website - http://hublistapp.com](http://hublistapp.com)  
[Development Blog - http://hublistapp.com/blog](http://hublistapp.com/blog)  
[End User Support & Feature Requests](http://getsatisfaction.com/nimbleapps)  
API Documentation - Coming Soon (powered by [JSDuck](https://github.com/nene/jsduck))  
Twitter [@hublistapp](http://twitter.com/#!/hublistapp)  
