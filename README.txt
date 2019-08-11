

INSTALL ###

- download this repository 
- go to chrome://extensions/
- make sure "developer mode" is enabled
- click "load unpacked"
- pick the /app folder from the download repository


to use direct download to disk, do additionally: 

	- make sure python2.7 is installed

	- go to the "/host" folder (downloaded repository)
	- if on windows (chrome only)
		- execute "install_host.bat", this will make the native host available for chrome 
		- locate the python.exe from the python2.7 installation, for example: "C:\Python27\python.exe"
		- open "insta_loader_host_starter.bat" and replace the string "python" with that path, 
		for example: "C:\Python27\python.exe" "%~dp0/insta_loader_host" %*
	- else if on linux (chrome or chromium) (mac untested)
		- look up the correct target folder (https://developer.chrome.com/apps/nativeMessaging#native-messaging-host-location) 
		- copy the files "insta_loader_host.json", "insta_loader_host_starter.sh" and "insta_loader_host.py" into that folder 
		- open "insta_loader_host.json" with a text-editor and set the value of "path" to the 
		absolute path of "insta_loader_host_starter.sh" 
		- "insta_loader_host_starter.sh" must have execute-permission, 
		to do this on linux, open a terminal, navigate to the folder and type: 
		chmod a+rx insta_loader_host_starter.sh

	- set allowed origin: 
		- look up the id of the unpacked extension
		- open "filesystem_host.json" with a text-editor and set "allowed_origins" to ["chrome-extension://[ID]/"] 
		the trailing slash after ID is important!

	- specify download path 
		- on the chrome://extensions/ page, locate the extension and click on "Details"
		- click on "Extension options"
		- enter the absolute path of your desired download path at "download directory",
		for example: "/home/fritz/Videos/tricking" (linux)



UNINSTALL ###

if download to disk was used
	- if on windows
		- execute "uninstall_host.bat", this removes the host from the registry
	- else if on linux/max
		- look up the correct target folder (https://developer.chrome.com/apps/nativeMessaging#native-messaging-host-location) 
		- delete the files "insta_loader_host.json", "insta_loader_host_starter.sh" and "insta_loader_host.py" from that folder

- find the extension on chrome://extensions/ by the id or name, then click "Remove"