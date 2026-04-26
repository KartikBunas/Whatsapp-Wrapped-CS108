PDF = main.pdf
TEX = main.tex
REF = references.bib

all: $(PDF)

$(PDF): $(TEX) $(REF)
	pdflatex $(TEX)
	bibtex $(basename $(TEX))
	pdflatex $(TEX)
	pdflatex $(TEX)

clean:
	rm -f *.aux *.log *.out *.toc *.blg *.bbl $(PDF)

view: $(PDF)
	explorer.exe $(PDF)
