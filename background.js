let storage = chrome.storage.sync;
let rules = [{
  urlPattern: "https://parscoders.com/project/only-available/*",
  elementSelector: ".todo-tasklist-item",
  targetSelector: ".todo-tasklist-item-title",
  contentPatterns: [
    "ترجمه",
    "مقاله",
    "متلب",
    "پایان نامه", "پایان‌نامه",
    "پروژه خصوصی",
    "موشن",
    "انیمیشن",
    "وردپرس",
    "wordpress",
    "تایپ",
    "اندروید",
    "پیج اینستاگرام",
    "ربات اینستاگرام",
    "لاراول",
    "laravel"
  ],
}];

chrome.runtime.onInstalled.addListener(function() {
  storage.set({rules}, function() {
    console.log("Hidem installed successfully. Time to save time!");
  });
});

storage.get(['rules'], function(result) {
  if (result.rules !== undefined && result.rules !== null) {
    rules = result.rules;
    console.log(rules);
    //chrome.tabs.sendMessage(tabs[0].id, {request: "hide-elements", elements: elements}, function(response) {});
  }
});

chrome.tabs.onActivated.addListener(function(info) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    /*chrome.tabs.sendMessage(tabs[0].id, {request: "hide-elements", elements: elements.filter((value) => {
      let regex = new RegExp(value.urlPattern);
      return regex.test(tabs[0].url);
    })}, function(response) { return true; });*/
    //markTab(tab.url, info.tabId);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, change, tab){
  //markTab(tab.url, tabId);
});

chrome.runtime.onMessage.addListener(function messageReceived(message, sender, sendResponse) {
  if (message.request != undefined) {
    if (message.request == "get-rules") {
      sendResponse(rules.filter((value) => {
        let regex = new RegExp(value.urlPattern);
        console.log(sender);
        return regex.test(sender.tab.url);
      }));
    } else if (message.request == "set-badge-text") {
      chrome.browserAction.setBadgeBackgroundColor({ color: "#F00" }, function() {});
      chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: message.text.toString() }, function() {});
    } else {
      sendResponse(null);
    }
  }
  return true;
});