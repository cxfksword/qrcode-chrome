var app= new Vue({
	el: '#app',
	dirty: false,
	qrcode: null,
	timer: null,
	ready: function() {
		var self = this;
		self.qrcode = new QRCode(document.querySelector("#qrcode"), {
			width : 150,
			height : 150
		});
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		    var url = tabs[0].url;

		    if (url != '') {
				self.qrcode.makeCode(url);
				document.querySelector("#content").value = url;
		    }
		});
	},
	methods: {
	   generateQRcode: function() {
	   		if (!this.dirty) {
	   			return false;
	   		}

			var content = document.querySelector("#content").value.trim();
	   		if (content === '') {
	   			return false;
	   		}

	   		this.qrcode.makeCode(content);
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
	   		}, 200);
	   }
	}
});