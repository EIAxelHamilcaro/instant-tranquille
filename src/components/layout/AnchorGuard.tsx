const GUARD = `(function(){var d=document.documentElement,f=function(){d.setAttribute("data-ancres","")};if(location.hash)f();document.addEventListener("click",function(e){var t=e.target;if(t&&t.closest&&t.closest('a[href*="#"]'))f()},true)})()`;

export function AnchorGuard() {
  return <script dangerouslySetInnerHTML={{ __html: GUARD }} />;
}
