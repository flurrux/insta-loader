

# attention!  

instagram made an update which breaks this extension badly.  
with the latest version (v1.2.1), all download buttons are gone.  
i've managed to bring them back, but trying to download media from any post will result in an error.  
luckily, stories can still be downloaded without problem.  
with the release v1.2.2 you should at least be able to download stories.  

i've seen a couple other instagram-scraper experience the same issue:  
https://github.com/arc298/instagram-scraper/issues/805
https://github.com/instaloader/instaloader/issues/1553

the problem is, that when you do a fetch request for some instagram post, there is no source data for images and videos anymore.  

one immediate workaround for images is to simply download from the source in the browser.  

videos are way more tricky since they use hard-to-download blob sources.  
it should in principle be possible to grab all frames from a video and re-encode it. inefficient? yes! but as a last resort it may do.  

will make another release as soon as i can!

# about  

a chrome extension to quickly download any media from [https://instagram.com/](instagram.com)  

# features  

- download-buttons on mainfeed, stories, userpages and generally any kind of feeds like tags or locations  
- jump to lower/upper post on the mainfeed by `w` (upper post) or `s` (lower post)  
- navigate left/right on carousels (with multiple pictures/videos) and in stories via the `d` (navigate right) and `a` (navigate left) keys.  
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

### download from userpage:  

<img src="./demo/userpage-download.gif" style="max-height: 350px;" />

(longer gifs are intentionally choppy to reduce filesize)

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

# uninstall

<img src="./demo/uninstall.gif" style="max-height: 350px;" />

find this extension on [chrome://extensions/](chrome://extensions/), then click "Remove"