#    .---------- constant part!
#    vvvv vvvv-- the code from above
RED='\033[0;31m'
NC='\033[0m' # No Color

# printf "${NC}STEP 1 : ${RED}Project Compilation \n${NC}"
# npm run build:prod
# ./node_modules/.bin/electron-rebuild

printf "${NC}STEP 2 : ${RED}Rebuild dependencies \n${NC}"
# Electron's version.
export npm_config_target=1.2.3
# The architecture of Electron, can be ia32 or x64.
export npm_config_arch=x64
export npm_config_target_arch=x64
# Download headers for Electron.
export npm_config_disturl=https://atom.io/download/electron
# Tell node-pre-gyp that we are building for Electron.
export npm_config_runtime=electron
# Tell node-pre-gyp to build module from source code.
export npm_config_build_from_source=true
# Install all dependencies, and store cache to ~/.electron-gyp.
HOME=~/.electron-gyp npm install

printf "${NC}STEP 3 : ${RED}App building \n${NC}"
npm run dist --project dist
# mv dist/* "../Coloris 2 - Compiled/"

printf "${RED}Done \n${NC}"
