const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Recipes List', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list items on GET', function() {
        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.at.least(1);

                res.body.forEach(function(item) {
                    expect(item).to.be.an('object');
                    expect(item).to.include.keys('name', 'id', 'ingredients');
                });
            });
    });

    it('should add an item on POST', function() {
        const newRecipe = {name: 'avo toast', ingredients: ['avo', 'toast']};
        return chai.request(app)
            .post('/recipes')
            .send(newRecipe)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys('id', 'name', 'ingredients');
                expect(res.body.name).to.equal(newRecipe.name);
                expect(res.body.ingredients).to.be.an('array');
            });
    });

    it('should update items on PUT', function() {
        const updateData = {
            name: 'avo toast',
            ingredients: ['avo', 'toast']
        };

        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                updateData.id = res.body[0].id;

                return chai.request(app)
                    .put(`/recipes/${updateData.id}`)
                    .send(updateData);
            })

            .then(function(res) {
                expect(res).to.have.status(204);
                expect(res.body).to.be.an('object');
            });
    });

    it('should delete items on DELETE', function() {
        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/recipes/${res.body[0].id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });
});