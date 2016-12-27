'use strict';

var GameScore = AV.Object.extend("GameScore");

var Post=AV.Object.extend("Post");

// for #extend test
class Person extends AV.Object {}
class UglifiedClass extends AV.Object {}
var BackbonePerson = AV.Object.extend('Person');

describe('Objects', function(){
  var objId;
  var gameScore = GameScore.new();
  after(function() {
    return gameScore.destroy();
  });
  it('getter/setter compatible', function() {
    Object.defineProperty(Post.prototype, 'name', {
      get: function() {
        return this.get('name');
      },
      set: function(value) {
        return this.set('name', value);
      }
    });
    new Post().name;
  });
  
  it('reserved keys', () => {
    (() => new Person({
      objectId: '0'
    })).should.throwError(/reserved/);
    (() => new Person({
      createdAt: '0'
    })).should.throwError(/reserved/);
    (() => new Person({
      updatedAt: '0'
    })).should.throwError(/reserved/);
    (() => new Person().set('objectId', '1')).should.throwError(/reserved/);
  })

  describe('#extend', () => {
    it('extend for multiple times should not throw', () => {
      let Test;
      for (var i=100000; i > 0; i--) {
        Test = AV.Object.extend('Test');
      }
      new Test();
    });

    it('ES6 extend syntex', () => {
      var backbonePerson = new BackbonePerson();
      backbonePerson.set('name', 'leeyeh');
      var es6Person = new Person();
      es6Person.set('name', 'leeyeh');
      expect(backbonePerson.toJSON()).to.eql(es6Person.toJSON());
      expect(backbonePerson._toFullJSON()).to.eql(es6Person._toFullJSON());
    });

    it('#register an ES6 class', () => {
      expect(new AV.Object('Person')).to.be.a(BackbonePerson);
      AV.Object.register(Person);
      expect(new AV.Object('Person')).to.be.a(Person);
      expect(() => AV.Object.register(1)).to.throwError();
      expect(() => AV.Object.register(function(){})).to.throwError();
    });

    it('#register with name', () => {
      AV.Object.register(UglifiedClass, 'RealClass');
      expect(new AV.Object('RealClass')).to.be.a(UglifiedClass);
      expect(AV._encode(new UglifiedClass()).className).to.equal('RealClass');
    })
  });

  describe('#Saving Objects', function(){
    it('should crate a Object', function(){
      //gameScore.set("newcol","sss")
      var myPost = new Post();
      myPost.set("title", "post1");
      myPost.set("content", "Where should we go for lunch?");
      var point = new AV.GeoPoint({latitude: 80.01, longitude: -30.01});
      myPost.set("geo",point);
      return myPost.save();
    });

    it('should create another Object', function() {
      gameScore.set("score", 1111);
      gameScore.set("playerName", "dd");
      gameScore.set("cheatMode", false);
      gameScore.set("arr", ["arr1","arr2"]);
      gameScore.set('id', 'id');
      return gameScore.save().then(function(result) {
        expect(result.id).to.be.ok();
        objId=result.id;
      });
    });

    it('toJSON and parse', () => {
      const json = gameScore.toJSON();
      json.objectId.should.eql(gameScore.id);
      json.id.should.eql(gameScore.get('id'));
      json.score.should.eql(gameScore.get('score'));
      const parsedGameScore = new GameScore(json, { parse: true });
      parsedGameScore.id.should.eql(gameScore.id);
      parsedGameScore.get('id').should.eql(gameScore.get('id'));
      parsedGameScore.get('score').should.eql(gameScore.get('score'));
    });

    it('should create a User',function(){
      var User = AV.Object.extend("User");
      var u = new User();
      var r=Math.random();
      u.set("username","u"+r);
      u.set("password","11111111");
      u.set("email","u"+r+"@test.com");
      return u.save();
    });

    it('should validate failed.', function(){
      var TestObject = AV.Object.extend('TestObject', {
        validate: function (attrs, options){
          throw new Error('test');
        }
      });
      var testObject = new TestObject();
      (() => testObject.set('a', 1)).should.throwError({
        message: 'test',
      });
      expect(testObject.get('a')).to.be(undefined);
    });
  });

  describe("Retrieving Objects",function(){
    it("should be the just save Object",function(){
      var GameScore = AV.Object.extend("GameScore");
      var query = new AV.Query(GameScore);
      debug(objId);
      return query.get(objId).then(function(result) {
        expect(gameScore.id).to.be.ok();
        expect(gameScore.get('objectId')).to.be(gameScore.id);
        expect(gameScore.get('id')).to.be('id');
      });
    });
  });

  describe("Updating Objects",function(){
    it("should update prop",function(){
      gameScore.set("score", 10000);
      return gameScore.save().then(function(result) {
        expect(result.id).to.be.ok();
      });
    });
    it('should not update prop when query not match',function(){
      gameScore.set('score', 10000);
      return gameScore.save(null, {
        query: new AV.Query(GameScore).equalTo('score', -1),
      }).should.be.rejectedWith({
        code: 305,
      });
    });
    it('should update prop when query match',function(){
      gameScore.set('score', 10000);
      return gameScore.save(null, {
        query: new AV.Query(GameScore).notEqualTo('score', -1),
        fetchWhenSave: true
      });
    });
  });

  describe('Fetching Objects', () => {
    it('fetch', () =>
      AV.Object.createWithoutData('GameScore', gameScore.id).fetch().then(score => {
        expect(score.get('score')).to.be.a('number');
        expect(score.createdAt).to.be.a(Date);
        expect(score.id).to.be.eql(gameScore.id);
      })
    );
    it('fetchAll', () =>
      AV.Object.fetchAll([
        AV.Object.createWithoutData('GameScore', gameScore.id),
        AV.Object.createWithoutData('GameScore', gameScore.id),
      ]).then(([score1, score2]) => {
        expect(score1.get('score')).to.be.a('number');
        expect(score1.createdAt).to.be.a(Date);
        expect(score1.id).to.be.eql(gameScore.id);
        expect(score2.get('score')).to.be.a('number');
        expect(score2.createdAt).to.be.a(Date);
        expect(score2.id).to.be.eql(gameScore.id);
      })
    );
    it('fetchAll with non-existed Class should fail', () =>
      AV.Object.fetchAll([
        AV.Object.createWithoutData('GameScore', gameScore.id),
        AV.Object.createWithoutData('FakeClass', gameScore.id),
      ]).should.be.rejected()
    );
    it('fetchAll with dirty objet should fail', () =>
      AV.Object.fetchAll([
        AV.Object.createWithoutData('GameScore', gameScore.id),
        new GameScore(),
      ]).should.be.rejected()
    );
  });

  describe("Deleting Objects",function(){
    it("should delete cheatMode",function(){
      gameScore.unset("cheatMode");
      return gameScore.save();
    });
  });

  describe('Array Data', function () {
    let post;
    beforeEach(function() {
      post = new Post({
        data: [1, 2],
      });
      return post.save();
    });
    afterEach(function() {
      return post.destroy();
    });

    it('add', function() {
      return post.add('data', 2).save().then(function() {
        return post.fetch();
      }).then(function(post) {
        expect(post.get('data')).to.be.eql([1,2,2]);
      });
    });
    it('addUnique', function() {
      return post.addUnique('data', 2).save().then(function() {
        return post.fetch();
      }).then(function(post) {
        expect(post.get('data')).to.be.eql([1,2]);
      });
    });
    it('remove', function() {
      return post.remove('data', 2).save().then(function() {
        return post.fetch();
      }).then(function(post) {
        expect(post.get('data')).to.be.eql([1]);
      });
    });
    it('accept array param', function() {
      return post.remove('data', [2]).save().then(function() {
        return post.fetch();
      }).then(function(post) {
        expect(post.get('data')).to.be.eql([1]);
      });
    });
  });

  describe("Relational Data",function(){

    var commentId,myComment,myPost,relation;
    it("should set relation ",function(){

      // Declare the types.
      var Post = AV.Object.extend("Post");
      var Comment = AV.Object.extend("Comment");

      // Create the post

      myPost = Post.new();
      myPost.set("title", "post1");
      myPost.set("author", "author1");
      myPost.set("content", "Where should we go for lunch?");
      var point = new AV.GeoPoint({latitude: 80.01, longitude: -30.01});
      myPost.set("location",point);

      // Create the comment
      myComment = new Comment();
      myComment.set("content", "comment1");

      // Add a relation between the Post and Comment
      myComment.set("parent", myPost);

      // This will save both myPost and myComment
      return myComment.save().then(function(myComment){
        var query = new AV.Query(Comment);
        query.include("parent");
        return query.get(myComment.id);
      }).then(function(obj) {
        expect(obj.get("parent").get("title")).to.be("post1");
      });
    });

    var Person=AV.Object.extend("Person");
    var p;
    var posts=[];

    it("should create a Person",function(){
      var Person = AV.Object.extend("Person");
      p = new Person();
      p.set("pname","person1");
      return p.save();
    });

    it("should create many to many relations",function(){
      var query = new AV.Query(Person);
      return query.first().then(function(result){
        var p=result;
        var relation = p.relation("likes");
        for(var i=0;i<posts.length;i++){
          relation.add(posts[i]);
        }
        p.set("pname","plike1");
        return p.save();
      }).then(function() {
        debug(p.toJSON());
        debug(p.get("likes"));
      });
    });

    it("should save all successfully", function(){
      var Person=AV.Object.extend("Person");
      var query=new AV.Query(Person);
      return query.first().then(function(result){
        var person = AV.Object.createWithoutData('Person', result.id);
        person.set('age', 30);
        return AV.Object.saveAll([person]);
      }).then(([person]) => {
        person.id.should.be.ok();
        person.get('age').should.eql(30);
      });
    });

    it("should query relational data",function(){
      var Person=AV.Object.extend("Person");
      var query=new AV.Query(Person);
      return query.first().then(function(result){
        var relation = result.relation("likes");
        return relation.query().find();
      });
    });

    it("should fetch when save", function(){
      var query=new AV.Query(Person);
      return query.first().then(function(person){
        var person2 = new Person();
        person2.id = person.id;
        person2.set('age', 0);
        person2.increment('age',9);
        return person2.save();
      }).then(function(person){
        person.increment('age', 10);
        return person.save(null, {
          fetchWhenSave: true
        });
      }).then(function(p){
        expect(p.get('age')).to.be(19);
      });
    });

    it("should fetch when save when creating new object.", function(){
      var p= new Person();
      p.set('pname', 'dennis');
      return p.save(null, {
        fetchWhenSave: true
      }).then(function(person) {
        expect(person.get('company')).to.be('leancloud');
      });
    });

    it('should fetch include authors successfully', function() {
      var myPost = new Post();
      myPost.set('author1', new Person({name: '1'}));
      myPost.set('author2', new Person({name: '2'}));
      return myPost.save().then(function() {
        myPost = AV.Object.createWithoutData('Post', myPost.id);
        return myPost.fetch({include: ['author1', 'author2']}, {}).then(function() {
          expect(myPost.get('author1').get('name')).to.be('1');
          expect(myPost.get('author2').get('name')).to.be('2');
        });
      });
    });

    it('should compatible with previous include option of fetch', function() {
      var myPost = new Post();
      myPost.set('author1', new Person({name: '1'}));
      myPost.set('author2', new Person({name: '2'}));
      return myPost.save().then(function() {
        myPost = AV.Object.createWithoutData('Post', myPost.id);
        return myPost.fetch({include: 'author1, author2'}, {}).then(function() {
          expect(myPost.get('author1').get('name')).to.be('1');
          expect(myPost.get('author2').get('name')).to.be('2');
        });
      });
    });

    it("fetchOptions keys", function(){
      var person = new Person();
      person.set('pname', 'dennis');
      person.set('age', 1)
      return person.save().then(() =>
        AV.Object.createWithoutData('Person', person.id).fetch({
          keys: ['pname'],
        })
      ).then(function(person) {
        expect(person.get('pname')).to.be('dennis');
        expect(person.get('age')).to.be(undefined);
      });
    });

  });


});//END  RETRIEVING
