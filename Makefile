SRC_DIR = source
BUILD_DIR = build

BASE_FILES = ${SRC_DIR}/jquery.require.js\
	${SRC_DIR}/jquery.require.script.js\
	${SRC_DIR}/jquery.require.stylesheet.js\
	${SRC_DIR}/jquery.require.template.js

all: premake module require min

premake:
	mkdir -p ${BUILD_DIR}

module:
	cp ${SRC_DIR}/jquery.module.js ${BUILD_DIR}

require:
	@@cat ${BASE_FILES} > ${BUILD_DIR}/jquery.require.js

min:
	uglifyjs --unsafe ${BUILD_DIR}/jquery.module.js > ${BUILD_DIR}/jquery.module.min.js
	uglifyjs --unsafe ${BUILD_DIR}/jquery.require.js > ${BUILD_DIR}/jquery.require.min.js
