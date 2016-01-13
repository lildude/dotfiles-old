{$, View, TextEditorView} = require "atom"
config = require "./config"
utils = require "./utils"
CSON = require "season"
fs = require "fs-plus"

posts = null # to cache it

module.exports =
class InsertLinkView extends View
  editor: null
  links: null
  referenceId: false
  previouslyFocusedElement: null

  @content: ->
    @div class: "markdown-writer markdown-writer-dialog overlay from-top", =>
      @label "Insert Link", class: "icon icon-globe"
      @div =>
        @label "Text to be displayed", class: "message"
        @subview "textEditor", new TextEditorView(mini: true)
        @label "Web Address", class: "message"
        @subview "urlEditor", new TextEditorView(mini: true)
        @label "Title", class: "message"
        @subview "titleEditor", new TextEditorView(mini: true)
      @div class: "dialog-row", =>
        @input type: "checkbox", outlet: "saveCheckbox"
        @span "Automatically link to this text next time", class: "side-label"
      @div outlet: "searchBox", =>
        @label "Search Posts", class: "icon icon-search"
        @subview "searchEditor", new TextEditorView(mini: true)
        @ul class: "markdown-writer-list", outlet: "searchResult"

  initialize: ->
    @handleEvents()
    @on "core:confirm", => @onConfirm()
    @on "core:cancel", => @detach()

  handleEvents: ->
    @searchEditor.hiddenInput.on "keyup", =>
      @updateSearch(@searchEditor.getText()) if posts
    @searchResult.on "click", "li", (e) => @useSearchResult(e)

  onConfirm: ->
    text = @textEditor.getText()
    url = @urlEditor.getText().trim()
    title = @titleEditor.getText().trim()
    if url then @insertLink(text, title, url) else @removeLink(text)
    @updateSavedLink(text, title, url)
    @detach()

  display: ->
    @previouslyFocusedElement = $(':focus')
    @editor = atom.workspace.getActiveEditor()
    atom.workspaceView.append(this)
    @fetchPosts()
    @loadSavedLinks =>
      @setLinkFromSelection()
      if @textEditor.getText()
        @urlEditor.getEditor().selectAll()
        @urlEditor.focus()
      else
        @textEditor.focus()

  detach: ->
    return unless @hasParent()
    @previouslyFocusedElement?.focus()
    super

  setLinkFromSelection: ->
    selection = @editor.getSelectedText()
    return unless selection

    if utils.isInlineLink(selection)
      link = utils.parseInlineLink(selection)
      @setLink(link.text, link.url, link.title)
      @saveCheckbox.prop("checked", true) if @isInSavedLink(link)
    else if utils.isReferenceLink(selection)
      link = utils.parseReferenceLink(selection, @editor.getText())
      @referenceId = link.id
      @setLink(link.text, link.url, link.title)
      @saveCheckbox.prop("checked", true) if @isInSavedLink(link)
    else if @getSavedLink(selection)
      link = @getSavedLink(selection)
      @setLink(selection, link.url, link.title)
      @saveCheckbox.prop("checked", true)
    else
      @setLink(selection, "", "")

  updateSearch: (query) ->
    query = query.trim().toLowerCase()
    results = posts.filter (post) ->
      query and post.title.toLowerCase().contains(query)
    results = results.map (post) ->
      "<li data-url='#{post.url}'>#{post.title}</li>"
    @searchResult.empty().append(results.join(""))

  useSearchResult: (e) ->
    @titleEditor.setText(e.target.textContent)
    @urlEditor.setText(e.target.dataset.url)
    @textEditor.setText(e.target.textContent) unless @textEditor.getText()
    @titleEditor.focus()

  insertLink: (text, title, url) ->
    if @referenceId
      @updateReferenceLink(text, title, url)
    else if title
      @insertReferenceLink(text, title, url)
    else
      @editor.insertText("[#{text}](#{url})")

  removeLink: (text) ->
    if @referenceId
      @removeReferenceLink(text)
    else
      @editor.insertText(text)

  insertReferenceLink: (text, title, url) ->
    @editor.buffer.beginTransaction()

    # modify selection
    id = require("guid").raw()[0..7]
    @editor.insertText("[#{text}][#{id}]")

    # insert reference
    position = @editor.getCursorBufferPosition()
    if position.row == @editor.getLastBufferRow()
      @editor.insertNewline() # handle last row position
    else
      @editor.moveCursorToBeginningOfNextParagraph()
    @editor.insertNewline()
    @editor.insertText("  [#{id}]: #{url}" +
      if /^[-\*\!]$/.test(title) then "" else " \"#{title}\"")
    @editor.moveCursorDown()
    line = @editor.selectLine()[0].getText().trim()
    unless utils.isReferenceDefinition(line)
      @editor.moveCursorUp()
      @editor.insertNewlineBelow()
    @editor.setCursorBufferPosition(position)

    @editor.buffer.commitTransaction()

  updateReferenceLink: (text, title, url) ->
    if title
      @editor.buffer.beginTransaction()
      position = @editor.getCursorBufferPosition()
      @editor.buffer.scan /// ^\ * \[#{@referenceId}\]: \ +(.+)$ ///, (match) =>
        @editor.setSelectedBufferRange(match.range)
        @editor.insertText("  [#{@referenceId}]: #{url} \"#{title}\"")
      @editor.setCursorBufferPosition(position)
      @editor.buffer.commitTransaction()
    else
      @removeReferenceLink("[#{text}](#{url})")

  removeReferenceLink: (text) ->
    @editor.buffer.beginTransaction()
    @editor.insertText(text)
    position = @editor.getCursorBufferPosition()
    @editor.buffer.scan /// ^\ * \[#{@referenceId}\]: \ + ///, (match) =>
      @editor.setSelectedBufferRange(match.range)
      @editor.deleteLine()
      emptyLine = !@editor.selectLine()[0].getText().trim()
      @editor.moveCursorUp()
      emptyLineAbove = !@editor.selectLine()[0].getText().trim()
      @editor.deleteLine() if emptyLine and emptyLineAbove
    @editor.setCursorBufferPosition(position)
    @editor.buffer.commitTransaction()

  setLink: (text, url, title) ->
    @textEditor.setText(text)
    @urlEditor.setText(url)
    @titleEditor.setText(title)

  getSavedLink: (text) ->
    @links?[text.toLowerCase()]

  isInSavedLink: (link) ->
    savedLink = @getSavedLink(link.text)
    savedLink and savedLink.title == link.title and savedLink.url == link.url

  updateSavedLink: (text, title, url) ->
    try
      if @saveCheckbox.prop("checked")
        @links[text.toLowerCase()] = title: title, url: url if url
      else if @isInSavedLink(text: text, title: title, url: url)
        delete @links[text.toLowerCase()]
      CSON.writeFileSync(@getSavedLinksPath(), @links)
    catch error
      console.log(error.message)

  loadSavedLinks: (callback) ->
    file = @getSavedLinksPath()
    setLinks = (data) => @links = data || {}; callback()
    fs.exists file, (exists) ->
      if exists
        CSON.readFile file, (error, data) ->
          setLinks(data)
          console.log(error.message) if error
      else
        setLinks()

  getSavedLinksPath: -> config.get("siteLinkPath")

  fetchPosts: ->
    if posts
      @searchBox.hide() unless posts.length > 0
    else
      uri = config.get("urlForPosts")
      succeed = (body) =>
        posts = body.posts

        if posts.length > 0
          @searchBox.show()
          @searchEditor.setText(@textEditor.getText())
          @updateSearch(@textEditor.getText())
      error = (err) =>
        @searchBox.hide()
      utils.getJSON(uri, succeed, error)
