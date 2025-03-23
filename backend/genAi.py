import json
import cohere



def generateNotesWitCohere(json_dump):
    data = json.loads(json_data)

    # Extract required information
    assets = data.get("assets", [])

    extracted_info = []

    for asset in assets:
        asset_details = {
            "name": asset.get("resource", {}).get("data", {}).get("name", "N/A"),
            "subnetwork": "/".join(asset.get("resource", {}).get("data", {}).get("networkInterfaces", [{}])[0].get("subnetwork", "N/A").split("/")[-3:]),
            "network_ip": asset.get("resource", {}).get("data", {}).get("networkInterfaces", [{}])[0].get("networkIP", "N/A"),
            "asset_type": asset.get("assetType", "N/A").split("/")[-1] if "/" in asset.get("assetType", "N/A") else asset.get("assetType", "N/A")
        }
    extracted_info.append(asset_details)
    prompt = f"""
    The following is a technical description of a Google Cloud compute instance:
    {json.dumps(asset_data, indent=2)}

    Generate a simple explanation for a non-technical user.
    """

    response = co.generate(
        model="command-xlarge",  # Change this to a valid model
        prompt=prompt,
        max_tokens=150
    )

    return response.generations[0].text.strip()

# # Function for extracting data from JSON
# def load(json_data):
#     # Load JSON data
#     data = json.loads(json_data)

#     # Extract required information
#     assets = data.get("assets", [])

#     extracted_info = []

#     for asset in assets:
#         asset_details = {
#             "name": asset.get("resource", {}).get("data", {}).get("name", "N/A"),
#             "subnetwork": "/".join(asset.get("resource", {}).get("data", {}).get("networkInterfaces", [{}])[0].get("subnetwork", "N/A").split("/")[-3:]),
#             "network_ip": asset.get("resource", {}).get("data", {}).get("networkInterfaces", [{}])[0].get("networkIP", "N/A"),
#             "asset_type": asset.get("assetType", "N/A").split("/")[-1] if "/" in asset.get("assetType", "N/A") else asset.get("assetType", "N/A")
#         }
#         extracted_info.append(asset_details)

#     # Return extracted information
#     return extracted_info

# # Function for generating a simple explanation using Cohere
# def generate_notes_with_cohere(asset_data):
#     prompt = f"""
#     The following is a technical description of a Google Cloud compute instance:
#     {json.dumps(asset_data, indent=2)}

#     Generate a simple explanation for a non-technical user.
#     """

#     response = co.generate(
#         model="command-xlarge",  # Change this to a valid model
#         prompt=prompt,
#         max_tokens=150
#     )

#     return response.generations[0].text.strip()


# # Sample JSON input
# json_data = '''
# {
#     "assets": [
#         {
#             "resource": {
#                 "data": {
#                     "name": "instance-20250322-053930",
#                     "networkInterfaces": [
#                         {
#                             "subnetwork": "projects/my-project/regions/us-central1/subnetworks/default",
#                             "networkIP": "10.128.0.2"
#                         }
#                     ]
#                 }
#             },
#             "assetType": "compute.googleapis.com/Instance"
#         }
#     ]
# }
# '''

# # Step 1: Load the JSON and extract asset data
# asset_data = load(json_data)

# # Step 2: Generate explanations using Cohere for each asset
# for asset in asset_data:
#     explanation = generate_notes_with_cohere([asset])
#     asset["explanation"] = explanation

# # Print the final object with the added AI-generated explanations
# print(json.dumps(asset_data, indent=4))
