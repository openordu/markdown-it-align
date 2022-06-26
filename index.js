'use strict';

var container = require('markdown-it-container');

module.exports = function md_align_plugin(md, options) {
	var containerOpenCount = 0;
	var links = options ? options.links : true;
	init();
	return;
	
	function setupContainer(name) { 
        console.log(name)
        md.use(container, name, {
            render: function (tokens, idx) {
                if (tokens[idx].nesting === 1) {
                    containerOpenCount += 1;
                    if (name == 'center'){
                        return '<div class="is-half is-offset-one-quarter' + name + '">\n';
                    } else {
                        return '<div class="is-5 is-pulled-' + name + '">\n';
                    }
                } else {
                    containerOpenCount -= 1;
                    return '</div>\n';
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
        // setupContainer('success');
        // setupContainer('info');
        // setupContainer('warning');
        setupContainer('right');
        setupContainer('left');
        setupContainer('center');
		
		if (links) {
			setupLinks();
		}
	}
};