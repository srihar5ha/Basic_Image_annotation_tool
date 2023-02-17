from flask import Flask, request, render_template, redirect, url_for, jsonify
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index2.html')

@app.route('/save_annotations',methods=['GET', 'POST'])
def save_ann_endpoint():
    
    print("url is ",request.url)
    if request.method == 'POST':
        print("req data : ",request.json)
        result=request.json
        with open('Annotations.json', 'a') as f:
            json.dump(result, f)
            f.write('\n')  # 
            f.close()
        #print("entered post method")
        #return render_template("nothing.html",payload=request.json)
        #return redirect(url_for('final_result',result=result))
        return jsonify({'redirect_url': url_for('final_result')})

@app.route('/final_result')
def final_result():
    #result=request.args.get('result')
    #print("result in final result ",result)
    return render_template('final_result.html')


if __name__ == '__main__':
    app.run(debug=True)
