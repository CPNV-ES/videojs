Template.home.helpers({
  movies : function(){
    return Movies.find({},{sort: {themoviedb:{title:-1}}});
  }
});

Template.home.events({
  'mouseenter .movielist ul li a' : function(event, template){
    var $movies = $('.movies');
    var $infobar = $('.infobar');

    console.log(this);


  }
});
