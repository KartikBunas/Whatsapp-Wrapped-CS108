PDF = report.pdf
TEX = main.tex
REF = references.bib
BASE = main

all: $(PDF)

$(PDF): $(TEX) $(REF)
	pdflatex $(TEX)
	bibtex $(BASE)
	pdflatex $(TEX)
	pdflatex $(TEX)
	mv $(BASE).pdf $(PDF)

clean:
	rm -f *.aux *.log *.out *.toc *.blg *.bbl

view: $(PDF)
	explorer.exe $(PDF)
