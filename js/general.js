function $(s) {
	return document.querySelector(s);
}
function $$(s) {
	return document.querySelectorAll(s);
}
function $i(s) {
	return document.getElementById(s);
}
function $c(s) {
	return document.getElementsByClassName(s);
}

function createCustomElement(tag, content, params) {
	return Object.assign(
		Object.assign(
			document.createElement(tag),
			{textContent: content}
		),
		params
	);
}
//Global CSS
document.head.appendChild(
	createCustomElement(
		"link",
		"",
		{
			href: "/css/general.css",
			rel: "stylesheet"
		}
	)
);
//Header
fetch("/html/header.html")
	.then((r) => r.text()
	.then((t) => $i("header").innerHTML = t)
);