
#!/bin/sh

if [ -z "$GH_TOKEN" ]; then
	echo "You must set the GH_TOKEN environment variable."
	echo "See README.md for more details."
	exit 1
fi

#    .---------- constant part!
#    vvvv vvvv-- the code from above
RED='\033[0;31m'
NC='\033[0m' # No Color

printf "${RED}Project Compilation \n${NC}"
npm run build:prod

printf "${RED}Build & Deploy on Github \n${NC}"
node_modules/.bin/build -mwl -p always

printf "${RED}Done \n${NC}"