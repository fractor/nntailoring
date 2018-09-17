
K = [3] #,3,4,5] #,2,3,4,5] #,4] #,3] #,4,5,6,7,8] #,9,10]
H = [1,2,3,4,5,6,7,8] #,32,128,512]
max_l = 10
max_d = 1
max_r = 50

import itertools
import numpy
import random
from sklearn.neural_network import MLPClassifier

results = []
print("n","k","h","successful classifications", "rate")
for k in K:
  numpy.random.seed(0)
  # print data
  for h in H:
    numpy.random.seed(0)
    N = (h*(k+1)+h+1)*3
    for n in range(N):
      n += 1
      data_results = []
      l_len = min(n-1,max_l-1)
      for r_data in range(max_d):
        numpy.random.seed(r_data)
        data = numpy.random.normal(size=[N,k])
        numpy.random.seed(0)
        true_results = 0
        for label_int in range(2**l_len):
          index = label_int
          if max_l < n:
            label_int = random.randint(0, 2**(n-1))
          labels = [int(i) for i in bin(label_int * 2 + 2**(N+2))[-n:]]
          d = data[:n]
          converged = False
          for r_mlp in range(max_r):
            clf = MLPClassifier(
                hidden_layer_sizes=(h,), random_state=r_mlp, 
                #activation='relu', solver="lbfgs",
                activation='relu', solver="lbfgs",
                alpha=0)
            clf.fit(d, labels)
            if (clf.predict(d) == labels).all():
                true_results += 1
                converged = True
                break
        data_results.append(true_results)
      true_results = max(data_results)
      print(n, k, h, true_results, true_results*1.0/2**l_len)
      results.append(true_results*1.0/2**l_len)
      if true_results == 0:
        break
    print()
    print(results)
    print()
    results = []