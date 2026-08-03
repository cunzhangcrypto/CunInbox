import app from '../hono/hono';
import platformService from '../service/platform-service';
import result from '../model/result';

app.get('/platform/list', async (c) => {
	const list = await platformService.list(c, c.req.query());
	return c.json(result.ok(list));
});

app.post('/platform/add', async (c) => {
	const data = await platformService.add(c, await c.req.json());
	return c.json(result.ok(data));
});

app.put('/platform/update', async (c) => {
	await platformService.update(c, await c.req.json());
	return c.json(result.ok());
});
