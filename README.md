
# about  

a chrome extension to quickly download any media from [https://instagram.com/](instagram.com)  

this extension breaks occasionally (maybe once a month) due to Instagram updating their website. i do my best to repair it asap whenever that happens.  

so before you use this extension, you have to be willing to wait for a fix when something breaks and then [manually re-install the extension](#install).



## latest update

December 24th 2023

this extension has seen a couple of minor breakages since the last update, but i had no time to work on it, sorry about that.  

i've noticed for a while that if you navigate to a users page and then click on their stories, there were no download buttons.  
today i've investigated this issue and found that Instagram has changed the DOM and this broke a couple of queryselectors.  
the latest release should fix that, but as always, no promises.

in my fix, i have switched to querying for aria-labels as they seem to be quite stable.  
however, aria-labels are different from language to language and so with this update, i'm making the requirement that users set their language to english.  
hope this is not much of an inconvenience for you.


## current limitations are:  

- only english browser settings are supported. for other languages, this extension may not work correctly, i.e. downloads can fail or the download button may not show up.
  this is due to the fact that i'm often using aria-label selectors and assuming the aria-labels to be english.  
  moreover, check that the urls of your instagram page doesn't contain language parameters such as `?hl=de` (de is for german). if it does, you can remove that part and reload the page.

- audio is missing from downloaded videos. the reason is that video- and audio parts on instagram are stored in separate files on their servers. when you press download, only the video-part is downloaded. merging the parts into one mp4-file is possible, but the code required will bloat this extension immensely (~20 megabytes). an alternative is to simply download both video and audio together. will have to think more about this.

- video downloads sometimes fail due to a [limitation of chrome extensions to keep background scripts running](https://github.com/flurrux/insta-loader/issues/24#issuecomment-1159406256).  
if that's the case, please refresh the page and try again.  
if it still doesn't work, consider leaving [a bug report here](https://github.com/flurrux/insta-loader/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).  


&nbsp;


# features  

- download-buttons on mainfeed, stories and post pages  
- on the mainfeed or in stories, the enter-key can be pressed to trigger downloads


downloaded videos/images will be saved in `Downloads/[username]`.  
so for example if you download an image from [instagram.com/beeple_crap](https://www.instagram.com/beeple_crap/), it will be placed in `Downloads/beeple_crap/`


<div style="height: 20px;"></div>

### download from main-feed:  

<img src="./demo/mainfeed-download.gif" style="max-height: 350px;" />

<div style="height: 20px;"></div>

### download from stories:  

<img src="./demo/story-download.gif" style="max-height: 350px;" />

<div style="height: 20px;"></div>

# install

<img src="./demo/install.gif" style="max-height: 350px;" />

- click on the latest release to the right of this page and download the zip folder. it will be named something like `insta-loader-vx.x.x.zip`

- extract this zip folder in your Downloads folder or anywhere else.

- go to [chrome://extensions/](chrome://extensions/)

- make sure developer mode is enabled

- click "load unpacked"

- pick the extracted folder
  
- now when you visit [https://instagram.com/](instagram.com), you should see downlad buttons on every post like so:  

![](./demo/download-button-on-main-feed.jpg)

- lastly, make sure that your browser language is set to english or otherwise, the extension might not work correctly.


# uninstall

<img src="./demo/uninstall.gif" style="max-height: 350px;" />

find this extension on [chrome://extensions/](chrome://extensions/), then click "Remove"