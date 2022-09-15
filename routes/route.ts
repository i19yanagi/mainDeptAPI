import { Router, RouterContext } from 'oak/mod.ts';
import { DB } from '@db';

const router = new Router();
const db = new DB();
db.initialize();

router
  .get('/', (ctx: RouterContext<string>) => {
    ctx.response.body = 'hello oak';
  })
  .get('/get', async (ctx) => {
    ctx.response.body = await db.getAllResult();
  })
  .get('/get/:name', async (ctx) => {
    const name = ctx.params.name;
    ctx.response.body = await db.getResultByName(name);
  })

export default router;