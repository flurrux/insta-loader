import requests
import math


url = 'https://scontent-frx5-1.cdninstagram.com/vp/f57c88f0114f08d73e33122e04bbf579/5C9C3974/t51.12442-15/e35/53723017_379170572668279_5946853374603391537_n.jpg?_nc_ht=scontent-frx5-1.cdninstagram.com'
write_path = '/home/christian/Corn/Babes/camillerodrigues_oficial/53723017_379170572668279_5946853374603391537_n.jpg'

# Streaming, so we can iterate over the response.
req = requests.get(url, stream=True)

# Total size in bytes.
total_size = int(req.headers.get('content-length', 0)); 
block_size = 1024
wrote = 0 
with open(write_path, 'wb') as f:
    for data in req.iter_content(block_size):
        wrote = wrote  + len(data)
        print(str(float(wrote) / float(total_size)))
        f.write(data)

if wrote != total_size:
	print("something went wrong")

