$('h4 + div.highlight').get()
	.reduce(function(sections, tabContent) {

		var $tabContent = $(tabContent);
		var section = sections[sections.length - 1];
		var tab = {
			$title: $tabContent.prev(),
			$content: $tabContent
		};

		// if first section or first in section
		if (!section || !section[section.length - 1].$content.next().is(tab.$title)) {
			sections.push(section = []);
		}

		section.push(tab);

		return sections;
	}, [])
	.forEach(function(section, sectionIndex) {

		var $tablist = $('<ul role="tablist" class="nav nav-tabs"/>')
			.insertBefore(section[0].$title);
		var $tabcontent = $('<div class="tab-content"/>')
			.insertAfter($tablist);

		section.forEach(function(tab, tabIndex) {

			var id = "tab_" + sectionIndex + "_" + tabIndex;

			var $anchor = $('<a role="tab" data-toggle="tab"/>')
				.text(tab.$title.text())
				.attr("href", "#" + id);

			$('<li role="presentation"/>')
				.toggleClass("in active", tabIndex === 0)
				.append($anchor)
				.appendTo($tablist);

			tab.$title.remove();

			tab.$content.attr("role", "tabpanel")
				.attr("id", id)
				.addClass("tab-pane fade")
				.toggleClass("in active", tabIndex === 0)
				.appendTo($tabcontent);
		});
	});
