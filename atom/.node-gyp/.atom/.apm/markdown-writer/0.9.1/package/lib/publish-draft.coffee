{$} = require "atom"
config = require "./config"
utils = require "./utils"
fs = require "fs-plus"
path = require "path"

module.exports =
class PublishDraft
  draftPath: null
  postPath: null
  frontMatter: null
  editor: null

  constructor: ->
    @editor = atom.workspace.getActiveEditor()
    @draftPath = @editor.getPath()
    @frontMatter = utils.getFrontMatter(@editor.getText())
    @postPath = @getPostPath()

  display: ->
    @updateFrontMatter()
    atom.workspaceView.destroyActivePaneItem()
    @publishDraft()
    atom.workspaceView.open(@postPath)

  updateFrontMatter: ->
    @frontMatter.published = true if @frontMatter.published?
    @frontMatter.date = "#{utils.getDateStr()} #{utils.getTimeStr()}"
    @editor.buffer.scan utils.frontMatterRegex, (match) =>
      match.replace utils.getFrontMatterText(@frontMatter)
    atom.workspaceView.saveActivePaneItem()

  publishDraft: ->
    try
      if fs.existsSync(@postPath)
        alert("Error:\nPost #{@postPath} already exists!")
      else
        fs.renameSync(@draftPath, @postPath)
    catch error
      alert("Error:\n#{error.message}")

  getPostPath: ->
    path.join(@getPostDir(), @getPostName())

  getPostDir: ->
    localDir = config.get("siteLocalDir")
    postsDir = config.get("sitePostsDir")
    postsDir = utils.dirTemplate(postsDir)
    return path.join(localDir, postsDir)

  getPostName: ->
    template = config.get("newPostFileName")
    date = utils.getDate()
    info =
      title: @getPostTitle()
      extension: @getPostExtension()
    return utils.template(template, $.extend(info, date))

  getPostTitle: ->
    if config.get("publishRenameBasedOnTitle")
      utils.dasherize(@frontMatter.title)
    else
      utils.getTitleSlug(@draftPath)

  getPostExtension: ->
    if config.get("publishKeepFileExtname")
      extname = path.extname(@draftPath)
    return extname || config.get("fileExtension")
