import csv
import math
import sys

numrows=0
energies=[]
capacity=0
rounding=-1

if (len(sys.argv)==1) or (len(sys.argv)>3):
	print "Usage:"
	print sys.argv[0]+" <filename.csv> [<sigdigits>]" 
	print "Creates a classifier for the data given in CSV file."
        print "<filename.csv> -- comma separated value file with last row being the class" 
	print "<sigdigits> -- optional: number of significant digits after decimal point (for noisy data), default all." 
        print 
	sys.exit()

if (len(sys.argv)>2):
	rounding=int(sys.argv[2])

with open(sys.argv[1],'rb') as csvfile:
    csvreader = csv.reader(csvfile) 
    for row in csvreader:
        result = 0
	numrows=len(row[:-1])
        for elem in row[:-1]:
            result = result + float(elem)
	c = row[-1]
	if (rounding!=-1):
		result=int(result*math.pow(10,rounding))/math.pow(10,rounding)
	energies=energies+[(result, c)]
sortedenergies=sorted(energies, key=lambda x: x[0], reverse=True)
curclass=sortedenergies[0][1]
thresholds = []
changes=0
collisions=0
olditem=sortedenergies[0]
for item in sortedenergies[1:]:
	if (item[1]!=curclass):
		changes=changes+1
		curclass=item[1]
		if (olditem[0]==item[0]):
			collisions=collisions+1.0	
		thresholds=thresholds+[(float(olditem[0]+item[0])/2,olditem[1])]
	olditem=item

print "#Classifier created from "+sys.argv[1] 
print "#Number of if statements:",len(thresholds)
print "#Test on train accuracy:", 100.0-(100.0*collisions/len(sortedenergies)),"%" 
print 
print "import csv"
print "import sys"
print
print "def eqenergy(row):"
print "    result=0"
print "    for elem in row:"
print "        result = result + float(elem)"
if (rounding!=-1):
        print "        result=int(result*math.pow(10,",rounding,"))/math.pow(10,",rounding,")"
print "    return result"
print 
print "def classify(row):"
print "    energy=eqenergy(row)"
default=sortedenergies[-1][1]
for item in thresholds:
	print "    if (energy>"+str(item[0])+"):"
	print "        return "+item[1]
print "    return "+default
print
print "with open(sys.argv[1],'rb') as csvfile:"
print "    csvreader = csv.reader(csvfile)"
print "    for row in csvreader:"
print "        print classify(row)"
print
