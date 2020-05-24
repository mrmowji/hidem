let storage = chrome.storage.sync;
let rules = [
  {
    urlPattern: "https://www.freecodecamp.org/news/?",
    elementSelector: "article.post",
    elementPatterns: [
      {
        targetInnerElementSelector: ".post-card-title a",
        pattern:
          "\\b(oracle|docker|scrum|hugo|azure|aws|webpack|flutter|reactjs|firebase|rails|macos|python|wordpress|java|pytorch|react|redux|xcode|mac|angular|php|yii2|laravel|django|gatsby)\\b",
      },
    ],
    isEnabled: true,
  },
  {
    urlPattern: "https://dev.to/?",
    elementSelector: ".single-article",
    elementPatterns: [
      {
        targetInnerElementSelector: "a.index-article-link",
        pattern:
          "\\b(oracle|docker|scrum|hugo|azure|aws|webpack|flutter|reactjs|firebase|rails|macos|python|wordpress|java|pytorch|react|redux|xcode|mac|angular|php|yii2|laravel|django|gatsby)\\b",
      },
    ],
    isEnabled: true,
  },
  {
    urlPattern: "https://dzone.com/list/?",
    elementSelector: "div.article-content",
    elementPatterns: [
      {
        targetInnerElementSelector: ".article-title",
        pattern:
          "\\b(oracle|docker|scrum|hugo|azure|aws|webpack|flutter|reactjs|firebase|rails|macos|python|wordpress|java|pytorch|react|redux|xcode|mac|angular|php|yii2|laravel|django|gatsby)\\b",
      },
    ],
    isEnabled: true,
  },
  {
    urlPattern: "https://hashnode.com/stories/?",
    elementSelector: "div.preview-card",
    elementPatterns: [
      {
        targetInnerElementSelector: "h1",
        pattern:
          "\\b(oracle|docker|scrum|hugo|azure|aws|webpack|flutter|reactjs|firebase|rails|macos|python|wordpress|java|pytorch|react|redux|xcode|mac|angular|php|yii2|laravel|django|gatsby)\\b",
      },
    ],
    isEnabled: true,
  },
];

chrome.runtime.onInstalled.addListener(function () {
  storage.set({ rules }, function () {
    console.log("Hidem is installed successfully. Time to save time!");
  });
});

storage.get(["rules"], function (result) {
  if (result.rules !== undefined && result.rules !== null) {
    rules = result.rules;
    console.log(rules);
    //chrome.tabs.sendMessage(tabs[0].id, {request: "hide-elements", elements: elements}, function(response) {});
  }
});

chrome.tabs.onActivated.addListener(function (info) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    /*chrome.tabs.sendMessage(tabs[0].id, {request: "hide-elements", elements: elements.filter((value) => {
      let regex = new RegExp(value.urlPattern);
      return regex.test(tabs[0].url);
    })}, function(response) { return true; });*/
    //markTab(tab.url, info.tabId);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
  //markTab(tab.url, tabId);
});

chrome.runtime.onMessage.addListener(function messageReceived(
  message,
  sender,
  sendResponse
) {
  if (message.request != undefined) {
    if (message.request == "get-rules") {
      sendResponse(
        rules.filter((value) => {
          let regex = new RegExp(value.urlPattern);
          console.log(sender);
          return regex.test(sender.tab.url);
        })
      );
    } else if (message.request == "set-badge-text") {
      chrome.browserAction.setBadgeBackgroundColor(
        { color: "#5cb551" },
        function () {}
      );
      chrome.browserAction.setBadgeText(
        { tabId: sender.tab.id, text: message.text.toString() },
        function () {}
      );
    } else {
      sendResponse(null);
    }
  }
  return true;
});
