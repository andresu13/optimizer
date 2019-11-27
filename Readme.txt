Description:

The Millennial Investing investment package contains 2 sections: 

A stock screener that identifies eligible stocks from the S&P500 market index that match user's preference for market segment and any specific companies of interest. Visualization shows stocks as bubbles colored based on risk/reward ratio and size as market cap by volume traded.

An optimizer module takes stocks selected by the user, the total amount to be invested and the user's desired risk level and shows the stocks as bubbles colored by market segment and sized by recommended amount to invest. 

First we utilize a jupyter notebook "get_stock_data.ipynb" to obtain the stock market data. Once data is saved on local machine we load the tableau dashboard stock_picker.twb and connect to the data obtained from jupyter; then we open the optimizer folder and run the flask application as described below.
 
There are two possible ways to use this tool:
1. (easy) navigate to https://portfolio-optimizer.azurewebsites.net/ in your browser (Firefox >= version 70) to use web based application
2. (difficult) follow instructions below to download source code and install on a local machine

### Installation Jupyter Notebook ###
Get the data
1. Download python version 3.7 https://www.python.org/downloads/

2.1. Install the following python modules

- alpaca_trade_api
- pandas
- numpy
- bs4 
- pickle
- requests
- scipy
- TA-Lib

You can use the following command to install those modules. Replace package_name with the name of the package you want to install:

open command prompt and enter: python -m pip install package_name


3. Download jupyter notebook "get_stock_data.ipynb"

### Execution - jupyter notebook ###
3.1 open the notebook "get_stock_data.ipynb"
3.2 run the note book

kernal tab, restart and run all

3.3 data saved in 2 CSV files in same folder as jupyter notebook is saved in
3.3.1 "output_indicators_long.csv" is the file that is used for tableau
3.3.2 "output_indicators_long_latest_timestamp.csv" is the file used for the optimizer



### Install Tableau Notebook and connect to data ###

4.1 Download tableau desktop https://www.tableau.com/
4.2 Open the workbook stock_picker.twb
4.3 In Tableau workbook, go to "Data Source" => "Connections" and change path of the connection to the downloaded data (output_indicators_long.csv).

### Execution Tableau Notebook ###

5.1 Go to data and refresh data source.
5.2 All views should now be available.


### Install Optimizer ###

6.1 Install the following Python modules
- Numpy
- Flask
- Pandas

You can use the following command to install those modules. Replace package_name with the name of the package you want to install:

python -m pip install package_name

6.2 Download and UNZIP optimizer application to your local computer



#### Execution Optimizer #####


7.1 Open a command prompt and navigate to the optimizer application directory

7.2 Execute the following command:

python application.py

This will execute the Python/Flask application and kick-off a web server listening on port 5000 on your local computer

7.3 Open a Web Browser (Firefox >= version 70) and navigate to the following address: http://127.0.0.1:5000

