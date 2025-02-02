/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Template = require('../lib/template');
const Clause = require('../lib/clause');

const chai = require('chai');
const fs = require('fs');
const path = require('path');

chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

const options = { skipUpdateExternalModels: true };

describe('Clause', () => {

    const testLatePenaltyInput = fs.readFileSync(path.resolve(__dirname, 'data/latedeliveryandpenalty', 'sample.txt'), 'utf8');
    const testLatePenaltyPeriodInput = fs.readFileSync(path.resolve(__dirname, 'data/latedeliveryandpenalty-period', 'sample.txt'), 'utf8');
    const testCongaInput = fs.readFileSync(path.resolve(__dirname, 'data/conga', 'sample.txt'), 'utf8');
    const testAllTypesInput = fs.readFileSync(path.resolve(__dirname, 'data/alltypes', 'sample.txt'), 'utf8');
    const testTextOnlyInput = fs.readFileSync(path.resolve(__dirname, 'data/text-only', 'sample.txt'), 'utf8');

    describe('#constructor', () => {

        it('should create a clause for a latedeliveryandpenalty template', async function() {
            const template = await Template.fromDirectory('./test/data/latedeliveryandpenalty', options);
            const clause = new Clause(template);
            clause.should.not.be.null;
        });

        it('should create a clause for a conga template', async function() {
            const template = await Template.fromDirectory('./test/data/conga', options);
            const clause = new Clause(template);
            clause.should.not.be.null;
        });
    });

    describe('#setData', () => {

        it('should be able to set data', async function() {
            const template = await Template.fromDirectory('./test/data/latedeliveryandpenalty', options);
            const clause = new Clause(template);

            // check that we can set/get a valid template model
            const data = {
                $class: 'io.clause.latedeliveryandpenalty.TemplateModel',
                clauseId: 'c0884078-882d-42e0-87d6-4cc824b4f194',
                forceMajeure: false,
                penaltyDuration : {
                    $class : 'org.accordproject.time.Duration',
                    amount : 1,
                    unit : 'days'
                },
                penaltyPercentage : 10,
                capPercentage : 50,
                termination : {
                    $class : 'org.accordproject.time.Duration',
                    amount : 10,
                    unit : 'days'
                },
                fractionalPart : 'days'
            };
            clause.setData(data);
            clause.getData().should.eql(data);

            // check that the composer data is really a Composer object
            clause.getDataAsComposerObject().getFullyQualifiedType().should.be.equal('io.clause.latedeliveryandpenalty.TemplateModel');
        });
        it('should throw error for bad $class', async function() {
            const template = await Template.fromDirectory('./test/data/latedeliveryandpenalty', options);
            const clause = new Clause(template);
            const data = {
                $class: 'bad.class.name'
            };
            (()=> clause.setData(data)).should.throw('Invalid data, must be a valid instance of the template model io.clause.latedeliveryandpenalty.TemplateModel but got: {"$class":"bad.class.name"} ');
        });
    });

    describe('#toJSON', () => {

        it('should get a JSON representation of a clause', async function() {
            const template = await Template.fromDirectory('./test/data/latedeliveryandpenalty', options);
            const clause = new Clause(template);
            const data = {
                $class: 'io.clause.latedeliveryandpenalty.TemplateModel',
                clauseId: 'c0884078-882d-42e0-87d6-4cc824b4f194',
                forceMajeure: false,
                penaltyDuration : {
                    $class : 'org.accordproject.time.Duration',
                    amount : 1,
                    unit : 'days'
                },
                penaltyPercentage : 10,
                capPercentage : 50,
                termination : {
                    $class : 'org.accordproject.time.Duration',
                    amount : 10,
                    unit : 'days'
                },
                fractionalPart : 'days'
            };
            clause.setData(data);
            clause.toJSON().should.eql({
                'data': data,
                'template': 'latedeliveryandpenalty@0.0.1'
            });
        });
    });

    describe('#parse', () => {

        it('should be able to set the data from latedeliveryandpenalty natural language text', async function() {
            const template = await Template.fromDirectory('./test/data/latedeliveryandpenalty', options);
            const clause = new Clause(template);
            clause.parse(testLatePenaltyInput);
            const data = {
                $class: 'io.clause.latedeliveryandpenalty.TemplateModel',
                capPercentage: 2,
                forceMajeure: true,
                fractionalPart : 'days',
                penaltyDuration: {
                    $class: 'org.accordproject.time.Duration',
                    amount: 9,
                    unit: 'days'
                },
                penaltyPercentage: 7,
                termination: {
                    $class: 'org.accordproject.time.Duration',
                    amount: 2,
                    unit: 'weeks',
                }
            };
            // remove the generated clause id
            delete clause.getData().clauseId;
            clause.getData().should.eql(data);
            clause.getIdentifier().should.equal('latedeliveryandpenalty@0.0.1-0ee76aefdd19d6863f2f1642182f506b1ac8e5c4be2a005c00dd13bbf36fe63c');
        });

        it('should be able to set the data from latedeliveryandpenalty natural language text (with a Period)', async function() {
            const template = await Template.fromDirectory('./test/data/latedeliveryandpenalty-period', options);
            const clause = new Clause(template);
            clause.parse(testLatePenaltyPeriodInput);
            const data = {
                $class: 'org.accordproject.simplelatedeliveryandpenalty.SimpleLateDeliveryAndPenaltyContract',
                buyer: {
                    $class: 'org.accordproject.cicero.contract.AccordParty',
                    partyId: 'Betty Buyer'
                },
                seller: {
                    $class: 'org.accordproject.cicero.contract.AccordParty',
                    partyId: 'Steve Seller'
                },
                penaltyPeriod: {
                    $class: 'org.accordproject.time.Period',
                    amount: 6,
                    unit: 'months'
                },
                penaltyPercentage: 10.5,
                capPercentage: 55,
                maximumDelay: {
                    $class: 'org.accordproject.time.Period',
                    amount: 9,
                    unit: 'months',
                }
            };
            // remove the generated contract id
            delete clause.getData().contractId;
            clause.getData().should.eql(data);
            clause.getIdentifier().should.equal('simplelatedeliveryandpenalty@0.2.1-708587fe51e93166853ebe13a883209a635c4b4d03bb9d15b27c819c394cb995');
        });

        it('should be able to set the data from conga natural language text', async function() {
            const template = await Template.fromDirectory('./test/data/conga', options);
            const clause = new Clause(template);
            clause.parse(testCongaInput);
            const data = {
                $class: 'org.accordproject.conga.TemplateModel',
                participant: 'Dan Selman',
                amount: 100.0,
                swag: 'penguins',
                maybeThing: 'thing'
            };
            delete clause.getData().clauseId;
            clause.getData().should.eql(data);
            clause.getIdentifier().should.equal('conga@0.0.1-6873b1a14258a44df9c96f16b9bdd9d97ecc93040f5ebc8967c7c04c104c2ccb');
        });

        it('should throw an error for empty text', async function() {
            const template = await Template.fromDirectory('./test/data/conga', options);
            const clause = new Clause(template);
            (()=> clause.parse('')).should.throw('Parsing clause text returned a null AST. This may mean the text is valid, but not complete.');
        });

        it('should be able to set the data for a text-only clause', async function() {
            const template = await Template.fromDirectory('./test/data/text-only', options);
            const clause = new Clause(template);
            clause.parse(testTextOnlyInput);
            const data = {
                $class: 'io.clause.latedeliveryandpenalty.TemplateModel',
                capPercentage: 2,
                forceMajeure: true,
                fractionalPart : 'days',
                penaltyDuration: {
                    $class: 'org.accordproject.time.Duration',
                    amount: 9,
                    unit: 'days'
                },
                penaltyPercentage: 7,
                termination: {
                    $class: 'org.accordproject.time.Duration',
                    amount: 2,
                    unit: 'weeks',
                }
            };
            delete clause.getData().clauseId;
            clause.getData().should.eql(data);
            clause.getIdentifier().should.equal('text-only@0.0.1-0ee76aefdd19d6863f2f1642182f506b1ac8e5c4be2a005c00dd13bbf36fe63c');
        });

        it('should create a template from a directory no logic', () => {
            return Template.fromDirectory('./test/data/no-logic', options).should.be.fulfilled;
        });

    });

    describe('#generateText', () => {

        it('should be able to roundtrip latedelivery natural language text', async function() {
            const template = await Template.fromDirectory('./test/data/latedeliveryandpenalty', options);
            const clause = new Clause(template);
            clause.parse(testLatePenaltyInput);
            const nl = clause.generateText();
            testLatePenaltyInput.should.equal(nl);
        });

        it('should be able to roundtrip latedelivery natural language text (with a Period)', async function() {
            const template = await Template.fromDirectory('./test/data/latedeliveryandpenalty-period', options);
            const clause = new Clause(template);
            clause.parse(testLatePenaltyPeriodInput);
            const nl = clause.generateText();
            testLatePenaltyPeriodInput.should.equal(nl);
        });

        it('should be able to roundtrip conga natural language text', async function() {
            const template = await Template.fromDirectory('./test/data/conga', options);
            const clause = new Clause(template);
            clause.parse(testCongaInput);
            const nl = clause.generateText();
            testCongaInput.should.equal(nl);
        });

        it('should be able to roundtrip alltypes natural language text', async function() {
            const template = await Template.fromDirectory('./test/data/alltypes', options);
            const clause = new Clause(template);
            clause.parse(testAllTypesInput);
            const nl = clause.generateText();
            nl.should.equal(testAllTypesInput);
        });
    });
});