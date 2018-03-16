const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const cors = require('@koa/cors');
const controller = new Router();
const mongoose = require('mongoose');
const Candidate = require('./model/Candidate')

app.use(cors({ origin: '*' }));
app.use(bodyParser());

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${start} :: ${ctx.request.href} - ${ms}ms`);
});

controller.get('/candidate/:person', async (ctx, next) => {
    let name = ctx.params.person.split(".");
    if (name.length != 2) return ctx.body = [];
    // TODO: need to make sure the case is correct

    try {
        ctx.body = await Candidate.find({ firstName: name[0], lastName: name[1]}).exec();
    } catch(e) {
        console.error(e);
        ctx.body = [];
    }
});

controller.get('/candidate', async (ctx, next) => {
    try{
        let candidate = await Candidate.find().exec();
        console.log(candidate);
        ctx.body = candidate;
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }
});

controller.put('/candidate/:id', async (ctx, next) => {
    let id = ctx.params.id;
    console.log('Updating: ' + id);
    try{
        let result = await Candidate.findByIdAndUpdate(id, ctx.request.body, { runValidators: true, new: true }).exec();
        console.log(result);
        ctx.status = 200;
    }catch(e){
        console.error(e);
        ctx.status = 400;
    }
    
});

controller.post('/candidate', async (ctx, next) => {
    console.log(ctx.request.body);
    // todo: Validate body
    var candidate = new Candidate(ctx.request.body);

    await candidate.save(function (err, candidate) {
        if (err) {
            return ctx.body = { error: err }
        }
        ctx.body = { ok: 'okay' }
    });

});

app.use(controller.routes());
mongoose.connect('mongodb://localhost/Candidates');

app.listen(3001);
console.log('Server started');