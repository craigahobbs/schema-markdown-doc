# Licensed under the MIT License
# https://github.com/craigahobbs/schema-markdown-doc/blob/main/LICENSE


# Download javascript-build
JAVASCRIPT_BUILD_DIR ?= ../javascript-build
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
$$(shell [ -f $(JAVASCRIPT_BUILD_DIR)/$(notdir $(1)) ] && cp $(JAVASCRIPT_BUILD_DIR)/$(notdir $(1)) . || $(call WGET_CMD, $(1)))
endif
endef
WGET_CMD = if command -v wget >/dev/null 2>&1; then wget -q -c $(1); else curl -f -Os $(1); fi
$(eval $(call WGET, https://craigahobbs.github.io/javascript-build/Makefile.base))
$(eval $(call WGET, https://craigahobbs.github.io/javascript-build/jsdoc.json))
$(eval $(call WGET, https://craigahobbs.github.io/javascript-build/eslint.config.js))


# Include javascript-build
include Makefile.base


help:
	@echo "            [test-doc]"


clean:
	rm -rf Makefile.base jsdoc.json eslint.config.js


doc:
	cp -R static/* build/doc/


.PHONY: test-doc
commit: test-doc
test-doc: build/npm.build
	$(NODE_SHELL) npx bare -x -m static/doc/*.bare static/doc/test/*.bare
	$(NODE_SHELL) npx bare -d -m static/doc/test/runTests.bare$(if $(TEST), -v vUnittestTest "'$(TEST)'")
