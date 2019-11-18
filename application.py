
from flask import Flask, render_template, request, json, jsonify
from scipy.optimize import minimize
import pandas as pd
import numpy as np

app = Flask(__name__)
data = ''

@app.route("/")
def index():
    data = pd.read_csv('stock_data.csv')
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
         data = pd.read_csv('stock_data.csv')
         data = data[data_columns]
         data = data.loc[data['Stock'].isin(selected_stocks)]
         print(data)
         optimized_portfolio = stock_optimizer(data,capital,risk_level)
         optimized_portfolio['Total'] = optimized_portfolio['Close'] * optimized_portfolio['QTY']
         optimized_portfolio = optimized_portfolio.to_dict(orient='records')
         return {"data": optimized_portfolio}

    else:
        return jsonify(message='No stocks were selected'),400

    return "You are in the optimize function"

#def stock_optimizer(data,capital,min_pos=0,Div_factor=5):
def stock_optimizer(data,capital,I_type):
    #data.reset_index(inplace=True, drop=True)
    #list_current_prices = data['Close']
    #print(data)
    #def objective(qty):
    #    obj = float(capital)*.9-np.dot(pd.Series(qty),list_current_prices).sum()
    #    return obj
    #qty0 = pd.Series([10]*len(list_current_prices))
    #Upper_b = np.floor((float(capital)/Div_factor)/list_current_prices)
    #Lower_b = pd.Series([0]*len(Upper_b))
    #bnds = tuple(zip(Lower_b,Upper_b))
    # Cons is set to add more constraints laters on
    #def constraint_BP(qty):
        # Constraints Buying power - stocks to buy >0
    #    return float(capital)*.9-np.dot(pd.Series(qty),list_current_prices).sum()
    #con1 = {'type':'ineq','fun':constraint_BP}
    #cons = [con1]
    #sol = minimize(objective,qty0,method='SLSQP',bounds=bnds,constraints = cons)
    #R = pd.concat([data, pd.DataFrame(np.floor(sol.x),columns=['QTY'])],axis=1)
    #print(R)
    #return R[R['QTY']!=0]
    print(data)
    data.reset_index(drop=True, inplace=True)
    if I_type == "conservative":
        print("This is conservative")
        Div_factor = 15
        risk_ctrl = 30
        reward_ctrl = 40
    elif I_type =='moderate':
        Div_factor = 10
        risk_ctrl = 60
        reward_ctrl = 60
    else:
        Div_factor = 5
        risk_ctrl = 90
        reward_ctrl = 80
    capital = float(capital)
    list_current_prices = data['Close']
    list_risk = data['RISK']
    #print(list_current_prices)
    def objective(qty):
        obj = capital-np.dot(pd.Series(qty),list_current_prices).sum()
        #print(obj)
        return obj
    qty0 = pd.Series([10]*len(list_current_prices))
    Upper_b = np.floor((float(capital)/Div_factor)/list_current_prices)
    Lower_b = pd.Series([0]*len(Upper_b))
    bnds = tuple(zip(Lower_b,Upper_b))
    # Cons is set to add more constraints laters on
    def constraint_BP(qty):
        # Constraints Buying power - stocks to buy >0 
        return capital-np.dot(pd.Series(qty),list_current_prices).sum()
    def constraint_Risk(qty):
        sizes = np.dot(pd.Series(qty),list_current_prices)
        return risk_ctrl - (np.dot(sizes,list_risk).sum()/capital)
    def constraint_Reward(qty):
        sizes = np.dot(pd.Series(qty),list_current_prices)
        return (np.dot(sizes,list_risk).sum()/capital) - reward_ctrl
    con1 = {'type':'ineq','fun':constraint_BP}
    con2 = {'type':'ineq','fun':constraint_Risk}
    con3 = {'type':'ineq','fun':constraint_Reward}
    cons = [con1,con2,con3]
    sol = minimize(objective,qty0,method='SLSQP',bounds=bnds,constraints = cons)
    #display(data.head())
    R = pd.concat([data, pd.DataFrame(np.floor(sol.x),columns=['QTY'])],axis=1)
    print("HERE ARE THE RECOMMENDATIONS")
    print(R[R['QTY']!=0])
    return R[R['QTY']!=0]
 
if __name__ == "__main__":
    #data = pd.read_csv('output_indicators_long.csv')
    #data.drop(['Unnamed: 0'],axis=1,inplace=True)
    #data = data[data['timestamp'] == data['timestamp'].max()]
    #checked()

    app.run(debug=True)
