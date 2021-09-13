var e=Object.defineProperty,t=(t,s,n)=>(((t,s,n)=>{s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[s]=n})(t,"symbol"!=typeof s?s+"":s,n),n);import{c as s,D as n,V as o,a as i,H as r,b as a,G as c,M as h,B as l,S as d,P as u,W as m,O as g,C as p,F as v,d as f,e as w,t as b,i as _,f as y,g as S,h as C,j as N,k as $,l as k,s as z,o as x,m as j,u as P,n as L,E as M,R as H,p as E,q as I,r as O}from"./vendor.f2e52b27.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var J=new class{constructor(){t(this,"parseKey",(e=>`client-${e}`)),t(this,"set",((e,t)=>{let s="";if("string"==typeof t&&(s=t),"number"==typeof t?s=t.toString():"object"==typeof t&&(s=JSON.stringify(t)),s)return localStorage.setItem(this.parseKey(e),s);throw console.error(`localStorage: could not set item with key ${e} to`,t)})),t(this,"get",(e=>localStorage.getItem(this.parseKey(e))||void 0))}};const[T,F]=s(J.get("username")),[R,U]=s(),[W,B]=s(),[D,A]=s([]),[K,q]=s([]),[G,V]=s(),X=`ws://${globalThis.SERVER}`;class Y{constructor(e){t(this,"socket"),t(this,"sendChatMessage",(e=>{const t={type:"chatMessage",message:e};this.socket.emit(t)})),t(this,"sendHandPosition",(e=>{const t={type:"handPosition",hand:e};this.socket.emit(t)})),t(this,"onSocketOpen",(()=>{R(),T()})),t(this,"onSocketClose",(()=>{})),t(this,"onSocketMessage",(e=>{switch(e.type){case"joinRoom":return this.handleJoinRoom(e);case"userJoined":return this.handleUserJoined(e);case"userLeft":return this.handleUserLeft(e);case"chatMessage":return this.handleChatMessage(e);case"handPosition":return this.handleHandPosition(e)}})),t(this,"handleJoinRoom",(e=>{A(e.room.users);const t={message:"You joined the lobby!",info:!0};q((e=>[...e,t]))})),t(this,"handleUserJoined",(e=>{A((t=>[...t,e.user]));const t={message:`${e.user.username} joined the lobby!`,info:!0};q((e=>[...e,t]))})),t(this,"handleUserLeft",(e=>{A((t=>t.filter((t=>t.userId!==e.user.userId))));const t={message:`${e.user.username} left the lobby.`,info:!0};q((e=>[...e,t]))})),t(this,"handleChatMessage",(e=>{const t={user:e.user,message:e.message};q((e=>[...e,t]))})),t(this,"handleHandPosition",(e=>{V((t=>({...t,...e.hand})))})),this.socket=e}}class Q{constructor(e,s){t(this,"socket"),t(this,"controller",new Y(this)),this.socket=new WebSocket(e),this.socket.onopen=e=>{s.onOpen&&s.onOpen(e),this.controller.onSocketOpen()},this.socket.onmessage=e=>{s.onMessage&&s.onMessage(e),this.controller.onSocketMessage(JSON.parse(e.data))},this.socket.onclose=e=>{s.onClose&&s.onClose(e),this.controller.onSocketClose()},this.socket.onerror=e=>{s.onError&&s.onError(e)}}emit(e){this.socket.readyState===WebSocket.OPEN&&this.socket.send(JSON.stringify(e))}close(){this.socket.close()}}class Z{constructor(e){t(this,"scene"),t(this,"object"),this.scene=e}addToScene(){if(this.object)return this.scene.add(this.object),this}removeFromScene(){if(this.object)return console.log("removed object from scene:",this.object.name||this.object.type),this.scene.remove(this.object),this}}class ee extends Z{constructor(e){return super(e),t(this,"helper"),this}setup(e={}){const{position:t={x:0,y:0,z:0},intensity:s=1,castShadows:i=!1,shadowCamFrustum:r=1.5}=e,a=new n(16777215,s);if(a.position.set(t.x,t.y,t.z),i){a.castShadow=i,a.shadow.mapSize=new o(1024,1024);const e=r;a.shadow.camera.left=-e,a.shadow.camera.right=e,a.shadow.camera.top=e,a.shadow.camera.bottom=-e}return this.object=a,this}debug(){this.helper=new i(this.object,1,4521864),this.scene.add(this.helper)}}class te extends Z{constructor(e){return super(e),t(this,"helper"),this}setup(e={}){const{intensity:t=1,position:s={x:0,y:0,z:0}}=e,n=new r(16777215,16777215,t);return n.position.set(s.x,s.y,s.z),this.object=n,this}debug(){this.helper=new a(this.object,1,4521864),this.scene.add(this.helper)}}class se extends Z{constructor(e){super(e),t(this,"gltfLoader",new c),t(this,"hand",{thumb:[],index:[],middle:[],ring:[],pinky:[]}),t(this,"setup",(async()=>{const e=(await this.gltfLoader.loadAsync("/models/hand_r.glb")).scene;return e.traverse((e=>{e instanceof h&&(e.castShadow=!0,e.receiveShadow=!0),e instanceof l&&this.mapBoneToHand(e)})),e.scale.set(7,7,7),this.object=e,this})),t(this,"mapBoneToHand",(e=>{const t=e.name.match(/thumb|index|middle|ring|pinky/gm);if(!t)return;const s=t[0];this.hand[s].push(e)})),t(this,"update",(()=>{this.object})),t(this,"setHandPosition",(e=>{for(const t in e)this.bendFinger(t,e[t])}))}bendFinger(e,t){const s=this.hand[e],n=-t/100;s&&s[0]&&("thumb"!=e?(s[0].rotation.x=n*(.5*Math.PI),s[1].rotation.x=n*(.5*Math.PI)):s[2].rotation.z=n*(.4*Math.PI))}}var ne="_UIMessage_1546d_1";const oe=b("<div></div>"),ie=({message:e})=>(()=>{const t=oe.cloneNode(!0);return _(t,e),y((()=>t.className=ne)),t})();var re="_chatPanel_twc0z_1",ae="_roomPanel_twc0z_2",ce="_controlsPanel_twc0z_3",he="_title_twc0z_31",le="_roomID_twc0z_32",de="_userList_twc0z_35",ue="_username_twc0z_46",me="_inputGroup_twc0z_58",ge="_chatBox_twc0z_75",pe="_message_twc0z_86",ve="_info_twc0z_96";const fe=b("<div></div>"),we=b("<span></span>"),be=b("<div><span></span></div>"),_e=b('<form><input type="text" name="message" autocomplete="off"><button>Send</button></form>'),ye=()=>(()=>{const e=fe.cloneNode(!0);return _(e,S(Se,{}),null),_(e,S(Ne,{}),null),y((()=>e.className=re)),e})(),Se=()=>{let e;return C((()=>{K()&&(e.scrollTop=e.scrollHeight)})),(()=>{const t=fe.cloneNode(!0);return"function"==typeof e?e(t):e=t,_(t,S(N,{get each(){return K()},children:e=>S(Ce,{message:e})})),y((()=>t.className=ge)),t})()},Ce=({message:e})=>{const t=()=>e.user?(()=>{const t=we.cloneNode(!0);return _(t,(()=>e.user.username)),y((()=>t.className=ue)),t})():null;return(()=>{const s=be.cloneNode(!0),n=s.firstChild;return _(s,S(t,{}),n),_(n,(()=>e.message)),y((t=>{const o={[pe]:!0,[ve]:e.info},i=pe;return t._v$=$(s,o,t._v$),i!==t._v$2&&(n.className=t._v$2=i),t}),{_v$:void 0,_v$2:void 0}),s})()},Ne=()=>{function e(e){e.preventDefault();const t=e.target,s=new FormData(t).get("message");W().controller.sendChatMessage(s),t.reset()}return(()=>{const t=_e.cloneNode(!0);return t.addEventListener("submit",e),t})()},$e=b("<div><div>Controls</div></div>"),ke=b('<div><label></label><input type="range" value="0"></div>'),ze=["thumb","index","middle","ring","pinky"],xe=()=>(()=>{const e=$e.cloneNode(!0),t=e.firstChild;return _(e,S(N,{each:ze,children:e=>S(je,{fingerName:e})}),null),y((s=>{const n=ce,o=he;return n!==s._v$&&(e.className=s._v$=n),o!==s._v$2&&(t.className=s._v$2=o),s}),{_v$:void 0,_v$2:void 0}),e})(),je=({fingerName:e})=>{function t(e){const t=e.target,s=t.name,n=t.valueAsNumber;V((e=>({...e,[s]:n}))),W().controller.sendHandPosition(G())}return(()=>{const s=ke.cloneNode(!0),n=s.firstChild,o=n.nextSibling;return z(n,"for",e),_(n,(()=>e.toUpperCase())),o.$$input=t,z(o,"name",e),y((()=>s.className=me)),s})()};k(["input"]);const Pe=b("<div></div>"),Le=b("<div><div>Room ID: </div><div>Users (<!>)</div><div></div></div>"),Me=({user:e})=>(()=>{const t=Pe.cloneNode(!0);return _(t,(()=>e.username)),y((()=>t.className=ue)),t})(),He=()=>(()=>{const e=Le.cloneNode(!0),t=e.firstChild;t.firstChild;const s=t.nextSibling,n=s.firstChild.nextSibling;n.nextSibling;const o=s.nextSibling;return _(t,R,null),_(s,(()=>D().length),n),_(o,S(N,{get each(){return D()},children:e=>S(Me,{user:e})})),y((n=>{const i=ae,r=le,a=he,c=de;return i!==n._v$&&(e.className=n._v$=i),r!==n._v$2&&(t.className=n._v$2=r),a!==n._v$3&&(s.className=n._v$3=a),c!==n._v$4&&(o.className=n._v$4=c),n}),{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),e})(),[Ee]=s(new class{constructor(){t(this,"scene",new d),t(this,"camera"),t(this,"renderer"),t(this,"controls"),t(this,"handController"),t(this,"hemiLightController"),t(this,"dirLightController"),t(this,"start",(()=>{this.update()})),t(this,"setup",(async e=>{this.setSize(),this.renderer.shadowMap.enabled=!0,this.camera.position.z=-1,this.camera.position.y=1.5,this.camera.position.x=2,this.scene.background=new p(16777215),this.scene.fog=new v(16777215,.1,200);const t=new h(new f(2e3,2e3,1,1),new w({color:15658734,shininess:0}));t.rotateX(-.5*Math.PI),t.receiveShadow=!0,t.position.y=-1,this.scene.add(t),this.hemiLightController.setup({position:{x:0,y:1,z:0},intensity:.6}),this.hemiLightController.addToScene(),this.dirLightController.setup({position:{x:0,y:1,z:1},intensity:.5,castShadows:!0}),this.dirLightController.addToScene(),await this.handController.setup(),this.handController.addToScene(),window.addEventListener("resize",(()=>{this.setSize(),this.render()})),e&&e()})),t(this,"update",(()=>{requestAnimationFrame(this.update),this.controls.update(),this.handController.update(),this.render()})),t(this,"render",(()=>{this.renderer.render(this.scene,this.camera)})),t(this,"setSize",(()=>{this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)})),t(this,"setHandPosition",(e=>{this.handController.setHandPosition(e)})),this.camera=new u(50,window.innerWidth/window.innerHeight),this.renderer=new m({antialias:!0}),this.controls=new g(this.camera,this.renderer.domElement),this.hemiLightController=new te(this.scene),this.dirLightController=new ee(this.scene),this.handController=new se(this.scene)}getCanvas(){return this.renderer.domElement}}),[Ie,Oe]=s(),[Je,Te]=s("Loading client..."),Fe=({offline:e})=>{C((()=>{G()&&Ee().setHandPosition(G())})),x((async()=>{Ie()||(await Ee().setup(),Ee().start(),Oe(Ee().getCanvas()),Te(null))}));const t=()=>[S(He,{}),S(ye,{})],s=()=>[!e&&S(t,{}),S(xe,{}),j(Ie)];return(()=>{const e=j((()=>!!Je()),!0);return()=>e()?S(ie,{get message(){return Je()}}):S(s,{})})()},Re=()=>{const[e,t]=s("Joining lobby..."),n=P();if(!T())return n("/"),null;return B(new Q(X,{onOpen:()=>{t(null)},onError:()=>{n("/"),B(null)}})),L((()=>{W().close(),B(null)})),S(M,{get fallback(){return S(ie,{message:"There was a problem loading the client..."})},get children(){const t=j((()=>!!e()),!0);return()=>t()?S(ie,{get message(){return e()}}):S(Fe,{})}})},Ue=()=>(C((()=>{T()&&J.set("username",T())})),F("localhost"),U("localhost"),S(I,{get children(){return S(H,{get children(){return S(E,{path:"/",get element(){return S(Re,{})}})}})}}));O((()=>S(Ue,{})),document.getElementById("root"));