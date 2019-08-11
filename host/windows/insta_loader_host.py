#!/usr/bin/env python
import struct
import sys
import os
import urllib
import ast
import json

import requests
import math

# functions:
# - path exist
# - download file to path

# never use print when calling from chrome. the print call will taint the stdout stream

# usage:
# pass a stringified json into this script, the json must look like this:
# {
# 	"requests": [
#			{
#				"action": "check path existence" || "write media by link",
#				"data": "some/path/to/check" || {
#					"folderPath": "/some/path/to/folder"
#					"fileName": "randomFileName.jpg",
#					"link": "randomMediaLink.jpg"
#				}
#			}
#		]
# }
#	after the requests are handled, the feedback may looks like this:
#	{
#		"result": [
#			{ "type": "error", "data": "wrong key somewhere" },
#			{ "type": "success", data: "writtenFilePath.jpg" }
#		]
# }
# [terminal]: python insta_loader_host '{"requests": [{"action": "check path existence", "data": "some/path/file"}]}'


# On Windows, the default I/O mode is O_TEXT. Set this to O_BINARY
# to avoid unwanted modifications of the input/output streams.
if sys.platform == "win32":
  import os, msvcrt
  msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
  msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
  
# Helper function that sends a message to the webapp.
def send_message(message):
	write_to_debug("send message")
  # Write message size.
	sys.stdout.write(struct.pack('I', len(message)))
  # Write the message itself.
	sys.stdout.write(message.encode('utf-8'))
	sys.stdout.flush()
  
def write_to_debug(message):
	file = open('debug file.txt', 'w')
	file.write(message)
	file.close()

def download_file_with_callback(url, path, progress_callback):

	# Streaming, so we can iterate over the response.
	req = requests.get(url, stream=True)

	# Total size in bytes.
	total_size = int(req.headers.get('content-length', 0)); 
	
	block_size = 1024
	wrote = 0 
	with open(path, 'wb') as f:
		for data in req.iter_content(block_size):
			wrote = wrote  + len(data)
			progress = float(wrote) / float(total_size)
			progress_callback(progress)
			f.write(data)

	if wrote != total_size:
		raise ValueError('written size does not match total size, total size: ' + str(total_size) + ', written size: ' + str(wrote))


def download_file_and_send_progress(path, url):
	def callback(progress):
		msg = '[{ "type": "progress", "data": { "progress": ' + str(progress) + ' } }]'
		send_message(msg)
		#for some fucked up reason, python refuses to send a message with the link or url in it, only progress is allowed. fuck you python.
		#send_message('[{ "type": "progress", "data": { "link": ' + str(url) + ', "progress": ' + str(progress) + ' } }]')		
		#send_message('[{ "type": "progress", "data": { "link": ' + url + ', "folderPath": ' + path + ', "progress": ' + str(progress) + ' } }]')

	download_file_with_callback(url, path, callback)


def download_file(path, url):
	urllib.urlretrieve(url, path)



# Thread that reads messages from the webapp.
def read_thread_func():

	#write_to_debug("start");

	executionMode = "chrome extension"
	if executionMode == "terminal":
		inputText = sys.argv[1]
	elif executionMode == "chrome extension":
		# Read the message length (first 4 bytes).
		text_length_bytes = sys.stdin.read(4)
		if len(text_length_bytes) == 0:
			sys.exit(0)
		# Unpack message length as 4 byte integer.
		text_length = struct.unpack('i', text_length_bytes)[0]
		# Read the text (JSON object) of the message.
		text = sys.stdin.read(text_length).decode('utf-8')
		inputText = ast.literal_eval(text)

	# print "input: " + inputText	
	requestData = json.loads(inputText)
	requestArray = requestData["requests"]
	#write_to_debug("request is ready");	

	resultArray = []
	for index, request in enumerate(requestArray):
		resultObject = {}
	
		if not 'action' in request:
			resultObject['type'] = 'error'
			resultObject['data'] = 'wrong action-key'
	
		elif not 'data' in request:
			resultObject['type'] = 'error'
			resultObject['data'] = 'wrong data-key'
	
		else:
			action = request['action']
			data = request['data']
			if action == "check path existence":
				pathExists = os.path.exists(data)
				resultObject['type'] = 'success'
				resultObject['data'] = pathExists
			
			elif action == "write media by link":
				if not ('link' in data and 'folderPath' in data and 'fileName' in data):
					resultObject['type'] = 'error'
					errorMessage = ""
					if not 'link' in data:
						errorMessage = "wrong link-key"
					elif not 'folderPath' in data:
						errorMessage = "wrong folderPath-key"
					elif not 'fileName' in data:
						errorMessage = "wrong fileName-key"
					resultObject['data'] = errorMessage
				else:			
					try:
						mediaFolderPath = data['folderPath']
						mediaName = data['fileName']
						mediaSrc = data['link']
						#print mediaSrc

						if not os.path.exists(mediaFolderPath):
							os.makedirs(mediaFolderPath)

						mediaPath = os.path.join(mediaFolderPath, mediaName)
						if not os.path.isfile(mediaPath):
							download_file_and_send_progress(mediaPath, mediaSrc)

						resultObject['type'] = 'success'
						resultObject['data'] = mediaPath

					except Exception, exceptionObj:
						resultObject['type'] = 'error'
						resultObject['data'] = str(exceptionObj)

		resultArray.append(resultObject);	


	resultArrayJson = json.dumps(resultArray)
	#print resultArrayJson
	#write_to_debug("result is ready");	

	result = resultArrayJson
	sys.stdout.write(struct.pack('I', len(result)))
	#write_to_debug("after write length")
	# Write the message itself.
	sys.stdout.write(result.encode('utf-8'))
	#write_to_debug("after write json") 
	sys.stdout.flush()
	#write_to_debug("after flush")
	#write_to_debug(result)

def Main():
	read_thread_func()
	sys.exit(0)

if __name__ == '__main__':
  Main()
