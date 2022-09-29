
# about  

a chrome extension to quickly download any media from [https://instagram.com/](instagram.com)  


# current major issues (29. September 2022)  

i've noticed today that many stories fail to download, while some other stories can be downloaded as usual. those stories that fail to download have a blob-url as a src, while the downloader expects an mp4-url.  
i don't know the reason for this difference. maybe those stories that were published before the update still continue to work but time will tell.  
i have dug into the network requests a little bit and found that there is one request for all stories and its url is `https://i.instagram.com/api/v1/feed/reels_media/?reel_ids=[reel ID]`.  
from the response, i was able to find the mp4-url of each story: 
`response.reels_media[0].items[storyIndex].video_versions[0].url`.  
it looks as if the first item in `video_versions` is the highest quality one, but each item has a `width` and `height` property, so it should be no issue finding the best one.  
anyway, i'm trying to fix this asap!



## current minor bugs are:  

- stories downloaded from the highlights tray are saved into the folder `Downloads/null` instead of `Downloads/[username]`.  
this bug is already fixed but not released yet.  
if this is a big issue for you, please leave a comment [here](https://github.com/flurrux/insta-loader/issues/23) and i will release the next version faster.  
- video downloads sometimes fail due to a [limitation of chrome extensions to keep background scripts running](https://github.com/flurrux/insta-loader/issues/24#issuecomment-1159406256).  
if that's the case, please refresh the page and try again.  
if it still doesn't work, consider leaving [a bug report here](https://github.com/flurrux/insta-loader/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).  

&nbsp;


# features  

- download-buttons on mainfeed, stories and post pages  
- on the mainfeed or in stories, the enter-key can be pressed to trigger downloads

currently broken: 

- jump to lower/upper post on the mainfeed by `w` (upper post) or `s` (lower post)  
- navigate left/right on carousels (with multiple pictures/videos) and in stories via the `d` (navigate right) and `a` (navigate left) keys.  


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