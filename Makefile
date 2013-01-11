release:
	git checkout master
	git add .
	git commit -m 'release'
	git checkout gh-pages
	git merge master
	git checkout master
	git push

