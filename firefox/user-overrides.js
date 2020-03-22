/* My ghacks user.js overrides - see https://github.com/ghacksuserjs/ghacks-user.js/wiki/3.3-Updater-Scripts */
/* Use the format below to comment out preferences in the original user.js when the updater runs. This is the best option when wanting to fall back to default behaviour */
//// --- comment-out --- 'prefname.goes.here'

//// --- comment-out --- 'app.update.auto' // 0302a - I need this as Okta is a PITA if I don't have an up-to-date version
//// --- comment-out --- 'extensions.pocket.enabled' // 0510 - I like Pocket
//// --- comment-out --- 'browser.formfill.enable' // 0860
//// --- comment-out --- 'privacy.sanitize.sanitizeOnShutdown' // 2802
//// --- comment-out --- 'privacy.resistFingerprinting'  // 4501 - this breaks Okta login
//// --- comment-out --- 'privacy.resistFingerprinting.letterboxing' // 4504

user_pref("browser.startup.page", 3); // 0102 - I want my previous session restored cos crashes
user_pref("browser.startup.homepage", "moz-extension://2e261119-0837-c54f-8aa1-c96aa41ee1f4/dashboard.html"); // 0103 - I use the Momentum extension
user_pref("browser.search.region", "GB"); // 0201b - [HIDDEN PREF] I like my language proper
user_pref("intl.accept_languages", "en-gb,en"); // 0207 - cos english
user_pref("security.enterprise_roots.enabled", true) // Trust keychain company certs - might workd - https://www.jamf.com/jamf-nation/discussions/25166/how-to-firefox-trusting-company-certificates
user_pref("accessibility.typeaheadfind.flashBar", 0); // I don't want the toolbar to flash when a find matches


//user_pref("extensions.pocket.enabled", true); // 0510 - I like Pocket
//user_pref("browser.formfill.enable", true); // 0860
//user_pref("privacy.sanitize.sanitizeOnShutdown", false); // 2802
//user_pref("privacy.resistFingerprinting", false); // 4501 - this breaks Okta login
//user_pref("privacy.resistFingerprinting.letterboxing", false); // 4504