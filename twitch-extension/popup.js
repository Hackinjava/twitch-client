// Follower functionality
document.getElementById('setFollowers').addEventListener('click', () => {
  const input = document.getElementById('followerInput');
  let value = parseInt(input.value);
  
  if (value < 1) value = 1;
  if (value > 1000) value = 1000;
  
  chrome.storage.local.set({ followers: value }, () => {
    document.getElementById('followerStatus').textContent = `Current: ${value}`;
    input.value = value;
    
    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'updateFollowers', 
          count: value 
        });
      }
    });
  });
});

// Load saved followers
chrome.storage.local.get(['followers'], (result) => {
  if (result.followers) {
    document.getElementById('followerInput').value = result.followers;
    document.getElementById('followerStatus').textContent = `Current: ${result.followers}`;
  }
});

// Chat spam functionality
let spamInterval = null;

document.getElementById('startSpam').addEventListener('click', () => {
  const message = document.getElementById('spamMessage').value.trim();
  if (!message) {
    alert('Please enter a message!');
    return;
  }
  
  if (spamInterval) clearInterval(spamInterval);
  
  document.getElementById('spamStatus').textContent = 'Spamming...';
  
  spamInterval = setInterval(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('twitch.tv')) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'spamChat', 
          message: message 
        });
      }
    });
  }, 1000);
});

document.getElementById('stopSpam').addEventListener('click', () => {
  if (spamInterval) {
    clearInterval(spamInterval);
    spamInterval = null;
  }
  document.getElementById('spamStatus').textContent = 'Inactive';
});

// Fake donation generator
const randomUsernames = [
  'GamerPro2024', 'StreamFan99', 'TwitchLover', 'NightOwl42', 
  'CoolDude123', 'EpicViewer', 'ChatterBox', 'DonoKing',
  'PixelWarrior', 'ChatMaster', 'ViewBot3000', 'SubHunter',
  'ModSquad', 'HypeBeast', 'LurkerNoMore', 'FirstTimer'
];

const donationMessages = [
  'Great stream!', 'Keep it up!', 'Love your content!', 
  'You are awesome!', 'Best streamer ever!', 'Thanks for the entertainment!',
  'POG!', 'Let\'s gooo!', 'Amazing gameplay!', 'So entertaining!'
];

document.getElementById('generateDonation').addEventListener('click', () => {
  const username = randomUsernames[Math.floor(Math.random() * randomUsernames.length)];
  const amount = (Math.random() * 100 + 1).toFixed(2);
  const message = donationMessages[Math.floor(Math.random() * donationMessages.length)];
  
  const logEntry = document.createElement('div');
  logEntry.className = 'donation-entry';
  logEntry.innerHTML = `<strong>${username}</strong> donated $${amount}: ${message}`;
  
  const log = document.getElementById('donationLog');
  log.insertBefore(logEntry, log.firstChild);
  
  // Keep only last 10 entries
  while (log.children.length > 10) {
    log.removeChild(log.lastChild);
  }
  
  // Notify content script to show on Twitch page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url.includes('twitch.tv')) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'showDonation',
        username: username,
        amount: amount,
        message: message
      });
    }
  });
});
