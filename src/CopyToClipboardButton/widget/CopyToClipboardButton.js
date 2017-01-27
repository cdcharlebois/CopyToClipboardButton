define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "dojo/text!CopyToClipboardButton/widget/template/CopyToClipboardButton.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    return declare("CopyToClipboardButton.widget.CopyToClipboardButton", [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,


        widgetBase: null,
        buttonNode: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        // modeler
        attrCopy: null,
        appendInput: false,
        buttonText: "",
        buttonClass: "",

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._setupEvents();
            this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _setupEvents: function() {
            // select text
            var widget = this;
            this.buttonNode.addEventListener('click', function() {
                widget.attrCopy && widget._contextObj.get(widget.attrCopy) ?
                    widget._copyTextToClipboard(widget._contextObj.get(widget.attrCopy)) :
                    widget._copyTextToClipboard('foobar');
            });
        },

        _copyTextToClipboard: function(text) {
            // http://stackoverflow.com/a/30810322
            var textArea = document.createElement("textarea");

            // Place in top-left corner of screen regardless of scroll position.
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;

            // Ensure it has a small width and height. Setting to 1px / 1em
            // doesn't work as this gives a negative w/h on some browsers.
            textArea.style.width = '2em';
            textArea.style.height = '2em';

            // We don't need padding, reducing the size if it does flash render.
            textArea.style.padding = 0;

            // Clean up any borders.
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';

            // Avoid flash of white box if rendered for any reason.
            textArea.style.background = 'transparent';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }

            document.body.removeChild(textArea);
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");
            if (this.appendInput) {
                // setup html
                var btnWrapperNode = this.buttonNode.parentElement,
                    groupNode = btnWrapperNode.parentElement;
                dojoClass.add(btnWrapperNode, 'input-group-btn');
                dojoClass.add(groupNode, 'input-group');
            }
            if (this.buttonText) {
              this.buttonNode.innerText = this.buttonText;
            }
            if (this.buttonClass) {
              dojoClass.add(this.buttonNode, 'btn-' + this.buttonClass);
            }

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback);
        },

        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["CopyToClipboardButton/widget/CopyToClipboardButton"]);
