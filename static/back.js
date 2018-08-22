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

function generateDataHtml(data){
    elemnt_html = '';
    for(item of data){
        var data_html = `
        <li class="list-group-item" id='list-${item['id']}'><span class='tag'>${item['id']}</span>${item['event']}</li>
        `
        elemnt_html += data_html;
    }
    return elemnt_html;
}

function loadData(data){
    const dataHtml = generateDataHtml(data);
    $('div#Todo-List .list-group').append(dataHtml);
}

function getItemFromServer(){
    $.ajax({
        url : API,
        method : 'GET',
        success: function (data){
            loadData(data)
        },
    })
}
$('ul.list-group').delegate('li','click',function(e){
    if($(this).attr('class')==='list-group-item disabled'){
        $(this).attr('class','list-group-item');
    }else{
        $(this).attr('class','list-group-item disabled');
    }
})
/*
$('#post-form').submit(function(e){
    preventReload(e);
    var data = getInputData();
    console.log(data);
    alert(data['event'])
    if(data){
        postItemToServer(data)
    }
})
*/
$('.test2').click(function(e){
    var mode = $('[select="Mode"]').val();
    console.log(mode);
})
$('[select="Mode"]').click(function(e){
    var mode = $('[select="Mode"]').val();
    console.log(mode);
})


getItemFromServer();