const MEASURE = `(function(){var d=document.documentElement,t,w=innerWidth,m=function(){d.setAttribute("data-mesure","");requestAnimationFrame(function(){requestAnimationFrame(function(){d.removeAttribute("data-mesure")})})};if(location.hash)d.setAttribute("data-mesure","");addEventListener("load",function(){document.fonts.ready.then(m)});addEventListener("resize",function(){if(innerWidth===w)return;w=innerWidth;clearTimeout(t);t=setTimeout(m,200)})})()`;

export function SectionSizes() {
  return <script dangerouslySetInnerHTML={{ __html: MEASURE }} />;
}
