# Licensed under the MIT License
# https://github.com/craigahobbs/schema-markdown-doc/blob/main/LICENSE

# Download JavaScript Build
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
_WGET := $$(shell $(call WGET_CMD, $(1)))
endif
endef
WGET_CMD = if which wget; then wget -q $(1); else curl -Os $(1); fi
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/Makefile.base))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/jsdoc.json))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/.eslintrc.cjs))

# Set gh-pages source
GHPAGES_SRC := build/app/

# Include JavaScript Build
include Makefile.base

clean:
	rm -rf Makefile.base jsdoc.json .eslintrc.cjs

help:
	@echo '            [app|run|'

.PHONY: run
run: app
	python3 -m http.server --directory build/app

.PHONY: app
commit: app
app: build/npm.build
	rm -rf build/app/
	mkdir -p build/app/

    # Copy dependencies
	cp -R \
		static/* \
		src/schema-markdown-doc \
		node_modules/element-model/src/element-model \
		node_modules/markdown-model/src/markdown-model \
		node_modules/markdown-model/static/markdown-model.css \
		node_modules/schema-markdown/src/schema-markdown \
		build/app/

    # Fix imports
	for FILE in `find build/app/* -name '*.js'`; do \
		sed -E "s/from '([^\.])/from '..\/\1/g" $$FILE > $$FILE.tmp && \
		mv $$FILE.tmp $$FILE; \
	done
