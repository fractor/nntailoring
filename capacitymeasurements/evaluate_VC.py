N = 40
K = [5] #,4] #,3] #,4,5,6,7,8] #,9,10]
H = [1,2,3,4,5,6,7,8] #,32,128,512]

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
        for n in range(N):
            n += 1
            data_results = []
            for r_data in range(20):
                numpy.random.seed(r_data)
                if False: #k == 1:
                    data = [[d] for d in range(N)]
                else:
                    data = numpy.random.uniform(size=[N,k])
                numpy.random.seed(0)
                true_results = 0
                if n <= 8:
                    labellist = ["".join(item) for item in itertools.product("10", repeat=n)]
                else:
                    labellist = [bin(numpy.random.randint(2**(N+2)+1, 2**(N+2)+1+2**n))[-n:] for i in range(256)]
                for labelstring in labellist:
                    labels = [int(i) for i in labelstring]
                    d = data[:n]
                    for r_mlp in range(10): #lbfgs
                        clf = MLPClassifier(
                            hidden_layer_sizes=(h,), random_state=r_mlp, 
                            #activation='relu', solver="lbfgs",
                            activation='relu', solver="lbfgs",
                            alpha=0)
                        #clf = MLPClassifier(hidden_layer_sizes=(1,), random_state=r, activation='identity', solver="lbfgs")
                        clf.fit(d, labels)
                        if (clf.predict(d) == labels).all():
                            true_results += 1
                            break
                # true_results are always an even number!
                true_results += true_results % 2
                if true_results == 2**min(n,8):
                    data_results.append(true_results)
                    break
                if data_results and true_results > max(data_results):
                    print(n, k, h, true_results, true_results*1.0/2**min(n,8), "intermediate", r_data, max(data_results)*1.0/2**min(n,8))
                data_results.append(true_results)
            true_results = max(data_results)
            print(n, k, h, true_results, true_results*1.0/2**min(n,8))
            results.append((n, k, h, true_results, true_results*1.0/2**min(n,8)))
            if true_results*1.0/2**min(n,8) < 0.5:
                print "KVC(0.5): "+str((n-1,k, h))
                print
                break
    print "done"