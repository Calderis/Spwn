# Coloris 2
##### Actual version : 2.0.0
This is a new version of coloris. Find the original program here : [Coloris].

The software is again under GNU license but is based on Angular 2 and Electron.

### More features are coming out : 
- Auto update
- Easier installation
- New interface
- More module
- Project management
- Less bugs
- New design
- More explanation on how to develop myself (meaning YOU can also participate ;) )

## How to install the software : 
Find latest version [On our website] depending of your os.
Maybe if I find how to do, I'll use github release feature.

## How to get the code : 

1) Get the code with `git clone https://github.com/Calderis/coloris-2
2) Open the folder `cd coloris-2`
3) Install packages `npm install`

You'll find all the code inside src/

If you want to compile the programm, then execute my little shell script `sh build.sh` or else open package.json et look into "scripts", you may find instructions that interest you. To execute on of them, do `npm run ______` where ____ is the instruction (example : `npm run build:prod`).

### Dependencies
What you need to run this app (only for those who want to develop the program, the compiled version doesn't need those):
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v6.x.x`+ (or `v7.x.x`) and NPM `3.x.x`+

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file) 

Once you have those, you should install these globals with `npm install --global`:
* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)
* `karma` (`npm install --global karma-cli`)
* `protractor` (`npm install --global protractor`)
* `typescript` (`npm install --global typescript`)

### If you want to build for different os than your
Go and see the documentation ofr [multiplatform building].

[Coloris]: <http://calderis.github.io/Coloris>
[On our website]: <http://coloris-app.fr>
[multiplatform building]: <https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build#os-x>