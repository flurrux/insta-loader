import shutil

def main():
	shutil.rmtree('.parcel-cache', ignore_errors=True)

main()	