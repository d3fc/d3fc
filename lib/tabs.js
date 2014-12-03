function defineTabSections() {
	
	var tabSections = document.getElementsByClassName('tabs');

	// find the tabbed elements and extract the contents
	for(var i=0; i<tabSections.length; i++) {
		var section = tabSections[i];
		var childDivs = section.querySelectorAll("div");
		var tabs = [];
		for(var j=0; j<childDivs.length; j++) {
			var tab = childDivs[j];	
			tabs.push( {
				type: tab.className,
				label: tab.querySelectorAll("h4")[0].innerHTML,
				content: tab.querySelectorAll("xmp, pre")[0].innerHTML,
				isSVG: tab.querySelectorAll("xmp").length !== 0
			});
		}

		// remove all the tabs
		while (section.firstChild) {
		 section.removeChild(section.firstChild);
		}

		// create the tabbed UI container
		var outerDiv = document.createElement('div');
		outerDiv.setAttribute('role', 'tabpanel');

		// add the tab navigation UI
		var ul = document.createElement('ul');
		ul.setAttribute('role', 'tablist');
		ul.setAttribute('class', 'nav nav-tabs');
		for(var j=0; j<tabs.length; j++) {
			var li = document.createElement('li');
			li.setAttribute('role', 'presentation');
			if(j==0) {
				li.setAttribute('class', 'active');
			}

			var a = document.createElement('a');
			a.setAttribute('href', '#tab_' + i + '_' + j);
			a.setAttribute('role', 'tab');
			a.setAttribute('data-toggle', 'tab');
			a.innerText = tabs[j].label;

			li.appendChild(a);
			ul.appendChild(li);
		}
		outerDiv.appendChild(ul);

		// add the tab content
		var div = document.createElement('div');
		div.setAttribute('class', 'tab-content');
		for(var j=0; j<tabs.length; j++) {
			var panel = document.createElement('div');
			panel.setAttribute('role', 'tabpanel');
			panel.setAttribute('class', 'tab-pane fade' + ( j==0 ? ' in active' : ''));
			panel.setAttribute('id', 'tab_' + i + '_' + j);

			var pre = document.createElement('pre');
			var code = document.createElement('code');
			if( tabs[j].isSVG ) {
				code.innerText = tabs[j].content;
			} else {
				code.innerHTML = tabs[j].content;
			}

			pre.appendChild(code);
			panel.appendChild(pre);
			div.appendChild(panel);
		}
		outerDiv.appendChild(div);
		section.appendChild(outerDiv);
	}
};

defineTabSections();
