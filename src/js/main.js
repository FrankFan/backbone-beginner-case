$(function(){
	var TODO = { };

	(function(TODO){

		var userid = 0;

		var View = Backbone.View.extend({
			register: function(state) {
				this.state = state;
				return this;
			}
		});

		var User = Backbone.View.extend({
			defaults: {
				username: '默认用户名'
			},

			initialize: function() {
				if(!this.get('username')) {
					this.set({'username': this.defaults.username});
				}
				if(!this.get('userid')) {
					this.set({'userid': ++userid});
				}
			}
		});

		TODO.App = Backbone.Router.extend({
			
		});


	})(TODO);

	new TODO.App('body');
	Backbone.history.start();
});