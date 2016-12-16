release:
	git add .
	git commit -m 'release'
	git checkout gh-pages
	git merge master
	git checkout master
	git push

list:
	baseurl='http://tyt2y3.github.com/LFrelease/'
	find demo -maxdepth 1 -type f -printf "[\`%f\`](${baseurl}%p)\t"
	clear
	find demo/milestone -maxdepth 1 -type f -printf "[\`%f\`](${baseurl}%p)\t"
	clear
	find data -maxdepth 1 -type f -printf "[\`%f\`](${baseurl}%p)\t"
	clear
	find sprite -maxdepth 1 -type f -printf "[\`%f\`](${baseurl}%p)\t"
