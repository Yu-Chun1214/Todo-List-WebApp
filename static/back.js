const Debug_Mode = false;
const BASE_URL = window.location.origin;
const API = BASE_URL + '/record';
function preventReload(e){
    if(Debug_Mode){
        e.preventDefault();
    }
}

function getInputData(){
    var event={
        'event':$('input[name="event"]').val(),
    }
    return event;
}

function postItemToServer(inputdata){
    $.ajax({
        url : API,
        method : 'POST',
        data : inputdata,
        success:function(inputdata){
            console.log(inputdata)
        }
    })
}

$('ul.list-group li').click(function(){
    if($(this).attr('class')==='list-group-item disabled'){
        $(this).attr('class','list-group-item');
    }else{
        $(this).attr('class','list-group-item disabled');
    }
})

$('#post-form').submit(function(e){
    preventReload(e);
    var data = getInputData();
    console.log(data);
    alert(data['event'])
    if(data){
        postItemToServer(data)
    }
})

$('.test2').click(function(e){
    var data = getInputData();
    console.log(data);
    postItemToServer(data)
})
