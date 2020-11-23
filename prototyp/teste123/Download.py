import requests
import pandas as pd
import io
import matplotlib.pyplot as plt
import numpy as np

url = "https://data.ooe.gv.at/files/cms/Mediendateien/OGD/ogd_abtStat/Haushalte_seit_1971.csv"

csv_data = requests.get(url).content
df = pd.read_csv(io.StringIO(csv_data.decode('latin1')), sep=";", usecols=["Jahr", "Gemeinde", "durchschn_HHG"])
print(df.head())

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

