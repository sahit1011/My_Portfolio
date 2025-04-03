// This script runs before the page loads
(function() {
  // Check if this is the first load
  if (!sessionStorage.getItem('hasLoaded')) {
    // Show loading screen immediately
    document.addEventListener('DOMContentLoaded', function() {
      // Create loading screen elements
      const loadingScreen = document.createElement('div');
      loadingScreen.id = 'initial-loading-screen';
      loadingScreen.style.position = 'fixed';
      loadingScreen.style.inset = '0';
      loadingScreen.style.display = 'flex';
      loadingScreen.style.alignItems = 'center';
      loadingScreen.style.justifyContent = 'center';
      loadingScreen.style.background = 'linear-gradient(to bottom, #1a202c, #000000, #1a202c)';
      loadingScreen.style.zIndex = '9999';
      
      const content = document.createElement('div');
      content.style.textAlign = 'center';
      content.style.padding = '2rem';
      content.style.maxWidth = '500px';
      
      const title = document.createElement('h1');
      title.style.fontSize = '2.5rem';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '1.5rem';
      title.style.color = 'white';
      title.innerHTML = '<span style="color: #3b82f6;">Anil Sahith</span>\'s Portfolio';
      
      const spinner = document.createElement('div');
      spinner.style.width = '80px';
      spinner.style.height = '80px';
      spinner.style.margin = '2rem auto';
      spinner.style.borderRadius = '50%';
      spinner.style.border = '6px solid rgba(59, 130, 246, 0.2)';
      spinner.style.borderTopColor = '#3b82f6';
      spinner.style.animation = 'spin 1s linear infinite';
      
      const style = document.createElement('style');
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      
      const message = document.createElement('p');
      message.style.fontSize = '1.25rem';
      message.style.color = '#d1d5db';
      message.style.marginBottom = '1rem';
      message.textContent = 'Loading terminal environment...';
      
      const subMessage = document.createElement('p');
      subMessage.style.fontSize = '0.875rem';
      subMessage.style.color = '#9ca3af';
      subMessage.textContent = 'Please wait, the page will refresh automatically.';
      
      // Assemble the loading screen
      content.appendChild(title);
      content.appendChild(spinner);
      content.appendChild(message);
      content.appendChild(subMessage);
      loadingScreen.appendChild(content);
      document.head.appendChild(style);
      document.body.appendChild(loadingScreen);
      
      // Set the flag that we've shown the loading screen
      sessionStorage.setItem('loadingShown', 'true');
      
      // Auto-refresh after a delay
      setTimeout(() => {
        sessionStorage.setItem('hasLoaded', 'true');
        window.location.reload();
      }, 3000);
    });
  }
})();
