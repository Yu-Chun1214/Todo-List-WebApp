const Debug_Mode = false;
const BASE_URL = window.location.origin;
const API = BASE_URL + '/record';

function preventReload(e){
    if(Debug_Mode){
        e.preventDefault();
    }
}

function getInputData(){
    const mode= $('.event div#mode-select option:selected').text();
    if(mode==='Add'){
        return getAddData();
    }else if(mode==='Edit'){
        return getEditData();
    }else if(mode==='Delete'){
        return getDeleteData();
    }
}

function getAddData(){
    var event = {
        'event':$('input#eventInput').val(),
        'importance':$('.event div#importance-select option:selected').text(),
    }
    return event;
}

function getEditData(){
    var event={
        'id':$('.event select[name="delete"] option:selected').val(),
        'select':$('.event select[name="delete"] option:selected').text(),
        'event':$('input#eventInput').val(),
        'importance':$('.event div#importance-select option:selected').text(),
    }
    return event;
}

function getDeleteData(){
    var event={
        'id':$('.event select[name="delete"] option:selected').val(),
        'select':$('.event select[name="delete"] option:selected').text(),
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

function list_generateDataHtml(data){
    elemnt_html = '';
    for(item of data){
        var data_html = `
        <li class="list-group-item" id='list-${item['id']}'><span class='tag'>${item['id']}</span>${item['event']}</li>
        `
        elemnt_html += data_html;
    }
    return elemnt_html;
}

function list_loadData(data){
    const dataHtml = list_generateDataHtml(data);
    $('div#Todo-List .list-group').append(dataHtml);
}
function getItemFromServer(load){
    
    $.ajax({
        url : API,
        method : 'GET',
        success: function (data){
            load(data);
        },
    })
    
}
function delete_loadData(data){
    const dataHtml = choose_generateDataHtml(data);
    const inner = `<div id="mode-select">
    <select class="custom-select" id="inputGroupSelect02">
      <option selected>Delete</option>
      <option value="1">Add</option>
      <option value="2">Edit</option>
    </select>
  </div>`;
  const outter = `<div class="input-group mb-3" id="user-input">`+`</div>`;
  console.log("delete_loadData #user-input");
    $('.event').append(outter);
    $('#user-input').append(inner+dataHtml);

}
function edit_loadData(data){
    const data_html = choose_generateDataHtml(data);
    const inner = `<div id="mode-select">
    <select class="custom-select" id="inputGroupSelect02">
    <option selected>Edit</option>
    <option value="1">Add</option>
    <option value="2">Delete</option>
    </select>
  </div>`+data_html+`<div class="input-group-append" id="input-block">
  <div class="form-group">
    <input type="event" class="form-control" id="eventInput" placeholder="Enter event" style="width: 400px;">
  </div>
</div>
<div id="importance-select">
  <select class="custom-select" id="inputGroupSelect02">                
      <option selected>Importance</option>
      <option value="1">Very Important</option>
      <option value="2">Normal</option>
      <option value="3">Less Important</option>
  </select>
</div>`;
const outter = `<div class="input-group mb-3" id="user-input"></div>`
$('.event').append(outter);
$('#user-input').append(inner);
console.log('edit_loadData');
}

$('ul.list-group').delegate('li','click',function(e){
    if($(this).attr('class')==='list-group-item disabled'){
        $(this).attr('class','list-group-item');
    }else{
        $(this).attr('class','list-group-item disabled');
    }
})

$('.test2').click(function(e){
    console.log(getInputData());
})

$('.event').on("change","select",function(e){
    var mode = $(this).children('option:selected').text();
    console.log(mode);
    if(mode==='Edit'){
        $('#user-input').remove();
        console.log('else if mode===Edit');
        getItemFromServer(edit_loadData);
    }
    else if(mode === 'Delete'){
        $('#user-input').remove();
        console.log('else if mode===Delete');
        getItemFromServer(delete_loadData);
        
    }
    else if(mode==='Add'){
        $('#user-input').remove();
        $('.event').append(`<div class="input-group mb-3" id="user-input">
        <div id="mode-select">
          <select class="custom-select" id="inputGroupSelect02">
          <option selected>Add</option>
          <option value="1">Edit</option>
          <option value="2">Delete</option>
          </select>
        </div>
        
        <div class="input-group-append" id="input-block">
          <div class="form-group">
            <input type="event" class="form-control" id="eventInput" placeholder="Enter event" style="width: 800px;">
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
      </div>`);
    }
})

function main_list(){
    var data = getItemFromServer(list_loadData);
}

function choose_generateDataHtml(data){
    element_html='<select class="custom-select" id="inputGroupSelect02" name="delete">'+'<option selected>Event</option>';
    for(item of data){
        var data_html=`
        <option value="${item['id']}"><span">${item['id']} </span>${item['event']}</option>
        `
        element_html += data_html;
    }

    return element_html+'</select>';
}
function editInput(){
    var data_html = `
    <div id="mode-select">
              <select class="custom-select" id="inputGroupSelect02">
                <option selected>Mode</option>
                <option value="1">Add</option>
                <option value="2">Edit</option>
                <option value="3">Delete</option>
              </select>
            </div>
    <div class="input-group-append" id="input-block">
              <div class="form-group">
                <input type="event" class="form-control" id="eventInput" placeholder="Enter event" style="width: 800px;">
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
        </div>
    `
  if(document.getElementById('input-block')===null || document.getElementById('importance-select')===null){
      $('#user-input').html(data_html);
  }
}
function PostAddDataToServer(data){
    $ajax({
        url:API,
        method:'POST',
        success:function(){
            
        }
    })
}
main_list();