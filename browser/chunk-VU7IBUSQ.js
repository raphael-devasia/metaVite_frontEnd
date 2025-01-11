import{d as _r}from"./chunk-GAL4ENT6.js";var hr=_r((ze,Ge)=>{(function(g,x){typeof ze=="object"&&typeof Ge<"u"?Ge.exports=x():typeof define=="function"&&define.amd?define(x):(g=typeof globalThis<"u"?globalThis:g||self,g.DOMPurify=x())})(ze,function(){"use strict";function g(a){"@babel/helpers - typeof";return g=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},g(a)}function x(a,n){return x=Object.setPrototypeOf||function(s,c){return s.__proto__=c,s},x(a,n)}function At(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function Z(a,n,o){return At()?Z=Reflect.construct:Z=function(c,O,y){var N=[null];N.push.apply(N,O);var P=Function.bind.apply(c,N),X=new P;return y&&x(X,y.prototype),X},Z.apply(null,arguments)}function L(a){return yt(a)||gt(a)||St(a)||bt()}function yt(a){if(Array.isArray(a))return ce(a)}function gt(a){if(typeof Symbol<"u"&&a[Symbol.iterator]!=null||a["@@iterator"]!=null)return Array.from(a)}function St(a,n){if(a){if(typeof a=="string")return ce(a,n);var o=Object.prototype.toString.call(a).slice(8,-1);if(o==="Object"&&a.constructor&&(o=a.constructor.name),o==="Map"||o==="Set")return Array.from(a);if(o==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o))return ce(a,n)}}function ce(a,n){(n==null||n>a.length)&&(n=a.length);for(var o=0,s=new Array(n);o<n;o++)s[o]=a[o];return s}function bt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var Ot=Object.hasOwnProperty,We=Object.setPrototypeOf,Rt=Object.isFrozen,Lt=Object.getPrototypeOf,Mt=Object.getOwnPropertyDescriptor,E=Object.freeze,S=Object.seal,Dt=Object.create,Be=typeof Reflect<"u"&&Reflect,J=Be.apply,me=Be.construct;J||(J=function(n,o,s){return n.apply(o,s)}),E||(E=function(n){return n}),S||(S=function(n){return n}),me||(me=function(n,o){return Z(n,L(o))});var Nt=b(Array.prototype.forEach),$e=b(Array.prototype.pop),Y=b(Array.prototype.push),Q=b(String.prototype.toLowerCase),pe=b(String.prototype.toString),je=b(String.prototype.match),M=b(String.prototype.replace),wt=b(String.prototype.indexOf),Ct=b(String.prototype.trim),v=b(RegExp.prototype.test),de=It(TypeError);function b(a){return function(n){for(var o=arguments.length,s=new Array(o>1?o-1:0),c=1;c<o;c++)s[c-1]=arguments[c];return J(a,n,s)}}function It(a){return function(){for(var n=arguments.length,o=new Array(n),s=0;s<n;s++)o[s]=arguments[s];return me(a,o)}}function l(a,n,o){var s;o=(s=o)!==null&&s!==void 0?s:Q,We&&We(a,null);for(var c=n.length;c--;){var O=n[c];if(typeof O=="string"){var y=o(O);y!==O&&(Rt(n)||(n[c]=y),O=y)}a[O]=!0}return a}function k(a){var n=Dt(null),o;for(o in a)J(Ot,a,[o])===!0&&(n[o]=a[o]);return n}function ee(a,n){for(;a!==null;){var o=Mt(a,n);if(o){if(o.get)return b(o.get);if(typeof o.value=="function")return b(o.value)}a=Lt(a)}function s(c){return console.warn("fallback value for",c),null}return s}var Ye=E(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Te=E(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),ve=E(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),xt=E(["animate","color-profile","cursor","discard","fedropshadow","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),_e=E(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),kt=E(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Xe=E(["#text"]),Ve=E(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),he=E(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),qe=E(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),te=E(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Pt=S(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Ft=S(/<%[\w\W]*|[\w\W]*%>/gm),Ut=S(/\${[\w\W]*}/gm),Ht=S(/^data-[\-\w.\u00B7-\uFFFF]+$/),zt=S(/^aria-[\-\w]+$/),Gt=S(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Wt=S(/^(?:\w+script|data):/i),Bt=S(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),$t=S(/^html$/i),jt=S(/^[a-z][.\w]*(-[.\w]+)+$/i),Yt=function(){return typeof window>"u"?null:window},Xt=function(n,o){if(g(n)!=="object"||typeof n.createPolicy!="function")return null;var s=null,c="data-tt-policy-suffix";o.currentScript&&o.currentScript.hasAttribute(c)&&(s=o.currentScript.getAttribute(c));var O="dompurify"+(s?"#"+s:"");try{return n.createPolicy(O,{createHTML:function(N){return N},createScriptURL:function(N){return N}})}catch{return console.warn("TrustedTypes policy "+O+" could not be created."),null}};function Ke(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Yt(),n=function(e){return Ke(e)};if(n.version="2.5.8",n.removed=[],!a||!a.document||a.document.nodeType!==9)return n.isSupported=!1,n;var o=a.document,s=a.document,c=a.DocumentFragment,O=a.HTMLTemplateElement,y=a.Node,N=a.Element,P=a.NodeFilter,X=a.NamedNodeMap,qt=X===void 0?a.NamedNodeMap||a.MozNamedAttrMap:X,Kt=a.HTMLFormElement,Zt=a.DOMParser,re=a.trustedTypes,ae=N.prototype,Jt=ee(ae,"cloneNode"),Qt=ee(ae,"nextSibling"),er=ee(ae,"childNodes"),Ee=ee(ae,"parentNode");if(typeof O=="function"){var Ae=s.createElement("template");Ae.content&&Ae.content.ownerDocument&&(s=Ae.content.ownerDocument)}var D=Xt(re,o),ye=D?D.createHTML(""):"",ne=s,ge=ne.implementation,tr=ne.createNodeIterator,rr=ne.createDocumentFragment,ar=ne.getElementsByTagName,nr=o.importNode,Ze={};try{Ze=k(s).documentMode?s.documentMode:{}}catch{}var w={};n.isSupported=typeof Ee=="function"&&ge&&ge.createHTMLDocument!==void 0&&Ze!==9;var Se=Pt,be=Ft,Oe=Ut,ir=Ht,or=zt,lr=Wt,Je=Bt,sr=jt,Re=Gt,p=null,Qe=l({},[].concat(L(Ye),L(Te),L(ve),L(_e),L(Xe))),d=null,et=l({},[].concat(L(Ve),L(he),L(qe),L(te))),f=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),V=null,Le=null,tt=!0,Me=!0,rt=!1,at=!0,z=!1,De=!0,F=!1,Ne=!1,we=!1,G=!1,ie=!1,oe=!1,nt=!0,it=!1,ur="user-content-",Ce=!0,q=!1,W={},B=null,ot=l({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),lt=null,st=l({},["audio","video","img","source","image","track"]),Ie=null,ut=l({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),le="http://www.w3.org/1998/Math/MathML",se="http://www.w3.org/2000/svg",C="http://www.w3.org/1999/xhtml",$=C,xe=!1,ke=null,fr=l({},[le,se,C],pe),U,cr=["application/xhtml+xml","text/html"],mr="text/html",T,j=null,pr=s.createElement("form"),ft=function(e){return e instanceof RegExp||e instanceof Function},Pe=function(e){j&&j===e||((!e||g(e)!=="object")&&(e={}),e=k(e),U=cr.indexOf(e.PARSER_MEDIA_TYPE)===-1?U=mr:U=e.PARSER_MEDIA_TYPE,T=U==="application/xhtml+xml"?pe:Q,p="ALLOWED_TAGS"in e?l({},e.ALLOWED_TAGS,T):Qe,d="ALLOWED_ATTR"in e?l({},e.ALLOWED_ATTR,T):et,ke="ALLOWED_NAMESPACES"in e?l({},e.ALLOWED_NAMESPACES,pe):fr,Ie="ADD_URI_SAFE_ATTR"in e?l(k(ut),e.ADD_URI_SAFE_ATTR,T):ut,lt="ADD_DATA_URI_TAGS"in e?l(k(st),e.ADD_DATA_URI_TAGS,T):st,B="FORBID_CONTENTS"in e?l({},e.FORBID_CONTENTS,T):ot,V="FORBID_TAGS"in e?l({},e.FORBID_TAGS,T):{},Le="FORBID_ATTR"in e?l({},e.FORBID_ATTR,T):{},W="USE_PROFILES"in e?e.USE_PROFILES:!1,tt=e.ALLOW_ARIA_ATTR!==!1,Me=e.ALLOW_DATA_ATTR!==!1,rt=e.ALLOW_UNKNOWN_PROTOCOLS||!1,at=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,z=e.SAFE_FOR_TEMPLATES||!1,De=e.SAFE_FOR_XML!==!1,F=e.WHOLE_DOCUMENT||!1,G=e.RETURN_DOM||!1,ie=e.RETURN_DOM_FRAGMENT||!1,oe=e.RETURN_TRUSTED_TYPE||!1,we=e.FORCE_BODY||!1,nt=e.SANITIZE_DOM!==!1,it=e.SANITIZE_NAMED_PROPS||!1,Ce=e.KEEP_CONTENT!==!1,q=e.IN_PLACE||!1,Re=e.ALLOWED_URI_REGEXP||Re,$=e.NAMESPACE||C,f=e.CUSTOM_ELEMENT_HANDLING||{},e.CUSTOM_ELEMENT_HANDLING&&ft(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(f.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&ft(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(f.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(f.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),z&&(Me=!1),ie&&(G=!0),W&&(p=l({},L(Xe)),d=[],W.html===!0&&(l(p,Ye),l(d,Ve)),W.svg===!0&&(l(p,Te),l(d,he),l(d,te)),W.svgFilters===!0&&(l(p,ve),l(d,he),l(d,te)),W.mathMl===!0&&(l(p,_e),l(d,qe),l(d,te))),e.ADD_TAGS&&(p===Qe&&(p=k(p)),l(p,e.ADD_TAGS,T)),e.ADD_ATTR&&(d===et&&(d=k(d)),l(d,e.ADD_ATTR,T)),e.ADD_URI_SAFE_ATTR&&l(Ie,e.ADD_URI_SAFE_ATTR,T),e.FORBID_CONTENTS&&(B===ot&&(B=k(B)),l(B,e.FORBID_CONTENTS,T)),Ce&&(p["#text"]=!0),F&&l(p,["html","head","body"]),p.table&&(l(p,["tbody"]),delete V.tbody),E&&E(e),j=e)},ct=l({},["mi","mo","mn","ms","mtext"]),mt=l({},["annotation-xml"]),dr=l({},["title","style","font","a","script"]),ue=l({},Te);l(ue,ve),l(ue,xt);var Fe=l({},_e);l(Fe,kt);var Tr=function(e){var t=Ee(e);(!t||!t.tagName)&&(t={namespaceURI:$,tagName:"template"});var r=Q(e.tagName),u=Q(t.tagName);return ke[e.namespaceURI]?e.namespaceURI===se?t.namespaceURI===C?r==="svg":t.namespaceURI===le?r==="svg"&&(u==="annotation-xml"||ct[u]):!!ue[r]:e.namespaceURI===le?t.namespaceURI===C?r==="math":t.namespaceURI===se?r==="math"&&mt[u]:!!Fe[r]:e.namespaceURI===C?t.namespaceURI===se&&!mt[u]||t.namespaceURI===le&&!ct[u]?!1:!Fe[r]&&(dr[r]||!ue[r]):!!(U==="application/xhtml+xml"&&ke[e.namespaceURI]):!1},R=function(e){Y(n.removed,{element:e});try{e.parentNode.removeChild(e)}catch{try{e.outerHTML=ye}catch{e.remove()}}},fe=function(e,t){try{Y(n.removed,{attribute:t.getAttributeNode(e),from:t})}catch{Y(n.removed,{attribute:null,from:t})}if(t.removeAttribute(e),e==="is"&&!d[e])if(G||ie)try{R(t)}catch{}else try{t.setAttribute(e,"")}catch{}},pt=function(e){var t,r;if(we)e="<remove></remove>"+e;else{var u=je(e,/^[\r\n\t ]+/);r=u&&u[0]}U==="application/xhtml+xml"&&$===C&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");var A=D?D.createHTML(e):e;if($===C)try{t=new Zt().parseFromString(A,U)}catch{}if(!t||!t.documentElement){t=ge.createDocument($,"template",null);try{t.documentElement.innerHTML=xe?ye:A}catch{}}var h=t.body||t.documentElement;return e&&r&&h.insertBefore(s.createTextNode(r),h.childNodes[0]||null),$===C?ar.call(t,F?"html":"body")[0]:F?t.documentElement:h},dt=function(e){return tr.call(e.ownerDocument||e,e,P.SHOW_ELEMENT|P.SHOW_COMMENT|P.SHOW_TEXT|P.SHOW_PROCESSING_INSTRUCTION|P.SHOW_CDATA_SECTION,null,!1)},Ue=function(e){return e instanceof Kt&&(typeof e.nodeName!="string"||typeof e.textContent!="string"||typeof e.removeChild!="function"||!(e.attributes instanceof qt)||typeof e.removeAttribute!="function"||typeof e.setAttribute!="function"||typeof e.namespaceURI!="string"||typeof e.insertBefore!="function"||typeof e.hasChildNodes!="function")},K=function(e){return g(y)==="object"?e instanceof y:e&&g(e)==="object"&&typeof e.nodeType=="number"&&typeof e.nodeName=="string"},I=function(e,t,r){w[e]&&Nt(w[e],function(u){u.call(n,t,r,j)})},Tt=function(e){var t;if(I("beforeSanitizeElements",e,null),Ue(e)||v(/[\u0080-\uFFFF]/,e.nodeName))return R(e),!0;var r=T(e.nodeName);if(I("uponSanitizeElement",e,{tagName:r,allowedTags:p}),e.hasChildNodes()&&!K(e.firstElementChild)&&(!K(e.content)||!K(e.content.firstElementChild))&&v(/<[/\w]/g,e.innerHTML)&&v(/<[/\w]/g,e.textContent)||r==="select"&&v(/<template/i,e.innerHTML)||e.nodeType===7||De&&e.nodeType===8&&v(/<[/\w]/g,e.data))return R(e),!0;if(!p[r]||V[r]){if(!V[r]&&_t(r)&&(f.tagNameCheck instanceof RegExp&&v(f.tagNameCheck,r)||f.tagNameCheck instanceof Function&&f.tagNameCheck(r)))return!1;if(Ce&&!B[r]){var u=Ee(e)||e.parentNode,A=er(e)||e.childNodes;if(A&&u)for(var h=A.length,_=h-1;_>=0;--_){var H=Jt(A[_],!0);H.__removalCount=(e.__removalCount||0)+1,u.insertBefore(H,Qt(e))}}return R(e),!0}return e instanceof N&&!Tr(e)||(r==="noscript"||r==="noembed"||r==="noframes")&&v(/<\/no(script|embed|frames)/i,e.innerHTML)?(R(e),!0):(z&&e.nodeType===3&&(t=e.textContent,t=M(t,Se," "),t=M(t,be," "),t=M(t,Oe," "),e.textContent!==t&&(Y(n.removed,{element:e.cloneNode()}),e.textContent=t)),I("afterSanitizeElements",e,null),!1)},vt=function(e,t,r){if(nt&&(t==="id"||t==="name")&&(r in s||r in pr))return!1;if(!(Me&&!Le[t]&&v(ir,t))){if(!(tt&&v(or,t))){if(!d[t]||Le[t]){if(!(_t(e)&&(f.tagNameCheck instanceof RegExp&&v(f.tagNameCheck,e)||f.tagNameCheck instanceof Function&&f.tagNameCheck(e))&&(f.attributeNameCheck instanceof RegExp&&v(f.attributeNameCheck,t)||f.attributeNameCheck instanceof Function&&f.attributeNameCheck(t))||t==="is"&&f.allowCustomizedBuiltInElements&&(f.tagNameCheck instanceof RegExp&&v(f.tagNameCheck,r)||f.tagNameCheck instanceof Function&&f.tagNameCheck(r))))return!1}else if(!Ie[t]){if(!v(Re,M(r,Je,""))){if(!((t==="src"||t==="xlink:href"||t==="href")&&e!=="script"&&wt(r,"data:")===0&&lt[e])){if(!(rt&&!v(lr,M(r,Je,"")))){if(r)return!1}}}}}}return!0},_t=function(e){return e!=="annotation-xml"&&je(e,sr)},ht=function(e){var t,r,u,A;I("beforeSanitizeAttributes",e,null);var h=e.attributes;if(!(!h||Ue(e))){var _={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:d};for(A=h.length;A--;){t=h[A];var H=t,m=H.name,He=H.namespaceURI;if(r=m==="value"?t.value:Ct(t.value),u=T(m),_.attrName=u,_.attrValue=r,_.keepAttr=!0,_.forceKeepAttr=void 0,I("uponSanitizeAttribute",e,_),r=_.attrValue,!_.forceKeepAttr&&(fe(m,e),!!_.keepAttr)){if(!at&&v(/\/>/i,r)){fe(m,e);continue}z&&(r=M(r,Se," "),r=M(r,be," "),r=M(r,Oe," "));var Et=T(e.nodeName);if(vt(Et,u,r)){if(it&&(u==="id"||u==="name")&&(fe(m,e),r=ur+r),De&&v(/((--!?|])>)|<\/(style|title)/i,r)){fe(m,e);continue}if(D&&g(re)==="object"&&typeof re.getAttributeType=="function"&&!He)switch(re.getAttributeType(Et,u)){case"TrustedHTML":{r=D.createHTML(r);break}case"TrustedScriptURL":{r=D.createScriptURL(r);break}}try{He?e.setAttributeNS(He,m,r):e.setAttribute(m,r),Ue(e)?R(e):$e(n.removed)}catch{}}}}I("afterSanitizeAttributes",e,null)}},vr=function i(e){var t,r=dt(e);for(I("beforeSanitizeShadowDOM",e,null);t=r.nextNode();)I("uponSanitizeShadowNode",t,null),Tt(t),ht(t),t.content instanceof c&&i(t.content);I("afterSanitizeShadowDOM",e,null)};return n.sanitize=function(i){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t,r,u,A,h;if(xe=!i,xe&&(i="<!-->"),typeof i!="string"&&!K(i))if(typeof i.toString=="function"){if(i=i.toString(),typeof i!="string")throw de("dirty is not a string, aborting")}else throw de("toString is not a function");if(!n.isSupported){if(g(a.toStaticHTML)==="object"||typeof a.toStaticHTML=="function"){if(typeof i=="string")return a.toStaticHTML(i);if(K(i))return a.toStaticHTML(i.outerHTML)}return i}if(Ne||Pe(e),n.removed=[],typeof i=="string"&&(q=!1),q){if(i.nodeName){var _=T(i.nodeName);if(!p[_]||V[_])throw de("root node is forbidden and cannot be sanitized in-place")}}else if(i instanceof y)t=pt("<!---->"),r=t.ownerDocument.importNode(i,!0),r.nodeType===1&&r.nodeName==="BODY"||r.nodeName==="HTML"?t=r:t.appendChild(r);else{if(!G&&!z&&!F&&i.indexOf("<")===-1)return D&&oe?D.createHTML(i):i;if(t=pt(i),!t)return G?null:oe?ye:""}t&&we&&R(t.firstChild);for(var H=dt(q?i:t);u=H.nextNode();)u.nodeType===3&&u===A||(Tt(u),ht(u),u.content instanceof c&&vr(u.content),A=u);if(A=null,q)return i;if(G){if(ie)for(h=rr.call(t.ownerDocument);t.firstChild;)h.appendChild(t.firstChild);else h=t;return(d.shadowroot||d.shadowrootmod)&&(h=nr.call(o,h,!0)),h}var m=F?t.outerHTML:t.innerHTML;return F&&p["!doctype"]&&t.ownerDocument&&t.ownerDocument.doctype&&t.ownerDocument.doctype.name&&v($t,t.ownerDocument.doctype.name)&&(m="<!DOCTYPE "+t.ownerDocument.doctype.name+`>
`+m),z&&(m=M(m,Se," "),m=M(m,be," "),m=M(m,Oe," ")),D&&oe?D.createHTML(m):m},n.setConfig=function(i){Pe(i),Ne=!0},n.clearConfig=function(){j=null,Ne=!1},n.isValidAttribute=function(i,e,t){j||Pe({});var r=T(i),u=T(e);return vt(r,u,t)},n.addHook=function(i,e){typeof e=="function"&&(w[i]=w[i]||[],Y(w[i],e))},n.removeHook=function(i){if(w[i])return $e(w[i])},n.removeHooks=function(i){w[i]&&(w[i]=[])},n.removeAllHooks=function(){w={}},n}var Vt=Ke();return Vt})});export default hr();
