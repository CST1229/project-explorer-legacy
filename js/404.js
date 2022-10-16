//Abuse the 404 page because no backend with GitHub Pages

const PAGE = new URL(location.href);
const DIRS = PAGE.pathname.replaceAll(/^\//g, "").replaceAll(/\/$/g, "").split("/");
function setError(t) {
	t = t || "404 Not Found";
	$i("404page").style.display = "";
	$i("404page").textContent = t;
	$i("message").textContent = "";
}

let response;

//First of all, is it a see inside page?
if (DIRS[DIRS.length-2] == "projects") {
	const PROJ_ID = DIRS[DIRS.length-1];
	if (isNaN(PROJ_ID - 0)) {setError()} else {
		$i("message").textContent = "Loading project...";
		fetch(`https://projects.scratch.mit.edu/${PROJ_ID}`)
			.then((r) => {response = r; return r.text()})
			.then((t) => {loadProject(t)});
	}
} else {setError()}