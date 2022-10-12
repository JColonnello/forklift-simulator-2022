

all: docs build

build:
	yarn build

docs:
	make -C docs

clean:
	make -C docs clean
	rm -rf node_modules

.PHONY: all docs build clean