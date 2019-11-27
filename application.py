from flask import Flask, render_template, request, json, jsonify
from scipy.optimize import minimize
import pandas as pd
import numpy as np

app = Flask(__name__)
data = ''

@app.route("/")
def index():
    data = pd.read_csv('output_indicators_long_latest_timestamp.csv')
    stocks= data[['Stock', 'Name']]
    stocks.columns = ['id', 'text']
    stocks = stocks.to_dict(orient='records')
    return render_template('index.html', stocks=stocks)

@app.route("/optimize", methods=['POST'])
def optimize():
    selected_stocks = request.form.getlist('stocks')
    risk_level = request.form['risklevel']
    if(risk_level == '0'):
        risk_level = 'conservative'
    elif(risk_level == '1'):
        risk_level = 'moderate'
    else:
        risk_level = 'aggressive'

    print("THE RISK LEVEL IS ", risk_level)
    capital = request.form['capital']
    print(capital)
    data_columns = ['Stock', 'Close', 'Volume', 'RSI', 'BETA', 'Sector', 'Name', 'Market Cap', 'Reward', 'RISK', 'Reward_Risk']
    if(len(selected_stocks) != 0):
         data = pd.read_csv('output_indicators_long_latest_timestamp.csv')
         data = data[data_columns]
         data = data.loc[data['Stock'].isin(selected_stocks)]
         #print(data)
         optimized_portfolio = stock_optimizer(data,capital,risk_level)
         optimized_portfolio['Total'] = optimized_portfolio['Close'] * optimized_portfolio['QTY']
         print(optimized_portfolio['Total'])
         optimized_portfolio['Total'] = optimized_portfolio['Total'].astype(int)
         print(optimized_portfolio['Total'])
         optimized_portfolio = optimized_portfolio.to_dict(orient='records')
         return {"data": optimized_portfolio}

    else:
        return jsonify(message='No stocks were selected'),400

    return "You are in the optimize function"

def stock_optimizer(data,capital,I_type):

    print(data)
    data.reset_index(drop=True, inplace=True)
    data_q = data[['RISK','Reward']].quantile([.25,.5,.75])
    if I_type == "conservative":
        Div_factor = 15
        risk_ctrl = data_q.loc[0.25,'RISK']
        reward_ctrl = data_q.loc[0.25,'Reward']
    elif I_type =='moderate':
        Div_factor = 10
        risk_ctrl = data_q.loc[0.5,'RISK']
        reward_ctrl = data_q.loc[0.5,'Reward']
    else:
        Div_factor = 5
        risk_ctrl = data_q.loc[0.75,'RISK']
        reward_ctrl = data_q.loc[0.75,'Reward']
    num_stocks = len(data)
    if Div_factor > num_stocks:
        Div_factor = num_stocks
    capital = float(capital)
    list_current_prices = data['Close']
    list_risk = data['RISK']
    list_reward = data['Reward']
    def objective(qty):
        obj = capital-np.dot(pd.Series(qty),list_current_prices)
        return obj
    qty0 = pd.Series([10]*len(list_current_prices))
    Upper_b = np.floor(((1.20*float(capital))/Div_factor)/list_current_prices)
    Lower_b = pd.Series([0]*len(Upper_b))
    bnds = tuple(zip(Lower_b,Upper_b))
    def constraint_BP(qty):
        return capital-np.dot(pd.Series(qty),list_current_prices)
    def constraint_Risk(qty):
        sizes = pd.Series(qty)*list_current_prices
        return risk_ctrl - (np.dot(sizes,list_risk)/capital)
    def constraint_Reward(qty):
        sizes = pd.Series(qty)*list_current_prices
        return (np.dot(sizes,list_reward)/capital) - reward_ctrl
    con1 = {'type':'ineq','fun':constraint_BP}
    con2 = {'type':'ineq','fun':constraint_Risk}
    con3 = {'type':'ineq','fun':constraint_Reward}
    cons = [con1,con2,con3]
    sol = minimize(objective,qty0,method='SLSQP',bounds=bnds,constraints = cons)
    R = pd.concat([data, pd.DataFrame(np.floor(sol.x).astype(int),columns=['QTY'])],axis=1)
    print(R[R['QTY']!=0])
    return R[R['QTY']!=0]
 
if __name__ == "__main__":

    app.run(debug=True)
