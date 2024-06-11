import { useEffect } from "react";

const TwitterIntentHandler = () => {
	useEffect(() => {
		(function () {
			if (window.__twitterIntentHandler) return;
			const intentRegex = /twitter\.com\/intent\/(\w+)/;
			const windowOptions = "scrollbars=yes,resizable=yes,toolbar=no,location=yes";
			const maxPopupWidth = 920;
			const maxPopupHeight = 720;
			const winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			const winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			const width = Math.min(winWidth, maxPopupWidth);
			const height = Math.min(winHeight, maxPopupHeight);
			const left = Math.round(winWidth / 2 - width / 2);
			const top = Math.round(winHeight / 2 - height / 2);

			function handleIntent(e) {
				e = e || window.event;
				let target = e.target || e.srcElement;

				while (target && target.nodeName.toLowerCase() !== "a") {
					target = target.parentNode;
				}

				if (target && target.nodeName.toLowerCase() === "a" && target.href && target.href.match(intentRegex)) {
					const intentUrl = target.href;
					window.open(
						intentUrl,
						"_blank",
						`${windowOptions},width=${width},height=${height},left=${left},top=${top}`
					);
					e.preventDefault();
				}
			}

			if (document.addEventListener) {
				document.addEventListener("click", handleIntent, false);
			} else if (document.attachEvent) {
				document.attachEvent("onclick", handleIntent);
			}
			window.__twitterIntentHandler = true;
		})();
	}, []);

	return null; // This component does not render anything
};

export default TwitterIntentHandler;
