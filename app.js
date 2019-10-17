const koa = require('koa'); 
const koaRouter = require('koa-router'); 
const koaBody = require('koa-bodyparser'); 
const cors = require('koa-cors');
const app = new koa();
const router = new koaRouter();
const PORT = process.env.PORT || 3001;
const { mongoDBConnect } = require('./models/connection'),
    { mutantDetecting } = require('./controllers/mutantDetecting'),
    { getStats } = require('./controllers/mutantStats');

app.use(cors());
app.use(koaBody({
    extendTypes: {
        json: [ 'application/x-javascript' ],
    },
}));

router.get('/stats/', getStats);

router.post('/mutant/', mutantDetecting);

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => {
    mongoDBConnect();
    console.log('Server is running in port', PORT);
});