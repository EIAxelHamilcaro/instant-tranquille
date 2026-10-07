"use client";

const SCENE = 3050;
const STILL_SCENE = 1800;
const FLIGHT = 1150;
const STILL_FADE = 450;
const HANDOVER = 150;
const READY_POLL = 100;
const READY_CAP = 10;

const GUARD = `(function(){try{var d=document.documentElement,A="data-ouverture",s=sessionStorage,r=matchMedia("(prefers-reduced-motion: reduce)").matches,e=["pointerdown","keydown","wheel","touchstart"],o={capture:true,passive:true},t=[],clear=function(){t.forEach(clearTimeout);t=[]},end=function(){clear();d.removeAttribute(A)},fly=function(){if(d.getAttribute(A)!=="")return;clear();e.forEach(function(k){removeEventListener(k,skip,o)});d.setAttribute(A,"envol");t=[setTimeout(function(){d.setAttribute(A,"pose");t=[setTimeout(end,${HANDOVER})]},r?${STILL_FADE}:${FLIGHT})]},wait=function(n){if(d.hasAttribute("data-ouverture-pret")||n>=${READY_CAP})fly();else t=[setTimeout(function(){wait(n+1)},${READY_POLL})]},skip=function(v){if(v.type==="keydown"&&/^(Tab|Shift|Control|Alt|Meta)$/.test(v.key))return;if(v.target&&v.target.closest&&v.target.closest("[data-ouverture-son]"))return;fly()},start=function(){if(d.hasAttribute(A)||self!==top)return;s.setItem("ouverture","1");performance.mark("ouverture");d.setAttribute(A,"");e.forEach(function(k){addEventListener(k,skip,o)});t=[setTimeout(function(){wait(0)},r?${STILL_SCENE}:${SCENE})]},u=new URL(location.href),f=u.searchParams.has("ouverture")||u.hash==="#ouverture",n=performance.getEntriesByType("navigation")[0];document.addEventListener("ouverture",start);document.addEventListener("ouverture-fin",fly);if(f){u.searchParams.delete("ouverture");if(u.hash==="#ouverture")u.hash="";history.replaceState(history.state,"",u)}if(f||(!s.getItem("ouverture")&&!(n&&n.type==="back_forward")))start()}catch(x){}})()`;

export function OpeningGuard() {
  return (
    <script
      suppressHydrationWarning
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      dangerouslySetInnerHTML={{ __html: GUARD }}
    />
  );
}
