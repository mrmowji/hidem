window.onload = function() {
  let rules = [];
  chrome.runtime.sendMessage({request: "get-rules"}, function(response) {
    rules = response;
    hideElements(rules);
  });

  /*chrome.runtime.onMessage.addListener(function messageReceived(message, sender, sendResponse) {
    if (message.request != undefined) {
      if (message.request == "hide-elements") {
        hideElements(message.elements);
      }
    }
  });*/
};

function hideElements(rules) {
  let count = 0;
  console.log(rules);
  for (let rule of rules) {
    let elementsToCheck = document.querySelectorAll(rule.elementSelector);
    console.log(elementsToCheck);
    if (elementsToCheck.length > 0) {
      for (let element of elementsToCheck) {
        console.log(element.innerHTML);
        let targetsToCheck = element.querySelectorAll(rule.targetSelector);
        if (targetsToCheck.length > 0) {
          for (let target of targetsToCheck) {
            console.log(target.innerHTML);
            for (let pattern of rule.contentPatterns) {
              if (target.innerHTML.toLowerCase().indexOf(pattern.toLowerCase()) >= 0) {
                count++;
                element.style.display = "none";
              }
            }
          }
        }
      }
    }
  }
  if (count == 0) {
    console.log("No element is hidden by Hidem!");
  } else {
    console.log(count + " element(s) are hidden by Hidem!");
    chrome.runtime.sendMessage({request: "set-badge-text", text: count}, function(response) { });
  }
}