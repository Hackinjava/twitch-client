// Content script for Twitch pages

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateFollowers') {
    updateFollowerDisplay(request.count);
  } else if (request.action === 'spamChat') {
    simulateChatMessage(request.message);
  } else if (request.action === 'showDonation') {
    showDonationNotification(request.username, request.amount, request.message);
  }
  sendResponse({ status: 'ok' });
});

// Update follower count display
function updateFollowerDisplay(count) {
  // Create or update follower badge near the channel name
  let badge = document.getElementById('twitch-sim-follower-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'twitch-sim-follower-badge';
    badge.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      background: #9147ff;
      color: white;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(badge);
  }
  badge.textContent = `👥 ${count} Followers`;
}

// Simulate chat message (visual only - cannot actually send to Twitch)
function simulateChatMessage(message) {
  const chatContainer = document.querySelector('[data-test-selector="chat-list-content"]') || 
                        document.querySelector('.chat-list__lines') ||
                        document.querySelector('#chat-messages');
  
  if (!chatContainer) {
    console.log('Chat container not found');
    return;
  }

  const messageEl = document.createElement('div');
  messageEl.className = 'chat-line__message';
  messageEl.style.cssText = `
    padding: 5px 10px;
    background: rgba(145, 71, 255, 0.2);
    border-left: 3px solid #9147ff;
    margin: 5px 0;
    animation: fadeIn 0.3s ease;
  `;
  
  const randomUser = ['SimUser1', 'FakeViewer', 'BotAccount', 'TestChatter'][Math.floor(Math.random() * 4)];
  messageEl.innerHTML = `
    <span style="color: #9147ff; font-weight: bold;">${randomUser}:</span>
    <span style="color: #efeff1;">${message}</span>
  `;
  
  chatContainer.insertBefore(messageEl, chatContainer.firstChild);
  
  // Remove after 5 seconds
  setTimeout(() => messageEl.remove(), 5000);
}

// Show donation notification
function showDonationNotification(username, amount, message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 20px;
    background: linear-gradient(135deg, #9147ff, #00f593);
    color: white;
    padding: 20px;
    border-radius: 10px;
    min-width: 300px;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    animation: slideIn 0.5s ease;
  `;
  
  notification.innerHTML = `
    <div style="font-size: 18px; font-weight: bold;">💰 ${username} donated $${amount}!</div>
    <div style="margin-top: 10px; font-style: italic;">"${message}"</div>
  `;
  
  document.body.appendChild(notification);
  
  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.5s ease forwards';
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}

console.log('Twitch Simulator Extension loaded!');
