RM=rm

PANDOC=pandoc

PANDOC_OPTIONS=--standalone

PANDOC_PDF_OPTIONS=-f markdown+smart

docs: INFORME.pdf MANUAL.pdf

%.pdf: %.md
	$(PANDOC) $(PANDOC_OPTIONS) $(PANDOC_PDF_OPTIONS) -o $@ $<

clean:
	$(RM) *.pdf

.PHONY: docs clean