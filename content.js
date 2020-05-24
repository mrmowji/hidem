let count = 0;
let rules = [];

window.onload = function () {
  chrome.runtime.sendMessage({ request: "get-rules" }, function (response) {
    rules = response;
    //highlightElements();
    hideElements();
  });

  // Create an observer instance
  let observer = new MutationObserver(function (mutations) {
    //console.log(mutations);
    mutations.forEach(function (mutation) {
      var newNodes = mutation.addedNodes; // DOM NodeList
      if (newNodes !== null) {
        //console.log(newNodes);
        for (let newNode of newNodes) {
          console.log(newNode);
          hideElements(newNode);
          /*if (mustHide(newNode)) {
            hideElement(newNode);
            count++;
          }*/
        }
        // If there are new nodes added
        /*var $nodes = $(newNodes); // jQuery set
        $nodes.each(function () {
          var $node = $(this);
          if ($node.hasClass("message")) {
            // do something
          }
        });*/
      }
    });
  });

  // Pass in the target node, as well as the observer options
  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
    characterData: true,
  });

  /*chrome.runtime.onMessage.addListener(function messageReceived(message, sender, sendResponse) {
    if (message.request != undefined) {
      if (message.request == "hide-elements") {
        hideElements(message.elements);
      }
    }
  });*/
};

function highlightElements() {
  let lastHighlightedElement = null;
  document.addEventListener("mouseover", function (e) {
    e.stopPropagation();
    let element = e.target;
    if (lastHighlightedElement !== element) {
      //console.log(lastHighlightedElement, element);
      if (lastHighlightedElement !== null) {
        unhighlightElement(lastHighlightedElement);
      }
      highlightElement(element);
      lastHighlightedElement = element;
    }
  });
}

function highlightElement(element) {
  element.style.outline = "5px solid red";
}

function unhighlightElement(element) {
  element.style.outline = "";
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
}

function hideElements(mainElement = document.body) {
  for (let rule of rules) {
    let elementsToCheck = [];
    if (mainElement.matches(rule.elementSelector)) {
      elementsToCheck = [mainElement];
    } else {
      elementsToCheck = mainElement.querySelectorAll(rule.elementSelector);
    }
    for (let element of elementsToCheck) {
      if (mustHide(element)) {
        hideElement(element);
        count++;
      }
    }
  }
  if (count == 0) {
    console.log("No element is hidden by Hidem!");
  } else {
    console.log(count + " element(s) are hidden by Hidem!");
    chrome.runtime.sendMessage(
      { request: "set-badge-text", text: count },
      function (response) {}
    );
  }
}

function hideElement(element) {
  //console.log(element.innerText);
  element.style.display = "none";
  element.classList.add("hidem");
}

function mustHide(element) {
  for (let rule of rules) {
    if (!element.matches(rule.elementSelector)) {
      return false;
    }
    for (let pattern of rule.elementPatterns) {
      let innerElementsToCheck = element.querySelectorAll(
        pattern.targetInnerElementSelector
      );
      for (let innerElement of innerElementsToCheck) {
        if (new RegExp(pattern.pattern, "i").test(innerElement.innerText)) {
          return true;
        }
      }
    }
  }
  return false;
}
