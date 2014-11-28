function defineTabSections() {
	
	var tabSections = document.getElementsByClassName('tabs');

	for(var i=0; i<tabSections.length; i++) {
		var section = tabSections[i];
		var tabs = [];
		for(var j=0; j<section.childNodes.length; j++) {
			var tab = tabSections[i].childNodes[j];
			if( tab.className ) {
				tabs.push( {
					type: tab.className,
					label: tab.className.toLowerCase() === 'javascript' ? 'JavaScript' : 
						(tab.className.toLowerCase() === 'css' ? 'CSS' : 
						(tab.className.toLowerCase() === 'svg' ? 'Generated SVG' : tab.className )),
					class: tab.className.toLowerCase() === 'svg' ? 'html' : tab.className,
					content: tab.innerHTML
				});
			}
		}

		while (section.firstChild) { section.removeChild(section.firstChild); }

		var outerDiv = document.createElement('div');
		outerDiv.setAttribute('role', 'tabpanel');

		var ul = document.createElement('ul');
		ul.setAttribute('role', 'tablist');
		ul.setAttribute('class', 'nav nav-tabs');
		for(var j=0; j<tabs.length; j++) {
			var li = document.createElement('li');
			li.setAttribute('role', 'presentation');
			if(j==0) li.setAttribute('class', 'active');
			var a = document.createElement('a');
			a.setAttribute('href', '#tab_' + i + '_' + j);
			a.setAttribute('role', 'tab');
			a.setAttribute('data-toggle', 'tab');
			a.innerText = tabs[j].label;
			li.appendChild(a);
			ul.appendChild(li);
		}
		outerDiv.appendChild(ul);

		var div = document.createElement('div');
		div.setAttribute('class', 'tab-content');
		for(var j=0; j<tabs.length; j++) {
			var panel = document.createElement('div');
			panel.setAttribute('role', 'tabpanel');
			panel.setAttribute('class', 'tab-pane fade' + ( j==0 ? ' in active' : ''));
			panel.setAttribute('id', 'tab_' + i + '_' + j);
			var pre = document.createElement('pre');
			var code = document.createElement('code');
			code.setAttribute('class', tabs[j].class);
			if( tabs[j].type == 'svg' ) code.innerText = tabs[j].content;
			else code.innerHTML = tabs[j].content;
			pre.appendChild(code);
			panel.appendChild(pre);
			div.appendChild(panel);
		}
		outerDiv.appendChild(div);
		section.appendChild(outerDiv);
	}
};

defineTabSections();
