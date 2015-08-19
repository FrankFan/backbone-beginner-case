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

		var UserCollection = Backbone.Collection.extend({
			model: User,

			// 持久化到本地数据库
			localStorage: new Store('users')
		});

		var UserItemView = Backbone.View.extend({

			tagNmae: 'li',

			template: _.template($('#user-item-template').html());

			render: function() {
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			},

			events: {
				'click .removeUser': 'deleteUser',
				'click .viewUser': 'viewUser'
			},

			viewUser: function() {
				this.state.trigger('viewUser', this.model);
			},

			deleteUser: function() {
				this.state.trigger('removeUser', this.model);
			}
		});

		var UserListView = Backbone.View.extend({
			
			template: _.template($('#list-template').html()),

			initialize: function() {
				var view = this;
				this.state = new Backbone.Model();
				this.router = this.options.router;

				this.collection.unbind('reset');
				this.collection.bind('reset', this.addAll, this);
				setTimeout(function() {
					view.collection.fetch()
				} ,0);
			},

			render: function() {
				var view = this;

				this.$el.html(this.template(this.state.toJSON()));

				this.state.on('removeUser', function (user) {
					user.destroy();
					view.collection.remove(user);
				});

				this.state.on('viewUser', function (user) {
					view.router.navigate('user/', user.cid, {trigger: true});
				});

				return this;
			},

			createUserItemView: function (user) {
				var userItemView = new UserItemView({
					model: user
				});
				userid = Math.max.call(null, user.get('userid'), userid);
				userItemView.register(this.state).render().$el.appendTo($('#list'));
			},

			addAll: function() {
				this.collection.each(this.createUserItemView.bind(this));
			}

		});

		// ------------------------------------------------

		var UserView = View.extend({

		});

		var UserModifyView = View.extend({
			
		});

		TODO.App = Backbone.Router.extend({
			initialize: function (el) {
				this.el = el;
				this.userCollection = new UserCollection();
			},

			routes: {
				'': 'list',
				'list': 'list',
				'add': 'add',
				'edit/:cid': 'edit',
				'user': 'user',
				'user/:cid': 'user'
			},

			list: function () {
				var router = this;
				this.clean();
				this.currnetView = new UserListView({
					collection: router.userCollection,
					router: router
				}).render().$el.appendTo($(this.el));
			},
			edit: function (cid) {
				var router = this,
					user = null;
				this.clean();

				if (cid) {
					user = router.userCollection.getByCid(cid);
				}
				this.currnetView = new UserModifyView({
					model: user,
					router: router
				}).render().$el.appendTo($(this.el));
			},
			user: function (cid) {
				var router = this,
					user = null;
				this.clean();

				if (cid) {
					user = router.userCollection.getByCid(cid);
				}
				this.currnetView = new UserView({
					model: user,
					router: router
				}).render().$el.appendTo($(this.el));
			}
		});


	})(TODO);

	new TODO.App('body');
	Backbone.history.start();
});