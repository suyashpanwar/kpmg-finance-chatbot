from flask import Flask, request, send_file
from flask_cors import CORS  
import tabula
import pandas as pd
from io import BytesIO
from flask_cors import cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r"/convert": {"origins": "http://localhost:3000"}})

@app.route('/convert', methods=['POST'])
@cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
def convert_pdf_to_excel():
    print('Received a request to /convert')

    pdf_file = request.files['file']


    df = tabula.read_pdf(pdf_file, pages='all')


    combined_df = pd.concat(df)


    excel_buffer = BytesIO()
    combined_df.to_excel(excel_buffer, index=False)
    excel_buffer.seek(0)

    return send_file(excel_buffer, download_name='output.xlsx', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
