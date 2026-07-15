document.addEventListener("DOMContentLoaded", function() {
    // Dynamically get the current page's title and URL
    // We split by ' - ' to remove the site name from the title (e.g., "CAP Theorem - Chain of Knowledge")
    const pageTitle = document.title.split(' - ')[0].trim(); 
    const pageUrl = window.location.href;

    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(pageTitle);

    // Define the share links and their SVG icons (Material Design Icons)
    const shareLinks = [
        { 
            name: 'X (Twitter)', 
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, 
            icon: 'M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z' 
        },
        { 
            name: 'LinkedIn', 
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, 
            icon: 'M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z' 
        },
        { 
            name: 'Reddit', 
            url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, 
            icon: 'M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M14.6 11.2A1.4 1.4 0 0 1 13.2 12.6A1.4 1.4 0 0 1 11.8 11.2A1.4 1.4 0 0 1 13.2 9.8A1.4 1.4 0 0 1 14.6 11.2M7 11.2A1.4 1.4 0 0 1 8.4 12.6A1.4 1.4 0 0 1 7 14A1.4 1.4 0 0 1 5.6 12.6A1.4 1.4 0 0 1 7 11.2M12 17.3C10.1 17.3 8.5 16.5 7.4 15.2C7.6 15 7.8 14.8 8 14.6C8.9 15.5 10.4 16.1 12 16.1C13.6 16.1 15.1 15.5 16 14.6C16.2 14.8 16.4 15 16.6 15.2C15.5 16.5 13.9 17.3 12 17.3Z' 
        }
    ];

    // Create the HTML structure
    const container = document.createElement('div');
    container.className = 'share-buttons-container';
    container.innerHTML = `<p class="share-title">Share this page:</p><div class="share-buttons"></div>`;
    
    const buttonsContainer = container.querySelector('.share-buttons');
    
    shareLinks.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'share-btn';
        a.title = `Share on ${link.name}`;
        a.innerHTML = `<svg viewBox="0 0 24 24"><path d="${link.icon}"/></svg><span>${link.name}</span>`;
        buttonsContainer.appendChild(a);
    });

    // Inject the buttons at the bottom of the article content
    const article = document.querySelector('.md-content__inner');
    if (article) {
        article.appendChild(container);
    }
});