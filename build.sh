#    .---------- constant part!
#    vvvv vvvv-- the code from above
RED='\033[0;31m'
NC='\033[0m' # No Color

printf "${NC}INITIALISATION : ${RED}Delete files into Compiled folder/ \n${NC}"
rm -rf ../Coloris\ 2\ -\ Compiled/
mkdir ../Coloris\ 2\ -\ Compiled

printf "${NC}STEP 1 : ${RED}Project Compilation \n${NC}"
npm run build:prod

printf "${NC}STEP 2 : ${RED}App building \n${NC}"
npm run dist --project dist
# mv dist/* "../Coloris 2 - Compiled/"

printf "${RED}Done \n${NC}"