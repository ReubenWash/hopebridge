function _m(e,t){for(var n=0;n<t.length;n++){const a=t[n];if(typeof a!="string"&&!Array.isArray(a)){for(const s in a)if(s!=="default"&&!(s in e)){const i=Object.getOwnPropertyDescriptor(a,s);i&&Object.defineProperty(e,s,i.get?i:{enumerable:!0,get:()=>a[s]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();function zm(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Gu={exports:{}},di={},Ju={exports:{}},G={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ua=Symbol.for("react.element"),Tm=Symbol.for("react.portal"),Dm=Symbol.for("react.fragment"),Im=Symbol.for("react.strict_mode"),Pm=Symbol.for("react.profiler"),Am=Symbol.for("react.provider"),Mm=Symbol.for("react.context"),Rm=Symbol.for("react.forward_ref"),Lm=Symbol.for("react.suspense"),Fm=Symbol.for("react.memo"),$m=Symbol.for("react.lazy"),Jc=Symbol.iterator;function Om(e){return e===null||typeof e!="object"?null:(e=Jc&&e[Jc]||e["@@iterator"],typeof e=="function"?e:null)}var Qu={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Xu=Object.assign,Zu={};function Hr(e,t,n){this.props=e,this.context=t,this.refs=Zu,this.updater=n||Qu}Hr.prototype.isReactComponent={};Hr.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Hr.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function ep(){}ep.prototype=Hr.prototype;function Il(e,t,n){this.props=e,this.context=t,this.refs=Zu,this.updater=n||Qu}var Pl=Il.prototype=new ep;Pl.constructor=Il;Xu(Pl,Hr.prototype);Pl.isPureReactComponent=!0;var Qc=Array.isArray,tp=Object.prototype.hasOwnProperty,Al={current:null},np={key:!0,ref:!0,__self:!0,__source:!0};function rp(e,t,n){var a,s={},i=null,o=null;if(t!=null)for(a in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(i=""+t.key),t)tp.call(t,a)&&!np.hasOwnProperty(a)&&(s[a]=t[a]);var l=arguments.length-2;if(l===1)s.children=n;else if(1<l){for(var c=Array(l),d=0;d<l;d++)c[d]=arguments[d+2];s.children=c}if(e&&e.defaultProps)for(a in l=e.defaultProps,l)s[a]===void 0&&(s[a]=l[a]);return{$$typeof:Ua,type:e,key:i,ref:o,props:s,_owner:Al.current}}function Bm(e,t){return{$$typeof:Ua,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Ml(e){return typeof e=="object"&&e!==null&&e.$$typeof===Ua}function Wm(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Xc=/\/+/g;function Pi(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Wm(""+e.key):t.toString(36)}function bs(e,t,n,a,s){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(i){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Ua:case Tm:o=!0}}if(o)return o=e,s=s(o),e=a===""?"."+Pi(o,0):a,Qc(s)?(n="",e!=null&&(n=e.replace(Xc,"$&/")+"/"),bs(s,t,n,"",function(d){return d})):s!=null&&(Ml(s)&&(s=Bm(s,n+(!s.key||o&&o.key===s.key?"":(""+s.key).replace(Xc,"$&/")+"/")+e)),t.push(s)),1;if(o=0,a=a===""?".":a+":",Qc(e))for(var l=0;l<e.length;l++){i=e[l];var c=a+Pi(i,l);o+=bs(i,t,n,c,s)}else if(c=Om(e),typeof c=="function")for(e=c.call(e),l=0;!(i=e.next()).done;)i=i.value,c=a+Pi(i,l++),o+=bs(i,t,n,c,s);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function ns(e,t,n){if(e==null)return e;var a=[],s=0;return bs(e,a,"","",function(i){return t.call(n,i,s++)}),a}function Um(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var et={current:null},js={transition:null},Hm={ReactCurrentDispatcher:et,ReactCurrentBatchConfig:js,ReactCurrentOwner:Al};function ap(){throw Error("act(...) is not supported in production builds of React.")}G.Children={map:ns,forEach:function(e,t,n){ns(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return ns(e,function(){t++}),t},toArray:function(e){return ns(e,function(t){return t})||[]},only:function(e){if(!Ml(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};G.Component=Hr;G.Fragment=Dm;G.Profiler=Pm;G.PureComponent=Il;G.StrictMode=Im;G.Suspense=Lm;G.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Hm;G.act=ap;G.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=Xu({},e.props),s=e.key,i=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,o=Al.current),t.key!==void 0&&(s=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(c in t)tp.call(t,c)&&!np.hasOwnProperty(c)&&(a[c]=t[c]===void 0&&l!==void 0?l[c]:t[c])}var c=arguments.length-2;if(c===1)a.children=n;else if(1<c){l=Array(c);for(var d=0;d<c;d++)l[d]=arguments[d+2];a.children=l}return{$$typeof:Ua,type:e.type,key:s,ref:i,props:a,_owner:o}};G.createContext=function(e){return e={$$typeof:Mm,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Am,_context:e},e.Consumer=e};G.createElement=rp;G.createFactory=function(e){var t=rp.bind(null,e);return t.type=e,t};G.createRef=function(){return{current:null}};G.forwardRef=function(e){return{$$typeof:Rm,render:e}};G.isValidElement=Ml;G.lazy=function(e){return{$$typeof:$m,_payload:{_status:-1,_result:e},_init:Um}};G.memo=function(e,t){return{$$typeof:Fm,type:e,compare:t===void 0?null:t}};G.startTransition=function(e){var t=js.transition;js.transition={};try{e()}finally{js.transition=t}};G.unstable_act=ap;G.useCallback=function(e,t){return et.current.useCallback(e,t)};G.useContext=function(e){return et.current.useContext(e)};G.useDebugValue=function(){};G.useDeferredValue=function(e){return et.current.useDeferredValue(e)};G.useEffect=function(e,t){return et.current.useEffect(e,t)};G.useId=function(){return et.current.useId()};G.useImperativeHandle=function(e,t,n){return et.current.useImperativeHandle(e,t,n)};G.useInsertionEffect=function(e,t){return et.current.useInsertionEffect(e,t)};G.useLayoutEffect=function(e,t){return et.current.useLayoutEffect(e,t)};G.useMemo=function(e,t){return et.current.useMemo(e,t)};G.useReducer=function(e,t,n){return et.current.useReducer(e,t,n)};G.useRef=function(e){return et.current.useRef(e)};G.useState=function(e){return et.current.useState(e)};G.useSyncExternalStore=function(e,t,n){return et.current.useSyncExternalStore(e,t,n)};G.useTransition=function(){return et.current.useTransition()};G.version="18.3.1";Ju.exports=G;var p=Ju.exports;const sp=zm(p),Vm=_m({__proto__:null,default:sp},[p]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qm=p,Ym=Symbol.for("react.element"),Km=Symbol.for("react.fragment"),Gm=Object.prototype.hasOwnProperty,Jm=qm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Qm={key:!0,ref:!0,__self:!0,__source:!0};function ip(e,t,n){var a,s={},i=null,o=null;n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(o=t.ref);for(a in t)Gm.call(t,a)&&!Qm.hasOwnProperty(a)&&(s[a]=t[a]);if(e&&e.defaultProps)for(a in t=e.defaultProps,t)s[a]===void 0&&(s[a]=t[a]);return{$$typeof:Ym,type:e,key:i,ref:o,props:s,_owner:Jm.current}}di.Fragment=Km;di.jsx=ip;di.jsxs=ip;Gu.exports=di;var r=Gu.exports,bo={},op={exports:{}},xt={},lp={exports:{}},cp={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(T,B){var U=T.length;T.push(B);e:for(;0<U;){var J=U-1>>>1,ee=T[J];if(0<s(ee,B))T[J]=B,T[U]=ee,U=J;else break e}}function n(T){return T.length===0?null:T[0]}function a(T){if(T.length===0)return null;var B=T[0],U=T.pop();if(U!==B){T[0]=U;e:for(var J=0,ee=T.length,je=ee>>>1;J<je;){var ue=2*(J+1)-1,Se=T[ue],L=ue+1,Q=T[L];if(0>s(Se,U))L<ee&&0>s(Q,Se)?(T[J]=Q,T[L]=U,J=L):(T[J]=Se,T[ue]=U,J=ue);else if(L<ee&&0>s(Q,U))T[J]=Q,T[L]=U,J=L;else break e}}return B}function s(T,B){var U=T.sortIndex-B.sortIndex;return U!==0?U:T.id-B.id}if(typeof performance=="object"&&typeof performance.now=="function"){var i=performance;e.unstable_now=function(){return i.now()}}else{var o=Date,l=o.now();e.unstable_now=function(){return o.now()-l}}var c=[],d=[],m=1,f=null,x=3,b=!1,w=!1,k=!1,N=typeof setTimeout=="function"?setTimeout:null,g=typeof clearTimeout=="function"?clearTimeout:null,u=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function h(T){for(var B=n(d);B!==null;){if(B.callback===null)a(d);else if(B.startTime<=T)a(d),B.sortIndex=B.expirationTime,t(c,B);else break;B=n(d)}}function y(T){if(k=!1,h(T),!w)if(n(c)!==null)w=!0,oe(S);else{var B=n(d);B!==null&&Z(y,B.startTime-T)}}function S(T,B){w=!1,k&&(k=!1,g(I),I=-1),b=!0;var U=x;try{for(h(B),f=n(c);f!==null&&(!(f.expirationTime>B)||T&&!ne());){var J=f.callback;if(typeof J=="function"){f.callback=null,x=f.priorityLevel;var ee=J(f.expirationTime<=B);B=e.unstable_now(),typeof ee=="function"?f.callback=ee:f===n(c)&&a(c),h(B)}else a(c);f=n(c)}if(f!==null)var je=!0;else{var ue=n(d);ue!==null&&Z(y,ue.startTime-B),je=!1}return je}finally{f=null,x=U,b=!1}}var C=!1,E=null,I=-1,H=5,R=-1;function ne(){return!(e.unstable_now()-R<H)}function de(){if(E!==null){var T=e.unstable_now();R=T;var B=!0;try{B=E(!0,T)}finally{B?ie():(C=!1,E=null)}}else C=!1}var ie;if(typeof u=="function")ie=function(){u(de)};else if(typeof MessageChannel<"u"){var Me=new MessageChannel,q=Me.port2;Me.port1.onmessage=de,ie=function(){q.postMessage(null)}}else ie=function(){N(de,0)};function oe(T){E=T,C||(C=!0,ie())}function Z(T,B){I=N(function(){T(e.unstable_now())},B)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(T){T.callback=null},e.unstable_continueExecution=function(){w||b||(w=!0,oe(S))},e.unstable_forceFrameRate=function(T){0>T||125<T?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):H=0<T?Math.floor(1e3/T):5},e.unstable_getCurrentPriorityLevel=function(){return x},e.unstable_getFirstCallbackNode=function(){return n(c)},e.unstable_next=function(T){switch(x){case 1:case 2:case 3:var B=3;break;default:B=x}var U=x;x=B;try{return T()}finally{x=U}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(T,B){switch(T){case 1:case 2:case 3:case 4:case 5:break;default:T=3}var U=x;x=T;try{return B()}finally{x=U}},e.unstable_scheduleCallback=function(T,B,U){var J=e.unstable_now();switch(typeof U=="object"&&U!==null?(U=U.delay,U=typeof U=="number"&&0<U?J+U:J):U=J,T){case 1:var ee=-1;break;case 2:ee=250;break;case 5:ee=1073741823;break;case 4:ee=1e4;break;default:ee=5e3}return ee=U+ee,T={id:m++,callback:B,priorityLevel:T,startTime:U,expirationTime:ee,sortIndex:-1},U>J?(T.sortIndex=U,t(d,T),n(c)===null&&T===n(d)&&(k?(g(I),I=-1):k=!0,Z(y,U-J))):(T.sortIndex=ee,t(c,T),w||b||(w=!0,oe(S))),T},e.unstable_shouldYield=ne,e.unstable_wrapCallback=function(T){var B=x;return function(){var U=x;x=B;try{return T.apply(this,arguments)}finally{x=U}}}})(cp);lp.exports=cp;var Xm=lp.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zm=p,gt=Xm;function z(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var dp=new Set,xa={};function dr(e,t){Ar(e,t),Ar(e+"Capture",t)}function Ar(e,t){for(xa[e]=t,e=0;e<t.length;e++)dp.add(t[e])}var on=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),jo=Object.prototype.hasOwnProperty,eg=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Zc={},ed={};function tg(e){return jo.call(ed,e)?!0:jo.call(Zc,e)?!1:eg.test(e)?ed[e]=!0:(Zc[e]=!0,!1)}function ng(e,t,n,a){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return a?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function rg(e,t,n,a){if(t===null||typeof t>"u"||ng(e,t,n,a))return!0;if(a)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function tt(e,t,n,a,s,i,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=a,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=o}var He={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){He[e]=new tt(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];He[t]=new tt(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){He[e]=new tt(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){He[e]=new tt(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){He[e]=new tt(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){He[e]=new tt(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){He[e]=new tt(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){He[e]=new tt(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){He[e]=new tt(e,5,!1,e.toLowerCase(),null,!1,!1)});var Rl=/[\-:]([a-z])/g;function Ll(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Rl,Ll);He[t]=new tt(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Rl,Ll);He[t]=new tt(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Rl,Ll);He[t]=new tt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){He[e]=new tt(e,1,!1,e.toLowerCase(),null,!1,!1)});He.xlinkHref=new tt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){He[e]=new tt(e,1,!1,e.toLowerCase(),null,!0,!0)});function Fl(e,t,n,a){var s=He.hasOwnProperty(t)?He[t]:null;(s!==null?s.type!==0:a||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(rg(t,n,s,a)&&(n=null),a||s===null?tg(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):s.mustUseProperty?e[s.propertyName]=n===null?s.type===3?!1:"":n:(t=s.attributeName,a=s.attributeNamespace,n===null?e.removeAttribute(t):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,a?e.setAttributeNS(a,t,n):e.setAttribute(t,n))))}var pn=Zm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,rs=Symbol.for("react.element"),hr=Symbol.for("react.portal"),mr=Symbol.for("react.fragment"),$l=Symbol.for("react.strict_mode"),wo=Symbol.for("react.profiler"),up=Symbol.for("react.provider"),pp=Symbol.for("react.context"),Ol=Symbol.for("react.forward_ref"),ko=Symbol.for("react.suspense"),No=Symbol.for("react.suspense_list"),Bl=Symbol.for("react.memo"),gn=Symbol.for("react.lazy"),fp=Symbol.for("react.offscreen"),td=Symbol.iterator;function Jr(e){return e===null||typeof e!="object"?null:(e=td&&e[td]||e["@@iterator"],typeof e=="function"?e:null)}var Ne=Object.assign,Ai;function aa(e){if(Ai===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ai=t&&t[1]||""}return`
`+Ai+e}var Mi=!1;function Ri(e,t){if(!e||Mi)return"";Mi=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var a=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){a=d}e.call(t.prototype)}else{try{throw Error()}catch(d){a=d}e()}}catch(d){if(d&&a&&typeof d.stack=="string"){for(var s=d.stack.split(`
`),i=a.stack.split(`
`),o=s.length-1,l=i.length-1;1<=o&&0<=l&&s[o]!==i[l];)l--;for(;1<=o&&0<=l;o--,l--)if(s[o]!==i[l]){if(o!==1||l!==1)do if(o--,l--,0>l||s[o]!==i[l]){var c=`
`+s[o].replace(" at new "," at ");return e.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",e.displayName)),c}while(1<=o&&0<=l);break}}}finally{Mi=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?aa(e):""}function ag(e){switch(e.tag){case 5:return aa(e.type);case 16:return aa("Lazy");case 13:return aa("Suspense");case 19:return aa("SuspenseList");case 0:case 2:case 15:return e=Ri(e.type,!1),e;case 11:return e=Ri(e.type.render,!1),e;case 1:return e=Ri(e.type,!0),e;default:return""}}function So(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case mr:return"Fragment";case hr:return"Portal";case wo:return"Profiler";case $l:return"StrictMode";case ko:return"Suspense";case No:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case pp:return(e.displayName||"Context")+".Consumer";case up:return(e._context.displayName||"Context")+".Provider";case Ol:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Bl:return t=e.displayName||null,t!==null?t:So(e.type)||"Memo";case gn:t=e._payload,e=e._init;try{return So(e(t))}catch{}}return null}function sg(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return So(t);case 8:return t===$l?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Mn(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function hp(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function ig(e){var t=hp(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),a=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(o){a=""+o,i.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return a},setValue:function(o){a=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function as(e){e._valueTracker||(e._valueTracker=ig(e))}function mp(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),a="";return e&&(a=hp(e)?e.checked?"true":"false":e.value),e=a,e!==n?(t.setValue(e),!0):!1}function Is(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Co(e,t){var n=t.checked;return Ne({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function nd(e,t){var n=t.defaultValue==null?"":t.defaultValue,a=t.checked!=null?t.checked:t.defaultChecked;n=Mn(t.value!=null?t.value:n),e._wrapperState={initialChecked:a,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function gp(e,t){t=t.checked,t!=null&&Fl(e,"checked",t,!1)}function Eo(e,t){gp(e,t);var n=Mn(t.value),a=t.type;if(n!=null)a==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(a==="submit"||a==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?_o(e,t.type,n):t.hasOwnProperty("defaultValue")&&_o(e,t.type,Mn(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function rd(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var a=t.type;if(!(a!=="submit"&&a!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function _o(e,t,n){(t!=="number"||Is(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var sa=Array.isArray;function Cr(e,t,n,a){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&a&&(e[n].defaultSelected=!0)}else{for(n=""+Mn(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,a&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function zo(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(z(91));return Ne({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function ad(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(z(92));if(sa(n)){if(1<n.length)throw Error(z(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Mn(n)}}function xp(e,t){var n=Mn(t.value),a=Mn(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),a!=null&&(e.defaultValue=""+a)}function sd(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function vp(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function To(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?vp(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var ss,yp=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,a,s){MSApp.execUnsafeLocalFunction(function(){return e(t,n,a,s)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(ss=ss||document.createElement("div"),ss.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=ss.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function va(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var la={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},og=["Webkit","ms","Moz","O"];Object.keys(la).forEach(function(e){og.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),la[t]=la[e]})});function bp(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||la.hasOwnProperty(e)&&la[e]?(""+t).trim():t+"px"}function jp(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var a=n.indexOf("--")===0,s=bp(n,t[n],a);n==="float"&&(n="cssFloat"),a?e.setProperty(n,s):e[n]=s}}var lg=Ne({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Do(e,t){if(t){if(lg[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(z(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(z(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(z(61))}if(t.style!=null&&typeof t.style!="object")throw Error(z(62))}}function Io(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Po=null;function Wl(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ao=null,Er=null,_r=null;function id(e){if(e=qa(e)){if(typeof Ao!="function")throw Error(z(280));var t=e.stateNode;t&&(t=mi(t),Ao(e.stateNode,e.type,t))}}function wp(e){Er?_r?_r.push(e):_r=[e]:Er=e}function kp(){if(Er){var e=Er,t=_r;if(_r=Er=null,id(e),t)for(e=0;e<t.length;e++)id(t[e])}}function Np(e,t){return e(t)}function Sp(){}var Li=!1;function Cp(e,t,n){if(Li)return e(t,n);Li=!0;try{return Np(e,t,n)}finally{Li=!1,(Er!==null||_r!==null)&&(Sp(),kp())}}function ya(e,t){var n=e.stateNode;if(n===null)return null;var a=mi(n);if(a===null)return null;n=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(z(231,t,typeof n));return n}var Mo=!1;if(on)try{var Qr={};Object.defineProperty(Qr,"passive",{get:function(){Mo=!0}}),window.addEventListener("test",Qr,Qr),window.removeEventListener("test",Qr,Qr)}catch{Mo=!1}function cg(e,t,n,a,s,i,o,l,c){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(m){this.onError(m)}}var ca=!1,Ps=null,As=!1,Ro=null,dg={onError:function(e){ca=!0,Ps=e}};function ug(e,t,n,a,s,i,o,l,c){ca=!1,Ps=null,cg.apply(dg,arguments)}function pg(e,t,n,a,s,i,o,l,c){if(ug.apply(this,arguments),ca){if(ca){var d=Ps;ca=!1,Ps=null}else throw Error(z(198));As||(As=!0,Ro=d)}}function ur(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Ep(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function od(e){if(ur(e)!==e)throw Error(z(188))}function fg(e){var t=e.alternate;if(!t){if(t=ur(e),t===null)throw Error(z(188));return t!==e?null:e}for(var n=e,a=t;;){var s=n.return;if(s===null)break;var i=s.alternate;if(i===null){if(a=s.return,a!==null){n=a;continue}break}if(s.child===i.child){for(i=s.child;i;){if(i===n)return od(s),e;if(i===a)return od(s),t;i=i.sibling}throw Error(z(188))}if(n.return!==a.return)n=s,a=i;else{for(var o=!1,l=s.child;l;){if(l===n){o=!0,n=s,a=i;break}if(l===a){o=!0,a=s,n=i;break}l=l.sibling}if(!o){for(l=i.child;l;){if(l===n){o=!0,n=i,a=s;break}if(l===a){o=!0,a=i,n=s;break}l=l.sibling}if(!o)throw Error(z(189))}}if(n.alternate!==a)throw Error(z(190))}if(n.tag!==3)throw Error(z(188));return n.stateNode.current===n?e:t}function _p(e){return e=fg(e),e!==null?zp(e):null}function zp(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=zp(e);if(t!==null)return t;e=e.sibling}return null}var Tp=gt.unstable_scheduleCallback,ld=gt.unstable_cancelCallback,hg=gt.unstable_shouldYield,mg=gt.unstable_requestPaint,_e=gt.unstable_now,gg=gt.unstable_getCurrentPriorityLevel,Ul=gt.unstable_ImmediatePriority,Dp=gt.unstable_UserBlockingPriority,Ms=gt.unstable_NormalPriority,xg=gt.unstable_LowPriority,Ip=gt.unstable_IdlePriority,ui=null,Ut=null;function vg(e){if(Ut&&typeof Ut.onCommitFiberRoot=="function")try{Ut.onCommitFiberRoot(ui,e,void 0,(e.current.flags&128)===128)}catch{}}var At=Math.clz32?Math.clz32:jg,yg=Math.log,bg=Math.LN2;function jg(e){return e>>>=0,e===0?32:31-(yg(e)/bg|0)|0}var is=64,os=4194304;function ia(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Rs(e,t){var n=e.pendingLanes;if(n===0)return 0;var a=0,s=e.suspendedLanes,i=e.pingedLanes,o=n&268435455;if(o!==0){var l=o&~s;l!==0?a=ia(l):(i&=o,i!==0&&(a=ia(i)))}else o=n&~s,o!==0?a=ia(o):i!==0&&(a=ia(i));if(a===0)return 0;if(t!==0&&t!==a&&!(t&s)&&(s=a&-a,i=t&-t,s>=i||s===16&&(i&4194240)!==0))return t;if(a&4&&(a|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=a;0<t;)n=31-At(t),s=1<<n,a|=e[n],t&=~s;return a}function wg(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function kg(e,t){for(var n=e.suspendedLanes,a=e.pingedLanes,s=e.expirationTimes,i=e.pendingLanes;0<i;){var o=31-At(i),l=1<<o,c=s[o];c===-1?(!(l&n)||l&a)&&(s[o]=wg(l,t)):c<=t&&(e.expiredLanes|=l),i&=~l}}function Lo(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Pp(){var e=is;return is<<=1,!(is&4194240)&&(is=64),e}function Fi(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ha(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-At(t),e[t]=n}function Ng(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var a=e.eventTimes;for(e=e.expirationTimes;0<n;){var s=31-At(n),i=1<<s;t[s]=0,a[s]=-1,e[s]=-1,n&=~i}}function Hl(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var a=31-At(n),s=1<<a;s&t|e[a]&t&&(e[a]|=t),n&=~s}}var le=0;function Ap(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Mp,Vl,Rp,Lp,Fp,Fo=!1,ls=[],Nn=null,Sn=null,Cn=null,ba=new Map,ja=new Map,vn=[],Sg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function cd(e,t){switch(e){case"focusin":case"focusout":Nn=null;break;case"dragenter":case"dragleave":Sn=null;break;case"mouseover":case"mouseout":Cn=null;break;case"pointerover":case"pointerout":ba.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ja.delete(t.pointerId)}}function Xr(e,t,n,a,s,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:a,nativeEvent:i,targetContainers:[s]},t!==null&&(t=qa(t),t!==null&&Vl(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function Cg(e,t,n,a,s){switch(t){case"focusin":return Nn=Xr(Nn,e,t,n,a,s),!0;case"dragenter":return Sn=Xr(Sn,e,t,n,a,s),!0;case"mouseover":return Cn=Xr(Cn,e,t,n,a,s),!0;case"pointerover":var i=s.pointerId;return ba.set(i,Xr(ba.get(i)||null,e,t,n,a,s)),!0;case"gotpointercapture":return i=s.pointerId,ja.set(i,Xr(ja.get(i)||null,e,t,n,a,s)),!0}return!1}function $p(e){var t=Vn(e.target);if(t!==null){var n=ur(t);if(n!==null){if(t=n.tag,t===13){if(t=Ep(n),t!==null){e.blockedOn=t,Fp(e.priority,function(){Rp(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ws(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=$o(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var a=new n.constructor(n.type,n);Po=a,n.target.dispatchEvent(a),Po=null}else return t=qa(n),t!==null&&Vl(t),e.blockedOn=n,!1;t.shift()}return!0}function dd(e,t,n){ws(e)&&n.delete(t)}function Eg(){Fo=!1,Nn!==null&&ws(Nn)&&(Nn=null),Sn!==null&&ws(Sn)&&(Sn=null),Cn!==null&&ws(Cn)&&(Cn=null),ba.forEach(dd),ja.forEach(dd)}function Zr(e,t){e.blockedOn===t&&(e.blockedOn=null,Fo||(Fo=!0,gt.unstable_scheduleCallback(gt.unstable_NormalPriority,Eg)))}function wa(e){function t(s){return Zr(s,e)}if(0<ls.length){Zr(ls[0],e);for(var n=1;n<ls.length;n++){var a=ls[n];a.blockedOn===e&&(a.blockedOn=null)}}for(Nn!==null&&Zr(Nn,e),Sn!==null&&Zr(Sn,e),Cn!==null&&Zr(Cn,e),ba.forEach(t),ja.forEach(t),n=0;n<vn.length;n++)a=vn[n],a.blockedOn===e&&(a.blockedOn=null);for(;0<vn.length&&(n=vn[0],n.blockedOn===null);)$p(n),n.blockedOn===null&&vn.shift()}var zr=pn.ReactCurrentBatchConfig,Ls=!0;function _g(e,t,n,a){var s=le,i=zr.transition;zr.transition=null;try{le=1,ql(e,t,n,a)}finally{le=s,zr.transition=i}}function zg(e,t,n,a){var s=le,i=zr.transition;zr.transition=null;try{le=4,ql(e,t,n,a)}finally{le=s,zr.transition=i}}function ql(e,t,n,a){if(Ls){var s=$o(e,t,n,a);if(s===null)Ki(e,t,a,Fs,n),cd(e,a);else if(Cg(s,e,t,n,a))a.stopPropagation();else if(cd(e,a),t&4&&-1<Sg.indexOf(e)){for(;s!==null;){var i=qa(s);if(i!==null&&Mp(i),i=$o(e,t,n,a),i===null&&Ki(e,t,a,Fs,n),i===s)break;s=i}s!==null&&a.stopPropagation()}else Ki(e,t,a,null,n)}}var Fs=null;function $o(e,t,n,a){if(Fs=null,e=Wl(a),e=Vn(e),e!==null)if(t=ur(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Ep(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Fs=e,null}function Op(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(gg()){case Ul:return 1;case Dp:return 4;case Ms:case xg:return 16;case Ip:return 536870912;default:return 16}default:return 16}}var bn=null,Yl=null,ks=null;function Bp(){if(ks)return ks;var e,t=Yl,n=t.length,a,s="value"in bn?bn.value:bn.textContent,i=s.length;for(e=0;e<n&&t[e]===s[e];e++);var o=n-e;for(a=1;a<=o&&t[n-a]===s[i-a];a++);return ks=s.slice(e,1<a?1-a:void 0)}function Ns(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function cs(){return!0}function ud(){return!1}function vt(e){function t(n,a,s,i,o){this._reactName=n,this._targetInst=s,this.type=a,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var l in e)e.hasOwnProperty(l)&&(n=e[l],this[l]=n?n(i):i[l]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?cs:ud,this.isPropagationStopped=ud,this}return Ne(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=cs)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=cs)},persist:function(){},isPersistent:cs}),t}var Vr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Kl=vt(Vr),Va=Ne({},Vr,{view:0,detail:0}),Tg=vt(Va),$i,Oi,ea,pi=Ne({},Va,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Gl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ea&&(ea&&e.type==="mousemove"?($i=e.screenX-ea.screenX,Oi=e.screenY-ea.screenY):Oi=$i=0,ea=e),$i)},movementY:function(e){return"movementY"in e?e.movementY:Oi}}),pd=vt(pi),Dg=Ne({},pi,{dataTransfer:0}),Ig=vt(Dg),Pg=Ne({},Va,{relatedTarget:0}),Bi=vt(Pg),Ag=Ne({},Vr,{animationName:0,elapsedTime:0,pseudoElement:0}),Mg=vt(Ag),Rg=Ne({},Vr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Lg=vt(Rg),Fg=Ne({},Vr,{data:0}),fd=vt(Fg),$g={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Og={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Bg={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Wg(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Bg[e])?!!t[e]:!1}function Gl(){return Wg}var Ug=Ne({},Va,{key:function(e){if(e.key){var t=$g[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ns(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Og[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Gl,charCode:function(e){return e.type==="keypress"?Ns(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ns(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Hg=vt(Ug),Vg=Ne({},pi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hd=vt(Vg),qg=Ne({},Va,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Gl}),Yg=vt(qg),Kg=Ne({},Vr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Gg=vt(Kg),Jg=Ne({},pi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Qg=vt(Jg),Xg=[9,13,27,32],Jl=on&&"CompositionEvent"in window,da=null;on&&"documentMode"in document&&(da=document.documentMode);var Zg=on&&"TextEvent"in window&&!da,Wp=on&&(!Jl||da&&8<da&&11>=da),md=" ",gd=!1;function Up(e,t){switch(e){case"keyup":return Xg.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Hp(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var gr=!1;function ex(e,t){switch(e){case"compositionend":return Hp(t);case"keypress":return t.which!==32?null:(gd=!0,md);case"textInput":return e=t.data,e===md&&gd?null:e;default:return null}}function tx(e,t){if(gr)return e==="compositionend"||!Jl&&Up(e,t)?(e=Bp(),ks=Yl=bn=null,gr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Wp&&t.locale!=="ko"?null:t.data;default:return null}}var nx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function xd(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!nx[e.type]:t==="textarea"}function Vp(e,t,n,a){wp(a),t=$s(t,"onChange"),0<t.length&&(n=new Kl("onChange","change",null,n,a),e.push({event:n,listeners:t}))}var ua=null,ka=null;function rx(e){nf(e,0)}function fi(e){var t=yr(e);if(mp(t))return e}function ax(e,t){if(e==="change")return t}var qp=!1;if(on){var Wi;if(on){var Ui="oninput"in document;if(!Ui){var vd=document.createElement("div");vd.setAttribute("oninput","return;"),Ui=typeof vd.oninput=="function"}Wi=Ui}else Wi=!1;qp=Wi&&(!document.documentMode||9<document.documentMode)}function yd(){ua&&(ua.detachEvent("onpropertychange",Yp),ka=ua=null)}function Yp(e){if(e.propertyName==="value"&&fi(ka)){var t=[];Vp(t,ka,e,Wl(e)),Cp(rx,t)}}function sx(e,t,n){e==="focusin"?(yd(),ua=t,ka=n,ua.attachEvent("onpropertychange",Yp)):e==="focusout"&&yd()}function ix(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return fi(ka)}function ox(e,t){if(e==="click")return fi(t)}function lx(e,t){if(e==="input"||e==="change")return fi(t)}function cx(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Rt=typeof Object.is=="function"?Object.is:cx;function Na(e,t){if(Rt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),a=Object.keys(t);if(n.length!==a.length)return!1;for(a=0;a<n.length;a++){var s=n[a];if(!jo.call(t,s)||!Rt(e[s],t[s]))return!1}return!0}function bd(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function jd(e,t){var n=bd(e);e=0;for(var a;n;){if(n.nodeType===3){if(a=e+n.textContent.length,e<=t&&a>=t)return{node:n,offset:t-e};e=a}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=bd(n)}}function Kp(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Kp(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Gp(){for(var e=window,t=Is();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Is(e.document)}return t}function Ql(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function dx(e){var t=Gp(),n=e.focusedElem,a=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Kp(n.ownerDocument.documentElement,n)){if(a!==null&&Ql(n)){if(t=a.start,e=a.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=n.textContent.length,i=Math.min(a.start,s);a=a.end===void 0?i:Math.min(a.end,s),!e.extend&&i>a&&(s=a,a=i,i=s),s=jd(n,i);var o=jd(n,a);s&&o&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),i>a?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ux=on&&"documentMode"in document&&11>=document.documentMode,xr=null,Oo=null,pa=null,Bo=!1;function wd(e,t,n){var a=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Bo||xr==null||xr!==Is(a)||(a=xr,"selectionStart"in a&&Ql(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),pa&&Na(pa,a)||(pa=a,a=$s(Oo,"onSelect"),0<a.length&&(t=new Kl("onSelect","select",null,t,n),e.push({event:t,listeners:a}),t.target=xr)))}function ds(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var vr={animationend:ds("Animation","AnimationEnd"),animationiteration:ds("Animation","AnimationIteration"),animationstart:ds("Animation","AnimationStart"),transitionend:ds("Transition","TransitionEnd")},Hi={},Jp={};on&&(Jp=document.createElement("div").style,"AnimationEvent"in window||(delete vr.animationend.animation,delete vr.animationiteration.animation,delete vr.animationstart.animation),"TransitionEvent"in window||delete vr.transitionend.transition);function hi(e){if(Hi[e])return Hi[e];if(!vr[e])return e;var t=vr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Jp)return Hi[e]=t[n];return e}var Qp=hi("animationend"),Xp=hi("animationiteration"),Zp=hi("animationstart"),ef=hi("transitionend"),tf=new Map,kd="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Fn(e,t){tf.set(e,t),dr(t,[e])}for(var Vi=0;Vi<kd.length;Vi++){var qi=kd[Vi],px=qi.toLowerCase(),fx=qi[0].toUpperCase()+qi.slice(1);Fn(px,"on"+fx)}Fn(Qp,"onAnimationEnd");Fn(Xp,"onAnimationIteration");Fn(Zp,"onAnimationStart");Fn("dblclick","onDoubleClick");Fn("focusin","onFocus");Fn("focusout","onBlur");Fn(ef,"onTransitionEnd");Ar("onMouseEnter",["mouseout","mouseover"]);Ar("onMouseLeave",["mouseout","mouseover"]);Ar("onPointerEnter",["pointerout","pointerover"]);Ar("onPointerLeave",["pointerout","pointerover"]);dr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));dr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));dr("onBeforeInput",["compositionend","keypress","textInput","paste"]);dr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));dr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));dr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var oa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),hx=new Set("cancel close invalid load scroll toggle".split(" ").concat(oa));function Nd(e,t,n){var a=e.type||"unknown-event";e.currentTarget=n,pg(a,t,void 0,e),e.currentTarget=null}function nf(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var a=e[n],s=a.event;a=a.listeners;e:{var i=void 0;if(t)for(var o=a.length-1;0<=o;o--){var l=a[o],c=l.instance,d=l.currentTarget;if(l=l.listener,c!==i&&s.isPropagationStopped())break e;Nd(s,l,d),i=c}else for(o=0;o<a.length;o++){if(l=a[o],c=l.instance,d=l.currentTarget,l=l.listener,c!==i&&s.isPropagationStopped())break e;Nd(s,l,d),i=c}}}if(As)throw e=Ro,As=!1,Ro=null,e}function ge(e,t){var n=t[qo];n===void 0&&(n=t[qo]=new Set);var a=e+"__bubble";n.has(a)||(rf(t,e,2,!1),n.add(a))}function Yi(e,t,n){var a=0;t&&(a|=4),rf(n,e,a,t)}var us="_reactListening"+Math.random().toString(36).slice(2);function Sa(e){if(!e[us]){e[us]=!0,dp.forEach(function(n){n!=="selectionchange"&&(hx.has(n)||Yi(n,!1,e),Yi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[us]||(t[us]=!0,Yi("selectionchange",!1,t))}}function rf(e,t,n,a){switch(Op(t)){case 1:var s=_g;break;case 4:s=zg;break;default:s=ql}n=s.bind(null,t,n,e),s=void 0,!Mo||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),a?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function Ki(e,t,n,a,s){var i=a;if(!(t&1)&&!(t&2)&&a!==null)e:for(;;){if(a===null)return;var o=a.tag;if(o===3||o===4){var l=a.stateNode.containerInfo;if(l===s||l.nodeType===8&&l.parentNode===s)break;if(o===4)for(o=a.return;o!==null;){var c=o.tag;if((c===3||c===4)&&(c=o.stateNode.containerInfo,c===s||c.nodeType===8&&c.parentNode===s))return;o=o.return}for(;l!==null;){if(o=Vn(l),o===null)return;if(c=o.tag,c===5||c===6){a=i=o;continue e}l=l.parentNode}}a=a.return}Cp(function(){var d=i,m=Wl(n),f=[];e:{var x=tf.get(e);if(x!==void 0){var b=Kl,w=e;switch(e){case"keypress":if(Ns(n)===0)break e;case"keydown":case"keyup":b=Hg;break;case"focusin":w="focus",b=Bi;break;case"focusout":w="blur",b=Bi;break;case"beforeblur":case"afterblur":b=Bi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":b=pd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":b=Ig;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":b=Yg;break;case Qp:case Xp:case Zp:b=Mg;break;case ef:b=Gg;break;case"scroll":b=Tg;break;case"wheel":b=Qg;break;case"copy":case"cut":case"paste":b=Lg;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":b=hd}var k=(t&4)!==0,N=!k&&e==="scroll",g=k?x!==null?x+"Capture":null:x;k=[];for(var u=d,h;u!==null;){h=u;var y=h.stateNode;if(h.tag===5&&y!==null&&(h=y,g!==null&&(y=ya(u,g),y!=null&&k.push(Ca(u,y,h)))),N)break;u=u.return}0<k.length&&(x=new b(x,w,null,n,m),f.push({event:x,listeners:k}))}}if(!(t&7)){e:{if(x=e==="mouseover"||e==="pointerover",b=e==="mouseout"||e==="pointerout",x&&n!==Po&&(w=n.relatedTarget||n.fromElement)&&(Vn(w)||w[ln]))break e;if((b||x)&&(x=m.window===m?m:(x=m.ownerDocument)?x.defaultView||x.parentWindow:window,b?(w=n.relatedTarget||n.toElement,b=d,w=w?Vn(w):null,w!==null&&(N=ur(w),w!==N||w.tag!==5&&w.tag!==6)&&(w=null)):(b=null,w=d),b!==w)){if(k=pd,y="onMouseLeave",g="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(k=hd,y="onPointerLeave",g="onPointerEnter",u="pointer"),N=b==null?x:yr(b),h=w==null?x:yr(w),x=new k(y,u+"leave",b,n,m),x.target=N,x.relatedTarget=h,y=null,Vn(m)===d&&(k=new k(g,u+"enter",w,n,m),k.target=h,k.relatedTarget=N,y=k),N=y,b&&w)t:{for(k=b,g=w,u=0,h=k;h;h=fr(h))u++;for(h=0,y=g;y;y=fr(y))h++;for(;0<u-h;)k=fr(k),u--;for(;0<h-u;)g=fr(g),h--;for(;u--;){if(k===g||g!==null&&k===g.alternate)break t;k=fr(k),g=fr(g)}k=null}else k=null;b!==null&&Sd(f,x,b,k,!1),w!==null&&N!==null&&Sd(f,N,w,k,!0)}}e:{if(x=d?yr(d):window,b=x.nodeName&&x.nodeName.toLowerCase(),b==="select"||b==="input"&&x.type==="file")var S=ax;else if(xd(x))if(qp)S=lx;else{S=ix;var C=sx}else(b=x.nodeName)&&b.toLowerCase()==="input"&&(x.type==="checkbox"||x.type==="radio")&&(S=ox);if(S&&(S=S(e,d))){Vp(f,S,n,m);break e}C&&C(e,x,d),e==="focusout"&&(C=x._wrapperState)&&C.controlled&&x.type==="number"&&_o(x,"number",x.value)}switch(C=d?yr(d):window,e){case"focusin":(xd(C)||C.contentEditable==="true")&&(xr=C,Oo=d,pa=null);break;case"focusout":pa=Oo=xr=null;break;case"mousedown":Bo=!0;break;case"contextmenu":case"mouseup":case"dragend":Bo=!1,wd(f,n,m);break;case"selectionchange":if(ux)break;case"keydown":case"keyup":wd(f,n,m)}var E;if(Jl)e:{switch(e){case"compositionstart":var I="onCompositionStart";break e;case"compositionend":I="onCompositionEnd";break e;case"compositionupdate":I="onCompositionUpdate";break e}I=void 0}else gr?Up(e,n)&&(I="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(I="onCompositionStart");I&&(Wp&&n.locale!=="ko"&&(gr||I!=="onCompositionStart"?I==="onCompositionEnd"&&gr&&(E=Bp()):(bn=m,Yl="value"in bn?bn.value:bn.textContent,gr=!0)),C=$s(d,I),0<C.length&&(I=new fd(I,e,null,n,m),f.push({event:I,listeners:C}),E?I.data=E:(E=Hp(n),E!==null&&(I.data=E)))),(E=Zg?ex(e,n):tx(e,n))&&(d=$s(d,"onBeforeInput"),0<d.length&&(m=new fd("onBeforeInput","beforeinput",null,n,m),f.push({event:m,listeners:d}),m.data=E))}nf(f,t)})}function Ca(e,t,n){return{instance:e,listener:t,currentTarget:n}}function $s(e,t){for(var n=t+"Capture",a=[];e!==null;){var s=e,i=s.stateNode;s.tag===5&&i!==null&&(s=i,i=ya(e,n),i!=null&&a.unshift(Ca(e,i,s)),i=ya(e,t),i!=null&&a.push(Ca(e,i,s))),e=e.return}return a}function fr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Sd(e,t,n,a,s){for(var i=t._reactName,o=[];n!==null&&n!==a;){var l=n,c=l.alternate,d=l.stateNode;if(c!==null&&c===a)break;l.tag===5&&d!==null&&(l=d,s?(c=ya(n,i),c!=null&&o.unshift(Ca(n,c,l))):s||(c=ya(n,i),c!=null&&o.push(Ca(n,c,l)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var mx=/\r\n?/g,gx=/\u0000|\uFFFD/g;function Cd(e){return(typeof e=="string"?e:""+e).replace(mx,`
`).replace(gx,"")}function ps(e,t,n){if(t=Cd(t),Cd(e)!==t&&n)throw Error(z(425))}function Os(){}var Wo=null,Uo=null;function Ho(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Vo=typeof setTimeout=="function"?setTimeout:void 0,xx=typeof clearTimeout=="function"?clearTimeout:void 0,Ed=typeof Promise=="function"?Promise:void 0,vx=typeof queueMicrotask=="function"?queueMicrotask:typeof Ed<"u"?function(e){return Ed.resolve(null).then(e).catch(yx)}:Vo;function yx(e){setTimeout(function(){throw e})}function Gi(e,t){var n=t,a=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(a===0){e.removeChild(s),wa(t);return}a--}else n!=="$"&&n!=="$?"&&n!=="$!"||a++;n=s}while(n);wa(t)}function En(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function _d(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var qr=Math.random().toString(36).slice(2),Ot="__reactFiber$"+qr,Ea="__reactProps$"+qr,ln="__reactContainer$"+qr,qo="__reactEvents$"+qr,bx="__reactListeners$"+qr,jx="__reactHandles$"+qr;function Vn(e){var t=e[Ot];if(t)return t;for(var n=e.parentNode;n;){if(t=n[ln]||n[Ot]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=_d(e);e!==null;){if(n=e[Ot])return n;e=_d(e)}return t}e=n,n=e.parentNode}return null}function qa(e){return e=e[Ot]||e[ln],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function yr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(z(33))}function mi(e){return e[Ea]||null}var Yo=[],br=-1;function $n(e){return{current:e}}function ve(e){0>br||(e.current=Yo[br],Yo[br]=null,br--)}function fe(e,t){br++,Yo[br]=e.current,e.current=t}var Rn={},Qe=$n(Rn),st=$n(!1),tr=Rn;function Mr(e,t){var n=e.type.contextTypes;if(!n)return Rn;var a=e.stateNode;if(a&&a.__reactInternalMemoizedUnmaskedChildContext===t)return a.__reactInternalMemoizedMaskedChildContext;var s={},i;for(i in n)s[i]=t[i];return a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function it(e){return e=e.childContextTypes,e!=null}function Bs(){ve(st),ve(Qe)}function zd(e,t,n){if(Qe.current!==Rn)throw Error(z(168));fe(Qe,t),fe(st,n)}function af(e,t,n){var a=e.stateNode;if(t=t.childContextTypes,typeof a.getChildContext!="function")return n;a=a.getChildContext();for(var s in a)if(!(s in t))throw Error(z(108,sg(e)||"Unknown",s));return Ne({},n,a)}function Ws(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Rn,tr=Qe.current,fe(Qe,e),fe(st,st.current),!0}function Td(e,t,n){var a=e.stateNode;if(!a)throw Error(z(169));n?(e=af(e,t,tr),a.__reactInternalMemoizedMergedChildContext=e,ve(st),ve(Qe),fe(Qe,e)):ve(st),fe(st,n)}var Qt=null,gi=!1,Ji=!1;function sf(e){Qt===null?Qt=[e]:Qt.push(e)}function wx(e){gi=!0,sf(e)}function On(){if(!Ji&&Qt!==null){Ji=!0;var e=0,t=le;try{var n=Qt;for(le=1;e<n.length;e++){var a=n[e];do a=a(!0);while(a!==null)}Qt=null,gi=!1}catch(s){throw Qt!==null&&(Qt=Qt.slice(e+1)),Tp(Ul,On),s}finally{le=t,Ji=!1}}return null}var jr=[],wr=0,Us=null,Hs=0,bt=[],jt=0,nr=null,en=1,tn="";function Wn(e,t){jr[wr++]=Hs,jr[wr++]=Us,Us=e,Hs=t}function of(e,t,n){bt[jt++]=en,bt[jt++]=tn,bt[jt++]=nr,nr=e;var a=en;e=tn;var s=32-At(a)-1;a&=~(1<<s),n+=1;var i=32-At(t)+s;if(30<i){var o=s-s%5;i=(a&(1<<o)-1).toString(32),a>>=o,s-=o,en=1<<32-At(t)+s|n<<s|a,tn=i+e}else en=1<<i|n<<s|a,tn=e}function Xl(e){e.return!==null&&(Wn(e,1),of(e,1,0))}function Zl(e){for(;e===Us;)Us=jr[--wr],jr[wr]=null,Hs=jr[--wr],jr[wr]=null;for(;e===nr;)nr=bt[--jt],bt[jt]=null,tn=bt[--jt],bt[jt]=null,en=bt[--jt],bt[jt]=null}var mt=null,ft=null,be=!1,It=null;function lf(e,t){var n=wt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Dd(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,mt=e,ft=En(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,mt=e,ft=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=nr!==null?{id:en,overflow:tn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=wt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,mt=e,ft=null,!0):!1;default:return!1}}function Ko(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Go(e){if(be){var t=ft;if(t){var n=t;if(!Dd(e,t)){if(Ko(e))throw Error(z(418));t=En(n.nextSibling);var a=mt;t&&Dd(e,t)?lf(a,n):(e.flags=e.flags&-4097|2,be=!1,mt=e)}}else{if(Ko(e))throw Error(z(418));e.flags=e.flags&-4097|2,be=!1,mt=e}}}function Id(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;mt=e}function fs(e){if(e!==mt)return!1;if(!be)return Id(e),be=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ho(e.type,e.memoizedProps)),t&&(t=ft)){if(Ko(e))throw cf(),Error(z(418));for(;t;)lf(e,t),t=En(t.nextSibling)}if(Id(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(z(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ft=En(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ft=null}}else ft=mt?En(e.stateNode.nextSibling):null;return!0}function cf(){for(var e=ft;e;)e=En(e.nextSibling)}function Rr(){ft=mt=null,be=!1}function ec(e){It===null?It=[e]:It.push(e)}var kx=pn.ReactCurrentBatchConfig;function ta(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(z(309));var a=n.stateNode}if(!a)throw Error(z(147,e));var s=a,i=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===i?t.ref:(t=function(o){var l=s.refs;o===null?delete l[i]:l[i]=o},t._stringRef=i,t)}if(typeof e!="string")throw Error(z(284));if(!n._owner)throw Error(z(290,e))}return e}function hs(e,t){throw e=Object.prototype.toString.call(t),Error(z(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Pd(e){var t=e._init;return t(e._payload)}function df(e){function t(g,u){if(e){var h=g.deletions;h===null?(g.deletions=[u],g.flags|=16):h.push(u)}}function n(g,u){if(!e)return null;for(;u!==null;)t(g,u),u=u.sibling;return null}function a(g,u){for(g=new Map;u!==null;)u.key!==null?g.set(u.key,u):g.set(u.index,u),u=u.sibling;return g}function s(g,u){return g=Dn(g,u),g.index=0,g.sibling=null,g}function i(g,u,h){return g.index=h,e?(h=g.alternate,h!==null?(h=h.index,h<u?(g.flags|=2,u):h):(g.flags|=2,u)):(g.flags|=1048576,u)}function o(g){return e&&g.alternate===null&&(g.flags|=2),g}function l(g,u,h,y){return u===null||u.tag!==6?(u=ro(h,g.mode,y),u.return=g,u):(u=s(u,h),u.return=g,u)}function c(g,u,h,y){var S=h.type;return S===mr?m(g,u,h.props.children,y,h.key):u!==null&&(u.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===gn&&Pd(S)===u.type)?(y=s(u,h.props),y.ref=ta(g,u,h),y.return=g,y):(y=Ds(h.type,h.key,h.props,null,g.mode,y),y.ref=ta(g,u,h),y.return=g,y)}function d(g,u,h,y){return u===null||u.tag!==4||u.stateNode.containerInfo!==h.containerInfo||u.stateNode.implementation!==h.implementation?(u=ao(h,g.mode,y),u.return=g,u):(u=s(u,h.children||[]),u.return=g,u)}function m(g,u,h,y,S){return u===null||u.tag!==7?(u=Xn(h,g.mode,y,S),u.return=g,u):(u=s(u,h),u.return=g,u)}function f(g,u,h){if(typeof u=="string"&&u!==""||typeof u=="number")return u=ro(""+u,g.mode,h),u.return=g,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case rs:return h=Ds(u.type,u.key,u.props,null,g.mode,h),h.ref=ta(g,null,u),h.return=g,h;case hr:return u=ao(u,g.mode,h),u.return=g,u;case gn:var y=u._init;return f(g,y(u._payload),h)}if(sa(u)||Jr(u))return u=Xn(u,g.mode,h,null),u.return=g,u;hs(g,u)}return null}function x(g,u,h,y){var S=u!==null?u.key:null;if(typeof h=="string"&&h!==""||typeof h=="number")return S!==null?null:l(g,u,""+h,y);if(typeof h=="object"&&h!==null){switch(h.$$typeof){case rs:return h.key===S?c(g,u,h,y):null;case hr:return h.key===S?d(g,u,h,y):null;case gn:return S=h._init,x(g,u,S(h._payload),y)}if(sa(h)||Jr(h))return S!==null?null:m(g,u,h,y,null);hs(g,h)}return null}function b(g,u,h,y,S){if(typeof y=="string"&&y!==""||typeof y=="number")return g=g.get(h)||null,l(u,g,""+y,S);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case rs:return g=g.get(y.key===null?h:y.key)||null,c(u,g,y,S);case hr:return g=g.get(y.key===null?h:y.key)||null,d(u,g,y,S);case gn:var C=y._init;return b(g,u,h,C(y._payload),S)}if(sa(y)||Jr(y))return g=g.get(h)||null,m(u,g,y,S,null);hs(u,y)}return null}function w(g,u,h,y){for(var S=null,C=null,E=u,I=u=0,H=null;E!==null&&I<h.length;I++){E.index>I?(H=E,E=null):H=E.sibling;var R=x(g,E,h[I],y);if(R===null){E===null&&(E=H);break}e&&E&&R.alternate===null&&t(g,E),u=i(R,u,I),C===null?S=R:C.sibling=R,C=R,E=H}if(I===h.length)return n(g,E),be&&Wn(g,I),S;if(E===null){for(;I<h.length;I++)E=f(g,h[I],y),E!==null&&(u=i(E,u,I),C===null?S=E:C.sibling=E,C=E);return be&&Wn(g,I),S}for(E=a(g,E);I<h.length;I++)H=b(E,g,I,h[I],y),H!==null&&(e&&H.alternate!==null&&E.delete(H.key===null?I:H.key),u=i(H,u,I),C===null?S=H:C.sibling=H,C=H);return e&&E.forEach(function(ne){return t(g,ne)}),be&&Wn(g,I),S}function k(g,u,h,y){var S=Jr(h);if(typeof S!="function")throw Error(z(150));if(h=S.call(h),h==null)throw Error(z(151));for(var C=S=null,E=u,I=u=0,H=null,R=h.next();E!==null&&!R.done;I++,R=h.next()){E.index>I?(H=E,E=null):H=E.sibling;var ne=x(g,E,R.value,y);if(ne===null){E===null&&(E=H);break}e&&E&&ne.alternate===null&&t(g,E),u=i(ne,u,I),C===null?S=ne:C.sibling=ne,C=ne,E=H}if(R.done)return n(g,E),be&&Wn(g,I),S;if(E===null){for(;!R.done;I++,R=h.next())R=f(g,R.value,y),R!==null&&(u=i(R,u,I),C===null?S=R:C.sibling=R,C=R);return be&&Wn(g,I),S}for(E=a(g,E);!R.done;I++,R=h.next())R=b(E,g,I,R.value,y),R!==null&&(e&&R.alternate!==null&&E.delete(R.key===null?I:R.key),u=i(R,u,I),C===null?S=R:C.sibling=R,C=R);return e&&E.forEach(function(de){return t(g,de)}),be&&Wn(g,I),S}function N(g,u,h,y){if(typeof h=="object"&&h!==null&&h.type===mr&&h.key===null&&(h=h.props.children),typeof h=="object"&&h!==null){switch(h.$$typeof){case rs:e:{for(var S=h.key,C=u;C!==null;){if(C.key===S){if(S=h.type,S===mr){if(C.tag===7){n(g,C.sibling),u=s(C,h.props.children),u.return=g,g=u;break e}}else if(C.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===gn&&Pd(S)===C.type){n(g,C.sibling),u=s(C,h.props),u.ref=ta(g,C,h),u.return=g,g=u;break e}n(g,C);break}else t(g,C);C=C.sibling}h.type===mr?(u=Xn(h.props.children,g.mode,y,h.key),u.return=g,g=u):(y=Ds(h.type,h.key,h.props,null,g.mode,y),y.ref=ta(g,u,h),y.return=g,g=y)}return o(g);case hr:e:{for(C=h.key;u!==null;){if(u.key===C)if(u.tag===4&&u.stateNode.containerInfo===h.containerInfo&&u.stateNode.implementation===h.implementation){n(g,u.sibling),u=s(u,h.children||[]),u.return=g,g=u;break e}else{n(g,u);break}else t(g,u);u=u.sibling}u=ao(h,g.mode,y),u.return=g,g=u}return o(g);case gn:return C=h._init,N(g,u,C(h._payload),y)}if(sa(h))return w(g,u,h,y);if(Jr(h))return k(g,u,h,y);hs(g,h)}return typeof h=="string"&&h!==""||typeof h=="number"?(h=""+h,u!==null&&u.tag===6?(n(g,u.sibling),u=s(u,h),u.return=g,g=u):(n(g,u),u=ro(h,g.mode,y),u.return=g,g=u),o(g)):n(g,u)}return N}var Lr=df(!0),uf=df(!1),Vs=$n(null),qs=null,kr=null,tc=null;function nc(){tc=kr=qs=null}function rc(e){var t=Vs.current;ve(Vs),e._currentValue=t}function Jo(e,t,n){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===n)break;e=e.return}}function Tr(e,t){qs=e,tc=kr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(at=!0),e.firstContext=null)}function Nt(e){var t=e._currentValue;if(tc!==e)if(e={context:e,memoizedValue:t,next:null},kr===null){if(qs===null)throw Error(z(308));kr=e,qs.dependencies={lanes:0,firstContext:e}}else kr=kr.next=e;return t}var qn=null;function ac(e){qn===null?qn=[e]:qn.push(e)}function pf(e,t,n,a){var s=t.interleaved;return s===null?(n.next=n,ac(t)):(n.next=s.next,s.next=n),t.interleaved=n,cn(e,a)}function cn(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var xn=!1;function sc(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ff(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function rn(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function _n(e,t,n){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,X&2){var s=a.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),a.pending=t,cn(e,n)}return s=a.interleaved,s===null?(t.next=t,ac(a)):(t.next=s.next,s.next=t),a.interleaved=t,cn(e,n)}function Ss(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Hl(e,n)}}function Ad(e,t){var n=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,n===a)){var s=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?s=i=o:i=i.next=o,n=n.next}while(n!==null);i===null?s=i=t:i=i.next=t}else s=i=t;n={baseState:a.baseState,firstBaseUpdate:s,lastBaseUpdate:i,shared:a.shared,effects:a.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Ys(e,t,n,a){var s=e.updateQueue;xn=!1;var i=s.firstBaseUpdate,o=s.lastBaseUpdate,l=s.shared.pending;if(l!==null){s.shared.pending=null;var c=l,d=c.next;c.next=null,o===null?i=d:o.next=d,o=c;var m=e.alternate;m!==null&&(m=m.updateQueue,l=m.lastBaseUpdate,l!==o&&(l===null?m.firstBaseUpdate=d:l.next=d,m.lastBaseUpdate=c))}if(i!==null){var f=s.baseState;o=0,m=d=c=null,l=i;do{var x=l.lane,b=l.eventTime;if((a&x)===x){m!==null&&(m=m.next={eventTime:b,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var w=e,k=l;switch(x=t,b=n,k.tag){case 1:if(w=k.payload,typeof w=="function"){f=w.call(b,f,x);break e}f=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=k.payload,x=typeof w=="function"?w.call(b,f,x):w,x==null)break e;f=Ne({},f,x);break e;case 2:xn=!0}}l.callback!==null&&l.lane!==0&&(e.flags|=64,x=s.effects,x===null?s.effects=[l]:x.push(l))}else b={eventTime:b,lane:x,tag:l.tag,payload:l.payload,callback:l.callback,next:null},m===null?(d=m=b,c=f):m=m.next=b,o|=x;if(l=l.next,l===null){if(l=s.shared.pending,l===null)break;x=l,l=x.next,x.next=null,s.lastBaseUpdate=x,s.shared.pending=null}}while(!0);if(m===null&&(c=f),s.baseState=c,s.firstBaseUpdate=d,s.lastBaseUpdate=m,t=s.shared.interleaved,t!==null){s=t;do o|=s.lane,s=s.next;while(s!==t)}else i===null&&(s.shared.lanes=0);ar|=o,e.lanes=o,e.memoizedState=f}}function Md(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var a=e[t],s=a.callback;if(s!==null){if(a.callback=null,a=n,typeof s!="function")throw Error(z(191,s));s.call(a)}}}var Ya={},Ht=$n(Ya),_a=$n(Ya),za=$n(Ya);function Yn(e){if(e===Ya)throw Error(z(174));return e}function ic(e,t){switch(fe(za,t),fe(_a,e),fe(Ht,Ya),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:To(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=To(t,e)}ve(Ht),fe(Ht,t)}function Fr(){ve(Ht),ve(_a),ve(za)}function hf(e){Yn(za.current);var t=Yn(Ht.current),n=To(t,e.type);t!==n&&(fe(_a,e),fe(Ht,n))}function oc(e){_a.current===e&&(ve(Ht),ve(_a))}var we=$n(0);function Ks(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Qi=[];function lc(){for(var e=0;e<Qi.length;e++)Qi[e]._workInProgressVersionPrimary=null;Qi.length=0}var Cs=pn.ReactCurrentDispatcher,Xi=pn.ReactCurrentBatchConfig,rr=0,ke=null,Pe=null,Le=null,Gs=!1,fa=!1,Ta=0,Nx=0;function qe(){throw Error(z(321))}function cc(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Rt(e[n],t[n]))return!1;return!0}function dc(e,t,n,a,s,i){if(rr=i,ke=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Cs.current=e===null||e.memoizedState===null?_x:zx,e=n(a,s),fa){i=0;do{if(fa=!1,Ta=0,25<=i)throw Error(z(301));i+=1,Le=Pe=null,t.updateQueue=null,Cs.current=Tx,e=n(a,s)}while(fa)}if(Cs.current=Js,t=Pe!==null&&Pe.next!==null,rr=0,Le=Pe=ke=null,Gs=!1,t)throw Error(z(300));return e}function uc(){var e=Ta!==0;return Ta=0,e}function $t(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Le===null?ke.memoizedState=Le=e:Le=Le.next=e,Le}function St(){if(Pe===null){var e=ke.alternate;e=e!==null?e.memoizedState:null}else e=Pe.next;var t=Le===null?ke.memoizedState:Le.next;if(t!==null)Le=t,Pe=e;else{if(e===null)throw Error(z(310));Pe=e,e={memoizedState:Pe.memoizedState,baseState:Pe.baseState,baseQueue:Pe.baseQueue,queue:Pe.queue,next:null},Le===null?ke.memoizedState=Le=e:Le=Le.next=e}return Le}function Da(e,t){return typeof t=="function"?t(e):t}function Zi(e){var t=St(),n=t.queue;if(n===null)throw Error(z(311));n.lastRenderedReducer=e;var a=Pe,s=a.baseQueue,i=n.pending;if(i!==null){if(s!==null){var o=s.next;s.next=i.next,i.next=o}a.baseQueue=s=i,n.pending=null}if(s!==null){i=s.next,a=a.baseState;var l=o=null,c=null,d=i;do{var m=d.lane;if((rr&m)===m)c!==null&&(c=c.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),a=d.hasEagerState?d.eagerState:e(a,d.action);else{var f={lane:m,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};c===null?(l=c=f,o=a):c=c.next=f,ke.lanes|=m,ar|=m}d=d.next}while(d!==null&&d!==i);c===null?o=a:c.next=l,Rt(a,t.memoizedState)||(at=!0),t.memoizedState=a,t.baseState=o,t.baseQueue=c,n.lastRenderedState=a}if(e=n.interleaved,e!==null){s=e;do i=s.lane,ke.lanes|=i,ar|=i,s=s.next;while(s!==e)}else s===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function eo(e){var t=St(),n=t.queue;if(n===null)throw Error(z(311));n.lastRenderedReducer=e;var a=n.dispatch,s=n.pending,i=t.memoizedState;if(s!==null){n.pending=null;var o=s=s.next;do i=e(i,o.action),o=o.next;while(o!==s);Rt(i,t.memoizedState)||(at=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,a]}function mf(){}function gf(e,t){var n=ke,a=St(),s=t(),i=!Rt(a.memoizedState,s);if(i&&(a.memoizedState=s,at=!0),a=a.queue,pc(yf.bind(null,n,a,e),[e]),a.getSnapshot!==t||i||Le!==null&&Le.memoizedState.tag&1){if(n.flags|=2048,Ia(9,vf.bind(null,n,a,s,t),void 0,null),Fe===null)throw Error(z(349));rr&30||xf(n,t,s)}return s}function xf(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=ke.updateQueue,t===null?(t={lastEffect:null,stores:null},ke.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function vf(e,t,n,a){t.value=n,t.getSnapshot=a,bf(t)&&jf(e)}function yf(e,t,n){return n(function(){bf(t)&&jf(e)})}function bf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Rt(e,n)}catch{return!0}}function jf(e){var t=cn(e,1);t!==null&&Mt(t,e,1,-1)}function Rd(e){var t=$t();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Da,lastRenderedState:e},t.queue=e,e=e.dispatch=Ex.bind(null,ke,e),[t.memoizedState,e]}function Ia(e,t,n,a){return e={tag:e,create:t,destroy:n,deps:a,next:null},t=ke.updateQueue,t===null?(t={lastEffect:null,stores:null},ke.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(a=n.next,n.next=e,e.next=a,t.lastEffect=e)),e}function wf(){return St().memoizedState}function Es(e,t,n,a){var s=$t();ke.flags|=e,s.memoizedState=Ia(1|t,n,void 0,a===void 0?null:a)}function xi(e,t,n,a){var s=St();a=a===void 0?null:a;var i=void 0;if(Pe!==null){var o=Pe.memoizedState;if(i=o.destroy,a!==null&&cc(a,o.deps)){s.memoizedState=Ia(t,n,i,a);return}}ke.flags|=e,s.memoizedState=Ia(1|t,n,i,a)}function Ld(e,t){return Es(8390656,8,e,t)}function pc(e,t){return xi(2048,8,e,t)}function kf(e,t){return xi(4,2,e,t)}function Nf(e,t){return xi(4,4,e,t)}function Sf(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Cf(e,t,n){return n=n!=null?n.concat([e]):null,xi(4,4,Sf.bind(null,t,e),n)}function fc(){}function Ef(e,t){var n=St();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&cc(t,a[1])?a[0]:(n.memoizedState=[e,t],e)}function _f(e,t){var n=St();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&cc(t,a[1])?a[0]:(e=e(),n.memoizedState=[e,t],e)}function zf(e,t,n){return rr&21?(Rt(n,t)||(n=Pp(),ke.lanes|=n,ar|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,at=!0),e.memoizedState=n)}function Sx(e,t){var n=le;le=n!==0&&4>n?n:4,e(!0);var a=Xi.transition;Xi.transition={};try{e(!1),t()}finally{le=n,Xi.transition=a}}function Tf(){return St().memoizedState}function Cx(e,t,n){var a=Tn(e);if(n={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null},Df(e))If(t,n);else if(n=pf(e,t,n,a),n!==null){var s=Ze();Mt(n,e,a,s),Pf(n,t,a)}}function Ex(e,t,n){var a=Tn(e),s={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null};if(Df(e))If(t,s);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var o=t.lastRenderedState,l=i(o,n);if(s.hasEagerState=!0,s.eagerState=l,Rt(l,o)){var c=t.interleaved;c===null?(s.next=s,ac(t)):(s.next=c.next,c.next=s),t.interleaved=s;return}}catch{}finally{}n=pf(e,t,s,a),n!==null&&(s=Ze(),Mt(n,e,a,s),Pf(n,t,a))}}function Df(e){var t=e.alternate;return e===ke||t!==null&&t===ke}function If(e,t){fa=Gs=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Pf(e,t,n){if(n&4194240){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Hl(e,n)}}var Js={readContext:Nt,useCallback:qe,useContext:qe,useEffect:qe,useImperativeHandle:qe,useInsertionEffect:qe,useLayoutEffect:qe,useMemo:qe,useReducer:qe,useRef:qe,useState:qe,useDebugValue:qe,useDeferredValue:qe,useTransition:qe,useMutableSource:qe,useSyncExternalStore:qe,useId:qe,unstable_isNewReconciler:!1},_x={readContext:Nt,useCallback:function(e,t){return $t().memoizedState=[e,t===void 0?null:t],e},useContext:Nt,useEffect:Ld,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Es(4194308,4,Sf.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Es(4194308,4,e,t)},useInsertionEffect:function(e,t){return Es(4,2,e,t)},useMemo:function(e,t){var n=$t();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var a=$t();return t=n!==void 0?n(t):t,a.memoizedState=a.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},a.queue=e,e=e.dispatch=Cx.bind(null,ke,e),[a.memoizedState,e]},useRef:function(e){var t=$t();return e={current:e},t.memoizedState=e},useState:Rd,useDebugValue:fc,useDeferredValue:function(e){return $t().memoizedState=e},useTransition:function(){var e=Rd(!1),t=e[0];return e=Sx.bind(null,e[1]),$t().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var a=ke,s=$t();if(be){if(n===void 0)throw Error(z(407));n=n()}else{if(n=t(),Fe===null)throw Error(z(349));rr&30||xf(a,t,n)}s.memoizedState=n;var i={value:n,getSnapshot:t};return s.queue=i,Ld(yf.bind(null,a,i,e),[e]),a.flags|=2048,Ia(9,vf.bind(null,a,i,n,t),void 0,null),n},useId:function(){var e=$t(),t=Fe.identifierPrefix;if(be){var n=tn,a=en;n=(a&~(1<<32-At(a)-1)).toString(32)+n,t=":"+t+"R"+n,n=Ta++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Nx++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},zx={readContext:Nt,useCallback:Ef,useContext:Nt,useEffect:pc,useImperativeHandle:Cf,useInsertionEffect:kf,useLayoutEffect:Nf,useMemo:_f,useReducer:Zi,useRef:wf,useState:function(){return Zi(Da)},useDebugValue:fc,useDeferredValue:function(e){var t=St();return zf(t,Pe.memoizedState,e)},useTransition:function(){var e=Zi(Da)[0],t=St().memoizedState;return[e,t]},useMutableSource:mf,useSyncExternalStore:gf,useId:Tf,unstable_isNewReconciler:!1},Tx={readContext:Nt,useCallback:Ef,useContext:Nt,useEffect:pc,useImperativeHandle:Cf,useInsertionEffect:kf,useLayoutEffect:Nf,useMemo:_f,useReducer:eo,useRef:wf,useState:function(){return eo(Da)},useDebugValue:fc,useDeferredValue:function(e){var t=St();return Pe===null?t.memoizedState=e:zf(t,Pe.memoizedState,e)},useTransition:function(){var e=eo(Da)[0],t=St().memoizedState;return[e,t]},useMutableSource:mf,useSyncExternalStore:gf,useId:Tf,unstable_isNewReconciler:!1};function zt(e,t){if(e&&e.defaultProps){t=Ne({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Qo(e,t,n,a){t=e.memoizedState,n=n(a,t),n=n==null?t:Ne({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var vi={isMounted:function(e){return(e=e._reactInternals)?ur(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var a=Ze(),s=Tn(e),i=rn(a,s);i.payload=t,n!=null&&(i.callback=n),t=_n(e,i,s),t!==null&&(Mt(t,e,s,a),Ss(t,e,s))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var a=Ze(),s=Tn(e),i=rn(a,s);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=_n(e,i,s),t!==null&&(Mt(t,e,s,a),Ss(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ze(),a=Tn(e),s=rn(n,a);s.tag=2,t!=null&&(s.callback=t),t=_n(e,s,a),t!==null&&(Mt(t,e,a,n),Ss(t,e,a))}};function Fd(e,t,n,a,s,i,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,i,o):t.prototype&&t.prototype.isPureReactComponent?!Na(n,a)||!Na(s,i):!0}function Af(e,t,n){var a=!1,s=Rn,i=t.contextType;return typeof i=="object"&&i!==null?i=Nt(i):(s=it(t)?tr:Qe.current,a=t.contextTypes,i=(a=a!=null)?Mr(e,s):Rn),t=new t(n,i),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=vi,e.stateNode=t,t._reactInternals=e,a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=i),t}function $d(e,t,n,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,a),t.state!==e&&vi.enqueueReplaceState(t,t.state,null)}function Xo(e,t,n,a){var s=e.stateNode;s.props=n,s.state=e.memoizedState,s.refs={},sc(e);var i=t.contextType;typeof i=="object"&&i!==null?s.context=Nt(i):(i=it(t)?tr:Qe.current,s.context=Mr(e,i)),s.state=e.memoizedState,i=t.getDerivedStateFromProps,typeof i=="function"&&(Qo(e,t,i,n),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&vi.enqueueReplaceState(s,s.state,null),Ys(e,n,s,a),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function $r(e,t){try{var n="",a=t;do n+=ag(a),a=a.return;while(a);var s=n}catch(i){s=`
Error generating stack: `+i.message+`
`+i.stack}return{value:e,source:t,stack:s,digest:null}}function to(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Zo(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Dx=typeof WeakMap=="function"?WeakMap:Map;function Mf(e,t,n){n=rn(-1,n),n.tag=3,n.payload={element:null};var a=t.value;return n.callback=function(){Xs||(Xs=!0,cl=a),Zo(e,t)},n}function Rf(e,t,n){n=rn(-1,n),n.tag=3;var a=e.type.getDerivedStateFromError;if(typeof a=="function"){var s=t.value;n.payload=function(){return a(s)},n.callback=function(){Zo(e,t)}}var i=e.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){Zo(e,t),typeof a!="function"&&(zn===null?zn=new Set([this]):zn.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Od(e,t,n){var a=e.pingCache;if(a===null){a=e.pingCache=new Dx;var s=new Set;a.set(t,s)}else s=a.get(t),s===void 0&&(s=new Set,a.set(t,s));s.has(n)||(s.add(n),e=Vx.bind(null,e,t,n),t.then(e,e))}function Bd(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Wd(e,t,n,a,s){return e.mode&1?(e.flags|=65536,e.lanes=s,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=rn(-1,1),t.tag=2,_n(n,t,1))),n.lanes|=1),e)}var Ix=pn.ReactCurrentOwner,at=!1;function Xe(e,t,n,a){t.child=e===null?uf(t,null,n,a):Lr(t,e.child,n,a)}function Ud(e,t,n,a,s){n=n.render;var i=t.ref;return Tr(t,s),a=dc(e,t,n,a,i,s),n=uc(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,dn(e,t,s)):(be&&n&&Xl(t),t.flags|=1,Xe(e,t,a,s),t.child)}function Hd(e,t,n,a,s){if(e===null){var i=n.type;return typeof i=="function"&&!jc(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=i,Lf(e,t,i,a,s)):(e=Ds(n.type,null,a,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!(e.lanes&s)){var o=i.memoizedProps;if(n=n.compare,n=n!==null?n:Na,n(o,a)&&e.ref===t.ref)return dn(e,t,s)}return t.flags|=1,e=Dn(i,a),e.ref=t.ref,e.return=t,t.child=e}function Lf(e,t,n,a,s){if(e!==null){var i=e.memoizedProps;if(Na(i,a)&&e.ref===t.ref)if(at=!1,t.pendingProps=a=i,(e.lanes&s)!==0)e.flags&131072&&(at=!0);else return t.lanes=e.lanes,dn(e,t,s)}return el(e,t,n,a,s)}function Ff(e,t,n){var a=t.pendingProps,s=a.children,i=e!==null?e.memoizedState:null;if(a.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},fe(Sr,ut),ut|=n;else{if(!(n&1073741824))return e=i!==null?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,fe(Sr,ut),ut|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},a=i!==null?i.baseLanes:n,fe(Sr,ut),ut|=a}else i!==null?(a=i.baseLanes|n,t.memoizedState=null):a=n,fe(Sr,ut),ut|=a;return Xe(e,t,s,n),t.child}function $f(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function el(e,t,n,a,s){var i=it(n)?tr:Qe.current;return i=Mr(t,i),Tr(t,s),n=dc(e,t,n,a,i,s),a=uc(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,dn(e,t,s)):(be&&a&&Xl(t),t.flags|=1,Xe(e,t,n,s),t.child)}function Vd(e,t,n,a,s){if(it(n)){var i=!0;Ws(t)}else i=!1;if(Tr(t,s),t.stateNode===null)_s(e,t),Af(t,n,a),Xo(t,n,a,s),a=!0;else if(e===null){var o=t.stateNode,l=t.memoizedProps;o.props=l;var c=o.context,d=n.contextType;typeof d=="object"&&d!==null?d=Nt(d):(d=it(n)?tr:Qe.current,d=Mr(t,d));var m=n.getDerivedStateFromProps,f=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function";f||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==a||c!==d)&&$d(t,o,a,d),xn=!1;var x=t.memoizedState;o.state=x,Ys(t,a,o,s),c=t.memoizedState,l!==a||x!==c||st.current||xn?(typeof m=="function"&&(Qo(t,n,m,a),c=t.memoizedState),(l=xn||Fd(t,n,l,a,x,c,d))?(f||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=c),o.props=a,o.state=c,o.context=d,a=l):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{o=t.stateNode,ff(e,t),l=t.memoizedProps,d=t.type===t.elementType?l:zt(t.type,l),o.props=d,f=t.pendingProps,x=o.context,c=n.contextType,typeof c=="object"&&c!==null?c=Nt(c):(c=it(n)?tr:Qe.current,c=Mr(t,c));var b=n.getDerivedStateFromProps;(m=typeof b=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==f||x!==c)&&$d(t,o,a,c),xn=!1,x=t.memoizedState,o.state=x,Ys(t,a,o,s);var w=t.memoizedState;l!==f||x!==w||st.current||xn?(typeof b=="function"&&(Qo(t,n,b,a),w=t.memoizedState),(d=xn||Fd(t,n,d,a,x,w,c)||!1)?(m||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(a,w,c),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(a,w,c)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===e.memoizedProps&&x===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&x===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=w),o.props=a,o.state=w,o.context=c,a=d):(typeof o.componentDidUpdate!="function"||l===e.memoizedProps&&x===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&x===e.memoizedState||(t.flags|=1024),a=!1)}return tl(e,t,n,a,i,s)}function tl(e,t,n,a,s,i){$f(e,t);var o=(t.flags&128)!==0;if(!a&&!o)return s&&Td(t,n,!1),dn(e,t,i);a=t.stateNode,Ix.current=t;var l=o&&typeof n.getDerivedStateFromError!="function"?null:a.render();return t.flags|=1,e!==null&&o?(t.child=Lr(t,e.child,null,i),t.child=Lr(t,null,l,i)):Xe(e,t,l,i),t.memoizedState=a.state,s&&Td(t,n,!0),t.child}function Of(e){var t=e.stateNode;t.pendingContext?zd(e,t.pendingContext,t.pendingContext!==t.context):t.context&&zd(e,t.context,!1),ic(e,t.containerInfo)}function qd(e,t,n,a,s){return Rr(),ec(s),t.flags|=256,Xe(e,t,n,a),t.child}var nl={dehydrated:null,treeContext:null,retryLane:0};function rl(e){return{baseLanes:e,cachePool:null,transitions:null}}function Bf(e,t,n){var a=t.pendingProps,s=we.current,i=!1,o=(t.flags&128)!==0,l;if((l=o)||(l=e!==null&&e.memoizedState===null?!1:(s&2)!==0),l?(i=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),fe(we,s&1),e===null)return Go(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=a.children,e=a.fallback,i?(a=t.mode,i=t.child,o={mode:"hidden",children:o},!(a&1)&&i!==null?(i.childLanes=0,i.pendingProps=o):i=ji(o,a,0,null),e=Xn(e,a,n,null),i.return=t,e.return=t,i.sibling=e,t.child=i,t.child.memoizedState=rl(n),t.memoizedState=nl,e):hc(t,o));if(s=e.memoizedState,s!==null&&(l=s.dehydrated,l!==null))return Px(e,t,o,a,l,s,n);if(i){i=a.fallback,o=t.mode,s=e.child,l=s.sibling;var c={mode:"hidden",children:a.children};return!(o&1)&&t.child!==s?(a=t.child,a.childLanes=0,a.pendingProps=c,t.deletions=null):(a=Dn(s,c),a.subtreeFlags=s.subtreeFlags&14680064),l!==null?i=Dn(l,i):(i=Xn(i,o,n,null),i.flags|=2),i.return=t,a.return=t,a.sibling=i,t.child=a,a=i,i=t.child,o=e.child.memoizedState,o=o===null?rl(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},i.memoizedState=o,i.childLanes=e.childLanes&~n,t.memoizedState=nl,a}return i=e.child,e=i.sibling,a=Dn(i,{mode:"visible",children:a.children}),!(t.mode&1)&&(a.lanes=n),a.return=t,a.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=a,t.memoizedState=null,a}function hc(e,t){return t=ji({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ms(e,t,n,a){return a!==null&&ec(a),Lr(t,e.child,null,n),e=hc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Px(e,t,n,a,s,i,o){if(n)return t.flags&256?(t.flags&=-257,a=to(Error(z(422))),ms(e,t,o,a)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(i=a.fallback,s=t.mode,a=ji({mode:"visible",children:a.children},s,0,null),i=Xn(i,s,o,null),i.flags|=2,a.return=t,i.return=t,a.sibling=i,t.child=a,t.mode&1&&Lr(t,e.child,null,o),t.child.memoizedState=rl(o),t.memoizedState=nl,i);if(!(t.mode&1))return ms(e,t,o,null);if(s.data==="$!"){if(a=s.nextSibling&&s.nextSibling.dataset,a)var l=a.dgst;return a=l,i=Error(z(419)),a=to(i,a,void 0),ms(e,t,o,a)}if(l=(o&e.childLanes)!==0,at||l){if(a=Fe,a!==null){switch(o&-o){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=s&(a.suspendedLanes|o)?0:s,s!==0&&s!==i.retryLane&&(i.retryLane=s,cn(e,s),Mt(a,e,s,-1))}return bc(),a=to(Error(z(421))),ms(e,t,o,a)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=qx.bind(null,e),s._reactRetry=t,null):(e=i.treeContext,ft=En(s.nextSibling),mt=t,be=!0,It=null,e!==null&&(bt[jt++]=en,bt[jt++]=tn,bt[jt++]=nr,en=e.id,tn=e.overflow,nr=t),t=hc(t,a.children),t.flags|=4096,t)}function Yd(e,t,n){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),Jo(e.return,t,n)}function no(e,t,n,a,s){var i=e.memoizedState;i===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:n,tailMode:s}:(i.isBackwards=t,i.rendering=null,i.renderingStartTime=0,i.last=a,i.tail=n,i.tailMode=s)}function Wf(e,t,n){var a=t.pendingProps,s=a.revealOrder,i=a.tail;if(Xe(e,t,a.children,n),a=we.current,a&2)a=a&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Yd(e,n,t);else if(e.tag===19)Yd(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}a&=1}if(fe(we,a),!(t.mode&1))t.memoizedState=null;else switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&Ks(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),no(t,!1,s,n,i);break;case"backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&Ks(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}no(t,!0,n,null,i);break;case"together":no(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function _s(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function dn(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),ar|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(z(153));if(t.child!==null){for(e=t.child,n=Dn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Dn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Ax(e,t,n){switch(t.tag){case 3:Of(t),Rr();break;case 5:hf(t);break;case 1:it(t.type)&&Ws(t);break;case 4:ic(t,t.stateNode.containerInfo);break;case 10:var a=t.type._context,s=t.memoizedProps.value;fe(Vs,a._currentValue),a._currentValue=s;break;case 13:if(a=t.memoizedState,a!==null)return a.dehydrated!==null?(fe(we,we.current&1),t.flags|=128,null):n&t.child.childLanes?Bf(e,t,n):(fe(we,we.current&1),e=dn(e,t,n),e!==null?e.sibling:null);fe(we,we.current&1);break;case 19:if(a=(n&t.childLanes)!==0,e.flags&128){if(a)return Wf(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),fe(we,we.current),a)break;return null;case 22:case 23:return t.lanes=0,Ff(e,t,n)}return dn(e,t,n)}var Uf,al,Hf,Vf;Uf=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};al=function(){};Hf=function(e,t,n,a){var s=e.memoizedProps;if(s!==a){e=t.stateNode,Yn(Ht.current);var i=null;switch(n){case"input":s=Co(e,s),a=Co(e,a),i=[];break;case"select":s=Ne({},s,{value:void 0}),a=Ne({},a,{value:void 0}),i=[];break;case"textarea":s=zo(e,s),a=zo(e,a),i=[];break;default:typeof s.onClick!="function"&&typeof a.onClick=="function"&&(e.onclick=Os)}Do(n,a);var o;n=null;for(d in s)if(!a.hasOwnProperty(d)&&s.hasOwnProperty(d)&&s[d]!=null)if(d==="style"){var l=s[d];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(xa.hasOwnProperty(d)?i||(i=[]):(i=i||[]).push(d,null));for(d in a){var c=a[d];if(l=s!=null?s[d]:void 0,a.hasOwnProperty(d)&&c!==l&&(c!=null||l!=null))if(d==="style")if(l){for(o in l)!l.hasOwnProperty(o)||c&&c.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in c)c.hasOwnProperty(o)&&l[o]!==c[o]&&(n||(n={}),n[o]=c[o])}else n||(i||(i=[]),i.push(d,n)),n=c;else d==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,l=l?l.__html:void 0,c!=null&&l!==c&&(i=i||[]).push(d,c)):d==="children"?typeof c!="string"&&typeof c!="number"||(i=i||[]).push(d,""+c):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(xa.hasOwnProperty(d)?(c!=null&&d==="onScroll"&&ge("scroll",e),i||l===c||(i=[])):(i=i||[]).push(d,c))}n&&(i=i||[]).push("style",n);var d=i;(t.updateQueue=d)&&(t.flags|=4)}};Vf=function(e,t,n,a){n!==a&&(t.flags|=4)};function na(e,t){if(!be)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function Ye(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,a=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,a|=s.subtreeFlags&14680064,a|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,a|=s.subtreeFlags,a|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=a,e.childLanes=n,t}function Mx(e,t,n){var a=t.pendingProps;switch(Zl(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ye(t),null;case 1:return it(t.type)&&Bs(),Ye(t),null;case 3:return a=t.stateNode,Fr(),ve(st),ve(Qe),lc(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(fs(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,It!==null&&(pl(It),It=null))),al(e,t),Ye(t),null;case 5:oc(t);var s=Yn(za.current);if(n=t.type,e!==null&&t.stateNode!=null)Hf(e,t,n,a,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!a){if(t.stateNode===null)throw Error(z(166));return Ye(t),null}if(e=Yn(Ht.current),fs(t)){a=t.stateNode,n=t.type;var i=t.memoizedProps;switch(a[Ot]=t,a[Ea]=i,e=(t.mode&1)!==0,n){case"dialog":ge("cancel",a),ge("close",a);break;case"iframe":case"object":case"embed":ge("load",a);break;case"video":case"audio":for(s=0;s<oa.length;s++)ge(oa[s],a);break;case"source":ge("error",a);break;case"img":case"image":case"link":ge("error",a),ge("load",a);break;case"details":ge("toggle",a);break;case"input":nd(a,i),ge("invalid",a);break;case"select":a._wrapperState={wasMultiple:!!i.multiple},ge("invalid",a);break;case"textarea":ad(a,i),ge("invalid",a)}Do(n,i),s=null;for(var o in i)if(i.hasOwnProperty(o)){var l=i[o];o==="children"?typeof l=="string"?a.textContent!==l&&(i.suppressHydrationWarning!==!0&&ps(a.textContent,l,e),s=["children",l]):typeof l=="number"&&a.textContent!==""+l&&(i.suppressHydrationWarning!==!0&&ps(a.textContent,l,e),s=["children",""+l]):xa.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&ge("scroll",a)}switch(n){case"input":as(a),rd(a,i,!0);break;case"textarea":as(a),sd(a);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(a.onclick=Os)}a=s,t.updateQueue=a,a!==null&&(t.flags|=4)}else{o=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=vp(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof a.is=="string"?e=o.createElement(n,{is:a.is}):(e=o.createElement(n),n==="select"&&(o=e,a.multiple?o.multiple=!0:a.size&&(o.size=a.size))):e=o.createElementNS(e,n),e[Ot]=t,e[Ea]=a,Uf(e,t,!1,!1),t.stateNode=e;e:{switch(o=Io(n,a),n){case"dialog":ge("cancel",e),ge("close",e),s=a;break;case"iframe":case"object":case"embed":ge("load",e),s=a;break;case"video":case"audio":for(s=0;s<oa.length;s++)ge(oa[s],e);s=a;break;case"source":ge("error",e),s=a;break;case"img":case"image":case"link":ge("error",e),ge("load",e),s=a;break;case"details":ge("toggle",e),s=a;break;case"input":nd(e,a),s=Co(e,a),ge("invalid",e);break;case"option":s=a;break;case"select":e._wrapperState={wasMultiple:!!a.multiple},s=Ne({},a,{value:void 0}),ge("invalid",e);break;case"textarea":ad(e,a),s=zo(e,a),ge("invalid",e);break;default:s=a}Do(n,s),l=s;for(i in l)if(l.hasOwnProperty(i)){var c=l[i];i==="style"?jp(e,c):i==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&yp(e,c)):i==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&va(e,c):typeof c=="number"&&va(e,""+c):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(xa.hasOwnProperty(i)?c!=null&&i==="onScroll"&&ge("scroll",e):c!=null&&Fl(e,i,c,o))}switch(n){case"input":as(e),rd(e,a,!1);break;case"textarea":as(e),sd(e);break;case"option":a.value!=null&&e.setAttribute("value",""+Mn(a.value));break;case"select":e.multiple=!!a.multiple,i=a.value,i!=null?Cr(e,!!a.multiple,i,!1):a.defaultValue!=null&&Cr(e,!!a.multiple,a.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=Os)}switch(n){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}}a&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ye(t),null;case 6:if(e&&t.stateNode!=null)Vf(e,t,e.memoizedProps,a);else{if(typeof a!="string"&&t.stateNode===null)throw Error(z(166));if(n=Yn(za.current),Yn(Ht.current),fs(t)){if(a=t.stateNode,n=t.memoizedProps,a[Ot]=t,(i=a.nodeValue!==n)&&(e=mt,e!==null))switch(e.tag){case 3:ps(a.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ps(a.nodeValue,n,(e.mode&1)!==0)}i&&(t.flags|=4)}else a=(n.nodeType===9?n:n.ownerDocument).createTextNode(a),a[Ot]=t,t.stateNode=a}return Ye(t),null;case 13:if(ve(we),a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(be&&ft!==null&&t.mode&1&&!(t.flags&128))cf(),Rr(),t.flags|=98560,i=!1;else if(i=fs(t),a!==null&&a.dehydrated!==null){if(e===null){if(!i)throw Error(z(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(z(317));i[Ot]=t}else Rr(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Ye(t),i=!1}else It!==null&&(pl(It),It=null),i=!0;if(!i)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(a=a!==null,a!==(e!==null&&e.memoizedState!==null)&&a&&(t.child.flags|=8192,t.mode&1&&(e===null||we.current&1?Ae===0&&(Ae=3):bc())),t.updateQueue!==null&&(t.flags|=4),Ye(t),null);case 4:return Fr(),al(e,t),e===null&&Sa(t.stateNode.containerInfo),Ye(t),null;case 10:return rc(t.type._context),Ye(t),null;case 17:return it(t.type)&&Bs(),Ye(t),null;case 19:if(ve(we),i=t.memoizedState,i===null)return Ye(t),null;if(a=(t.flags&128)!==0,o=i.rendering,o===null)if(a)na(i,!1);else{if(Ae!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=Ks(e),o!==null){for(t.flags|=128,na(i,!1),a=o.updateQueue,a!==null&&(t.updateQueue=a,t.flags|=4),t.subtreeFlags=0,a=n,n=t.child;n!==null;)i=n,e=a,i.flags&=14680066,o=i.alternate,o===null?(i.childLanes=0,i.lanes=e,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=o.childLanes,i.lanes=o.lanes,i.child=o.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=o.memoizedProps,i.memoizedState=o.memoizedState,i.updateQueue=o.updateQueue,i.type=o.type,e=o.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return fe(we,we.current&1|2),t.child}e=e.sibling}i.tail!==null&&_e()>Or&&(t.flags|=128,a=!0,na(i,!1),t.lanes=4194304)}else{if(!a)if(e=Ks(o),e!==null){if(t.flags|=128,a=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),na(i,!0),i.tail===null&&i.tailMode==="hidden"&&!o.alternate&&!be)return Ye(t),null}else 2*_e()-i.renderingStartTime>Or&&n!==1073741824&&(t.flags|=128,a=!0,na(i,!1),t.lanes=4194304);i.isBackwards?(o.sibling=t.child,t.child=o):(n=i.last,n!==null?n.sibling=o:t.child=o,i.last=o)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=_e(),t.sibling=null,n=we.current,fe(we,a?n&1|2:n&1),t):(Ye(t),null);case 22:case 23:return yc(),a=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==a&&(t.flags|=8192),a&&t.mode&1?ut&1073741824&&(Ye(t),t.subtreeFlags&6&&(t.flags|=8192)):Ye(t),null;case 24:return null;case 25:return null}throw Error(z(156,t.tag))}function Rx(e,t){switch(Zl(t),t.tag){case 1:return it(t.type)&&Bs(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Fr(),ve(st),ve(Qe),lc(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return oc(t),null;case 13:if(ve(we),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(z(340));Rr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ve(we),null;case 4:return Fr(),null;case 10:return rc(t.type._context),null;case 22:case 23:return yc(),null;case 24:return null;default:return null}}var gs=!1,Ke=!1,Lx=typeof WeakSet=="function"?WeakSet:Set,M=null;function Nr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(a){Ee(e,t,a)}else n.current=null}function sl(e,t,n){try{n()}catch(a){Ee(e,t,a)}}var Kd=!1;function Fx(e,t){if(Wo=Ls,e=Gp(),Ql(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var a=n.getSelection&&n.getSelection();if(a&&a.rangeCount!==0){n=a.anchorNode;var s=a.anchorOffset,i=a.focusNode;a=a.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var o=0,l=-1,c=-1,d=0,m=0,f=e,x=null;t:for(;;){for(var b;f!==n||s!==0&&f.nodeType!==3||(l=o+s),f!==i||a!==0&&f.nodeType!==3||(c=o+a),f.nodeType===3&&(o+=f.nodeValue.length),(b=f.firstChild)!==null;)x=f,f=b;for(;;){if(f===e)break t;if(x===n&&++d===s&&(l=o),x===i&&++m===a&&(c=o),(b=f.nextSibling)!==null)break;f=x,x=f.parentNode}f=b}n=l===-1||c===-1?null:{start:l,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(Uo={focusedElem:e,selectionRange:n},Ls=!1,M=t;M!==null;)if(t=M,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,M=e;else for(;M!==null;){t=M;try{var w=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var k=w.memoizedProps,N=w.memoizedState,g=t.stateNode,u=g.getSnapshotBeforeUpdate(t.elementType===t.type?k:zt(t.type,k),N);g.__reactInternalSnapshotBeforeUpdate=u}break;case 3:var h=t.stateNode.containerInfo;h.nodeType===1?h.textContent="":h.nodeType===9&&h.documentElement&&h.removeChild(h.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(z(163))}}catch(y){Ee(t,t.return,y)}if(e=t.sibling,e!==null){e.return=t.return,M=e;break}M=t.return}return w=Kd,Kd=!1,w}function ha(e,t,n){var a=t.updateQueue;if(a=a!==null?a.lastEffect:null,a!==null){var s=a=a.next;do{if((s.tag&e)===e){var i=s.destroy;s.destroy=void 0,i!==void 0&&sl(t,n,i)}s=s.next}while(s!==a)}}function yi(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var a=n.create;n.destroy=a()}n=n.next}while(n!==t)}}function il(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function qf(e){var t=e.alternate;t!==null&&(e.alternate=null,qf(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ot],delete t[Ea],delete t[qo],delete t[bx],delete t[jx])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Yf(e){return e.tag===5||e.tag===3||e.tag===4}function Gd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Yf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ol(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Os));else if(a!==4&&(e=e.child,e!==null))for(ol(e,t,n),e=e.sibling;e!==null;)ol(e,t,n),e=e.sibling}function ll(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(a!==4&&(e=e.child,e!==null))for(ll(e,t,n),e=e.sibling;e!==null;)ll(e,t,n),e=e.sibling}var Be=null,Tt=!1;function mn(e,t,n){for(n=n.child;n!==null;)Kf(e,t,n),n=n.sibling}function Kf(e,t,n){if(Ut&&typeof Ut.onCommitFiberUnmount=="function")try{Ut.onCommitFiberUnmount(ui,n)}catch{}switch(n.tag){case 5:Ke||Nr(n,t);case 6:var a=Be,s=Tt;Be=null,mn(e,t,n),Be=a,Tt=s,Be!==null&&(Tt?(e=Be,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Be.removeChild(n.stateNode));break;case 18:Be!==null&&(Tt?(e=Be,n=n.stateNode,e.nodeType===8?Gi(e.parentNode,n):e.nodeType===1&&Gi(e,n),wa(e)):Gi(Be,n.stateNode));break;case 4:a=Be,s=Tt,Be=n.stateNode.containerInfo,Tt=!0,mn(e,t,n),Be=a,Tt=s;break;case 0:case 11:case 14:case 15:if(!Ke&&(a=n.updateQueue,a!==null&&(a=a.lastEffect,a!==null))){s=a=a.next;do{var i=s,o=i.destroy;i=i.tag,o!==void 0&&(i&2||i&4)&&sl(n,t,o),s=s.next}while(s!==a)}mn(e,t,n);break;case 1:if(!Ke&&(Nr(n,t),a=n.stateNode,typeof a.componentWillUnmount=="function"))try{a.props=n.memoizedProps,a.state=n.memoizedState,a.componentWillUnmount()}catch(l){Ee(n,t,l)}mn(e,t,n);break;case 21:mn(e,t,n);break;case 22:n.mode&1?(Ke=(a=Ke)||n.memoizedState!==null,mn(e,t,n),Ke=a):mn(e,t,n);break;default:mn(e,t,n)}}function Jd(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Lx),t.forEach(function(a){var s=Yx.bind(null,e,a);n.has(a)||(n.add(a),a.then(s,s))})}}function _t(e,t){var n=t.deletions;if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];try{var i=e,o=t,l=o;e:for(;l!==null;){switch(l.tag){case 5:Be=l.stateNode,Tt=!1;break e;case 3:Be=l.stateNode.containerInfo,Tt=!0;break e;case 4:Be=l.stateNode.containerInfo,Tt=!0;break e}l=l.return}if(Be===null)throw Error(z(160));Kf(i,o,s),Be=null,Tt=!1;var c=s.alternate;c!==null&&(c.return=null),s.return=null}catch(d){Ee(s,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Gf(t,e),t=t.sibling}function Gf(e,t){var n=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(_t(t,e),Ft(e),a&4){try{ha(3,e,e.return),yi(3,e)}catch(k){Ee(e,e.return,k)}try{ha(5,e,e.return)}catch(k){Ee(e,e.return,k)}}break;case 1:_t(t,e),Ft(e),a&512&&n!==null&&Nr(n,n.return);break;case 5:if(_t(t,e),Ft(e),a&512&&n!==null&&Nr(n,n.return),e.flags&32){var s=e.stateNode;try{va(s,"")}catch(k){Ee(e,e.return,k)}}if(a&4&&(s=e.stateNode,s!=null)){var i=e.memoizedProps,o=n!==null?n.memoizedProps:i,l=e.type,c=e.updateQueue;if(e.updateQueue=null,c!==null)try{l==="input"&&i.type==="radio"&&i.name!=null&&gp(s,i),Io(l,o);var d=Io(l,i);for(o=0;o<c.length;o+=2){var m=c[o],f=c[o+1];m==="style"?jp(s,f):m==="dangerouslySetInnerHTML"?yp(s,f):m==="children"?va(s,f):Fl(s,m,f,d)}switch(l){case"input":Eo(s,i);break;case"textarea":xp(s,i);break;case"select":var x=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!i.multiple;var b=i.value;b!=null?Cr(s,!!i.multiple,b,!1):x!==!!i.multiple&&(i.defaultValue!=null?Cr(s,!!i.multiple,i.defaultValue,!0):Cr(s,!!i.multiple,i.multiple?[]:"",!1))}s[Ea]=i}catch(k){Ee(e,e.return,k)}}break;case 6:if(_t(t,e),Ft(e),a&4){if(e.stateNode===null)throw Error(z(162));s=e.stateNode,i=e.memoizedProps;try{s.nodeValue=i}catch(k){Ee(e,e.return,k)}}break;case 3:if(_t(t,e),Ft(e),a&4&&n!==null&&n.memoizedState.isDehydrated)try{wa(t.containerInfo)}catch(k){Ee(e,e.return,k)}break;case 4:_t(t,e),Ft(e);break;case 13:_t(t,e),Ft(e),s=e.child,s.flags&8192&&(i=s.memoizedState!==null,s.stateNode.isHidden=i,!i||s.alternate!==null&&s.alternate.memoizedState!==null||(xc=_e())),a&4&&Jd(e);break;case 22:if(m=n!==null&&n.memoizedState!==null,e.mode&1?(Ke=(d=Ke)||m,_t(t,e),Ke=d):_t(t,e),Ft(e),a&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!m&&e.mode&1)for(M=e,m=e.child;m!==null;){for(f=M=m;M!==null;){switch(x=M,b=x.child,x.tag){case 0:case 11:case 14:case 15:ha(4,x,x.return);break;case 1:Nr(x,x.return);var w=x.stateNode;if(typeof w.componentWillUnmount=="function"){a=x,n=x.return;try{t=a,w.props=t.memoizedProps,w.state=t.memoizedState,w.componentWillUnmount()}catch(k){Ee(a,n,k)}}break;case 5:Nr(x,x.return);break;case 22:if(x.memoizedState!==null){Xd(f);continue}}b!==null?(b.return=x,M=b):Xd(f)}m=m.sibling}e:for(m=null,f=e;;){if(f.tag===5){if(m===null){m=f;try{s=f.stateNode,d?(i=s.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(l=f.stateNode,c=f.memoizedProps.style,o=c!=null&&c.hasOwnProperty("display")?c.display:null,l.style.display=bp("display",o))}catch(k){Ee(e,e.return,k)}}}else if(f.tag===6){if(m===null)try{f.stateNode.nodeValue=d?"":f.memoizedProps}catch(k){Ee(e,e.return,k)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===e)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===e)break e;for(;f.sibling===null;){if(f.return===null||f.return===e)break e;m===f&&(m=null),f=f.return}m===f&&(m=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:_t(t,e),Ft(e),a&4&&Jd(e);break;case 21:break;default:_t(t,e),Ft(e)}}function Ft(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Yf(n)){var a=n;break e}n=n.return}throw Error(z(160))}switch(a.tag){case 5:var s=a.stateNode;a.flags&32&&(va(s,""),a.flags&=-33);var i=Gd(e);ll(e,i,s);break;case 3:case 4:var o=a.stateNode.containerInfo,l=Gd(e);ol(e,l,o);break;default:throw Error(z(161))}}catch(c){Ee(e,e.return,c)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function $x(e,t,n){M=e,Jf(e)}function Jf(e,t,n){for(var a=(e.mode&1)!==0;M!==null;){var s=M,i=s.child;if(s.tag===22&&a){var o=s.memoizedState!==null||gs;if(!o){var l=s.alternate,c=l!==null&&l.memoizedState!==null||Ke;l=gs;var d=Ke;if(gs=o,(Ke=c)&&!d)for(M=s;M!==null;)o=M,c=o.child,o.tag===22&&o.memoizedState!==null?Zd(s):c!==null?(c.return=o,M=c):Zd(s);for(;i!==null;)M=i,Jf(i),i=i.sibling;M=s,gs=l,Ke=d}Qd(e)}else s.subtreeFlags&8772&&i!==null?(i.return=s,M=i):Qd(e)}}function Qd(e){for(;M!==null;){var t=M;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Ke||yi(5,t);break;case 1:var a=t.stateNode;if(t.flags&4&&!Ke)if(n===null)a.componentDidMount();else{var s=t.elementType===t.type?n.memoizedProps:zt(t.type,n.memoizedProps);a.componentDidUpdate(s,n.memoizedState,a.__reactInternalSnapshotBeforeUpdate)}var i=t.updateQueue;i!==null&&Md(t,i,a);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Md(t,o,n)}break;case 5:var l=t.stateNode;if(n===null&&t.flags&4){n=l;var c=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var m=d.memoizedState;if(m!==null){var f=m.dehydrated;f!==null&&wa(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(z(163))}Ke||t.flags&512&&il(t)}catch(x){Ee(t,t.return,x)}}if(t===e){M=null;break}if(n=t.sibling,n!==null){n.return=t.return,M=n;break}M=t.return}}function Xd(e){for(;M!==null;){var t=M;if(t===e){M=null;break}var n=t.sibling;if(n!==null){n.return=t.return,M=n;break}M=t.return}}function Zd(e){for(;M!==null;){var t=M;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{yi(4,t)}catch(c){Ee(t,n,c)}break;case 1:var a=t.stateNode;if(typeof a.componentDidMount=="function"){var s=t.return;try{a.componentDidMount()}catch(c){Ee(t,s,c)}}var i=t.return;try{il(t)}catch(c){Ee(t,i,c)}break;case 5:var o=t.return;try{il(t)}catch(c){Ee(t,o,c)}}}catch(c){Ee(t,t.return,c)}if(t===e){M=null;break}var l=t.sibling;if(l!==null){l.return=t.return,M=l;break}M=t.return}}var Ox=Math.ceil,Qs=pn.ReactCurrentDispatcher,mc=pn.ReactCurrentOwner,kt=pn.ReactCurrentBatchConfig,X=0,Fe=null,ze=null,Ue=0,ut=0,Sr=$n(0),Ae=0,Pa=null,ar=0,bi=0,gc=0,ma=null,rt=null,xc=0,Or=1/0,Gt=null,Xs=!1,cl=null,zn=null,xs=!1,jn=null,Zs=0,ga=0,dl=null,zs=-1,Ts=0;function Ze(){return X&6?_e():zs!==-1?zs:zs=_e()}function Tn(e){return e.mode&1?X&2&&Ue!==0?Ue&-Ue:kx.transition!==null?(Ts===0&&(Ts=Pp()),Ts):(e=le,e!==0||(e=window.event,e=e===void 0?16:Op(e.type)),e):1}function Mt(e,t,n,a){if(50<ga)throw ga=0,dl=null,Error(z(185));Ha(e,n,a),(!(X&2)||e!==Fe)&&(e===Fe&&(!(X&2)&&(bi|=n),Ae===4&&yn(e,Ue)),ot(e,a),n===1&&X===0&&!(t.mode&1)&&(Or=_e()+500,gi&&On()))}function ot(e,t){var n=e.callbackNode;kg(e,t);var a=Rs(e,e===Fe?Ue:0);if(a===0)n!==null&&ld(n),e.callbackNode=null,e.callbackPriority=0;else if(t=a&-a,e.callbackPriority!==t){if(n!=null&&ld(n),t===1)e.tag===0?wx(eu.bind(null,e)):sf(eu.bind(null,e)),vx(function(){!(X&6)&&On()}),n=null;else{switch(Ap(a)){case 1:n=Ul;break;case 4:n=Dp;break;case 16:n=Ms;break;case 536870912:n=Ip;break;default:n=Ms}n=ah(n,Qf.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Qf(e,t){if(zs=-1,Ts=0,X&6)throw Error(z(327));var n=e.callbackNode;if(Dr()&&e.callbackNode!==n)return null;var a=Rs(e,e===Fe?Ue:0);if(a===0)return null;if(a&30||a&e.expiredLanes||t)t=ei(e,a);else{t=a;var s=X;X|=2;var i=Zf();(Fe!==e||Ue!==t)&&(Gt=null,Or=_e()+500,Qn(e,t));do try{Ux();break}catch(l){Xf(e,l)}while(!0);nc(),Qs.current=i,X=s,ze!==null?t=0:(Fe=null,Ue=0,t=Ae)}if(t!==0){if(t===2&&(s=Lo(e),s!==0&&(a=s,t=ul(e,s))),t===1)throw n=Pa,Qn(e,0),yn(e,a),ot(e,_e()),n;if(t===6)yn(e,a);else{if(s=e.current.alternate,!(a&30)&&!Bx(s)&&(t=ei(e,a),t===2&&(i=Lo(e),i!==0&&(a=i,t=ul(e,i))),t===1))throw n=Pa,Qn(e,0),yn(e,a),ot(e,_e()),n;switch(e.finishedWork=s,e.finishedLanes=a,t){case 0:case 1:throw Error(z(345));case 2:Un(e,rt,Gt);break;case 3:if(yn(e,a),(a&130023424)===a&&(t=xc+500-_e(),10<t)){if(Rs(e,0)!==0)break;if(s=e.suspendedLanes,(s&a)!==a){Ze(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=Vo(Un.bind(null,e,rt,Gt),t);break}Un(e,rt,Gt);break;case 4:if(yn(e,a),(a&4194240)===a)break;for(t=e.eventTimes,s=-1;0<a;){var o=31-At(a);i=1<<o,o=t[o],o>s&&(s=o),a&=~i}if(a=s,a=_e()-a,a=(120>a?120:480>a?480:1080>a?1080:1920>a?1920:3e3>a?3e3:4320>a?4320:1960*Ox(a/1960))-a,10<a){e.timeoutHandle=Vo(Un.bind(null,e,rt,Gt),a);break}Un(e,rt,Gt);break;case 5:Un(e,rt,Gt);break;default:throw Error(z(329))}}}return ot(e,_e()),e.callbackNode===n?Qf.bind(null,e):null}function ul(e,t){var n=ma;return e.current.memoizedState.isDehydrated&&(Qn(e,t).flags|=256),e=ei(e,t),e!==2&&(t=rt,rt=n,t!==null&&pl(t)),e}function pl(e){rt===null?rt=e:rt.push.apply(rt,e)}function Bx(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var a=0;a<n.length;a++){var s=n[a],i=s.getSnapshot;s=s.value;try{if(!Rt(i(),s))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function yn(e,t){for(t&=~gc,t&=~bi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-At(t),a=1<<n;e[n]=-1,t&=~a}}function eu(e){if(X&6)throw Error(z(327));Dr();var t=Rs(e,0);if(!(t&1))return ot(e,_e()),null;var n=ei(e,t);if(e.tag!==0&&n===2){var a=Lo(e);a!==0&&(t=a,n=ul(e,a))}if(n===1)throw n=Pa,Qn(e,0),yn(e,t),ot(e,_e()),n;if(n===6)throw Error(z(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Un(e,rt,Gt),ot(e,_e()),null}function vc(e,t){var n=X;X|=1;try{return e(t)}finally{X=n,X===0&&(Or=_e()+500,gi&&On())}}function sr(e){jn!==null&&jn.tag===0&&!(X&6)&&Dr();var t=X;X|=1;var n=kt.transition,a=le;try{if(kt.transition=null,le=1,e)return e()}finally{le=a,kt.transition=n,X=t,!(X&6)&&On()}}function yc(){ut=Sr.current,ve(Sr)}function Qn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,xx(n)),ze!==null)for(n=ze.return;n!==null;){var a=n;switch(Zl(a),a.tag){case 1:a=a.type.childContextTypes,a!=null&&Bs();break;case 3:Fr(),ve(st),ve(Qe),lc();break;case 5:oc(a);break;case 4:Fr();break;case 13:ve(we);break;case 19:ve(we);break;case 10:rc(a.type._context);break;case 22:case 23:yc()}n=n.return}if(Fe=e,ze=e=Dn(e.current,null),Ue=ut=t,Ae=0,Pa=null,gc=bi=ar=0,rt=ma=null,qn!==null){for(t=0;t<qn.length;t++)if(n=qn[t],a=n.interleaved,a!==null){n.interleaved=null;var s=a.next,i=n.pending;if(i!==null){var o=i.next;i.next=s,a.next=o}n.pending=a}qn=null}return e}function Xf(e,t){do{var n=ze;try{if(nc(),Cs.current=Js,Gs){for(var a=ke.memoizedState;a!==null;){var s=a.queue;s!==null&&(s.pending=null),a=a.next}Gs=!1}if(rr=0,Le=Pe=ke=null,fa=!1,Ta=0,mc.current=null,n===null||n.return===null){Ae=1,Pa=t,ze=null;break}e:{var i=e,o=n.return,l=n,c=t;if(t=Ue,l.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var d=c,m=l,f=m.tag;if(!(m.mode&1)&&(f===0||f===11||f===15)){var x=m.alternate;x?(m.updateQueue=x.updateQueue,m.memoizedState=x.memoizedState,m.lanes=x.lanes):(m.updateQueue=null,m.memoizedState=null)}var b=Bd(o);if(b!==null){b.flags&=-257,Wd(b,o,l,i,t),b.mode&1&&Od(i,d,t),t=b,c=d;var w=t.updateQueue;if(w===null){var k=new Set;k.add(c),t.updateQueue=k}else w.add(c);break e}else{if(!(t&1)){Od(i,d,t),bc();break e}c=Error(z(426))}}else if(be&&l.mode&1){var N=Bd(o);if(N!==null){!(N.flags&65536)&&(N.flags|=256),Wd(N,o,l,i,t),ec($r(c,l));break e}}i=c=$r(c,l),Ae!==4&&(Ae=2),ma===null?ma=[i]:ma.push(i),i=o;do{switch(i.tag){case 3:i.flags|=65536,t&=-t,i.lanes|=t;var g=Mf(i,c,t);Ad(i,g);break e;case 1:l=c;var u=i.type,h=i.stateNode;if(!(i.flags&128)&&(typeof u.getDerivedStateFromError=="function"||h!==null&&typeof h.componentDidCatch=="function"&&(zn===null||!zn.has(h)))){i.flags|=65536,t&=-t,i.lanes|=t;var y=Rf(i,l,t);Ad(i,y);break e}}i=i.return}while(i!==null)}th(n)}catch(S){t=S,ze===n&&n!==null&&(ze=n=n.return);continue}break}while(!0)}function Zf(){var e=Qs.current;return Qs.current=Js,e===null?Js:e}function bc(){(Ae===0||Ae===3||Ae===2)&&(Ae=4),Fe===null||!(ar&268435455)&&!(bi&268435455)||yn(Fe,Ue)}function ei(e,t){var n=X;X|=2;var a=Zf();(Fe!==e||Ue!==t)&&(Gt=null,Qn(e,t));do try{Wx();break}catch(s){Xf(e,s)}while(!0);if(nc(),X=n,Qs.current=a,ze!==null)throw Error(z(261));return Fe=null,Ue=0,Ae}function Wx(){for(;ze!==null;)eh(ze)}function Ux(){for(;ze!==null&&!hg();)eh(ze)}function eh(e){var t=rh(e.alternate,e,ut);e.memoizedProps=e.pendingProps,t===null?th(e):ze=t,mc.current=null}function th(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Rx(n,t),n!==null){n.flags&=32767,ze=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ae=6,ze=null;return}}else if(n=Mx(n,t,ut),n!==null){ze=n;return}if(t=t.sibling,t!==null){ze=t;return}ze=t=e}while(t!==null);Ae===0&&(Ae=5)}function Un(e,t,n){var a=le,s=kt.transition;try{kt.transition=null,le=1,Hx(e,t,n,a)}finally{kt.transition=s,le=a}return null}function Hx(e,t,n,a){do Dr();while(jn!==null);if(X&6)throw Error(z(327));n=e.finishedWork;var s=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(z(177));e.callbackNode=null,e.callbackPriority=0;var i=n.lanes|n.childLanes;if(Ng(e,i),e===Fe&&(ze=Fe=null,Ue=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||xs||(xs=!0,ah(Ms,function(){return Dr(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=kt.transition,kt.transition=null;var o=le;le=1;var l=X;X|=4,mc.current=null,Fx(e,n),Gf(n,e),dx(Uo),Ls=!!Wo,Uo=Wo=null,e.current=n,$x(n),mg(),X=l,le=o,kt.transition=i}else e.current=n;if(xs&&(xs=!1,jn=e,Zs=s),i=e.pendingLanes,i===0&&(zn=null),vg(n.stateNode),ot(e,_e()),t!==null)for(a=e.onRecoverableError,n=0;n<t.length;n++)s=t[n],a(s.value,{componentStack:s.stack,digest:s.digest});if(Xs)throw Xs=!1,e=cl,cl=null,e;return Zs&1&&e.tag!==0&&Dr(),i=e.pendingLanes,i&1?e===dl?ga++:(ga=0,dl=e):ga=0,On(),null}function Dr(){if(jn!==null){var e=Ap(Zs),t=kt.transition,n=le;try{if(kt.transition=null,le=16>e?16:e,jn===null)var a=!1;else{if(e=jn,jn=null,Zs=0,X&6)throw Error(z(331));var s=X;for(X|=4,M=e.current;M!==null;){var i=M,o=i.child;if(M.flags&16){var l=i.deletions;if(l!==null){for(var c=0;c<l.length;c++){var d=l[c];for(M=d;M!==null;){var m=M;switch(m.tag){case 0:case 11:case 15:ha(8,m,i)}var f=m.child;if(f!==null)f.return=m,M=f;else for(;M!==null;){m=M;var x=m.sibling,b=m.return;if(qf(m),m===d){M=null;break}if(x!==null){x.return=b,M=x;break}M=b}}}var w=i.alternate;if(w!==null){var k=w.child;if(k!==null){w.child=null;do{var N=k.sibling;k.sibling=null,k=N}while(k!==null)}}M=i}}if(i.subtreeFlags&2064&&o!==null)o.return=i,M=o;else e:for(;M!==null;){if(i=M,i.flags&2048)switch(i.tag){case 0:case 11:case 15:ha(9,i,i.return)}var g=i.sibling;if(g!==null){g.return=i.return,M=g;break e}M=i.return}}var u=e.current;for(M=u;M!==null;){o=M;var h=o.child;if(o.subtreeFlags&2064&&h!==null)h.return=o,M=h;else e:for(o=u;M!==null;){if(l=M,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:yi(9,l)}}catch(S){Ee(l,l.return,S)}if(l===o){M=null;break e}var y=l.sibling;if(y!==null){y.return=l.return,M=y;break e}M=l.return}}if(X=s,On(),Ut&&typeof Ut.onPostCommitFiberRoot=="function")try{Ut.onPostCommitFiberRoot(ui,e)}catch{}a=!0}return a}finally{le=n,kt.transition=t}}return!1}function tu(e,t,n){t=$r(n,t),t=Mf(e,t,1),e=_n(e,t,1),t=Ze(),e!==null&&(Ha(e,1,t),ot(e,t))}function Ee(e,t,n){if(e.tag===3)tu(e,e,n);else for(;t!==null;){if(t.tag===3){tu(t,e,n);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(zn===null||!zn.has(a))){e=$r(n,e),e=Rf(t,e,1),t=_n(t,e,1),e=Ze(),t!==null&&(Ha(t,1,e),ot(t,e));break}}t=t.return}}function Vx(e,t,n){var a=e.pingCache;a!==null&&a.delete(t),t=Ze(),e.pingedLanes|=e.suspendedLanes&n,Fe===e&&(Ue&n)===n&&(Ae===4||Ae===3&&(Ue&130023424)===Ue&&500>_e()-xc?Qn(e,0):gc|=n),ot(e,t)}function nh(e,t){t===0&&(e.mode&1?(t=os,os<<=1,!(os&130023424)&&(os=4194304)):t=1);var n=Ze();e=cn(e,t),e!==null&&(Ha(e,t,n),ot(e,n))}function qx(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),nh(e,n)}function Yx(e,t){var n=0;switch(e.tag){case 13:var a=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:a=e.stateNode;break;default:throw Error(z(314))}a!==null&&a.delete(t),nh(e,n)}var rh;rh=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||st.current)at=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return at=!1,Ax(e,t,n);at=!!(e.flags&131072)}else at=!1,be&&t.flags&1048576&&of(t,Hs,t.index);switch(t.lanes=0,t.tag){case 2:var a=t.type;_s(e,t),e=t.pendingProps;var s=Mr(t,Qe.current);Tr(t,n),s=dc(null,t,a,e,s,n);var i=uc();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,it(a)?(i=!0,Ws(t)):i=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,sc(t),s.updater=vi,t.stateNode=s,s._reactInternals=t,Xo(t,a,e,n),t=tl(null,t,a,!0,i,n)):(t.tag=0,be&&i&&Xl(t),Xe(null,t,s,n),t=t.child),t;case 16:a=t.elementType;e:{switch(_s(e,t),e=t.pendingProps,s=a._init,a=s(a._payload),t.type=a,s=t.tag=Gx(a),e=zt(a,e),s){case 0:t=el(null,t,a,e,n);break e;case 1:t=Vd(null,t,a,e,n);break e;case 11:t=Ud(null,t,a,e,n);break e;case 14:t=Hd(null,t,a,zt(a.type,e),n);break e}throw Error(z(306,a,""))}return t;case 0:return a=t.type,s=t.pendingProps,s=t.elementType===a?s:zt(a,s),el(e,t,a,s,n);case 1:return a=t.type,s=t.pendingProps,s=t.elementType===a?s:zt(a,s),Vd(e,t,a,s,n);case 3:e:{if(Of(t),e===null)throw Error(z(387));a=t.pendingProps,i=t.memoizedState,s=i.element,ff(e,t),Ys(t,a,null,n);var o=t.memoizedState;if(a=o.element,i.isDehydrated)if(i={element:a,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){s=$r(Error(z(423)),t),t=qd(e,t,a,n,s);break e}else if(a!==s){s=$r(Error(z(424)),t),t=qd(e,t,a,n,s);break e}else for(ft=En(t.stateNode.containerInfo.firstChild),mt=t,be=!0,It=null,n=uf(t,null,a,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Rr(),a===s){t=dn(e,t,n);break e}Xe(e,t,a,n)}t=t.child}return t;case 5:return hf(t),e===null&&Go(t),a=t.type,s=t.pendingProps,i=e!==null?e.memoizedProps:null,o=s.children,Ho(a,s)?o=null:i!==null&&Ho(a,i)&&(t.flags|=32),$f(e,t),Xe(e,t,o,n),t.child;case 6:return e===null&&Go(t),null;case 13:return Bf(e,t,n);case 4:return ic(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=Lr(t,null,a,n):Xe(e,t,a,n),t.child;case 11:return a=t.type,s=t.pendingProps,s=t.elementType===a?s:zt(a,s),Ud(e,t,a,s,n);case 7:return Xe(e,t,t.pendingProps,n),t.child;case 8:return Xe(e,t,t.pendingProps.children,n),t.child;case 12:return Xe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(a=t.type._context,s=t.pendingProps,i=t.memoizedProps,o=s.value,fe(Vs,a._currentValue),a._currentValue=o,i!==null)if(Rt(i.value,o)){if(i.children===s.children&&!st.current){t=dn(e,t,n);break e}}else for(i=t.child,i!==null&&(i.return=t);i!==null;){var l=i.dependencies;if(l!==null){o=i.child;for(var c=l.firstContext;c!==null;){if(c.context===a){if(i.tag===1){c=rn(-1,n&-n),c.tag=2;var d=i.updateQueue;if(d!==null){d=d.shared;var m=d.pending;m===null?c.next=c:(c.next=m.next,m.next=c),d.pending=c}}i.lanes|=n,c=i.alternate,c!==null&&(c.lanes|=n),Jo(i.return,n,t),l.lanes|=n;break}c=c.next}}else if(i.tag===10)o=i.type===t.type?null:i.child;else if(i.tag===18){if(o=i.return,o===null)throw Error(z(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),Jo(o,n,t),o=i.sibling}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===t){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}Xe(e,t,s.children,n),t=t.child}return t;case 9:return s=t.type,a=t.pendingProps.children,Tr(t,n),s=Nt(s),a=a(s),t.flags|=1,Xe(e,t,a,n),t.child;case 14:return a=t.type,s=zt(a,t.pendingProps),s=zt(a.type,s),Hd(e,t,a,s,n);case 15:return Lf(e,t,t.type,t.pendingProps,n);case 17:return a=t.type,s=t.pendingProps,s=t.elementType===a?s:zt(a,s),_s(e,t),t.tag=1,it(a)?(e=!0,Ws(t)):e=!1,Tr(t,n),Af(t,a,s),Xo(t,a,s,n),tl(null,t,a,!0,e,n);case 19:return Wf(e,t,n);case 22:return Ff(e,t,n)}throw Error(z(156,t.tag))};function ah(e,t){return Tp(e,t)}function Kx(e,t,n,a){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function wt(e,t,n,a){return new Kx(e,t,n,a)}function jc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Gx(e){if(typeof e=="function")return jc(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Ol)return 11;if(e===Bl)return 14}return 2}function Dn(e,t){var n=e.alternate;return n===null?(n=wt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Ds(e,t,n,a,s,i){var o=2;if(a=e,typeof e=="function")jc(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case mr:return Xn(n.children,s,i,t);case $l:o=8,s|=8;break;case wo:return e=wt(12,n,t,s|2),e.elementType=wo,e.lanes=i,e;case ko:return e=wt(13,n,t,s),e.elementType=ko,e.lanes=i,e;case No:return e=wt(19,n,t,s),e.elementType=No,e.lanes=i,e;case fp:return ji(n,s,i,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case up:o=10;break e;case pp:o=9;break e;case Ol:o=11;break e;case Bl:o=14;break e;case gn:o=16,a=null;break e}throw Error(z(130,e==null?e:typeof e,""))}return t=wt(o,n,t,s),t.elementType=e,t.type=a,t.lanes=i,t}function Xn(e,t,n,a){return e=wt(7,e,a,t),e.lanes=n,e}function ji(e,t,n,a){return e=wt(22,e,a,t),e.elementType=fp,e.lanes=n,e.stateNode={isHidden:!1},e}function ro(e,t,n){return e=wt(6,e,null,t),e.lanes=n,e}function ao(e,t,n){return t=wt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Jx(e,t,n,a,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Fi(0),this.expirationTimes=Fi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Fi(0),this.identifierPrefix=a,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function wc(e,t,n,a,s,i,o,l,c){return e=new Jx(e,t,n,l,c),t===1?(t=1,i===!0&&(t|=8)):t=0,i=wt(3,null,null,t),e.current=i,i.stateNode=e,i.memoizedState={element:a,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},sc(i),e}function Qx(e,t,n){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:hr,key:a==null?null:""+a,children:e,containerInfo:t,implementation:n}}function sh(e){if(!e)return Rn;e=e._reactInternals;e:{if(ur(e)!==e||e.tag!==1)throw Error(z(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(it(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(z(171))}if(e.tag===1){var n=e.type;if(it(n))return af(e,n,t)}return t}function ih(e,t,n,a,s,i,o,l,c){return e=wc(n,a,!0,e,s,i,o,l,c),e.context=sh(null),n=e.current,a=Ze(),s=Tn(n),i=rn(a,s),i.callback=t??null,_n(n,i,s),e.current.lanes=s,Ha(e,s,a),ot(e,a),e}function wi(e,t,n,a){var s=t.current,i=Ze(),o=Tn(s);return n=sh(n),t.context===null?t.context=n:t.pendingContext=n,t=rn(i,o),t.payload={element:e},a=a===void 0?null:a,a!==null&&(t.callback=a),e=_n(s,t,o),e!==null&&(Mt(e,s,o,i),Ss(e,s,o)),o}function ti(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function nu(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function kc(e,t){nu(e,t),(e=e.alternate)&&nu(e,t)}function Xx(){return null}var oh=typeof reportError=="function"?reportError:function(e){console.error(e)};function Nc(e){this._internalRoot=e}ki.prototype.render=Nc.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(z(409));wi(e,t,null,null)};ki.prototype.unmount=Nc.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;sr(function(){wi(null,e,null,null)}),t[ln]=null}};function ki(e){this._internalRoot=e}ki.prototype.unstable_scheduleHydration=function(e){if(e){var t=Lp();e={blockedOn:null,target:e,priority:t};for(var n=0;n<vn.length&&t!==0&&t<vn[n].priority;n++);vn.splice(n,0,e),n===0&&$p(e)}};function Sc(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ni(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function ru(){}function Zx(e,t,n,a,s){if(s){if(typeof a=="function"){var i=a;a=function(){var d=ti(o);i.call(d)}}var o=ih(t,a,e,0,null,!1,!1,"",ru);return e._reactRootContainer=o,e[ln]=o.current,Sa(e.nodeType===8?e.parentNode:e),sr(),o}for(;s=e.lastChild;)e.removeChild(s);if(typeof a=="function"){var l=a;a=function(){var d=ti(c);l.call(d)}}var c=wc(e,0,!1,null,null,!1,!1,"",ru);return e._reactRootContainer=c,e[ln]=c.current,Sa(e.nodeType===8?e.parentNode:e),sr(function(){wi(t,c,n,a)}),c}function Si(e,t,n,a,s){var i=n._reactRootContainer;if(i){var o=i;if(typeof s=="function"){var l=s;s=function(){var c=ti(o);l.call(c)}}wi(t,o,e,s)}else o=Zx(n,t,e,s,a);return ti(o)}Mp=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=ia(t.pendingLanes);n!==0&&(Hl(t,n|1),ot(t,_e()),!(X&6)&&(Or=_e()+500,On()))}break;case 13:sr(function(){var a=cn(e,1);if(a!==null){var s=Ze();Mt(a,e,1,s)}}),kc(e,1)}};Vl=function(e){if(e.tag===13){var t=cn(e,134217728);if(t!==null){var n=Ze();Mt(t,e,134217728,n)}kc(e,134217728)}};Rp=function(e){if(e.tag===13){var t=Tn(e),n=cn(e,t);if(n!==null){var a=Ze();Mt(n,e,t,a)}kc(e,t)}};Lp=function(){return le};Fp=function(e,t){var n=le;try{return le=e,t()}finally{le=n}};Ao=function(e,t,n){switch(t){case"input":if(Eo(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var a=n[t];if(a!==e&&a.form===e.form){var s=mi(a);if(!s)throw Error(z(90));mp(a),Eo(a,s)}}}break;case"textarea":xp(e,n);break;case"select":t=n.value,t!=null&&Cr(e,!!n.multiple,t,!1)}};Np=vc;Sp=sr;var ev={usingClientEntryPoint:!1,Events:[qa,yr,mi,wp,kp,vc]},ra={findFiberByHostInstance:Vn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},tv={bundleType:ra.bundleType,version:ra.version,rendererPackageName:ra.rendererPackageName,rendererConfig:ra.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:pn.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=_p(e),e===null?null:e.stateNode},findFiberByHostInstance:ra.findFiberByHostInstance||Xx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var vs=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vs.isDisabled&&vs.supportsFiber)try{ui=vs.inject(tv),Ut=vs}catch{}}xt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ev;xt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Sc(t))throw Error(z(200));return Qx(e,t,null,n)};xt.createRoot=function(e,t){if(!Sc(e))throw Error(z(299));var n=!1,a="",s=oh;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=wc(e,1,!1,null,null,n,!1,a,s),e[ln]=t.current,Sa(e.nodeType===8?e.parentNode:e),new Nc(t)};xt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(z(188)):(e=Object.keys(e).join(","),Error(z(268,e)));return e=_p(t),e=e===null?null:e.stateNode,e};xt.flushSync=function(e){return sr(e)};xt.hydrate=function(e,t,n){if(!Ni(t))throw Error(z(200));return Si(null,e,t,!0,n)};xt.hydrateRoot=function(e,t,n){if(!Sc(e))throw Error(z(405));var a=n!=null&&n.hydratedSources||null,s=!1,i="",o=oh;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=ih(t,null,e,1,n??null,s,!1,i,o),e[ln]=t.current,Sa(e),a)for(e=0;e<a.length;e++)n=a[e],s=n._getVersion,s=s(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,s]:t.mutableSourceEagerHydrationData.push(n,s);return new ki(t)};xt.render=function(e,t,n){if(!Ni(t))throw Error(z(200));return Si(null,e,t,!1,n)};xt.unmountComponentAtNode=function(e){if(!Ni(e))throw Error(z(40));return e._reactRootContainer?(sr(function(){Si(null,null,e,!1,function(){e._reactRootContainer=null,e[ln]=null})}),!0):!1};xt.unstable_batchedUpdates=vc;xt.unstable_renderSubtreeIntoContainer=function(e,t,n,a){if(!Ni(n))throw Error(z(200));if(e==null||e._reactInternals===void 0)throw Error(z(38));return Si(e,t,n,!1,a)};xt.version="18.3.1-next-f1338f8080-20240426";function lh(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(lh)}catch(e){console.error(e)}}lh(),op.exports=xt;var nv=op.exports,au=nv;bo.createRoot=au.createRoot,bo.hydrateRoot=au.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Aa(){return Aa=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},Aa.apply(this,arguments)}var wn;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(wn||(wn={}));const su="popstate";function rv(e){e===void 0&&(e={});function t(a,s){let{pathname:i,search:o,hash:l}=a.location;return fl("",{pathname:i,search:o,hash:l},s.state&&s.state.usr||null,s.state&&s.state.key||"default")}function n(a,s){return typeof s=="string"?s:ch(s)}return sv(t,n,null,e)}function Te(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function Cc(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function av(){return Math.random().toString(36).substr(2,8)}function iu(e,t){return{usr:e.state,key:e.key,idx:t}}function fl(e,t,n,a){return n===void 0&&(n=null),Aa({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?Yr(t):t,{state:n,key:t&&t.key||a||av()})}function ch(e){let{pathname:t="/",search:n="",hash:a=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),a&&a!=="#"&&(t+=a.charAt(0)==="#"?a:"#"+a),t}function Yr(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let a=e.indexOf("?");a>=0&&(t.search=e.substr(a),e=e.substr(0,a)),e&&(t.pathname=e)}return t}function sv(e,t,n,a){a===void 0&&(a={});let{window:s=document.defaultView,v5Compat:i=!1}=a,o=s.history,l=wn.Pop,c=null,d=m();d==null&&(d=0,o.replaceState(Aa({},o.state,{idx:d}),""));function m(){return(o.state||{idx:null}).idx}function f(){l=wn.Pop;let N=m(),g=N==null?null:N-d;d=N,c&&c({action:l,location:k.location,delta:g})}function x(N,g){l=wn.Push;let u=fl(k.location,N,g);d=m()+1;let h=iu(u,d),y=k.createHref(u);try{o.pushState(h,"",y)}catch(S){if(S instanceof DOMException&&S.name==="DataCloneError")throw S;s.location.assign(y)}i&&c&&c({action:l,location:k.location,delta:1})}function b(N,g){l=wn.Replace;let u=fl(k.location,N,g);d=m();let h=iu(u,d),y=k.createHref(u);o.replaceState(h,"",y),i&&c&&c({action:l,location:k.location,delta:0})}function w(N){let g=s.location.origin!=="null"?s.location.origin:s.location.href,u=typeof N=="string"?N:ch(N);return u=u.replace(/ $/,"%20"),Te(g,"No window.location.(origin|href) available to create URL for href: "+u),new URL(u,g)}let k={get action(){return l},get location(){return e(s,o)},listen(N){if(c)throw new Error("A history only accepts one active listener");return s.addEventListener(su,f),c=N,()=>{s.removeEventListener(su,f),c=null}},createHref(N){return t(s,N)},createURL:w,encodeLocation(N){let g=w(N);return{pathname:g.pathname,search:g.search,hash:g.hash}},push:x,replace:b,go(N){return o.go(N)}};return k}var ou;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(ou||(ou={}));function iv(e,t,n){return n===void 0&&(n="/"),ov(e,t,n)}function ov(e,t,n,a){let s=typeof t=="string"?Yr(t):t,i=ph(s.pathname||"/",n);if(i==null)return null;let o=dh(e);lv(o);let l=null;for(let c=0;l==null&&c<o.length;++c){let d=bv(i);l=xv(o[c],d)}return l}function dh(e,t,n,a){t===void 0&&(t=[]),n===void 0&&(n=[]),a===void 0&&(a="");let s=(i,o,l)=>{let c={relativePath:l===void 0?i.path||"":l,caseSensitive:i.caseSensitive===!0,childrenIndex:o,route:i};c.relativePath.startsWith("/")&&(Te(c.relativePath.startsWith(a),'Absolute route path "'+c.relativePath+'" nested under path '+('"'+a+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),c.relativePath=c.relativePath.slice(a.length));let d=Zn([a,c.relativePath]),m=n.concat(c);i.children&&i.children.length>0&&(Te(i.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+d+'".')),dh(i.children,t,m,d)),!(i.path==null&&!i.index)&&t.push({path:d,score:mv(d,i.index),routesMeta:m})};return e.forEach((i,o)=>{var l;if(i.path===""||!((l=i.path)!=null&&l.includes("?")))s(i,o);else for(let c of uh(i.path))s(i,o,c)}),t}function uh(e){let t=e.split("/");if(t.length===0)return[];let[n,...a]=t,s=n.endsWith("?"),i=n.replace(/\?$/,"");if(a.length===0)return s?[i,""]:[i];let o=uh(a.join("/")),l=[];return l.push(...o.map(c=>c===""?i:[i,c].join("/"))),s&&l.push(...o),l.map(c=>e.startsWith("/")&&c===""?"/":c)}function lv(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:gv(t.routesMeta.map(a=>a.childrenIndex),n.routesMeta.map(a=>a.childrenIndex)))}const cv=/^:[\w-]+$/,dv=3,uv=2,pv=1,fv=10,hv=-2,lu=e=>e==="*";function mv(e,t){let n=e.split("/"),a=n.length;return n.some(lu)&&(a+=hv),t&&(a+=uv),n.filter(s=>!lu(s)).reduce((s,i)=>s+(cv.test(i)?dv:i===""?pv:fv),a)}function gv(e,t){return e.length===t.length&&e.slice(0,-1).every((a,s)=>a===t[s])?e[e.length-1]-t[t.length-1]:0}function xv(e,t,n){let{routesMeta:a}=e,s={},i="/",o=[];for(let l=0;l<a.length;++l){let c=a[l],d=l===a.length-1,m=i==="/"?t:t.slice(i.length)||"/",f=vv({path:c.relativePath,caseSensitive:c.caseSensitive,end:d},m),x=c.route;if(!f)return null;Object.assign(s,f.params),o.push({params:s,pathname:Zn([i,f.pathname]),pathnameBase:Sv(Zn([i,f.pathnameBase])),route:x}),f.pathnameBase!=="/"&&(i=Zn([i,f.pathnameBase]))}return o}function vv(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,a]=yv(e.path,e.caseSensitive,e.end),s=t.match(n);if(!s)return null;let i=s[0],o=i.replace(/(.)\/+$/,"$1"),l=s.slice(1);return{params:a.reduce((d,m,f)=>{let{paramName:x,isOptional:b}=m;if(x==="*"){let k=l[f]||"";o=i.slice(0,i.length-k.length).replace(/(.)\/+$/,"$1")}const w=l[f];return b&&!w?d[x]=void 0:d[x]=(w||"").replace(/%2F/g,"/"),d},{}),pathname:i,pathnameBase:o,pattern:e}}function yv(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),Cc(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let a=[],s="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,l,c)=>(a.push({paramName:l,isOptional:c!=null}),c?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(a.push({paramName:"*"}),s+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?s+="\\/*$":e!==""&&e!=="/"&&(s+="(?:(?=\\/|$))"),[new RegExp(s,t?void 0:"i"),a]}function bv(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return Cc(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function ph(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,a=e.charAt(n);return a&&a!=="/"?null:e.slice(n)||"/"}const jv=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,wv=e=>jv.test(e);function kv(e,t){t===void 0&&(t="/");let{pathname:n,search:a="",hash:s=""}=typeof e=="string"?Yr(e):e,i;if(n)if(wv(n))i=n;else{if(n.includes("//")){let o=n;n=n.replace(/\/\/+/g,"/"),Cc(!1,"Pathnames cannot have embedded double slashes - normalizing "+(o+" -> "+n))}n.startsWith("/")?i=cu(n.substring(1),"/"):i=cu(n,t)}else i=t;return{pathname:i,search:Cv(a),hash:Ev(s)}}function cu(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(s=>{s===".."?n.length>1&&n.pop():s!=="."&&n.push(s)}),n.length>1?n.join("/"):"/"}function so(e,t,n,a){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(a)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function Nv(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function fh(e,t){let n=Nv(e);return t?n.map((a,s)=>s===n.length-1?a.pathname:a.pathnameBase):n.map(a=>a.pathnameBase)}function hh(e,t,n,a){a===void 0&&(a=!1);let s;typeof e=="string"?s=Yr(e):(s=Aa({},e),Te(!s.pathname||!s.pathname.includes("?"),so("?","pathname","search",s)),Te(!s.pathname||!s.pathname.includes("#"),so("#","pathname","hash",s)),Te(!s.search||!s.search.includes("#"),so("#","search","hash",s)));let i=e===""||s.pathname==="",o=i?"/":s.pathname,l;if(o==null)l=n;else{let f=t.length-1;if(!a&&o.startsWith("..")){let x=o.split("/");for(;x[0]==="..";)x.shift(),f-=1;s.pathname=x.join("/")}l=f>=0?t[f]:"/"}let c=kv(s,l),d=o&&o!=="/"&&o.endsWith("/"),m=(i||o===".")&&n.endsWith("/");return!c.pathname.endsWith("/")&&(d||m)&&(c.pathname+="/"),c}const Zn=e=>e.join("/").replace(/\/\/+/g,"/"),Sv=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Cv=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Ev=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function _v(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const mh=["post","put","patch","delete"];new Set(mh);const zv=["get",...mh];new Set(zv);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Ma(){return Ma=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},Ma.apply(this,arguments)}const Ec=p.createContext(null),Tv=p.createContext(null),Ka=p.createContext(null),Ci=p.createContext(null),Bn=p.createContext({outlet:null,matches:[],isDataRoute:!1}),gh=p.createContext(null);function Ga(){return p.useContext(Ci)!=null}function Ja(){return Ga()||Te(!1),p.useContext(Ci).location}function xh(e){p.useContext(Ka).static||p.useLayoutEffect(e)}function lt(){let{isDataRoute:e}=p.useContext(Bn);return e?Hv():Dv()}function Dv(){Ga()||Te(!1);let e=p.useContext(Ec),{basename:t,future:n,navigator:a}=p.useContext(Ka),{matches:s}=p.useContext(Bn),{pathname:i}=Ja(),o=JSON.stringify(fh(s,n.v7_relativeSplatPath)),l=p.useRef(!1);return xh(()=>{l.current=!0}),p.useCallback(function(d,m){if(m===void 0&&(m={}),!l.current)return;if(typeof d=="number"){a.go(d);return}let f=hh(d,JSON.parse(o),i,m.relative==="path");e==null&&t!=="/"&&(f.pathname=f.pathname==="/"?t:Zn([t,f.pathname])),(m.replace?a.replace:a.push)(f,m.state,m)},[t,a,o,i,e])}function Iv(){let{matches:e}=p.useContext(Bn),t=e[e.length-1];return t?t.params:{}}function Pv(e,t){return Av(e,t)}function Av(e,t,n,a){Ga()||Te(!1);let{navigator:s}=p.useContext(Ka),{matches:i}=p.useContext(Bn),o=i[i.length-1],l=o?o.params:{};o&&o.pathname;let c=o?o.pathnameBase:"/";o&&o.route;let d=Ja(),m;if(t){var f;let N=typeof t=="string"?Yr(t):t;c==="/"||(f=N.pathname)!=null&&f.startsWith(c)||Te(!1),m=N}else m=d;let x=m.pathname||"/",b=x;if(c!=="/"){let N=c.replace(/^\//,"").split("/");b="/"+x.replace(/^\//,"").split("/").slice(N.length).join("/")}let w=iv(e,{pathname:b}),k=$v(w&&w.map(N=>Object.assign({},N,{params:Object.assign({},l,N.params),pathname:Zn([c,s.encodeLocation?s.encodeLocation(N.pathname).pathname:N.pathname]),pathnameBase:N.pathnameBase==="/"?c:Zn([c,s.encodeLocation?s.encodeLocation(N.pathnameBase).pathname:N.pathnameBase])})),i,n,a);return t&&k?p.createElement(Ci.Provider,{value:{location:Ma({pathname:"/",search:"",hash:"",state:null,key:"default"},m),navigationType:wn.Pop}},k):k}function Mv(){let e=Uv(),t=_v(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,s={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return p.createElement(p.Fragment,null,p.createElement("h2",null,"Unexpected Application Error!"),p.createElement("h3",{style:{fontStyle:"italic"}},t),n?p.createElement("pre",{style:s},n):null,null)}const Rv=p.createElement(Mv,null);class Lv extends p.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?p.createElement(Bn.Provider,{value:this.props.routeContext},p.createElement(gh.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Fv(e){let{routeContext:t,match:n,children:a}=e,s=p.useContext(Ec);return s&&s.static&&s.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(s.staticContext._deepestRenderedBoundaryId=n.route.id),p.createElement(Bn.Provider,{value:t},a)}function $v(e,t,n,a){var s;if(t===void 0&&(t=[]),n===void 0&&(n=null),a===void 0&&(a=null),e==null){var i;if(!n)return null;if(n.errors)e=n.matches;else if((i=a)!=null&&i.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let o=e,l=(s=n)==null?void 0:s.errors;if(l!=null){let m=o.findIndex(f=>f.route.id&&(l==null?void 0:l[f.route.id])!==void 0);m>=0||Te(!1),o=o.slice(0,Math.min(o.length,m+1))}let c=!1,d=-1;if(n&&a&&a.v7_partialHydration)for(let m=0;m<o.length;m++){let f=o[m];if((f.route.HydrateFallback||f.route.hydrateFallbackElement)&&(d=m),f.route.id){let{loaderData:x,errors:b}=n,w=f.route.loader&&x[f.route.id]===void 0&&(!b||b[f.route.id]===void 0);if(f.route.lazy||w){c=!0,d>=0?o=o.slice(0,d+1):o=[o[0]];break}}}return o.reduceRight((m,f,x)=>{let b,w=!1,k=null,N=null;n&&(b=l&&f.route.id?l[f.route.id]:void 0,k=f.route.errorElement||Rv,c&&(d<0&&x===0?(Vv("route-fallback"),w=!0,N=null):d===x&&(w=!0,N=f.route.hydrateFallbackElement||null)));let g=t.concat(o.slice(0,x+1)),u=()=>{let h;return b?h=k:w?h=N:f.route.Component?h=p.createElement(f.route.Component,null):f.route.element?h=f.route.element:h=m,p.createElement(Fv,{match:f,routeContext:{outlet:m,matches:g,isDataRoute:n!=null},children:h})};return n&&(f.route.ErrorBoundary||f.route.errorElement||x===0)?p.createElement(Lv,{location:n.location,revalidation:n.revalidation,component:k,error:b,children:u(),routeContext:{outlet:null,matches:g,isDataRoute:!0}}):u()},null)}var vh=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(vh||{}),yh=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(yh||{});function Ov(e){let t=p.useContext(Ec);return t||Te(!1),t}function Bv(e){let t=p.useContext(Tv);return t||Te(!1),t}function Wv(e){let t=p.useContext(Bn);return t||Te(!1),t}function bh(e){let t=Wv(),n=t.matches[t.matches.length-1];return n.route.id||Te(!1),n.route.id}function Uv(){var e;let t=p.useContext(gh),n=Bv(),a=bh();return t!==void 0?t:(e=n.errors)==null?void 0:e[a]}function Hv(){let{router:e}=Ov(vh.UseNavigateStable),t=bh(yh.UseNavigateStable),n=p.useRef(!1);return xh(()=>{n.current=!0}),p.useCallback(function(s,i){i===void 0&&(i={}),n.current&&(typeof s=="number"?e.navigate(s):e.navigate(s,Ma({fromRouteId:t},i)))},[e,t])}const du={};function Vv(e,t,n){du[e]||(du[e]=!0)}function qv(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function Ir(e){let{to:t,replace:n,state:a,relative:s}=e;Ga()||Te(!1);let{future:i,static:o}=p.useContext(Ka),{matches:l}=p.useContext(Bn),{pathname:c}=Ja(),d=lt(),m=hh(t,fh(l,i.v7_relativeSplatPath),c,s==="path"),f=JSON.stringify(m);return p.useEffect(()=>d(JSON.parse(f),{replace:n,state:a,relative:s}),[d,f,s,n,a]),null}function Kt(e){Te(!1)}function Yv(e){let{basename:t="/",children:n=null,location:a,navigationType:s=wn.Pop,navigator:i,static:o=!1,future:l}=e;Ga()&&Te(!1);let c=t.replace(/^\/*/,"/"),d=p.useMemo(()=>({basename:c,navigator:i,static:o,future:Ma({v7_relativeSplatPath:!1},l)}),[c,l,i,o]);typeof a=="string"&&(a=Yr(a));let{pathname:m="/",search:f="",hash:x="",state:b=null,key:w="default"}=a,k=p.useMemo(()=>{let N=ph(m,c);return N==null?null:{location:{pathname:N,search:f,hash:x,state:b,key:w},navigationType:s}},[c,m,f,x,b,w,s]);return k==null?null:p.createElement(Ka.Provider,{value:d},p.createElement(Ci.Provider,{children:n,value:k}))}function Kv(e){let{children:t,location:n}=e;return Pv(hl(t),n)}new Promise(()=>{});function hl(e,t){t===void 0&&(t=[]);let n=[];return p.Children.forEach(e,(a,s)=>{if(!p.isValidElement(a))return;let i=[...t,s];if(a.type===p.Fragment){n.push.apply(n,hl(a.props.children,i));return}a.type!==Kt&&Te(!1),!a.props.index||!a.props.children||Te(!1);let o={id:a.props.id||i.join("-"),caseSensitive:a.props.caseSensitive,element:a.props.element,Component:a.props.Component,index:a.props.index,path:a.props.path,loader:a.props.loader,action:a.props.action,errorElement:a.props.errorElement,ErrorBoundary:a.props.ErrorBoundary,hasErrorBoundary:a.props.ErrorBoundary!=null||a.props.errorElement!=null,shouldRevalidate:a.props.shouldRevalidate,handle:a.props.handle,lazy:a.props.lazy};a.props.children&&(o.children=hl(a.props.children,i)),n.push(o)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ml(e){return e===void 0&&(e=""),new URLSearchParams(typeof e=="string"||Array.isArray(e)||e instanceof URLSearchParams?e:Object.keys(e).reduce((t,n)=>{let a=e[n];return t.concat(Array.isArray(a)?a.map(s=>[n,s]):[[n,a]])},[]))}function Gv(e,t){let n=ml(e);return t&&t.forEach((a,s)=>{n.has(s)||t.getAll(s).forEach(i=>{n.append(s,i)})}),n}const Jv="6";try{window.__reactRouterVersion=Jv}catch{}const Qv="startTransition",uu=Vm[Qv];function Xv(e){let{basename:t,children:n,future:a,window:s}=e,i=p.useRef();i.current==null&&(i.current=rv({window:s,v5Compat:!0}));let o=i.current,[l,c]=p.useState({action:o.action,location:o.location}),{v7_startTransition:d}=a||{},m=p.useCallback(f=>{d&&uu?uu(()=>c(f)):c(f)},[c,d]);return p.useLayoutEffect(()=>o.listen(m),[o,m]),p.useEffect(()=>qv(a),[a]),p.createElement(Yv,{basename:t,children:n,location:l.location,navigationType:l.action,navigator:o,future:a})}var pu;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(pu||(pu={}));var fu;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(fu||(fu={}));function Zv(e){let t=p.useRef(ml(e)),n=p.useRef(!1),a=Ja(),s=p.useMemo(()=>Gv(a.search,n.current?null:t.current),[a.search]),i=lt(),o=p.useCallback((l,c)=>{const d=ml(typeof l=="function"?l(s):l);n.current=!0,i("?"+d,c)},[i,s]);return[s,o]}const jh="https://cooing-rosanna-rub-3a11fd0e.koyeb.app/api";function gl(e){localStorage.setItem("hb_token",e)}function xl(){localStorage.removeItem("hb_token")}function Ei(){return localStorage.getItem("hb_token")}async function _(e,t={}){const n=Ei(),a={"Content-Type":"application/json",...n?{Authorization:`Bearer ${n}`}:{},...t.headers},s=await fetch(`${jh}${e}`,{...t,headers:a}),i=await s.json();if(!s.ok){const o=new Error((i==null?void 0:i.error)||`Request failed: ${s.status}`);throw o.status=s.status,o.data=i,o}return i}async function vl(e,t,n){const a=Ei(),s={};if(a&&(s.Authorization=`Bearer ${a}`),console.log(`[Multipart] ${e} ${t}`),n instanceof FormData)for(let l of n.entries())l[1]instanceof File?console.log(`   File: ${l[0]} = ${l[1].name} (${l[1].size} bytes)`):console.log(`   Field: ${l[0]} = ${String(l[1]).substring(0,100)}`);const i=await fetch(`${jh}${t}`,{method:e,headers:s,body:n}),o=await i.json();if(!i.ok){console.error(`[Multipart] ${e} ${t} failed:`,o);const l=new Error((o==null?void 0:o.error)||`Request failed: ${i.status}`);throw l.status=i.status,l.data=o,l}return console.log(`[Multipart] ${e} ${t} succeeded`),o}const wh={getById:e=>_(`/users/${e}`)},ht={register:e=>_("/auth/register",{method:"POST",body:JSON.stringify(e)}),login:e=>_("/auth/login",{method:"POST",body:JSON.stringify(e)}),me:()=>_("/auth/me"),updateMe:e=>_("/auth/me",{method:"PATCH",body:JSON.stringify(e)}),getVerificationStatus:()=>_("/auth/verification-status"),checkSession:()=>_("/auth/check-session"),verifyEmail:e=>_("/auth/verify-email",{method:"POST",body:JSON.stringify({token:e})}),verifyCode:e=>_("/auth/verify-code",{method:"POST",body:JSON.stringify(e)}),resendCode:e=>_("/auth/resend-code",{method:"POST",body:JSON.stringify({email:e})}),saveFCMToken:e=>_("/auth/save-fcm-token",{method:"POST",body:JSON.stringify({token:e})})},Pt={getAll:(e={})=>{const t=new URLSearchParams(e).toString();return _(`/campaigns${t?`?${t}`:""}`)},getMy:()=>_("/campaigns/my"),getById:e=>_(`/campaigns/${e}`),getUpdates:e=>_(`/campaigns/${e}/updates`),getRelated:(e,t)=>_(`/campaigns/${e}/related?category=${t}`),getCreator:e=>_(`/users/${e}`),create:e=>{if(!(e instanceof FormData))throw console.error("createCampaign called without FormData:",e),new Error("Invalid form data for campaign creation");return vl("POST","/campaigns",e)},update:(e,t)=>{if(!(t instanceof FormData))throw console.error("updateCampaign called without FormData:",t),new Error("Invalid form data for campaign update");return vl("PATCH",`/campaigns/${e}`,t)},delete:e=>_(`/campaigns/${e}`,{method:"DELETE"}),addUpdate:(e,t)=>_(`/campaigns/${e}/updates`,{method:"POST",body:JSON.stringify(t)})},Dt={getMyDonations:()=>_("/donations/my"),getCampaignDons:e=>_(`/donations/campaign/${e}`),getCreatorPaymentMethod:()=>_("/donations/creator/payment-method"),saveCreatorPaymentMethod:e=>_("/donations/creator/payment-method",{method:"PUT",body:JSON.stringify(e)}),getCreatorWallet:()=>_("/donations/creator/wallet"),getMyPayoutRequests:()=>_("/donations/creator/payout-requests"),requestPayout:e=>_("/donations/creator/request-payout",{method:"POST",body:JSON.stringify(e)}),updateCampaignProgress:(e,t)=>_(`/campaigns/${e}/progress`,{method:"PATCH",body:JSON.stringify(t)})},nt={getBalance:()=>_("/wallet/balance"),getTransactions:()=>_("/wallet/transactions"),getSummary:()=>_("/wallet/summary"),getMyDepositRequests:()=>_("/wallet/deposit-requests"),getDepositRequestById:e=>_(`/wallet/deposit-requests/${e}`),requestDeposit:e=>_("/wallet/deposit-request",{method:"POST",body:JSON.stringify(e)}),uploadProof:(e,t)=>{if(!(t instanceof FormData))throw console.error("uploadProof called without FormData"),new Error("Invalid form data for proof upload");return vl("POST",`/wallet/deposit-request/${e}/proof`,t)},donateFromWallet:e=>_("/wallet/donate",{method:"POST",body:JSON.stringify(e)}),requestWithdrawal:e=>_("/wallet/withdrawal",{method:"POST",body:JSON.stringify(e)}),getMyWithdrawals:()=>_("/wallet/withdrawals")},O={getStats:()=>_("/admin/stats"),getUsers:()=>_("/admin/users"),toggleUser:e=>_(`/admin/users/${e}/toggle`,{method:"PATCH"}),addUser:e=>_("/admin/users",{method:"POST",body:JSON.stringify(e)}),deleteUser:e=>_(`/admin/users/${e}`,{method:"DELETE"}),verifyUser:e=>_(`/admin/users/${e}/verify`,{method:"PATCH"}),unverifyUser:e=>_(`/admin/users/${e}/unverify`,{method:"PATCH"}),addAdmin:e=>_("/admin/admins",{method:"POST",body:JSON.stringify(e)}),changePassword:e=>_("/admin/change-password",{method:"POST",body:JSON.stringify(e)}),getCampaigns:e=>{const t=new URLSearchParams(e||{}).toString();return _(`/admin/campaigns${t?`?${t}`:""}`)},updateCampaign:(e,t)=>_(`/admin/campaigns/${e}/status`,{method:"PATCH",body:JSON.stringify(t)}),getDonations:()=>_("/admin/donations"),getTheme:()=>_("/admin/theme"),saveTheme:e=>_("/admin/theme",{method:"PUT",body:JSON.stringify(e)}),getContent:()=>_("/admin/content"),saveContent:e=>_("/admin/content",{method:"PUT",body:JSON.stringify(e)}),getSettings:()=>_("/admin/settings"),saveSettings:e=>_("/admin/settings",{method:"PUT",body:JSON.stringify(e)}),getVerificationSetting:()=>_("/admin/verification-setting"),updateVerificationSetting:e=>_("/admin/verification-setting",{method:"PUT",body:JSON.stringify(e)}),saveFCMToken:e=>_("/admin/fcm-token",{method:"POST",body:JSON.stringify({token:e})}),saveAdminFCMToken:e=>_("/admin/admin-fcm-token",{method:"POST",body:JSON.stringify({token:e})}),getAdminFCMTokens:()=>_("/admin/admin-fcm-tokens"),removeAdminFCMToken:e=>_("/admin/admin-fcm-token",{method:"DELETE",body:JSON.stringify({token:e})}),sendTestPushNotification:e=>_("/admin/test-push",{method:"POST",body:JSON.stringify(e)}),getFirebaseSettings:()=>_("/admin/firebase-settings"),saveFirebaseSettings:e=>_("/admin/firebase-settings",{method:"PUT",body:JSON.stringify(e)}),getImageKitSettings:()=>_("/admin/imagekit-settings"),saveImageKitSettings:e=>_("/admin/imagekit-settings",{method:"PUT",body:JSON.stringify(e)}),sendMassMail:e=>_("/admin/mass-mail",{method:"POST",body:JSON.stringify(e)}),getDepositRequests:()=>_("/admin/deposit-requests"),updateDepositRequest:(e,t)=>_(`/admin/deposit-requests/${e}`,{method:"PUT",body:JSON.stringify(t)}),getWithdrawalRequests:()=>_("/admin/withdrawal-requests"),approveWithdrawal:e=>_(`/admin/withdrawal-requests/${e}/approve`,{method:"PUT"}),rejectWithdrawal:(e,t)=>_(`/admin/withdrawal-requests/${e}/reject`,{method:"PUT",body:JSON.stringify({reason:t})}),getCompletionRequests:()=>_("/admin/campaigns/completion-requests"),releaseCampaignEscrow:e=>_(`/admin/campaigns/${e}/release-escrow`,{method:"POST"}),refundCampaignEscrow:e=>_(`/admin/campaigns/${e}/refund-escrow`,{method:"POST"}),getMaintenanceStatus:()=>_("/admin/maintenance-status"),toggleMaintenance:e=>_("/admin/maintenance-toggle",{method:"POST",body:JSON.stringify(e)}),getDisputes:()=>_("/admin/disputes"),resolveDispute:e=>_(`/admin/disputes/${e}/resolve`,{method:"PATCH"}),getPayouts:e=>{const t=new URLSearchParams(e||{}).toString();return _(`/admin/features/payouts${t?`?${t}`:""}`)},getPayoutSummary:()=>_("/admin/features/payouts/summary"),markPayoutAsPaid:(e,t)=>_(`/admin/features/payouts/${e}/mark-paid`,{method:"PUT",body:JSON.stringify(t)}),getFeeSettings:()=>_("/admin/features/fees"),updateFeeSettings:e=>_("/admin/features/fees",{method:"PUT",body:JSON.stringify(e)}),calculateFee:e=>_("/admin/features/fees/calculate",{method:"POST",body:JSON.stringify(e)}),sendNotification:e=>_("/admin/features/send-notification",{method:"POST",body:JSON.stringify(e)}),getNotificationHistory:e=>{const t=new URLSearchParams(e||{}).toString();return _(`/admin/features/notification-history${t?`?${t}`:""}`)},getNotificationSettings:()=>_("/admin/features/notification-settings"),updateNotificationSettings:e=>_("/admin/features/notification-settings",{method:"PUT",body:JSON.stringify(e)}),testNotification:e=>_("/admin/test-notification",{method:"POST",body:JSON.stringify({token:e})}),getCreatorVerifications:e=>{const t=new URLSearchParams(e||{}).toString();return _(`/admin/features/creator-verifications${t?`?${t}`:""}`)},reviewCreatorVerification:(e,t)=>_(`/admin/features/creator-verifications/${e}/review`,{method:"PUT",body:JSON.stringify(t)}),getTopDonors:e=>{const t=new URLSearchParams(e||{}).toString();return _(`/admin/features/top-donors${t?`?${t}`:""}`)},getRecurringDonations:e=>{const t=new URLSearchParams(e||{}).toString();return _(`/admin/features/recurring-donations${t?`?${t}`:""}`)},updateSubscriptionStatus:(e,t)=>_(`/admin/features/recurring-donations/${e}/status`,{method:"PUT",body:JSON.stringify({status:t})}),getDonorAnalytics:()=>_("/admin/features/donor-analytics"),getAuditLogs:e=>{const t=new URLSearchParams(e||{}).toString();return _(`/admin/features/audit-logs${t?`?${t}`:""}`)}},_i={getSettings:()=>_("/settings/public"),getMaintenanceStatus:()=>_("/maintenance-status")},e0=Object.freeze(Object.defineProperty({__proto__:null,adminApi:O,authApi:ht,campaignApi:Pt,clearToken:xl,donationApi:Dt,getToken:Ei,publicApi:_i,saveToken:gl,userApi:wh,walletApi:nt},Symbol.toStringTag,{value:"Module"})),kh=p.createContext(null);function t0({children:e}){const[t,n]=p.useState(null),[a,s]=p.useState([]),[i,o]=p.useState([]),[l,c]=p.useState(null),[d,m]=p.useState(!1),[f,x]=p.useState("login"),[b,w]=p.useState("donor"),[k,N]=p.useState(!0),[g,u]=p.useState({}),[h,y]=p.useState(0),[S,C]=p.useState(null),E=p.useRef(!1),I=lt(),H=p.useCallback((P,A=!1)=>{c({msg:P,error:A}),setTimeout(()=>c(null),3800)},[]),R=p.useCallback(async()=>{try{const P=await nt.getBalance();y(parseFloat(P.balance)||0)}catch(P){console.warn("[Wallet] Fetch failed:",P.message)}},[]),ne=p.useCallback(P=>{P&&(P.role==="admin"?I("/admin-dashboard"):P.role==="creator"?I("/creator-dashboard"):P.role==="donor"&&I("/donor-dashboard"))},[I]);p.useEffect(()=>{if(E.current)return;if(E.current=!0,!Ei()){N(!1);return}ht.me().then(A=>{const V=A.user??A;n(V)}).catch(()=>xl()).finally(()=>N(!1))},[]),p.useEffect(()=>{t?R():y(0)},[t,R]);const de=p.useCallback(P=>{const A=document.documentElement;Object.entries(P).forEach(([V,ce])=>{V.startsWith("--")&&A.style.setProperty(V,ce)})},[]),ie=p.useCallback(async()=>{try{const P=await O.getTheme();P.theme&&(u(P.theme),de(P.theme))}catch{}},[de]),Me=async P=>{await O.saveTheme(P),u(P),de(P),H("Theme updated")};p.useEffect(()=>{(t==null?void 0:t.role)==="admin"&&ie()},[t,ie]);const q=p.useCallback(async(P={})=>{try{const A=await Pt.getAll(P);return s(A.campaigns||[]),A}catch(A){H(A.message,!0)}},[H]),oe=p.useCallback(async()=>{try{const P=await Pt.getMy();o(P.campaigns||[])}catch(P){H(P.message,!0)}},[H]),Z=(P="login",A="donor")=>{x(P),w(A),m(!0)},T=()=>m(!1),B=async(P,A,V,ce,Re)=>{const te=await ht.register({name:P,email:A,password:V,role:ce,recaptchaToken:Re});return te.needsVerification?(C(A),H(te.message),{needsVerification:!0,email:te.email}):(te.token&&gl(te.token),te.user?(n(te.user),H(`Welcome to HopeBridge, ${te.user.name}!`),ne(te.user)):H(te.message),te.user)},U=async(P,A)=>{const V=await ht.login({email:P,password:A});return V.token&&gl(V.token),V.user&&(n(V.user),H(V.message),ne(V.user)),V.user},J=()=>{xl(),n(null),o([]),y(0),C(null),H("Logged out successfully"),I("/")},ee=async({campaign_id:P,amount:A,donor_name:V,donor_email:ce,message:Re,is_monthly:te})=>{const Ve=await nt.donateFromWallet({campaign_id:P,amount:A,donor_name:V,donor_email:ce,message:Re,is_monthly:te});return H(Ve.message),await q(),R(),Ve},je=p.useCallback(P=>{const A=new FormData;return Object.entries(P).forEach(([V,ce])=>{ce!=null&&(ce instanceof File?A.append(V,ce,ce.name):Array.isArray(ce)?ce.forEach((Re,te)=>{typeof Re=="object"&&!(Re instanceof File)?A.append(`${V}[${te}]`,JSON.stringify(Re)):A.append(`${V}[${te}]`,Re)}):typeof ce=="object"&&!(ce instanceof File)?A.append(V,JSON.stringify(ce)):A.append(V,String(ce)))}),A},[]),ue=async P=>{const A=P instanceof FormData?P:je(P),V=await Pt.create(A);return H(V.message),await oe(),V.campaign},Se=async(P,A)=>{const V=A instanceof FormData?A:je(A),ce=await Pt.update(P,V);return H(ce.message),await oe(),ce.campaign},L=async P=>{await Pt.delete(P),H("Campaign deleted"),o(A=>A.filter(V=>V.id!==P)),s(A=>A.filter(V=>V.id!==P))},Q=a.filter(P=>P.status==="approved"),Ce=a.reduce((P,A)=>P+parseFloat(A.raised||0),0),ye=p.useCallback(async()=>{try{const P=await ht.me(),A=P.user??P;return n(A),A}catch(P){return console.error("Failed to refresh user:",P),null}},[]);return r.jsx(kh.Provider,{value:{currentUser:t,setCurrentUser:n,campaigns:a,approvedCampaigns:Q,myCampaigns:i,totalFunds:Ce,loading:k,toast:l,authOpen:d,authMode:f,authRole:b,openAuth:Z,closeAuth:T,login:U,register:B,logout:J,loadCampaigns:q,loadMyCampaigns:oe,createCampaign:ue,updateCampaign:Se,deleteCampaign:L,donateFromWallet:ee,showToast:H,theme:g,saveTheme:Me,fetchTheme:ie,walletBalance:h,refreshWallet:R,pendingVerificationEmail:S,redirectToDashboard:ne,refreshUser:ye},children:e})}function Oe(){return p.useContext(kh)}/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nh=(...e)=>e.filter((t,n,a)=>!!t&&t.trim()!==""&&a.indexOf(t)===n).join(" ").trim();/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n0=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r0=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,n,a)=>a?a.toUpperCase():n.toLowerCase());/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hu=e=>{const t=r0(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var io={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a0=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1},s0=p.createContext({}),i0=()=>p.useContext(s0),o0=p.forwardRef(({color:e,size:t,strokeWidth:n,absoluteStrokeWidth:a,className:s="",children:i,iconNode:o,...l},c)=>{const{size:d=24,strokeWidth:m=2,absoluteStrokeWidth:f=!1,color:x="currentColor",className:b=""}=i0()??{},w=a??f?Number(n??m)*24/Number(t??d):n??m;return p.createElement("svg",{ref:c,...io,width:t??d??io.width,height:t??d??io.height,stroke:e??x,strokeWidth:w,className:Nh("lucide",b,s),...!i&&!a0(l)&&{"aria-hidden":"true"},...l},[...o.map(([k,N])=>p.createElement(k,N)),...Array.isArray(i)?i:[i]])});/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=(e,t)=>{const n=p.forwardRef(({className:a,...s},i)=>p.createElement(o0,{ref:i,iconNode:t,className:Nh(`lucide-${n0(hu(e))}`,`lucide-${e}`,a),...s}));return n.displayName=hu(e),n};/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l0=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],yl=W("arrow-left",l0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c0=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],In=W("arrow-right",c0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d0=[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M6 12h.01M18 12h.01",key:"113zkx"}]],Wt=W("banknote",d0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u0=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],Pr=W("bell",u0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p0=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],Br=W("calendar",p0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f0=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],h0=W("check",f0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m0=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],ni=W("chevron-right",m0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g0=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],ri=W("circle-alert",g0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x0=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],pe=W("circle-check-big",x0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v0=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]],y0=W("circle-user",v0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b0=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]],Ra=W("clock",b0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j0=[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]],nn=W("credit-card",j0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w0=[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]],We=W("dollar-sign",w0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k0=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],ai=W("eye-off",k0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N0=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],si=W("eye",N0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S0=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],mu=W("file-text",S0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C0=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",key:"1sqzm4"}],["path",{d:"M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5",key:"kc0143"}],["rect",{x:"3",y:"7",width:"18",height:"4",rx:"1",key:"1hberx"}]],kn=W("gift",C0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E0=[["path",{d:"M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16",key:"1v1a37"}],["path",{d:"m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95",key:"fhfbnt"}],["path",{d:"m2 15 6 6",key:"10dquu"}],["path",{d:"m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91",key:"1x6kdw"}]],_0=W("hand-heart",E0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z0=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]],$e=W("heart",z0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T0=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],La=W("history",T0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D0=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],ii=W("house",D0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I0=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],bl=W("image",I0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P0=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],gu=W("info",P0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A0=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]],M0=W("key",A0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R0=[["path",{d:"M10 18v-7",key:"wt116b"}],["path",{d:"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z",key:"yxxwt6"}],["path",{d:"M14 18v-7",key:"vav6t3"}],["path",{d:"M18 18v-7",key:"aexdmj"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M6 18v-7",key:"1ivflk"}]],L0=W("landmark",R0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F0=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],Vt=W("layout-dashboard",F0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $0=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],O0=W("loader-circle",$0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B0=[["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m16.2 7.8 2.9-2.9",key:"r700ao"}],["path",{d:"M18 12h4",key:"wj9ykh"}],["path",{d:"m16.2 16.2 2.9 2.9",key:"1bxg5t"}],["path",{d:"M12 18v4",key:"jadmvz"}],["path",{d:"m4.9 19.1 2.9-2.9",key:"bwix9q"}],["path",{d:"M2 12h4",key:"j09sii"}],["path",{d:"m4.9 4.9 2.9 2.9",key:"giyufr"}]],xu=W("loader",B0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W0=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]],U0=W("lock-open",W0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H0=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],oi=W("lock",H0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V0=[["path",{d:"m10 17 5-5-5-5",key:"1bsop3"}],["path",{d:"M15 12H3",key:"6jk70r"}],["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}]],jl=W("log-in",V0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q0=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],an=W("log-out",q0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y0=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],er=W("mail",Y0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K0=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],Qa=W("menu",K0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G0=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],J0=W("moon",G0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q0=[["path",{d:"M15 18h-5",key:"95g1m2"}],["path",{d:"M18 14h-8",key:"sponae"}],["path",{d:"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2",key:"39pd36"}],["rect",{width:"8",height:"4",x:"10",y:"6",rx:"1",key:"aywv1n"}]],oo=W("newspaper",Q0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X0=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Sh=W("plus",X0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z0=[["path",{d:"M12 17V7",key:"pyj7ub"}],["path",{d:"M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8",key:"1elt7d"}],["path",{d:"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z",key:"ycz6yz"}]],vu=W("receipt",Z0);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ey=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],Wr=W("refresh-cw",ey);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ty=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],Fa=W("send",ty);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ny=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],pt=W("settings",ny);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ry=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],yu=W("share-2",ry);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ay=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],wl=W("shield",ay);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sy=[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]],iy=W("smartphone",sy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oy=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],ly=W("sun",oy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cy=[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]],dy=W("tag",cy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uy=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],Ge=W("target",uy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const py=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],bu=W("trash-2",py);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fy=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],Ch=W("trending-up",fy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hy=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],my=W("triangle-alert",hy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gy=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],ju=W("upload",gy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xy=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]],Eh=W("user-plus",xy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vy=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],$a=W("user",vy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yy=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],Kn=W("users",yy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const by=[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]],Xt=W("wallet",by);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jy=[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",key:"1ngwbx"}]],wy=W("wrench",jy);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ky=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Bt=W("x",ky);/**
 * @license lucide-react v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ny=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],kl=W("zap",Ny);function Nl(){const{currentUser:e,logout:t,openAuth:n,walletBalance:a}=Oe(),s=lt(),[i,o]=p.useState(!1),[l,c]=p.useState(!1),[d,m]=p.useState(!1),f=p.useRef(),x=y=>{var S;(S=document.getElementById(y))==null||S.scrollIntoView({behavior:"smooth"}),o(!1),m(!1)};p.useEffect(()=>{const y=S=>{f.current&&!f.current.contains(S.target)&&c(!1)};return document.addEventListener("mousedown",y),()=>document.removeEventListener("mousedown",y)},[]),p.useEffect(()=>{const y=S=>{S.key==="Escape"&&m(!1)};return document.addEventListener("keydown",y),()=>document.removeEventListener("keydown",y)},[]);const b=()=>{t(),o(!1),c(!1),m(!1),s("/")},w=()=>{e&&(e.role==="admin"&&s("/admin-dashboard"),e.role==="creator"&&s("/creator-dashboard"),e.role==="donor"&&s("/donor-dashboard"),c(!1),o(!1),m(!1))},k=()=>{x("causes")},N=()=>{x("donate")},g=e?e.name.split(" ").map(y=>y[0]).join("").toUpperCase().slice(0,2):"",u={donor:"#e8531e",creator:"#27a96c",admin:"#6366f1"}[e==null?void 0:e.role]||"#e8531e",h=(e==null?void 0:e.is_verified)===!0;return r.jsxs(r.Fragment,{children:[r.jsx("nav",{className:"site-nav",children:r.jsxs("div",{className:"nav-inner",style:{position:"relative"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[r.jsx("button",{className:"mobile-hamburger",onClick:()=>m(!d),"aria-label":"Toggle menu",style:{display:"none",background:"none",border:"none",cursor:"pointer",padding:"8px",color:"#1a1a2e"},children:d?r.jsx(Bt,{size:24}):r.jsx(Qa,{size:24})}),e&&r.jsxs("div",{ref:f,style:{position:"relative"},children:[r.jsxs("button",{onClick:()=>c(y=>!y),style:{display:"flex",alignItems:"center",gap:10,border:`2px solid ${u}20`,borderRadius:40,padding:"6px 14px 6px 6px",cursor:"pointer",transition:"0.15s",fontFamily:"inherit",background:l?`${u}10`:"#fff"},children:[r.jsxs("div",{style:{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${u},${u}bb)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#fff",fontSize:"0.85rem",flexShrink:0,position:"relative"},children:[g,h&&r.jsx(pe,{size:12,style:{position:"absolute",bottom:-2,right:-2,background:"#fff",borderRadius:"50%",color:"#378ADD"}})]}),r.jsxs("div",{style:{textAlign:"left",lineHeight:1.2},children:[r.jsx("div",{style:{fontSize:"0.88rem",fontWeight:700,color:"#1a1a2e",whiteSpace:"nowrap"},children:e.name.split(" ")[0]}),r.jsx("div",{style:{fontSize:"0.7rem",color:u,fontWeight:600,textTransform:"capitalize"},children:e.role})]}),r.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"#9ca3af",strokeWidth:"2.5",style:{marginLeft:2,transform:l?"rotate(180deg)":"none",transition:"0.2s"},children:r.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),l&&r.jsxs("div",{style:{position:"absolute",top:"calc(100% + 8px)",left:0,background:"#fff",borderRadius:14,boxShadow:"0 16px 48px rgba(0,0,0,0.14)",border:"1px solid #f3f4f6",minWidth:220,zIndex:300,overflow:"hidden",fontFamily:"'DM Sans',sans-serif"},children:[r.jsxs("div",{style:{padding:"16px 18px",borderBottom:"1px solid #f3f4f6",background:"#fafafa"},children:[r.jsxs("div",{style:{fontWeight:700,color:"#1a1a2e",fontSize:"0.95rem",display:"flex",alignItems:"center",gap:6},children:[e.name,h&&r.jsx(pe,{size:14,color:"#378ADD"})]}),r.jsx("div",{style:{fontSize:"0.78rem",color:"#9ca3af",marginTop:2},children:e.email}),e.role==="donor"&&r.jsxs("div",{style:{marginTop:8,background:"#e1f5ee",borderRadius:8,padding:"6px 10px",fontSize:"0.82rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[r.jsx("span",{style:{color:"#0F6E56"},children:"💰 Wallet"}),r.jsxs("strong",{style:{color:"#0F6E56"},children:["$",a.toFixed(2)]})]})]}),r.jsxs("div",{style:{padding:"8px 0"},children:[r.jsxs("button",{onClick:w,style:ys,children:[r.jsx(Vt,{size:16}),"My Dashboard"]}),r.jsxs("button",{onClick:()=>{s("/"),c(!1)},style:ys,children:[r.jsx(ii,{size:16}),"Home"]}),r.jsxs("button",{onClick:k,style:ys,children:[r.jsx(Ge,{size:16}),"Browse Campaigns"]}),r.jsx("hr",{style:{margin:"4px 0",border:"none",borderTop:"1px solid #f3f4f6"}}),r.jsxs("button",{onClick:b,style:{...ys,color:"#ef4444"},children:[r.jsx(an,{size:16}),"Sign Out"]})]})]})]}),r.jsxs("a",{className:"logo",onClick:()=>{s("/"),o(!1),m(!1)},style:{marginLeft:0,cursor:"pointer"},children:[r.jsx($e,{size:18,color:"#e8531e"}),"Hope",r.jsx("span",{children:"Bridge"})]})]}),r.jsxs("div",{className:"nav-links",children:[r.jsx("a",{onClick:k,children:"Causes"}),r.jsx("a",{onClick:()=>x("how-it-works"),children:"How It Works"}),r.jsx("a",{onClick:N,children:"Donate"}),r.jsx("a",{onClick:()=>x("impact"),children:"Impact"}),e?r.jsxs(r.Fragment,{children:[e.role!=="donor"&&r.jsxs("button",{className:"nav-btn nav-btn-outline",onClick:w,children:[r.jsx(Vt,{size:14})," Dashboard"]}),r.jsxs("button",{className:"nav-btn nav-btn-outline",onClick:b,style:{borderColor:"#ef4444",color:"#ef4444"},children:[r.jsx(an,{size:14})," Logout"]})]}):r.jsxs(r.Fragment,{children:[r.jsxs("button",{className:"nav-btn nav-btn-outline",onClick:()=>n("register","creator"),children:[r.jsx(kn,{size:14})," Start Campaign"]}),r.jsxs("button",{className:"nav-btn nav-btn-solid",onClick:()=>n("login"),children:[r.jsx($a,{size:14})," Login"]})]})]})]})}),r.jsx("div",{className:`mobile-sidebar-overlay ${d?"open":""}`,onClick:()=>m(!1)}),r.jsxs("div",{className:`mobile-sidebar-menu ${d?"open":""}`,children:[r.jsxs("div",{className:"mobile-sidebar-header",children:[r.jsxs("div",{className:"logo",style:{fontSize:"1.3rem"},children:[r.jsx($e,{size:20,color:"#e8531e"}),"Hope",r.jsx("span",{children:"Bridge"})]}),r.jsx("button",{onClick:()=>m(!1),style:{background:"none",border:"none",cursor:"pointer"},children:r.jsx(Bt,{size:24})})]}),e&&r.jsxs("div",{className:"mobile-sidebar-user",children:[r.jsx("div",{className:"mobile-user-avatar",style:{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,${u},${u}bb)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"1.2rem",color:"#fff"},children:g}),r.jsxs("div",{className:"mobile-user-info",children:[r.jsxs("div",{className:"mobile-user-name",style:{display:"flex",alignItems:"center",gap:6},children:[e.name,h&&r.jsx(pe,{size:14,color:"#378ADD"})]}),r.jsx("div",{className:"mobile-user-role",style:{color:u,fontSize:"0.8rem"},children:e.role})]})]}),r.jsxs("div",{className:"mobile-sidebar-nav",children:[r.jsxs("button",{onClick:()=>{s("/"),m(!1)},className:"mobile-nav-item",children:[r.jsx(ii,{size:18})," Home"]}),r.jsxs("button",{onClick:k,className:"mobile-nav-item",children:[r.jsx(Ge,{size:18})," Causes"]}),r.jsxs("button",{onClick:()=>x("how-it-works"),className:"mobile-nav-item",children:[r.jsx(Sy,{size:18})," How It Works"]}),r.jsxs("button",{onClick:N,className:"mobile-nav-item",children:[r.jsx($e,{size:18})," Donate"]}),r.jsxs("button",{onClick:()=>x("impact"),className:"mobile-nav-item",children:[r.jsx(Cy,{size:18})," Impact"]}),r.jsx("div",{className:"mobile-sidebar-divider"}),e?r.jsxs(r.Fragment,{children:[r.jsxs("button",{onClick:w,className:"mobile-nav-item",children:[r.jsx(Vt,{size:18})," Dashboard"]}),r.jsxs("button",{onClick:b,className:"mobile-nav-item",style:{color:"#ef4444"},children:[r.jsx(an,{size:18})," Sign Out"]})]}):r.jsxs(r.Fragment,{children:[r.jsxs("button",{onClick:()=>{n("login"),m(!1)},className:"mobile-nav-item",children:[r.jsx($a,{size:18})," Login"]}),r.jsxs("button",{onClick:()=>{n("register","donor"),m(!1)},className:"mobile-nav-item",children:[r.jsx(Ey,{size:18})," Sign Up"]}),r.jsxs("button",{onClick:()=>{n("register","creator"),m(!1)},className:"mobile-nav-item",style:{color:"#27a96c"},children:[r.jsx(kn,{size:18})," Start Campaign"]})]})]})]}),r.jsx("style",{children:`
        .site-nav {
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 20px rgba(0,0,0,.08);
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 72px;
        }
        .logo {
          font-family: 'Raleway', sans-serif;
          font-size: 1.6rem;
          font-weight: 900;
          color: #e8531e;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.5px;
          text-decoration: none;
        }
        .logo span { color: #1a1a2e; }
        .nav-links { display: flex; gap: 26px; align-items: center; }
        .nav-links a {
          text-decoration: none;
          font-weight: 600;
          color: #555;
          font-size: .9rem;
          transition: .2s;
          cursor: pointer;
          letter-spacing: .3px;
          text-transform: uppercase;
        }
        .nav-links a:hover { color: #e8531e; }
        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 4px;
          font-weight: 700;
          font-size: .85rem;
          cursor: pointer;
          border: none;
          transition: all .2s;
          font-family: 'Raleway', sans-serif;
          text-transform: uppercase;
          letter-spacing: .5px;
        }
        .nav-btn-outline {
          background: transparent;
          border: 2px solid #e8531e;
          color: #e8531e;
        }
        .nav-btn-outline:hover { background: #e8531e; color: #fff; }
        .nav-btn-solid {
          background: linear-gradient(135deg, #e8531e, #f47c50);
          color: #fff;
          box-shadow: 0 8px 30px rgba(232,83,30,0.18);
        }
        .nav-btn-solid:hover { transform: translateY(-1px); }
        
        .mobile-hamburger {
          display: none !important;
        }
        
        /* Mobile Sidebar Styles */
        .mobile-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 998;
          display: none;
        }
        .mobile-sidebar-overlay.open {
          display: block;
        }
        .mobile-sidebar-menu {
          position: fixed;
          top: 0;
          left: -300px;
          width: 280px;
          height: 100vh;
          background: #fff;
          z-index: 999;
          transition: left 0.3s ease;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .mobile-sidebar-menu.open {
          left: 0;
        }
        .mobile-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        .mobile-sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: #fafafa;
          border-bottom: 1px solid #f3f4f6;
        }
        .mobile-user-name {
          font-weight: 700;
          font-size: 1rem;
          color: #1a1a2e;
        }
        .mobile-sidebar-nav {
          flex: 1;
          padding: 12px 0;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151;
          transition: background 0.2s;
          font-family: inherit;
          text-align: left;
        }
        .mobile-nav-item:hover {
          background: #f3f4f6;
        }
        .mobile-sidebar-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 12px 20px;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .mobile-hamburger {
            display: flex !important;
          }
        }
      `})]})}const ys={display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 18px",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",color:"#374151",fontWeight:500,textAlign:"left",transition:"0.12s"};function Sy(e){return r.jsxs("svg",{...e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[r.jsx("circle",{cx:"12",cy:"12",r:"10"}),r.jsx("line",{x1:"12",y1:"16",x2:"12",y2:"12"}),r.jsx("line",{x1:"12",y1:"8",x2:"12.01",y2:"8"})]})}function Cy(e){return r.jsxs("svg",{...e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[r.jsx("polyline",{points:"23 18 13.5 8.5 8.5 13.5 1 6"}),r.jsx("polyline",{points:"17 18 23 18 23 12"})]})}function Ey(e){return r.jsxs("svg",{...e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[r.jsx("path",{d:"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),r.jsx("circle",{cx:"8.5",cy:"7",r:"4"}),r.jsx("line",{x1:"20",y1:"8",x2:"20",y2:"14"}),r.jsx("line",{x1:"23",y1:"11",x2:"17",y2:"11"})]})}function _y({campaign:e,onDonate:t}){const n=lt(),a=Math.min(e.raised/e.goal*100,100),s=e.image_url||"https://placehold.co/600x200?text=HopeBridge",i=()=>{n(`/campaign/${e.id}`)},o=l=>{l.stopPropagation(),t(e.id)};return r.jsxs("div",{className:"cause-card",onClick:i,style:{cursor:"pointer"},children:[r.jsx("div",{className:"card-img-block",style:{backgroundImage:`url('${s}')`},children:r.jsx("span",{className:"card-category",children:e.category||"Cause"})}),r.jsxs("div",{className:"card-content",children:[r.jsx("h3",{children:e.title}),r.jsxs("p",{children:[e.description?e.description.substring(0,80):"No description available","..."]}),r.jsxs("div",{className:"progress-label",children:[r.jsxs("span",{children:["Raised: $",e.raised.toLocaleString()]}),r.jsxs("span",{children:[Math.round(a),"%"]})]}),r.jsx("div",{className:"prog-bg",children:r.jsx("div",{className:"prog-fill",style:{width:`${a}%`}})}),r.jsxs("div",{className:"card-footer-row",children:[r.jsxs("span",{className:"raised-amount",children:["Goal: $",e.goal.toLocaleString()]}),r.jsx("button",{className:"donate-cause-btn",onClick:o,children:"Donate"})]})]})]})}const zy=[10,25,50,100,250];function _c({campaignId:e,onSuccess:t}){const{currentUser:n,approvedCampaigns:a,loadCampaigns:s,walletBalance:i,refreshWallet:o,showToast:l,openAuth:c}=Oe(),[d,m]=p.useState(e||""),[f,x]=p.useState(""),[b,w]=p.useState(""),[k,N]=p.useState(50),[g,u]=p.useState(50),[h,y]=p.useState(""),[S,C]=p.useState(!1),[E,I]=p.useState(!1),[H,R]=p.useState(!1);p.useEffect(()=>{n&&(x(n.name||""),w(n.email||"")),s()},[n]);const ne=async q=>{if(q.preventDefault(),!d){l("Please select a campaign",!0);return}if(!k||k<=0){l("Please enter a valid donation amount",!0);return}if(!n){const oe={campaignId:d,amount:k,message:h,isMonthly:S,timestamp:Date.now()};sessionStorage.setItem("pendingDonation",JSON.stringify(oe)),sessionStorage.setItem("redirectAfterAuth",window.location.pathname),l("Please create an account or login to continue with your donation"),c("register","donor");return}await de(q)},de=async q=>{var oe,Z;if(q.preventDefault(),k>i){l(`Insufficient wallet balance. Available: $${i.toFixed(2)}`,!0);return}I(!0);try{await nt.donateFromWallet({campaign_id:parseInt(d),amount:parseFloat(k),donor_name:f||(n==null?void 0:n.name),donor_email:b||(n==null?void 0:n.email),message:h,is_monthly:S}),l("Donation successful! Thank you for your support."),o&&o(),s(),m(e||""),y(""),C(!1),N(50),u(50),t&&t()}catch(T){l(((Z=(oe=T.response)==null?void 0:oe.data)==null?void 0:Z.error)||"Wallet donation failed",!0)}finally{I(!1)}},ie=q=>{u(q),N(q)},Me=q=>{const oe=parseFloat(q.target.value);N(isNaN(oe)?"":oe),u(null)};return r.jsxs("div",{className:"donation-form-card",children:[r.jsx("h3",{children:"Make a Donation from Wallet"}),!n&&r.jsxs("div",{style:{background:"#fff5f0",padding:12,borderRadius:8,marginBottom:16},children:[r.jsx("i",{className:"fas fa-info-circle"})," You'll need to ",r.jsx("strong",{children:"create an account or login"})," before donating.",r.jsx("button",{onClick:()=>c("register","donor"),style:{marginLeft:8,color:"#e8531e",textDecoration:"underline",background:"none",border:"none",cursor:"pointer"},children:"Create account"})]}),r.jsxs("form",{onSubmit:ne,children:[r.jsxs("div",{className:"form-group",children:[r.jsx("label",{className:"form-label-custom",children:"Select Campaign *"}),r.jsxs("select",{className:"form-ctrl",value:d,onChange:q=>m(q.target.value),required:!0,disabled:!!e,children:[r.jsx("option",{value:"",children:"-- Choose a campaign --"}),a.map(q=>r.jsx("option",{value:q.id,children:q.title},q.id))]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{className:"form-label-custom",children:"Your Name *"}),r.jsx("input",{type:"text",className:"form-ctrl",value:f,onChange:q=>x(q.target.value),required:!0,disabled:!!n})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{className:"form-label-custom",children:"Email Address *"}),r.jsx("input",{type:"email",className:"form-ctrl",value:b,onChange:q=>w(q.target.value),required:!0,disabled:!!n}),!n&&r.jsx("small",{style:{color:"#6b7280",fontSize:11},children:"We will send a verification code to this email"})]}),n&&r.jsx("div",{className:"form-group",style:{background:"#e1f5ee",padding:12,borderRadius:8,marginBottom:16},children:r.jsxs("strong",{children:["💰 Wallet balance: $",i.toFixed(2)]})}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{className:"form-label-custom",children:"Donation Amount (USD)"}),r.jsx("div",{className:"amount-buttons",children:zy.map(q=>r.jsxs("button",{type:"button",className:`amount-preset ${g===q?"active":""}`,onClick:()=>ie(q),children:["$",q]},q))}),r.jsx("input",{type:"number",className:"form-ctrl",placeholder:"Custom amount",min:"1",step:"1",value:k,onChange:Me})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{className:"form-label-custom",children:"Message (Optional)"}),r.jsx("textarea",{className:"form-ctrl",rows:"2",placeholder:"Leave a supportive message...",value:h,onChange:q=>y(q.target.value)})]}),r.jsx("div",{style:{marginBottom:"24px"},children:r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer"},children:[r.jsx("input",{type:"checkbox",checked:S,onChange:q=>C(q.target.value)}),"Make this a monthly recurring donation"]})}),r.jsx("button",{type:"submit",className:"btn-donate-submit",disabled:E||!d||!k,children:E?"Processing...":n?`Donate $${k} from Wallet`:"Continue to Donation →"})]})]})}const Ty=[{n:1,title:"Browse Causes",desc:"Explore verified campaigns across education, health, and environment.",icon:"fa-search"},{n:2,title:"Choose Amount",desc:"Pick any amount — every dollar directly helps those in need.",icon:"fa-dollar-sign"},{n:3,title:"Donate Securely",desc:"Your donation is processed with full security and transparency.",icon:"fa-shield-alt"},{n:4,title:"See the Change",desc:"Track your impact and get updates from the campaigns you support.",icon:"fa-chart-line"}],Dy=[{icon:"fa-shield-alt",title:"100% Secure",desc:"Your payment info is encrypted and protected."},{icon:"fa-check-circle",title:"Verified Campaigns",desc:"All campaigns are reviewed by our admin team."},{icon:"fa-eye",title:"Full Transparency",desc:"See exactly where your money goes."},{icon:"fa-receipt",title:"Tax Receipt",desc:"Get a receipt for your donation instantly."}],Iy=[{stars:5,text:"HopeBridge makes giving transparent — I see exactly where my donation goes. Amazing platform!",author:"Amanda R.",role:"Regular Donor"},{stars:5,text:"I started a campaign for clean water and the support was overwhelming. This platform works!",author:"Marcus T.",role:"Campaign Creator"},{stars:5,text:"The admin team is responsive and every campaign feels legitimate. I trust HopeBridge completely.",author:"Priya S.",role:"Monthly Donor"}],Py=()=>{const[e,t]=p.useState(null),[n,a]=p.useState(!1);p.useEffect(()=>{const i=o=>{o.preventDefault(),t(o),a(!0)};return window.addEventListener("beforeinstallprompt",i),()=>window.removeEventListener("beforeinstallprompt",i)},[]);const s=()=>{e&&(e.prompt(),e.userChoice.then(()=>t(null)),a(!1))};return n?r.jsxs("button",{onClick:s,className:"pwa-install-footer-btn",children:[r.jsx("i",{className:"fas fa-download"})," Install App"]}):null};let wu=!1;const Ay=()=>{if(wu)return;wu=!0;const e=document.createElement("style");e.textContent=`
    :root {
      --primary: #e8531e;
      --primary-dark: #c4400f;
      --primary-light: #f47c50;
      --secondary: #27a96c;
      --dark: #1a1a2e;
      --text: #444;
      --text-light: #777;
      --bg-light: #f8f9fa;
      --grad1: linear-gradient(135deg, #e8531e 0%, #f47c50 50%, #e8531e 100%);
      --grad2: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      --shadow: 0 8px 30px rgba(232, 83, 30, 0.18);
      --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Open Sans', sans-serif; color: var(--text); line-height: 1.7; background: #fff; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Raleway', sans-serif; font-weight: 700; }
    
    /* Dark Mode Support */
    body.dark-mode {
      --bg-light: #1a1a2e;
      --text: #e0e0e0;
      --text-light: #aaa;
    }
    body.dark-mode .how-item,
    body.dark-mode .testimonial-card,
    body.dark-mode .donation-form-card {
      background: #252540;
      color: #e0e0e0;
    }
    
    /* Hero Section */
    .hero {
      background: var(--grad2);
      position: relative;
      overflow: hidden;
      min-height: 600px;
      display: flex;
      align-items: center;
    }
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1400&h=700&fit=crop') center/cover;
      opacity: .15;
    }
    .hero-shapes { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .hero-shape { position: absolute; border-radius: 50%; background: rgba(232,83,30,.15); }
    .hero-shape.s1 { width: 400px; height: 400px; top: -100px; right: -100px; }
    .hero-shape.s2 { width: 200px; height: 200px; bottom: 50px; left: 5%; }
    .hero-shape.s3 { width: 120px; height: 120px; top: 30%; right: 30%; }
    .hero-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 24px;
      display: flex;
      align-items: center;
      gap: 60px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
      width: 100%;
    }
    .hero-content { flex: 1.2; min-width: 280px; }
    .hero-badge {
      background: rgba(232,83,30,.2);
      border: 1px solid rgba(232,83,30,.4);
      color: #f47c50;
      padding: 7px 18px;
      border-radius: 30px;
      font-size: .82rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .hero-content h1 {
      font-size: clamp(2.2rem, 5vw, 3.6rem);
      line-height: 1.15;
      margin-bottom: 18px;
      color: #fff;
      font-weight: 900;
    }
    .hero-content h1 .highlight { color: var(--primary-light); }
    .hero-content p {
      font-size: 1.05rem;
      color: rgba(255,255,255,.75);
      margin-bottom: 32px;
      max-width: 500px;
    }
    .hero-stats { display: flex; gap: 36px; margin-bottom: 36px; flex-wrap: wrap; align-items: center; }
    .hero-stat-item { text-align: left; }
    .hero-stat-num { font-size: 2rem; font-weight: 900; color: var(--primary-light); font-family: 'Raleway', sans-serif; line-height: 1; }
    .hero-stat-lbl { font-size: .8rem; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: .5px; margin-top: 3px; }
    .hero-stat-divider { width: 1px; background: rgba(255,255,255,.15); align-self: stretch; }
    .hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
    .btn-hero-primary {
      background: var(--grad1);
      color: #fff;
      border: none;
      padding: 14px 32px;
      border-radius: 40px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all .25s;
      box-shadow: var(--shadow);
      font-family: 'Raleway', sans-serif;
      text-transform: uppercase;
      letter-spacing: .5px;
    }
    .btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(232,83,30,.35); }
    .btn-hero-outline {
      background: transparent;
      border: 2px solid rgba(255,255,255,.4);
      color: #fff;
      padding: 12px 30px;
      border-radius: 40px;
      font-weight: 700;
      font-size: .9rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all .2s;
      font-family: 'Raleway', sans-serif;
      text-transform: uppercase;
      letter-spacing: .5px;
    }
    .btn-hero-outline:hover { border-color: #fff; background: rgba(255,255,255,.1); }
    .hero-visual { flex: .9; min-width: 260px; }
    .hero-card {
      background: rgba(255,255,255,.08);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 16px;
      color: #fff;
    }
    .hero-card-label { font-size: .75rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,.5); margin-bottom: 8px; }
    .hero-card-value { font-size: 1.6rem; font-weight: 800; font-family: 'Raleway', sans-serif; }
    .mini-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .mini-card {
      background: rgba(232,83,30,.15);
      border: 1px solid rgba(232,83,30,.25);
      border-radius: 14px;
      padding: 16px;
      color: #fff;
      text-align: center;
    }
    .mini-card-num { font-size: 1.3rem; font-weight: 800; font-family: 'Raleway', sans-serif; color: var(--primary-light); }
    .mini-card-lbl { font-size: .72rem; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: .5px; }
    
    /* Section Common */
    .section-wrap { padding: 90px 0; }
    .section-wrap.bg-light { background: var(--bg-light); }
    .container-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(232,83,30,.1);
      color: var(--primary);
      padding: 5px 16px;
      border-radius: 30px;
      font-size: .78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
    }
    .section-title {
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      color: var(--dark);
      margin-bottom: 12px;
      line-height: 1.25;
    }
    .section-title .accent { color: var(--primary); }
    .section-sub { color: var(--text-light); font-size: 1rem; margin-bottom: 48px; max-width: 560px; }
    .section-divider {
      width: 60px;
      height: 4px;
      background: var(--grad1);
      border-radius: 4px;
      margin: 16px 0 40px;
    }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .text-center { text-align: center; }
    .row { display: flex; flex-wrap: wrap; margin: -12px; }
    .col-md-3 { width: 25%; padding: 12px; }
    .col-6 { width: 50%; padding: 12px; }
    @media (max-width: 768px) { .col-md-3 { width: 50%; } }
    @media (max-width: 480px) { .col-md-3 { width: 100%; } }
    
    /* How It Works */
    .how-item { text-align: center; padding: 24px 20px; background: white; border-radius: 20px; transition: transform 0.3s; height: 100%; box-shadow: var(--shadow-card); }
    .how-item:hover { transform: translateY(-5px); }
    .how-num {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--grad1);
      color: #fff;
      font-size: 1.5rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px;
      font-family: 'Raleway', sans-serif;
      box-shadow: var(--shadow);
    }
    .how-item h4 { font-size: 1.05rem; color: var(--dark); margin-bottom: 8px; }
    .how-item p { font-size: .88rem; color: var(--text-light); }
    
    /* Causes Grid */
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 30px; }
    
    /* Parallax Banner */
    .parallax-banner {
      background: url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&h=500&fit=crop') center/cover fixed;
      position: relative;
      padding: 100px 0;
      text-align: center;
    }
    .parallax-banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(232,83,30,.88), rgba(26,26,46,.92));
    }
    .parallax-content { position: relative; z-index: 1; color: #fff; }
    .parallax-content h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); margin-bottom: 16px; font-weight: 900; }
    .parallax-content p { font-size: 1.1rem; opacity: .85; margin-bottom: 36px; max-width: 600px; margin-left: auto; margin-right: auto; }
    .parallax-stats { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; margin-top: 50px; }
    .pstat { text-align: center; }
    .pstat-num { font-size: 3rem; font-weight: 900; font-family: 'Raleway', sans-serif; color: #fff; line-height: 1; }
    .pstat-lbl { font-size: .85rem; color: rgba(255,255,255,.7); text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }
    .counter-accent { color: var(--primary-light); }
    .parallax-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,.15);
      color: #fff;
      border: 1px solid rgba(255,255,255,.3);
      padding: 5px 16px;
      border-radius: 30px;
      font-size: .78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
    }
    
    /* Donation Section */
    .donation-section { background: var(--bg-light); padding: 90px 0; }
    .donation-wrapper {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 60px;
      align-items: start;
    }
    @media (max-width: 900px) { .donation-wrapper { grid-template-columns: 1fr; } }
    .donation-info { padding-top: 20px; }
    .donation-info h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); color: var(--dark); margin-bottom: 14px; }
    .donation-info p { color: var(--text-light); margin-bottom: 28px; }
    .trust-items { margin-top: 28px; }
    .trust-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #eee; }
    .trust-item:last-child { border: none; }
    .trust-icon {
      width: 44px; height: 44px;
      border-radius: 50%;
      background: rgba(232,83,30,.1);
      display: flex; align-items: center; justify-content: center;
      color: var(--primary);
      flex-shrink: 0;
    }
    .trust-text strong { display: block; font-size: .9rem; color: var(--dark); }
    .trust-text span { font-size: .82rem; color: var(--text-light); }
    .donation-form-card {
      background: #fff;
      border-radius: 20px;
      padding: 32px;
      box-shadow: var(--shadow-card);
    }
    
    /* Testimonials */
    .testimonial-section { padding: 90px 0; background: #fff; }
    .testimonial-card {
      background: var(--bg-light);
      border-radius: 20px;
      padding: 36px;
      position: relative;
      text-align: center;
      height: 100%;
      transition: transform 0.3s;
      box-shadow: var(--shadow-card);
    }
    .testimonial-card:hover { transform: translateY(-5px); }
    .testimonial-text {
      font-size: 1.05rem;
      color: var(--text);
      font-style: italic;
      margin: 12px 0 20px;
      position: relative;
      z-index: 1;
    }
    .testimonial-author { font-weight: 700; color: var(--dark); font-family: 'Raleway', sans-serif; }
    .testimonial-role { font-size: 0.8rem; color: var(--primary); margin-top: 4px; }
    .stars { color: #f59e0b; margin-bottom: 8px; }
    
    /* CTA Strip */
    .cta-strip { background: var(--grad1); padding: 64px 0; text-align: center; }
    .cta-strip h2 { color: #fff; font-size: clamp(1.6rem, 4vw, 2.4rem); margin-bottom: 14px; }
    .cta-strip p { color: rgba(255,255,255,.8); margin-bottom: 30px; font-size: 1.05rem; }
    .cta-strip-btn-white {
      background: #fff;
      color: var(--primary);
      border: none;
      padding: 14px 32px;
      border-radius: 40px;
      font-weight: 800;
      font-size: .95rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: 'Raleway', sans-serif;
      text-transform: uppercase;
      letter-spacing: .5px;
    }
    
    /* Footer */
    .site-footer { background: var(--dark); color: rgba(255,255,255,.6); padding: 70px 0 28px; }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
    }
    @media (max-width: 768px) { .footer-inner { grid-template-columns: 1fr 1fr; } }
    .footer-logo { font-family: 'Raleway', sans-serif; font-size: 1.5rem; font-weight: 900; color: var(--primary); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .site-footer h4 { font-size: .9rem; text-transform: uppercase; letter-spacing: 1px; color: #fff; margin-bottom: 18px; font-family: 'Raleway', sans-serif; }
    .footer-links { list-style: none; padding: 0; }
    .footer-links li { margin-bottom: 10px; }
    .footer-links a {
      color: rgba(255,255,255,.55);
      text-decoration: none;
      font-size: .88rem;
      transition: .2s;
      cursor: pointer;
    }
    .footer-links a:hover { color: var(--primary); }
    .footer-bottom {
      max-width: 1200px;
      margin: 48px auto 0;
      padding: 24px 24px 0;
      border-top: 1px solid rgba(255,255,255,.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      font-size: .83rem;
    }
    .social-icons { display: flex; gap: 12px; margin-top: 16px; }
    .social-icons a {
      width: 36px; height: 36px;
      background: rgba(255,255,255,.08);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,.6);
      text-decoration: none;
      transition: .2s;
    }
    .social-icons a:hover { background: var(--primary); color: #fff; }
    
    /* PWA Install Button in Footer */
    .pwa-install-footer-btn {
      background: var(--grad1);
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 40px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 12px;
      transition: all 0.2s;
    }
    .pwa-install-footer-btn:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow);
    }
    
    /* Mobile Scroll to Top Button */
    .scroll-top-btn {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--grad1);
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.2s;
      z-index: 99;
      opacity: 0;
      visibility: hidden;
    }
    .scroll-top-btn.visible {
      opacity: 1;
      visibility: visible;
    }
    .scroll-top-btn:hover {
      transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
      .hero-visual { display: none; }
      .parallax-stats { gap: 32px; flex-wrap: wrap; justify-content: center; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .section-wrap { padding: 60px 0; }
      .donation-section, .testimonial-section { padding: 60px 0; }
      .cta-strip { padding: 40px 0; }
      .site-footer { padding: 40px 0 20px; }
      .footer-inner { gap: 24px; }
      .scroll-top-btn { bottom: 70px; right: 16px; width: 40px; height: 40px; }
    }
  `,document.head.appendChild(e)};function ku(){var w,k,N,g;Ay();const{approvedCampaigns:e,totalFunds:t,loadCampaigns:n,openAuth:a}=Oe();lt();const[s,i]=p.useState({hero_title:"Every Contribution Builds A Brighter Tomorrow",hero_subtitle:"Join thousands of donors empowering education, healthcare, and clean water across the globe.",hero_badge:"Making A Real Difference",impact_title:"Our Impact",impact_subtitle:"Where Your Money Goes",impact_stats:{efficiency:"89%",lives:"14K+",projects:"120+",transparency:"100%"},social_links:{facebook:"#",twitter:"#",instagram:"#",linkedin:"#"}}),[o,l]=p.useState(!0),[c,d]=p.useState(!1),m=u=>{const h=document.getElementById(u);h&&h.scrollIntoView({behavior:"smooth"})},f=()=>{window.scrollTo({top:0,behavior:"smooth"})};p.useEffect(()=>{n(),x();const u=()=>{d(window.scrollY>300)};return window.addEventListener("scroll",u),()=>window.removeEventListener("scroll",u)},[]);const x=async()=>{try{const u=await _i.getSettings();u&&i({hero_title:u.hero_title||s.hero_title,hero_subtitle:u.hero_subtitle||s.hero_subtitle,hero_badge:u.hero_badge||s.hero_badge,impact_title:u.impact_title||s.impact_title,impact_subtitle:u.impact_subtitle||s.impact_subtitle,impact_stats:u.impact_stats||s.impact_stats,social_links:u.social_links||s.social_links})}catch(u){console.error("Failed to load content:",u)}finally{l(!1)}},b=t>=1e6?`$${(t/1e6).toFixed(1)}M`:t>=1e3?`$${(t/1e3).toFixed(1)}K`:`$${t.toLocaleString()}`;return r.jsxs(r.Fragment,{children:[r.jsxs("section",{className:"hero",children:[r.jsxs("div",{className:"hero-shapes",children:[r.jsx("div",{className:"hero-shape s1"}),r.jsx("div",{className:"hero-shape s2"}),r.jsx("div",{className:"hero-shape s3"})]}),r.jsxs("div",{className:"hero-inner",children:[r.jsxs("div",{className:"hero-content",children:[r.jsxs("div",{className:"hero-badge",children:[r.jsx("i",{className:"fas fa-star"})," ",s.hero_badge]}),r.jsx("h1",{children:s.hero_title.split(" ").map((u,h)=>u.toLowerCase()==="tomorrow"||u.toLowerCase()==="difference"?r.jsxs("span",{className:"highlight",children:[u," "]},h):u+" ")}),r.jsx("p",{children:s.hero_subtitle}),r.jsxs("div",{className:"hero-stats",children:[r.jsxs("div",{className:"hero-stat-item",children:[r.jsx("div",{className:"hero-stat-num",children:e.length}),r.jsx("div",{className:"hero-stat-lbl",children:"Active Projects"})]}),r.jsx("div",{className:"hero-stat-divider"}),r.jsxs("div",{className:"hero-stat-item",children:[r.jsx("div",{className:"hero-stat-num",children:b}),r.jsx("div",{className:"hero-stat-lbl",children:"Funds Raised"})]}),r.jsx("div",{className:"hero-stat-divider"}),r.jsxs("div",{className:"hero-stat-item",children:[r.jsx("div",{className:"hero-stat-num",children:"100%"}),r.jsx("div",{className:"hero-stat-lbl",children:"Transparent"})]})]}),r.jsxs("div",{className:"hero-cta",children:[r.jsxs("button",{className:"btn-hero-primary",onClick:()=>m("donate"),children:[r.jsx("i",{className:"fas fa-hand-holding-heart"})," Donate Now"]}),r.jsxs("button",{className:"btn-hero-outline",onClick:()=>m("causes"),children:[r.jsx("i",{className:"fas fa-search"})," Browse Causes"]})]})]}),r.jsxs("div",{className:"hero-visual",children:[r.jsxs("div",{className:"hero-card",children:[r.jsx("div",{className:"hero-card-label",children:"Total Raised"}),r.jsx("div",{className:"hero-card-value",children:b}),r.jsx("div",{style:{fontSize:".8rem",color:"rgba(255,255,255,.5)",marginTop:4},children:"Across all active campaigns"})]}),r.jsxs("div",{className:"mini-cards",children:[r.jsxs("div",{className:"mini-card",children:[r.jsx("div",{className:"mini-card-num",children:s.impact_stats.efficiency||"89%"}),r.jsx("div",{className:"mini-card-lbl",children:"Efficiency"})]}),r.jsxs("div",{className:"mini-card",children:[r.jsx("div",{className:"mini-card-num",children:s.impact_stats.lives||"14K+"}),r.jsx("div",{className:"mini-card-lbl",children:"Lives"})]}),r.jsxs("div",{className:"mini-card",children:[r.jsx("div",{className:"mini-card-num",children:s.impact_stats.projects||"120+"}),r.jsx("div",{className:"mini-card-lbl",children:"Projects"})]}),r.jsxs("div",{className:"mini-card",children:[r.jsx("div",{className:"mini-card-num",children:s.impact_stats.transparency||"100%"}),r.jsx("div",{className:"mini-card-lbl",children:"Transparent"})]})]})]})]})]}),r.jsx("section",{id:"how-it-works",className:"section-wrap",children:r.jsxs("div",{className:"container-inner",children:[r.jsxs("div",{className:"text-center",children:[r.jsxs("div",{className:"section-tag",children:[r.jsx("i",{className:"fas fa-info-circle"})," How It Works"]}),r.jsxs("h2",{className:"section-title",children:["Simple Steps to ",r.jsx("span",{className:"accent",children:"Make an Impact"})]}),r.jsx("div",{className:"section-divider mx-auto"})]}),r.jsx("div",{className:"row",children:Ty.map(u=>r.jsx("div",{className:"col-md-3 col-6",children:r.jsxs("div",{className:"how-item",children:[r.jsx("div",{className:"how-num",children:u.n}),r.jsx("h4",{children:u.title}),r.jsx("p",{children:u.desc})]})},u.n))})]})}),r.jsx("section",{id:"causes",className:"section-wrap bg-light",children:r.jsxs("div",{className:"container-inner",children:[r.jsxs("div",{className:"section-tag",children:[r.jsx("i",{className:"fas fa-heart"})," Active Causes"]}),r.jsxs("h2",{className:"section-title",children:["Urgent Causes ",r.jsx("span",{className:"accent",children:"You Can Change"})]}),r.jsx("div",{className:"section-divider"}),r.jsx("p",{className:"section-sub",children:"Every donation goes directly to verified campaigns."}),e.length===0?r.jsx("div",{className:"text-center p-5",style:{color:"var(--text-light)"},children:"No active campaigns yet."}):r.jsx("div",{className:"cards-grid",children:e.map(u=>r.jsx(_y,{campaign:u,onDonate:()=>m("donate")},u.id))})]})}),r.jsx("section",{id:"impact",className:"parallax-banner",children:r.jsxs("div",{className:"parallax-content container-inner",children:[r.jsxs("div",{className:"parallax-tag",children:[r.jsx("i",{className:"fas fa-chart-line"})," ",s.impact_title]}),r.jsxs("h2",{children:[s.impact_subtitle," ",r.jsx("span",{style:{color:"var(--primary-light)"},children:"Goes"})]}),r.jsx("p",{children:"We operate with 100% transparency. Every cent is tracked and reported."}),r.jsxs("button",{className:"btn-hero-primary",onClick:()=>m("donate"),children:[r.jsx("i",{className:"fas fa-heart"})," Donate Now"]}),r.jsxs("div",{className:"parallax-stats",children:[r.jsxs("div",{className:"pstat",children:[r.jsx("div",{className:"pstat-num",children:r.jsx("span",{className:"counter-accent",children:s.impact_stats.efficiency||"89%"})}),r.jsx("div",{className:"pstat-lbl",children:"Program Efficiency"})]}),r.jsxs("div",{className:"pstat",children:[r.jsx("div",{className:"pstat-num",children:r.jsx("span",{className:"counter-accent",children:s.impact_stats.lives||"14K+"})}),r.jsx("div",{className:"pstat-lbl",children:"Lives Impacted"})]}),r.jsxs("div",{className:"pstat",children:[r.jsx("div",{className:"pstat-num",children:r.jsx("span",{className:"counter-accent",children:s.impact_stats.projects||"120+"})}),r.jsx("div",{className:"pstat-lbl",children:"Projects Funded"})]}),r.jsxs("div",{className:"pstat",children:[r.jsx("div",{className:"pstat-num",children:r.jsx("span",{className:"counter-accent",children:s.impact_stats.transparency||"100%"})}),r.jsx("div",{className:"pstat-lbl",children:"Transparency"})]})]})]})}),r.jsx("section",{id:"donate",className:"donation-section",children:r.jsxs("div",{className:"container-inner",children:[r.jsxs("div",{className:"section-tag",children:[r.jsx("i",{className:"fas fa-gift"})," Make A Donation"]}),r.jsxs("h2",{className:"section-title mb-0",children:["Give ",r.jsx("span",{className:"accent",children:"Today"})]}),r.jsx("div",{className:"section-divider"}),r.jsxs("div",{className:"donation-wrapper",children:[r.jsxs("div",{className:"donation-info",children:[r.jsxs("h2",{children:["Your Generosity ",r.jsx("span",{style:{color:"var(--primary)"},children:"Transforms Lives"})]}),r.jsx("p",{children:"Select a campaign, enter your details, and help make the world a better place."}),r.jsx("div",{className:"trust-items",children:Dy.map(u=>r.jsxs("div",{className:"trust-item",children:[r.jsx("div",{className:"trust-icon",children:r.jsx("i",{className:`fas ${u.icon}`})}),r.jsxs("div",{className:"trust-text",children:[r.jsx("strong",{children:u.title}),r.jsx("span",{children:u.desc})]})]},u.title))})]}),r.jsx(_c,{})]})]})}),r.jsx("section",{className:"testimonial-section",children:r.jsxs("div",{className:"container-inner",children:[r.jsxs("div",{className:"text-center mb-5",children:[r.jsxs("div",{className:"section-tag",children:[r.jsx("i",{className:"fas fa-quote-right"})," Testimonials"]}),r.jsxs("h2",{className:"section-title",children:["What Our ",r.jsx("span",{className:"accent",children:"Donors Say"})]}),r.jsx("div",{className:"section-divider mx-auto"})]}),r.jsx("div",{className:"row g-4 justify-content-center",children:Iy.map(u=>r.jsx("div",{className:"col-md-4",children:r.jsxs("div",{className:"testimonial-card",children:[r.jsx("div",{className:"stars",children:"★".repeat(u.stars)}),r.jsxs("p",{className:"testimonial-text",children:['"',u.text,'"']}),r.jsxs("div",{className:"testimonial-author",children:["— ",u.author]}),r.jsx("div",{className:"testimonial-role",children:u.role})]})},u.author))})]})}),r.jsx("section",{className:"cta-strip",children:r.jsxs("div",{className:"container-inner",children:[r.jsx("h2",{children:"Ready to Make a Difference?"}),r.jsx("p",{children:"Start your campaign today or donate to an existing cause."}),r.jsxs("div",{style:{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"},children:[r.jsxs("button",{className:"btn-hero-outline",style:{borderColor:"rgba(255,255,255,.8)"},onClick:()=>a("register","creator"),children:[r.jsx("i",{className:"fas fa-plus"})," Start a Campaign"]}),r.jsxs("button",{className:"cta-strip-btn-white",onClick:()=>m("donate"),children:["Donate Now ",r.jsx("i",{className:"fas fa-arrow-right"})]})]})]})}),r.jsxs("footer",{className:"site-footer",children:[r.jsxs("div",{className:"footer-inner",children:[r.jsxs("div",{children:[r.jsxs("div",{className:"footer-logo",children:[r.jsx("i",{className:"fas fa-heart"})," HopeBridge"]}),r.jsx("p",{style:{fontSize:".88rem",lineHeight:1.8,maxWidth:240},children:"Empowering communities through transparent giving."}),r.jsxs("div",{className:"social-icons",children:[r.jsx("a",{href:((w=s.social_links)==null?void 0:w.facebook)||"#",target:"_blank",rel:"noopener noreferrer",children:r.jsx("i",{className:"fab fa-facebook-f"})}),r.jsx("a",{href:((k=s.social_links)==null?void 0:k.twitter)||"#",target:"_blank",rel:"noopener noreferrer",children:r.jsx("i",{className:"fab fa-twitter"})}),r.jsx("a",{href:((N=s.social_links)==null?void 0:N.instagram)||"#",target:"_blank",rel:"noopener noreferrer",children:r.jsx("i",{className:"fab fa-instagram"})}),r.jsx("a",{href:((g=s.social_links)==null?void 0:g.linkedin)||"#",target:"_blank",rel:"noopener noreferrer",children:r.jsx("i",{className:"fab fa-linkedin-in"})})]}),r.jsx(Py,{})]}),r.jsxs("div",{children:[r.jsx("h4",{children:"Explore"}),r.jsxs("ul",{className:"footer-links",children:[r.jsx("li",{children:r.jsx("a",{onClick:()=>m("causes"),children:"Active Causes"})}),r.jsx("li",{children:r.jsx("a",{onClick:()=>m("how-it-works"),children:"How It Works"})}),r.jsx("li",{children:r.jsx("a",{onClick:()=>m("impact"),children:"Our Impact"})})]})]}),r.jsxs("div",{children:[r.jsx("h4",{children:"Sign In As"}),r.jsxs("ul",{className:"footer-links",children:[r.jsx("li",{children:r.jsx("a",{onClick:()=>a("register","donor"),children:"Donor"})}),r.jsx("li",{children:r.jsx("a",{onClick:()=>a("register","creator"),children:"Campaign Creator"})})]})]}),r.jsxs("div",{children:[r.jsx("h4",{children:"Contact"}),r.jsxs("ul",{className:"footer-links",children:[r.jsx("li",{children:r.jsxs("a",{href:"mailto:hello@hopebridge.org",children:[r.jsx("i",{className:"fas fa-envelope"})," hello@hopebridge.org"]})}),r.jsx("li",{children:r.jsxs("a",{href:"tel:+15551234567",children:[r.jsx("i",{className:"fas fa-phone"})," +1 (555) 123-4567"]})})]})]})]}),r.jsxs("div",{className:"footer-bottom",children:[r.jsxs("p",{children:["© ",new Date().getFullYear()," HopeBridge — Nonprofit. All Rights Reserved."]}),r.jsxs("p",{children:["Made with ",r.jsx("span",{style:{color:"var(--primary)"},children:"❤"})," for a better world"]})]})]}),r.jsx("button",{className:`scroll-top-btn ${c?"visible":""}`,onClick:f,children:r.jsx("i",{className:"fas fa-arrow-up"})})]})}function Ur({showToast:e}){const{currentUser:t}=Oe(),n=lt(),[a,s]=p.useState([]),[i,o]=p.useState(0),[l,c]=p.useState(!1),[d,m]=p.useState(!0),f=p.useRef(),x=p.useRef(null),b=async()=>{try{let h;try{(t==null?void 0:t.role)==="admin"&&(h=await O.getNotificationHistory())}catch{console.log("Using mock notifications")}const y=[{id:1,title:"New Donation Received!",body:'Someone just donated $50 to your campaign "Clean Water Project"',type:"donation",read:!1,created_at:new Date().toISOString(),link:"/admin-dashboard?tab=donations"},{id:2,title:"Campaign Approved",body:'Your campaign "School Supplies" has been approved and is now live!',type:"campaign",read:!1,created_at:new Date(Date.now()-36e5).toISOString(),link:"/creator-dashboard"},{id:3,title:"Withdrawal Processed",body:"Your withdrawal request of $200 has been approved.",type:"withdrawal",read:!0,created_at:new Date(Date.now()-864e5).toISOString(),link:"/donor-dashboard?tab=wallet"}];let S=y;(t==null?void 0:t.role)==="donor"?S=y.filter(C=>C.type!=="campaign"):((t==null?void 0:t.role)==="creator"||(t==null?void 0:t.role)==="admin")&&(S=y),s(S),o(S.filter(C=>!C.read).length)}catch(h){console.error("Failed to fetch notifications:",h)}finally{m(!1)}};p.useEffect(()=>{b();const h=setInterval(b,3e4);return()=>clearInterval(h)},[t]),p.useEffect(()=>{const h=y=>{f.current&&!f.current.contains(y.target)&&c(!1)};return document.addEventListener("mousedown",h),()=>document.removeEventListener("mousedown",h)},[]),p.useEffect(()=>{a.some(y=>!y.read)&&i>0&&x.current},[i]);const w=async h=>{s(y=>y.map(S=>S.id===h?{...S,read:!0}:S)),o(y=>Math.max(0,y-1))},k=async()=>{s(h=>h.map(y=>({...y,read:!0}))),o(0)},N=h=>{w(h.id),h.link&&n(h.link),c(!1)},g=h=>{switch(h){case"donation":return r.jsx($e,{size:14,color:"#e8531e"});case"campaign":return r.jsx(Ge,{size:14,color:"#1D9E75"});case"withdrawal":return r.jsx(We,{size:14,color:"#f59e0b"});case"user":return r.jsx(Kn,{size:14,color:"#378ADD"});default:return r.jsx(Pr,{size:14})}},u=h=>{const y=Math.floor((new Date-new Date(h))/1e3);if(y<60)return`${y}s ago`;const S=Math.floor(y/60);if(S<60)return`${S}m ago`;const C=Math.floor(S/60);return C<24?`${C}h ago`:`${Math.floor(C/24)}d ago`};return r.jsxs(r.Fragment,{children:[r.jsx("audio",{ref:x,preload:"auto",style:{display:"none"},children:r.jsx("source",{src:"/notification.mp3",type:"audio/mpeg"})}),r.jsxs("div",{ref:f,style:{position:"relative"},children:[r.jsxs("button",{className:"notification-bell-btn",onClick:()=>c(!l),"aria-label":"Notifications",style:{position:"relative",background:"none",border:"none",cursor:"pointer",padding:"8px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",transition:"background 0.2s"},onMouseEnter:h=>h.currentTarget.style.background="rgba(0,0,0,0.05)",onMouseLeave:h=>h.currentTarget.style.background="transparent",children:[r.jsx(Pr,{size:20,strokeWidth:1.8}),i>0&&r.jsx("span",{className:"notification-badge",children:i>99?"99+":i})]}),l&&r.jsxs("div",{className:"notification-dropdown",children:[r.jsxs("div",{className:"notification-header",children:[r.jsx("h4",{children:"Notifications"}),i>0&&r.jsxs("button",{onClick:k,className:"mark-all-read",children:[r.jsx(pe,{size:14})," Mark all read"]})]}),d&&r.jsxs("div",{className:"notification-loading",children:[r.jsx("div",{className:"spinner-small"}),r.jsx("span",{children:"Loading..."})]}),!d&&a.length===0&&r.jsxs("div",{className:"notification-empty",children:[r.jsx(Pr,{size:32,strokeWidth:1.5}),r.jsx("p",{children:"No notifications yet"}),r.jsx("span",{children:"We'll notify you when something happens"})]}),!d&&a.length>0&&r.jsx("div",{className:"notification-list",children:a.map(h=>r.jsxs("div",{className:`notification-item ${h.read?"":"unread"}`,onClick:()=>N(h),children:[r.jsx("div",{className:"notification-icon",children:g(h.type)}),r.jsxs("div",{className:"notification-content",children:[r.jsx("div",{className:"notification-title",children:h.title}),r.jsx("div",{className:"notification-body",children:h.body}),r.jsx("div",{className:"notification-time",children:u(h.created_at)})]}),!h.read&&r.jsx("div",{className:"notification-unread-dot"})]},h.id))}),r.jsx("div",{className:"notification-footer",children:r.jsx("button",{onClick:()=>c(!1),children:"Close"})})]})]}),r.jsx("style",{children:`
        .notification-bell-btn {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
        }

        .notification-dropdown {
          position: absolute;
          top: 45px;
          right: 0;
          width: 360px;
          max-width: calc(100vw - 32px);
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
        }

        .notification-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .mark-all-read {
          background: none;
          border: none;
          font-size: 12px;
          color: #1D9E75;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .mark-all-read:hover {
          text-decoration: underline;
        }

        .notification-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px;
          color: #999;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid #f0f0f0;
          border-top-color: #1D9E75;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .notification-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px 20px;
          text-align: center;
          color: #999;
        }

        .notification-empty p {
          margin: 0;
          font-weight: 500;
        }

        .notification-empty span {
          font-size: 12px;
        }

        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #f5f5f5;
          position: relative;
        }

        .notification-item:hover {
          background: #fafafa;
        }

        .notification-item.unread {
          background: #f0fdf4;
        }

        .notification-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-title {
          font-weight: 600;
          font-size: 14px;
          color: #1a1a2e;
          margin-bottom: 4px;
        }

        .notification-body {
          font-size: 13px;
          color: #666;
          line-height: 1.4;
          word-break: break-word;
        }

        .notification-time {
          font-size: 11px;
          color: #999;
          margin-top: 6px;
        }

        .notification-unread-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1D9E75;
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .notification-footer {
          padding: 12px 20px;
          border-top: 1px solid #f0f0f0;
          text-align: center;
        }

        .notification-footer button {
          background: none;
          border: none;
          color: #999;
          font-size: 13px;
          cursor: pointer;
        }

        /* Dark Mode Support */
        body.dark-mode .notification-dropdown {
          background: #1e1e36;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }

        body.dark-mode .notification-header {
          background: #2a2a40;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        body.dark-mode .notification-header h4 {
          color: #fff;
        }

        body.dark-mode .notification-item {
          border-bottom-color: rgba(255, 255, 255, 0.05);
        }

        body.dark-mode .notification-item:hover {
          background: #2a2a40;
        }

        body.dark-mode .notification-item.unread {
          background: rgba(29, 158, 117, 0.15);
        }

        body.dark-mode .notification-title {
          color: #fff;
        }

        body.dark-mode .notification-body {
          color: #aaa;
        }

        body.dark-mode .notification-footer {
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .notification-dropdown {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-width: 100%;
            border-radius: 20px 20px 0 0;
            animation: slideUp 0.3s ease;
          }

          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .notification-header {
            padding: 16px;
          }

          .notification-list {
            max-height: 60vh;
          }

          .notification-item {
            padding: 14px 16px;
          }
        }
      `})]})}const Zt=(e,t=0)=>{const n=parseFloat(e);return isNaN(n)?t:n},My=e=>({pending:"#f59e0b",instructions_sent:"#3b82f6",awaiting_proof:"#8b5cf6",approved:"#10b981",rejected:"#ef4444"})[e]||"#6b7280",Ry=e=>({pending:"Pending",instructions_sent:"Instructions Sent",awaiting_proof:"Proof Uploaded",approved:"Approved",rejected:"Rejected"})[e]||e;let Nu=!1;const Ly=()=>{if(Nu)return;Nu=!0;const e=document.createElement("style");e.textContent=`
    :root {
      --green: #1D9E75; --green-d: #0F6E56; --green-dd: #085041; --green-l: #E1F5EE; --green-m: #9FE1CB;
      --red: #E24B4A; --red-l: #FCEBEB; --amber: #EF9F27; --amber-l: #FAEEDA; --blue: #378ADD; --blue-l: #E6F1FB;
      --bg: #EEF1F5; --surface: #FFFFFF; --surface-2: #F6F8FA; --border: rgba(0,0,0,0.07); --border-2: rgba(0,0,0,0.13);
      --txt: #111318; --txt-2: #5A6272; --txt-3: #9AA3B2;
      --sidebar-w: 260px; --topbar-h: 64px; --bottom-nav: 68px;
      --r-sm: 10px; --r-md: 14px; --r-lg: 20px; --r-xl: 26px;
      --sh-sm: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
      --fd: 'Instrument Serif', Georgia, serif; --fb: 'DM Sans', sans-serif; --tr: 0.2s ease;
    }
    body.dark-mode {
      --bg: #121212; --surface: #1E1E1E; --surface-2: #2A2A2A; --border: rgba(255,255,255,0.1);
      --txt: #EEEEEE; --txt-2: #AAAAAA; --txt-3: #777777;
    }
    body { font-family: var(--fb); background: var(--bg); color: var(--txt); min-height: 100vh; }
    .shell { display: flex; min-height: 100vh; }
    .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 200; overflow-y: auto; }
    .sb-logo { padding: 22px 20px 14px; border-bottom: 1px solid var(--border); }
    .logo-mark { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-icon { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green); display: flex; align-items: center; justify-content: center; }
    .logo-icon svg { width: 20px; height: 20px; stroke: #fff; stroke-width: 2; fill: none; }
    .logo-text { font-family: var(--fd); font-size: 19px; color: var(--txt); }
    .logo-sub { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--txt-3); }
    .sb-user { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
    .user-av { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--green), var(--green-d)); display: flex; align-items: center; justify-content: center; font-weight: 600; color: #fff; }
    .user-name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .verified-badge { color: #378ADD; background: rgba(55,138,221,0.15); border-radius: 20px; padding: 2px 6px; font-size: 10px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
    .user-badge { font-size: 11px; color: var(--txt-3); background: var(--green-l); padding: 2px 8px; border-radius: 20px; display: inline-block; margin-top: 4px; }
    .sb-nav { flex: 1; padding: 10px; }
    .nav-sec { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--txt-3); padding: 10px 10px 4px; }
    .nl { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--r-sm); cursor: pointer; border: none; background: none; width: 100%; text-align: left; color: var(--txt-2); font-size: 13.5px; font-weight: 500; transition: all var(--tr); }
    .nl:hover { background: var(--bg); color: var(--txt); }
    .nl.active { background: var(--green-l); color: var(--green-d); font-weight: 600; }
    .nl svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.8; fill: none; }
    .nb { margin-left: auto; font-size: 10px; font-weight: 700; background: var(--amber); color: #fff; padding: 2px 7px; border-radius: 20px; }
    .sb-footer { padding: 12px 10px; border-top: 1px solid var(--border); }
    .main { flex: 1; margin-left: var(--sidebar-w); }
    .topbar { height: var(--topbar-h); background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 16px; position: sticky; top: 0; z-index: 100; }
    .tb-title { font-family: var(--fd); font-size: 22px; flex: 1; }
    .tb-actions { display: flex; gap: 10px; }
    .tb-btn { width: 38px; height: 38px; border-radius: var(--r-sm); background: var(--surface-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background var(--tr); }
    .tb-btn svg { width: 18px; height: 18px; stroke: var(--txt-2); }
    .page { padding: 28px; }
    .ps { display: none; }
    .ps.active { display: block; }
    
    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--txt);
    }
    
    .mobile-sidebar {
      position: fixed;
      top: 0;
      left: -280px;
      width: 280px;
      height: 100vh;
      background: var(--surface);
      z-index: 300;
      transition: left 0.3s ease;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      overflow-y: auto;
    }
    
    .mobile-sidebar.open {
      left: 0;
    }
    
    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 299;
      display: none;
    }
    
    .mobile-overlay.open {
      display: block;
    }
    
    /* Mobile Bottom Navigation */
    .mobile-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--surface);
      border-top: 1px solid var(--border);
      z-index: 200;
      padding: 8px 16px;
      padding-bottom: env(safe-area-inset-bottom, 8px);
    }
    
    .mobile-bottom-nav-inner {
      display: flex;
      justify-content: space-around;
      align-items: center;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .mobile-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: var(--r-md);
      transition: all 0.2s;
      color: var(--txt-3);
      font-size: 10px;
      font-weight: 600;
      position: relative;
    }
    
    .mobile-nav-item.active {
      color: var(--green);
      background: var(--green-l);
    }
    
    .mobile-nav-item svg {
      width: 22px;
      height: 22px;
    }
    
    .mobile-nav-badge {
      position: absolute;
      top: 2px;
      right: 5px;
      background: var(--red);
      color: #fff;
      font-size: 9px;
      border-radius: 50%;
      min-width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Campaign Card Styles */
    .campaign-card {
      background: var(--surface);
      border-radius: var(--r-lg);
      padding: 16px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid var(--border);
    }
    .campaign-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--sh-md);
    }
    .campaign-card-title {
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 8px;
      color: var(--txt);
    }
    .campaign-card-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      font-size: 0.8rem;
    }
    .campaign-card-progress {
      margin-top: 8px;
    }
    
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; }
      .topbar { display: none; }
      .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
      .mob-top { display: flex; height: 58px; background: var(--surface); align-items: center; padding: 0 16px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border); }
      .mobile-bottom-nav { display: block; }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .card-h { flex-direction: column; gap: 8px; align-items: flex-start; }
      .ut { display: block; overflow-x: auto; white-space: nowrap; }
    }
    
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    .sc { background: var(--surface); border-radius: var(--r-lg); padding: 20px; box-shadow: var(--sh-sm); cursor: pointer; transition: transform 0.2s; }
    .sc:hover { transform: translateY(-2px); }
    .sc .si { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green-l); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .sc .si svg { stroke: var(--green-d); width: 18px; height: 18px; }
    .sv { font-family: var(--fd); font-size: 32px; line-height: 1; }
    .sl { font-size: 12px; color: var(--txt-2); margin-top: 4px; }
    .sd { font-size: 11px; font-weight: 700; margin-top: 8px; color: var(--green); }
    .card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh-sm); overflow: hidden; margin-bottom: 24px; }
    .card-h { display: flex; justify-content: space-between; padding: 18px 20px 14px; border-bottom: 1px solid var(--border); }
    .card-t { font-family: var(--fd); font-size: 17px; display: flex; align-items: center; gap: 8px; }
    .card-a { font-size: 12px; font-weight: 600; color: var(--green); background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    .card-b { padding: 16px 20px; }
    .badge { font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; }
    .ba { background: var(--green-l); color: var(--green-d); }
    .bp { background: var(--amber-l); color: #854F0B; }
    .br { background: var(--blue-l); color: #185FA5; }
    .bx { background: var(--red-l); color: var(--red); }
    .cr { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .cr:last-child { border-bottom: none; }
    .ci { flex: 1; }
    .cn { font-weight: 600; font-size: 14px; }
    .cm { font-size: 11px; color: var(--txt-3); margin-top: 2px; display: flex; align-items: center; gap: 4px; }
    .pb { height: 4px; background: var(--bg); border-radius: 2px; margin-top: 6px; overflow: hidden; }
    .pf { height: 100%; background: var(--green); border-radius: 2px; }
    .ut { width: 100%; border-collapse: collapse; }
    .ut th { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--txt-3); text-align: left; padding: 12px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
    .ut td { padding: 14px 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
    .db { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; transition: opacity var(--tr); display: inline-flex; align-items: center; gap: 4px; }
    .dba { background: var(--green-l); color: var(--green-d); }
    .dbr { background: var(--red-l); color: var(--red); }
    .dbv { background: var(--blue-l); color: #185FA5; }
    .btn { padding: 10px 18px; border-radius: var(--r-sm); font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .btn-g { background: var(--green); color: #fff; }
    .btn-gh { background: var(--surface-2); border: 1px solid var(--border); }
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border-2); border-radius: var(--r-sm); margin-bottom: 16px; font-family: var(--fb); }
    .fl { font-size: 12px; font-weight: 700; color: var(--txt-2); letter-spacing: .05em; text-transform: uppercase; margin-bottom: 6px; display: block; }
  `,document.head.appendChild(e)};function Fy({transactions:e,loading:t,onRefresh:n}){const[a,s]=p.useState(!1),i=a?e:e.slice(0,5);return t?r.jsx("div",{style:{padding:"20px",textAlign:"center",color:"var(--txt-3)"},children:"Loading transactions..."}):!e||e.length===0?r.jsx("div",{style:{padding:"20px",textAlign:"center",color:"var(--txt-3)"},children:"No transactions yet"}):r.jsxs("div",{children:[i.map(o=>r.jsxs("div",{className:"cr",children:[r.jsxs("div",{className:"ci",children:[r.jsxs("div",{className:"cn",style:{display:"flex",alignItems:"center",gap:8},children:[o.type==="deposit"&&r.jsx(nn,{size:14,color:"#378ADD"}),o.type==="donation_out"&&r.jsx($e,{size:14,color:"#E24B4A"}),o.type==="withdrawal_out"&&r.jsx(Wt,{size:14,color:"#f59e0b"}),o.type==="escrow_refund"&&r.jsx(Wr,{size:14,color:"#1D9E75"}),r.jsx("span",{children:o.description||o.type.replace("_"," ").toUpperCase()})]}),r.jsxs("div",{className:"cm",children:[r.jsx(Br,{size:10}),new Date(o.created_at).toLocaleDateString()]})]}),r.jsxs("div",{style:{fontWeight:700,color:o.amount>0?"var(--green)":"var(--red)"},children:[o.amount>0?"+":"",Zt(o.amount).toFixed(2)]})]},o.id)),e.length>5&&r.jsxs("button",{className:"card-a",onClick:()=>s(!a),style:{marginTop:12},children:[a?"Show less":`View all (${e.length})`,r.jsx(ni,{size:12})]}),r.jsxs("button",{className:"card-a",onClick:n,style:{marginTop:8},children:[r.jsx(Wr,{size:12})," Refresh"]})]})}function $y({campaign:e,onClick:t}){const n=Zt(e.raised)/Zt(e.goal)*100;return r.jsxs("div",{className:"campaign-card",onClick:()=>t(e.id),children:[r.jsx("div",{className:"campaign-card-title",children:e.title}),r.jsx("div",{className:"campaign-card-progress",children:r.jsx("div",{className:"pb",children:r.jsx("div",{className:"pf",style:{width:`${Math.min(n,100)}%`}})})}),r.jsxs("div",{className:"campaign-card-stats",children:[r.jsxs("span",{children:["$",Zt(e.raised).toLocaleString()," raised"]}),r.jsxs("span",{className:"badge ba",children:[Math.round(n),"%"]})]})]})}function Oy(){Ly();const{currentUser:e,logout:t,showToast:n,walletBalance:a,refreshWallet:s}=Oe(),i=lt(),[o,l]=p.useState("overview"),[c,d]=p.useState(!0),[m,f]=p.useState(!1),[x,b]=p.useState(!1),[w,k]=p.useState([]),[N,g]=p.useState(0),[u,h]=p.useState([]),[y,S]=p.useState([]),[C,E]=p.useState([]),[I,H]=p.useState(!1),[R,ne]=p.useState([]),[de,ie]=p.useState(""),[Me,q]=p.useState(!1),[oe,Z]=p.useState(null),[T,B]=p.useState(!1),U=p.useRef(),[J,ee]=p.useState(""),[je,ue]=p.useState("bank"),[Se,L]=p.useState(""),[Q,Ce]=p.useState(!1),ye=p.useRef(null),P=p.useRef(null);p.useEffect(()=>{m?document.body.classList.add("dark-mode"):document.body.classList.remove("dark-mode")},[m]),p.useEffect(()=>{const D=se=>{x&&!se.target.closest(".mobile-sidebar")&&!se.target.closest(".mobile-menu-btn")&&b(!1)};return document.addEventListener("click",D),()=>document.removeEventListener("click",D)},[x]),p.useEffect(()=>{e?e.role!=="donor"&&i("/"):i("/")},[e,i]);const A=async()=>{d(!0);try{const[D,se,j,K,he]=await Promise.all([Dt.getMyDonations().catch(()=>({donations:[]})),nt.getMyDepositRequests().catch(()=>({requests:[]})),nt.getMyWithdrawals().catch(()=>({withdrawals:[]})),nt.getTransactions().catch(()=>({transactions:[]})),Pt.getAll({status:"approved"}).catch(()=>({campaigns:[]}))]);k(D.donations||[]),h(se.requests||[]),S(j.withdrawals||[]),E(K.transactions||[]),ne(he.campaigns||[]);const Y=(D.donations||[]).reduce((fn,Xa)=>fn+Zt(Xa.amount),0);g(Y)}catch(D){console.error("Data load error:",D),n("Error loading dashboard data",!0)}finally{d(!1)}},V=async()=>{H(!0);try{const D=await nt.getTransactions();E(D.transactions||[])}catch(D){console.warn("Failed to fetch transactions:",D.message)}finally{H(!1)}};p.useEffect(()=>{const D=u.find(j=>["pending","instructions_sent","awaiting_proof"].includes(j.status));if(!D){ye.current&&clearInterval(ye.current);return}let se=D.status;return ye.current&&clearInterval(ye.current),ye.current=setInterval(async()=>{try{let j;try{if(j=(await nt.getDepositRequestById(D.id)).request,!j)return}catch{return}j.status!==se&&(j.status==="instructions_sent"?n(`Payment instructions for deposit #${D.id} are now available.`):j.status==="approved"?(n(`Deposit #${D.id} approved! Wallet credited.`),s(),A()):j.status==="rejected"&&n(`Deposit #${D.id} rejected.`,!0),se=j.status,h(K=>K.map(he=>he.id===D.id?j:he))),(j.status==="approved"||j.status==="rejected")&&clearInterval(ye.current)}catch(j){console.warn("Deposit polling error:",j)}},3e3),()=>{ye.current&&clearInterval(ye.current)}},[u,s,n,A]),p.useEffect(()=>{if(y.filter(j=>j.status==="pending").length===0)return;const se=setInterval(async()=>{try{const K=(await nt.getMyWithdrawals()).withdrawals||[];K.forEach(he=>{const Y=y.find(fn=>fn.id===he.id);Y&&Y.status!==he.status&&(he.status==="approved"&&n(`Withdrawal #${he.id} approved!`),he.status==="rejected"&&n(`Withdrawal #${he.id} rejected.`,!0))}),S(K)}catch(j){console.warn(j)}},5e3);return()=>clearInterval(se)},[y,n]),p.useEffect(()=>(P.current&&clearInterval(P.current),P.current=setInterval(()=>{s(),A()},1e4),()=>{P.current&&clearInterval(P.current)}),[s]),p.useEffect(()=>{e&&(A(),V())},[e]);const ce=async D=>{D.preventDefault();const se=Zt(de);if(se<1){n("Amount must be at least $1",!0);return}q(!0);try{const j=await nt.requestDeposit({amount:se});n(j.message),ie(""),await A()}catch(j){n(j.message,!0)}finally{q(!1)}},Re=async()=>{const D=u.find(se=>["pending","instructions_sent"].includes(se.status));if(!(!D||!oe)){B(!0);try{const se=new FormData;se.append("proof",oe);const j=await nt.uploadProof(D.id,se);n(j.message),Z(null),await A()}catch(se){n(se.message,!0)}finally{B(!1)}}},te=async D=>{D.preventDefault();const se=Zt(J);if(se<1){n("Amount must be at least $1",!0);return}if(se>a){n("Insufficient balance",!0);return}if(!Se.trim()){n("Payment details required",!0);return}Ce(!0);try{const j=await nt.requestWithdrawal({amount:se,payment_method:je,payment_details:Se});n(j.message),ee(""),L(""),s(),await A()}catch(j){n(j.message,!0)}finally{Ce(!1)}},Ve=()=>{t(),i("/")},Lt=()=>{l("donate")},Ct=D=>{i(`/campaign/${D}`)},F=((e==null?void 0:e.name)||"?").split(" ").map(D=>D[0]).join("").toUpperCase().slice(0,2),ae=u.find(D=>["pending","instructions_sent","awaiting_proof"].includes(D.status)),De=(e==null?void 0:e.is_verified)===!0,Et=[{id:"overview",label:"Home",icon:r.jsx(Vt,{size:20})},{id:"donations",label:"Donations",icon:r.jsx(We,{size:20})},{id:"donate",label:"Donate",icon:r.jsx(kn,{size:20})},{id:"wallet",label:"Wallet",icon:r.jsx(Xt,{size:20})},{id:"settings",label:"Settings",icon:r.jsx(pt,{size:20})}],qt=[{id:"overview",label:"Dashboard",icon:r.jsx(Vt,{size:18})},{id:"donations",label:"My Donations",icon:r.jsx(We,{size:18})},{id:"donate",label:"Donate Now",icon:r.jsx(kn,{size:18})},{id:"wallet",label:"Wallet",icon:r.jsx(Xt,{size:18})},{id:"settings",label:"Settings",icon:r.jsx(pt,{size:18})}];return r.jsxs("div",{className:"shell",children:[r.jsx("div",{className:`mobile-overlay ${x?"open":""}`,onClick:()=>b(!1)}),r.jsxs("div",{className:`mobile-sidebar ${x?"open":""}`,children:[r.jsx("div",{className:"sb-logo",children:r.jsxs("div",{className:"logo-mark",children:[r.jsx("div",{className:"logo-icon",children:r.jsx($e,{size:20,color:"#fff",strokeWidth:2})}),r.jsxs("div",{children:[r.jsx("div",{className:"logo-text",children:"HopeBridge"}),r.jsx("div",{className:"logo-sub",children:"Donor Portal"})]})]})}),r.jsxs("div",{className:"sb-user",children:[r.jsx("div",{className:"user-av",children:F}),r.jsxs("div",{children:[r.jsxs("div",{className:"user-name",children:[e==null?void 0:e.name,De&&r.jsxs("span",{className:"verified-badge",children:[r.jsx(pe,{size:12})," Verified"]})]}),r.jsx("div",{className:"user-badge",children:"Donor"})]})]}),r.jsxs("nav",{className:"sb-nav",children:[qt.map(D=>r.jsxs("button",{className:`nl ${o===D.id?"active":""}`,onClick:()=>{l(D.id),b(!1)},children:[D.icon,D.label]},D.id)),r.jsx("button",{className:"nl",onClick:()=>f(!m),children:m?"☀️ Light Mode":"🌙 Dark Mode"}),r.jsxs("button",{className:"nl",style:{color:"var(--red)"},onClick:Ve,children:[r.jsx(an,{size:18})," Sign Out"]})]})]}),r.jsxs("aside",{className:"sidebar",children:[r.jsx("div",{className:"sb-logo",children:r.jsxs("div",{className:"logo-mark",children:[r.jsx("div",{className:"logo-icon",children:r.jsx($e,{size:20,color:"#fff",strokeWidth:2})}),r.jsxs("div",{children:[r.jsx("div",{className:"logo-text",children:"HopeBridge"}),r.jsx("div",{className:"logo-sub",children:"Donor Portal"})]})]})}),r.jsxs("div",{className:"sb-user",children:[r.jsx("div",{className:"user-av",children:F}),r.jsxs("div",{children:[r.jsxs("div",{className:"user-name",children:[e==null?void 0:e.name,De&&r.jsx(pe,{size:14,className:"verified-badge"})]}),r.jsx("div",{className:"user-badge",children:"Donor"})]})]}),r.jsxs("nav",{className:"sb-nav",children:[r.jsx("div",{className:"nav-sec",children:"Main"}),r.jsxs("button",{className:`nl ${o==="overview"?"active":""}`,onClick:()=>l("overview"),children:[r.jsx(Vt,{size:18}),"Dashboard"]}),r.jsxs("button",{className:`nl ${o==="donations"?"active":""}`,onClick:()=>l("donations"),children:[r.jsx(We,{size:18}),"My Donations"]}),r.jsxs("button",{className:`nl ${o==="donate"?"active":""}`,onClick:()=>l("donate"),children:[r.jsx(kn,{size:18}),"Donate Now"]}),r.jsx("div",{className:"nav-sec",children:"Finance"}),r.jsxs("button",{className:`nl ${o==="wallet"?"active":""}`,onClick:()=>l("wallet"),children:[r.jsx(Xt,{size:18}),"Wallet",u.some(D=>["pending","instructions_sent"].includes(D.status))&&r.jsx("span",{className:"nb",children:"!"})]}),r.jsx("div",{className:"nav-sec",children:"Account"}),r.jsxs("button",{className:`nl ${o==="settings"?"active":""}`,onClick:()=>l("settings"),children:[r.jsx(pt,{size:18}),"Settings"]}),r.jsxs("button",{className:"nl",onClick:()=>f(!m),children:[m?r.jsx(ly,{size:18}):r.jsx(J0,{size:18}),m?"Light Mode":"Dark Mode"]})]}),r.jsx("div",{className:"sb-footer",children:r.jsxs("button",{className:"nl",style:{color:"var(--red)"},onClick:Ve,children:[r.jsx(an,{size:18}),"Sign Out"]})})]}),r.jsxs("div",{className:"main",children:[r.jsxs("div",{className:"topbar",children:[r.jsxs("div",{className:"tb-title",children:[o==="overview"&&"Dashboard",o==="donations"&&"My Donations",o==="donate"&&"Make a Donation",o==="wallet"&&"Wallet",o==="settings"&&"Settings"]}),r.jsxs("div",{className:"tb-actions",children:[r.jsx(Ur,{showToast:n}),r.jsx("button",{className:"tb-btn",onClick:()=>f(!m),children:m?"🌙":"☀️"}),r.jsx("div",{className:"tb-btn",onClick:()=>n("Profile"),children:r.jsx("div",{style:{width:38,height:38,background:"linear-gradient(135deg,var(--green),var(--green-d))",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",fontWeight:700,color:"#fff"},children:F})})]})]}),r.jsxs("div",{className:"mob-top",children:[r.jsx("button",{className:"mobile-menu-btn",onClick:()=>b(!0),children:r.jsx(Qa,{size:24})}),r.jsx("div",{style:{fontFamily:"var(--fd)",fontSize:18,flex:1,textAlign:"center"},children:"HopeBridge"}),r.jsxs("div",{className:"tb-actions",children:[r.jsx(Ur,{showToast:n}),r.jsx("button",{className:"tb-btn",onClick:()=>f(!m),children:m?"🌙":"☀️"})]})]}),r.jsxs("div",{className:"page",children:[c&&r.jsx("div",{style:{padding:"8px 16px",background:"var(--green)",color:"#fff",borderRadius:6,marginBottom:12},children:"Loading your data..."}),r.jsxs("div",{className:`ps ${o==="overview"?"active":""}`,children:[r.jsxs("div",{className:"stats-grid",children:[r.jsxs("div",{className:"sc",onClick:()=>l("wallet"),children:[r.jsx("div",{className:"si",children:r.jsx(Xt,{size:18})}),r.jsxs("div",{className:"sv",children:["$",a.toLocaleString()]}),r.jsx("div",{className:"sl",children:"Wallet Balance"}),r.jsx("div",{className:"sd",children:"Click to manage →"})]}),r.jsxs("div",{className:"sc",onClick:()=>l("donations"),children:[r.jsx("div",{className:"si",children:r.jsx(We,{size:18})}),r.jsxs("div",{className:"sv",children:["$",N.toLocaleString()]}),r.jsx("div",{className:"sl",children:"Total Donated"}),r.jsx("div",{className:"sd",children:"Click to view →"})]}),r.jsxs("div",{className:"sc",onClick:()=>l("donations"),children:[r.jsx("div",{className:"si",children:r.jsx($e,{size:18})}),r.jsx("div",{className:"sv",children:w.length}),r.jsx("div",{className:"sl",children:"Donations Made"}),r.jsx("div",{className:"sd",children:"Click to view →"})]}),r.jsxs("div",{className:"sc",onClick:Lt,children:[r.jsx("div",{className:"si",children:r.jsx(Kn,{size:18})}),r.jsx("div",{className:"sv",children:R.length}),r.jsx("div",{className:"sl",children:"Active Campaigns"}),r.jsx("div",{className:"sd",children:"Click to donate →"})]})]}),r.jsxs("div",{className:"card",children:[r.jsxs("div",{className:"card-h",children:[r.jsxs("div",{className:"card-t",children:[r.jsx(Ge,{size:18})," Support a Campaign"]}),r.jsxs("button",{className:"card-a",onClick:Lt,children:["Browse all ",r.jsx(In,{size:14})]})]}),r.jsxs("div",{className:"card-b",children:[R.slice(0,3).map(D=>r.jsx($y,{campaign:D,onClick:Ct},D.id)),R.length===0&&r.jsx("div",{className:"cr",style:{color:"var(--txt-3)"},children:"No active campaigns available"})]})]}),r.jsxs("div",{className:"card",children:[r.jsxs("div",{className:"card-h",children:[r.jsxs("div",{className:"card-t",children:[r.jsx(La,{size:18})," Recent Donations"]}),r.jsxs("button",{className:"card-a",onClick:()=>l("donations"),children:["View all ",r.jsx(In,{size:14})]})]}),r.jsxs("div",{className:"card-b",children:[w.slice(0,5).map(D=>r.jsxs("div",{className:"cr",children:[r.jsxs("div",{className:"ci",children:[r.jsx("div",{className:"cn",children:D.campaign_title||`Campaign #${D.campaign_id}`}),r.jsxs("div",{className:"cm",children:[r.jsx(Br,{size:10})," ",new Date(D.created_at).toLocaleDateString()]})]}),r.jsxs("div",{className:"badge ba",children:["+$",Zt(D.amount).toFixed(2)]})]},D.id)),w.length===0&&r.jsx("div",{className:"cr",children:"No donations yet"})]})]})]}),r.jsx("div",{className:`ps ${o==="donations"?"active":""}`,children:r.jsxs("div",{className:"card",children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx(We,{size:18})," All Donations"]})}),r.jsx("div",{className:"card-b",style:{padding:0,overflowX:"auto"},children:r.jsxs("table",{className:"ut",style:{minWidth:500},children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Campaign"}),r.jsx("th",{children:"Amount"}),r.jsx("th",{children:"Date"}),r.jsx("th",{children:"Status"})]})}),r.jsxs("tbody",{children:[w.map(D=>r.jsxs("tr",{children:[r.jsx("td",{style:{cursor:"pointer"},onClick:()=>Ct(D.campaign_id),children:r.jsx("span",{style:{color:"var(--green)",textDecoration:"underline"},children:D.campaign_title||`Campaign #${D.campaign_id}`})}),r.jsxs("td",{children:["$",Zt(D.amount).toFixed(2)]}),r.jsx("td",{children:new Date(D.created_at).toLocaleDateString()}),r.jsx("td",{children:r.jsx("span",{className:"badge ba",children:D.escrow_status||"held"})})]},D.id)),w.length===0&&r.jsx("tr",{children:r.jsx("td",{colSpan:"4",style:{textAlign:"center",padding:"40px"},children:"No donations yet"})})]})]})})]})}),r.jsx("div",{className:`ps ${o==="donate"?"active":""}`,children:r.jsxs("div",{className:"card",children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx(kn,{size:18})," Make a Donation"]})}),r.jsx("div",{className:"card-b",children:r.jsx(_c,{})})]})}),r.jsxs("div",{className:`ps ${o==="wallet"?"active":""}`,children:[r.jsxs("div",{className:"card",children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx(nn,{size:18})," Deposit Funds"]})}),r.jsx("div",{className:"card-b",children:ae?r.jsxs("div",{children:[r.jsxs("div",{style:{background:"#eff6ff",borderRadius:12,padding:16,marginBottom:16},children:[r.jsxs("div",{children:[r.jsxs("strong",{children:["Pending Deposit #",ae.id]})," – $",ae.amount]}),r.jsxs("div",{children:["Status: ",r.jsx("span",{style:{color:My(ae.status)},children:Ry(ae.status)})]}),ae.admin_instructions&&r.jsxs("div",{style:{marginTop:12,background:"#dbeafe",padding:12,borderRadius:8},children:[r.jsx("strong",{children:"Instructions:"}),r.jsx("br",{}),ae.admin_instructions]})]}),(ae.status==="pending"||ae.status==="instructions_sent")&&!ae.proof_image_url&&r.jsxs(r.Fragment,{children:[r.jsx("input",{type:"file",ref:U,accept:"image/*",style:{display:"none"},onChange:D=>Z(D.target.files[0])}),oe?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[r.jsx(bl,{size:16})," ",oe.name,r.jsx("button",{className:"db dbr",onClick:()=>Z(null),children:"Remove"})]}):r.jsxs("button",{className:"db dba",onClick:()=>{var D;return(D=U.current)==null?void 0:D.click()},children:[r.jsx(ju,{size:12})," Select Proof Image"]}),oe&&r.jsx("button",{className:"btn btn-g",onClick:Re,disabled:T,style:{marginTop:12},children:T?"Uploading...":r.jsxs(r.Fragment,{children:[r.jsx(ju,{size:14})," Upload Proof"]})})]}),ae.status==="awaiting_proof"&&r.jsxs("div",{children:[r.jsx(pe,{size:14})," Proof submitted, waiting for admin verification."]})]}):r.jsxs("form",{onSubmit:ce,children:[r.jsx("label",{className:"fl",children:"Amount (USD)"}),r.jsx("input",{type:"number",min:"1",step:"0.01",value:de,onChange:D=>ie(D.target.value),required:!0,className:"fi",placeholder:"Min $1"}),r.jsx("div",{style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"},children:[20,50,100,200,500].map(D=>r.jsxs("button",{type:"button",onClick:()=>ie(D),style:{padding:"6px 12px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:6},children:["$",D]},D))}),r.jsx("button",{type:"submit",className:"btn btn-g",disabled:Me,children:Me?"Submitting...":r.jsxs(r.Fragment,{children:[r.jsx(Fa,{size:14})," Request Deposit"]})})]})})]}),r.jsxs("div",{className:"card",children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx(Wt,{size:18})," Withdraw Funds"]})}),r.jsxs("div",{className:"card-b",children:[r.jsxs("div",{style:{marginBottom:12,background:"#fef9c3",padding:12,borderRadius:8},children:["Available: ",r.jsxs("strong",{children:["$",a.toFixed(2)]})]}),r.jsxs("form",{onSubmit:te,children:[r.jsx("label",{className:"fl",children:"Amount (USD)"}),r.jsx("input",{type:"number",min:"1",step:"0.01",max:a,value:J,onChange:D=>ee(D.target.value),required:!0,className:"fi"}),r.jsx("label",{className:"fl",children:"Payment Method"}),r.jsxs("select",{className:"fi",value:je,onChange:D=>ue(D.target.value),children:[r.jsxs("option",{value:"bank",children:[r.jsx(L0,{size:14})," Bank Transfer"]}),r.jsxs("option",{value:"mobile_money",children:[r.jsx(iy,{size:14})," Mobile Money"]}),r.jsxs("option",{value:"paypal",children:[r.jsx(nn,{size:14})," PayPal"]})]}),r.jsx("label",{className:"fl",children:"Payment Details"}),r.jsx("textarea",{className:"fi",rows:"2",placeholder:je==="bank"?"Account name, number, bank name":je==="mobile_money"?"Phone number & network":"PayPal email",value:Se,onChange:D=>L(D.target.value),required:!0}),r.jsx("button",{type:"submit",className:"btn btn-g",disabled:Q,children:Q?"Submitting...":r.jsxs(r.Fragment,{children:[r.jsx(Fa,{size:14})," Request Withdrawal"]})})]})]})]}),r.jsxs("div",{className:"card",children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx(La,{size:18})," Transaction History"]})}),r.jsx("div",{className:"card-b",children:r.jsx(Fy,{transactions:C,loading:I,onRefresh:V})})]})]}),r.jsx("div",{className:`ps ${o==="settings"?"active":""}`,children:r.jsxs("div",{className:"card",children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx($a,{size:18})," Profile Settings"]})}),r.jsxs("div",{className:"card-b",children:[r.jsx("label",{className:"fl",children:"Display Name"}),r.jsx("input",{className:"fi",type:"text",defaultValue:e==null?void 0:e.name}),r.jsx("label",{className:"fl",children:"Email"}),r.jsx("input",{className:"fi",type:"email",defaultValue:e==null?void 0:e.email}),r.jsxs("div",{className:"verified-status",style:{marginBottom:16,padding:"8px 12px",background:De?"var(--green-l)":"var(--amber-l)",borderRadius:8,display:"flex",alignItems:"center",gap:8},children:[De?r.jsx(pe,{size:16,color:"var(--green-d)"}):r.jsx(ri,{size:16,color:"#854F0B"}),r.jsx("span",{style:{fontSize:13,color:De?"var(--green-d)":"#854F0B"},children:De?"Your account is verified":"Your account is not yet verified. Contact support for verification."})]}),r.jsx("button",{className:"btn btn-g",onClick:()=>n("Profile update coming soon"),children:"Save Changes"})]})]})})]})]}),r.jsx("div",{className:"mobile-bottom-nav",children:r.jsx("div",{className:"mobile-bottom-nav-inner",children:Et.map(D=>r.jsxs("button",{className:`mobile-nav-item ${o===D.id?"active":""}`,onClick:()=>l(D.id),children:[D.icon,r.jsx("span",{children:D.label})]},D.id))})})]})}function By({campaign:e,onClose:t}){const{createCampaign:n,updateCampaign:a,showToast:s}=Oe(),[i,o]=p.useState((e==null?void 0:e.title)||""),[l,c]=p.useState((e==null?void 0:e.description)||""),[d,m]=p.useState((e==null?void 0:e.goal)||""),[f,x]=p.useState((e==null?void 0:e.image_url)||""),[b,w]=p.useState(null),[k,N]=p.useState((e==null?void 0:e.category)||"General"),[g,u]=p.useState(!1),h=["Education","Water","Health","Environment","Food","Shelter","General"],y=async C=>{if(C.preventDefault(),console.log("===== CAMPAIGN SUBMIT DEBUG ====="),console.log("Title:",i),console.log("Goal:",d),console.log("Category:",k),console.log("Image File:",b),console.log("Image URL:",f),console.log("================================"),!i||!d||d<10){s("Title and goal (min $10) required",!0);return}u(!0);try{const E=new FormData;E.append("title",i),E.append("description",l||""),E.append("goal",parseFloat(d)),E.append("category",k),b&&b instanceof File?(E.append("image",b),console.log("✅ Appending image file:",b.name,b.size,"bytes",b.type)):f?(E.append("image_url",f),console.log("✅ Appending image URL:",f)):console.log("⚠️ No image provided"),console.log("📋 FormData contents:");for(let I of E.entries())I[1]instanceof File?console.log(`   ${I[0]}: [FILE] ${I[1].name} (${I[1].size} bytes)`):console.log(`   ${I[0]}: ${I[1]}`);e?(console.log("Updating campaign ID:",e.id),await a(e.id,E)):(console.log("Creating new campaign"),await n(E)),console.log("✅ Campaign saved successfully"),t()}catch(E){console.error("❌ Campaign submission error:",E),s(E.message||"Failed to save campaign",!0)}finally{u(!1)}},S=C=>{const E=C.target.files[0];if(console.log("File selected:",E),E){if(E.size>5*1024*1024){s("Image too large. Please use a file under 5MB.",!0),C.target.value="";return}if(!E.type.startsWith("image/")){s("Please select an image file (JPG, PNG, WebP)",!0),C.target.value="";return}w(E),x("")}};return r.jsx("div",{className:"modal-overlay",onClick:C=>C.target===C.currentTarget&&t(),children:r.jsxs("div",{className:"modal-box",style:{maxWidth:550,maxHeight:"90vh",overflowY:"auto"},children:[r.jsx("h3",{children:e?"Edit Campaign":"Create Campaign"}),r.jsxs("form",{onSubmit:y,children:[r.jsxs("div",{className:"mf-field",children:[r.jsx("label",{children:"Title *"}),r.jsx("input",{type:"text",value:i,onChange:C=>o(C.target.value),required:!0})]}),r.jsxs("div",{className:"mf-field",children:[r.jsx("label",{children:"Description"}),r.jsx("textarea",{rows:"3",value:l,onChange:C=>c(C.target.value)})]}),r.jsxs("div",{className:"mf-field",children:[r.jsx("label",{children:"Goal ($) *"}),r.jsx("input",{type:"number",min:"10",step:"10",value:d,onChange:C=>m(C.target.value),required:!0})]}),r.jsxs("div",{className:"mf-field",children:[r.jsx("label",{children:"Category"}),r.jsx("select",{className:"form-ctrl",style:{marginBottom:0},value:k,onChange:C=>N(C.target.value),children:h.map(C=>r.jsx("option",{value:C,children:C},C))})]}),b&&r.jsxs("div",{className:"mf-field",style:{marginTop:16},children:[r.jsx("label",{children:"Selected Image:"}),r.jsxs("div",{style:{border:"1px solid #e5e7eb",borderRadius:8,padding:8,background:"#f9fafb"},children:[r.jsx("img",{src:URL.createObjectURL(b),alt:"Preview",style:{maxWidth:"100%",maxHeight:150,objectFit:"contain",display:"block",margin:"0 auto"}}),r.jsxs("p",{style:{fontSize:12,color:"#666",marginTop:8,textAlign:"center"},children:[b.name," (",(b.size/1024).toFixed(1)," KB)"]})]})]}),r.jsxs("div",{className:"mf-field",style:{marginTop:16},children:[r.jsx("label",{children:"Upload Image (JPG, PNG, WebP, max 5MB)"}),r.jsx("input",{type:"file",accept:"image/jpeg,image/jpg,image/png,image/webp",onChange:S,style:{width:"100%",padding:"8px 0"}}),r.jsx("small",{style:{color:"#6b7280",fontSize:11},children:b?`Selected: ${b.name}`:"Choose an image file..."})]}),r.jsxs("div",{className:"mf-field",children:[r.jsx("label",{children:"Or Image URL"}),r.jsx("input",{type:"text",value:f,onChange:C=>{x(C.target.value),C.target.value&&w(null)},placeholder:"https://example.com/image.jpg",disabled:!!b})]}),r.jsxs("div",{style:{display:"flex",gap:12,marginTop:18},children:[r.jsx("button",{type:"button",className:"btn-outline-custom",onClick:t,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-primary-custom",disabled:g,children:g?"Saving...":"Save Campaign"})]})]})]})})}function Wy({campaign:e,onClose:t}){const{showToast:n}=Oe(),[a,s]=p.useState([]),[i,o]=p.useState(0),[l,c]=p.useState(!0);return p.useEffect(()=>{Dt.getCampaignDons(e.id).then(d=>{s(d.donations),o(d.total)}).catch(d=>n(d.message,!0)).finally(()=>c(!1))},[e.id]),r.jsx("div",{className:"modal-overlay",onClick:d=>d.target===d.currentTarget&&t(),children:r.jsxs("div",{className:"modal-box",style:{maxWidth:620},children:[r.jsxs("h3",{children:["Donations — ",e.title]}),l?r.jsx("p",{style:{color:"var(--text-light)",padding:20},children:"Loading..."}):a.length===0?r.jsx("p",{style:{color:"var(--text-light)",textAlign:"center",padding:20},children:"No donations yet."}):r.jsxs(r.Fragment,{children:[r.jsxs("table",{className:"admin-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Donor"}),r.jsx("th",{children:"Amount"}),r.jsx("th",{children:"Date"}),r.jsx("th",{children:"Monthly"})]})}),r.jsx("tbody",{children:a.map(d=>r.jsxs("tr",{children:[r.jsx("td",{children:d.donor_name}),r.jsxs("td",{children:["$",parseFloat(d.amount).toLocaleString()]}),r.jsx("td",{children:new Date(d.created_at).toLocaleDateString()}),r.jsx("td",{children:d.is_monthly?"✅":"—"})]},d.id))})]}),r.jsxs("p",{style:{marginTop:14,fontWeight:700,color:"var(--dark)"},children:["Total raised: $",parseFloat(i).toLocaleString()]})]}),r.jsx("button",{className:"btn-outline-custom",style:{marginTop:16},onClick:t,children:"Close"})]})})}let Su=!1;const Uy=()=>{if(Su)return;Su=!0;const e=document.createElement("style");e.textContent=`
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    :root {
      --green: #1D9E75; --green-d: #0F6E56; --green-dd: #085041; --green-l: #E1F5EE; --green-m: #9FE1CB;
      --red: #E24B4A; --red-l: #FCEBEB; --amber: #EF9F27; --amber-l: #FAEEDA; --blue: #378ADD; --blue-l: #E6F1FB;
      --bg: #EEF1F5; --surface: #FFFFFF; --surface-2: #F6F8FA; --border: rgba(0,0,0,0.07); --border-2: rgba(0,0,0,0.13);
      --txt: #111318; --txt-2: #5A6272; --txt-3: #9AA3B2;
      --sidebar-w: 260px; --topbar-h: 64px; --bottom-nav: 68px;
      --r-sm: 10px; --r-md: 14px; --r-lg: 20px; --r-xl: 26px;
      --sh-sm: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
      --fd: 'Instrument Serif', Georgia, serif; --fb: 'DM Sans', sans-serif; --tr: 0.2s ease;
    }
    body { font-family: var(--fb); background: var(--bg); color: var(--txt); min-height: 100vh; }
    
    /* Dark Mode Support */
    body.dark-mode {
      --bg: #121212; --surface: #1E1E1E; --surface-2: #2A2A2A; --border: rgba(255,255,255,0.1);
      --txt: #EEEEEE; --txt-2: #AAAAAA; --txt-3: #777777;
    }
    
    .shell { display: flex; min-height: 100vh; }
    .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 200; overflow-y: auto; }
    .sb-logo { padding: 22px 20px 14px; border-bottom: 1px solid var(--border); }
    .logo-mark { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-icon { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green); display: flex; align-items: center; justify-content: center; }
    .logo-icon svg { width: 20px; height: 20px; stroke: #fff; stroke-width: 2; fill: none; }
    .logo-text { font-family: var(--fd); font-size: 19px; color: var(--txt); }
    .logo-sub { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--txt-3); }
    .sb-creator { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
    .creator-av { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--green), var(--green-d)); display: flex; align-items: center; justify-content: center; font-weight: 600; color: #fff; }
    .creator-name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .verified-badge { color: #378ADD; background: rgba(55,138,221,0.15); border-radius: 20px; padding: 2px 8px; display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; }
    .creator-badge { font-size: 11px; color: var(--txt-3); background: var(--green-l); padding: 2px 8px; border-radius: 20px; display: inline-block; margin-top: 4px; }
    .sb-nav { flex: 1; padding: 10px; }
    .nav-sec { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--txt-3); padding: 10px 10px 4px; }
    .nl { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--r-sm); cursor: pointer; border: none; background: none; width: 100%; text-align: left; color: var(--txt-2); font-size: 13.5px; font-weight: 500; transition: all var(--tr); }
    .nl:hover { background: var(--bg); color: var(--txt); }
    .nl.active { background: var(--green-l); color: var(--green-d); font-weight: 600; }
    .nl svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.8; fill: none; }
    .nb { margin-left: auto; font-size: 10px; font-weight: 700; background: var(--amber); color: #fff; padding: 2px 7px; border-radius: 20px; }
    .sb-footer { padding: 12px 10px; border-top: 1px solid var(--border); }
    .main { flex: 1; margin-left: var(--sidebar-w); }
    .topbar { height: var(--topbar-h); background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 16px; position: sticky; top: 0; z-index: 100; }
    .tb-title { font-family: var(--fd); font-size: 22px; flex: 1; }
    .tb-actions { display: flex; gap: 10px; }
    .tb-btn { width: 38px; height: 38px; border-radius: var(--r-sm); background: var(--surface-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background var(--tr); }
    .tb-btn svg { width: 18px; height: 18px; stroke: var(--txt-2); }
    .page { padding: 28px; }
    .ps { display: none; }
    .ps.active { display: block; }
    
    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--txt);
    }
    
    .mobile-sidebar {
      position: fixed;
      top: 0;
      left: -280px;
      width: 280px;
      height: 100vh;
      background: var(--surface);
      z-index: 300;
      transition: left 0.3s ease;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      overflow-y: auto;
    }
    
    .mobile-sidebar.open {
      left: 0;
    }
    
    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 299;
      display: none;
    }
    
    .mobile-overlay.open {
      display: block;
    }
    
    /* Mobile Bottom Navigation */
    .mobile-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--surface);
      border-top: 1px solid var(--border);
      z-index: 200;
      padding: 8px 16px;
      padding-bottom: env(safe-area-inset-bottom, 8px);
    }
    
    .mobile-bottom-nav-inner {
      display: flex;
      justify-content: space-around;
      align-items: center;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .mobile-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: var(--r-md);
      transition: all 0.2s;
      color: var(--txt-3);
      font-size: 10px;
      font-weight: 600;
      position: relative;
    }
    
    .mobile-nav-item.active {
      color: var(--green);
      background: var(--green-l);
    }
    
    .mobile-nav-item svg {
      width: 22px;
      height: 22px;
    }
    
    .mobile-nav-badge {
      position: absolute;
      top: 2px;
      right: 5px;
      background: var(--red);
      color: #fff;
      font-size: 9px;
      border-radius: 50%;
      min-width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; }
      .topbar { display: none; }
      .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
      .mob-top { display: flex; height: 58px; background: var(--surface); align-items: center; padding: 0 16px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border); }
      .mobile-bottom-nav { display: block; }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .card-h { flex-direction: column; gap: 8px; align-items: flex-start; }
      .ut { display: block; overflow-x: auto; white-space: nowrap; }
    }
    
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    .sc { background: var(--surface); border-radius: var(--r-lg); padding: 20px; box-shadow: var(--sh-sm); position: relative; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
    .sc:hover { transform: translateY(-2px); }
    .sc .si { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green-l); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .sc .si svg { stroke: var(--green-d); width: 18px; height: 18px; }
    .sv { font-family: var(--fd); font-size: 32px; line-height: 1; }
    .sl { font-size: 12px; color: var(--txt-2); margin-top: 4px; }
    .sd { font-size: 11px; font-weight: 700; margin-top: 8px; color: var(--green); }
    .card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh-sm); overflow: hidden; margin-bottom: 24px; }
    .card-h { display: flex; justify-content: space-between; padding: 18px 20px 14px; border-bottom: 1px solid var(--border); }
    .card-t { font-family: var(--fd); font-size: 17px; display: flex; align-items: center; gap: 8px; }
    .card-a { font-size: 12px; font-weight: 600; color: var(--green); background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    .card-b { padding: 16px 20px; }
    .badge { font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; }
    .ba { background: var(--green-l); color: var(--green-d); }
    .bp { background: var(--amber-l); color: #854F0B; }
    .br { background: var(--blue-l); color: #185FA5; }
    .bx { background: var(--red-l); color: var(--red); }
    .cr { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .cr:last-child { border-bottom: none; }
    .ci { flex: 1; }
    .cn { font-weight: 600; font-size: 14px; }
    .cm { font-size: 11px; color: var(--txt-3); margin-top: 2px; display: flex; align-items: center; gap: 4px; }
    .pb { height: 4px; background: var(--bg); border-radius: 2px; margin-top: 6px; overflow: hidden; }
    .pf { height: 100%; background: var(--green); border-radius: 2px; }
    .ut { width: 100%; border-collapse: collapse; }
    .ut th { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--txt-3); text-align: left; padding: 12px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
    .ut td { padding: 14px 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
    .db { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; transition: opacity var(--tr); margin-right: 4px; display: inline-flex; align-items: center; gap: 4px; }
    .dba { background: var(--green-l); color: var(--green-d); }
    .dbr { background: var(--red-l); color: var(--red); }
    .dbv { background: var(--blue-l); color: #185FA5; }
    .btn { padding: 10px 18px; border-radius: var(--r-sm); font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .btn-g { background: var(--green); color: #fff; }
    .btn-gh { background: var(--surface-2); border: 1px solid var(--border); }
    .modal-bd { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity .25s; }
    .modal-bd.open { opacity: 1; pointer-events: all; }
    .modal { background: var(--surface); border-radius: var(--r-xl); padding: 28px; width: 90%; max-width: 420px; }
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border-2); border-radius: var(--r-sm); margin-bottom: 16px; font-family: var(--fb); }
  `,document.head.appendChild(e)};function Hy({transactions:e,loading:t,onRefresh:n}){const[a,s]=p.useState(!1),i=a?e:e.slice(0,5);return t?r.jsx("div",{style:{padding:"20px",textAlign:"center",color:"var(--txt-3)"},children:"Loading transactions..."}):!e||e.length===0?r.jsx("div",{style:{padding:"20px",textAlign:"center",color:"var(--txt-3)"},children:"No transactions yet"}):r.jsxs("div",{children:[i.map(o=>r.jsxs("div",{className:"cr",children:[r.jsxs("div",{className:"ci",children:[r.jsxs("div",{className:"cn",style:{display:"flex",alignItems:"center",gap:8},children:[o.type==="escrow_release"&&r.jsx(pe,{size:14,color:"#1D9E75"}),o.type==="withdrawal_out"&&r.jsx(Wt,{size:14,color:"#E24B4A"}),o.type==="deposit"&&r.jsx(nn,{size:14,color:"#378ADD"}),r.jsx("span",{children:o.description||o.type.replace("_"," ").toUpperCase()})]}),r.jsxs("div",{className:"cm",children:[r.jsx(Br,{size:10}),new Date(o.created_at).toLocaleDateString()]})]}),r.jsxs("div",{style:{fontWeight:700,color:o.amount>0?"var(--green)":"var(--red)"},children:[o.amount>0?"+":"",parseFloat(o.amount).toFixed(2)]})]},o.id)),e.length>5&&r.jsxs("button",{className:"card-a",onClick:()=>s(!a),style:{marginTop:12},children:[a?"Show less":`View all (${e.length})`,r.jsx(ni,{size:12})]}),r.jsxs("button",{className:"card-a",onClick:n,style:{marginTop:8},children:[r.jsx(Wr,{size:12})," Refresh"]})]})}function Vy(){Uy();const{currentUser:e,myCampaigns:t,loadMyCampaigns:n,deleteCampaign:a,logout:s,showToast:i}=Oe(),o=lt(),[l,c]=p.useState("overview"),[d,m]=p.useState(!1),[f,x]=p.useState(null),[b,w]=p.useState(null),[k,N]=p.useState(!1),[g,u]=p.useState(null),[h,y]=p.useState(""),[S,C]=p.useState(!1),[E,I]=p.useState(!1),[H,R]=p.useState([]),[ne,de]=p.useState([]),[ie,Me]=p.useState(0),[q,oe]=p.useState(0),[Z,T]=p.useState([]),[B,U]=p.useState(!1),[J,ee]=p.useState({paypal_email:"",account_name:"",account_number:"",bank_name:""}),[je,ue]=p.useState(!1),[Se,L]=p.useState(!0);p.useEffect(()=>{S?document.body.classList.add("dark-mode"):document.body.classList.remove("dark-mode")},[S]),p.useEffect(()=>{if(!e){o("/");return}if(e.role!=="creator"){o("/");return}Ce(),ye(),Q()},[e]),p.useEffect(()=>{const j=K=>{E&&!K.target.closest(".mobile-sidebar")&&!K.target.closest(".mobile-menu-btn")&&I(!1)};return document.addEventListener("click",j),()=>document.removeEventListener("click",j)},[E]);const Q=async()=>{U(!0);try{const j=await nt.getTransactions();T(j.transactions||[])}catch(j){console.warn("Failed to fetch transactions:",j.message)}finally{U(!1)}},Ce=async()=>{L(!0);try{await n();let j={donations:[]};try{const Y=await Dt.getMyDonations();j={donations:Array.isArray(Y)?Y:Array.isArray(Y==null?void 0:Y.donations)?Y.donations:[]}}catch(Y){console.warn("Failed to fetch donations:",Y.message)}let K={requests:[]};try{const Y=await Dt.getMyPayoutRequests();K={requests:Array.isArray(Y)?Y:Array.isArray(Y==null?void 0:Y.requests)?Y.requests:[]}}catch(Y){console.warn("Failed to fetch payout requests:",Y.message)}let he={balance:0,total_earned:0};try{const Y=await Dt.getCreatorWallet();he={balance:parseFloat((Y==null?void 0:Y.balance)??0),total_earned:parseFloat((Y==null?void 0:Y.total_earned)??0)}}catch(Y){console.warn("Failed to fetch wallet:",Y.message)}R(j.donations),de(K.requests),Me(he.balance),oe(he.total_earned)}catch(j){console.error("Error loading data:",j),i("Error loading data",!0)}finally{L(!1)}},ye=async()=>{try{const j=await Dt.getCreatorPaymentMethod();j!=null&&j.payment_method&&ee(j.payment_method)}catch(j){console.warn("Failed to load payment method:",j.message)}},P=async j=>{j.preventDefault(),ue(!0);try{await Dt.saveCreatorPaymentMethod(J),i("Payment method saved")}catch(K){i(K.message,!0)}finally{ue(!1)}},A=async()=>{const j=parseFloat(h);if(isNaN(j)||j<=0){i("Enter a valid amount",!0);return}try{await Dt.updateCampaignProgress(g,{raised:j}),i("Progress updated"),N(!1),await Ce()}catch(K){i(K.message,!0)}},V=async j=>{if(window.confirm("Delete this campaign permanently? This action cannot be undone."))try{await a(j),i("Campaign deleted"),await Ce()}catch(K){i(K.message,!0)}},ce=async()=>{const j=parseFloat(prompt("Amount to withdraw (USD)","100"));if(!j||j<=0)return;const K=prompt("Payment method (bank, paypal, mobile_money):","bank");if(!K)return;const he=prompt("Payment details (account number/email/phone):","");if(!he){i("Payment details required",!0);return}try{await Dt.requestPayout({amount:j,payment_method:K,payment_details:he}),i(`Withdrawal request of $${j} submitted`),await Ce()}catch(Y){i(Y.message,!0)}},Re=()=>{s(),o("/")},te=Array.isArray(t)?t:[],Ve=Array.isArray(H)?H:[],Lt=Array.isArray(ne)?ne:[],Ct=((e==null?void 0:e.name)||"?").split(" ").map(j=>j[0]).join("").toUpperCase().slice(0,2),F=te.reduce((j,K)=>j+parseFloat(K.raised||0),0),ae=te.filter(j=>j.status==="approved"||j.status==="active").length,De=Lt.filter(j=>j.status==="pending"),Et=De.reduce((j,K)=>j+parseFloat(K.amount||0),0),qt=(e==null?void 0:e.is_verified)===!0,D=[{id:"overview",label:"Home",icon:r.jsx(Vt,{size:20})},{id:"campaigns",label:"Campaigns",icon:r.jsx(Ge,{size:20}),badge:te.length},{id:"donations",label:"Donations",icon:r.jsx(We,{size:20})},{id:"wallet",label:"Wallet",icon:r.jsx(Xt,{size:20})},{id:"settings",label:"Settings",icon:r.jsx(pt,{size:20})}],se=[{id:"overview",label:"Dashboard",icon:r.jsx(Vt,{size:18})},{id:"campaigns",label:"My Campaigns",icon:r.jsx(Ge,{size:18}),badge:te.length},{id:"donations",label:"Donations",icon:r.jsx(We,{size:18})},{id:"payouts",label:"Payouts",icon:r.jsx(Wt,{size:18}),badge:De.length},{id:"wallet",label:"Wallet",icon:r.jsx(Xt,{size:18})},{id:"settings",label:"Settings",icon:r.jsx(pt,{size:18})}];return r.jsxs("div",{className:"shell",children:[r.jsx("div",{className:`mobile-overlay ${E?"open":""}`,onClick:()=>I(!1)}),r.jsxs("div",{className:`mobile-sidebar ${E?"open":""}`,children:[r.jsx("div",{className:"sb-logo",children:r.jsxs("div",{className:"logo-mark",children:[r.jsx("div",{className:"logo-icon",children:r.jsx($e,{size:20,color:"#fff",strokeWidth:2})}),r.jsxs("div",{children:[r.jsx("div",{className:"logo-text",children:"HopeBridge"}),r.jsx("div",{className:"logo-sub",children:"Creator Studio"})]})]})}),r.jsxs("div",{className:"sb-creator",children:[r.jsx("div",{className:"creator-av",children:Ct}),r.jsxs("div",{children:[r.jsxs("div",{className:"creator-name",children:[e==null?void 0:e.name,qt&&r.jsxs("span",{className:"verified-badge",children:[r.jsx(pe,{size:12})," Verified"]})]}),r.jsx("div",{className:"creator-badge",children:"Creator"})]})]}),r.jsxs("nav",{className:"sb-nav",children:[se.map(j=>r.jsxs("button",{className:`nl ${l===j.id?"active":""}`,onClick:()=>{c(j.id),I(!1)},children:[j.icon,j.label,j.badge>0&&r.jsx("span",{className:"nb",children:j.badge})]},j.id)),r.jsx("button",{className:"nl",onClick:()=>C(!S),children:S?"☀️ Light Mode":"🌙 Dark Mode"}),r.jsxs("button",{className:"nl",style:{color:"var(--red)"},onClick:Re,children:[r.jsx(an,{size:18})," Sign Out"]})]})]}),r.jsxs("aside",{className:"sidebar",children:[r.jsx("div",{className:"sb-logo",children:r.jsxs("div",{className:"logo-mark",children:[r.jsx("div",{className:"logo-icon",children:r.jsx($e,{size:20,color:"#fff",strokeWidth:2})}),r.jsxs("div",{children:[r.jsx("div",{className:"logo-text",children:"HopeBridge"}),r.jsx("div",{className:"logo-sub",children:"Creator Studio"})]})]})}),r.jsxs("div",{className:"sb-creator",children:[r.jsx("div",{className:"creator-av",children:Ct}),r.jsxs("div",{children:[r.jsxs("div",{className:"creator-name",children:[e==null?void 0:e.name,qt&&r.jsx(pe,{size:14,className:"verified-badge"})]}),r.jsx("div",{className:"creator-badge",children:"Creator"})]})]}),r.jsxs("nav",{className:"sb-nav",children:[r.jsx("div",{className:"nav-sec",children:"Workspace"}),[{id:"overview",label:"Dashboard",icon:r.jsx(Vt,{size:18})},{id:"campaigns",label:"My Campaigns",icon:r.jsx(Ge,{size:18}),badge:te.length},{id:"donations",label:"Donations",icon:r.jsx(We,{size:18})}].map(({id:j,label:K,icon:he,badge:Y})=>r.jsxs("button",{className:`nl ${l===j?"active":""}`,onClick:()=>c(j),children:[he,K,Y>0&&r.jsx("span",{className:"nb",children:Y})]},j)),r.jsx("div",{className:"nav-sec",children:"Finance"}),r.jsxs("button",{className:`nl ${l==="payouts"?"active":""}`,onClick:()=>c("payouts"),children:[r.jsx(Wt,{size:18}),"Payouts",De.length>0&&r.jsx("span",{className:"nb",children:De.length})]}),r.jsxs("button",{className:`nl ${l==="wallet"?"active":""}`,onClick:()=>c("wallet"),children:[r.jsx(Xt,{size:18}),"Wallet"]}),r.jsx("div",{className:"nav-sec",children:"Account"}),r.jsxs("button",{className:`nl ${l==="settings"?"active":""}`,onClick:()=>c("settings"),children:[r.jsx(pt,{size:18}),"Settings"]}),r.jsx("button",{className:"nl",onClick:()=>C(!S),children:S?"☀️ Light Mode":"🌙 Dark Mode"})]}),r.jsx("div",{className:"sb-footer",children:r.jsxs("button",{className:"nl",style:{color:"var(--red)"},onClick:Re,children:[r.jsx(an,{size:18}),"Sign Out"]})})]}),r.jsxs("div",{className:"main",children:[r.jsxs("div",{className:"topbar",children:[r.jsxs("div",{className:"tb-title",children:[l==="overview"&&"Dashboard",l==="campaigns"&&"My Campaigns",l==="donations"&&"Donations",l==="payouts"&&"Payouts",l==="wallet"&&"Wallet",l==="settings"&&"Settings"]}),r.jsxs("div",{className:"tb-actions",children:[r.jsx(Ur,{showToast:i}),r.jsx("button",{className:"tb-btn",onClick:()=>C(!S),children:S?"🌙":"☀️"}),r.jsx("div",{className:"tb-btn",children:r.jsx("div",{style:{width:38,height:38,background:"linear-gradient(135deg,var(--green),var(--green-d))",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",fontWeight:700,color:"#fff"},children:Ct})})]})]}),r.jsxs("div",{className:"mob-top",children:[r.jsx("button",{className:"mobile-menu-btn",onClick:()=>I(!0),children:r.jsx(Qa,{size:24})}),r.jsx("div",{style:{fontFamily:"var(--fd)",fontSize:18,flex:1,textAlign:"center"},children:"HopeBridge"}),r.jsxs("div",{className:"tb-actions",children:[r.jsx(Ur,{showToast:i}),r.jsx("button",{className:"tb-btn",onClick:()=>C(!S),children:S?"🌙":"☀️"})]})]}),r.jsxs("div",{className:"page",children:[Se&&r.jsx("div",{style:{padding:"8px 16px",background:"var(--green)",color:"#fff",borderRadius:6,marginBottom:12},children:"Loading your data..."}),r.jsxs("div",{className:`ps ${l==="overview"?"active":""}`,children:[r.jsxs("div",{className:"stats-grid",children:[r.jsxs("div",{className:"sc",onClick:()=>c("campaigns"),children:[r.jsx("div",{className:"si",children:r.jsx(Ch,{size:18})}),r.jsxs("div",{className:"sv",children:["$",F.toLocaleString()]}),r.jsx("div",{className:"sl",children:"Total raised"}),r.jsx("div",{className:"sd",children:"Click to view →"})]}),r.jsxs("div",{className:"sc",onClick:()=>c("campaigns"),children:[r.jsx("div",{className:"si",children:r.jsx(Ge,{size:18})}),r.jsx("div",{className:"sv",children:ae}),r.jsx("div",{className:"sl",children:"Active campaigns"}),r.jsx("div",{className:"sd",children:"Click to view →"})]}),r.jsxs("div",{className:"sc",onClick:()=>c("donations"),children:[r.jsx("div",{className:"si",children:r.jsx(Kn,{size:18})}),r.jsx("div",{className:"sv",children:Ve.length}),r.jsx("div",{className:"sl",children:"Total donations"}),r.jsx("div",{className:"sd",children:"Click to view →"})]}),r.jsxs("div",{className:"sc",onClick:()=>c("wallet"),children:[r.jsx("div",{className:"si",children:r.jsx(Xt,{size:18})}),r.jsxs("div",{className:"sv",children:["$",ie.toLocaleString()]}),r.jsx("div",{className:"sl",children:"Wallet balance"}),r.jsx("div",{className:"sd",children:"Click to view →"})]})]}),r.jsxs("div",{className:"card",children:[r.jsxs("div",{className:"card-h",children:[r.jsxs("div",{className:"card-t",children:[r.jsx(We,{size:18})," Recent Donations"]}),r.jsxs("button",{className:"card-a",onClick:()=>c("donations"),children:["View all ",r.jsx(In,{size:14})]})]}),r.jsxs("div",{className:"card-b",children:[Ve.slice(0,3).map(j=>r.jsxs("div",{className:"cr",children:[r.jsxs("div",{className:"ci",children:[r.jsx("div",{className:"cn",children:j.donor_name||"Anonymous"}),r.jsx("div",{className:"cm",children:j.campaign_title})]}),r.jsxs("div",{className:"badge ba",children:["+$",parseFloat(j.amount||0).toFixed(2)]}),r.jsx("div",{style:{fontSize:11,color:"var(--txt-3)"},children:new Date(j.created_at).toLocaleDateString()})]},j.id)),Ve.length===0&&r.jsx("div",{className:"cr",style:{color:"var(--txt-3)"},children:"No donations yet"})]})]}),r.jsxs("div",{className:"card",children:[r.jsxs("div",{className:"card-h",children:[r.jsxs("div",{className:"card-t",children:[r.jsx(Ge,{size:18})," Active Campaigns"]}),r.jsxs("button",{className:"card-a",onClick:()=>c("campaigns"),children:["Manage ",r.jsx(In,{size:14})]})]}),r.jsxs("div",{className:"card-b",children:[te.filter(j=>j.status==="approved"||j.status==="active").slice(0,3).map(j=>r.jsxs("div",{className:"cr",children:[r.jsxs("div",{className:"ci",children:[r.jsx("div",{className:"cn",children:j.title}),r.jsxs("div",{className:"cm",children:["$",parseFloat(j.raised||0).toLocaleString()," / $",parseFloat(j.goal).toLocaleString()]}),r.jsx("div",{className:"pb",children:r.jsx("div",{className:"pf",style:{width:`${Math.min((j.raised||0)/j.goal*100,100)}%`}})})]}),r.jsx("button",{className:"db dba",onClick:()=>{u(j.id),N(!0)},children:"Update"})]},j.id)),te.filter(j=>j.status==="approved"||j.status==="active").length===0&&r.jsx("div",{className:"cr",style:{color:"var(--txt-3)"},children:"No active campaigns"})]})]})]}),r.jsxs("div",{className:`ps ${l==="campaigns"?"active":""}`,children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10},children:[r.jsx("div",{style:{fontFamily:"var(--fd)",fontSize:20},children:"My Campaigns"}),r.jsxs("button",{className:"btn btn-g",onClick:()=>{x(null),m(!0)},children:[r.jsx(Sh,{size:16})," New Campaign"]})]}),r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",style:{padding:0,overflowX:"auto"},children:r.jsxs("table",{className:"ut",style:{minWidth:600},children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Campaign"}),r.jsx("th",{children:"Goal"}),r.jsx("th",{children:"Raised"}),r.jsx("th",{children:"Progress"}),r.jsx("th",{children:"Status"}),r.jsx("th",{children:"Actions"})]})}),r.jsxs("tbody",{children:[te.length===0&&r.jsx("tr",{children:r.jsx("td",{colSpan:6,style:{textAlign:"center",color:"var(--txt-3)",padding:24},children:"No campaigns yet"})}),te.map(j=>{const K=Math.min((j.raised||0)/j.goal*100,100);return r.jsxs("tr",{children:[r.jsxs("td",{children:[r.jsx("strong",{children:j.title}),r.jsxs("div",{style:{fontSize:11,color:"var(--txt-3)"},children:["Created ",new Date(j.created_at).toLocaleDateString()]})]}),r.jsxs("td",{children:["$",parseFloat(j.goal).toLocaleString()]}),r.jsxs("td",{children:["$",parseFloat(j.raised||0).toLocaleString()]}),r.jsxs("td",{children:[r.jsx("div",{className:"pb",style:{width:100},children:r.jsx("div",{className:"pf",style:{width:`${K}%`}})}),Math.round(K),"%"]}),r.jsx("td",{children:r.jsx("span",{className:`badge ${j.status==="approved"?"ba":j.status==="pending"?"bp":"br"}`,children:j.status})}),r.jsxs("td",{children:[r.jsx("button",{className:"db dba",onClick:()=>{u(j.id),N(!0)},children:"Update"}),r.jsx("button",{className:"db dbr",onClick:()=>V(j.id),children:"Delete"})]})]},j.id)})]})]})})})]}),r.jsx("div",{className:`ps ${l==="donations"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",style:{padding:0,overflowX:"auto"},children:r.jsxs("table",{className:"ut",style:{minWidth:500},children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Donor"}),r.jsx("th",{children:"Campaign"}),r.jsx("th",{children:"Amount"}),r.jsx("th",{children:"Date"})]})}),r.jsxs("tbody",{children:[Ve.length===0&&r.jsx("tr",{children:r.jsx("td",{colSpan:4,style:{textAlign:"center",color:"var(--txt-3)",padding:24},children:"No donations yet"})}),Ve.map(j=>r.jsxs("tr",{children:[r.jsx("td",{children:j.donor_name||"Anonymous"}),r.jsx("td",{children:j.campaign_title}),r.jsxs("td",{children:["$",parseFloat(j.amount||0).toFixed(2)]}),r.jsx("td",{children:new Date(j.created_at).toLocaleDateString()})]},j.id))]})]})})})}),r.jsx("div",{className:`ps ${l==="payouts"?"active":""}`,children:r.jsxs("div",{className:"card",children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx(Wt,{size:18})," Available Balance & Withdrawals"]})}),r.jsxs("div",{className:"card-b",children:[r.jsxs("div",{className:"stats-grid",style:{marginBottom:20},children:[r.jsxs("div",{className:"sc",children:[r.jsxs("div",{className:"sv",children:["$",Math.max(ie-Et,0).toLocaleString()]}),r.jsx("div",{className:"sl",children:"Ready to withdraw"})]}),r.jsxs("div",{className:"sc",children:[r.jsxs("div",{className:"sv",children:["$",q.toLocaleString()]}),r.jsx("div",{className:"sl",children:"Total earned (all time)"})]})]}),r.jsxs("button",{className:"btn btn-g",onClick:ce,children:[r.jsx(Fa,{size:16})," Request Withdrawal"]}),r.jsx("hr",{style:{margin:"20px 0",borderColor:"var(--border)"}}),r.jsx("strong",{children:"Recent payout requests"}),Lt.length===0&&r.jsx("div",{style:{padding:"10px 0",color:"var(--txt-3)"},children:"No payout requests yet"}),Lt.map(j=>r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)",flexWrap:"wrap",gap:8},children:[r.jsxs("span",{children:["$",parseFloat(j.amount||0).toFixed(2)," · ",new Date(j.created_at).toLocaleDateString()]}),r.jsxs("span",{className:`badge ${j.status==="pending"?"bp":j.status==="rejected"?"bx":"ba"}`,children:[j.status==="pending"&&r.jsx(Ra,{size:10}),j.status==="approved"&&r.jsx(pe,{size:10}),j.status==="rejected"&&r.jsx(ri,{size:10}),j.status]})]},j.id))]})]})}),r.jsxs("div",{className:`ps ${l==="wallet"?"active":""}`,children:[r.jsxs("div",{className:"card",children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx(Xt,{size:18})," Creator Wallet"]})}),r.jsxs("div",{className:"card-b",children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--border)"},children:[r.jsx("span",{children:"Current balance"}),r.jsxs("strong",{children:["$",ie.toLocaleString()]})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--border)"},children:[r.jsx("span",{children:"Pending payouts"}),r.jsxs("strong",{children:["$",Et.toLocaleString()]})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"12px 0"},children:[r.jsx("span",{children:"Available to withdraw"}),r.jsxs("strong",{children:["$",Math.max(ie-Et,0).toLocaleString()]})]})]})]}),r.jsxs("div",{className:"card",children:[r.jsxs("div",{className:"card-h",children:[r.jsxs("div",{className:"card-t",children:[r.jsx(La,{size:18})," Transaction History"]}),r.jsxs("button",{className:"card-a",onClick:()=>Q(),children:[r.jsx(Wr,{size:14})," Refresh"]})]}),r.jsx("div",{className:"card-b",children:r.jsx(Hy,{transactions:Z,loading:B,onRefresh:Q})})]})]}),r.jsxs("div",{className:`ps ${l==="settings"?"active":""}`,children:[r.jsxs("div",{className:"card",children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx($a,{size:18})," Profile Settings"]})}),r.jsxs("div",{className:"card-b",children:[r.jsx("label",{style:{fontSize:12,fontWeight:600,color:"var(--txt-2)",display:"block",marginBottom:4},children:"Display Name"}),r.jsx("input",{className:"fi",type:"text",defaultValue:e==null?void 0:e.name}),r.jsx("label",{style:{fontSize:12,fontWeight:600,color:"var(--txt-2)",display:"block",marginBottom:4},children:"Email"}),r.jsx("input",{className:"fi",type:"email",defaultValue:e==null?void 0:e.email}),r.jsxs("div",{className:"verified-status",style:{marginBottom:16,padding:"8px 12px",background:qt?"var(--green-l)":"var(--amber-l)",borderRadius:8,display:"flex",alignItems:"center",gap:8},children:[qt?r.jsx(pe,{size:16,color:"var(--green-d)"}):r.jsx(ri,{size:16,color:"#854F0B"}),r.jsx("span",{style:{fontSize:13,color:qt?"var(--green-d)":"#854F0B"},children:qt?"Your account is verified":"Your account is not yet verified. Contact support for verification."})]}),r.jsx("button",{className:"btn btn-g",onClick:()=>i("Profile update coming soon"),children:"Save Changes"})]})]}),r.jsxs("div",{className:"card",style:{marginTop:20},children:[r.jsx("div",{className:"card-h",children:r.jsxs("div",{className:"card-t",children:[r.jsx(nn,{size:18})," Payment Methods"]})}),r.jsx("div",{className:"card-b",children:r.jsxs("form",{onSubmit:P,children:[[{label:"PayPal Email",key:"paypal_email",type:"email",placeholder:"you@example.com"},{label:"Bank Account Name",key:"account_name",type:"text",placeholder:"Account holder name"},{label:"Bank Account Number",key:"account_number",type:"text",placeholder:"Account number"},{label:"Bank Name",key:"bank_name",type:"text",placeholder:"Bank name"}].map(({label:j,key:K,type:he,placeholder:Y})=>r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:12,fontWeight:600,color:"var(--txt-2)",display:"block",marginBottom:4},children:j}),r.jsx("input",{className:"fi",type:he,placeholder:Y,value:J[K]||"",onChange:fn=>ee(Xa=>({...Xa,[K]:fn.target.value}))})]},K)),r.jsx("button",{type:"submit",className:"btn btn-g",disabled:je,children:je?"Saving...":"Save Payment Method"})]})})]})]})]})]}),r.jsx("div",{className:"mobile-bottom-nav",children:r.jsx("div",{className:"mobile-bottom-nav-inner",children:D.map(j=>r.jsxs("button",{className:`mobile-nav-item ${l===j.id?"active":""}`,onClick:()=>c(j.id),children:[j.icon,r.jsx("span",{children:j.label}),j.badge>0&&r.jsx("span",{className:"mobile-nav-badge",children:j.badge>9?"9+":j.badge})]},j.id))})}),r.jsx("div",{className:`modal-bd ${k?"open":""}`,onClick:()=>N(!1),children:r.jsxs("div",{className:"modal",onClick:j=>j.stopPropagation(),children:[r.jsx("div",{className:"card-t",style:{marginBottom:12},children:"Update Campaign Progress"}),r.jsx("input",{className:"fi",type:"number",placeholder:"New raised amount (USD)",value:h,onChange:j=>y(j.target.value)}),r.jsxs("div",{style:{display:"flex",gap:10},children:[r.jsx("button",{className:"btn btn-gh",onClick:()=>N(!1),children:"Cancel"}),r.jsx("button",{className:"btn btn-g",onClick:A,children:"Update"})]})]})}),d&&r.jsx(By,{campaign:f,onClose:()=>{m(!1),x(null),Ce()}}),b&&r.jsx(Wy,{campaign:b,onClose:()=>w(null)})]})}const dt=async(e,t)=>{try{return await e()}catch{return t}},Yt=(e,t=0)=>{const n=parseFloat(e);return isNaN(n)?t:n};let Cu=!1;const qy=()=>{if(Cu)return;Cu=!0;const e=document.createElement("style");e.textContent=`
    :root {
      --green: #1D9E75; --green-d: #0F6E56; --green-dd: #085041; --green-l: #E1F5EE; --green-m: #9FE1CB;
      --red: #E24B4A; --red-l: #FCEBEB; --amber: #EF9F27; --amber-l: #FAEEDA; --blue: #378ADD; --blue-l: #E6F1FB;
      --bg: #EEF1F5; --surface: #FFFFFF; --surface-2: #F6F8FA; --border: rgba(0,0,0,0.07);
      --txt: #111318; --txt-2: #5A6272; --txt-3: #9AA3B2;
      --sidebar-w: 260px; --topbar-h: 64px; --bottom-nav: 70px;
      --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px;
      --fd: 'Inter', system-ui; --fb: 'Inter', system-ui; --tr: 0.2s ease;
    }
    body.dark-mode {
      --bg: #0f0f1a; --surface: #1a1a2e; --surface-2: #252540; --border: rgba(255,255,255,0.08);
      --txt: #EEEEEE; --txt-2: #AAAAAA; --txt-3: #777777;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { font-family: var(--fb); background: var(--bg); color: var(--txt); min-height: 100vh; }
    
    /* Layout */
    .shell { display: flex; min-height: 100vh; }
    .sidebar {
      width: var(--sidebar-w);
      background: var(--surface);
      border-right: 1px solid var(--border);
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      z-index: 200;
      overflow-y: auto;
    }
    .main { flex: 1; margin-left: var(--sidebar-w); display: flex; flex-direction: column; min-height: 100vh; }
    
    /* Sidebar Components */
    .sb-logo { padding: 24px 20px; border-bottom: 1px solid var(--border); }
    .logo-mark { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green); display: flex; align-items: center; justify-content: center; }
    .logo-text { font-size: 18px; font-weight: 700; color: var(--txt); }
    .logo-sub { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--txt-3); }
    .sb-admin { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
    .admin-av { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--green), var(--green-d)); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; color: #fff; }
    .admin-name-s { font-size: 14px; font-weight: 600; color: var(--txt); }
    .admin-role { font-size: 11px; color: var(--txt-3); margin-top: 2px; }
    .sb-nav { flex: 1; padding: 12px; }
    .nav-sec { font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--txt-3); padding: 8px 12px; }
    .nl {
      display: flex; align-items: center; gap: 12px; padding: 10px 12px;
      border-radius: var(--r-md); cursor: pointer; border: none;
      background: none; width: 100%; text-align: left;
      color: var(--txt-2); font-size: 13px; font-weight: 500;
      transition: all 0.2s;
    }
    .nl:hover { background: var(--bg); color: var(--txt); }
    .nl.active { background: var(--green-l); color: var(--green-d); font-weight: 600; }
    .nl svg { flex-shrink: 0; }
    .nb { margin-left: auto; font-size: 10px; font-weight: 700; background: var(--red); color: #fff; padding: 2px 7px; border-radius: 20px; }
    .nb.am { background: var(--amber); }
    .sb-footer { padding: 16px; border-top: 1px solid var(--border); }
    
    /* Top Bar */
    .topbar {
      height: var(--topbar-h);
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .tb-title { font-size: 20px; font-weight: 600; color: var(--txt); }
    .tb-actions { display: flex; align-items: center; gap: 12px; }
    .tb-btn {
      width: 38px; height: 38px; border-radius: var(--r-sm);
      background: var(--surface-2); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background 0.2s;
    }
    .tb-btn:hover { background: var(--bg); }
    
    /* Page Content */
    .page { padding: 28px; }
    .ps { display: none; }
    .ps.active { display: block; }
    
    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    .sc {
      background: var(--surface);
      border-radius: var(--r-lg);
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid var(--border);
    }
    .sc:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .si { width: 40px; height: 40px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .si-g { background: var(--green-l); color: var(--green-d); }
    .si-b { background: var(--blue-l); color: var(--blue); }
    .si-a { background: var(--amber-l); color: #854F0B; }
    .si-r { background: var(--red-l); color: var(--red); }
    .sv { font-size: 28px; font-weight: 700; color: var(--txt); line-height: 1.2; }
    .sl { font-size: 12px; color: var(--txt-2); margin-top: 4px; }
    .sd { font-size: 11px; font-weight: 600; margin-top: 8px; color: var(--green); }
    
    /* Quick Actions Grid */
    .qg { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; margin-bottom: 28px; }
    .qb {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .qb:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .qi { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--surface-2); display: flex; align-items: center; justify-content: center; }
    .ql { font-size: 10px; font-weight: 600; color: var(--txt-2); text-align: center; }
    
    /* Cards */
    .card { background: var(--surface); border-radius: var(--r-lg); border: 1px solid var(--border); overflow: hidden; margin-bottom: 24px; }
    .card-h { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); }
    .card-t { font-size: 15px; font-weight: 600; color: var(--txt); display: flex; align-items: center; gap: 8px; }
    .card-a { font-size: 12px; font-weight: 600; color: var(--green); background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    .card-b { padding: 16px 20px; }
    
    /* Tables */
    .ut { width: 100%; border-collapse: collapse; }
    .ut th { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--txt-3); text-align: left; padding: 12px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
    .ut td { padding: 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
    .ut tr:hover td { background: var(--surface-2); }
    
    /* Badges */
    .badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; }
    .ba { background: var(--green-l); color: var(--green-d); }
    .bp { background: var(--amber-l); color: #854F0B; }
    .br { background: var(--blue-l); color: #185FA5; }
    .bx { background: var(--red-l); color: var(--red); }
    
    /* Buttons */
    .db { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .dba { background: var(--green-l); color: var(--green-d); }
    .dbr { background: var(--red-l); color: var(--red); }
    .dbv { background: var(--blue-l); color: #185FA5; }
    .btn { padding: 8px 16px; border-radius: var(--r-sm); font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; }
    .btn-g { background: var(--green); color: #fff; }
    .btn-gh { background: var(--surface-2); border: 1px solid var(--border); }
    
    /* Forms */
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--r-sm); background: var(--surface-2); color: var(--txt); font-size: 13px; margin-bottom: 12px; }
    .fl { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--txt-2); margin-bottom: 6px; display: block; }
    
    /* Modals */
    .modal-bd { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.25s; backdrop-filter: blur(4px); }
    .modal-bd.open { opacity: 1; pointer-events: all; }
    .modal { background: var(--surface); border-radius: var(--r-xl); padding: 28px; width: 90%; max-width: 450px; transform: translateY(20px); transition: transform 0.25s; }
    .modal-bd.open .modal { transform: translateY(0); }
    .modal-t { font-size: 20px; font-weight: 700; color: var(--txt); margin-bottom: 8px; }
    .modal-s { font-size: 13px; color: var(--txt-2); margin-bottom: 20px; }
    
    /* Mobile Components */
    .mobile-bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); z-index: 200; padding: 8px 16px; padding-bottom: env(safe-area-inset-bottom, 8px); }
    .mobile-bottom-nav-inner { display: flex; justify-content: space-around; align-items: center; max-width: 500px; margin: 0 auto; }
    .mobile-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; padding: 8px; border-radius: var(--r-md); transition: all 0.2s; color: var(--txt-3); font-size: 10px; font-weight: 600; position: relative; }
    .mobile-nav-item.active { color: var(--green); background: var(--green-l); }
    .mobile-nav-item svg { width: 22px; height: 22px; }
    .mobile-nav-badge { position: absolute; top: 2px; right: 5px; background: var(--red); color: #fff; font-size: 9px; border-radius: 50%; min-width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
    
    .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; padding: 8px; color: var(--txt); }
    .mob-top { display: none; height: 58px; background: var(--surface); border-bottom: 1px solid var(--border); align-items: center; justify-content: space-between; padding: 0 16px; position: sticky; top: 0; z-index: 100; }
    .mob-logo { font-size: 18px; font-weight: 700; color: var(--txt); }
    
    .mobile-sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 998; display: none; }
    .mobile-sidebar-overlay.open { display: block; }
    .mobile-sidebar-menu { position: fixed; top: 0; left: -280px; width: 280px; height: 100vh; background: var(--surface); z-index: 999; transition: left 0.3s ease; overflow-y: auto; display: flex; flex-direction: column; }
    .mobile-sidebar-menu.open { left: 0; }
    .mobile-sidebar-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border); }
    .mobile-sidebar-user { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
    .mobile-sidebar-nav { flex: 1; padding: 12px 0; }
    .mobile-nav-link { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 20px; background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--txt-2); transition: background 0.2s; text-align: left; }
    .mobile-nav-link:hover { background: var(--bg); color: var(--txt); }
    .mobile-nav-link.active { background: var(--green-l); color: var(--green-d); font-weight: 600; }
    
    /* Responsive */
    @media (max-width: 1100px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .qg { grid-template-columns: repeat(4, 1fr); }
    }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; }
      .topbar { display: none; }
      .mobile-bottom-nav { display: block; }
      .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
      .mob-top { display: flex; }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .qg { grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .card-h { flex-direction: column; gap: 8px; align-items: flex-start; }
      .ut { display: block; overflow-x: auto; white-space: nowrap; }
    }
    @media (max-width: 480px) {
      .stats-grid { grid-template-columns: 1fr; }
      .qg { grid-template-columns: repeat(2, 1fr); }
    }
  `,document.head.appendChild(e)},Yy=({checked:e,onChange:t,danger:n=!1,disabled:a=!1})=>r.jsxs("label",{className:`toggle ${n?"danger":""}`,style:{opacity:a?.5:1},children:[r.jsx("input",{type:"checkbox",checked:e,onChange:s=>t(s.target.checked),disabled:a}),r.jsx("span",{className:"toggle-slider"})]}),Ky=({isOpen:e,onClose:t,onSave:n,showToast:a})=>{const[s,i]=p.useState(""),[o,l]=p.useState(""),[c,d]=p.useState(""),[m,f]=p.useState(!1),[x,b]=p.useState(!1),[w,k]=p.useState(!1);if(!e)return null;const N=async g=>{if(g.preventDefault(),o!==c){a("Passwords do not match",!0);return}if(o.length<6){a("Min 6 characters",!0);return}f(!0);try{await n({oldPassword:s,newPassword:o}),a("Password changed"),i(""),l(""),d(""),t()}catch(u){a(u.message,!0)}finally{f(!1)}};return r.jsx("div",{className:"modal-bd open",onClick:t,children:r.jsxs("div",{className:"modal",onClick:g=>g.stopPropagation(),children:[r.jsx("div",{className:"modal-t",children:"Change Password"}),r.jsx("div",{className:"modal-s",children:"Enter your current password and a new one"}),r.jsxs("form",{onSubmit:N,children:[r.jsx("label",{className:"fl",children:"Current Password"}),r.jsxs("div",{style:{position:"relative"},children:[r.jsx("input",{type:x?"text":"password",className:"fi",value:s,onChange:g=>i(g.target.value),required:!0,style:{paddingRight:40}}),r.jsx("button",{type:"button",onClick:()=>b(g=>!g),style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--txt-3)"},children:x?r.jsx(ai,{size:16}):r.jsx(si,{size:16})})]}),r.jsx("label",{className:"fl",children:"New Password"}),r.jsxs("div",{style:{position:"relative"},children:[r.jsx("input",{type:w?"text":"password",className:"fi",value:o,onChange:g=>l(g.target.value),required:!0,style:{paddingRight:40}}),r.jsx("button",{type:"button",onClick:()=>k(g=>!g),style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--txt-3)"},children:w?r.jsx(ai,{size:16}):r.jsx(si,{size:16})})]}),r.jsx("label",{className:"fl",children:"Confirm New Password"}),r.jsx("input",{type:"password",className:"fi",value:c,onChange:g=>d(g.target.value),required:!0}),r.jsxs("div",{style:{display:"flex",gap:10,marginTop:8},children:[r.jsx("button",{type:"submit",className:"btn btn-g",disabled:m,children:m?"Changing…":"Change Password"}),r.jsx("button",{type:"button",className:"btn btn-gh",onClick:t,children:"Cancel"})]})]})]})})},Gy=({isOpen:e,onClose:t,onConfirm:n,userName:a,showToast:s})=>{const[i,o]=p.useState(""),[l,c]=p.useState(!1),d=async()=>{if(i!=="DELETE"){s('Type "DELETE" to confirm',!0);return}c(!0);try{await n(),t()}catch(m){s(m.message,!0)}finally{c(!1)}};return e?r.jsx("div",{className:"modal-bd open",onClick:t,children:r.jsxs("div",{className:"modal",onClick:m=>m.stopPropagation(),children:[r.jsx("h3",{style:{fontSize:"20px",marginBottom:"8px",color:"#dc2626"},children:"Delete User"}),r.jsxs("p",{style:{marginBottom:"20px",color:"var(--txt-2)",lineHeight:"1.5"},children:["Permanently delete ",r.jsx("strong",{children:a}),"? All their data will be removed and cannot be undone."]}),r.jsx("label",{className:"fl",children:'Type "DELETE" to confirm'}),r.jsx("input",{type:"text",value:i,onChange:m=>o(m.target.value),placeholder:"DELETE",className:"fi",style:{marginBottom:"20px"}}),r.jsxs("div",{style:{display:"flex",gap:"10px"},children:[r.jsx("button",{onClick:d,disabled:l,className:"btn",style:{background:"#dc2626",color:"#fff"},children:l?"Deleting...":"Permanently Delete"}),r.jsx("button",{onClick:t,className:"btn btn-gh",children:"Cancel"})]})]})}):null},Jy=({isOpen:e,onClose:t,onSubmit:n,userData:a,setUserData:s,loading:i})=>e?r.jsx("div",{className:"modal-bd open",onClick:t,children:r.jsxs("div",{className:"modal",onClick:o=>o.stopPropagation(),children:[r.jsx("div",{className:"modal-t",children:"Add New User"}),r.jsx("div",{className:"modal-s",children:"Create a new user account"}),r.jsxs("form",{onSubmit:n,children:[r.jsx("label",{className:"fl",children:"Full Name *"}),r.jsx("input",{type:"text",value:a.name,onChange:o=>s(l=>({...l,name:o.target.value})),placeholder:"John Doe",required:!0,className:"fi"}),r.jsx("label",{className:"fl",children:"Email *"}),r.jsx("input",{type:"email",value:a.email,onChange:o=>s(l=>({...l,email:o.target.value})),placeholder:"user@example.com",required:!0,className:"fi"}),r.jsx("label",{className:"fl",children:"Password *"}),r.jsx("input",{type:"password",value:a.password,onChange:o=>s(l=>({...l,password:o.target.value})),placeholder:"Min 6 characters",required:!0,minLength:6,className:"fi"}),r.jsx("label",{className:"fl",children:"Role"}),r.jsxs("select",{value:a.role,onChange:o=>s(l=>({...l,role:o.target.value})),className:"fi",children:[r.jsx("option",{value:"donor",children:"Donor"}),r.jsx("option",{value:"creator",children:"Creator"})]}),r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"20px",cursor:"pointer"},children:[r.jsx("input",{type:"checkbox",checked:a.is_verified,onChange:o=>s(l=>({...l,is_verified:o.target.checked}))}),r.jsx("span",{style:{fontSize:"13px"},children:"Mark as verified (skip email verification)"})]}),r.jsxs("div",{style:{display:"flex",gap:"10px"},children:[r.jsx("button",{type:"submit",disabled:i,className:"btn btn-g",children:i?"Adding...":"Add User"}),r.jsx("button",{type:"button",onClick:t,className:"btn btn-gh",children:"Cancel"})]})]})]})}):null;function Qy(){qy();const{currentUser:e,logout:t,showToast:n,loading:a}=Oe(),s=lt(),[i,o]=p.useState(!1),[l,c]=p.useState("overview"),[d,m]=p.useState(!1),[f,x]=p.useState(localStorage.getItem("hb_darkmode")==="true"),[b,w]=p.useState(!1),[k,N]=p.useState("security"),[g,u]=p.useState(!1),[h,y]=p.useState({open:!1,userId:null,userName:""}),[S,C]=p.useState(!1),[E,I]=p.useState({name:"",email:"",password:"",role:"donor",is_verified:!0}),[H,R]=p.useState(!1),[ne,de]=p.useState(null),[ie,Me]=p.useState(Date.now()),[q,oe]=p.useState({total_raised:0,total_campaigns:0,pending_campaigns:0,total_users:0}),[Z,T]=p.useState([]),[B,U]=p.useState([]),[J,ee]=p.useState([]),[je,ue]=p.useState([]),[Se,L]=p.useState([]),[Q,Ce]=p.useState([]),[ye,P]=p.useState([]),[A,V]=p.useState({percentage:0,fixed_amount:0,min_fee:0,withdrawal_fee:0,minimum_withdrawal:10}),[ce,Re]=p.useState([]),[te,Ve]=p.useState([]),[Lt,Ct]=p.useState({hero_title:"Together We Can",hero_subtitle:"Support causes you care about.",hero_badge:"HopeBridge",impact_title:"Our Impact",impact_subtitle:"Every donation counts",impact_stats:{raised:"$0",campaigns:"0",donors:"0"},social_links:{facebook:"",twitter:"",instagram:"",youtube:"",linkedin:""}}),[F,ae]=p.useState({"--primary":"#e8531e","--primary-dark":"#c4400f","--secondary":"#27a96c","--dark":"#1a1a2e"}),[De,Et]=p.useState({smtp_host:"",smtp_port:"",smtp_user:"",smtp_pass:"",recaptcha_site_key:"",recaptcha_secret_key:""}),[qt,D]=p.useState({facebook:"",twitter:"",instagram:"",youtube:"",linkedin:""}),[se,j]=p.useState({enabled:!1,message:""}),[K,he]=p.useState(!0),[Y,fn]=p.useState(!1),[Xa,bw]=p.useState(!0),[jw,Oc]=p.useState(!1),[ww,Bc]=p.useState(!1),[kw,Wc]=p.useState(!1);p.useEffect(()=>{document.body.classList.toggle("dark-mode",f),localStorage.setItem("hb_darkmode",f)},[f]),p.useEffect(()=>{const v=$=>{$.key==="Escape"&&w(!1)};return document.addEventListener("keydown",v),()=>document.removeEventListener("keydown",v)},[]),p.useEffect(()=>{if(!a){if(!e){n("Please log in",!0),s("/");return}if(e.role!=="admin"){n("Access denied",!0),s("/");return}o(!0)}},[a,e]),p.useEffect(()=>{if(!i)return;const v=setInterval(async()=>{var $;try{const ct=($=(await O.getDonations()).donations)==null?void 0:$[0];ct&&new Date(ct.created_at).getTime()>ie&&(de(ct),n(`💝 New $${ct.amount} donation from ${ct.donor_name||"Anonymous"}`),Me(Date.now()))}catch{}},3e4);return()=>clearInterval(v)},[i,ie]),p.useEffect(()=>{if(ne){const v=setTimeout(()=>de(null),5e3);return()=>clearTimeout(v)}},[ne]);const yt=async()=>{m(!0);try{const[v,$,Ie,ct,hn,es,ts,me]=await Promise.all([dt(()=>O.getStats(),{stats:{}}),dt(()=>O.getCampaigns(),{campaigns:[]}),dt(()=>O.getUsers(),{users:[]}),dt(()=>O.getDonations(),{donations:[]}),dt(()=>{var re;return(re=O.getDepositRequests)==null?void 0:re.call(O)},{requests:[]}),dt(()=>{var re;return(re=O.getWithdrawalRequests)==null?void 0:re.call(O)},{withdrawals:[]}),dt(()=>{var re;return(re=O.getCompletionRequests)==null?void 0:re.call(O)},{campaigns:[]}),dt(()=>O.getContent(),{content:null})]),pr={...v.stats||{}};["total_raised","total_campaigns","pending_campaigns","total_users"].forEach(re=>{pr[re]!==void 0&&(pr[re]=Yt(pr[re]))}),oe(pr),T(($.campaigns||[]).map(re=>({...re,goal:Yt(re.goal),raised:Yt(re.raised)}))),U((Ie.users||[]).map(re=>({...re,wallet_balance:Yt(re.wallet_balance)}))),ee((ct.donations||[]).map(re=>({...re,amount:Yt(re.amount)}))),ue((hn.requests||[]).map(re=>({...re,amount:Yt(re.amount)}))),L((es.withdrawals||[]).map(re=>({...re,amount:Yt(re.amount)}))),Ce(ts.campaigns||[]),me!=null&&me.content&&Ct(re=>({...re,...me.content,social_links:{...re.social_links,...me.content.social_links||{}}}))}catch(v){console.error(v),n("Failed to load data",!0)}finally{m(!1)}},dm=async()=>{var es,ts;const[v,$,Ie,ct,hn]=await Promise.all([dt(()=>{var me;return(me=O.getPayouts)==null?void 0:me.call(O)},{payouts:[]}),dt(()=>{var me;return(me=O.getFeeSettings)==null?void 0:me.call(O)},{percentage:0,fixed_amount:0,min_fee:0,withdrawal_fee:0,minimum_withdrawal:10}),dt(()=>{var me;return(me=O.getNotificationHistory)==null?void 0:me.call(O)},{notifications:[]}),dt(()=>{var me;return(me=O.getAuditLogs)==null?void 0:me.call(O)},{logs:[]}),dt(()=>O.getSettings(),{settings:null})]);if(P(v.payouts||[]),V($),Re(Ie.notifications||[]),Ve(ct.logs||[]),(es=hn==null?void 0:hn.settings)!=null&&es.keys){const me=hn.settings.keys;j({enabled:me.maintenance_mode==="true",message:me.maintenance_message||""}),fn(me.recaptcha_enabled==="true"),Et(pr=>({...pr,...me}))}try{const me=await((ts=O.getVerificationSetting)==null?void 0:ts.call(O));me&&he(me.enabled!==!1)}catch{}};p.useEffect(()=>{i&&(yt(),dm())},[i]);const um=async v=>{Oc(!0);try{await O.saveSettings({keys:{maintenance_mode:v?"true":"false"}}),j($=>({...$,enabled:v})),n(`Maintenance ${v?"enabled":"disabled"}`)}catch($){n($.message,!0)}finally{Oc(!1)}},pm=async v=>{var $;Bc(!0);try{await(($=O.updateVerificationSetting)==null?void 0:$.call(O,{enabled:v})),he(v),n(`Email verification ${v?"enabled":"disabled"}`)}catch(Ie){n(Ie.message,!0)}finally{Bc(!1)}},fm=async v=>{Wc(!0);try{await O.saveSettings({keys:{recaptcha_enabled:v?"true":"false"}}),fn(v),n(`reCAPTCHA ${v?"enabled":"disabled"}`)}catch($){n($.message,!0)}finally{Wc(!1)}},Uc=async v=>{try{await O.updateCampaign(v,{status:"approved"}),n("Campaign approved"),yt()}catch($){n($.message,!0)}},hm=async v=>{try{await O.updateCampaign(v,{status:"rejected"}),n("Campaign rejected"),yt()}catch($){n($.message,!0)}},mm=async v=>{if(window.confirm("Delete permanently?"))try{await Pt.delete(v),n("Deleted"),yt()}catch($){n($.message,!0)}},gm=async v=>{try{await O.toggleUser(v),n("User updated"),yt()}catch($){n($.message,!0)}},xm=async v=>{var $;try{await(($=O.verifyUser)==null?void 0:$.call(O,v)),n("User verified"),yt()}catch(Ie){n(Ie.message,!0)}},vm=async v=>{var $;try{await(($=O.deleteUser)==null?void 0:$.call(O,v)),n("User deleted"),yt()}catch(Ie){throw Ie}},ym=async(v,$)=>{var Ie;try{await((Ie=O.updateDepositRequest)==null?void 0:Ie.call(O,v,{status:"approved"})),n("Deposit approved"),yt()}catch(ct){n(ct.message,!0)}},bm=async v=>{var $;try{await(($=O.updateDepositRequest)==null?void 0:$.call(O,v,{status:"rejected"})),n("Deposit rejected"),yt()}catch(Ie){n(Ie.message,!0)}},Hc=async v=>{try{await O.approveWithdrawal(v),n("Withdrawal approved"),yt()}catch($){n($.message,!0)}},Vc=async v=>{const $=prompt("Reason:");if($)try{await O.rejectWithdrawal(v,$),n("Withdrawal rejected"),yt()}catch(Ie){n(Ie.message,!0)}},jm=async v=>{var $;await(($=O.changePassword)==null?void 0:$.call(O,v))},wm=async v=>{if(v.preventDefault(),!E.name||!E.email||!E.password){n("Fill all required fields",!0);return}if(E.password.length<6){n("Password must be at least 6 characters",!0);return}R(!0);try{await O.addUser({name:E.name,email:E.email,password:E.password,role:E.role,is_verified:E.is_verified}),n(`${E.name} added successfully`),C(!1),I({name:"",email:"",password:"",role:"donor",is_verified:!0}),yt()}catch($){n($.message||"Failed to add user",!0)}finally{R(!1)}},qc=()=>{t(),s("/")};if(a||!i)return r.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"},children:"Loading admin panel…"});const Yc=Z.reduce((v,$)=>v+$.raised,0),km=Z.filter(v=>v.status==="active"||v.status==="approved").length,Za=Z.filter(v=>v.status==="pending"||v.status==="review").length,Nm=B.filter(v=>v.role==="donor").length,Sm=B.filter(v=>v.role==="creator").length,Kc=Se.filter(v=>v.status==="pending").length,Gc=Q.length,Cm=[{id:"campaigns",label:"Campaigns",icon:r.jsx(Ge,{size:18}),color:"#e8531e"},{id:"users",label:"Users",icon:r.jsx(Kn,{size:18}),color:"#378ADD"},{id:"deposits",label:"Deposits",icon:r.jsx(nn,{size:18}),color:"#1D9E75"},{id:"withdrawals",label:"Withdrawals",icon:r.jsx(Wt,{size:18}),color:"#f59e0b"},{id:"payouts",label:"Payouts",icon:r.jsx(vu,{size:18}),color:"#8b5cf6"},{id:"completions",label:"Complete",icon:r.jsx(pe,{size:18}),color:"#10b981"},{id:"fees",label:"Fees",icon:r.jsx(We,{size:18}),color:"#ef4444"},{id:"notifications",label:"Push",icon:r.jsx(Pr,{size:18}),color:"#e8531e"},{id:"audit-logs",label:"Audit",icon:r.jsx(La,{size:18}),color:"#6b7280"},{id:"email_templates",label:"Email",icon:r.jsx(er,{size:18}),color:"#378ADD"},{id:"massmail",label:"Mass Mail",icon:r.jsx(Fa,{size:18}),color:"#1D9E75"},{id:"content",label:"Content",icon:r.jsx(mu,{size:18}),color:"#8b5cf6"},{id:"maintenance",label:"Maintenance",icon:r.jsx(pt,{size:18}),color:"#f59e0b"},{id:"settings",label:"Settings",icon:r.jsx(pt,{size:18}),color:"#1a1a2e"}],Em=[{id:"overview",label:"Home",icon:r.jsx(ii,{size:20})},{id:"campaigns",label:"Campaigns",icon:r.jsx(Ge,{size:20}),badge:Za},{id:"deposits",label:"Deposits",icon:r.jsx(nn,{size:20})},{id:"withdrawals",label:"Withdraw",icon:r.jsx(Wt,{size:20}),badge:Kc},{id:"notifications",label:"Alerts",icon:r.jsx(Pr,{size:20})},{id:"settings",label:"Settings",icon:r.jsx(pt,{size:20})}],Gr=[{id:"overview",label:"Dashboard",icon:r.jsx(Vt,{size:18})},{id:"campaigns",label:"Campaigns",icon:r.jsx(Ge,{size:18}),badge:Za},{id:"users",label:"Users",icon:r.jsx(Kn,{size:18})},{id:"donations",label:"Donations",icon:r.jsx(We,{size:18})},{id:"deposits",label:"Deposits",icon:r.jsx(nn,{size:18})},{id:"withdrawals",label:"Withdrawals",icon:r.jsx(Wt,{size:18}),badge:Kc},{id:"payouts",label:"Payouts",icon:r.jsx(vu,{size:18})},{id:"fees",label:"Fee Settings",icon:r.jsx(We,{size:18})},{id:"completions",label:"Completions",icon:r.jsx(pe,{size:18}),badge:Gc},{id:"notifications",label:"Notifications",icon:r.jsx(Pr,{size:18})},{id:"audit-logs",label:"Audit Logs",icon:r.jsx(La,{size:18})},{id:"maintenance",label:"Maintenance",icon:r.jsx(pt,{size:18})},{id:"email_templates",label:"Email Templates",icon:r.jsx(er,{size:18})},{id:"massmail",label:"Mass Mail",icon:r.jsx(Fa,{size:18})},{id:"content",label:"Content",icon:r.jsx(mu,{size:18})},{id:"settings",label:"Settings",icon:r.jsx(pt,{size:18})}];return r.jsxs("div",{className:"shell",children:[r.jsx("div",{className:`mobile-sidebar-overlay ${b?"open":""}`,onClick:()=>w(!1)}),r.jsxs("div",{className:`mobile-sidebar-menu ${b?"open":""}`,children:[r.jsxs("div",{className:"mobile-sidebar-header",children:[r.jsxs("div",{className:"logo-mark",children:[r.jsx("div",{className:"logo-icon",children:r.jsx($e,{size:20,color:"#fff"})}),r.jsxs("div",{children:[r.jsx("div",{className:"logo-text",children:"HopeBridge"}),r.jsx("div",{className:"logo-sub",children:"Admin"})]})]}),r.jsx("button",{onClick:()=>w(!1),style:{background:"none",border:"none",cursor:"pointer"},children:r.jsx(Bt,{size:24})})]}),r.jsxs("div",{className:"mobile-sidebar-user",children:[r.jsx("div",{className:"admin-av",children:"SA"}),r.jsxs("div",{children:[r.jsx("div",{className:"admin-name-s",children:"System Admin"}),r.jsx("div",{className:"admin-role",children:"Super Administrator"})]})]}),r.jsxs("div",{className:"mobile-sidebar-nav",children:[Gr.map(v=>r.jsxs("button",{className:`mobile-nav-link ${l===v.id?"active":""}`,onClick:()=>{c(v.id),w(!1)},children:[v.icon," ",v.label," ",v.badge>0&&r.jsx("span",{className:"nb",children:v.badge})]},v.id)),r.jsx("div",{style:{borderTop:"1px solid var(--border)",margin:"12px 20px"}}),r.jsx("button",{className:"mobile-nav-link",onClick:()=>x(!f),children:f?"☀️ Light Mode":"🌙 Dark Mode"}),r.jsxs("button",{className:"mobile-nav-link",style:{color:"var(--red)"},onClick:qc,children:[r.jsx(an,{size:18})," Sign Out"]})]})]}),r.jsxs("aside",{className:"sidebar",children:[r.jsx("div",{className:"sb-logo",children:r.jsxs("div",{className:"logo-mark",children:[r.jsx("div",{className:"logo-icon",children:r.jsx($e,{size:20,color:"#fff"})}),r.jsxs("div",{children:[r.jsx("div",{className:"logo-text",children:"HopeBridge"}),r.jsx("div",{className:"logo-sub",children:"Admin Console"})]})]})}),r.jsxs("div",{className:"sb-admin",children:[r.jsx("div",{className:"admin-av",children:"SA"}),r.jsxs("div",{children:[r.jsx("div",{className:"admin-name-s",children:"System Admin"}),r.jsx("div",{className:"admin-role",children:"Super Administrator"})]})]}),r.jsxs("nav",{className:"sb-nav",children:[r.jsx("div",{className:"nav-sec",children:"MAIN"}),Gr.slice(0,3).map(v=>r.jsxs("button",{className:`nl ${l===v.id?"active":""}`,onClick:()=>c(v.id),children:[v.icon," ",v.label," ",v.badge>0&&r.jsx("span",{className:`nb ${v.id==="withdrawals"?"am":""}`,children:v.badge})]},v.id)),r.jsx("div",{className:"nav-sec",children:"FINANCE"}),Gr.slice(3,7).map(v=>r.jsxs("button",{className:`nl ${l===v.id?"active":""}`,onClick:()=>c(v.id),children:[v.icon," ",v.label," ",v.badge>0&&r.jsx("span",{className:`nb ${v.id==="withdrawals"?"am":""}`,children:v.badge})]},v.id)),r.jsx("div",{className:"nav-sec",children:"OPERATIONS"}),Gr.slice(7,10).map(v=>r.jsxs("button",{className:`nl ${l===v.id?"active":""}`,onClick:()=>c(v.id),children:[v.icon," ",v.label," ",v.badge>0&&r.jsx("span",{className:`nb ${v.id==="withdrawals"?"am":""}`,children:v.badge})]},v.id)),r.jsx("div",{className:"nav-sec",children:"ADMIN"}),Gr.slice(10).map(v=>r.jsxs("button",{className:`nl ${l===v.id?"active":""}`,onClick:()=>c(v.id),children:[v.icon," ",v.label," ",v.badge>0&&r.jsx("span",{className:`nb ${v.id==="withdrawals"?"am":""}`,children:v.badge})]},v.id))]}),r.jsxs("div",{className:"sb-footer",children:[r.jsx("button",{className:"nl",onClick:()=>x(!f),children:f?"☀️ Light Mode":"🌙 Dark Mode"}),r.jsxs("button",{className:"nl",style:{color:"var(--red)"},onClick:qc,children:[r.jsx(an,{size:18})," Sign Out"]})]})]}),r.jsxs("div",{className:"main",children:[r.jsxs("div",{className:"topbar",children:[r.jsx("div",{className:"tb-title",children:l==="overview"?"Dashboard":l.charAt(0).toUpperCase()+l.slice(1)}),r.jsxs("div",{className:"tb-actions",children:[r.jsx(Ur,{showToast:n}),r.jsx("button",{className:"tb-btn",onClick:()=>x(!f),children:f?"🌙":"☀️"}),r.jsx("div",{className:"tb-btn",children:r.jsx("div",{style:{width:38,height:38,background:"linear-gradient(135deg,var(--green),var(--green-d))",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",fontWeight:700,fontSize:12,color:"#fff"},children:"SA"})})]})]}),r.jsxs("div",{className:"mob-top",children:[r.jsx("button",{className:"mobile-menu-btn",onClick:()=>w(!0),children:r.jsx(Qa,{size:24})}),r.jsx("div",{className:"mob-logo",children:"HopeBridge"}),r.jsxs("div",{className:"tb-actions",children:[r.jsx(Ur,{showToast:n}),r.jsx("button",{className:"tb-btn",onClick:()=>x(!f),children:f?"🌙":"☀️"})]})]}),r.jsxs("div",{className:"page",children:[d&&r.jsx("div",{style:{padding:"8px 16px",background:"var(--green)",color:"#fff",borderRadius:6,marginBottom:12,fontSize:13},children:"Loading data…"}),r.jsxs("div",{className:`ps ${l==="overview"?"active":""}`,children:[r.jsxs("div",{className:"ov-hero",style:{background:"linear-gradient(130deg, var(--green-dd) 0%, var(--green) 55%, var(--accent) 100%)",borderRadius:"var(--r-xl)",padding:"28px 32px",marginBottom:"24px",color:"#fff"},children:[r.jsxs("div",{className:"hero-row",style:{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"},children:[r.jsxs("div",{children:[r.jsx("div",{className:"hero-g",style:{fontSize:13,opacity:.65},children:"Good morning, Administrator"}),r.jsxs("div",{className:"hero-t",style:{fontSize:28,fontWeight:700,marginTop:4},children:["HopeBridge",r.jsx("br",{}),r.jsx("em",{children:"Admin Console"})]}),r.jsxs("div",{className:"hero-s",style:{fontSize:13,opacity:.7,marginTop:8},children:[Za," campaigns awaiting review"]})]}),r.jsxs("div",{style:{textAlign:"right"},children:[r.jsx("div",{style:{fontSize:12,opacity:.6,marginBottom:4},children:"Platform Status"}),r.jsx("div",{style:{fontSize:14,fontWeight:700,background:se.enabled?"rgba(239,159,39,0.4)":"rgba(255,255,255,0.15)",padding:"6px 14px",borderRadius:20,border:"1px solid rgba(255,255,255,0.2)",display:"inline-flex",alignItems:"center",gap:6},children:se.enabled?r.jsxs(r.Fragment,{children:[r.jsx(pt,{size:12})," Maintenance"]}):r.jsxs(r.Fragment,{children:[r.jsx(pe,{size:12})," Live"]})})]})]}),r.jsxs("div",{className:"hero-stats",style:{display:"flex",gap:16,marginTop:24,flexWrap:"wrap"},children:[r.jsxs("div",{className:"hst",style:{background:"rgba(255,255,255,0.13)",borderRadius:"var(--r-md)",padding:"12px 20px"},children:[r.jsx("div",{className:"hst-v",style:{fontSize:26,fontWeight:700,lineHeight:1},children:Nm}),r.jsx("div",{className:"hst-l",style:{fontSize:11,opacity:.6},children:"Donors"})]}),r.jsxs("div",{className:"hst",children:[r.jsx("div",{className:"hst-v",children:Sm}),r.jsx("div",{className:"hst-l",children:"Creators"})]}),r.jsxs("div",{className:"hst",children:[r.jsxs("div",{className:"hst-v",children:["$",(Yc/1e3).toFixed(0),"k"]}),r.jsx("div",{className:"hst-l",children:"Raised"})]}),r.jsxs("div",{className:"hst",children:[r.jsx("div",{className:"hst-v",children:Z.length}),r.jsx("div",{className:"hst-l",children:"Campaigns"})]})]})]}),r.jsxs("div",{className:"stats-grid",children:[r.jsxs("div",{className:"sc",onClick:()=>c("users"),children:[r.jsx("div",{className:"si si-g",children:r.jsx(Kn,{size:18})}),r.jsx("div",{className:"sv",children:B.length}),r.jsx("div",{className:"sl",children:"Total Users"}),r.jsx("div",{className:"sd",children:"Click to manage →"})]}),r.jsxs("div",{className:"sc",onClick:()=>c("campaigns"),children:[r.jsx("div",{className:"si si-b",children:r.jsx(Ge,{size:18})}),r.jsx("div",{className:"sv",children:km}),r.jsx("div",{className:"sl",children:"Active Campaigns"}),r.jsx("div",{className:"sd",children:"Click to view →"})]}),r.jsxs("div",{className:"sc",onClick:()=>c("donations"),children:[r.jsx("div",{className:"si si-a",children:r.jsx(We,{size:18})}),r.jsxs("div",{className:"sv",children:["$",(Yc/1e3).toFixed(0),"k"]}),r.jsx("div",{className:"sl",children:"Total Raised"}),r.jsx("div",{className:"sd",children:"Click to view →"})]}),r.jsxs("div",{className:"sc",onClick:()=>c("completions"),children:[r.jsx("div",{className:"si si-r",children:r.jsx(Ra,{size:18})}),r.jsx("div",{className:"sv",children:Gc}),r.jsx("div",{className:"sl",children:"Pending Completions"}),r.jsx("div",{className:"sd",children:"Click to review →"})]})]}),r.jsx("div",{className:"sh",children:r.jsxs("div",{className:"sht",children:[r.jsx(kl,{size:18})," Quick Actions"]})}),r.jsx("div",{className:"qg",children:Cm.map(v=>r.jsxs("button",{className:"qb",onClick:()=>c(v.id),children:[r.jsx("div",{className:"qi",style:{background:`${v.color}15`,color:v.color},children:v.icon}),r.jsx("span",{className:"ql",children:v.label})]},v.id))}),r.jsx("div",{className:"sh",children:r.jsxs("div",{className:"sht",children:[r.jsx(pt,{size:18})," Quick Toggles"]})}),r.jsx("div",{className:"qt-grid",style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:"12px",marginBottom:"24px"},children:[{label:"Maintenance Mode",sub:se.enabled?"Enabled":"Disabled",on:se.enabled,onChange:um,danger:!0},{label:"Email Verification",sub:K?"Required":"Skipped",on:K,onChange:pm},{label:"reCAPTCHA",sub:Y?"Active":"Inactive",on:Y,onChange:fm},{label:"Dark Mode",sub:f?"Dark":"Light",on:f,onChange:x}].map(({label:v,sub:$,on:Ie,onChange:ct,danger:hn})=>r.jsxs("div",{className:"qt-card",style:{background:"var(--surface)",borderRadius:"var(--r-lg)",padding:"16px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{children:[r.jsx("div",{className:"qt-label",style:{fontWeight:600},children:v}),r.jsx("div",{className:"qt-sub",style:{fontSize:11,color:"var(--txt-3)"},children:$})]}),r.jsx(Yy,{checked:Ie,onChange:ct,danger:hn})]},v))}),r.jsxs("div",{className:"three-col",style:{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"20px",marginBottom:"24px"},children:[r.jsxs("div",{className:"card",children:[r.jsxs("div",{className:"card-h",children:[r.jsxs("div",{className:"card-t",children:[r.jsx(Ge,{size:18})," Pending Approvals"]}),r.jsxs("button",{className:"card-a",onClick:()=>c("campaigns"),children:["View all ",r.jsx(In,{size:14})]})]}),r.jsxs("div",{className:"card-b",children:[Z.filter(v=>v.status==="pending").slice(0,3).map(v=>r.jsxs("div",{className:"cr",style:{padding:"12px 0",borderBottom:"1px solid var(--border)"},children:[r.jsxs("div",{className:"ci",children:[r.jsx("div",{className:"cn",children:v.title}),r.jsxs("div",{className:"cm",children:["Goal: $",v.goal.toLocaleString()," · ",v.creator_name]}),r.jsx("div",{className:"pb",children:r.jsx("div",{className:"pf",style:{width:`${Math.min(v.raised/v.goal*100,100)}%`}})})]}),r.jsx("span",{className:"badge bp",children:"pending"}),r.jsxs("button",{className:"db dba",onClick:()=>Uc(v.id),children:[r.jsx(pe,{size:12})," Approve"]})]},v.id)),!Za&&r.jsx("div",{style:{color:"var(--txt-3)",fontSize:13,textAlign:"center",padding:20},children:"No pending campaigns"})]})]}),r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:20},children:[r.jsxs("div",{className:"card",children:[r.jsxs("div",{className:"card-h",children:[r.jsxs("div",{className:"card-t",children:[r.jsx(pe,{size:18})," Completions"]}),r.jsxs("button",{className:"card-a",onClick:()=>c("completions"),children:["Manage ",r.jsx(In,{size:14})]})]}),r.jsx("div",{className:"card-b",children:Q.slice(0,2).map(v=>{var $;return r.jsxs("div",{className:"di",style:{padding:"12px 0",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:12},children:[r.jsx("div",{className:"uav ava",style:{width:32,height:32,background:"var(--amber)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"},children:(($=v.title)==null?void 0:$.charAt(0))||"C"}),r.jsxs("div",{className:"di-info",children:[r.jsx("div",{className:"di-user",children:v.title}),r.jsxs("div",{className:"di-amt",children:[r.jsx(Br,{size:10})," ",new Date(v.completion_requested_at).toLocaleDateString()]})]}),r.jsx("button",{className:"db dba",onClick:()=>c("completions"),children:"Review"})]},v.id)})})]}),r.jsxs("div",{className:"card",children:[r.jsxs("div",{className:"card-h",children:[r.jsxs("div",{className:"card-t",children:[r.jsx(Ra,{size:18})," Withdrawal Queue"]}),r.jsxs("button",{className:"card-a",onClick:()=>c("withdrawals"),children:["Manage ",r.jsx(In,{size:14})]})]}),r.jsx("div",{className:"card-b",children:Se.filter(v=>v.status==="pending").slice(0,2).map(v=>{var $;return r.jsxs("div",{className:"di",style:{padding:"12px 0",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:12},children:[r.jsx("div",{className:"uav ava",style:{width:32,height:32,background:"var(--amber)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"},children:(($=v.name)==null?void 0:$[0])||"U"}),r.jsxs("div",{className:"di-info",children:[r.jsx("div",{className:"di-user",children:v.name}),r.jsxs("div",{className:"di-amt",children:[r.jsx(We,{size:10})," $",v.amount.toFixed(2)]})]}),r.jsxs("div",{className:"di-acts",children:[r.jsx("button",{className:"db dba",onClick:()=>Hc(v.id),children:r.jsx(pe,{size:12})}),r.jsx("button",{className:"db dbr",onClick:()=>Vc(v.id),children:r.jsx(Bt,{size:12})})]})]},v.id)})})]})]})]})]}),r.jsxs("div",{className:`ps ${l==="campaigns"?"active":""}`,children:[r.jsxs("div",{className:"sh",children:[r.jsxs("div",{className:"sht",children:[r.jsx(Ge,{size:18})," Campaign Management"]}),r.jsxs("button",{className:"btn btn-g",onClick:()=>alert("Create campaign feature coming soon"),children:[r.jsx(Sh,{size:16})," New Campaign"]})]}),r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",style:{padding:0,overflowX:"auto"},children:r.jsxs("table",{className:"ut",style:{minWidth:700},children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Campaign"}),r.jsx("th",{children:"Goal"}),r.jsx("th",{children:"Raised"}),r.jsx("th",{children:"Progress"}),r.jsx("th",{children:"Status"}),r.jsx("th",{children:"Actions"})]})}),r.jsx("tbody",{children:Z.map(v=>{const $=Math.min(v.raised/v.goal*100,100);return r.jsxs("tr",{children:[r.jsxs("td",{children:[r.jsx("strong",{children:v.title}),r.jsx("br",{}),r.jsx("small",{style:{color:"var(--txt-3)"},children:v.creator_name})]}),r.jsxs("td",{children:["$",v.goal.toLocaleString()]}),r.jsxs("td",{children:["$",v.raised.toLocaleString()]}),r.jsxs("td",{children:[r.jsx("div",{className:"pb",style:{width:80,height:4,background:"var(--bg)",borderRadius:2},children:r.jsx("div",{className:"pf",style:{width:`${$}%`,height:4,background:"var(--green)",borderRadius:2}})}),Math.round($),"%"]}),r.jsx("td",{children:r.jsx("span",{className:`badge ${v.status==="approved"?"ba":v.status==="pending"?"bp":"br"}`,children:v.status})}),r.jsxs("td",{children:[v.status==="pending"&&r.jsxs(r.Fragment,{children:[r.jsxs("button",{className:"db dba",onClick:()=>Uc(v.id),children:[r.jsx(pe,{size:12})," Approve"]}),r.jsxs("button",{className:"db dbr",onClick:()=>hm(v.id),children:[r.jsx(Bt,{size:12})," Reject"]})]}),r.jsxs("button",{className:"db dbr",onClick:()=>mm(v.id),children:[r.jsx(bu,{size:12})," Delete"]})]})]},v.id)})})]})})})]}),r.jsxs("div",{className:`ps ${l==="users"?"active":""}`,children:[r.jsxs("div",{className:"sh",children:[r.jsxs("div",{className:"sht",children:[r.jsx(Kn,{size:18})," User Management"]}),r.jsxs("button",{className:"btn btn-g",onClick:()=>C(!0),children:[r.jsx(Eh,{size:16})," Add User"]})]}),r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",style:{padding:0,overflowX:"auto"},children:r.jsxs("table",{className:"ut",style:{minWidth:700},children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"User"}),r.jsx("th",{children:"Role"}),r.jsx("th",{children:"Joined"}),r.jsx("th",{children:"Wallet"}),r.jsx("th",{children:"Status"}),r.jsx("th",{children:"Actions"})]})}),r.jsx("tbody",{children:B.map(v=>{var $;return r.jsxs("tr",{children:[r.jsx("td",{children:r.jsxs("div",{className:"uc",style:{display:"flex",alignItems:"center",gap:10},children:[r.jsx("div",{className:"uav avg",style:{width:32,height:32,background:"var(--grad1)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"},children:($=v.name)==null?void 0:$.charAt(0)}),r.jsxs("div",{children:[r.jsx("strong",{children:v.name}),r.jsx("br",{}),r.jsx("small",{children:v.email})]})]})}),r.jsx("td",{children:r.jsx("span",{className:"badge br",children:v.role})}),r.jsx("td",{children:new Date(v.created_at).toLocaleDateString()}),r.jsx("td",{children:r.jsxs("strong",{children:["$",(v.wallet_balance||0).toFixed(2)]})}),r.jsx("td",{children:r.jsx("span",{className:`badge ${v.is_active?"ba":"bx"}`,children:v.is_active?"Active":"Suspended"})}),r.jsx("td",{children:r.jsxs("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:[r.jsxs("button",{className:"db dbv",onClick:()=>gm(v.id),children:[v.is_active?r.jsx(oi,{size:12}):r.jsx(U0,{size:12})," ",v.is_active?"Suspend":"Restore"]}),!v.is_verified&&v.role!=="admin"&&r.jsxs("button",{className:"db dba",onClick:()=>xm(v.id),children:[r.jsx(pe,{size:12})," Verify"]}),v.role!=="admin"&&r.jsxs("button",{className:"db dbr",onClick:()=>y({open:!0,userId:v.id,userName:v.name}),children:[r.jsx(bu,{size:12})," Delete"]})]})})]},v.id)})})]})})})]}),r.jsxs("div",{className:`ps ${l==="donations"?"active":""}`,children:[r.jsx("div",{className:"sh",children:r.jsxs("div",{className:"sht",children:[r.jsx(We,{size:18})," All Donations"]})}),r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",style:{padding:0,overflowX:"auto"},children:r.jsxs("table",{className:"ut",style:{minWidth:600},children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Donor"}),r.jsx("th",{children:"Campaign"}),r.jsx("th",{children:"Amount"}),r.jsx("th",{children:"Monthly"}),r.jsx("th",{children:"Date"})]})}),r.jsx("tbody",{children:J.map(v=>r.jsxs("tr",{children:[r.jsx("td",{children:v.donor_name||"Anonymous"}),r.jsx("td",{children:v.campaign_title}),r.jsx("td",{children:r.jsxs("strong",{children:["$",v.amount.toLocaleString()]})}),r.jsx("td",{children:v.is_monthly?"✅":"—"}),r.jsx("td",{children:new Date(v.created_at).toLocaleDateString()})]},v.id))})]})})})]}),r.jsxs("div",{className:`ps ${l==="deposits"?"active":""}`,children:[r.jsx("div",{className:"sh",children:r.jsxs("div",{className:"sht",children:[r.jsx(nn,{size:18})," Deposit Requests"]})}),r.jsx("div",{className:"card",children:r.jsxs("div",{className:"card-b",children:[je.map(v=>r.jsxs("div",{style:{borderBottom:"1px solid var(--border)",padding:"16px 0"},children:[r.jsxs("div",{children:[r.jsx("strong",{children:v.name})," (",v.email,")"]}),r.jsxs("div",{children:["Amount: ",r.jsxs("strong",{children:["$",Yt(v.amount).toFixed(2)]})," · Status: ",r.jsx("span",{className:`badge ${v.status==="pending"?"bp":v.status==="approved"?"ba":"bx"}`,children:v.status})]}),v.status==="pending"&&r.jsxs("div",{style:{marginTop:12},children:[r.jsxs("button",{className:"db dba",onClick:()=>ym(v.id,v.amount),children:[r.jsx(pe,{size:12})," Approve"]}),r.jsxs("button",{className:"db dbr",onClick:()=>bm(v.id),children:[r.jsx(Bt,{size:12})," Reject"]})]})]},v.id)),je.length===0&&r.jsx("div",{style:{textAlign:"center",padding:20,color:"var(--txt-3)"},children:"No deposit requests"})]})})]}),r.jsxs("div",{className:`ps ${l==="withdrawals"?"active":""}`,children:[r.jsx("div",{className:"sh",children:r.jsxs("div",{className:"sht",children:[r.jsx(Wt,{size:18})," Withdrawal Requests"]})}),r.jsx("div",{className:"card",children:r.jsxs("div",{className:"card-b",children:[Se.map(v=>r.jsxs("div",{style:{borderBottom:"1px solid var(--border)",padding:"16px 0"},children:[r.jsxs("div",{children:[r.jsx("strong",{children:v.name})," (",v.email,")"]}),r.jsxs("div",{children:["Amount: ",r.jsxs("strong",{children:["$",Yt(v.amount).toFixed(2)]})," · Method: ",v.payment_method]}),r.jsx("span",{className:`badge ${v.status==="pending"?"bp":v.status==="approved"?"ba":"bx"}`,children:v.status}),v.status==="pending"&&r.jsxs("div",{style:{marginTop:12},children:[r.jsxs("button",{className:"db dba",onClick:()=>Hc(v.id),children:[r.jsx(pe,{size:12})," Approve"]}),r.jsxs("button",{className:"db dbr",onClick:()=>Vc(v.id),children:[r.jsx(Bt,{size:12})," Reject"]})]})]},v.id)),Se.length===0&&r.jsx("div",{style:{textAlign:"center",padding:20,color:"var(--txt-3)"},children:"No withdrawal requests"})]})})]}),r.jsx("div",{className:`ps ${l==="payouts"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"Payouts management coming soon"})})}),r.jsx("div",{className:`ps ${l==="fees"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"Fee settings coming soon"})})}),r.jsx("div",{className:`ps ${l==="completions"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"Campaign completions coming soon"})})}),r.jsx("div",{className:`ps ${l==="notifications"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"Push notifications coming soon"})})}),r.jsx("div",{className:`ps ${l==="audit-logs"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"Audit logs coming soon"})})}),r.jsx("div",{className:`ps ${l==="maintenance"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"Maintenance settings coming soon"})})}),r.jsx("div",{className:`ps ${l==="email_templates"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"Email templates coming soon"})})}),r.jsx("div",{className:`ps ${l==="massmail"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"Mass mail coming soon"})})}),r.jsx("div",{className:`ps ${l==="content"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"Content editor coming soon"})})}),r.jsx("div",{className:`ps ${l==="settings"?"active":""}`,children:r.jsx("div",{className:"card",children:r.jsx("div",{className:"card-b",children:"System settings coming soon"})})})]})]}),r.jsx("div",{className:"mobile-bottom-nav",children:r.jsx("div",{className:"mobile-bottom-nav-inner",children:Em.map(v=>r.jsxs("button",{className:`mobile-nav-item ${l===v.id?"active":""}`,onClick:()=>c(v.id),children:[v.icon,r.jsx("span",{children:v.label}),v.badge>0&&r.jsx("span",{className:"mobile-nav-badge",children:v.badge>9?"9+":v.badge})]},v.id))})}),r.jsx(Ky,{isOpen:g,onClose:()=>u(!1),onSave:jm,showToast:n}),r.jsx(Gy,{isOpen:h.open,onClose:()=>y({open:!1,userId:null,userName:""}),onConfirm:()=>vm(h.userId),userName:h.userName,showToast:n}),r.jsx(Jy,{isOpen:S,onClose:()=>C(!1),onSubmit:wm,userData:E,setUserData:I,loading:H})]})}function Xy(){const[e,t]=p.useState(""),[n,a]=p.useState(""),[s,i]=p.useState(!1),[o,l]=p.useState(""),{showToast:c}=Oe(),d=lt(),m=async f=>{f.preventDefault(),l(""),i(!0);try{const x=await ht.login({email:e,password:n});x.token&&x.user&&(localStorage.setItem("hb_token",x.token),x.user.role==="admin"?(c("Welcome back, Admin!"),d("/admin-dashboard")):(l("Access denied. Admin privileges required."),localStorage.removeItem("hb_token")))}catch(x){l(x.message||"Login failed. Please check your credentials."),c(x.message,!0)}finally{i(!1)}};return r.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",fontFamily:"'DM Sans', sans-serif",padding:"20px"},children:r.jsxs("div",{style:{background:"#fff",borderRadius:"20px",padding:"40px",width:"100%",maxWidth:"420px",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"},children:[r.jsxs("div",{style:{textAlign:"center",marginBottom:"32px"},children:[r.jsx("div",{style:{width:"60px",height:"60px",background:"linear-gradient(135deg, #e8531e, #f47c50)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"},children:r.jsx("i",{className:"fas fa-shield-alt",style:{fontSize:"28px",color:"#fff"}})}),r.jsx("h2",{style:{color:"#1a1a2e",marginBottom:"8px"},children:"Admin Access"}),r.jsx("p",{style:{color:"#6b7280",fontSize:"14px"},children:"Enter your credentials to access the admin panel"})]}),o&&r.jsxs("div",{style:{background:"#fee2e2",color:"#dc2626",padding:"12px",borderRadius:"8px",marginBottom:"20px",fontSize:"14px",textAlign:"center"},children:[r.jsx("i",{className:"fas fa-exclamation-triangle",style:{marginRight:"8px"}}),o]}),r.jsxs("form",{onSubmit:m,children:[r.jsxs("div",{style:{marginBottom:"20px"},children:[r.jsxs("label",{style:{display:"block",marginBottom:"8px",fontWeight:"600",color:"#374151",fontSize:"14px"},children:[r.jsx("i",{className:"fas fa-envelope",style:{marginRight:"8px",color:"#e8531e"}}),"Email Address"]}),r.jsx("input",{type:"email",value:e,onChange:f=>t(f.target.value),placeholder:"",style:{width:"100%",padding:"12px 16px",border:"2px solid #e5e7eb",borderRadius:"10px",fontSize:"14px",outline:"none",transition:"border-color 0.2s",fontFamily:"inherit"},onFocus:f=>f.target.style.borderColor="#e8531e",onBlur:f=>f.target.style.borderColor="#e5e7eb",required:!0})]}),r.jsxs("div",{style:{marginBottom:"24px"},children:[r.jsxs("label",{style:{display:"block",marginBottom:"8px",fontWeight:"600",color:"#374151",fontSize:"14px"},children:[r.jsx("i",{className:"fas fa-lock",style:{marginRight:"8px",color:"#e8531e"}}),"Password"]}),r.jsx("input",{type:"password",value:n,onChange:f=>a(f.target.value),placeholder:"",style:{width:"100%",padding:"12px 16px",border:"2px solid #e5e7eb",borderRadius:"10px",fontSize:"14px",outline:"none",transition:"border-color 0.2s",fontFamily:"inherit"},onFocus:f=>f.target.style.borderColor="#e8531e",onBlur:f=>f.target.style.borderColor="#e5e7eb",required:!0})]}),r.jsx("button",{type:"submit",disabled:s,style:{width:"100%",padding:"14px",background:"linear-gradient(135deg, #e8531e, #f47c50)",color:"#fff",border:"none",borderRadius:"10px",fontWeight:"700",fontSize:"16px",cursor:s?"not-allowed":"pointer",opacity:s?.7:1,transition:"transform 0.2s, opacity 0.2s",fontFamily:"inherit"},onMouseEnter:f=>{s||(f.target.style.transform="translateY(-2px)")},onMouseLeave:f=>{f.target.style.transform="translateY(0)"},children:s?r.jsxs(r.Fragment,{children:[r.jsx("i",{className:"fas fa-spinner fa-spin",style:{marginRight:"8px"}}),"Authenticating..."]}):r.jsxs(r.Fragment,{children:[r.jsx("i",{className:"fas fa-sign-in-alt",style:{marginRight:"8px"}}),"Login as Admin"]})})]}),r.jsx("div",{style:{textAlign:"center",marginTop:"24px"},children:r.jsxs("a",{href:"/",style:{color:"#6b7280",textDecoration:"none",fontSize:"14px",transition:"color 0.2s"},onMouseEnter:f=>f.target.style.color="#e8531e",onMouseLeave:f=>f.target.style.color="#6b7280",children:[r.jsx("i",{className:"fas fa-arrow-left",style:{marginRight:"6px"}}),"Back to Homepage"]})}),r.jsx("div",{style:{marginTop:"32px",padding:"16px",background:"#f9fafb",borderRadius:"10px",fontSize:"12px",color:"#6b7280",textAlign:"center"}})]})})}let Eu=!1;const Zy=()=>{if(Eu)return;Eu=!0;const e=document.createElement("style");e.textContent=`
    :root {
      --primary: #e8531e;
      --primary-dark: #c4400f;
      --primary-light: #f47c50;
      --secondary: #27a96c;
      --dark: #1a1a2e;
      --text: #444;
      --text-light: #777;
      --bg-light: #f8f9fa;
      --grad1: linear-gradient(135deg, #e8531e 0%, #f47c50 50%, #e8531e 100%);
      --grad2: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      --shadow: 0 8px 30px rgba(232, 83, 30, 0.18);
      --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .campaign-profile {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    }
    
    /* Dark Mode Support */
    body.dark-mode .campaign-profile {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
    
    body.dark-mode .campaign-section,
    body.dark-mode .progress-card,
    body.dark-mode .creator-card,
    body.dark-mode .related-card-container,
    body.dark-mode .campaign-tabs {
      background: #1e1e36;
      border-color: rgba(255,255,255,0.1);
    }
    
    body.dark-mode .campaign-section .section-title,
    body.dark-mode .progress-card .raised-amount .amount,
    body.dark-mode .creator-card h3,
    body.dark-mode .related-card-container h3 {
      color: #fff;
    }
    
    body.dark-mode .campaign-description {
      color: #ccc;
    }
    
    body.dark-mode .impact-item {
      background: #2a2a40;
    }
    
    body.dark-mode .impact-item .impact-label {
      color: #aaa;
    }
    
    body.dark-mode .donation-item {
      border-bottom-color: rgba(255,255,255,0.1);
    }
    
    body.dark-mode .donation-item:hover {
      background: #2a2a40;
    }
    
    body.dark-mode .donation-message {
      background: #2a2a40;
      color: #ccc;
    }

    .campaign-nav-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      padding: 12px 24px;
      display: flex;
      gap: 12px;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 20px rgba(0,0,0,0.08);
    }
    
    body.dark-mode .campaign-nav-bar {
      background: rgba(26,26,46,0.95);
    }
    
    body.dark-mode .nav-back {
      background: #2a2a40;
      color: #ccc;
    }
    
    body.dark-mode .nav-back:hover {
      background: #3a3a50;
    }

    .nav-left, .nav-right {
      display: flex;
      gap: 12px;
    }
    
    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
    }

    .nav-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 40px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      font-family: inherit;
    }
    .nav-back { background: #f3f4f6; color: #374151; }
    .nav-back:hover { background: #e5e7eb; transform: translateX(-2px); }
    .nav-home { background: var(--grad1); color: white; }
    .nav-home:hover { transform: translateY(-1px); box-shadow: var(--shadow); }
    .nav-share { background: var(--secondary); color: white; }
    .nav-share:hover { background: #1d9e75; }

    .campaign-hero {
      position: relative;
      height: 500px;
      overflow: hidden;
    }
    .campaign-hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: cover;
      background-position: center;
      transition: transform 0.5s ease;
    }
    .campaign-hero:hover .campaign-hero-bg {
      transform: scale(1.05);
    }
    .campaign-hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 100%);
    }
    .campaign-hero-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      color: white;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-bottom: 60px;
    }
    .campaign-badges {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .badge-category {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--primary);
      padding: 6px 16px;
      border-radius: 30px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      backdrop-filter: blur(4px);
    }
    .badge-funded {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--secondary);
      padding: 6px 16px;
      border-radius: 30px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .campaign-hero-content h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 20px;
      max-width: 800px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      line-height: 1.2;
    }
    
    @media (max-width: 768px) {
      .campaign-hero-content h1 {
        font-size: 1.8rem;
      }
      .campaign-hero {
        height: 400px;
      }
    }

    .creator-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .creator-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--grad1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      color: white;
      flex-shrink: 0;
    }
    .creator-info {
      flex: 1;
      min-width: 150px;
    }
    .creator-name {
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .verified-badge {
      background: #378ADD;
      border-radius: 20px;
      padding: 2px 8px;
      font-size: 0.7rem;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .campaign-container {
      max-width: 1200px;
      margin: -40px auto 0;
      padding: 0 24px 60px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
      position: relative;
      z-index: 3;
    }
    
    @media (max-width: 768px) {
      .campaign-container {
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 0 16px 60px;
      }
      .campaign-nav-bar {
        flex-wrap: wrap;
      }
      .nav-left, .nav-right {
        width: 100%;
        justify-content: space-between;
      }
      .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .nav-left .nav-btn:not(.nav-back) {
        display: none;
      }
      .nav-left .mobile-menu-btn {
        display: flex;
      }
    }

    .campaign-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 24px;
      background: white;
      border-radius: 16px;
      overflow-x: auto;
      white-space: nowrap;
      box-shadow: var(--shadow-card);
    }
    
    @media (max-width: 768px) {
      .campaign-tabs {
        justify-content: space-between;
      }
      .tab-btn {
        padding: 10px 12px;
        font-size: 0.85rem;
      }
    }

    .tab-btn {
      padding: 14px 20px;
      background: none;
      border: none;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      position: relative;
    }
    .tab-btn:hover { color: var(--primary); }
    .tab-btn.active {
      color: var(--primary);
      background: rgba(232,83,30,0.05);
    }
    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary);
    }

    .campaign-section {
      background: white;
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-card);
    }
    
    @media (max-width: 768px) {
      .campaign-section {
        padding: 20px;
      }
      .section-title {
        font-size: 1.2rem;
      }
    }

    .section-title {
      font-size: 1.3rem;
      margin-bottom: 20px;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .campaign-description {
      line-height: 1.9;
      color: #444;
      font-size: 1rem;
    }

    .progress-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow: var(--shadow-card);
      position: sticky;
      top: 100px;
    }
    
    @media (max-width: 768px) {
      .progress-card {
        position: relative;
        top: 0;
      }
    }

    .raised-amount {
      text-align: center;
      margin-bottom: 20px;
    }
    .raised-amount .amount {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
      display: block;
    }
    .raised-amount .goal {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .progress-bar {
      height: 10px;
      background: #e5e7eb;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .progress-fill {
      height: 100%;
      background: var(--grad1);
      border-radius: 20px;
      transition: width 0.5s ease;
    }

    .donate-btn {
      width: 100%;
      padding: 14px;
      background: var(--grad1);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
    }
    .donate-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
    .donate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .share-action-btn {
      width: 100%;
      padding: 12px;
      background: #f3f4f6;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
    }
    
    .creator-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      margin-top: 24px;
    }
    
    .creator-profile {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .creator-avatar-lg {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--grad1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.5rem;
      color: white;
      flex-shrink: 0;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,document.head.appendChild(e)};function e1({src:e,onClose:t}){return r.jsx("div",{className:"modal-overlay",onClick:t,style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},children:r.jsx("img",{src:e,alt:"Full size",style:{maxWidth:"90vw",maxHeight:"90vh",borderRadius:8}})})}function t1(){var V,ce,Re,te,Ve,Lt,Ct;Zy();const{id:e}=Iv(),t=lt(),{currentUser:n,showToast:a,walletBalance:s,refreshWallet:i}=Oe(),[o,l]=p.useState(null),[c,d]=p.useState(!0),[m,f]=p.useState([]),[x,b]=p.useState(0),[w,k]=p.useState(!1),[N,g]=p.useState(null),[u,h]=p.useState(null),[y,S]=p.useState("story"),[C,E]=p.useState([]),[I,H]=p.useState([]),[R,ne]=p.useState(!1),[de,ie]=p.useState(null),[Me,q]=p.useState(!1),[oe,Z]=p.useState(!1),T=(o==null?void 0:o.gallery_images)||[];p.useEffect(()=>{B(),U(),J(),ee(),window.scrollTo(0,0)},[e]);const B=async()=>{d(!0);try{const F=await Pt.getById(e);if(l(F.campaign),F.campaign.creator_id)try{const ae=await wh.getById(F.campaign.creator_id);ae&&ae.user&&g(ae.user)}catch(ae){console.error("Error loading creator:",ae)}}catch(F){console.error("Error loading campaign:",F),h("Campaign not found"),a("Failed to load campaign",!0)}finally{d(!1)}},U=async()=>{try{const F=await Dt.getCampaignDons(e);f(F.donations||[]),b(F.total||0)}catch(F){console.error("Error loading donations:",F)}},J=async()=>{try{const F=await Pt.getUpdates(e);E(F.updates||[])}catch(F){console.error("Error loading updates:",F)}},ee=async()=>{try{if(o!=null&&o.category){const F=await Pt.getRelated(e,o.category);H(F.campaigns||[])}}catch(F){console.error("Error loading related campaigns:",F)}},je=()=>{if(!n){a("Please login to donate",!0);return}k(!0)},ue=async()=>{const F=window.location.href;try{await navigator.clipboard.writeText(F),q(!0),a("Link copied to clipboard!"),setTimeout(()=>q(!1),2e3)}catch{a("Failed to copy link",!0)}},Se=()=>t(-1),L=()=>t("/"),Q=[{label:"Story",action:()=>{S("story"),Z(!1),window.scrollTo({top:0,behavior:"smooth"})}},{label:"Updates",action:()=>{S("updates"),Z(!1)}},{label:"Donations",action:()=>{S("donations"),Z(!1)}},{label:"Gallery",action:()=>{S("gallery"),Z(!1)}},{label:"Donate Now",action:()=>{je(),Z(!1)}},{label:"Share",action:()=>{ue(),Z(!1)}}];if(c)return r.jsxs("div",{className:"loading-container",style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",gap:20},children:[r.jsx(O0,{size:48,style:{animation:"spin 1s linear infinite",color:"var(--primary)"}}),r.jsx("p",{children:"Loading campaign..."})]});if(u||!o)return r.jsxs("div",{className:"error-container",style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20},children:[r.jsx(ri,{size:48,color:"var(--primary)"}),r.jsx("h2",{children:"Campaign Not Found"}),r.jsx("p",{children:"The campaign you're looking for doesn't exist or has been removed."}),r.jsxs("button",{onClick:L,className:"nav-btn nav-home",children:[r.jsx(yl,{size:16})," Back to Home"]})]});const Ce=Math.min(o.raised/o.goal*100,100),ye=o.raised>=o.goal,P=(N==null?void 0:N.is_verified)===!0,A=T.length>0;return r.jsxs("div",{className:"campaign-profile",children:[r.jsxs("div",{className:"campaign-nav-bar",children:[r.jsxs("div",{className:"nav-left",children:[r.jsxs("button",{onClick:Se,className:"nav-btn nav-back",children:[r.jsx(yl,{size:16})," Back"]}),r.jsxs("button",{onClick:L,className:"nav-btn nav-home",children:[r.jsx(ii,{size:16})," Home"]}),r.jsx("button",{className:"mobile-menu-btn",onClick:()=>Z(!oe),children:r.jsx(Qa,{size:24})})]}),r.jsx("div",{className:"nav-right",children:r.jsxs("button",{onClick:ue,className:"nav-btn nav-share",children:[Me?r.jsx(h0,{size:16}):r.jsx(yu,{size:16}),Me?"Copied!":"Share"]})})]}),oe&&r.jsx("div",{style:{position:"fixed",top:70,left:0,right:0,background:"white",zIndex:200,borderRadius:"0 0 16px 16px",boxShadow:"0 4px 20px rgba(0,0,0,0.1)",padding:"12px 0"},children:Q.map(F=>r.jsx("button",{onClick:F.action,style:{width:"100%",padding:"12px 24px",textAlign:"left",border:"none",background:"none",cursor:"pointer",fontSize:"1rem",fontWeight:y===F.label.toLowerCase()?700:500,color:y===F.label.toLowerCase()?"var(--primary)":"#333",borderLeft:y===F.label.toLowerCase()?"3px solid var(--primary)":"none"},children:F.label},F.label))}),r.jsxs("div",{className:"campaign-hero",children:[r.jsx("div",{className:"campaign-hero-bg",style:{backgroundImage:`url(${o.image_url||"https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&h=500&fit=crop"})`},children:r.jsx("div",{className:"campaign-hero-overlay"})}),r.jsxs("div",{className:"campaign-hero-content",children:[r.jsxs("div",{className:"campaign-badges",children:[r.jsxs("span",{className:"badge-category",children:[r.jsx(dy,{size:14})," ",o.category||"Cause"]}),ye&&r.jsxs("span",{className:"badge-funded",children:[r.jsx(pe,{size:14})," Fully Funded!"]})]}),r.jsx("h1",{children:o.title}),r.jsxs("div",{className:"creator-section",children:[r.jsx("div",{className:"creator-avatar",children:((V=N==null?void 0:N.name)==null?void 0:V.charAt(0))||((ce=o.creator_name)==null?void 0:ce.charAt(0))||"U"}),r.jsxs("div",{className:"creator-info",children:[r.jsxs("div",{className:"creator-name",children:["Created by ",(N==null?void 0:N.name)||o.creator_name||"Anonymous",P&&r.jsxs("span",{className:"verified-badge",children:[r.jsx(pe,{size:12})," Verified Creator"]})]}),r.jsx("div",{style:{display:"flex",gap:16,marginTop:4,flexWrap:"wrap"},children:r.jsxs("span",{style:{display:"flex",alignItems:"center",gap:4,fontSize:"0.8rem"},children:[r.jsx(Br,{size:12})," Started ",new Date(o.created_at).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})]})})]})]})]})]}),r.jsxs("div",{className:"campaign-container",children:[r.jsxs("div",{className:"campaign-main",children:[r.jsxs("div",{className:"campaign-tabs",children:[r.jsxs("button",{className:`tab-btn ${y==="story"?"active":""}`,onClick:()=>S("story"),children:[r.jsx(gu,{size:16})," Story"]}),r.jsxs("button",{className:`tab-btn ${y==="updates"?"active":""}`,onClick:()=>S("updates"),children:[r.jsx(oo,{size:16})," Updates (",C.length,")"]}),r.jsxs("button",{className:`tab-btn ${y==="donations"?"active":""}`,onClick:()=>S("donations"),children:[r.jsx($e,{size:16})," Donations (",m.length,")"]}),A&&r.jsxs("button",{className:`tab-btn ${y==="gallery"?"active":""}`,onClick:()=>S("gallery"),children:[r.jsx(bl,{size:16})," Gallery"]})]}),y==="story"&&r.jsxs("div",{className:"campaign-section",children:[r.jsxs("h2",{className:"section-title",children:[r.jsx(gu,{size:20})," Campaign Story"]}),r.jsxs("div",{className:"campaign-description",children:[r.jsxs("div",{className:R?"description-full":"description-truncated",style:R?{}:{maxHeight:300,overflow:"hidden",position:"relative"},children:[o.description||"No description provided.",!R&&o.description&&o.description.length>500&&r.jsx("div",{style:{position:"absolute",bottom:0,left:0,right:0,height:60,background:"linear-gradient(transparent, white)"}})]}),o.description&&o.description.length>500&&r.jsxs("button",{className:"read-more-btn",onClick:()=>ne(!R),style:{marginTop:16,background:"none",border:"none",color:"var(--primary)",cursor:"pointer",fontWeight:600,display:"inline-flex",alignItems:"center",gap:6},children:[R?"Show less":"Read more",r.jsx(ni,{size:14})]})]})]}),y==="updates"&&r.jsxs("div",{className:"campaign-section",children:[r.jsxs("h2",{className:"section-title",children:[r.jsx(oo,{size:20})," Campaign Updates"]}),C.length===0?r.jsxs("div",{style:{textAlign:"center",padding:"40px",color:"#9ca3af"},children:[r.jsx(oo,{size:48,style:{marginBottom:12}}),r.jsx("p",{children:"No updates yet. Check back soon!"})]}):C.map(F=>r.jsxs("div",{style:{padding:16,borderBottom:"1px solid #f3f4f6"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8},children:[r.jsx("strong",{children:F.title}),r.jsx("span",{style:{fontSize:12,color:"#9ca3af"},children:new Date(F.created_at).toLocaleDateString()})]}),r.jsx("div",{style:{lineHeight:1.6},children:F.content})]},F.id))]}),y==="donations"&&r.jsxs("div",{className:"campaign-section",children:[r.jsxs("h2",{className:"section-title",children:[r.jsx(_0,{size:20})," Recent Donations"]}),m.length===0?r.jsxs("div",{style:{textAlign:"center",padding:"40px",color:"#9ca3af"},children:[r.jsx(kn,{size:48,style:{marginBottom:12}}),r.jsx("p",{children:"No donations yet. Be the first to donate!"})]}):r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"donations-summary",style:{display:"flex",gap:20,marginBottom:24,padding:20,background:"linear-gradient(135deg, #fef3c7, #fffbeb)",borderRadius:16,flexWrap:"wrap"},children:[r.jsxs("div",{style:{flex:1,textAlign:"center"},children:[r.jsxs("span",{style:{display:"block",fontSize:"1.5rem",fontWeight:800,color:"var(--primary)"},children:["$",x.toLocaleString()]}),r.jsx("span",{children:"Total Raised"})]}),r.jsxs("div",{style:{flex:1,textAlign:"center"},children:[r.jsx("span",{style:{display:"block",fontSize:"1.5rem",fontWeight:800,color:"var(--primary)"},children:m.length}),r.jsx("span",{children:"Total Donations"})]})]}),r.jsx("div",{style:{maxHeight:500,overflowY:"auto"},children:m.map(F=>{var ae;return r.jsxs("div",{style:{padding:16,borderBottom:"1px solid #f3f4f6"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"},children:[r.jsx("div",{style:{width:40,height:40,borderRadius:"50%",background:"var(--grad1)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"white"},children:((ae=F.donor_name)==null?void 0:ae.charAt(0))||"A"}),r.jsxs("div",{style:{flex:1,minWidth:150},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"},children:[r.jsx("strong",{children:F.donor_name||"Anonymous"}),F.is_monthly&&r.jsx("span",{style:{fontSize:"0.7rem",background:"#dbeafe",color:"#1e40af",padding:"2px 8px",borderRadius:20},children:"Monthly"})]}),r.jsxs("span",{style:{fontSize:"0.7rem",color:"#9ca3af",display:"flex",alignItems:"center",gap:4,marginTop:2},children:[r.jsx(Br,{size:10}),new Date(F.created_at).toLocaleDateString()]})]}),r.jsxs("div",{style:{fontWeight:700,color:"var(--primary)"},children:["$",parseFloat(F.amount).toLocaleString()]})]}),F.message&&r.jsxs("div",{style:{marginTop:10,padding:"10px 12px",background:"#f9fafb",borderRadius:12,fontSize:"0.85rem",color:"#6b7280",fontStyle:"italic"},children:['"',F.message,'"']})]},F.id)})})]})]}),y==="gallery"&&A&&r.jsxs("div",{className:"campaign-section",children:[r.jsxs("h2",{className:"section-title",children:[r.jsx(bl,{size:20})," Photo Gallery"]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))",gap:12,marginTop:16},children:T.map((F,ae)=>r.jsx("div",{onClick:()=>ie(F),style:{aspectRatio:1,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"transform 0.2s"},onMouseEnter:De=>De.currentTarget.style.transform="scale(1.05)",onMouseLeave:De=>De.currentTarget.style.transform="scale(1)",children:r.jsx("img",{src:F,alt:`Gallery ${ae+1}`,style:{width:"100%",height:"100%",objectFit:"cover"}})},ae))})]}),de&&r.jsx(e1,{src:de,onClose:()=>ie(null)})]}),r.jsxs("div",{className:"campaign-sidebar",children:[r.jsxs("div",{className:"progress-card",children:[r.jsxs("div",{className:"raised-amount",children:[r.jsxs("span",{className:"amount",children:[r.jsx(We,{size:20,style:{display:"inline"}})," ",(Re=o.raised)==null?void 0:Re.toLocaleString()]}),r.jsxs("span",{className:"goal",children:["raised of $",(te=o.goal)==null?void 0:te.toLocaleString()," goal"]})]}),r.jsx("div",{className:"progress-bar",children:r.jsx("div",{className:"progress-fill",style:{width:`${Ce}%`}})}),r.jsxs("div",{className:"progress-stats",style:{display:"flex",justifyContent:"space-between",marginBottom:24},children:[r.jsxs("span",{children:[r.jsx(Ch,{size:12})," ",Math.round(Ce),"% funded"]}),r.jsxs("span",{children:[r.jsx(Ra,{size:12})," ",Math.max(0,30-Math.floor((new Date-new Date(o.created_at))/(1e3*60*60*24)))," days left"]})]}),r.jsxs("button",{className:"donate-btn",onClick:je,disabled:ye,children:[r.jsx($e,{size:18})," ",ye?"Campaign Complete":"Donate Now"]}),r.jsxs("button",{className:"share-action-btn",onClick:ue,children:[r.jsx(yu,{size:16})," Share Campaign"]}),r.jsxs("div",{className:"funding-breakdown",style:{marginTop:20,paddingTop:16,borderTop:"1px solid #f3f4f6"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0"},children:[r.jsx("span",{children:"Raised:"}),r.jsxs("strong",{children:["$",(Ve=o.raised)==null?void 0:Ve.toLocaleString()]})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0"},children:[r.jsx("span",{children:"Remaining:"}),r.jsxs("strong",{children:["$",Math.max(0,o.goal-o.raised).toLocaleString()]})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0"},children:[r.jsx("span",{children:"Donors:"}),r.jsx("strong",{children:m.length})]})]})]}),w&&r.jsxs("div",{className:"donation-form-card",style:{background:"white",borderRadius:20,padding:24,marginTop:24},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:12,borderBottom:"1px solid #f3f4f6"},children:[r.jsxs("h3",{style:{display:"flex",alignItems:"center",gap:8,margin:0},children:[r.jsx(kn,{size:18})," Make a Donation"]}),r.jsx("button",{onClick:()=>k(!1),style:{background:"none",border:"none",cursor:"pointer"},children:r.jsx(Bt,{size:20})})]}),r.jsx(_c,{campaignId:o.id,onSuccess:()=>{k(!1),B(),U(),i()}})]}),r.jsxs("div",{className:"creator-card",children:[r.jsxs("h3",{style:{marginBottom:16,display:"flex",alignItems:"center",gap:8},children:[r.jsx(y0,{size:18})," About the Creator"]}),r.jsxs("div",{className:"creator-profile",children:[r.jsx("div",{className:"creator-avatar-lg",children:((Lt=N==null?void 0:N.name)==null?void 0:Lt.charAt(0))||((Ct=o.creator_name)==null?void 0:Ct.charAt(0))||"C"}),r.jsxs("div",{children:[r.jsxs("div",{className:"creator-fullname",style:{display:"flex",alignItems:"center",gap:6},children:[(N==null?void 0:N.name)||o.creator_name,P&&r.jsx(pe,{size:14,color:"#378ADD"})]}),r.jsxs("div",{className:"creator-joined",style:{fontSize:"0.75rem",color:"#6b7280",marginTop:4},children:["Member since ",N!=null&&N.created_at?new Date(N.created_at).getFullYear():"2024"]})]})]}),r.jsxs("button",{className:"contact-btn",onClick:()=>a("Contact creator feature coming soon"),style:{width:"100%",padding:10,background:"#f3f4f6",border:"none",borderRadius:12,cursor:"pointer",fontWeight:600,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8},children:[r.jsx(er,{size:14})," Contact Creator"]})]}),I.length>0&&r.jsxs("div",{className:"related-card-container",style:{background:"white",borderRadius:20,padding:24,marginTop:24},children:[r.jsxs("h3",{style:{marginBottom:16,display:"flex",alignItems:"center",gap:8},children:[r.jsx($e,{size:18})," You Might Also Like"]}),I.map(F=>{var ae,De;return r.jsxs("div",{onClick:()=>t(`/campaign/${F.id}`),style:{display:"flex",gap:12,padding:12,cursor:"pointer",borderRadius:12,transition:"background 0.2s"},onMouseEnter:Et=>Et.currentTarget.style.background="#f3f4f6",onMouseLeave:Et=>Et.currentTarget.style.background="transparent",children:[r.jsx("img",{src:F.image_url||"https://placehold.co/80x80",alt:F.title,style:{width:70,height:70,borderRadius:12,objectFit:"cover"}}),r.jsxs("div",{style:{flex:1},children:[r.jsx("div",{style:{fontWeight:600,fontSize:"0.9rem",marginBottom:4},children:F.title}),r.jsxs("div",{style:{fontSize:"0.75rem",color:"#6b7280"},children:["$",(ae=F.raised)==null?void 0:ae.toLocaleString()," raised of $",(De=F.goal)==null?void 0:De.toLocaleString()]}),r.jsx("div",{className:"progress-bar",style:{marginTop:6,height:3,background:"#e5e7eb",borderRadius:2},children:r.jsx("div",{className:"progress-fill",style:{width:`${F.raised/F.goal*100}%`,height:3,borderRadius:2}})})]}),r.jsx(ni,{size:16,color:"#9ca3af"})]},F.id)})]})]})]})]})}function n1(){const[e]=Zv(),t=e.get("token"),[n,a]=p.useState("loading"),[s,i]=p.useState("");return p.useEffect(()=>{if(!t){a("error"),i("Missing verification token.");return}ht.verifyEmail(t).then(o=>{a("success"),i(o.message||"Your email has been verified! You can now sign in.")}).catch(o=>{a("error"),i(o.message||"Verification failed. The link may be invalid or expired.")})},[t]),r.jsx("div",{className:"verify-page",style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"var(--bg-light)",padding:"1rem"},children:r.jsxs("div",{style:{background:"#fff",borderRadius:"16px",padding:"40px",maxWidth:"480px",width:"100%",textAlign:"center",boxShadow:"var(--shadow-card)"},children:[n==="loading"&&r.jsxs(r.Fragment,{children:[r.jsx("i",{className:"fas fa-spinner fa-pulse",style:{fontSize:"2.5rem",color:"var(--primary)"}}),r.jsx("h2",{style:{margin:"20px 0 10px"},children:"Verifying your email..."}),r.jsx("p",{style:{color:"var(--text-light)"},children:"Please wait a moment."})]}),n==="success"&&r.jsxs(r.Fragment,{children:[r.jsx("i",{className:"fas fa-check-circle",style:{fontSize:"3rem",color:"var(--secondary)"}}),r.jsx("h2",{style:{margin:"20px 0 10px",color:"var(--secondary)"},children:"Email Verified!"}),r.jsx("p",{style:{color:"var(--text)"},children:s}),r.jsx("a",{href:"/",className:"btn-primary-custom",style:{marginTop:"20px",textDecoration:"none"},children:"Go to Home"})]}),n==="error"&&r.jsxs(r.Fragment,{children:[r.jsx("i",{className:"fas fa-times-circle",style:{fontSize:"3rem",color:"#c0392b"}}),r.jsx("h2",{style:{margin:"20px 0 10px",color:"#c0392b"},children:"Verification Failed"}),r.jsx("p",{style:{color:"var(--text)"},children:s}),r.jsx("a",{href:"/",className:"btn-primary-custom",style:{marginTop:"20px",textDecoration:"none"},children:"Return to Home"})]})]})})}const r1="modulepreload",a1=function(e){return"/"+e},_u={},s1=function(t,n,a){let s=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(n.map(c=>{if(c=a1(c),c in _u)return;_u[c]=!0;const d=c.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":r1,d||(f.as="script"),f.crossOrigin="",f.href=c,l&&f.setAttribute("nonce",l),document.head.appendChild(f),d)return new Promise((x,b)=>{f.addEventListener("load",x),f.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return s.then(o=>{for(const l of o||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})};function i1(){const{authOpen:e,authMode:t,authRole:n,closeAuth:a,login:s,register:i,showToast:o,openAuth:l,setCurrentUser:c}=Oe(),d=lt(),[m,f]=p.useState(t),[x,b]=p.useState(n),[w,k]=p.useState(""),[N,g]=p.useState(""),[u,h]=p.useState(""),[y,S]=p.useState(""),[C,E]=p.useState(!1),[I,H]=p.useState(!1),[R,ne]=p.useState(""),[de,ie]=p.useState(!1),[Me,q]=p.useState(!0),[oe,Z]=p.useState(""),[T,B]=p.useState(0);if(p.useEffect(()=>{e&&ht.getVerificationStatus().then(L=>{q(L.enabled)}).catch(()=>{})},[e]),p.useEffect(()=>{if(T>0){const L=setTimeout(()=>B(T-1),1e3);return()=>clearTimeout(L)}},[T]),!e)return null;const U=(L,Q)=>{f(L),Q&&b(Q),k(""),g(""),h(""),S(""),H(!1),ne(""),B(0)},J=async L=>{var Q,Ce,ye,P;L.preventDefault(),E(!0);try{if(m==="register"){const A=await ht.register({name:w,email:N,password:u,role:x,recaptchaToken:null});A.needsVerification?(ne(N),Z(N),H(!0),f("verify"),o("Verification code sent! Please check your email to complete registration.")):(a(),o(`Welcome to HopeBridge, ${w}!`),sessionStorage.getItem("pendingDonation")&&(sessionStorage.removeItem("pendingDonation"),o("You can now complete your donation!")),((Q=A.user)==null?void 0:Q.role)==="admin"?d("/admin-dashboard"):((Ce=A.user)==null?void 0:Ce.role)==="creator"?d("/creator-dashboard"):((ye=A.user)==null?void 0:ye.role)==="donor"&&d("/donor-dashboard"))}else if(m==="login"){await s(N,u),a();const A=sessionStorage.getItem("pendingDonation"),V=sessionStorage.getItem("redirectAfterAuth");A&&V&&(sessionStorage.removeItem("pendingDonation"),sessionStorage.removeItem("redirectAfterAuth"),d(V),o("You can now complete your donation!"))}}catch(A){(P=A.data)!=null&&P.needsVerification?(ne(N),Z(N),H(!0),f("verify"),o("Please verify your email first.",!0)):o(A.message,!0)}finally{E(!1)}},ee=async L=>{L.preventDefault(),E(!0);try{const Q=await ht.verifyCode({email:R,code:y});if(Q.token&&Q.user){const{saveToken:Ce}=await s1(async()=>{const{saveToken:ye}=await Promise.resolve().then(()=>e0);return{saveToken:ye}},void 0);Ce(Q.token),c&&c(Q.user),o("Email verified! Account created successfully."),a(),Q.user.role==="admin"?d("/admin-dashboard"):Q.user.role==="creator"?d("/creator-dashboard"):Q.user.role==="donor"?d("/donor-dashboard"):d("/")}else o("Email verified! You can now log in."),f("login"),H(!1),S(""),g(R),h("")}catch(Q){o(Q.message,!0)}finally{E(!1)}},je=async()=>{if(T>0){o(`Please wait ${T} seconds before resending`,!0);return}try{await ht.resendCode(R),o("Verification code resent! Please check your email."),B(60)}catch(L){L.message&&L.message.includes("already verified")?(o("Your email is already verified! Please login.",!0),f("login"),H(!1),g(R),h(""),S("")):o(L.message,!0)}},ue={width:"100%",padding:"12px 14px",border:"2px solid #e9ecef",borderRadius:8,fontFamily:"inherit",fontSize:"0.95rem",transition:"0.2s",outline:"none",boxSizing:"border-box",marginBottom:14,color:"#1a1a2e",background:"#fff"},Se={width:"100%",background:"linear-gradient(135deg,#e8531e,#f47c50)",color:"#fff",border:"none",padding:"13px",borderRadius:8,fontWeight:700,fontSize:"1rem",cursor:C?"not-allowed":"pointer",fontFamily:"inherit",opacity:C?.7:1,transition:"0.2s",marginTop:4};return r.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"},onClick:L=>L.target===L.currentTarget&&a(),children:r.jsxs("div",{style:{background:"#fff",borderRadius:18,padding:"36px 32px",width:"100%",maxWidth:440,maxHeight:"92vh",overflowY:"auto",position:"relative",boxShadow:"0 30px 80px rgba(0,0,0,0.22)",fontFamily:"'DM Sans',sans-serif"},children:[r.jsx("button",{onClick:a,style:{position:"absolute",top:16,right:18,background:"#f3f4f6",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#6b7280"},children:r.jsx(Bt,{size:16})}),r.jsxs("div",{style:{textAlign:"center",marginBottom:22},children:[r.jsx($e,{size:36,color:"#e8531e",style:{margin:"0 auto"}}),r.jsx("div",{style:{fontFamily:"Raleway,sans-serif",fontSize:"1.5rem",fontWeight:900,color:"#1a1a2e",marginTop:8},children:"HopeBridge"})]}),m==="verify"&&r.jsxs(r.Fragment,{children:[r.jsx("h2",{style:{fontSize:"1.3rem",color:"#1a1a2e",marginBottom:6,textAlign:"center"},children:"Verify Your Email"}),r.jsxs("p",{style:{fontSize:"0.88rem",color:"#6b7280",textAlign:"center",marginBottom:20},children:["We sent a 6-digit code to ",r.jsx("strong",{children:R})]}),r.jsxs("div",{style:{fontSize:"0.8rem",color:"#e8531e",textAlign:"center",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:6},children:[r.jsx(wl,{size:14}),r.jsx("span",{children:"Your account will be created only after successful verification"})]}),r.jsxs("form",{onSubmit:ee,children:[r.jsx("label",{style:{fontWeight:700,fontSize:"0.85rem",color:"#374151",display:"block",marginBottom:6},children:"Verification Code"}),r.jsx("input",{type:"text",maxLength:6,value:y,onChange:L=>S(L.target.value.replace(/\D/g,"")),placeholder:"000000",required:!0,style:{...ue,textAlign:"center",letterSpacing:10,fontSize:"1.6rem",fontWeight:700}}),r.jsx("button",{type:"submit",style:Se,disabled:C,children:C?"Verifying...":r.jsxs(r.Fragment,{children:[r.jsx(pe,{size:16,style:{marginRight:8}}),"Verify & Create Account"]})})]}),r.jsxs("div",{style:{textAlign:"center",marginTop:14,fontSize:"0.88rem",color:"#6b7280"},children:["Didn't receive it?"," ",r.jsxs("span",{onClick:je,style:{color:T>0?"#9ca3af":"#e8531e",fontWeight:700,cursor:T>0?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:4},children:[r.jsx(Wr,{size:12}),T>0?`Resend (${T}s)`:"Resend code"]})]}),r.jsx("div",{style:{textAlign:"center",marginTop:10,fontSize:"0.85rem"},children:r.jsxs("span",{onClick:()=>U("login","donor"),style:{color:"#6b7280",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4},children:[r.jsx(yl,{size:14}),"Back to login"]})})]}),m==="login"&&r.jsxs(r.Fragment,{children:[r.jsx("h2",{style:{fontSize:"1.4rem",color:"#1a1a2e",marginBottom:6,textAlign:"center"},children:"Welcome Back"}),r.jsx("p",{style:{fontSize:"0.88rem",color:"#6b7280",textAlign:"center",marginBottom:22},children:"Sign in to your account"}),r.jsxs("form",{onSubmit:J,children:[r.jsx("label",{style:{fontWeight:700,fontSize:"0.85rem",color:"#374151",display:"block",marginBottom:6},children:"Email Address"}),r.jsxs("div",{style:{position:"relative",marginBottom:14},children:[r.jsx(er,{size:18,style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}),r.jsx("input",{type:"email",value:N,onChange:L=>g(L.target.value),required:!0,style:{...ue,paddingLeft:40}})]}),r.jsx("label",{style:{fontWeight:700,fontSize:"0.85rem",color:"#374151",display:"block",marginBottom:6},children:"Password"}),r.jsxs("div",{style:{position:"relative",marginBottom:14},children:[r.jsx(oi,{size:18,style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}),r.jsx("input",{type:de?"text":"password",value:u,onChange:L=>h(L.target.value),required:!0,style:{...ue,paddingLeft:40,paddingRight:44}}),r.jsx("button",{type:"button",onClick:()=>ie(L=>!L),style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#9ca3af"},children:de?r.jsx(ai,{size:18}):r.jsx(si,{size:18})})]}),r.jsx("button",{type:"submit",style:Se,disabled:C,children:C?"Signing in...":r.jsxs(r.Fragment,{children:[r.jsx(jl,{size:16,style:{marginRight:8}}),"Sign In"]})})]}),r.jsxs("div",{style:{textAlign:"center",marginTop:16,fontSize:"0.88rem",color:"#6b7280"},children:["No account?"," ",r.jsxs("span",{onClick:()=>U("register","donor"),style:{color:"#e8531e",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4},children:[r.jsx(Eh,{size:14}),"Create one free"]})]}),r.jsx("div",{style:{textAlign:"center",marginTop:8,fontSize:"0.85rem"},children:r.jsxs("span",{onClick:()=>U("register","creator"),style:{color:"#27a96c",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4},children:[r.jsx(kl,{size:14}),"Start a campaign",r.jsx(In,{size:14})]})})]}),m==="register"&&r.jsxs(r.Fragment,{children:[r.jsx("h2",{style:{fontSize:"1.3rem",color:"#1a1a2e",marginBottom:6,textAlign:"center"},children:"Create Account"}),r.jsx("div",{style:{display:"flex",gap:8,marginBottom:20,marginTop:6},children:[{r:"donor",label:"Donor",sub:"Give to causes",icon:r.jsx($e,{size:14})},{r:"creator",label:"Creator",sub:"Run campaigns",icon:r.jsx(Ge,{size:14})}].map(({r:L,label:Q,sub:Ce,icon:ye})=>r.jsxs("button",{type:"button",onClick:()=>b(L),style:{flex:1,border:`2px solid ${x===L?L==="donor"?"#e8531e":"#27a96c":"#e5e7eb"}`,borderRadius:12,padding:"12px 8px",cursor:"pointer",background:x===L?L==="donor"?"#fff5f0":"#f0fdf4":"#fff",transition:"0.15s",fontFamily:"inherit"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:6},children:[ye,r.jsx("div",{style:{fontWeight:700,fontSize:"0.95rem",color:x===L?L==="donor"?"#e8531e":"#27a96c":"#374151"},children:Q})]}),r.jsx("div",{style:{fontSize:"0.78rem",color:"#9ca3af",marginTop:2},children:Ce})]},L))}),Me&&r.jsxs("div",{style:{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",fontSize:"0.82rem",color:"#1e40af",marginBottom:16,display:"flex",alignItems:"center",gap:8},children:[r.jsx(er,{size:14}),r.jsxs("div",{children:["We'll send a verification code to your email.",r.jsx("br",{}),r.jsx("strong",{children:"Your account will be created only after verification."})]})]}),r.jsxs("form",{onSubmit:J,children:[r.jsx("label",{style:{fontWeight:700,fontSize:"0.85rem",color:"#374151",display:"block",marginBottom:6},children:"Full Name"}),r.jsxs("div",{style:{position:"relative",marginBottom:14},children:[r.jsx($a,{size:18,style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}),r.jsx("input",{type:"text",value:w,onChange:L=>k(L.target.value),required:!0,style:{...ue,paddingLeft:40}})]}),r.jsx("label",{style:{fontWeight:700,fontSize:"0.85rem",color:"#374151",display:"block",marginBottom:6},children:"Email Address"}),r.jsxs("div",{style:{position:"relative",marginBottom:14},children:[r.jsx(er,{size:18,style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}),r.jsx("input",{type:"email",value:N,onChange:L=>g(L.target.value),required:!0,style:{...ue,paddingLeft:40}})]}),r.jsx("label",{style:{fontWeight:700,fontSize:"0.85rem",color:"#374151",display:"block",marginBottom:6},children:"Password (min 6 characters)"}),r.jsxs("div",{style:{position:"relative",marginBottom:14},children:[r.jsx(oi,{size:18,style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}),r.jsx("input",{type:de?"text":"password",value:u,onChange:L=>h(L.target.value),required:!0,minLength:6,style:{...ue,paddingLeft:40,paddingRight:44}}),r.jsx("button",{type:"button",onClick:()=>ie(L=>!L),style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#9ca3af"},children:de?r.jsx(ai,{size:18}):r.jsx(si,{size:18})})]}),r.jsx("button",{type:"submit",style:{...Se,background:x==="creator"?"linear-gradient(135deg,#27a96c,#059669)":"linear-gradient(135deg,#e8531e,#f47c50)"},disabled:C,children:C?"Sending code...":r.jsxs(r.Fragment,{children:[x==="donor"?r.jsx($e,{size:16,style:{marginRight:8}}):r.jsx(kl,{size:16,style:{marginRight:8}}),x==="donor"?"Join as Donor":"Start Campaigning"]})})]}),r.jsxs("div",{style:{textAlign:"center",marginTop:16,fontSize:"0.88rem",color:"#6b7280"},children:["Already have an account?"," ",r.jsxs("span",{onClick:()=>U("login","donor"),style:{color:"#e8531e",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4},children:[r.jsx(jl,{size:14}),"Sign in"]})]})]})]})})}function o1({msg:e,error:t}){return r.jsxs("div",{className:`toast-msg${t?" error":""}`,children:[r.jsx("i",{className:`fas ${t?"fa-exclamation-triangle":"fa-check-circle"}`}),e]})}const l1=()=>{const[e,t]=p.useState(null),[n,a]=p.useState(!1),[s,i]=p.useState(!1),[o,l]=p.useState(!1),[c,d]=p.useState(!1);p.useEffect(()=>{const b=localStorage.getItem("pwa_force_ios")==="true"||/iPad|iPhone|iPod/.test(navigator.userAgent);d(b);const w=localStorage.getItem("pwa_prompt_shown");if(w){a(!1);return}if(window.matchMedia("(display-mode: standalone)").matches){i(!0);return}if(!b&&window.matchMedia("(display-mode: browser)").matches){const k=g=>{g.preventDefault(),t(g),a(!0),localStorage.setItem("pwa_prompt_shown","true")};window.addEventListener("beforeinstallprompt",k),window.addEventListener("appinstalled",()=>{i(!0),a(!1)});const N=setTimeout(()=>{!e&&!s&&!w&&(l(!0),localStorage.setItem("pwa_prompt_shown","true"))},3e3);return()=>{window.removeEventListener("beforeinstallprompt",k),clearTimeout(N)}}else{const k=setTimeout(()=>{a(!0),localStorage.setItem("pwa_prompt_shown","true")},1500);return()=>clearTimeout(k)}},[e,s]);const m=async()=>{if(e){e.prompt();const{outcome:x}=await e.userChoice;console.log(x),t(null),a(!1)}else alert("You can install this app from your browser’s menu or address bar.")},f=()=>{a(!1),l(!1),localStorage.setItem("pwa_prompt_shown","true")};return p.useEffect(()=>{!c&&!localStorage.getItem("pwa_force_ios")&&console.log('💡 Tip: To test iOS "Add to Home Screen" prompt on desktop, run: localStorage.setItem("pwa_force_ios", "true") and refresh.')},[]),s||!n&&!o?null:r.jsx("div",{className:"pwa-install-overlay",children:r.jsxs("div",{className:"pwa-install-card",children:[r.jsx("button",{className:"pwa-close-btn",onClick:f,children:r.jsx("i",{className:"fas fa-times"})}),r.jsx("div",{className:"pwa-install-icon",children:r.jsx("i",{className:`fas ${c?"fa-share-alt":"fa-download"}`})}),r.jsx("h3",{children:c?"Add to Home Screen":"Install HopeBridge"}),c?r.jsxs(r.Fragment,{children:[r.jsx("p",{children:"For the best experience, add this app to your home screen:"}),r.jsxs("ol",{style:{textAlign:"left",margin:"12px 0",paddingLeft:"20px"},children:[r.jsxs("li",{children:["Tap the ",r.jsx("strong",{children:"Share"})," icon ",r.jsx("i",{className:"fas fa-share-square"})," (bottom center)"]}),r.jsxs("li",{children:["Scroll down and tap ",r.jsx("strong",{children:"Add to Home Screen"})]}),r.jsxs("li",{children:["Tap ",r.jsx("strong",{children:"Add"})," in the top right corner"]})]})]}):r.jsxs(r.Fragment,{children:[r.jsx("p",{children:"Install this app for a faster, full‑screen experience."}),r.jsxs("div",{className:"pwa-install-actions",children:[r.jsx("button",{className:"pwa-install-btn",onClick:m,children:"Install"}),r.jsx("button",{className:"pwa-later-btn",onClick:f,children:"Later"})]})]}),c&&r.jsx("button",{className:"pwa-later-btn",onClick:f,style:{marginTop:"12px"},children:"Don't show again"})]})})},c1=()=>{};var zu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h=function(e){const t=[];let n=0;for(let a=0;a<e.length;a++){let s=e.charCodeAt(a);s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=s&63|128):(s&64512)===55296&&a+1<e.length&&(e.charCodeAt(a+1)&64512)===56320?(s=65536+((s&1023)<<10)+(e.charCodeAt(++a)&1023),t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=s&63|128):(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=s&63|128)}return t},d1=function(e){const t=[];let n=0,a=0;for(;n<e.length;){const s=e[n++];if(s<128)t[a++]=String.fromCharCode(s);else if(s>191&&s<224){const i=e[n++];t[a++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=e[n++],o=e[n++],l=e[n++],c=((s&7)<<18|(i&63)<<12|(o&63)<<6|l&63)-65536;t[a++]=String.fromCharCode(55296+(c>>10)),t[a++]=String.fromCharCode(56320+(c&1023))}else{const i=e[n++],o=e[n++];t[a++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return t.join("")},zh={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,a=[];for(let s=0;s<e.length;s+=3){const i=e[s],o=s+1<e.length,l=o?e[s+1]:0,c=s+2<e.length,d=c?e[s+2]:0,m=i>>2,f=(i&3)<<4|l>>4;let x=(l&15)<<2|d>>6,b=d&63;c||(b=64,o||(x=64)),a.push(n[m],n[f],n[x],n[b])}return a.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(_h(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):d1(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,a=[];for(let s=0;s<e.length;){const i=n[e.charAt(s++)],l=s<e.length?n[e.charAt(s)]:0;++s;const d=s<e.length?n[e.charAt(s)]:64;++s;const f=s<e.length?n[e.charAt(s)]:64;if(++s,i==null||l==null||d==null||f==null)throw new u1;const x=i<<2|l>>4;if(a.push(x),d!==64){const b=l<<4&240|d>>2;if(a.push(b),f!==64){const w=d<<6&192|f;a.push(w)}}}return a},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class u1 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const p1=function(e){const t=_h(e);return zh.encodeByteArray(t,!0)},Th=function(e){return p1(e).replace(/\./g,"")},f1=function(e){try{return zh.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function h1(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m1=()=>h1().__FIREBASE_DEFAULTS__,g1=()=>{if(typeof process>"u"||typeof zu>"u")return;const e=zu.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},x1=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&f1(e[1]);return t&&JSON.parse(t)},v1=()=>{try{return c1()||m1()||g1()||x1()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},Dh=()=>{var e;return(e=v1())==null?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y1{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,a)=>{n?this.reject(n):this.resolve(a),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,a))}}}function Ih(){try{return typeof indexedDB=="object"}catch{return!1}}function Ph(){return new Promise((e,t)=>{try{let n=!0;const a="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(a);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(a),e(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var i;t(((i=s.error)==null?void 0:i.message)||"")}}catch(n){t(n)}})}function b1(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j1="FirebaseError";class Kr extends Error{constructor(t,n,a){super(n),this.code=t,this.customData=a,this.name=j1,Object.setPrototypeOf(this,Kr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,zi.prototype.create)}}class zi{constructor(t,n,a){this.service=t,this.serviceName=n,this.errors=a}create(t,...n){const a=n[0]||{},s=`${this.service}/${t}`,i=this.errors[t],o=i?w1(i,a):"Error",l=`${this.serviceName}: ${o} (${s}).`;return new Kr(s,l,a)}}function w1(e,t){return e.replace(k1,(n,a)=>{const s=t[a];return s!=null?String(s):`<${a}?>`})}const k1=/\{\$([^}]+)}/g;function Sl(e,t){if(e===t)return!0;const n=Object.keys(e),a=Object.keys(t);for(const s of n){if(!a.includes(s))return!1;const i=e[s],o=t[s];if(Tu(i)&&Tu(o)){if(!Sl(i,o))return!1}else if(i!==o)return!1}for(const s of a)if(!n.includes(s))return!1;return!0}function Tu(e){return e!==null&&typeof e=="object"}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zc(e){return e&&e._delegate?e._delegate:e}class Ln{constructor(t,n,a){this.name=t,this.instanceFactory=n,this.type=a,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N1{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const a=new y1;if(this.instancesDeferred.set(n,a),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&a.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){const n=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),a=(t==null?void 0:t.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(a)return null;throw s}else{if(a)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(C1(t))try{this.getOrInitializeService({instanceIdentifier:Hn})}catch{}for(const[n,a]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:s});a.resolve(i)}catch{}}}}clearInstance(t=Hn){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Hn){return this.instances.has(t)}getOptions(t=Hn){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,a=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(a))throw Error(`${this.name}(${a}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:a,options:n});for(const[i,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);a===l&&o.resolve(s)}return s}onInit(t,n){const a=this.normalizeInstanceIdentifier(n),s=this.onInitCallbacks.get(a)??new Set;s.add(t),this.onInitCallbacks.set(a,s);const i=this.instances.get(a);return i&&t(i,a),()=>{s.delete(t)}}invokeOnInitCallbacks(t,n){const a=this.onInitCallbacks.get(n);if(a)for(const s of a)try{s(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let a=this.instances.get(t);if(!a&&this.component&&(a=this.component.instanceFactory(this.container,{instanceIdentifier:S1(t),options:n}),this.instances.set(t,a),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(a,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,a)}catch{}return a||null}normalizeInstanceIdentifier(t=Hn){return this.component?this.component.multipleInstances?t:Hn:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function S1(e){return e===Hn?void 0:e}function C1(e){return e.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E1{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new N1(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xe;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(xe||(xe={}));const _1={debug:xe.DEBUG,verbose:xe.VERBOSE,info:xe.INFO,warn:xe.WARN,error:xe.ERROR,silent:xe.SILENT},z1=xe.INFO,T1={[xe.DEBUG]:"log",[xe.VERBOSE]:"log",[xe.INFO]:"info",[xe.WARN]:"warn",[xe.ERROR]:"error"},D1=(e,t,...n)=>{if(t<e.logLevel)return;const a=new Date().toISOString(),s=T1[t];if(s)console[s](`[${a}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class I1{constructor(t){this.name=t,this._logLevel=z1,this._logHandler=D1,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in xe))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?_1[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,xe.DEBUG,...t),this._logHandler(this,xe.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,xe.VERBOSE,...t),this._logHandler(this,xe.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,xe.INFO,...t),this._logHandler(this,xe.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,xe.WARN,...t),this._logHandler(this,xe.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,xe.ERROR,...t),this._logHandler(this,xe.ERROR,...t)}}const P1=(e,t)=>t.some(n=>e instanceof n);let Du,Iu;function A1(){return Du||(Du=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function M1(){return Iu||(Iu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ah=new WeakMap,Cl=new WeakMap,Mh=new WeakMap,lo=new WeakMap,Tc=new WeakMap;function R1(e){const t=new Promise((n,a)=>{const s=()=>{e.removeEventListener("success",i),e.removeEventListener("error",o)},i=()=>{n(sn(e.result)),s()},o=()=>{a(e.error),s()};e.addEventListener("success",i),e.addEventListener("error",o)});return t.then(n=>{n instanceof IDBCursor&&Ah.set(n,e)}).catch(()=>{}),Tc.set(t,e),t}function L1(e){if(Cl.has(e))return;const t=new Promise((n,a)=>{const s=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",o),e.removeEventListener("abort",o)},i=()=>{n(),s()},o=()=>{a(e.error||new DOMException("AbortError","AbortError")),s()};e.addEventListener("complete",i),e.addEventListener("error",o),e.addEventListener("abort",o)});Cl.set(e,t)}let El={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return Cl.get(e);if(t==="objectStoreNames")return e.objectStoreNames||Mh.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return sn(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function F1(e){El=e(El)}function $1(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const a=e.call(co(this),t,...n);return Mh.set(a,t.sort?t.sort():[t]),sn(a)}:M1().includes(e)?function(...t){return e.apply(co(this),t),sn(Ah.get(this))}:function(...t){return sn(e.apply(co(this),t))}}function O1(e){return typeof e=="function"?$1(e):(e instanceof IDBTransaction&&L1(e),P1(e,A1())?new Proxy(e,El):e)}function sn(e){if(e instanceof IDBRequest)return R1(e);if(lo.has(e))return lo.get(e);const t=O1(e);return t!==e&&(lo.set(e,t),Tc.set(t,e)),t}const co=e=>Tc.get(e);function Ti(e,t,{blocked:n,upgrade:a,blocking:s,terminated:i}={}){const o=indexedDB.open(e,t),l=sn(o);return a&&o.addEventListener("upgradeneeded",c=>{a(sn(o.result),c.oldVersion,c.newVersion,sn(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}function uo(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",a=>t(a.oldVersion,a)),sn(n).then(()=>{})}const B1=["get","getKey","getAll","getAllKeys","count"],W1=["put","add","delete","clear"],po=new Map;function Pu(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(po.get(t))return po.get(t);const n=t.replace(/FromIndex$/,""),a=t!==n,s=W1.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(s||B1.includes(n)))return;const i=async function(o,...l){const c=this.transaction(o,s?"readwrite":"readonly");let d=c.store;return a&&(d=d.index(l.shift())),(await Promise.all([d[n](...l),s&&c.done]))[0]};return po.set(t,i),i}F1(e=>({...e,get:(t,n,a)=>Pu(t,n)||e.get(t,n,a),has:(t,n)=>!!Pu(t,n)||e.has(t,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U1{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(H1(n)){const a=n.getImmediate();return`${a.library}/${a.version}`}else return null}).filter(n=>n).join(" ")}}function H1(e){const t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}const _l="@firebase/app",Au="0.14.12";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const un=new I1("@firebase/app"),V1="@firebase/app-compat",q1="@firebase/analytics-compat",Y1="@firebase/analytics",K1="@firebase/app-check-compat",G1="@firebase/app-check",J1="@firebase/auth",Q1="@firebase/auth-compat",X1="@firebase/database",Z1="@firebase/data-connect",eb="@firebase/database-compat",tb="@firebase/functions",nb="@firebase/functions-compat",rb="@firebase/installations",ab="@firebase/installations-compat",sb="@firebase/messaging",ib="@firebase/messaging-compat",ob="@firebase/performance",lb="@firebase/performance-compat",cb="@firebase/remote-config",db="@firebase/remote-config-compat",ub="@firebase/storage",pb="@firebase/storage-compat",fb="@firebase/firestore",hb="@firebase/ai",mb="@firebase/firestore-compat",gb="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zl="[DEFAULT]",xb={[_l]:"fire-core",[V1]:"fire-core-compat",[Y1]:"fire-analytics",[q1]:"fire-analytics-compat",[G1]:"fire-app-check",[K1]:"fire-app-check-compat",[J1]:"fire-auth",[Q1]:"fire-auth-compat",[X1]:"fire-rtdb",[Z1]:"fire-data-connect",[eb]:"fire-rtdb-compat",[tb]:"fire-fn",[nb]:"fire-fn-compat",[rb]:"fire-iid",[ab]:"fire-iid-compat",[sb]:"fire-fcm",[ib]:"fire-fcm-compat",[ob]:"fire-perf",[lb]:"fire-perf-compat",[cb]:"fire-rc",[db]:"fire-rc-compat",[ub]:"fire-gcs",[pb]:"fire-gcs-compat",[fb]:"fire-fst",[mb]:"fire-fst-compat",[hb]:"fire-vertex","fire-js":"fire-js",[gb]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const li=new Map,vb=new Map,Tl=new Map;function Mu(e,t){try{e.container.addComponent(t)}catch(n){un.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function ir(e){const t=e.name;if(Tl.has(t))return un.debug(`There were multiple attempts to register component ${t}.`),!1;Tl.set(t,e);for(const n of li.values())Mu(n,e);for(const n of vb.values())Mu(n,e);return!0}function Dc(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yb={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Pn=new zi("app","Firebase",yb);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bb{constructor(t,n,a){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=a,this.container.addComponent(new Ln("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw Pn.create("app-deleted",{appName:this._name})}}function Ic(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const a={name:zl,automaticDataCollectionEnabled:!0,...t},s=a.name;if(typeof s!="string"||!s)throw Pn.create("bad-app-name",{appName:String(s)});if(n||(n=Dh()),!n)throw Pn.create("no-options");const i=li.get(s);if(i){if(Sl(n,i.options)&&Sl(a,i.config))return i;throw Pn.create("duplicate-app",{appName:s})}const o=new E1(s);for(const c of Tl.values())o.addComponent(c);const l=new bb(n,a,o);return li.set(s,l),l}function jb(e=zl){const t=li.get(e);if(!t&&e===zl&&Dh())return Ic();if(!t)throw Pn.create("no-app",{appName:e});return t}function An(e,t,n){let a=xb[e]??e;n&&(a+=`-${n}`);const s=a.match(/\s|\//),i=t.match(/\s|\//);if(s||i){const o=[`Unable to register library "${a}" with version "${t}":`];s&&o.push(`library name "${a}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${t}" contains illegal characters (whitespace or "/")`),un.warn(o.join(" "));return}ir(new Ln(`${a}-version`,()=>({library:a,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wb="firebase-heartbeat-database",kb=1,Oa="firebase-heartbeat-store";let fo=null;function Rh(){return fo||(fo=Ti(wb,kb,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(Oa)}catch(n){console.warn(n)}}}}).catch(e=>{throw Pn.create("idb-open",{originalErrorMessage:e.message})})),fo}async function Nb(e){try{const n=(await Rh()).transaction(Oa),a=await n.objectStore(Oa).get(Lh(e));return await n.done,a}catch(t){if(t instanceof Kr)un.warn(t.message);else{const n=Pn.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});un.warn(n.message)}}}async function Ru(e,t){try{const a=(await Rh()).transaction(Oa,"readwrite");await a.objectStore(Oa).put(t,Lh(e)),await a.done}catch(n){if(n instanceof Kr)un.warn(n.message);else{const a=Pn.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});un.warn(a.message)}}}function Lh(e){return`${e.name}!${e.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sb=1024,Cb=30;class Eb{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new zb(n),this._heartbeatsCachePromise=this._storage.read().then(a=>(this._heartbeatsCache=a,a))}async triggerHeartbeat(){var t,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Lu();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>Cb){const o=Tb(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(a){un.warn(a)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Lu(),{heartbeatsToSend:a,unsentEntries:s}=_b(this._heartbeatsCache.heartbeats),i=Th(JSON.stringify({version:2,heartbeats:a}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return un.warn(n),""}}}function Lu(){return new Date().toISOString().substring(0,10)}function _b(e,t=Sb){const n=[];let a=e.slice();for(const s of e){const i=n.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Fu(n)>t){i.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Fu(n)>t){n.pop();break}a=a.slice(1)}return{heartbeatsToSend:n,unsentEntries:a}}class zb{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ih()?Ph().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Nb(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const a=await this.read();return Ru(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??a.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const a=await this.read();return Ru(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??a.lastSentHeartbeatDate,heartbeats:[...a.heartbeats,...t.heartbeats]})}else return}}function Fu(e){return Th(JSON.stringify({version:2,heartbeats:e})).length}function Tb(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let a=1;a<e.length;a++)e[a].date<n&&(n=e[a].date,t=a);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Db(e){ir(new Ln("platform-logger",t=>new U1(t),"PRIVATE")),ir(new Ln("heartbeat",t=>new Eb(t),"PRIVATE")),An(_l,Au,e),An(_l,Au,"esm2020"),An("fire-js","")}Db("");var Ib="firebase",Pb="12.13.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */An(Ib,Pb,"app");const Fh="@firebase/installations",Pc="0.6.22";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $h=1e4,Oh=`w:${Pc}`,Bh="FIS_v2",Ab="https://firebaseinstallations.googleapis.com/v1",Mb=60*60*1e3,Rb="installations",Lb="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fb={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},or=new zi(Rb,Lb,Fb);function Wh(e){return e instanceof Kr&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uh({projectId:e}){return`${Ab}/projects/${e}/installations`}function Hh(e){return{token:e.token,requestStatus:2,expiresIn:Ob(e.expiresIn),creationTime:Date.now()}}async function Vh(e,t){const a=(await t.json()).error;return or.create("request-failed",{requestName:e,serverCode:a.code,serverMessage:a.message,serverStatus:a.status})}function qh({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function $b(e,{refreshToken:t}){const n=qh(e);return n.append("Authorization",Bb(t)),n}async function Yh(e){const t=await e();return t.status>=500&&t.status<600?e():t}function Ob(e){return Number(e.replace("s","000"))}function Bb(e){return`${Bh} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wb({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const a=Uh(e),s=qh(e),i=t.getImmediate({optional:!0});if(i){const d=await i.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const o={fid:n,authVersion:Bh,appId:e.appId,sdkVersion:Oh},l={method:"POST",headers:s,body:JSON.stringify(o)},c=await Yh(()=>fetch(a,l));if(c.ok){const d=await c.json();return{fid:d.fid||n,registrationStatus:2,refreshToken:d.refreshToken,authToken:Hh(d.authToken)}}else throw await Vh("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kh(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ub(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hb=/^[cdef][\w-]{21}$/,Dl="";function Vb(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=qb(e);return Hb.test(n)?n:Dl}catch{return Dl}}function qb(e){return Ub(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Di(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gh=new Map;function Jh(e,t){const n=Di(e);Qh(n,t),Yb(n,t)}function Qh(e,t){const n=Gh.get(e);if(n)for(const a of n)a(t)}function Yb(e,t){const n=Kb();n&&n.postMessage({key:e,fid:t}),Gb()}let Gn=null;function Kb(){return!Gn&&"BroadcastChannel"in self&&(Gn=new BroadcastChannel("[Firebase] FID Change"),Gn.onmessage=e=>{Qh(e.data.key,e.data.fid)}),Gn}function Gb(){Gh.size===0&&Gn&&(Gn.close(),Gn=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jb="firebase-installations-database",Qb=1,lr="firebase-installations-store";let ho=null;function Ac(){return ho||(ho=Ti(Jb,Qb,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(lr)}}})),ho}async function ci(e,t){const n=Di(e),s=(await Ac()).transaction(lr,"readwrite"),i=s.objectStore(lr),o=await i.get(n);return await i.put(t,n),await s.done,(!o||o.fid!==t.fid)&&Jh(e,t.fid),t}async function Xh(e){const t=Di(e),a=(await Ac()).transaction(lr,"readwrite");await a.objectStore(lr).delete(t),await a.done}async function Ii(e,t){const n=Di(e),s=(await Ac()).transaction(lr,"readwrite"),i=s.objectStore(lr),o=await i.get(n),l=t(o);return l===void 0?await i.delete(n):await i.put(l,n),await s.done,l&&(!o||o.fid!==l.fid)&&Jh(e,l.fid),l}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mc(e){let t;const n=await Ii(e.appConfig,a=>{const s=Xb(a),i=Zb(e,s);return t=i.registrationPromise,i.installationEntry});return n.fid===Dl?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function Xb(e){const t=e||{fid:Vb(),registrationStatus:0};return Zh(t)}function Zb(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(or.create("app-offline"));return{installationEntry:t,registrationPromise:s}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},a=ej(e,n);return{installationEntry:n,registrationPromise:a}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:tj(e)}:{installationEntry:t}}async function ej(e,t){try{const n=await Wb(e,t);return ci(e.appConfig,n)}catch(n){throw Wh(n)&&n.customData.serverCode===409?await Xh(e.appConfig):await ci(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function tj(e){let t=await $u(e.appConfig);for(;t.registrationStatus===1;)await Kh(100),t=await $u(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:a}=await Mc(e);return a||n}return t}function $u(e){return Ii(e,t=>{if(!t)throw or.create("installation-not-found");return Zh(t)})}function Zh(e){return nj(e)?{fid:e.fid,registrationStatus:0}:e}function nj(e){return e.registrationStatus===1&&e.registrationTime+$h<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rj({appConfig:e,heartbeatServiceProvider:t},n){const a=aj(e,n),s=$b(e,n),i=t.getImmediate({optional:!0});if(i){const d=await i.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const o={installation:{sdkVersion:Oh,appId:e.appId}},l={method:"POST",headers:s,body:JSON.stringify(o)},c=await Yh(()=>fetch(a,l));if(c.ok){const d=await c.json();return Hh(d)}else throw await Vh("Generate Auth Token",c)}function aj(e,{fid:t}){return`${Uh(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rc(e,t=!1){let n;const a=await Ii(e.appConfig,i=>{if(!em(i))throw or.create("not-registered");const o=i.authToken;if(!t&&oj(o))return i;if(o.requestStatus===1)return n=sj(e,t),i;{if(!navigator.onLine)throw or.create("app-offline");const l=cj(i);return n=ij(e,l),l}});return n?await n:a.authToken}async function sj(e,t){let n=await Ou(e.appConfig);for(;n.authToken.requestStatus===1;)await Kh(100),n=await Ou(e.appConfig);const a=n.authToken;return a.requestStatus===0?Rc(e,t):a}function Ou(e){return Ii(e,t=>{if(!em(t))throw or.create("not-registered");const n=t.authToken;return dj(n)?{...t,authToken:{requestStatus:0}}:t})}async function ij(e,t){try{const n=await rj(e,t),a={...t,authToken:n};return await ci(e.appConfig,a),n}catch(n){if(Wh(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await Xh(e.appConfig);else{const a={...t,authToken:{requestStatus:0}};await ci(e.appConfig,a)}throw n}}function em(e){return e!==void 0&&e.registrationStatus===2}function oj(e){return e.requestStatus===2&&!lj(e)}function lj(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+Mb}function cj(e){const t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}function dj(e){return e.requestStatus===1&&e.requestTime+$h<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uj(e){const t=e,{installationEntry:n,registrationPromise:a}=await Mc(t);return a?a.catch(console.error):Rc(t).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pj(e,t=!1){const n=e;return await fj(n),(await Rc(n,t)).token}async function fj(e){const{registrationPromise:t}=await Mc(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hj(e){if(!e||!e.options)throw mo("App Configuration");if(!e.name)throw mo("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw mo(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function mo(e){return or.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tm="installations",mj="installations-internal",gj=e=>{const t=e.getProvider("app").getImmediate(),n=hj(t),a=Dc(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:a,_delete:()=>Promise.resolve()}},xj=e=>{const t=e.getProvider("app").getImmediate(),n=Dc(t,tm).getImmediate();return{getId:()=>uj(n),getToken:s=>pj(n,s)}};function vj(){ir(new Ln(tm,gj,"PUBLIC")),ir(new Ln(mj,xj,"PRIVATE"))}vj();An(Fh,Pc);An(Fh,Pc,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yj="/firebase-messaging-sw.js",bj="/firebase-cloud-messaging-push-scope",nm="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",jj="https://fcmregistrations.googleapis.com/v1",rm="google.c.a.c_id",wj="google.c.a.c_l",kj="google.c.a.ts",Nj="google.c.a.e",Bu=1e4;var Wu;(function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(Wu||(Wu={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var Ba;(function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked"})(Ba||(Ba={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(e){const t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function Sj(e){const t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),a=atob(n),s=new Uint8Array(a.length);for(let i=0;i<a.length;++i)s[i]=a.charCodeAt(i);return s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const go="fcm_token_details_db",Cj=5,Uu="fcm_token_object_Store";async function Ej(e){if("databases"in indexedDB&&!(await indexedDB.databases()).map(i=>i.name).includes(go))return null;let t=null;return(await Ti(go,Cj,{upgrade:async(a,s,i,o)=>{if(s<2||!a.objectStoreNames.contains(Uu))return;const l=o.objectStore(Uu),c=await l.index("fcmSenderId").get(e);if(await l.clear(),!!c){if(s===2){const d=c;if(!d.auth||!d.p256dh||!d.endpoint)return;t={token:d.fcmToken,createTime:d.createTime??Date.now(),subscriptionOptions:{auth:d.auth,p256dh:d.p256dh,endpoint:d.endpoint,swScope:d.swScope,vapidKey:typeof d.vapidKey=="string"?d.vapidKey:Jt(d.vapidKey)}}}else if(s===3){const d=c;t={token:d.fcmToken,createTime:d.createTime,subscriptionOptions:{auth:Jt(d.auth),p256dh:Jt(d.p256dh),endpoint:d.endpoint,swScope:d.swScope,vapidKey:Jt(d.vapidKey)}}}else if(s===4){const d=c;t={token:d.fcmToken,createTime:d.createTime,subscriptionOptions:{auth:Jt(d.auth),p256dh:Jt(d.p256dh),endpoint:d.endpoint,swScope:d.swScope,vapidKey:Jt(d.vapidKey)}}}}}})).close(),await uo(go),await uo("fcm_vapid_details_db"),await uo("undefined"),_j(t)?t:null}function _j(e){if(!e||!e.subscriptionOptions)return!1;const{subscriptionOptions:t}=e;return typeof e.createTime=="number"&&e.createTime>0&&typeof e.token=="string"&&e.token.length>0&&typeof t.auth=="string"&&t.auth.length>0&&typeof t.p256dh=="string"&&t.p256dh.length>0&&typeof t.endpoint=="string"&&t.endpoint.length>0&&typeof t.swScope=="string"&&t.swScope.length>0&&typeof t.vapidKey=="string"&&t.vapidKey.length>0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zj="firebase-messaging-database",Tj=1,Wa="firebase-messaging-store";let xo=null;function am(){return xo||(xo=Ti(zj,Tj,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(Wa)}}})),xo}async function Dj(e){const t=sm(e),a=await(await am()).transaction(Wa).objectStore(Wa).get(t);if(a)return a;{const s=await Ej(e.appConfig.senderId);if(s)return await Lc(e,s),s}}async function Lc(e,t){const n=sm(e),s=(await am()).transaction(Wa,"readwrite");return await s.objectStore(Wa).put(t,n),await s.done,t}function sm({appConfig:e}){return e.appId}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ij={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},Je=new zi("messaging","Messaging",Ij);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pj(e,t){const n=await $c(e),a=im(t),s={method:"POST",headers:n,body:JSON.stringify(a)};let i;try{i=await(await fetch(Fc(e.appConfig),s)).json()}catch(o){throw Je.create("token-subscribe-failed",{errorInfo:o==null?void 0:o.toString()})}if(i.error){const o=i.error.message;throw Je.create("token-subscribe-failed",{errorInfo:o})}if(!i.token)throw Je.create("token-subscribe-no-token");return i.token}async function Aj(e,t){const n=await $c(e),a=im(t.subscriptionOptions),s={method:"PATCH",headers:n,body:JSON.stringify(a)};let i;try{i=await(await fetch(`${Fc(e.appConfig)}/${t.token}`,s)).json()}catch(o){throw Je.create("token-update-failed",{errorInfo:o==null?void 0:o.toString()})}if(i.error){const o=i.error.message;throw Je.create("token-update-failed",{errorInfo:o})}if(!i.token)throw Je.create("token-update-no-token");return i.token}async function Mj(e,t){const a={method:"DELETE",headers:await $c(e)};try{const i=await(await fetch(`${Fc(e.appConfig)}/${t}`,a)).json();if(i.error){const o=i.error.message;throw Je.create("token-unsubscribe-failed",{errorInfo:o})}}catch(s){throw Je.create("token-unsubscribe-failed",{errorInfo:s==null?void 0:s.toString()})}}function Fc({projectId:e}){return`${jj}/projects/${e}/registrations`}async function $c({appConfig:e,installations:t}){const n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function im({p256dh:e,auth:t,endpoint:n,vapidKey:a}){const s={web:{endpoint:n,auth:t,p256dh:e}};return a!==nm&&(s.web.applicationPubKey=a),s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rj=7*24*60*60*1e3;async function Lj(e){const t=await $j(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:Jt(t.getKey("auth")),p256dh:Jt(t.getKey("p256dh"))},a=await Dj(e.firebaseDependencies);if(a){if(Oj(a.subscriptionOptions,n))return Date.now()>=a.createTime+Rj?Fj(e,{token:a.token,createTime:Date.now(),subscriptionOptions:n}):a.token;try{await Mj(e.firebaseDependencies,a.token)}catch(s){console.warn(s)}return Hu(e.firebaseDependencies,n)}else return Hu(e.firebaseDependencies,n)}async function Fj(e,t){try{const n=await Aj(e.firebaseDependencies,t),a={...t,token:n,createTime:Date.now()};return await Lc(e.firebaseDependencies,a),n}catch(n){throw n}}async function Hu(e,t){const a={token:await Pj(e,t),createTime:Date.now(),subscriptionOptions:t};return await Lc(e,a),a.token}async function $j(e,t){const n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Sj(t)})}function Oj(e,t){const n=t.vapidKey===e.vapidKey,a=t.endpoint===e.endpoint,s=t.auth===e.auth,i=t.p256dh===e.p256dh;return n&&a&&s&&i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vu(e){const t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return Bj(t,e),Wj(t,e),Uj(t,e),t}function Bj(e,t){if(!t.notification)return;e.notification={};const n=t.notification.title;n&&(e.notification.title=n);const a=t.notification.body;a&&(e.notification.body=a);const s=t.notification.image;s&&(e.notification.image=s);const i=t.notification.icon;i&&(e.notification.icon=i)}function Wj(e,t){t.data&&(e.data=t.data)}function Uj(e,t){var s,i,o,l;if(!t.fcmOptions&&!((s=t.notification)!=null&&s.click_action))return;e.fcmOptions={};const n=((i=t.fcmOptions)==null?void 0:i.link)??((o=t.notification)==null?void 0:o.click_action);n&&(e.fcmOptions.link=n);const a=(l=t.fcmOptions)==null?void 0:l.analytics_label;a&&(e.fcmOptions.analyticsLabel=a)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hj(e){return typeof e=="object"&&!!e&&rm in e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vj(e){if(!e||!e.options)throw vo("App Configuration Object");if(!e.name)throw vo("App Name");const t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(const a of t)if(!n[a])throw vo(a);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function vo(e){return Je.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qj{constructor(t,n,a){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const s=Vj(t);this.firebaseDependencies={app:t,appConfig:s,installations:n,analyticsProvider:a}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yj(e){try{e.swRegistration=await navigator.serviceWorker.register(yj,{scope:bj}),e.swRegistration.update().catch(()=>{}),await Kj(e.swRegistration)}catch(t){throw Je.create("failed-service-worker-registration",{browserErrorMessage:t==null?void 0:t.message})}}async function Kj(e){return new Promise((t,n)=>{const a=setTimeout(()=>n(new Error(`Service worker not registered after ${Bu} ms`)),Bu),s=e.installing||e.waiting;e.active?(clearTimeout(a),t()):s?s.onstatechange=i=>{var o;((o=i.target)==null?void 0:o.state)==="activated"&&(s.onstatechange=null,clearTimeout(a),t())}:(clearTimeout(a),n(new Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gj(e,t){if(!t&&!e.swRegistration&&await Yj(e),!(!t&&e.swRegistration)){if(!(t instanceof ServiceWorkerRegistration))throw Je.create("invalid-sw-registration");e.swRegistration=t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jj(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=nm)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function om(e,t){if(!navigator)throw Je.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw Je.create("permission-blocked");return await Jj(e,t==null?void 0:t.vapidKey),await Gj(e,t==null?void 0:t.serviceWorkerRegistration),Lj(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qj(e,t,n){const a=Xj(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(a,{message_id:n[rm],message_name:n[wj],message_time:n[kj],message_device_time:Math.floor(Date.now()/1e3)})}function Xj(e){switch(e){case Ba.NOTIFICATION_CLICKED:return"notification_open";case Ba.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zj(e,t){const n=t.data;if(!n.isFirebaseMessaging)return;e.onMessageHandler&&n.messageType===Ba.PUSH_RECEIVED&&(typeof e.onMessageHandler=="function"?e.onMessageHandler(Vu(n)):e.onMessageHandler.next(Vu(n)));const a=n.data;Hj(a)&&a[Nj]==="1"&&await Qj(e,n.messageType,a)}const qu="@firebase/messaging",Yu="0.12.26";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ew=e=>{const t=new qj(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",n=>Zj(t,n)),t},tw=e=>{const t=e.getProvider("messaging").getImmediate();return{getToken:a=>om(t,a)}};function nw(){ir(new Ln("messaging",ew,"PUBLIC")),ir(new Ln("messaging-internal",tw,"PRIVATE")),An(qu,Yu),An(qu,Yu,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rw(){try{await Ph()}catch{return!1}return typeof window<"u"&&Ih()&&b1()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aw(e,t){if(!navigator)throw Je.create("only-available-in-window");return e.onMessageHandler=t,()=>{e.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lm(e=jb()){return rw().then(t=>{if(!t)throw Je.create("unsupported-browser")},t=>{throw Je.create("indexed-db-unsupported")}),Dc(zc(e),"messaging").getImmediate()}async function sw(e,t){return e=zc(e),om(e,t)}function iw(e,t){return e=zc(e),aw(e,t)}nw();const cm={apiKey:"AIzaSyAAt7Hs-eZoaC2OXOXybRdmjacPygMtQes",authDomain:"hope-a8df5.firebaseapp.com",projectId:"hope-a8df5",storageBucket:"hope-a8df5.firebasestorage.app",messagingSenderId:"867808143044",appId:"1:867808143044:web:d69572dec269374ecf0b91"};let cr=null,Jn=null;const ow=()=>{try{return Jn||(Jn=Ic(cm),cr=lm(Jn),console.log("✅ Firebase messaging initialized")),{app:Jn,messaging:cr}}catch(e){return console.error("❌ Firebase initialization failed:",e),null}};try{Jn||(Jn=Ic(cm),cr=lm(Jn),console.log("✅ Firebase messaging initialized (auto)"))}catch(e){console.error("❌ Firebase initialization failed:",e)}const Ku=async()=>{if(!cr)return console.warn("Messaging not available – token request skipped"),null;try{if(await Notification.requestPermission()!=="granted")return console.log("Notification permission denied"),null;const t="BNCqTUdWLqEnqjl-nJ_D7RJrljPUrioFIqDiKW-zOiZC8aJSH7hJ6V5wYFXZ5FPYK-inSxfAh7g5nSg22cVr_1I",n=await sw(cr,{vapidKey:t});return n?(console.log("✅ FCM Token obtained:",n.substring(0,20)+"..."),n):(console.log("No registration token available"),null)}catch(e){return console.error("Error getting FCM token:",e),null}},lw=()=>new Promise(e=>{if(!cr){console.warn("Messaging not available"),e(null);return}iw(cr,t=>{console.log("📱 Foreground message received:",t),e(t)})});function cw(){const{currentUser:e,showToast:t}=Oe(),[n,a]=p.useState(!1),[s,i]=p.useState("default");return p.useEffect(()=>{if(!e||n)return;(async()=>{try{if(!("Notification"in window)){console.log("Browser does not support notifications");return}const l="BNCqTUdWLqEnqjl-nJ_D7RJrljPUrioFIqDiKW-zOiZC8aJSH7hJ6V5wYFXZ5FPYK-inSxfAh7g5nSg22cVr_1I";if(i(Notification.permission),Notification.permission==="granted"){const c=await Ku();if(c)try{await ht.saveFCMToken(c),console.log("✅ FCM token saved to backend")}catch(d){console.error("Failed to save FCM token:",d)}}else if(Notification.permission==="default"){const c=async()=>{const d=await Notification.requestPermission();if(i(d),d==="granted"){const m=await Ku();if(m)try{await ht.saveFCMToken(m),console.log("✅ FCM token saved after user grant"),t("Notifications enabled! You'll receive updates about campaigns and donations.")}catch(f){console.error("Failed to save FCM token:",f)}}document.removeEventListener("click",c),document.removeEventListener("keydown",c)};document.addEventListener("click",c),document.addEventListener("keydown",c)}lw().then(c=>{if(c){console.log("Foreground message received:",c);const{title:d,body:m}=c.notification||{};d&&m?t(`${d}: ${m}`):m&&t(m)}}),a(!0)}catch(l){console.error("Push notification setup error:",l)}})()},[e,n,t]),null}const dw="https://cooing-rosanna-rub-3a11fd0e.koyeb.app/api";function uw(){const[e,t]=p.useState("We are currently performing scheduled maintenance. Please check back soon!"),[n,a]=p.useState(!0),[s,i]=p.useState(!1),[o,l]=p.useState(""),[c,d]=p.useState(""),[m,f]=p.useState(!1),[x,b]=p.useState(""),{setCurrentUser:w,setToast:k,currentUser:N}=Oe();lt(),p.useEffect(()=>{N&&N.role==="admin"&&(console.log("Admin already logged in, redirecting to dashboard..."),window.location.href="/admin-dashboard")},[N]),p.useEffect(()=>{(async()=>{try{const h=await _i.getMaintenanceStatus();h.message&&t(h.message)}catch(h){console.error("Failed to fetch maintenance message:",h)}finally{a(!1)}})()},[]);const g=async u=>{u.preventDefault(),f(!0),b("");try{console.log("Attempting emergency login for:",o);const h=await fetch(`${dw}/admin/emergency-login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:c})}),y=await h.json();console.log("Emergency login response:",h.status,y),h.ok&&y.success&&y.user&&y.user.role==="admin"?(localStorage.setItem("token",y.token),localStorage.setItem("hb_token",y.token),localStorage.setItem("user",JSON.stringify(y.user)),w&&typeof w=="function"&&w(y.user),k&&typeof k=="function"&&k({msg:"Welcome back, Admin!",error:!1}),i(!1),console.log("Redirecting to admin dashboard..."),window.location.href="/admin-dashboard"):b(y.message||"Invalid email or password")}catch(h){console.error("Login error details:",h),b("Network error. Please check your connection and try again.")}finally{f(!1)}};return n?r.jsxs("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",color:"#fff"},children:[r.jsx(xu,{size:48,style:{animation:"spin 1s linear infinite"}}),r.jsx("style",{children:`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `})]}):r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",fontFamily:"'DM Sans', sans-serif",padding:"20px",position:"relative"},children:[r.jsxs("button",{onClick:()=>i(!0),style:{position:"fixed",bottom:"24px",right:"24px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"40px",padding:"12px 24px",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",transition:"all 0.3s ease",backdropFilter:"blur(10px)",zIndex:1e3,fontWeight:"500"},onMouseEnter:u=>{u.target.style.background="rgba(255,255,255,0.2)"},onMouseLeave:u=>{u.target.style.background="rgba(255,255,255,0.1)"},children:[r.jsx(M0,{size:18}),"Admin Login"]}),r.jsxs("div",{style:{textAlign:"center",maxWidth:"500px",background:"rgba(255,255,255,0.05)",backdropFilter:"blur(10px)",borderRadius:"24px",padding:"48px 32px",border:"1px solid rgba(255,255,255,0.1)"},children:[r.jsx("div",{style:{width:"80px",height:"80px",background:"rgba(232,83,30,0.2)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"},children:r.jsx(wy,{size:40,color:"#e8531e"})}),r.jsx("h1",{style:{fontSize:"28px",marginBottom:"16px",color:"#fff"},children:"Under Maintenance"}),r.jsx("p",{style:{fontSize:"16px",color:"rgba(255,255,255,0.7)",marginBottom:"24px",lineHeight:"1.6"},children:e}),r.jsx("div",{style:{width:"60px",height:"4px",background:"linear-gradient(135deg, #e8531e, #f47c50)",borderRadius:"2px",margin:"0 auto 24px"}}),r.jsxs("p",{style:{fontSize:"14px",color:"rgba(255,255,255,0.5)",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"},children:[r.jsx(Ra,{size:14}),"Estimated completion: within 2 hours"]}),r.jsxs("button",{onClick:()=>window.location.reload(),style:{marginTop:"32px",background:"linear-gradient(135deg, #e8531e, #f47c50)",border:"none",padding:"12px 28px",borderRadius:"40px",color:"#fff",fontWeight:"600",cursor:"pointer",fontSize:"14px",transition:"transform 0.2s",display:"flex",alignItems:"center",gap:"8px",margin:"32px auto 0"},onMouseEnter:u=>u.target.style.transform="translateY(-2px)",onMouseLeave:u=>u.target.style.transform="translateY(0)",children:[r.jsx(Wr,{size:16}),"Check Again"]})]})]}),s&&r.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.9)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,animation:"fadeIn 0.3s ease"},onClick:()=>i(!1),children:r.jsxs("div",{style:{background:"#fff",borderRadius:"24px",padding:"40px",width:"90%",maxWidth:"420px",position:"relative",animation:"slideUp 0.3s ease"},onClick:u=>u.stopPropagation(),children:[r.jsx("button",{onClick:()=>i(!1),style:{position:"absolute",top:"20px",right:"20px",background:"none",border:"none",cursor:"pointer",color:"#999",transition:"color 0.2s",padding:"4px"},onMouseEnter:u=>u.target.style.color="#333",onMouseLeave:u=>u.target.style.color="#999",children:r.jsx(Bt,{size:24})}),r.jsxs("div",{style:{textAlign:"center",marginBottom:"32px"},children:[r.jsx("div",{style:{width:"70px",height:"70px",background:"linear-gradient(135deg, #e8531e, #f47c50)",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:"20px"},children:r.jsx(wl,{size:32,color:"#fff"})}),r.jsx("h2",{style:{fontSize:"24px",fontWeight:"bold",margin:0,color:"#1a1a2e"},children:"Emergency Admin Access"}),r.jsx("p",{style:{color:"#666",marginTop:"8px",fontSize:"14px"},children:"Enter your admin credentials to access the dashboard"})]}),x&&r.jsxs("div",{style:{background:"#fee",color:"#c33",padding:"12px",borderRadius:"12px",marginBottom:"24px",fontSize:"14px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"},children:[r.jsx(my,{size:16}),x]}),r.jsxs("form",{onSubmit:g,children:[r.jsxs("div",{style:{marginBottom:"20px"},children:[r.jsx("label",{style:{display:"block",marginBottom:"8px",color:"#333",fontWeight:"500",fontSize:"14px"},children:"Email"}),r.jsxs("div",{style:{position:"relative"},children:[r.jsx(er,{size:18,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#999"}}),r.jsx("input",{type:"email",value:o,onChange:u=>l(u.target.value),required:!0,placeholder:"",style:{width:"100%",padding:"12px 16px 12px 40px",border:"2px solid #e0e0e0",borderRadius:"12px",fontSize:"14px",transition:"border-color 0.2s",outline:"none"},onFocus:u=>u.target.style.borderColor="#e8531e",onBlur:u=>u.target.style.borderColor="#e0e0e0"})]})]}),r.jsxs("div",{style:{marginBottom:"28px"},children:[r.jsx("label",{style:{display:"block",marginBottom:"8px",color:"#333",fontWeight:"500",fontSize:"14px"},children:"Password"}),r.jsxs("div",{style:{position:"relative"},children:[r.jsx(oi,{size:18,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#999"}}),r.jsx("input",{type:"password",value:c,onChange:u=>d(u.target.value),required:!0,placeholder:"",style:{width:"100%",padding:"12px 16px 12px 40px",border:"2px solid #e0e0e0",borderRadius:"12px",fontSize:"14px",transition:"border-color 0.2s",outline:"none"},onFocus:u=>u.target.style.borderColor="#e8531e",onBlur:u=>u.target.style.borderColor="#e0e0e0"})]})]}),r.jsx("button",{type:"submit",disabled:m,style:{width:"100%",padding:"14px",background:"linear-gradient(135deg, #e8531e, #f47c50)",color:"#fff",border:"none",borderRadius:"12px",fontSize:"16px",fontWeight:"600",cursor:m?"not-allowed":"pointer",opacity:m?.7:1,transition:"transform 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"},onMouseEnter:u=>{m||(u.target.style.transform="translateY(-2px)")},onMouseLeave:u=>{m||(u.target.style.transform="translateY(0)")},children:m?r.jsxs(r.Fragment,{children:[r.jsx(xu,{size:18,style:{animation:"spin 1s linear infinite"}}),"Logging in..."]}):r.jsxs(r.Fragment,{children:[r.jsx(jl,{size:18}),"Emergency Login"]})})]}),r.jsxs("p",{style:{textAlign:"center",marginTop:"20px",fontSize:"12px",color:"#999",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"},children:[r.jsx(wl,{size:12}),"Secure emergency access"]})]})}),r.jsx("style",{children:`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `})]})}ow();class pw extends p.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t.message}}componentDidCatch(t,n){console.error("ErrorBoundary caught:",t,n)}render(){return this.state.hasError?r.jsxs("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:20,textAlign:"center"},children:[r.jsx("div",{style:{fontSize:"3rem",marginBottom:16},children:"😞"}),r.jsx("h2",{style:{marginBottom:12,color:"#1a1a2e"},children:"Something went wrong"}),r.jsx("p",{style:{color:"#6b7280",marginBottom:20,maxWidth:400},children:this.state.error||"An unexpected error occurred. Please try again."}),r.jsx("button",{onClick:()=>window.location.reload(),style:{padding:"10px 24px",background:"#1D9E75",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,transition:"all 0.2s"},onMouseEnter:t=>t.target.style.opacity="0.9",onMouseLeave:t=>t.target.style.opacity="1",children:"Refresh Page"}),r.jsx("button",{onClick:()=>window.location.href="/",style:{marginTop:12,padding:"10px 24px",background:"transparent",color:"#6b7280",border:"1px solid #e5e7eb",borderRadius:8,cursor:"pointer",fontWeight:500},children:"Go to Homepage"})]}):this.props.children}}const fw="https://cooing-rosanna-rub-3a11fd0e.koyeb.app/api",hw=fw.replace(/\/api\/?$/,"/health");function mw(){p.useEffect(()=>{const e=async()=>{try{const n=await fetch(hw,{method:"GET"});n.ok?console.log("🏓 Backend warmed up successfully"):console.log("🏓 Backend warming up (status:",n.status,")")}catch{console.log("🏓 Backend warming up...")}};e();const t=setInterval(e,5*60*1e3);return()=>clearInterval(t)},[])}function gw(){const{currentUser:e}=Oe();return e?e.role==="admin"?r.jsx(Ir,{to:"/admin-dashboard",replace:!0}):e.role==="creator"?r.jsx(Ir,{to:"/creator-dashboard",replace:!0}):e.role==="donor"?r.jsx(Ir,{to:"/donor-dashboard",replace:!0}):r.jsxs(r.Fragment,{children:[r.jsx(Nl,{}),r.jsx(ku,{})]}):r.jsxs(r.Fragment,{children:[r.jsx(Nl,{}),r.jsx(ku,{})]})}function yo({children:e,allowedRoles:t}){const{currentUser:n,loading:a}=Oe();return a?r.jsxs("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16},children:[r.jsx("div",{style:{width:40,height:40,border:"3px solid #e5e7eb",borderTopColor:"#1D9E75",borderRadius:"50%",animation:"spin 1s linear infinite"}}),r.jsx("p",{style:{color:"#6b7280"},children:"Loading..."}),r.jsx("style",{children:`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `})]}):n?t.includes(n.role)?e:r.jsx(Ir,{to:"/",replace:!0}):r.jsx(Ir,{to:"/",replace:!0})}function xw({children:e}){const{currentUser:t}=Oe(),n=Ja(),[a,s]=p.useState(!1),[i,o]=p.useState(""),[l,c]=p.useState(!0);p.useEffect(()=>{(async()=>{try{const b=await _i.getMaintenanceStatus();s(b.maintenance_mode===!0||b.enabled===!0),o(b.message||"We are currently performing scheduled maintenance. Please check back soon!")}catch(b){console.error("Failed to check maintenance status:",b)}finally{c(!1)}})()},[]);const m=["/admin-login","/verify-email","/admin-dashboard"].includes(n.pathname),f=(t==null?void 0:t.role)==="admin";return f?e:l?r.jsxs("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#1a1a2e"},children:[r.jsx("div",{style:{width:48,height:48,border:"3px solid rgba(255,255,255,0.1)",borderTopColor:"#e8531e",borderRadius:"50%",animation:"spin 1s linear infinite"}}),r.jsx("style",{children:`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `})]}):a&&!f&&!m?r.jsx(uw,{message:i}):e}function vw(){const{toast:e,currentUser:t}=Oe();return mw(),r.jsxs(xw,{children:[r.jsx(l1,{}),r.jsx(cw,{}),r.jsxs(Kv,{children:[r.jsx(Kt,{path:"/",element:r.jsx(gw,{})}),r.jsx(Kt,{path:"/campaign/:id",element:r.jsxs(r.Fragment,{children:[r.jsx(Nl,{}),r.jsx(t1,{})]})}),r.jsx(Kt,{path:"/donor-dashboard",element:r.jsx(yo,{allowedRoles:["donor"],children:r.jsx(Oy,{})})}),r.jsx(Kt,{path:"/creator-dashboard",element:r.jsx(yo,{allowedRoles:["creator"],children:r.jsx(Vy,{})})}),r.jsx(Kt,{path:"/admin-dashboard",element:r.jsx(yo,{allowedRoles:["admin"],children:r.jsx(Qy,{})})}),r.jsx(Kt,{path:"/admin-login",element:r.jsx(Xy,{})}),r.jsx(Kt,{path:"/verify-email",element:r.jsx(n1,{})}),r.jsx(Kt,{path:"*",element:r.jsx(Ir,{to:"/",replace:!0})})]}),r.jsx(i1,{}),e&&r.jsx(o1,{msg:e.msg,error:e.error})]})}function yw(){return r.jsx(t0,{children:r.jsx(pw,{children:r.jsx(vw,{})})})}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(e=>{console.log("Service Worker registered with scope:",e.scope)}).catch(e=>{console.error("Service Worker registration failed:",e)})});bo.createRoot(document.getElementById("root")).render(r.jsx(sp.StrictMode,{children:r.jsx(Xv,{future:{v7_startTransition:!0,v7_relativeSplatPath:!0},children:r.jsx(yw,{})})}));
