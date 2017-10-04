console.log("Script executed");
var searchResults = JSON.parse(rawData).businesses;
console.log(rsvpArray);
var length = searchResults.length;
var latitude = 0;
var longitude = 0;
var currentIndex = 0;
var firstMap = true;
var marker;
var map;

function confirmRsvp(){
    console.log(currentIndex+" "+searchResults[currentIndex].id);
//    $('.confirmButton')
    $.ajax({
        url:'/confirmRsvp',
        type:'post',
        data:'value='+searchResults[currentIndex].id,
        success:function(serverData){
            console.log("client received response");
            console.log(serverData);
            rsvpArray[currentIndex] = (true)?false:true;
            var idString = '#rsvp'+currentIndex;
            var rsvpNumberString = '#rsvpNumber'+currentIndex;
            if($(idString).hasClass('rsvpButton')){
                $(idString).removeClass('rsvpButton').addClass('rsvpButtonActive');
                $('#confirm').removeClass('confirmButton').addClass('confirmButtonActive');
                $(rsvpNumberString).html(Number($(rsvpNumberString).text())+1);
            }
            else{
                $(idString).removeClass('rsvpButtonActive').addClass('rsvpButton');
                $('#confirm').removeClass('confirmButtonActive').addClass('confirmButton');
                $(rsvpNumberString).html(Number($(rsvpNumberString).text())-1);
            }
        }
    });
}

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: {lat: latitude, lng: longitude},
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
             }       
        });
        marker = new google.maps.Marker({
          position: {lat: latitude, lng: longitude},
          map: map
        });

      }


function openRsvpWindow(index){
    var indexNum = Number(index);
    currentIndex = indexNum;
    console.log(searchResults[Number(index)]);
    $('.addressOne').html(searchResults[indexNum].location.address1)
    $('.addressTwo').html(searchResults[indexNum].location.city+', '+searchResults[indexNum].location.zip_code);
    $('.infoPhone').html(searchResults[indexNum].display_phone)
    $('#windowRatingReviews').html(searchResults[indexNum].review_count+" Reviews");
    if(rsvpArray[indexNum]==true){
        $('#confirm').removeClass('confirmButton').addClass('confirmButtonActive');
    }
    else{
        $('#confirm').removeClass('confirmButtonActive').addClass('confirmButton');
    }
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
    latitude = searchResults[indexNum].coordinates.latitude;
    longitude = searchResults[indexNum].coordinates.longitude;
    if(firstMap){
    firstMap = false;
    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.src= 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC1munvl4oBFHvOEqxudlejjo_HNMeh4pQ&callback=initMap';
    head.appendChild(script);
    }
    else{
        marker.setMap(null);
        marker = new google.maps.Marker({
          position: {lat: latitude, lng: longitude},
          map: map
        });
        map.setCenter(new google.maps.LatLng(latitude,longitude));
    }
//    document.getElementById('rsvpWindowContainerId').style.display = "inline-block";
}

$('.rsvpWindowContainer').on('click',function(){
   $('.rsvpWindow').fadeOut('slow');
   $('.rsvpWindowContainer').fadeOut('slow');
});

function closeRsvpWindow(){

//    document.getElementById('rsvpWindowId').style.display = "none";
}