from flask import Flask,request,jsonify
import fut.fut as fut
import json,sys,os
app = Flask(__name__)
accounts_log = {}

@app.route('/')
def hello():
    return jsonify({"ee":"eeeee"})

@app.route('/login', methods=['GET'])
def ea_login():
    email = request.args.get('email')
    password = request.args.get('password')
    cookies = request.args.get('cookies')
    token = request.args.get('token')
    token_path = os.path.join(os.getcwd(),"token.txt")
    cookies_path = os.path.join(os.getcwd(),"cookies.txt")
    
    if cookies != "" and token != "":
        token_file = open(token_path, "w")
        cookies_file = open(cookies_path, "w")
        token_file.write(token)
        cookies_file.write(cookies)
    else:
        if os.path.isfile(token_path) and os.path.isfile(cookies_path):
            os.remove(token_path)
            os.remove(cookies_path)
            
        

    if email and password:
        print(email,password)
        try:
            session = fut.Core(email,password,'aaaa',platform='ps4')
            accounts_log[email] = session
            return jsonify({"data":"login","token":open(token_path).read(),"cookies":open(cookies_path).read()})
        except:
            try:
                os.remove(token_path)
                os.remove(cookies_path)
                session = fut.Core(email,password,'aaaa',platform='ps4')
                accounts_log[email] = session
                return jsonify({"data":"login successful","token":open(token_path).read(),"cookies":open(cookies_path).read()})
            except:
                return jsonify({"data":"login error"})
            

@app.route('/coins',methods=['POST'])
def get_coins():
    data = request.json
    if data[email] in accounts_log:
        coins = accounts_log[data[email]].credits
        return jsonify({"data":str(coins)})
    else:
        return jsonify({"data":"not logged in"})

@app.route('/account/logged')
def get_logged():
    return jsonify({"data":[acc for acc in accounts_log.keys()]})
app.run(debug=True)