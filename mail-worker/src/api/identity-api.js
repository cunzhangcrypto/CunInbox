import app from '../hono/hono';
import identityService from '../service/identity-service';
import result from '../model/result';
import userContext from '../security/user-context';

app.get('/identity/list', async (c) => {
	const list = await identityService.list(c, c.req.query(), userContext.getUserId(c));
	return c.json(result.ok(list));
});

app.get('/identity/stats', async (c) => {
	const data = await identityService.listWithStats(c, userContext.getUserId(c));
	return c.json(result.ok(data));
});

app.get('/identity/detail', async (c) => {
	const detail = await identityService.selectById(c, Number(c.req.query('identityId')), userContext.getUserId(c));
	return c.json(result.ok(detail));
});

app.post('/identity/add', async (c) => {
	const data = await identityService.add(c, await c.req.json(), userContext.getUserId(c));
	return c.json(result.ok(data));
});

app.put('/identity/update', async (c) => {
	await identityService.update(c, await c.req.json(), userContext.getUserId(c));
	return c.json(result.ok());
});

app.delete('/identity/delete', async (c) => {
	await identityService.delete(c, c.req.query(), userContext.getUserId(c));
	return c.json(result.ok());
});

app.put('/identity/setStatus', async (c) => {
	await identityService.setStatus(c, await c.req.json(), userContext.getUserId(c));
	return c.json(result.ok());
});
