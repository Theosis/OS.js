/*!
 * Dialog: CrashDialog
 *
 * Copyright (c) 2011-2012, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: 
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer. 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @package OSjs.Dialogs
 * @author Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 * @class
 */
OSjs.Dialogs.CrashDialog = (function($, undefined) {
  "$:nomunge";

  var _LINGUAS = {
    "en_US" : {
      "title_proc"  : "Process '%s' crashed!"
    },
    "nb_NO" : {
      "title_proc"  : "Prosess '%s' stoppet!"
    }
  };

  return function(Window, Application, API, argv) {
    "GtkWindow:nomunge, Application:nomunge, API:nomunge, argv:nomunge";

    var LABELS = _LINGUAS[API.system.language()] || _LINGUAS['en_US'];

    /**
     * CrashDialog -- Application Crash Dialog
     *
     * @extends Window
     * @class
     */
    var CrashDialog = Window.extend({

      /**
       * CrashDialog::init() -- Constructor
       * @see Window
       * @constructor
       */
      init : function(title, error, trace, alternative) {
        if ( title.match(/^_/) ) {
          title = title.replace(/^_/, "");
        } else {
          title = sprintf(LABELS.title_proc, title);
        }

        this._super("Crash", false);
        this._content = "<div class=\"Crash\"><span>" + title + "</span><div class=\"error\"><div><b>Error</b></div><textarea></textarea></div><div class=\"trace\"><div><b>Trace</b></div><textarea></textarea></div></div>";
        this._title = title;
        this._icon = 'status/software-update-urgent.png';
        this._is_draggable = true;
        this._is_resizable = false;
        this._is_scrollable = false;
        this._is_sessionable = false;
        this._is_minimizable = true;
        this._is_maximizable = false;
        this._is_closable = true;
        this._is_orphan = false;
        this._is_ontop = true;
        this._width = 600;
        this._height = 300;
        this._gravity = "center";

        this.error = error;
        this.trace = trace;
        this.alternative = alternative;
      },

      /**
       * CrashDialog::create() -- Create DOM elements etc
       * @see Window
       * @return $
       */
      create : function(id, mcallback) {
        var self = this;
        var el = this._super(id, mcallback);

        $(el).find(".Crash").css({
          "position" : "absolute",
          "top" : "5px",
          "left" : "5px",
          "right" : "5px",
          "bottom" : "5px"
        });
        $(el).find(".Crash span").css({
          "font-weight" : "bold"
        });

        $(el).find(".error").css({
          "position" : "absolute",
          "top" : "20px",
          "left" : "0px",
          "right" : "0px",
          "bottom" : "140px"
        }).find("textarea").val(self.error || self.alternative);

        $(el).find(".trace").css({
          "position" : "absolute",
          "top" : "120px",
          "left" : "0px",
          "right" : "0px",
          "bottom" : "0px"
        }).find("textarea").val(self.trace);

        $(el).find("textarea").css({
          "resize" : "none",
          "position" : "absolute",
          "top" : "15px",
          "left" : "0px",
          "right" : "0px",
          "bottom" : "0px",
          "width" : "580px",
          "height" : "70px"
        });
      }


    }); // @endclass

    return construct(CrashDialog, argv); //new CrashDialog(...);
  };
})($);

