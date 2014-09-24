// IE7 trick
function inherit(Child, Parent)
{
    var F = function () { };
    F.prototype = Parent.prototype;
    var f = new F();

    for (var prop in Child.prototype) f[prop] = Child.prototype[prop];
    Child.prototype = f;
    Child.prototype.super = Parent.prototype;
}

// Parent class
function Vehicle(name, speed, capacity){

    // no table for 'abstract' class
    this.tblName = '';
    this.table = null;

    this.name = name;
    this.speed = speed;
    this.capacity = capacity;
}

Vehicle.prototype.getPlace = function(){
    this.table = document.getElementById(this.tblName);
}



// Children
function Automobile(name, speed, capacity, body){
    Vehicle.apply(this, arguments);
    this.tblName = 'tbl_auto';
    this.body = body;

}

Automobile.prototype.insertRow = function(){
    this.table.innerHTML +=
        '<tr>' +
            '<td>'+this.name+'</td>'+
            '<td>'+this.speed+'</td>'+
            '<td>'+this.capacity+'</td>'+
            '<td>'+this.body+'</td>'+
        '</tr>';

}

inherit(Automobile, Vehicle);



function Airplane(name, speed, capacity, wingspan){
    Vehicle.apply(this, arguments);
    this.tblName = 'tbl_air';
    this.wingspan = wingspan;
}

Airplane.prototype.insertRow = function(){
    this.table.innerHTML +=
        '<tr>' +
            '<td>'+this.name+'</td>'+
            '<td>'+this.speed+'</td>'+
            '<td>'+this.capacity+'</td>'+
            '<td>'+this.wingspan+'</td>'+
            '</tr>';

}
inherit(Airplane, Vehicle);

function Boat(name, speed, capacity, mPower){
    Vehicle.apply(this,arguments);
    this.tblName = 'tbl_boat';
    this.mPower = mPower;

}
Boat.prototype.insertRow = function(){
    this.table.innerHTML +=
        '<tr>' +
            '<td>'+this.name+'</td>'+
            '<td>'+this.speed+'</td>'+
            '<td>'+this.capacity+'</td>'+
            '<td>'+this.mPower+'</td>'+
            '</tr>';

}
inherit(Boat, Vehicle);

// JSON parse

function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText)); // Not sure about IE7... Am I need a custom parser?
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}



loadJSON('vehicles.json',
    function(data) {

        var boats = [];
        var autos = [];
        var planes = [];

        // Fill objects arrays
        for(var i = 0; i < data.length; i++){
            var ven = data[i];
            switch(ven.type){
                case 'boat':
                    boats.push(new Boat(ven.name, ven.speed, ven.capacity, ven.mPower));
                    break;
                case 'auto':
                    autos.push(new Automobile(ven.name, ven.speed, ven.capacity, ven.body));
                    break;
                case 'airplane':
                    planes.push(new Airplane(ven.name, ven.speed, ven.capacity, ven.wingspan));
                    break;
                default:
                    alert('JSON data error!');
                    return;
            }
        }

        // Fill HTML tables with arrays values

        for(var i = 0; i < autos.length; i++){
            autos[i].getPlace();
            autos[i].insertRow();
        }
        for(var i = 0; i < boats.length; i++){
            boats[i].getPlace();
            boats[i].insertRow();
        }
        for(var i = 0; i < planes.length; i++){
            planes[i].getPlace();
            planes[i].insertRow();
        }

        console.log(data); },
    function(xhr) { console.error(xhr); }
);

