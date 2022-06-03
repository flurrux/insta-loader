

# attention!  

instagram made an update which breaks this extension badly.  
with my most recent release, it's still possible to download stories and images from posts but **not** videos from posts!

i've seen a couple other instagram-scraper experience the same issue:  
https://github.com/arc298/instagram-scraper/issues/805  
https://github.com/instaloader/instaloader/issues/1553

the problem is, that when you do a fetch request for some instagram post, there is no source data for images and videos anymore.  

one immediate workaround for images is to simply download from the source in the browser.  

videos are way more tricky since they use hard-to-download blob sources.  
i've found that one can obtain the url of a video via the network panel in chromes developer tools.  
just remove the last two url parameters bytestart and byteend (or something like that).  
don't know yet if this can be automated.  
as a last resort, it should be possible to grab all frames from a video and re-encode them.  

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