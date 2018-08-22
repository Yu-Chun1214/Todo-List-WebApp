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
    console.log(document.getElementById('ih'));
    console.log(document.getElementById('importance-select'));
    if(document.getElementById('ih')===null){
        console.log('null')
    }
})
$('select').change(function(e){
    var mode = $(this).children('option:selected').text();
    
    console.log($('[class="add-block"]').attr);
    if(mode==='Edit' || mode==='Delete'){
        document.getElementById('input-block').remove();
        document.getElementById('importance-select').remove();

    }
    else if(mode==='Add'){
        console.log(mode)
        if(document.getElementById('input-block')===null && document.getElementById('importance-select')===null){
            console.log('if null')
            $('#user-input').append(`
            <div class="input-group-append" id="input-block">
              <div class="form-group">
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" style="width: 800px;">
              </div>
            </div>
            <div id="importance-select">
            <select class="custom-select" id="inputGroupSelect02">                
                <option selected>Importance</option>
                <option value="1">Very Important</option>
                <option value="2">Normal</option>
                <option value="3">Less Important</option>
            </select>
            </div>
            `)

        }
    }
})


getItemFromServer();