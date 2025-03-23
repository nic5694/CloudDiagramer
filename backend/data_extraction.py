import json
import cohere
import os
from dotenv import load_dotenv


load_dotenv()

# Cohere API Key and initialization
co = cohere.Client(os.environ["COHERE_API_KEY"])


def load_unfilteredJSON(json_data):
    print("TESTING PRINTING")
    data = json.loads(json_data)
    assets = data.get("assets", [])
    extracted_info = [
        {
            "name": None,
            "subnetwork": None,
            "network_ip": None,
            "asset_type": None,
            "region": None,
            "notes": None  
        }
    ]

    for asset in assets:
        asset_details = {
            "name": asset.get("resource", {}).get("data", {}).get("name", "N/A"),
            "subnetwork": "/".join(asset.get("resource", {}).get("data", {}).get("networkInterfaces", [{}])[0].get("subnetwork", "N/A").split("/")[-3:]),
            "network_ip": asset.get("resource", {}).get("data", {}).get("networkInterfaces", [{}])[0].get("networkIP", "N/A"),
            "asset_type": asset.get("assetType", "N/A").split("/")[-1] if "/" in asset.get("assetType", "N/A") else asset.get("assetType", "N/A"),
            "region": asset.get("resource", {}).get("location", "N/A"),
            "notes": ""  # Adding a new 'notes' field
        }
        print("This is asset detauks", asset_details)
        extracted_info.append(asset_details)

    return extracted_info

# Function for generating a simple explanation using Cohere
def generate_notes_with_cohere(asset_data):
    prompt = f"""
    You are an AI assistant that explains complex technical concepts in simple, clear, and engaging language for non-technical users. Your goal is to make the topic easy to understand using everyday analogies, avoiding jargon, and breaking down ideas step by step. Ensure the response is concise and maximum 4 lines but informative, keeping the explanation engaging for someone with no prior knowledge of the subject. 
    {json.dumps(asset_data, indent=2)}
    """

    response = co.generate(
        model="command-xlarge",  # Change this to a valid model
        prompt=prompt,
        max_tokens=150
    )

    return response.generations[0].text.strip()

# def process_json():
#     try:
#         instance_data = request.get_json()
#         if not instance_data or "assets" not in instance_data:
#             return jsonify({"error": "Invalid JSON or missing 'assets' key"}), 400
        

#         asset_data = load(instance_data)

#         # Adding explanations using Cohere
#         for asset in asset_data:
#             explanation = generate_notes_with_cohere([asset])
#             asset["explanation"] = explanation

#         # Save the output to a file
#         with open('output.json', 'w') as outfile:
#             json.dump(asset_data, outfile, indent=4)

#         # Return the final output as response
#         return jsonify(asset_data), 200
    
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": str(e)}), 400


