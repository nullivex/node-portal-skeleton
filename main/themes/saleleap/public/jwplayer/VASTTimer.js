var VASTTimer = function(config){
  if(!config.player)
    return alert("No player object passed for registration")
  this.player = config.player
  this.container = "#" + this.player.id + "_wrapper"
  this.box = "#" + this.player.id + "_vast_timer"
  this.register()
}

/**
 * Properties for configuration
 */
VASTTimer.prototype.player = {}
VASTTimer.prototype.container = null
VASTTimer.prototype.box = null
VASTTimer.prototype.bar_height = 30
VASTTimer.prototype.time_remaining = 30
VASTTimer.prototype.time_counted = 0

/**
 * Show the block frame
 */
VASTTimer.prototype.show = function(){
  var div = $(document.createElement("div"))
  div.prop("id",this.box.replace("#",""))
  div.css(
    {position: "absolute"
    ,"line-height": this.bar_height + "px"
    ,background: "#222"
    ,top: $(window).height() - this.bar_height
    ,left: 0
    ,width: $(window).width()
    ,opacity: "0.8"
    ,color: "#fff"
    ,"z-index": "100"
    ,"text-align": "center"
    }
  )
  div.html(
    "Ad will complete in " +
    "<span class=\"time\">" +
    this.time_remaining +
    "</span> seconds " +
    ", thanks for your patience "
  )
  $(this.container).append(div)
  setTimeout(this.update.bind(this),1000)
}

/**
 * Resize / position with the player
 */
VASTTimer.prototype.resize = function(){
  $(this.box).css(
    {width: $(window).width()
    ,top: $(window).height() - this.bar_height
    }
  )
}

/**
 * Update time remaining
 */
VASTTimer.prototype.update = function(){
  this.time_remaining--
  this.time_counted++
  if(this.time_remaining <= 0)
    return this.hide()
  $(this.box).find(".time").first().text(this.time_remaining)
  setTimeout(this.update.bind(this),1000)
}

/**
 * Destroy the block frame
 */
VASTTimer.prototype.hide = function(){
  $(this.box).remove()
}

/**
 * Register callbacks to jwplayer
 */
VASTTimer.prototype.register = function(){
  this.player.onResize(function(){
    this.resize()
  }.bind(this))
  this.player.onAdImpression(function(){
    this.show()
  }.bind(this))
  this.player.onPlay(function(){
    this.hide()
  }.bind(this))
  this.player.onAdComplete(function(){
    this.hide()
  }.bind(this))
}
