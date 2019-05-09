from flask import Flask,request
import fut.fut as fut
import json
app = Flask(__name__)
accounts_log = {}

@app.route('/login', methods=['POST'])
def ea_login():
    login = request.json
    if login["email"] and login["password"]:
        print(login["email"],login["password"])
        try:
            session = fut.Core(login["email"],login["password"],'aaaa',platform='ps4')
            accounts_log[login["email"]] = session
            return "login"
        except:
            return "error"

@app.route('/coins',methods=['POST'])
def get_coins():
    data = request.json
    if data[email] in accounts_log:
        coins = accounts_log[data[email]].credits
        return str(coins)
    else:
        return "account not logged in"
        
app.run(debug=True)