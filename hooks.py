import re
from bs4 import BeautifulSoup

def on_page_content(html, page, config, files):
    """Accessibility optimization: Semantic section nesting."""
    soup = BeautifulSoup(html, 'html.parser')
    
    for broken_section in soup.find_all('section'):
        broken_section.unwrap()

    elements = list(soup.children)
    if not elements:
        return html

    new_soup = BeautifulSoup("", "html.parser")
    stack = []
    heading_re = re.compile(r'^h([2-6])$')

    for el in elements:
        if el.name == 'h1':
            stack.clear()
            new_soup.append(el)
        else:
            match = heading_re.match(el.name or '')
            if match:
                current_level = int(match.group(1))
                while stack and stack[-1][0] >= current_level:
                    stack.pop()
                
                new_section = soup.new_tag("section")
                new_section.append(el)
                
                if stack:
                    stack[-1][1].append(new_section)
                else:
                    new_soup.append(new_section)
                
                stack.append((current_level, new_section))
            else:
                if stack:
                    stack[-1][1].append(el)
                else:
                    new_soup.append(el)

    for nav_label in new_soup.find_all("label", class_="md-nav__link"):
        next_sibling = nav_label.find_next_sibling("a")
        if next_sibling and nav_label.get_text(strip=True) == next_sibling.get_text(strip=True):
            nav_label["aria-hidden"] = "true"

    return str(new_soup)


def on_post_page(output, page, config):
    """Inject Google Site Verification meta tag."""
    verification_tag = '<meta name="google-site-verification" content="sMIWum850pdvHyZ6G67cr-Hm5rMnaisMBWQPhrguobg" />'
    
    if '<head>' in output:
        return output.replace('<head>', f'<head>\n    {verification_tag}', 1)
    
    return output


def on_page_markdown(markdown, page, config, files):
    """
    Injects the Gumroad Audiobook Promo ONLY on the Topic 0 (Foundations) page.
    """
    # Check if the current page is the Foundations chapter
    # This safely matches the folder name regardless of whether it's README.md or index.md
    if '000-Foundations' in page.file.src_path:
        
        gumroad_url = "https://mamoonalshamali.gumroad.com/l/foundations-system-design-audio"
        
        # We use native MkDocs Admonition (!!! info) and Button ({: .md-button }) syntax
        promo_block = f"""
!!! info "🎧 Listen to this Chapter for Free"
    Prefer learning on the go? Download the high-fidelity audiobook version of **Topic 0** to listen during your commute or workout.
    
    [Download Free Audiobook 🎧]({gumroad_url}){{: .md-button .md-button--primary }}
    

"""
        # Prepend the promo block to the very top of the page's markdown
        return promo_block + markdown
        
    # For all other pages, return the markdown untouched
    return markdown