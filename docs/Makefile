RM=rm

PANDOC=pandoc

PANDOC_OPTIONS=--standalone -H disable_float.tex

PANDOC_PDF_OPTIONS=-f markdown+smart

SOURCES=INFORME.md MANUAL.md
OUTPUTS=$(SOURCES:%.md=%.pdf)

docs: $(OUTPUTS)

%.pdf: %.md
	$(PANDOC) $(PANDOC_OPTIONS) $(PANDOC_PDF_OPTIONS) -o $@ $<

watch:
	ls *.md | entr make

clean:
	$(RM) *.pdf

.PHONY: docs clean watch
