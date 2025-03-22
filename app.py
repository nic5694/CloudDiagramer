from flask import Flask, redirect, request, session, url_for, jsonify
import google.auth.transport.requests
from google.oauth2 import id_token
import requests
import json
import os
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Replace with your secret key

# Your OAuth 2.0 credentials
CLIENT_ID = os.environ["CLIENT_ID"]
CLIENT_SECRET = os.environ["CLIENT_SECRET"]
REDIRECT_URI = 'http://localhost:5000/auth/callback'
SCOPE = 'https://www.googleapis.com/auth/cloud-platform'
AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth'
TOKEN_URI = 'https://oauth2.googleapis.com/token'

@app.route('/')
def index():
    auth_url = (
        f"{AUTH_URI}?response_type=code&client_id={CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}&scope={SCOPE}&access_type=offline"
    )
    return redirect(auth_url)

@app.route('/auth/callback')
def oauth2callback():
    code = request.args.get('code')
    # Exchange the authorization code for an access token
    data = {
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code',
    }
    token_response = requests.post(TOKEN_URI, data=data)
    tokens = token_response.json()
    session['access_token'] = tokens.get('access_token')
    return redirect(url_for('projects'))

def list_projects(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }
    response = requests.get('https://cloudresourcemanager.googleapis.com/v1/projects', headers=headers)
    projects = response.json()
    return projects

@app.route('/projects')
def projects():
    access_token = session.get('access_token')
    if not access_token:
        return redirect(url_for('index'))
    projects_data = list_projects(access_token)
    # For simplicity, we return the JSON data as a response
    return jsonify(projects_data)

if __name__ == '__main__':
    app.run(debug=True)
