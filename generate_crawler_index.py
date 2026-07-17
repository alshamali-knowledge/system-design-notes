import os
import re

def clean_title(name):
    """
    Cleans directory and file names for human-readable link titles.
    E.g., '001-system-design' -> 'System Design'
    E.g., 'database_scaling' -> 'Database Scaling'
    """
    name = os.path.splitext(name)[0]
    
    if name.lower() == "readme":
        return None
        
    # Remove sorting prefixes like '000-', '01-', etc.
    name = re.sub(r'^\d+[-_]', '', name)
    
    # Replace dashes and underscores with spaces and title-case it
    return name.replace('_', ' ').replace('-', ' ').strip().title()

def get_folder_title(folder_path):
    """Extracts and cleans the folder name to use as a title."""
    folder_name = os.path.basename(folder_path)
    return clean_title(folder_name)

def scan_docs_directory(docs_dir="docs"):
    """
    Recursively scans the docs directory to build a flat list of pages.
    Targets explicit files to prevent MkDocs relative path validation warnings.
    """
    links = []
    
    for root, dirs, files in os.walk(docs_dir):
        dirs.sort()
        files.sort()
        
        # Calculate relative path from the docs directory
        rel_path = os.path.relpath(root, docs_dir)
        
        for file in files:
            if not file.endswith(".md"):
                continue
                
            if rel_path == ".":
                # Files directly in the root docs directory
                if file.lower() == "index.md" or file.lower() == "readme.md":
                    continue
                url_path = file
                title = clean_title(file)
            else:
                # Files in subdirectories (target the explicit markdown file directly)
                if file.lower() == "readme.md" or file.lower() == "index.md":
                    url_path = f"{rel_path}/{file}".replace("\\", "/")
                    title = get_folder_title(root)
                else:
                    url_path = f"{rel_path}/{file}".replace("\\", "/")
                    title = clean_title(file)
            
            url_path = url_path.replace("\\", "/")
            
            if title:
                links.append((title, url_path))
                
    return links

def main():
    docs_dir = "docs"
    if not os.path.exists(docs_dir):
        print(f"Error: '{docs_dir}' directory not found.")
        return

    print("Scanning docs folder for topics...")
    all_links = scan_docs_directory(docs_dir)
    
    if not all_links:
        print("No markdown topics found.")
        return

    # Build the markdown block
    markdown_index = "\n\n---\n## Quick Site Directory\n\n"
    for title, path in all_links:
        markdown_index += f"- [{title}]({path})\n"

    # Locate homepage to append
    homepage_candidates = [
        os.path.join(docs_dir, "index.md"),
        os.path.join(docs_dir, "README.md")
    ]
    
    homepage_path = None
    for candidate in homepage_candidates:
        if os.path.exists(candidate):
            homepage_path = candidate
            break
            
    if homepage_path:
        with open(homepage_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Split and clean previous runs
        split_marker = "\n\n---\n## Quick Site Directory"
        if split_marker in content:
            content = content.split(split_marker)[0]

        new_content = content.rstrip() + markdown_index

        with open(homepage_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        
        print(f"✅ Successfully added {len(all_links)} links to '{homepage_path}' for crawler indexing!")
    else:
        print("Error: Could not locate your root homepage (index.md or README.md).")

if __name__ == "__main__":
    main()