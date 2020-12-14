import pandas as pd
import numpy as np
from scipy.stats.stats import pearsonr

df1 = pd.DataFrame({'A': ['A0', 'A1', 'A2', 'A3'],
                    'B': ['B0', 'B1', 'B2', 'B3'],
                    'C': ['C0', 'C1', 'C2', 'C3'],
                    'D': ['D0', 'D1', 'D2', 'D3']},
                   index=[0, 1, 2, 3])

df2 = pd.DataFrame({'A': ['A4', 'A5', 'A6', 'A7'],
                    'B': ['B4', 'B5', 'B6', 'B7'],
                    'C': ['C4', 'C5', 'C6', 'C7'],
                    'D': ['D4', 'D5', 'D6', 'D7']},
                   index=[4, 5, 6, 7])

df3 = pd.DataFrame({'A': ['A8', 'A9', 'A10', 'A11'],
                    'B': ['B8', 'B9', 'B10', 'B11'],
                    'C': ['C8', 'C9', 'C10', 'C11'],
                    'D': ['D8', 'D9', 'D10', 'D11']},
                   index=[8, 9, 10, 11])

frames = [df1, df2, df3]

result = pd.concat(frames)

print(result)

print()

df = pd.DataFrame(np.random.randn(1000, 3), columns=['a', 'b', 'c'])

print(df.corr(method='spearman'))
print(df.corr())

print()

np.random.seed(100)
#Erstellen Sie ein Array mit 50 zufälligen Ganzzahlen zwischen 0 und 10
var1 = np.random.randint(0, 10, 50)
#Erstellen Sie ein positiv korreliertes Array mit zufälligem Rauschen
var2 = var1 + np.random.normal(0, 10, 50)
#Berechnen Sie die Korrelation zwischen den beiden Arrays
print(np.corrcoef(var1, var2)[0,1])

print()

print(pearsonr(var1, var2))

data = pd.DataFrame(np.random.randint(0, 10, size=(5, 3)), columns=['A', 'B', 'C'])
print(data)

print(data['A'].corr(data['B']))