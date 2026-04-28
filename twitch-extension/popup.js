document.addEventListener('DOMContentLoaded', () => {
  const followerInput = document.getElementById('followerCount');
  const setFollowersBtn = document.getElementById('setFollowers');
  const spamMessageInput = document.getElementById('spamMessage');
  const startSpamBtn = document.getElementById('startSpam');
  const stopSpamBtn = document.getElementById('stopSpam');
  const generateDonationBtn = document.getElementById('generateDonation');
  const statusDiv = document.getElementById('status');

  let isOnTwitch = false;
  let currentChannel = '';

  // Check if we're on a Twitch channel
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    
    if (url && url.includes('twitch.tv')) {
      const match = url.match(/twitch\.tv\/([^/?]+)/);
      if (match && match[1] !== 'directory' && match[1] !== 'videos' && match[1] !== 'about') {
        isOnTwitch = true;
        currentChannel = match[1];
        statusDiv.innerHTML = `<span class="active">✓ Active on: ${currentChannel}</span>`;
        
        // Enable all buttons
        setFollowersBtn.disabled = false;
        startSpamBtn.disabled = false;
        stopSpamBtn.disabled = false;
        generateDonationBtn.disabled = false;
        followerInput.disabled = false;
        spamMessageInput.disabled = false;
      } else {
        statusDiv.innerHTML = '<span class="inactive">Status: On Twitch homepage (visit a channel)</span>';
        disableAll();
      }
    } else {
      statusDiv.innerHTML = '<span class="inactive">Status: Not on Twitch</span>';
      disableAll();
    }
  });

  function disableAll() {
    setFollowersBtn.disabled = true;
    startSpamBtn.disabled = true;
    stopSpamBtn.disabled = true;
    generateDonationBtn.disabled = true;
    followerInput.disabled = true;
    spamMessageInput.disabled = true;
  }

  // Set Followers
  setFollowersBtn.addEventListener('click', () => {
    if (!isOnTwitch) return;
    
    let count = parseInt(followerInput.value);
    if (count < 1) count = 1;
    if (count > 1000) count = 1000;
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'setFollowers',
        count: count
      });
    });
  });

  // Start Spam
  startSpamBtn.addEventListener('click', () => {
    if (!isOnTwitch) return;
    
    const message = spamMessageInput.value.trim();
    if (!message) {
      alert('Please enter a message to spam');
      return;
    }
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'startSpam',
        message: message
      });
    });
  });

  // Stop Spam
  stopSpamBtn.addEventListener('click', () => {
    if (!isOnTwitch) return;
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'stopSpam'
      });
    });
  });

  // Generate Donation
  generateDonationBtn.addEventListener('click', () => {
    if (!isOnTwitch) return;
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'generateDonation'
      });
    });
  });
});
