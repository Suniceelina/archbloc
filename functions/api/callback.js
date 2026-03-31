/**
 * /functions/api/callback.js
 * GitHub OAuth 回调 — 用 code 换 token，再通知 Decap CMS
 * 环境变量：
 *   GITHUB_CLIENT_ID     （在 EdgeOne Pages 控制台配置）
 *   GITHUB_CLIENT_SECRET （在 EdgeOne Pages 控制台配置）
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code parameter", { status: 400 });
  }

  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  // 用 code 向 GitHub 换取 access_token
  let tokenData;
  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );
    tokenData = await tokenRes.json();
  } catch (err) {
    return new Response("Failed to fetch token from GitHub", { status: 502 });
  }

  if (tokenData.error) {
    return new Response(
      "GitHub OAuth error: " + (tokenData.error_description || tokenData.error),
      { status: 400 }
    );
  }

  const token = tokenData.access_token;
  const safeToken = token.replace(/['"\\]/g, "\\$&");

  const finalHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>授权中...</title></head>
<body>
<p>授权成功，正在返回编辑器...</p>
<script>
  (function () {
    var token = "${safeToken}";
    var provider = "github";
    function receiveMessage(e) {
      window.opener.postMessage(
        "authorization:" + provider + ":success:" + JSON.stringify({ token: token, provider: provider }),
        e.origin
      );
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:" + provider, "*");
  })();
<\/script>
</body>
</html>`;

  return new Response(finalHtml, {
    status: 200,
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
