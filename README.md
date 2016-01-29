ntdst project setup

1. clone into projects folder

cd C:\Users\ntdst\Projects\NT-Sites\source\ntdst\{PROJECT}
git clone git://github.com/netdust/ntdst-project.git

2. create symlink

cd C:\Users\ntdst\Projects\NT-Sites\source\ntdst\{PROJECT}\dev
mklink /D admin C:\Users\ntdst\Projects\NT-Sites\admin

3. update host file

127.0.0.1   PROJECT.local

4. install npm

npm install