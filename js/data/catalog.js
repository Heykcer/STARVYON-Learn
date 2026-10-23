// STARVYON Learn - Master Catalog Aggregator
// Provides centralized access to all courses, pathways, and global search index.

window.STARVYONCatalog = {
  getPathways: function() {
    return window.STARVYONPathways || [];
  },

  getPathwayById: function(id) {
    var pathways = this.getPathways();
    for (var i = 0; i < pathways.length; i++) {
      if (pathways[i].id === id) return pathways[i];
    }
    return null;
  },

  getAllCourses: function() {
    var courses = [];
    var catalog = window.STARVYONCourses || {};
    for (var key in catalog) {
      if (catalog.hasOwnProperty(key)) {
        courses.push(catalog[key]);
      }
    }
    return courses;
  },

  getCourseById: function(courseId) {
    var catalog = window.STARVYONCourses || {};
    return catalog[courseId] || null;
  },

  getTopicById: function(courseId, topicId) {
    var course = this.getCourseById(courseId);
    if (!course) return null;
    for (var m = 0; m < course.modules.length; m++) {
      var mod = course.modules[m];
      for (var t = 0; t < mod.topics.length; t++) {
        if (mod.topics[t].topicId === topicId) {
          return {
            course: course,
            module: mod,
            topic: mod.topics[t],
            moduleIndex: m,
            topicIndex: t
          };
        }
      }
    }
    return null;
  },

  search: function(query) {
    if (!query || query.trim() === "") return this.getAllCourses();
    var q = query.toLowerCase().trim();
    var courses = this.getAllCourses();
    var results = [];

    for (var i = 0; i < courses.length; i++) {
      var c = courses[i];
      var match = false;
      if (c.title.toLowerCase().indexOf(q) !== -1 ||
          c.summary.toLowerCase().indexOf(q) !== -1 ||
          c.category.toLowerCase().indexOf(q) !== -1) {
        match = true;
      } else {
        // Search inside modules and topics
        for (var m = 0; m < c.modules.length; m++) {
          var mod = c.modules[m];
          if (mod.title.toLowerCase().indexOf(q) !== -1) {
            match = true;
            break;
          }
          for (var t = 0; t < mod.topics.length; t++) {
            var top = mod.topics[t];
            if (top.title && top.title.toLowerCase().indexOf(q) !== -1) {
              match = true;
              break;
            }
            if (top.intuition && top.intuition.toLowerCase().indexOf(q) !== -1) {
              match = true;
              break;
            }
            if (top.subtopics && Array.isArray(top.subtopics)) {
              for (var st = 0; st < top.subtopics.length; st++) {
                if (top.subtopics[st].toLowerCase().indexOf(q) !== -1) {
                  match = true;
                  break;
                }
              }
              if (match) break;
            }
            if (top.sections && Array.isArray(top.sections)) {
              for (var sec = 0; sec < top.sections.length; sec++) {
                var s = top.sections[sec];
                if (s.heading && s.heading.toLowerCase().indexOf(q) !== -1) {
                  match = true;
                  break;
                }
              }
              if (match) break;
            }
          }
          if (match) break;
        }
      }
      if (match) results.push(c);
    }
    return results;
  },

  getCategories: function() {
    var courses = this.getAllCourses();
    var catMap = {};
    for (var i = 0; i < courses.length; i++) {
      var cat = courses[i].category;
      if (!catMap[cat]) {
        catMap[cat] = [];
      }
      catMap[cat].push(courses[i]);
    }
    return catMap;
  },

  getCoursesByCategory: function(category) {
    var courses = this.getAllCourses();
    return courses.filter(function(c) {
      return c.category === category;
    });
  }
};
