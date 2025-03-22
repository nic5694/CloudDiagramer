from flask import Flask, jsonify, redirect, request, session, url_for
import requests
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
REDIRECT_URI = 'https://clouddiagramer-463934685941.northamerica-northeast2.run.app/auth/callback'
SCOPE = 'https://www.googleapis.com/auth/cloud-platform'
AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth'
TOKEN_URI = 'https://oauth2.googleapis.com/token'


def list_projects(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }
    response = requests.get('https://cloudresourcemanager.googleapis.com/v1/projects', headers=headers)
    projects = response.json()
    return projects

@app.get('/')
def index():
    auth_url = (
        f"{AUTH_URI}?response_type=code&client_id={CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}&scope={SCOPE}&access_type=offline"
    )
    return redirect(auth_url)

@app.get('/auth/callback')
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



@app.get('/projects')
def projects():
    access_token = session.get('access_token')
    if not access_token:
        return redirect(url_for('index'))
    projects_data = list_projects(access_token)
    # For simplicity, we return the JSON data as a response
    return jsonify(projects_data)

@app.get('/projects/<projectId>/assets')
def getProjectDetails(projectId):
    assert projectId == request.view_args['projectId']
    access_token = session.get('access_token')
    if not access_token:
        return redirect(url_for('index'))  # Redirect to login if not authenticated
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }

    # Construct the API URL correctly
    api_url = f'https://cloudasset.googleapis.com/v1/projects/{projectId}/assets'
    response = requests.get(api_url, headers=headers)

    if response.status_code == 200:
        return response.json()  # Return JSON response if successful
    else:
        return {'error': 'Failed to fetch project assets', 'details': response.text}, response.status_code

    
@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok"}


@app.get('/projects/<project_code>/compute-instances')
def get_compute_instances(project_code):
    access_token = session.get('access_token')
    if not access_token:
        return redirect(url_for('index'))  # Redirect to login if not authenticated
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }

    # The specific CloudAsset API URL with query parameters
    # ap = f'https://cloudasset.googleapis.com/v1/projects/{project_code}/assets?assetTypes=compute.googleapis.com%2FInstance&contentType=RESOURCE'
    api_url = f'https://cloudasset.googleapis.com/v1/projects/{project_code}/assets?assetTypes=compute.googleapis.com%2FInstance&contentType=RESOURCE'
    
    response = requests.get(api_url, headers=headers)

    if response.status_code == 200:
        return response.json()  # Return JSON response if successful
    else:
        return {'error': 'Failed to fetch compute instances', 'details': response.text}, response.status_code

# ...existing code...


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
