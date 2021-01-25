import requests
import pandas as pd
import io
import seaborn as sns
import matplotlib.pyplot as plt

url1 = "https://data.linz.gv.at/katalog/tourismus/kategorien/3_stern_beherbergungsbetriebe/2019/t3ges_2019.csv"
url2 = "https://data.linz.gv.at/katalog/wirtschaft/arbeitslose/2019/Arbsu_2019.csv"

csv_data = requests.get(url1).content
df1 = pd.read_csv(io.StringIO(csv_data.decode('latin1')), sep=";")


csv_data = requests.get(url2).content
df2 = pd.read_csv(io.StringIO(csv_data.decode('latin1')), sep=";")

print(df1.head())

print(df2.head())


df = df1.merge(df2, how='inner', left_on=df1.columns[0], right_on=df2.columns[0])

#dfTest = df1.merge(df, on='Mona*')


#correlation_mat = df.corr()

#sns.heatmap(correlation_mat, annot=True)
# plt.show()

# corr_pairs = correlation_mat.unstack()
# sorted_pairs = corr_pairs.sort_values(kind="quicksort")
#
# negative_pairs = sorted_pairs[sorted_pairs < 0]
# strong_pairs = sorted_pairs[abs(sorted_pairs) > 0.9]
# strong_pairs = strong_pairs[:-(len(df.columns)-1)]
#
# #print(strong_pairs)
#
# keys = strong_pairs.keys()
#
# firstKey = keys[len(keys)-1][0]
# secondKey = keys[len(keys)-1][1]
#
# xKey = 'Monat'
#
# #print(firstKey + '\n' + secondKey)
#
# dfDraw = df[[firstKey, secondKey, xKey]]
#
# dfDraw.plot.line()
# plt.show()

# dfDraw = pd.DataFrame({
#     'first': df[firstKey],
#     'second': df[secondKey]
# }, index=df[yKey])
#
# print(dfDraw)

# df_result = pd.concat([df1, df2], axis=0)
#
# print(df_result.columns)

# fig, ax = plt.subplots()
#
# df_cleaned = df.dropna(how='all')
# df_years = df_cleaned['Jahr'].astype(np.uint16)
#
# x = df_years.values
# y = df_cleaned['durchschn_HHG'].values
#
# print("Jahr= ", x)
#
# plt.title("Haushalte OÖ", size="x-large")
# plt.ylabel("Durchschnittliche Haushalte", size="x-large")
# plt.xlabel("Jahr", size="x-large")
#
# plt.plot(y, "r*-", markersize=6, linewidth=1, color='b', label="Haushalte")
#
# plt.legend(loc=(0.4, 0.8))
#
# ax.set_xticks(range(len(x)))
# ax.set_xticklabels(x, rotation='vertical')
#
# plt.show()
#
# plt.savefig('oö_haushalte.png')

