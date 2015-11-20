/*
 *
 * Test Algo.js
 *
 */
describe('algo-test', function() {
    var Algo = require('../src/engine/service/algo.js');
    var Movie = require('../src/engine/model/movie.js');
    var assert = require("assert");
    var expect = require('expect.js');
    var algo = null;

    var movieNameTest ={
        fileName:"",
        result:''
    }

    beforeEach(function(){
        algo = new Algo();
    });

    it('should find movie name : [Fantastic.Four.2015.HC.HDRip.XViD.AC3-ETRG]', function() {
        console.log(algo.parseFileName("Fantastic.Four.2015.HC.HDRip.XViD.AC3-ETRG"));
    });

    it('should find movie name : [Minions.2015.HDRip.XViD ETRG]', function() {
        console.log(algo.parseFileName("Minions.2015.HDRip.XViD ETRG"));
    });

    it('should find movie name : [Straight.Outta.Compton.2015.HC.HDRip.XViD.AC3-ETRG]', function() {
        console.log(algo.parseFileName("Straight.Outta.Compton.2015.HC.HDRip.XViD.AC3-ETRG"));
    });

    it('should find movie name : [Avengers Age of Ultron 2015 TRUEFRENCH WEBRip MD XviD-SVR]', function() {
        console.log(algo.parseFileName("Avengers Age of Ultron 2015 TRUEFRENCH WEBRip MD XviD-SVR"));
    });

    it('should find movie name : [Self.less.2015.BRRip.XviD-ETRG]', function() {
        console.log(algo.parseFileName("Self.less.2015.BRRip.XviD-ETRG"));
    });

    it('should find movie name : [Robin Des Bois La Veritable Histoire 2015 FRENCH DVDRIP XVid-LYS]', function() {
        console.log(algo.parseFileName("Robin Des Bois La Veritable Histoire 2015 FRENCH DVDRIP XVid-LYS"));
    });

    it('should find movie name : [Mad Max Fury Road 2015 FRENCH BDRip XviD-GLUPS]', function() {
        console.log(algo.parseFileName("Mad Max Fury Road 2015 FRENCH BDRip XviD-GLUPS"));
    });

    it('should find movie name : [Mad Max Fury Road 2015 FRENCH BDRip XviD-GLUPS]', function() {
        console.log(algo.parseFileName("Mad Max Fury Road 2015 FRENCH BDRip XviD-GLUPS"));
    });

    it('should find movie name : [New York]', function() {
        console.log(algo.parseFileName("New York"));
    });

    it('should find movie name : [Mission Impossible 5-Rogue Nation 2015 FULL 720P HDTS x264 AC3 H]', function() {
        console.log(algo.parseFileName("Mission Impossible 5-Rogue Nation 2015 FULL 720P HDTS x264 AC3 H"));
    });

    it('should find movie name : [Avengers Age of Ultron (2015) HDRip XviD-MAXSPEED]', function() {
        console.log(algo.parseFileName("Avengers Age of Ultron (2015) HDRip XviD-MAXSPEED"));
    });

    it('should find movie name : [Fast.and.Furious.7.2015.HD-TS.XVID.AC3.HQ.Hive-CM8]', function() {
        console.log(algo.parseFileName("Fast.and.Furious.7.2015.HD-TS.XVID.AC3.HQ.Hive-CM8"));
    });

    it('should find movie name : [2001 : l odyssée de l espace TRUEFRENCH DVDRIP AC3 1968]', function() {
        console.log(algo.parseFileName("2001 : l'odyssée de l'espace TRUEFRENCH DVDRIP AC3 1968"));
    });

	it('should return error when give movie name null ', function() {
        var t = this;
        expect(function() {
            t.algo.parseFileName(null);
        }).to.throwError('Null parameter for parseFileName');
    });


});