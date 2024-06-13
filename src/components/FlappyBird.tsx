import { useEffect, useState } from "react";
import Head from "next/head";
import html2canvas from "html2canvas";
import { Modal, Button } from "antd";
import TwitterIntentHandler from "@/src/components/TwitterIntentHandler";

export default function FlappyBird(this: any) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [domLoaded, setDomLoaded] = useState(false);

	useEffect(() => {
		setDomLoaded(true);
	}, []);

	useEffect(() => {
		const loadScript = (src: any) => {
			return new Promise((resolve, reject) => {
				const script = document.createElement("script");
				script.src = src;
				script.async = true;
				script.onload = () => resolve(script);
				script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
				document.body.appendChild(script);
			});
		};

		const scripts = ["/js/jquery.min.js", "/js/jquery.transit.min.js", "/js/buzz.min.js", "/js/main.js"];

		const scriptElements: any = [];

		scripts.reduce((promise, src) => {
			return promise.then(() => loadScript(src)).then((script) => scriptElements.push(script));
		}, Promise.resolve());

		// Function to load external script
		const loadExternalScript = (src: any) => {
			const script = document.createElement("script");
			script.src = src;
			script.async = true;
			document.body.appendChild(script);
			return script;
		};

		// Load Google Analytics script
		const gaScript = loadExternalScript("https://www.google-analytics.com/analytics.js");
		scriptElements.push(gaScript);

		// Scroll to the middle of the game container
		const gameContainer = document.getElementById("gamecontainer");
		if (gameContainer) {
			gameContainer.scrollIntoView({ behavior: "smooth", block: "center" });
		}

		// Event listener for custom event
		const handleOpenModalEvent = () => {
			setIsModalOpen(true);
		};

		window.addEventListener("openModalEvent", handleOpenModalEvent);

		// Cleanup function to remove the scripts when component unmounts
		return () => {
			scriptElements.forEach((script: any) => {
				if (script && script.parentNode === document.body) {
					document.body.removeChild(script);
				}
			});
			window.removeEventListener("openModalEvent", handleOpenModalEvent);
		};
	}, []);

	const downloadShareImage = () => {
		const element = document.getElementById("share-image-container");
		if (element instanceof HTMLElement && element !== null) {
			html2canvas(element).then((canvas) => {
				const link = document.createElement("a");
				link.href = canvas.toDataURL("image/png");
				link.download = "score.png";
				link.click();
			});
		} else {
			console.error("Element not found or is null");
		}
	};

	const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
	const axiosApi = process.env.NEXT_PUBLIC_AXIOS_API;

	if (!domLoaded) return <div></div>;
	return (
		<div>
			<Head>
				<title>Floppy Bird</title>
				<meta http-equiv="content-type" content="text/html; charset=utf-8" />
				<meta name="author" content="Nebez Briefkani" />
				<meta
					name="description"
					content="play floppy bird. a remake of popular game flappy bird built in html/css/js"
				/>
				<meta
					name="keywords"
					content="flappybird,flappy,bird,floppybird,floppy,html,html5,css,css3,js,javascript,jquery,github,nebez,briefkani,nebezb,open,source,opensource"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
				/>

				{/* Open Graph tags */}
				<meta property="og:title" content="Floppy Bird" />
				<meta
					property="og:description"
					content="play floppy bird. a remake of popular game flappy bird built in html/css/js"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://nebezb.com/floppybird/assets/thumb.png" />
				<meta property="og:url" content="https://nebezb.com/floppybird/" />
				<script
					dangerouslySetInnerHTML={{
						__html: `
              window.NEXT_PUBLIC_TOKEN = "${token}";
              window.NEXT_PUBLIC_AXIOS_API = "${axiosApi}";
            `,
					}}
				/>
				<meta property="og:site_name" content="Floppy Bird" />

				{/* Style sheets */}
				<link href="/css/reset.css" rel="stylesheet" />
				<link href="/css/main.css" rel="stylesheet" />
			</Head>
			<body className="w-full h-fit" style={{ minHeight: "unset" }}>
				<TwitterIntentHandler />
				<div id="gamecontainer">
					<div id="gamescreen">
						<div id="sky" className="animated">
							<div id="flyarea">
								<div id="ceiling" className="animated"></div>
								<div id="player" className="bird animated"></div>
								<div id="bigscore"></div>
								<div id="splash"></div>
								<div id="scoreboard">
									<div id="medal"></div>
									<div id="currentscore" className="justify-end flex flex-row gap-1"></div>
									<div id="highscore" className="justify-end flex flex-row gap-1"></div>
									<div id="replay">
										<img src="/assets/replay.png" alt="replay" />
									</div>
									<div id="share">
										<img src="assets/share.png" alt="share" />
									</div>
								</div>
							</div>
						</div>
						<div id="land" className="animated">
							<div id="debug"></div>
						</div>
					</div>
				</div>
				<div className="boundingbox" id="playerbox"></div>
				<div className="boundingbox" id="pipebox"></div>

				<Modal
					centered
					title={
						<div
							style={{
								textAlign: "center",
								fontSize: "24px",
								fontWeight: "bold",
							}}
						>
							Share your score
						</div>
					}
					open={isModalOpen}
					onCancel={() => setIsModalOpen(false)}
					footer={null}
					closable={true}
				>
					<div className="text-center my-6 gap-3 flex flex-col">
						<div id="share-image-container" className="relative inline-block">
							<img src="/assets/share-score-template.png" alt="my score" />
							<span
								id="share-score"
								style={{
									position: "absolute",
									top: "70%",
									left: "38%",
									transform: "translate(-50%, -50%)",
									zIndex: 10,
									color: "#fff",
									fontSize: "1.5rem",
									fontWeight: "bold",
									textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
								}}
								className="kong-text text-lg"
							>
								000
							</span>
							<span
								id="share-highscore"
								style={{
									position: "absolute",
									top: "70%",
									left: "60%",
									transform: "translate(-50%, -50%)",
									zIndex: 10,
									color: "#fff",
									fontSize: "1.5rem",
									fontWeight: "bold",
									textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
								}}
								className="kong-text text-lg"
							>
								000
							</span>
						</div>
						<div className="w-full flex justify-center gap-4">
							<Button
								type="primary"
								style={{
									border: "1px solid #BDBDBD",
									borderRadius: "6px",
									backgroundColor: "#fff",
									color: "#000",
								}}
								className="w-fit"
								onClick={downloadShareImage}
							>
								Download
							</Button>

							<a href="https://twitter.com/intent/tweet?text=Hello%20world&hashtags=yrdy">
								<Button
									type="primary"
									style={{
										border: "1px solid #BDBDBD",
										borderRadius: "6px",
										backgroundColor: "#fff",
										color: "#000",
									}}
									iconPosition={"end"}
								>
									Tweet
								</Button>
							</a>
						</div>
					</div>
				</Modal>
			</body>
		</div>
	);
}
