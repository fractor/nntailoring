#!/bin/bash
for i in `ls *.csv`;
        do
	       echo "$i:"	
               python capacityreq.py $i $1 
	       echo
        done 
