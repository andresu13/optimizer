Description:

The Millennial Investing investment package contains 2 sections: 

A stock screener that identifies eligible stocks from the S&P500 market index that match user's preference for market segment and any specific companies of interest. Visualization shows stocks as bubbles colored based on risk/reward ratio and size as market cap by volume traded.

An optimizer module takes stocks selected by the user, the total amount to be invested and the user's desired risk level and shows the stocks as bubbles colored by market segment and sized by recommended amount to invest. 

First we utilize a jupyter notebook__________ to obtain the stock market data. Once data is saved on local machine we load the tableau dashboard and connect to the data obtained from jupyter. then we Download code ______.flask into a local folder and open the folder with visual studio and execute the code.
 

Installation Jupyter Notebook Section:
Get the data
1. Download python version 3.7 https://www.python.org/downloads/

2.1. Install alpaca_trade_api 

open command prompt and enter python -m pip install alpaca_trade_api
for more information, navigate to https://pypi.org/project/alpaca-trade-api/ 

2.2 Install pandas

open command prompt and enter python -m pip install pandas

2.3 install numpy

open command prompt and enter python -m pip install numpy

2.4 install bs4 (beautiful soup)

open command prompt and enter python -m pip install bs4

2.5 install pickle

open command prompt and enter python -m pip install pickle

2.6 install requests

open command prompt and enter python -m pip install requests

2.7 install scipy

open command prompt and enter python -m pip install scipy

2.8 install TA-Lib

open command prompt and enter python -m pip install TA-Lib


3. Download jupyter notebook https://jupyter.org/install

Execution - jupyter notebook section
3.1 open the notebook 6242_Project_V3
3.2 run the note book

kernal tab, restart and run all

3.3 data saved in CSV file in same folder as jupyter notebook is saved in


Install Tableau Notebook and connect to data

4.1 Download tableau desktop https://www.tableau.com/
4.2
4.3

Execution Tableau Notebook Section

5.1
5.2


#### Install Optimizer Section #####

6.1 Install the following Python modules- Numpy- Flask- PandasYou can use the following command to install those modules. Replace package_name with the name of the package you want to install:python -m pip install package_name6.2 Download and UNZIP optimizer application to your local computer

#### Execution Optimizer Section #####
7.1 Open a command prompt and navigate to the optimizer application directory7.2 Execute the following command:python application.pyThis will execute the Python/Flask application and kick-off a web server listening on port 5000 on your local computer7.3 Open a Web Browser (preferably Firefox) and navigate to the following address: http://127.0.0.1:5000

