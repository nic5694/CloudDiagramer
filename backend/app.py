from flask import Flask, jsonify, redirect, request, session, url_for
import requests
from google.oauth2 import id_token
import requests
import json
import os
from dotenv import load_dotenv
import zlib
from data_extraction import load_unfilteredJSON, generate_notes_with_cohere
load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Replace with your secret key

# Your OAuth 2.0 credentials
CLIENT_ID = os.environ["CLIENT_ID"]
CLIENT_SECRET = os.environ["CLIENT_SECRET"]
HOST = os.getenv("HOST", "http://localhost:8000")
REDIRECT_URI = f'{HOST}/auth/callback'
SCOPE = 'https://www.googleapis.com/auth/cloud-platform'
AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth'
TOKEN_URI = 'https://oauth2.googleapis.com/token'



@app.get('/projects/<projectId>/generatepuml')
def generate_puml(projectId):
    assert projectId == request.view_args['projectId']
    access_token = session.get('access_token')
    if not access_token:
        return redirect(url_for('index'))  # Redirect to login if not authenticated
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }

    # Construct the API URL correctly
    #api_url = f'https://cloudasset.googleapis.com/v1/projects/{projectId}/assets'
    #unfiltered_data = requests.get(api_url, headers=headers)
    #initnial_json_clean = load(unfiltered_data)
    #for i in initnial_json_clean:
     #   i.cohere = generate_notes_with_cohere(i)
    #return initnial_json_clean
    
### New Loop
    api_url = f'https://cloudasset.googleapis.com/v1/projects/{projectId}/assets'
    try:
        unfiltered_data = requests.get(api_url, headers=headers)
        unfiltered_data.raise_for_status()  # Raise an exception for HTTP errors
        initial_json_clean = unfiltered_data.json()
        initial_json_clean = load_unfilteredJSON(json.dumps(initial_json_clean))        
        for i in initial_json_clean:  # Use .get() to safely access 'assets'
            i['cohere'] = generate_notes_with_cohere(i)
            print("This is the i", i)
        
        return initial_json_clean
    except requests.exceptions.RequestException as e:
        return {'error': 'Failed to fetch project assessts','details': str(e)},500

    

def encode_plantuml(text):
    """
    Encodes PlantUML text into a URL-safe string using PlantUML's deflate/encode algorithm
    """
    # Compress using zlib
    compressed = zlib.compress(text.encode('utf-8'))
    # Skip zlib header (2 bytes) and zlib trailer (4 bytes)
    compressed = compressed[2:-4]
    res = ""
    for i in range(0, len(compressed), 3):
        chunk = compressed[i:i + 3]
        b = list(chunk) + [0] * (3 - len(chunk))
        b0, b1, b2 = b[0], b[1], b[2]

        c1 = b0 >> 2
        c2 = ((b0 & 0x3) << 4) | (b1 >> 4)
        c3 = ((b1 & 0xF) << 2) | (b2 >> 6)
        c4 = b2 & 0x3F

        res += '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'[c1]
        res += '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'[c2]
        
        if i + 1 < len(compressed):
            res += '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'[c3]
        if i + 2 < len(compressed):
            res += '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'[c4]

    return res

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

@app.get('/test/puml')
def test_puml():

    plantuml_code = """
@startuml
!pragma allow_mixing

!define GCPPuml https://raw.githubusercontent.com/davidholsgrove/gcp-icons-for-plantuml/master/dist
!include GCPPuml/GCPCommon.puml
!include GCPPuml/Compute/ComputeEngine.puml
!include GCPPuml/Storage/CloudStorage.puml

skinparam defaultTextAlignment center
skinparam linetype polyline
skinparam nodesep 120
skinparam ranksep 100
skinparam shadowing false
skinparam handwritten false

skinparam node {
  BackgroundColor transparent
  BorderColor #3C7FC0
  BorderThickness 2
  FontColor black
  FontSize 12
  Shadowing false
}
skinparam note {
  BorderColor #888888
  BackgroundColor transparent
  FontSize 11
}

' ==============================================
' Scenario: One server and storage in the same subnet (inside VPC)
'           One server outside the subnet (outside VPC)
' ==============================================

' === Inside VPC ===
package "VPC[192.168.1.0/24]" {

  node "Production Server<vm-prod-01>" as vm1 <<$ComputeEngine>>
  note right of vm1
    **Hardware**
    Type: n1-standard-1

    **Network**
    IP: 192.168.1.10  
    Mask: 255.255.255.0  
    Subnet: 192.168.1.0/24

    **Software**
    OS: Ubuntu 22.04 LTS

    **Notes**
    Main production environment
  end note

  node "Production Storage<storage-prod-01>" as storage <<$CloudStorage>>
  note right of storage
    **Storage**
    Type: SSD  
    Capacity: 500 GB

    **Location**
    Region: us-central1  
    Subnet: 192.168.1.0/24

    **Notes**
    Main production storage
  end note

  cloud "Internal Network" as internal_net #AliceBlue

  vm1 -- internal_net
  storage -- internal_net
  vm1 --> storage : "Uses"
}

' === Outside VPC ===
node "External Server<vm-ext-01>" as vm2 <<$ComputeEngine>> {
  note right of vm2
    **Hardware**
    Type: n1-standard-1

    **Network**
    IP: 192.168.2.10  
    Mask: 255.255.255.0  
    Subnet: 192.168.2.0/24

    **Software**
    OS: Ubuntu 22.04 LTS

    **Notes**
    External server outside VPC
  end note
}

cloud "External Network" as external_net #AliceBlue

vm2 -- external_net
external_net -- internal_net : "Connects to VPC"
@enduml
"""
    try:
        # Step 2: Encode the PlantUML code
        encoded_puml = encode_plantuml(plantuml_code)

        # Step 3: Generate the URL for the SVG diagram using the PlantUML server
        diagram_url = f"https://www.plantuml.com/plantuml/png/{encoded_puml}"

        return jsonify({'diagram_url': diagram_url})
    except Exception as e:
        print(f"Error encoding PlantUML: {str(e)}")
        return {"error": "Failed to generate diagram URL"}, 500

    # print("Generating PlantUML diagram...")
    # image_data = generate_plantuml_image(plantuml_code)
    # if image_data is None:
    #     print("Failed to generate diagram")
    #     return {"error": "Failed to generate diagram"}, 500
        
    # print(f"Generated image data length: {len(image_data)} bytes")
    
    # try:
    #     upload_url = upload_diagram_to_bucket(image_data)
    #     if upload_url is None:
    #         print("Failed to upload diagram")
    #         return {"error": "Failed to upload diagram"}, 500
    #     print(f"Successfully uploaded to: {upload_url}")
    #     return {"url": upload_url}
    # except Exception as e:
    #     print(f"Error during upload: {str(e)}")
    #     return {"error": str(e)}, 500
    # ...rest of the function remains the same...

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
