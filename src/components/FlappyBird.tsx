import { useEffect, useState } from "react";
import Head from "next/head";

export default function FlappyBird() {
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
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const scripts = [
      "/js/jquery.min.js",
      "/js/jquery.transit.min.js",
      "/js/buzz.min.js",
      "/js/main.js",
    ];

    const scriptElements: any = [];

    scripts.reduce((promise, src) => {
      return promise
        .then(() => loadScript(src))
        .then((script) => scriptElements.push(script));
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
    const gaScript = loadExternalScript(
      "https://www.google-analytics.com/analytics.js"
    );
    scriptElements.push(gaScript);

    // Scroll to the middle of the game container
    const gameContainer = document.getElementById("gamecontainer");
    if (gameContainer) {
      gameContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Cleanup function to remove the scripts when component unmounts
    return () => {
      scriptElements.forEach((script: any) => {
        if (script && script.parentNode === document.body) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

  const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
  const axiosApi = process.env.NEXT_PUBLIC_AXIOS_API;

  if (!domLoaded) return <div></div>;
  return (
    <div className="w-full h-full">
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
        <meta
          property="og:image"
          content="https://nebezb.com/floppybird/assets/thumb.png"
        />
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
      <body>
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
                  <div id="currentscore"></div>
                  <div id="highscore"></div>
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
      </body>
    </div>
  );
}
