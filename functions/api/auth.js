/**
 * GET /api/auth
 * 将用户重定向到 GitHub OAuth 授权页面
 * 环境变量：GITHUB_CLIENT_ID
 */
export async function onRequest(context) {
  const clientId = context.env.GITHUB_CLIENT_ID;
  const scope = "repo,user";
  const redirectUri = encodeURIComponent(
    `https://archbloc.com/api/callback`
  );

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${clientId}` +
    `&scope=${scope}` +
    `&redirect_uri=${redirectUri}`;

  return Response.redirect(githubAuthUrl, 302);
}
