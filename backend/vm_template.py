def sanitize_string(value):
    """Convert None to 'no_component' and replace '-' with '_' in string values."""
    if value is None:
        return "no_component"
    return str(value).replace("-", "_")

def generate_puml_from_assets(assets):
    """
    Generate a complete PUML string based on a list of assets.

    Parameters:
        assets (list): A list of dictionaries, where each dictionary represents an asset.

    Returns:
        str: A complete PUML diagram as a string.
    """
    # PUML header with necessary includes.
    puml_lines = [
        "@startuml",
        "!include <gcp/GCPCommon>",
        "!include <gcp/Compute/Cloud_Functions>",
        "!include <gcp/Networking/Cloud_Firewall_Rules>",
        "!include <gcp/Compute/Compute_Engine>",
        "!include <gcp/Storage/Cloud_Storage>",
        "",
    ]

    # Loop over each asset and generate a PUML line based on its type.
    for asset in assets:
        # Sanitize all asset properties
        asset_name = sanitize_string(asset.get("name", "Unnamed"))
        ip = sanitize_string(asset.get("network_ip"))
        subnet = sanitize_string(asset.get("subnetwork"))
        region = sanitize_string(asset.get("region"))
        asset_type = sanitize_string(asset.get("asset_type"))

        # Use asset_type as the distinguisher.
        if asset_type == "None":
            print(f"Asset type not provided for {asset_name}. Skipping.")
        elif asset_type.lower() == "instance":
            machine_type = sanitize_string(asset.get("machine_type", "n1_standard_1"))
            puml_lines.append(
                f'Compute_Engine({asset_name}, "Virtual Machine: {asset_name}", "Type: {machine_type}", "IP: {ip}, Subnet: {subnet}, Region: {region}")'
            )
        elif asset_type.lower() == "artifact":
            artifact_type = sanitize_string(asset.get("artifact_type", "Docker"))
            puml_lines.append(
                f'Cloud_Deployment_Manager({asset_name}, "Artifact Registry: {asset_name}", "Type: {artifact_type}", "IP: {ip}, Subnet: {subnet}")'
            )
        elif asset_type.lower() == "storage":
            storage_type = sanitize_string(asset.get("storage_type", "Standard"))
            puml_lines.append(
                f'Cloud_Storage({asset_name}, "Cloud Storage: {asset_name}", "Type: {storage_type}", "IP: {ip}, Subnet: {subnet}")'
            )
        elif asset_type.lower() == "disk":
            disk_type = sanitize_string(asset.get("disk_type", "SSD"))
            disk_size = sanitize_string(asset.get("disk_size", "100GB"))
            puml_lines.append(
                f'Persistent_Disk({asset_name}, "Persistent Disk: {asset_name}", "Type: {disk_type}", "Size: {disk_size}", "IP: {ip}, Subnet: {subnet}")'
            )
        else:
            print(f"Unknown asset type {asset_type} for {asset_name}. Skipping.")
    
    # Example relationship definitions (optional).
    if len(assets) >= 2:
        puml_lines.append("")
        name_1 = sanitize_string(assets[0].get("name", "no_component"))
        name_2 = sanitize_string(assets[1].get("name", "no_component"))
        puml_lines.append(f"{name_1} --> {name_2} : \"Relationship example\"")
    
    puml_lines.append("")
    puml_lines.append("@enduml")
    
    return "\n".join(puml_lines)


# For quick testing:
if __name__ == '__main__':
    sample_assets = [
        {
            "asset_type": None,
            "cohere": "A Google Cloud compute instance is a virtual machine ...",
            "name": None,
            "network_ip": None,
            "notes": None,
            "region": None,
            "subnetwork": None
        },
        {
            "asset_type": "Instance",
            "cohere": "This is a virtual machine owned by Google ...",
            "name": "instance-20250322-180043",
            "network_ip": "10.128.0.2",
            "notes": "",
            "region": "us-central1-c",
            "subnetwork": "us-central1/subnetworks/default"
        },
    ]