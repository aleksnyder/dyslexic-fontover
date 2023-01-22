const CSS = `
@font-face {
  font-family: "Open Dyslexic";
  src: url('https://github.com/aleksnyder/dyslexic-fontover/blob/main/fonts/OpenDyslexic-Regular.woff') format('woff');
}
body {
  font-family: "Open Dyslexic";
}
`;
const TITLE_APPLY = "Apply Font";
const TITLE_REMOVE = "Remove Font";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

/*
Toggle Fontover: based on the current title, insert or remove the CSS.
Update the page action's title and icon to reflect its state.
*/
function toggleDyslexicFont(tab) {
  function gotTitle(title) {
    if (title === TITLE_APPLY) {
      browser.pageAction.setIcon({
        tabId: tab.id,
        path: "icons/dyslexic-fontover-on-32.svg"
      });
      browser.pageAction.setTitle({
        tabId: tab.id,
        title: TITLE_REMOVE
      });

      browser.tabs.insertCSS({code: CSS});
    } else {
      browser.pageAction.setIcon({
        tabId: tab.id,
        path: "icons/dyslexic-fontover-off-32.svg"
      });
      browser.pageAction.setTitle({
        tabId: tab.id,
        title: TITLE_APPLY
      });

      browser.tabs.removeCSS({code: CSS});
    }
  }

  let gettingTitle = browser.pageAction.getTitle({tabId: tab.id});
  gettingTitle.then(gotTitle);
}

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
Argument url must be a valid URL string.
*/
function protocolIsApplicable(url) {
  const protocol = (new URL(url)).protocol;
  return APPLICABLE_PROTOCOLS.includes(protocol);
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  if (protocolIsApplicable(tab.url)) {
    browser.pageAction.setIcon({
      tabId: tab.id,
      path: "icons/dyslexic-fontover-off-32.svg"
    });

    browser.pageAction.setTitle({
      tabId: tab.id,
      title: TITLE_APPLY
    });

    browser.pageAction.show(tab.id);
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/
let gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

/*
Apply Dyslexic Fontover when the page action is clicked.
*/
browser.pageAction.onClicked.addListener(toggleDyslexicFont);