# Licensed under the MIT License
# https://github.com/craigahobbs/schema-markdown-doc/blob/main/LICENSE


# Download javascript-build
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
_WGET := $$(shell $(call WGET_CMD, $(1)))
endif
endef
WGET_CMD = if which wget; then wget -q -c $(1); else curl -f -Os $(1); fi
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/Makefile.base))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/jsdoc.json))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/.eslintrc.cjs))


# Include javascript-build
include Makefile.base


help:
	@echo "            [test-doc]"


clean:
	rm -rf Makefile.base jsdoc.json .eslintrc.cjs


doc:
	cp -R static/* build/doc/


.PHONY: test-doc
commit: test-doc
test-doc: build/npm.build
	$(NODE_DOCKER) npx bare -s static/doc/*.mds static/doc/test/*.mds
	$(NODE_DOCKER) npx bare -c "include <markdownUp.bare>" static/doc/test/runTests.mds
