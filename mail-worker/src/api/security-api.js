import app from '../hono/hono';
import securityService from '../service/security-service';
import result from '../model/result';
import userContext from '../security/user-context';

app.get('/security/list', async (c) => {
	const list = await securityService.list(c, c.req.query(), userContext.getUserId(c));
	return c.json(result.ok(list));
});

app.get('/security/stats', async (c) => {
	const data = await securityService.stats(c, userContext.getUserId(c));
	return c.json(result.ok(data));
});

app.put('/security/setStatus', async (c) => {
	await securityService.setStatus(c, await c.req.json(), userContext.getUserId(c));
	return c.json(result.ok());
});
