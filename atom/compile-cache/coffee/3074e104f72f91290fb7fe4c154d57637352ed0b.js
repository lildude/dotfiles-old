(function() {
  var config,
    __slice = [].slice;

  config = require("./config");

  module.exports = {
    siteEngine: {
      title: "Site Engine",
      type: "string",
      "default": config.getDefault("siteEngine"),
      "enum": [config.getDefault("siteEngine")].concat(__slice.call(config.engineNames()))
    },
    siteUrl: {
      title: "Site URL",
      type: "string",
      "default": config.getDefault("siteUrl")
    },
    siteLocalDir: {
      title: "Site Local Directory",
      description: "The absolute path to your site's local directory",
      type: "string",
      "default": config.getDefault("siteLocalDir")
    },
    siteDraftsDir: {
      title: "Site Drafts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteDraftsDir")
    },
    sitePostsDir: {
      title: "Site Posts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("sitePostsDir")
    },
    siteImagesDir: {
      title: "Site Images Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteImagesDir")
    },
    urlForTags: {
      title: "URL to Tags JSON definitions",
      type: "string",
      "default": config.getDefault("urlForTags")
    },
    urlForPosts: {
      title: "URL to Posts JSON definitions",
      type: "string",
      "default": config.getDefault("urlForPosts")
    },
    urlForCategories: {
      title: "URL to Categories JSON definitions",
      type: "string",
      "default": config.getDefault("urlForCategories")
    },
    newDraftFileName: {
      title: "New Draft File Name",
      type: "string",
      "default": config.getCurrentDefault("newDraftFileName")
    },
    newPostFileName: {
      title: "New Post File Name",
      type: "string",
      "default": config.getCurrentDefault("newPostFileName")
    },
    fileExtension: {
      title: "File Extension",
      type: "string",
      "default": config.getCurrentDefault("fileExtension")
    },
    tableAlignment: {
      title: "Table Cell Alignment",
      type: "string",
      "default": config.getDefault("tableAlignment"),
      "enum": ["empty", "left", "right", "center"]
    },
    tableExtraPipes: {
      title: "Table Extra Pipes",
      description: "Insert extra pipes at the start and the end of the table rows",
      type: "boolean",
      "default": config.getDefault("tableExtraPipes")
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb25maWctYmFzaWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE1BQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxhQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsU0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBRlQ7QUFBQSxNQUdBLE1BQUEsRUFBTyxDQUFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBQWlDLFNBQUEsYUFBQSxNQUFNLENBQUMsV0FBUCxDQUFBLENBQUEsQ0FBQSxDQUh4QztLQURGO0FBQUEsSUFLQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxVQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsU0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFNBQWxCLENBRlQ7S0FORjtBQUFBLElBU0EsWUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sc0JBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSxrREFEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxNQUdBLFNBQUEsRUFBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixjQUFsQixDQUhUO0tBVkY7QUFBQSxJQWNBLGFBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLHVCQUFQO0FBQUEsTUFDQSxXQUFBLEVBQWEsb0RBRGI7QUFBQSxNQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEs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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/config-basic.coffee
