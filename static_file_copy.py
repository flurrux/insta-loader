import shutil, errno

def copy_folder(src, dst):
	try:
		shutil.copytree(src, dst)
	except OSError as exc: # python >2.5
		if exc.errno in (errno.ENOTDIR, errno.EINVAL):
			shutil.copy(src, dst)
		else: raise

def main():
	shutil.rmtree('./dist/icons', ignore_errors=True)
	copy_folder('./app/icons', './dist/icons')

main()