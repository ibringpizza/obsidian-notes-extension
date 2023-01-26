# obsidian-notes-extension
A Chrome notes extension that works with Obsidian. This plugin will automatically grab the title and URL of the page you are on and prepend them to whatever notes you take. Title and URL are editable. Before saving your notes, you need to select or create a file to save them to. If there are already notes for the tab in the selected file, your new notes will be appended under that header.

Chrome will close an extension popup once it loses focus, making it impossible to interact with the tab and keep notes open. There may be some way to have unsaved note-persistance but it is not implemented yet. As mentioned above, the plugin will append all new notes on the same tab (same URL and title) underneath the same heading allowing small updates.

You can also create and link to keyword files. There is a 'Send to archive' field that will add the page's URL to an 'archive.md' file in the Obsidian vault root directory to be archived later with tools like yt-dlp. 'Skip notes' skips creating the main note allowing only adding the url to the archive file or only creating keyword files.

Obsidian must be open while using this plugin.

### Setup
- First, install the [obsidian-local-rest-api](https://publish.obsidian.md/hub/02+-+Community+Expansions/02.05+All+Community+Expansions/Plugins/obsidian-local-rest-api) plugin and find your API key in your settings.
- Add your key to the top of popup.js and replace 'API_KEY' in fileselect.js
- Enable developer mode on a cromium-based browser and click 'load unpacked' (in the Extensions tab) to add this plugin to your browser.

### Walkthrough
![image](https://user-images.githubusercontent.com/52234395/214909904-34698378-eaf9-433e-bf00-587d30d0d438.png)

Click 'Select file' to select the file you want to save your notes to.

![image](https://user-images.githubusercontent.com/52234395/214911997-174701d3-cc92-4543-95e3-a613e4adcac7.png)
#### NOTE: Folders must have at least 1 .md file in them for them to be visible to the file selection function
#### All directories need to be made ahead of time as the Rest plugin doesn't allow folder creation
You can select a directory and add the new file name you want or select an existing file. Afterwards, press 'select' to close the file selector.

Add keywords by selecting a word and pressing '\[' to surround it with double brackets (Obsidian's keyword format).

![image](https://user-images.githubusercontent.com/52234395/214918419-39c38044-9218-4393-844d-501b723a9e06.png)

A keyword text and file input are automatically created in the 'Keyword paths' section.

### Issues/Future updates
- The 'Check previous page notes' function is not yet implemented.
- Unable to preview existing files or text under existing headings.
- The 'remove' button for keyword paths does not remove the double brackets around the keyword in the main notes section.
- Some bugs when creating keywords in a keyword text field.
