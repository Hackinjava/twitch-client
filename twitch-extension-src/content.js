// Twitch Client Simulator - Content Script

(function() {
  'use strict';

  let spamInterval = null;
  let followerCount = 100;
  let isPanelVisible = false;

  // Random username generator
  function generateRandomUsername() {
    const prefixes = ['xX', 'Pro', 'Epic', 'Cool', 'Dark', 'Night', 'Fire', 'Ice', 'Shadow', 'Storm', 'Hyper', 'Mega', 'Ultra', 'Super', 'Cyber', 'Neon', 'Ghost', 'Ninja', 'Dragon', 'Phoenix'];
    const names = ['Gamer', 'Player', 'Streamer', 'King', 'Queen', 'Lord', 'Master', 'Slayer', 'Hunter', 'Warrior', 'Mage', 'Rogue', 'Knight', 'Wizard', 'Archer', 'Assassin', 'Titan', 'Legend', 'Hero', 'Champ'];
    const suffixes = ['123', '456', '789', '007', '999', 'XXX', 'YT', 'TV', 'GG', 'OP', 'FTW', 'LOL', 'BRB', 'AFK', '2024', '2025', '_', '!', '#'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const suffix = Math.random() > 0.5 ? suffixes[Math.floor(Math.random() * suffixes.length)] : Math.floor(Math.random() * 9999);
    
    return prefix + name + suffix;
  }

  // Random donation message generator
  function generateDonationMessage() {
    const messages = [
      'Great stream! Keep it up!',
      'Love your content!',
      'You\'re amazing!',
      'Best streamer ever!',
      'Thanks for the entertainment!',
      'So talented!',
      'Keep grinding!',
      'This is awesome!',
      'Can\'t stop watching!',
      'You deserve more viewers!',
      'Epic gameplay!',
      'So funny! 😂',
      'Insane skills!',
      'First time here, love it!',
      'Been following since day one!',
      'You got this!',
      'Legendary stream!',
      'Absolutely incredible!',
      'Much appreciated!',
      'Support from Brazil! 🇧🇷'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Create toggle button
  function createToggleButton() {
    if (document.getElementById('tcc-toggle-btn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'tcc-toggle-btn';
    btn.textContent = '🎮 Tools';
    btn.onclick = togglePanel;
    document.body.appendChild(btn);
  }

  // Toggle panel visibility
  function togglePanel() {
    if (isPanelVisible) {
      hidePanel();
    } else {
      showPanel();
    }
  }

  // Show panel
  function showPanel() {
    if (document.getElementById('twitch-client-overlay')) {
      document.getElementById('twitch-client-overlay').style.display = 'block';
      isPanelVisible = true;
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'twitch-client-overlay';
    overlay.innerHTML = `
      <div class="tcc-panel">
        <div class="tcc-header">
          <h3 class="tcc-title">🎮 Twitch Client Tools</h3>
          <button class="tcc-close" onclick="document.getElementById('twitch-client-overlay').style.display='none'">×</button>
        </div>
        
        <div class="tcc-follower-display">
          <div class="tcc-follower-count" id="tcc-follower-count">${followerCount}</div>
          <div class="tcc-follower-label">Followers</div>
        </div>
        
        <div class="tcc-section">
          <label class="tcc-label">Set Followers (1-1000):</label>
          <input type="number" class="tcc-input" id="tcc-follower-input" min="1" max="1000" value="${followerCount}">
          <button class="tcc-btn" id="tcc-set-followers">Update Followers</button>
        </div>
        
        <div class="tcc-section">
          <label class="tcc-label">Chat Message:</label>
          <input type="text" class="tcc-input" id="tcc-spam-message" placeholder="Enter message to spam">
          <button class="tcc-btn success" id="tcc-start-spam">▶ Start Spam</button>
          <button class="tcc-btn danger" id="tcc-stop-spam" style="display:none;">■ Stop Spam</button>
        </div>
        
        <div class="tcc-section">
          <button class="tcc-btn" id="tcc-generate-donation">💰 Generate Donation</button>
        </div>
        
        <div class="tcc-status">✓ Active on this channel</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    isPanelVisible = true;
    
    // Add event listeners
    document.getElementById('tcc-set-followers').addEventListener('click', setFollowers);
    document.getElementById('tcc-start-spam').addEventListener('click', startSpam);
    document.getElementById('tcc-stop-spam').addEventListener('click', stopSpam);
    document.getElementById('tcc-generate-donation').addEventListener('click', generateDonation);
  }

  // Hide panel
  function hidePanel() {
    const overlay = document.getElementById('twitch-client-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    isPanelVisible = false;
  }

  // Set followers
  function setFollowers() {
    const input = document.getElementById('tcc-follower-input');
    let count = parseInt(input.value);
    
    if (count < 1) count = 1;
    if (count > 1000) count = 1000;
    
    followerCount = count;
    document.getElementById('tcc-follower-count').textContent = count;
    input.value = count;
  }

  // Start spam
  function startSpam() {
    const messageInput = document.getElementById('tcc-spam-message');
    const message = messageInput.value.trim();
    
    if (!message) {
      alert('Please enter a message first!');
      return;
    }

    const startBtn = document.getElementById('tcc-start-spam');
    const stopBtn = document.getElementById('tcc-stop-spam');
    
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    
    // Create spam indicator
    if (!document.getElementById('tcc-spam-indicator')) {
      const indicator = document.createElement('div');
      indicator.id = 'tcc-spam-indicator';
      indicator.className = 'tcc-spam-indicator';
      indicator.textContent = '⚠ Spam Active';
      document.body.appendChild(indicator);
    }

    // Simulate sending messages (visual only - doesn't actually send to Twitch)
    spamInterval = setInterval(() => {
      console.log('[TCC Spam]', message);
      // Note: This is a simulation. Actual chat injection would violate Twitch ToS.
    }, 1000);
  }

  // Stop spam
  function stopSpam() {
    if (spamInterval) {
      clearInterval(spamInterval);
      spamInterval = null;
    }
    
    const startBtn = document.getElementById('tcc-start-spam');
    const stopBtn = document.getElementById('tcc-stop-spam');
    const indicator = document.getElementById('tcc-spam-indicator');
    
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    
    if (indicator) {
      indicator.remove();
    }
  }

  // Generate donation
  function generateDonation() {
    const username = generateRandomUsername();
    const amount = (Math.random() * 100 + 1).toFixed(2);
    const message = generateDonationMessage();
    
    const notification = document.createElement('div');
    notification.className = 'tcc-donation-notification';
    notification.innerHTML = `
      <div class="tcc-donation-header">
        <span class="tcc-donation-icon">💰</span>
        <span class="tcc-donation-username">${username}</span>
        <span class="tcc-donation-amount">$${amount}</span>
      </div>
      <div class="tcc-donation-message">${message}</div>
      <div class="tcc-donation-footer">Just now</div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'tccSlideOut 0.5s ease-out forwards';
      setTimeout(() => notification.remove(), 500);
    }, 5000);
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'setFollowers':
        followerCount = request.count;
        const countDisplay = document.getElementById('tcc-follower-count');
        const countInput = document.getElementById('tcc-follower-input');
        if (countDisplay) countDisplay.textContent = request.count;
        if (countInput) countInput.value = request.count;
        break;
      
      case 'startSpam':
        const msgInput = document.getElementById('tcc-spam-message');
        if (msgInput) msgInput.value = request.message;
        startSpam();
        break;
      
      case 'stopSpam':
        stopSpam();
        break;
      
      case 'generateDonation':
        generateDonation();
        break;
    }
    
    sendResponse({ success: true });
  });

  // Initialize when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Only activate on actual channel pages
    const url = window.location.href;
    const match = url.match(/twitch\.tv\/([^/?]+)/);
    
    if (match && match[1] !== 'directory' && match[1] !== 'videos' && match[1] !== 'about' && match[1] !== 'popout') {
      createToggleButton();
      console.log('[TCC] Twitch Client Tools activated for channel:', match[1]);
    } else {
      console.log('[TCC] Not on a channel page, extension inactive');
    }
  }
})();
