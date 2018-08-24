const Debug_Mode = false;
const BASE_URL = window.location.origin;
const API = BASE_URL + "/record";

function preventReload(e){
    if(Debug_Mode){
        e.preventDefault();
    }
}
function importance(){
    var imt = 0;
    const __importance = $('.event div#importance-select option:selected').text();

    if(__importance===`Very Important`){
        imt = 3;
    }else if(__importance === `Normal`){
        imt = 2;
    }else if (__importance===`Less Important`){
        imt = 1;
    }
    return imt;
}
function getAddData(){
    const imt = importance();
    var event = {
        'event':$('input#eventInput').val(),
        'importance':imt,
        'completed':"f",
    }
    return event;
}

function getEditData(){
    var imt = importance();
    var event={
        'id':$('.event select[name="delete"] option:selected').val(),
        'select':$('.event select[name="delete"] option:selected').text(),
        'event':$('input#eventInput').val(),
        'importance':imt,
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
        if(item['importance']===3){
            var data_html = `
            <li class="list-group-item" id='list-${item['id']}' value="${item['id']}"completed = "${item['completed']}" importance="${item['importance']}"><span class='tag' completed = "${item['completed']}"><b>${item['id']} ${item['event']}</b></span></li>
            `
        }else if(item['importance']===2 || item['importance'] ===0){
            var data_html = `
            <li class="list-group-item" id='list-${item['id']}' value="${item['id']}"completed = "${item['completed']}" importance="${item['importance']}"><span class='tag' completed = "${item['completed']}">${item['id']} ${item['event']}</span></li>
            `
        }else if(item['importance']===1){
            var data_html = `
            <li class="list-group-item disabled" id='list-${item['id']}' value="${item['id']}"completed = "${item['completed']}" importance="${item['importance']}"><span class='tag' completed = "${item['completed']}">${item['id']} ${item['event']}</span></li>
            `
        }
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
    <input type="event" class="form-control" id="eventInput" placeholder="Enter event" style="width: 300px;">
  </div>
</div>
<div id="importance-select">
  <select class="custom-select" id="inputGroupSelect02">                
      <option selected>Normal</option>
      <option value="1">Very Important</option>
      <option value="2">Less Important</option>
  </select>
</div>
`;
const outter = `<div class="input-group mb-3" id="user-input"></div>`
$('.event').append(outter);
$('#user-input').append(inner);
}

$('ul.list-group').delegate('li','click',function(e){
    if($(this).children('span').attr('completed') === 't'){
        $(this).attr('completed','f');
        $(this).children('span').attr('completed','f')
    }else{
        $(this).children('span').attr('completed','t')
        $(this).attr('completed','t');
    }

    const sendData = {
        'completed':$(this).attr('completed'),
    }
    const ID = $(this).attr('value')
    $.ajax({
        url:`${API}/${ID}`,
        method:'PUT',
        data:sendData,
        success:function(data){
            console.log(data);
        }
    })
})

$('.event').on("change","select",function(e){
    var mode = $(this).children('option:selected').text();
    console.log(mode);
    if(mode==='Edit'){
        $('#user-input').remove();
        getItemFromServer(edit_loadData);
    }
    else if(mode === 'Delete'){
        $('#user-input').remove();
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
            <input type="event" class="form-control" id="eventInput" placeholder="Enter event">
          </div>
        </div>
        <div id="importance-select">
          <select class="custom-select" id="inputGroupSelect02">                
              <option selected>Normal</option>
              <option value="1">Very Important</option>
              <option value="2">Less Important</option>
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
        <option value="${item['id']}" class = "${item['completed']}"><span">${item['id']} </span>${item['event']}</option>
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
                <input type="event" class="form-control" id="eventInput" placeholder="Enter event">
              </div>
            </div>
            <div id="importance-select">
              <select class="custom-select" id="inputGroupSelect02">                
                  <option selected>Normal</option>
                  <option value="1">Very Important</option>
                  <option value="2">Less Important</option>
              </select>
            </div>
        </div>
    `
  if(document.getElementById('input-block')===null || document.getElementById('importance-select')===null){
      $('#user-input').html(data_html);
  }
}

function PostAddDataToServer(inputdata){
    $.ajax({
        url:API,
        method:'POST',
        data:inputdata,
        success:function(data){
            console.log(data);
        }
    })
}

$('#CRUD').click(function(e){
    preventReload(e);
    const mode = $('.event div#mode-select option:selected').text();
    

    if(mode==='Add'&&$('input#eventInput').val()!=""){
        const data = getAddData();
        
        console.log(data);
        PostAddDataToServer(data);
    }else if(mode==='Edit'&&$('input#eventInput').val()!=""){
        const editData = getEditData();
        console.log(editData);
        putEditData(editData);
    }else if(mode==='Delete'){
        const delData = getDeleteData();
        console.log(delData);
        deleteData(delData['id']);
    }
})

$('.test2').click(function(e){
    var data = getAddData();
    console.log('test2');
    console.log(data);
    alert();
    PostAddDataToServer(data);
})

function putEditData(newData){
    const editId = newData['id'];
    const sendData = {
        'event':newData['event'],
        'importance':newData['importance'],
        'completed':newData['completed'],
    }
    $.ajax({
        url:`${API}/${editId}`,
        method:'PUT',
        data:sendData,
        success:function(data){
            console.log(data);
        }
    })
}

function deleteData(deleteId){
    $.ajax({
        url:`${API}/${deleteId}`,
        method:'DELETE',
        success:function(){
            console.log(deleteId)
        }
    })
}
$('#test').click(function(e){
    const event = $('input#eventInput')
    console.log(event);
    alert(event.val());
    const data = getAddData();
        alert("if add");
        console.log(data);
})

$('button#show').click(function(e){
    var list;
    list = document.querySelectorAll('ul#main-list li')
    for(remain of list){
        remain.remove();
    }
    main_list();
})
$('button#hide').click(function(e){
completedList = document.querySelectorAll('li[completed="t"]')
for(li of completedList){
    li.remove();
}
})


main_list();
