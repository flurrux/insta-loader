
  
  
# about
a chrome extension to quickly download any media from instagram.com.




# install

  

1. download this repository to a suitable directory

2. go to chrome://extensions/

3. make sure "developer mode" is enabled

4. click "load unpacked"

5. pick the "/app" folder from the downloaded repository


### to use direct download to disk, do additionally:

6. make sure python2.7 is installed, e.g with `python --version` from the terminal.
download and install it from [https://www.python.org/downloads/release/python-2716/](https://www.python.org/downloads/release/python-2716/) if necessary.

7. go to the "/host/windows" - or "/host/linux_mac" folder in the downloaded repository, 
depending on your operating system.  

8. #### if on windows (chrome only)

	8.1. execute "install_host.bat", this will make the native host available for chrome

	8.2. locate the python.exe from the python2.7 installation, for example: "C:\Python27\python.exe"

	8.3. open "insta_loader_host_starter.bat" and replace the string "python" with that path,
	for example: "C:\Python27\python.exe" "%~dp0/insta_loader_host" %*

8. #### if on linux (chrome or chromium) (mac untested)

	9.1. look up the correct target folder (https://developer.chrome.com/apps/nativeMessaging#native-messaging-host-location)

	9.2. copy the files "insta_loader_host.json", "insta_loader_host_starter.sh" and "insta_loader_host.py" into that folder

	9.3. open "insta_loader_host.json" with a text-editor and set the value of "path" to the absolute path of "insta_loader_host_starter.sh"

	9.4. "insta_loader_host_starter.sh" must have execute-permission,
	to do this on linux, open a terminal, navigate to the folder and execute:
	`chmod a+rx insta_loader_host_starter.sh`

  

9. set allowed origin:
	
	10.1. look up the id of the unpacked extension
	
	10.2. open "filesystem_host.json" with a text-editor and set "allowed_origins" to ["chrome-extension://[ID]/"]
	the trailing slash after ID is important!

  

10. specify download path

	10.1. on the chrome://extensions/ page, locate the extension and click on "Details"

	10.2. click on "Extension options"

	10.3. enter the absolute path of your desired download path at "download directory",
	for example (ubuntu): "/home/fritz/Videos/tricking"

  
  
  

# uninstall

find the extension on chrome://extensions/ by the id or name, then click "Remove"

additionally, if download-to-disk was used:

#### if on windows

1. execute "uninstall_host.bat", this removes the host from the registry

#### if on linux/max

1. look up the correct target folder (https://developer.chrome.com/apps/nativeMessaging#native-messaging-host-location)

2. delete the files "insta_loader_host.json", "insta_loader_host_starter.sh" and "insta_loader_host.py" from that folder