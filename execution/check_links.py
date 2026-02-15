import os
import re

def check_links():
    print("Checking links in index.html...")
    
    html_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "index.html")
    
    if not os.path.exists(html_path):
        print("Error: index.html not found.")
        return

    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all ids
    ids = set(re.findall(r'id="([^"]+)"', content))
    print(f"Found IDs: {ids}")

    # Find all internal links
    links = re.findall(r'href="#([^"]+)"', content)
    
    broken_links = []
    for link in links:
        if link not in ids:
            broken_links.append(link)

    if broken_links:
        print(f"FAILED: Found broken internal links: {broken_links}")
    else:
        print("SUCCESS: All internal links are valid.")

if __name__ == "__main__":
    check_links()
