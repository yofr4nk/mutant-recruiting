const koa = require('koa'); 
const koaRouter = require('koa-router'); 
const koaBody = require('koa-bodyparser'); 
const cors = require('koa-cors');
const dotenv = require('dotenv');

dotenv.config();
const app = new koa();
const router = new koaRouter();
const PORT = process.env.PORT || 3001;
const DATABASE_HOST = process.env.DATABASE_HOST;
const { mongoDBConnect } = require('./models/connection'),
    { mutantDetecting } = require('./controllers/mutantDetecting'),
    { getStats } = require('./controllers/mutantStats'),
    { cloudFrontCache } = require('./middlewares/');

app.use(cors());
app.use(koaBody({
    extendTypes: {
        json: [ 'application/x-javascript' ],
    },
}));

router.get('/stats/', getStats);

router.post('/mutant/', cloudFrontCache, mutantDetecting);

//Health check
router.get('/ping/', (ctx) => {
    return ctx.body = 'pong';
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => {
    mongoDBConnect(DATABASE_HOST)
        .then(connectionData => console.log(connectionData))
        .catch(err => console.log(err));
    
    console.log('Server is running in port', PORT);
});