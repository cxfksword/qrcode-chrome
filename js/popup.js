var app= new Vue({
	el: '#app',
	dirty: false,
	qrcode: null,
	timer: null,
	ready: function() {
		var self = this;
		self.qrcode = new QRCode($("#qrcode").get(0), {
			width : 150,
			height : 150
		});
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		    var url = tabs[0].url;

		    if (url != '') {
		    	self.qrcode.makeCode(url);
		    }
		});

		var port = chrome.extension.connect({name: "Sample Communication"});
		port.onMessage.addListener(function(msg) {
			$("#content").val(msg);
		    self.qrcode.makeCode(msg);
		});
	},
	methods: {
	   generateQRcode: function() {
	   		if (!this.dirty) {
	   			return false;
	   		}

	   		if ($.trim($("#content").val()) == '') {
	   			return false;
	   		}

	   		this.qrcode.makeCode($("#content").val());
	   		this.dirty = false;
	   },
	   textareaKeyup: function() {
	   		var self = this;

	   		self.dirty = true
	   		if (self.timer) {
	   			clearTimeout(self.timer);
	   			self.timer = null;
	   		}

	   		self.timer = setTimeout(function() {
	   			self.generateQRcode();
	   		}, 500);
	   }
	}
});