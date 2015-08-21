var block_ad_id = 0;
var BlockAd = function(config){
  if(config.width)
    this.width = config.width
  if(config.height)
    this.height = config.height
  if(config.url)
    this.url = config.url
  if(!this.url)
    return alert("No URL set to BlockAd to load")
  if(!config.player)
    return alert("No player object passed for registration")
  this.player = config.player
  this.id = block_ad_id++
  this.container = "#" + this.player.id + "_wrapper"
  this.register()
}

/**
 * Properties for configuration
 */
BlockAd.prototype.id = 0
BlockAd.prototype.width = 300
BlockAd.prototype.height = 250
BlockAd.prototype.url = null
BlockAd.prototype.player = {}
BlockAd.prototype.container = {}

/**
 * Show the block frame
 */
BlockAd.prototype.show = function(){
  var div = $(document.createElement("div"))
  div.css(
    {"margin-left": ($(window).width() - this.width) / 2
    ,"margin-top": ($(window).height() - this.height) / 2
    ,width: this.width
    ,height: this.height
    ,background: "#000"
    ,border: "1px solid #333"
    }
  )
  var blocked = $(document.createElement("div"))
  blocked.css(
    {color: "#fff"
    ,padding: "20px"
    ,"line-height": "10px"
    ,"z-index": "-10"
    }
  )
  blocked.hide()
  blocked.text("Ad was blocked :(")
  blocked.fadeIn(4000)
  div.append(blocked)
  var iframe = $(document.createElement("iframe"))
  iframe.css(
    {width: this.width
    ,height: this.height
    ,position: "absolute"
    ,"margin-top": "-50px"
    ,border: 0
    }
  )
  iframe.prop("src",this.url)
  div.append(iframe)
  var a = $(document.createElement("a"))
  a.css(
    {display: "block"
    ,"margin-left": ($(window).width() - this.width) / 2
    ,background: "white"
    ,color: "black"
    ,width: this.width
    ,cursor: "pointer"
    ,"text-decoration": "none"
    ,"line-height": "20px"
    ,"text-align": "center"
    ,"border-radius": "4px"
    ,"-moz-border-radius": "4px"
    }
  )
  a.click(function(e){
    e.preventDefault()
    this.hide()
  }.bind(this))
  a.hover(
    function(){
      $(this).css("text-decoration","underline")
    }
    ,function(){
      $(this).css("text-decoration","none")
    }
  )
  a.text("Close Ad")
  var wrapper = $(document.createElement("div"))
  wrapper.prop("id","ad_block_" + this.id)
  wrapper.css(
    {position: "absolute"
    ,"z-index": "1000"
    ,top: "0"
    ,left: "0"
    ,width: this.player.getWidth()
    ,height: this.player.getHeight()
    }
  )
  wrapper.append(div)
  wrapper.append(a)
  $(this.container).append(wrapper)
}

/**
 * Resize / position with the player
 */
BlockAd.prototype.resize = function(){
  var el = $("#ad_block_" + this.id)
  var block = el.find("div").first()
  var close = el.find("a").first()
  if(!el.length || !block.length || !close.length) return
  el.css(
    {width: this.player.getWidth()
    ,height: this.player.getHeight()
    }
  )
  block.css(
    {"margin-left": ($(window).width() - this.width) / 2
    ,"margin-top": ($(window).height() - this.height) / 2
    }
  )
  close.css(
    {"margin-left": ($(window).width() - this.width) / 2}
  )
}

/**
 * Destroy the block frame
 */
BlockAd.prototype.hide = function(){
  $("#ad_block_" + this.id).remove()
  if("IDLE" == this.player.getState())
    this.player.play(true)
}

/**
 * Register callbacks to jwplayer
 */
BlockAd.prototype.register = function(){
  this.player.onReady(function()
    {
      this.show()
    }.bind(this)
  )
  this.player.onFullscreen(function(e){
    if(e.fullscreen)
      this.hide()
    else if(!e.fullscreen && "PLAYING" != this.player.getState())
      this.show()
  }.bind(this))
  this.player.onPause(function(e){
    //how do we know if sharing called this??
    if("PLAYING" == e.oldstate)
      this.show()
  }.bind(this))
  this.player.onComplete(function(){
    this.show()
  }.bind(this))
  this.player.onBeforePlay(function(){
    this.hide()
  }.bind(this))
  this.player.onResize(function(){
    this.resize()
  }.bind(this))
}
