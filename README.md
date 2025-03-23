# 🌩️ CloudDiagramer

CloudDiagramer is a powerful tool designed to create and visualize cloud architecture diagrams programmatically. Whether you're designing AWS, Azure, or GCP architectures, this tool helps streamline the process with automation and structured representations.

## 🚀 Features

✅ Generate cloud architecture diagrams dynamically  
✅ Support for multiple cloud providers (GCP)  
✅ Easy-to-use API for defining components and relationships  
✅ Export diagrams in various formats (PNG, SVG, PDF)  
✅ Customizable components and connection styles  
✅ Open-source and actively maintained  

---

## 🛠️ Installation

Follow these steps to install and set up CloudDiagramer:

### 🔹 Prerequisites
- Python 3.7+
- Pip package manager

### 🔹 Installation Steps
```sh
# Clone the repository
git clone https://github.com/nic5694/CloudDiagramer.git

# Navigate to the project directory
cd CloudDiagramer

# Install required dependencies
pip install -r requirements.txt
```

---

## 🎯 Usage

### 🔹 Running the Application
```sh
python main.py
```

For help with available commands and options, run:
```sh
python main.py --help
```

### 🔹 Example Usage
Here’s how you can create a simple cloud diagram using the CloudDiagramer API:

```python
from cloud_diagramer import Diagram, AWS

diagram = Diagram("My Cloud Architecture")
diagram.add_component(AWS.EC2("Web Server"))
diagram.add_component(AWS.RDS("Database"))
diagram.connect("Web Server", "Database")

diagram.render("output.png")
```

This will generate a cloud architecture diagram and save it as `output.png`. 🎨

---

## 🤝 Contributing

We welcome contributions! Here’s how you can get involved:

1. **Fork** the repository.
2. **Create a new branch** (`git checkout -b feature-branch`).
3. **Make your changes** and commit (`git commit -m "Add new feature"`).
4. **Push to the branch** (`git push origin feature-branch`).
5. **Open a Pull Request** for review.

---

## 📜 License

CloudDiagramer is open-source and licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📩 Contact

For support, suggestions, or questions, open an issue or reach out to the repository maintainer. Happy coding! ✨
