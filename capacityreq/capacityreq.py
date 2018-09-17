import csv
import math
import sys

numrows=0
energies=[]
capacity=0
rounding=-1
numpoints=0
numclass1=0

if (len(sys.argv)==1) or (len(sys.argv)>3):
	print "Usage:"
	print sys.argv[0]+" <filename.csv> [<sigdigits>]" 
	print "Estimates the maximum capacity needed for a neural network to train the data given in CSV file."
        print "<filename.csv> -- comma separated value file with last row being the class" 
	print "<sigdigits> -- optional: number of significant digits after decimal point (for noisy data), default all." 
        print
	print "Note: This program only gives reliable results for balanced two-class problems." 
        print 
	sys.exit()

if (len(sys.argv)>2):
	rounding=int(sys.argv[2])
	print "Significant digits: ",rounding

class1=''

with open(sys.argv[1],'rb') as csvfile:
    csvreader = csv.reader(csvfile) 
    for row in csvreader:	
	numpoints=numpoints+1
        result = 0
	numrows=len(row[:-1])
        for elem in row[:-1]:
            result = result + float(elem) 
	c = row[-1]
	if (class1==''):
		class1=c
	if (c==class1):
		numclass1=numclass1+1
	if (rounding!=-1):
		result=int(result*math.pow(10,rounding))/math.pow(10,rounding)
	energies=energies+[(result, c)]
sortedenergies=sorted(energies, key=lambda x: x[0])
curclass=sortedenergies[0][1]
changes=0
for item in sortedenergies:
	if (item[1]!=curclass):
		changes=changes+1
		curclass=item[1]

clusters=changes+1
mincuts=math.ceil(math.log(clusters)/math.log(2))
capacity=mincuts*numrows
#tmlpcap=mincuts*(numrows+1)+(mincuts+1)

# The following assume two classes!
entropy=-((float(changes)/numpoints)*math.log(float(changes)/numpoints)+(float(numpoints-changes)/numpoints)*math.log(float(numpoints-changes)/numpoints))/math.log(2)

print "Input dimensionality: ", numrows, ". Number of points:", numpoints, ". Class balance:", float(numclass1)/numpoints 
print "Eq. energy clusters: ", clusters, "=> binary decisions/sample:", entropy
print "Max capacity need: ", (changes*(numrows+1))+changes,"bits"
print "Estimated capacity need: ",int(math.ceil(capacity)),"bits"

