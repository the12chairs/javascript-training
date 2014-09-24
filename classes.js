/**
 * IE7 trick
 * @param Child
 * @param Parent
 */
function inherit(Child, Parent)
{
    var F = function () { };
    F.prototype = Parent.prototype;
    var f = new F();

    for (var prop in Child.prototype) f[prop] = Child.prototype[prop];
    Child.prototype = f;
    Child.prototype.super = Parent.prototype;
}

/**
 * Parent class
 * @param name
 * @param speed
 * @param capacity
 * @constructor
 */
function Vehicle(name, speed, capacity){

    //validate data

    if(typeof(name) != 'string')
        throw new Error('Name must have string type!');
    if(typeof(speed) != 'number')
        throw new Error('Speed must have integer type!');
    if(typeof(capacity) != 'number')
        throw new Error('Capacity must have integer type!');

    // no table for 'abstract' class
    this.tblName = '';
    this.table = null;

    this.name = name;
    this.speed = speed;
    this.capacity = capacity;
}

/**
 * Get table name and set object
 */
Vehicle.prototype.getPlace = function(){
    if(this.tblName == ''){
        throw new Error('Empty table name!');
    }
    this.table = document.getElementById(this.tblName);
    if(this.table === null){
        throw new Error('Cant find table with id: ' + this.tblName);
    }
};



// Children

/**
 *
 * @param name
 * @param speed
 * @param capacity
 * @param body
 * @constructor
 */
function Automobile(name, speed, capacity, body){
    if(typeof(body) != 'string')
        throw new Error('Body must have string type!');
    Vehicle.apply(this, arguments);
    this.tblName = 'tbl_auto';
    this.body = body;

}
/**
 * Insert Automobile row into table
 */
Automobile.prototype.insertRow = function(){
    this.table.innerHTML +=
        '<tr>' +
            '<td>'+this.name+'</td>'+
            '<td>'+this.speed+'</td>'+
            '<td>'+this.capacity+'</td>'+
            '<td>'+this.body+'</td>'+
        '</tr>';

};

inherit(Automobile, Vehicle);


/**
 *
 * @param name
 * @param speed
 * @param capacity
 * @param wingspan
 * @constructor
 */
function Airplane(name, speed, capacity, wingspan){
    if(typeof(wingspan) != 'number')
        throw new Error('Wingspan must have integer type!');
    Vehicle.apply(this, arguments);
    this.tblName = 'tbl_air';
    this.wingspan = wingspan;
}
/**
 * Insert Airplane row into table
 */
Airplane.prototype.insertRow = function () {
    this.table.innerHTML +=
        '<tr>' +
            '<td>' + this.name + '</td>' +
            '<td>' + this.speed + '</td>' +
            '<td>' + this.capacity + '</td>' +
            '<td>' + this.wingspan + '</td>' +
        '</tr>';

};
inherit(Airplane, Vehicle);

/**
 *
 * @param name
 * @param speed
 * @param capacity
 * @param mPower
 * @constructor
 */
function Boat(name, speed, capacity, mPower){
    Vehicle.apply(this,arguments);
    this.tblName = 'tbl_boat';
    this.mPower = mPower;

}
/**
 * Insert Boat row into table
 */
Boat.prototype.insertRow = function(){
    this.table.innerHTML +=
        '<tr>' +
            '<td>'+this.name+'</td>'+
            '<td>'+this.speed+'</td>'+
            '<td>'+this.capacity+'</td>'+
            '<td>'+this.mPower+'</td>'+
        '</tr>';

};
inherit(Boat, Vehicle);

// JSON parse

/**
 * Load JSON file from server
 * @param path
 * @param success
 * @param error
 */
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

    /**
     * Main func, creating 3 data arrays and filling tables
     * @param data
     */
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



// Some kind of unit-tests

function testIsHaveTblName(){
    var boat = new Boat('name', 100, 10, 1000);

    if(boat.tblName == '')
        throw new Error('* FAILED *  --- ' +arguments.callee.name);
    else
        throw new Error('* PASSED * --- '+ arguments.callee.name);
}

function testIsHaveTable(){
    var boat = new Boat('name', 100, 10, 1000);

    if(boat.table === null)
        throw new Error('* FAILED *  --- ' +arguments.callee.name);
    else
        throw new Error('* PASSED * --- '+ arguments.callee.name);
}


lalka = new Boat(100,12,23,45);
//testIsHaveTblName();
//testIsHaveTable();