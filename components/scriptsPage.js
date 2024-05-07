import Script from "next/script";

export const MyScriptEmbed = () => {
  return (
    <div>
      <div id="myEmbedDiv"></div>
      <Script
        async="async"
        data-cfasync="false"
        src="//pl21730445.toprevenuegate.com/0dd843008e043633d77c86beef925f18/invoke.js"
      />
    </div>
  );
};
