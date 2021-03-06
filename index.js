'use strict';

var container = require('markdown-it-container');

module.exports = function md_align_plugin(md, options) {
	var containerOpenCount = 0;
	var links = options ? options.links : true;
	init();
	return;
	
	function setupContainer(name) { 
        md.use(container, name, {
            render: function (tokens, idx) {
                if (tokens[idx].nesting === 1) {
                    containerOpenCount += 1;
                    if (name == 'center'){
                        return '<div class="columns is-mobile"><div class="column box is-half is-offset-one-quarter">\n';
                    }
                    if (name == 'right') {
                        return '<div class="columns is-mobile"><div class="column box is-one-quarter is-offset-three-quarters">\n';
                    }
                    if (name == 'left')
                        return '<div class="columns is-mobile"><div class="column box is-one-quarter">\n';
                } else {
                    containerOpenCount -= 1;
                    return '</div>\n</div>';
                }
            }
        });
    }
	
    function isContainerOpen() {
        return containerOpenCount > 0;
    }
	
    function selfRender(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    }
    
	function setupLinks() {
		var defaultRender = md.renderer.rules.link_open || selfRender;
		
		md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
			if (isContainerOpen()) {
				tokens[idx].attrPush(['class', 'md-align-link']);
			}
			
			return defaultRender(tokens, idx, options, env, self);
		};
	}
	
	function init() {

        setupContainer('right');
        setupContainer('left');
        setupContainer('center');
		
		if (links) {
			setupLinks();
		}
	}
};