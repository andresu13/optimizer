
from flask import Flask, render_template, request, json, jsonify
from scipy.optimize import minimize
import pandas as pd
import numpy as np

app = Flask(__name__)
data = ''

@app.route("/")
def index():
    data = pd.read_csv('output_current_time.csv')
    stocks= data[['Stock', 'Name']]
    stocks.columns = ['id', 'text']
    stocks = stocks.to_dict(orient='records')
    #stocks = data['Stock'].tolist()
    #print(type(stocks))
    return render_template('index.html', stocks=stocks)

@app.route("/optimize", methods=['POST'])
def optimize():
    selected_stocks = request.form.getlist('stocks')
    capital = request.form['capital']
    print(capital)
    data_columns = ['Stock', 'Close', 'Volume', 'RSI', 'BETA', 'Sector', 'Name', 'Market Cap', 'Reward', 'RISK', 'Reward_Risk']
    if(len(selected_stocks) != 0):
         data = pd.read_csv('output_current_time.csv')
         data = data[data_columns]
         data = data.loc[data['Stock'].isin(selected_stocks)]
         #print(data)
         #data = data.to_dict(orient='records')
         optimized_portfolio = stock_optimizer(data,capital,0,10)
         optimized_portfolio['Total'] = optimized_portfolio['Close'] * optimized_portfolio['QTY']
         #print(optimized_portfolio)
         optimized_portfolio = optimized_portfolio.to_dict(orient='records')

         
         
         return {"data": optimized_portfolio}

    else:
        return jsonify(message='No stocks were selected'),400

    return "You are in the optimize function"

#@app.route('/signup')
#def signUp():
#    return render_template('signup.html')

#@app.route('/signup', methods=['POST'])
#def signUpUser():
#    user =  request.form['username']
#    password = request.form['password']
#    #return json.dumps({'status':'OK','user':user,'pass':password})
#    print("HELLO WORLD!!!")
#    return render_template('signup2.html')

#@app.route('/checked', methods=['GET','POST'])
#def checked():
#    #return ""
#    data = pd.read_csv('output_current_time.csv')
#    data = data[['Stock', 'Name']]
#    data.columns = ['id', 'text']
#    data = data.to_dict(orient='records')
    #data.drop(['Unnamed: 0'],axis=1,inplace=True)
#    print(type(data))

def stock_optimizer(data,capital,min_pos=0,Div_factor=5):
    data.reset_index(inplace=True, drop=True)
    list_current_prices = data['Close']
    print(data)
    #print(list_current_prices)
    def objective(qty):
        obj = float(capital)*.9-np.dot(pd.Series(qty),list_current_prices).sum()
        return obj
    qty0 = pd.Series([10]*len(list_current_prices))
    Upper_b = np.floor((float(capital)/Div_factor)/list_current_prices)
    Lower_b = pd.Series([0]*len(Upper_b))
    bnds = tuple(zip(Lower_b,Upper_b))
    # Cons is set to add more constraints laters on
    def constraint_BP(qty):
        # Constraints Buying power - stocks to buy >0
        return float(capital)*.9-np.dot(pd.Series(qty),list_current_prices).sum()
    con1 = {'type':'ineq','fun':constraint_BP}
    cons = [con1]
    sol = minimize(objective,qty0,method='SLSQP',bounds=bnds,constraints = cons)
    #R = pd.Series(np.floor(sol.x),index=data2['Stock'])
    #print(type(sol.x))
    R = pd.concat([data, pd.DataFrame(np.floor(sol.x),columns=['QTY'])],axis=1)
    #R[R!=0]
    print(R)
    return R[R['QTY']!=0]
 
if __name__ == "__main__":
    #data = pd.read_csv('output_indicators_long.csv')
    #data.drop(['Unnamed: 0'],axis=1,inplace=True)
    #data = data[data['timestamp'] == data['timestamp'].max()]
    #checked()

    app.run(debug=True)
