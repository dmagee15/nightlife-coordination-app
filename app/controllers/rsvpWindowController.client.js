console.log("Script executed");
var searchResults = JSON.parse(data).businesses;
console.log(searchResults[0]);
var length = searchResults.length;
function openRsvpWindow(index){
    console.log(searchResults[Number(index)].id);
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