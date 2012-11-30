Meteor.startup(function() {
	if(Tags.find().count() === 0) {
		var data = ["red", "green", "blue"];
		for(var i = 0; i < data.length; i++) {
			var list_id = Tags.insert({
				name : data[i]
			});
		}
	}
	
	Meteor.publish("tags", function(){
		return Tags.find();
	});
	
	if(!Accounts.loginServiceConfiguration.findOne({
		service : 'facebook'
	})) {
		Accounts.loginServiceConfiguration.insert({
			service : 'facebook',
			appId : "497675416943953",
			secret : "fe188886366e28f4f6d3645744b892ab"
		});

	}

	Accounts.onCreateUser(function(options, user) {
		if(options.profile) {// maintain the default behavior
			user.profile = options.profile;
		}
		// get profile data from Facebook
		var result = Meteor.http.get("https://graph.facebook.com/me", {
			params : {
				access_token : user.services.facebook.accessToken
			}
		});
		if(!result.error && result.data) {
			// if successfully obtained facebook profile, save it off
			user.profile.facebook = result.data;
		}
		return user;
	});
});
