docs: index.html

index.html: docs/index.md
	markdown < $< \
	  | cat head.html - tail.html  \
	  > index.html

.PHONY:  docs 
