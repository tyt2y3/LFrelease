git add .
git commit -am 'release'
git checkout gh-pages
git merge master
git checkout master
git push

# baseurl='http://tyt2y3.github.com/LFrelease/LF2_19/data/'
# cd LF2_19
# echo \n\n###LF2_19\n\n####sprite\n `find sprite -type f -printf "[%f](${baseurl}%p)\t"` > readme.md
