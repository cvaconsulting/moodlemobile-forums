var templates = [
    "root/externallib/text!root/plugins/forums/forums.html",
    "root/externallib/text!root/plugins/forums/discussions.html",
	"root/externallib/text!root/plugins/forums/posts.html",
    "root/externallib/text!root/plugins/forums/lang/en.json"
];

define(templates,function (forums, discussions, posts, langStrings) {
    var plugin = {
        settings: {
            name: "forums",
            type: "course",
            menuURL: "#course/forums/",
            lang: {
                component: "local_custommm",
                strings: langStrings
            }
        },

        routes: [
            ["course/forums/:courseid", "course_view_forums", "viewForums"],
            ["course/forums/:courseid/:forumname/discussions/:forumid", "course_view_discussions", "viewDiscussions"],
			["course/forums/:courseid/:forumname/discussions/:forumid/posts/:discussionid", "course_view_posts", "viewPosts"]
        ],

        viewForums: function(courseId) {

            MM.panels.showLoading('center');

            if (MM.deviceType == "tablet") {
                MM.panels.html('right', '');
            }

            var data = {
				"courseids[0]" : courseId
            };            
            
            MM.moodleWSCall('local_custommm_get_forums_by_courses', data, function(contents) {
                var course = MM.db.get("courses", MM.config.current_site.id + "-" + courseId);

				console.log(contents);
				
                var tpl = {
                    forums: contents,
                    course: course.toJSON() // Convert a model to a plain javascript object.
                }
                var html = MM.tpl.render(MM.plugins.forums.templates.forums.html, tpl);
                MM.panels.show("center", html);
				
				if (MM.deviceType == "tablet" && contents.length > 0) {
                    // First section.
					console.log(contents);
					console.log(contents[0]["id"]);
                    MM.plugins.forums.viewDiscussions(courseId, encodeURIComponent(contents[0]["name"]), contents[0]["id"]);
                }
				
            });
        },

        viewDiscussions: function(courseId, forumName, forumId) {

            if (MM.deviceType == "tablet") {
                MM.panels.html('right', '');
            }

            var data = {
				"forumids[0]" : forumId
            };            
            
            MM.moodleWSCall('local_custommm_get_forum_discussions', data, function(contents) {
                var course = MM.db.get("courses", MM.config.current_site.id + "-" + courseId);

                var tpl = {
                    discussions: contents,
					forumId: forumId,
					forumName: decodeURIComponent(forumName),
                    course: course.toJSON() // Convert a model to a plain javascript object.
                }
                var html = MM.tpl.render(MM.plugins.forums.templates.discussions.html, tpl);
                MM.panels.show("right", html);

				
            });
        },
        
        viewPosts: function(courseId, forumName, forumId, discussionId) {

            var data = {
				"discussionid" : discussionId
            };            
            
            MM.moodleWSCall('local_custommm_get_forum_posts', data, function(contents) {
                var course = MM.db.get("courses", MM.config.current_site.id + "-" + courseId);

                var tpl = {
                    posts: contents,
					forumName: decodeURIComponent(forumName),
                    course: course.toJSON() // Convert a model to a plain javascript object.
                }
                var html = MM.tpl.render(MM.plugins.forums.templates.posts.html, tpl);
                MM.panels.html("right", html);
            });
        },		
		
        templates: {
            "forums": {
                html: forums
            },
            "discussions": {
                html: discussions
            },
            "posts": {
                html: posts
            }
        }
    }

    MM.registerPlugin(plugin);
});