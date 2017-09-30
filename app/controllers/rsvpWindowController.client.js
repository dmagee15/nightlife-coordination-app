console.log("Script executed");
var searchResults = JSON.parse(data).businesses;
console.log(searchResults[0]);
var length = searchResults.length;


function openRsvpWindow(index){
    var indexNum = Number(index);
    console.log(searchResults[Number(index)]);
    $('.addressOne').html(searchResults[indexNum].location.address1)
    $('.addressTwo').html(searchResults[indexNum].location.city+', '+searchResults[indexNum].location.zip_code);
    $('.infoPhone').html(searchResults[indexNum].display_phone)
    $('#windowRatingReviews').html(searchResults[indexNum].review_count+" Reviews");
    switch(searchResults[indexNum].rating){
        case 1: $('#windowRatingImage').attr('src','../public/img/small_1.png'); break;
        case 1.5: $('#windowRatingImage').attr('src','../public/img/small_1_half.png'); break;
        case 2: $('#windowRatingImage').attr('src','../public/img/small_2.png'); break;
        case 2.5: $('#windowRatingImage').attr('src','../public/img/small_2_half.png'); break;
        case 3: $('#windowRatingImage').attr('src','../public/img/small_3.png'); break;
        case 3.5: $('#windowRatingImage').attr('src','../public/img/small_3_half.png'); break;
        case 4: $('#windowRatingImage').attr('src','../public/img/small_4.png'); break;
        case 4.5: $('#windowRatingImage').attr('src','../public/img/small_4_half.png'); break;
        case 5: $('#windowRatingImage').attr('src','../public/img/small_5.png'); break;
    }
    $('.rsvpWindow').fadeIn('slow');
    $('.rsvpWindowContainer').fadeIn('slow');
//    document.getElementById('rsvpWindowContainerId').style.display = "inline-block";
}

$('.rsvpWindowContainer').on('click',function(){
   $('.rsvpWindow').fadeOut('slow');
   $('.rsvpWindowContainer').fadeOut('slow');
});

function closeRsvpWindow(){

//    document.getElementById('rsvpWindowId').style.display = "none";
}