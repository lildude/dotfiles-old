# My ghacks Firefox Config

[`ghacks-user.js`](https://github.com/ghacksuserjs/ghacks-user.js) is _"an ongoing comprehensive user.js template for configuring and hardening Firefox privacy, security and anti-fingerprinting"_ which I've now implemented.

Steps I took to produce my config:

1. [Backup my profile](https://github.com/ghacksuserjs/ghacks-user.js/wiki/1.2-Backing-Up)
2. Download the template ghacks [`user.js`](https://github.com/ghacksuserjs/ghacks-user.js/blob/master/user.js)
3. Export my current config which includes all the customisations I've made before implementing the `user.js` file using [`prefs_exporter.js`](https://github.com/claustromaniac/Compare-UserJS/blob/master/prefs_exporter.js).
4. Install PowerShell using Homebrew.
5. Compare the exported prefs to the template `user.js` file using [`Compare-UserJS.ps1`](https://github.com/claustromaniac/Compare-UserJS/blob/master/Compare-UserJS.ps1):

    ```console
    $ pwsh -File Compare-UserJS.ps1 exported-config.js ghacks-default-user.js
    Loading exported-config.js ...
    Loading user.js ...
    Parsing exported-config.js ...
    Parsing user.js ...
    Generating and writing report to userJS_diff.log ...
    Don't close the console/terminal!
    All done. Would you like to open the log file with the default editor? (y/n): n
    $
    ```

6. Review all the prefs that match but are different in the log file and add any differences or overrides to `user-overrides.js`.

I then regularly run `update.sh` within this directory, export my prefs and perform the comparison again, making changes as necessary:

```console
$ ./updater.sh


                ############################################################################
                ####                                                                    ####
                ####                           ghacks user.js                           ####
                ####       Hardening the Privacy and Security Settings of Firefox       ####
                ####           Maintained by @Thorin-Oakenpants and @earthlng           ####
                ####            Updater for macOS and Linux by @overdodactyl            ####
                ####                                                                    ####
                ############################################################################


Documentation for this script is available here: https://github.com/ghacksuserjs/ghacks-user.js/wiki/3.3-Updater-Scripts

Please observe the following information:
        Firefox profile:  /Users/lildude/.dotfiles/firefox
        Available online: * version 74-alpha
        Currently using:  * version 74-alpha


This script will update to the latest user.js file and append any custom configurations from user-overrides.js. Continue Y/N?
y

Status: user.js has been backed up and replaced with the latest version!
Status: Override file appended: user-overrides.js
$
$ echo n | pwsh -File Compare-UserJS.ps1 exported-config.js user.js
```