
    var container;
    var nextId = 0;
    var camera, controls, scene, projector, renderer;
    var objects = [], plane;
    var width = window.innerWidth,
        height = window.innerHeight;
    var current = null;
    var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),INTERSECTED, SELECTED;

    function init()  {
        container = document.getElementById('container');
        var angle = 45, aspect = width / height, near = 0.1, far = 20000;
        camera = new THREE.PerspectiveCamera(angle, aspect , near, far);


        scene = new THREE.Scene();
        scene.add(camera);
        camera.position.set(0,150,400);
        camera.lookAt(scene.position);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.sortObjects = false;
        renderer.setSize(width, height);


        container.appendChild(renderer.domElement);
        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        var light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(-1, -1, -1).normalize();
        scene.add(light);
        var floorTexture = new THREE.ImageUtils.loadTexture( 'images/fl.jpg' );
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set( 10, 10 );
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture } );
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -40;
        floor.rotation.x = - Math.PI/2
        floor.doubleSided = true;
        scene.add(floor);



        plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.25, transparent: true, wireframe: true }));
        plane.visible = false;
        scene.add(plane);

        projector = new THREE.Projector();



        renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
        renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp, false);
        window.addEventListener('resize', this.onWindowResize, false);

    }
    function onWindowResize () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderer.setSize(w, h);

    }

   function onDocumentMouseMove(event) {

        event.preventDefault();
        mouse.x = ((event.clientX - renderer.domElement.offsetLeft)/ renderer.domElement.width) * 2 - 1;
        mouse.y = -((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.height) * 2 + 1;

        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        projector.unprojectVector(vector, camera);

        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());


        if (SELECTED) {

            var intersects = ray.intersectObject(plane);
            SELECTED.position.copy(intersects[0].point.sub(offset));
            return;

        }


        var intersects = ray.intersectObjects(objects);

        if (intersects.length > 0) {

            if (INTERSECTED != intersects[0].object) {

                INTERSECTED = intersects[0].object;
                plane.position.copy(INTERSECTED.position);
                plane.lookAt(camera.position);

            }
            if(INTERSECTED != null) {
            $("#" + objects.indexOf(INTERSECTED)).tooltip().tooltip('open');
            }

            container.style.cursor = 'pointer';

        } else {

            if(INTERSECTED != null) {
                $("#" + objects.indexOf(INTERSECTED)).tooltip('close');
            }
            INTERSECTED = null;
            container.style.cursor = 'auto';

        }

    }

    function onDocumentMouseDown(event) {

        event.preventDefault();

        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        projector.unprojectVector(vector, camera);

        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var intersects = ray.intersectObjects(objects);

        if (intersects.length > 0) {

            controls.enabled = false;

            SELECTED = intersects[0].object;
            current = SELECTED;
            var intersects = ray.intersectObject(plane);
            offset.copy(intersects[0].point).sub(plane.position);

            container.style.cursor = 'move';

        }

    }

    function onDocumentMouseUp(event) {

        event.preventDefault();

        controls.enabled = true;

        if (INTERSECTED) {

            plane.position.copy(INTERSECTED.position);

            SELECTED = null;

        }

        container.style.cursor = 'auto';

    }

    //

    function animate() {

        requestAnimationFrame(animate);

        render();

    }

    function render() {

        controls.update();

        renderer.render(scene, camera);
    }

    function createPainting(texUrl, tooltip) {

        var materialArray = [];
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( texUrl )} ));
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));

        var cubeGeometry = new THREE.CubeGeometry( 85, 85, 1 , 1, 1, 1 );
        var painting = new THREE.Mesh(cubeGeometry,new THREE.MeshFaceMaterial( materialArray ));
        painting.position.set(0, 0, 0);
        //var painting = new Painting(nextId);
        //painting.createObject(texUrl);
        scene.add(painting);
        nextId++;
        objects.push(painting);
        current = painting;
        generateTooltip(current, tooltip);


    }
    function generateTooltip(currentObject, tooltip) {

        $("#container").append('<div id=' + objects.indexOf(currentObject) + ' title=' + '"' + tooltip + '"' + "></div>");

    }
var color = Math.random() * 0xffffff;
var guiScaleConfigData = function() {
    this.scalex = 1.0;
    this.scaley = 1.0;
    this.scalez = 1.0;
    this.wireframe = false;

    };

var guiRotConfigData = function() {
    this.rotationx = 0;
    this.rotationy = 0;
    this.rotationz = 0;

};

var guiPosConfigData = function() {
    this.positionx = -30.0;
    this.positiony = 20.0;
    this.positionz = 0;

};

var guiRoomConfigData = function () {

    this.create = (function() {
        var create_dialog = $('#dialog_window_1').dialog('open');
    });
    this.resetcamera = function () {
        camera.position.set(0,150,400);
        camera.lookAt(scene.position);
        //Will not work because of a bug in controls

    }
    this.room = 'room1';
    this.color1 = [ 0, 128, 255 ];
};


function initGUI() {
    var gui = new dat.GUI();

    var guiPos =  gui.addFolder('Postition');
    var guiRot =  gui.addFolder('Rotation');
    var guiScale =  gui.addFolder('Scale');
    var guiRoom = gui.addFolder('Room');

    var guiPosConfig = new guiPosConfigData();
    var guiRotConfig = new guiRotConfigData();
    var guiScaleConfig = new guiScaleConfigData();
    var guiRoomConfig = new guiRoomConfigData();
    guiPos.open();
    guiRot.open();
    guiScale.open();
    guiRoom.open();
    guiPos.add( guiPosConfig, 'positionx', -70, 70 ).onChange( function(){
        if(current != null){
            current.position.x = (guiPosConfig.positionx);
        }
    });
    guiPos.add( guiPosConfig, 'positiony', 0, 70).onChange( function(){
        if(current != null){
            current.position.y = (guiPosConfig.positiony);
        }
    });

    guiPos.add( guiPosConfig, 'positionz', -70, 70 ).onChange( function(){
        if(current != null){
            current.position.z = (guiPosConfig.positionz);
        }
    });
    guiRot.add( guiRotConfig, 'rotationx', -3.14, 3.14 ).step(0.01).onChange( function(){
        if(current != null){
            current.rotation.x = (guiRotConfig.rotationx);
        }
    });
    guiRot.add( guiRotConfig, 'rotationy', -3.14, 3.14 ).step(0.01).onChange( function(){
        if(current != null){
            current.rotation.y = (guiRotConfig.rotationy);
        }
    });

    guiRot.add( guiRotConfig, 'rotationz', -3.14, 3.14 ).step(0.01).onChange( function(){
        if(current != null){
            current.rotation.z = (guiRotConfig.rotationz);
        }
    });

    guiScale.add( guiScaleConfig, 'scalex', 1 , 10 ).step(0.01).onChange( function(){
        if(current != null){
            current.scale.x = (guiScaleConfig.scalex);
        }
    });
    guiScale.add( guiScaleConfig, 'scaley', 1 , 10 ).step(0.01).onChange( function(){
        if(current != null){
            current.scale.y = (guiScaleConfig.scaley);
        }
    });

    guiScale.add( guiScaleConfig, 'scalez', 1 , 10 ).step(0.01).onChange( function(){
        if(current != null){
            current.scale.z = (guiScaleConfig.scalez);
        }
    });
    guiScale.add(guiScaleConfig, 'wireframe', false).onChange( function (){
      if(current != null){
            current.material.wireframe = (guiScaleConfig.wireframe);
        }
    });
    guiRoom.add(guiRoomConfig,'create');
    guiRoom.add(guiRoomConfig,'resetcamera');
    guiRoom.add(guiRoomConfig, 'room', ['room1','room2', 'room3']).onChange( function () {
        loadJSONObj();
    });
    guiRoom.addColor(guiRoomConfig,'color1').onChange( function () {
    //TODO

    });
}

function loadJSONObj(roomName) {

    var loader = new THREE.JSONLoader();

    loader.load('models/test.js', function ( geometry ) {
        var room = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
        room.scale.set(10,10,10);
        room.position.x = 0;
        room.position.y = 0;
        room.position.z = 0;
        scene.add(room);

    });
}

function dec2hex(i) {
  var result = "0x000000";
  if (i >= 0 && i <= 15) { result = "0x00000" + i.toString(16); }
  else if (i >= 16 && i <= 255) { result = "0x0000" + i.toString(16); }
  else if (i >= 256 && i <= 4095) { result = "0x000" + i.toString(16); }
  else if (i >= 4096 && i <= 65535) { result = "0x00" + i.toString(16); }
  else if (i >= 65535 && i <= 1048575) { result = "0x0" + i.toString(16); }
  else if (i >= 1048575 ) { result = '0x' + i.toString(16); }
  //console.log(result);
 return result
}


    //guiBox3.addColor( box3Config, 'color1', color ).onChange( function() {
// console.log( box3Config.color1 );
  //box3.material.color.setHex( dec2hex(box3Config.color1) );
  //box3.material.ambient.setHex( dec2hex(box3Config.color1) );
//} );

function Painting(id) {

this.id = id;
this.objectMesh;

}


Painting.prototype.createObject = function (texUrl) {
    var materialArray = [];
    materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
    materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
    materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
    materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( texUrl )} ));
    materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));

    var cubeGeometry = new THREE.CubeGeometry( 85, 85, 1 , 1, 1, 1 );
    this.objectMesh = new THREE.Mesh(cubeGeometry,new THREE.MeshFaceMaterial( materialArray ));
    this.objectMesh.position.set(0, 0, 0);

}
Painting.prototype.hash = function () {
    return this.id;
}
Painting.prototype.ObjectInstance = function () {
    return this.objectMesh;
}

function postit(url, data, callbackFunction) {

    $.ajax({
        url: url,
        type: 'POST',
        processData: false,
        contentType: false,
        datatype: 'json',
        data: data,
        success: function (response) {
            callbackFunction(response.url, response.tooltip);
        },
        error: function (){}
    });
}


$(document).ready(function() {
    $('#dialog_window_1').dialog({
            width: 'auto',
            height: 'auto',
            autoOpen : false,
            buttons:
                {
                    "Create": function() {
                        var dialog = $(this);
                        $(this).submit();
                        $("#new_window_content").val("");
                        dialog.dialog('close');

                    }
                }
    });

    $('#dialog_window_1').submit(function () {
        var fd = new FormData();
        fd.append('file', $("#fileUpload").get(0).files[0]);
        fd.append('desc', $("#formContent").val());
        postit('/file', fd, createPainting);
        return false;
    });


    init();
    initGUI();
    animate();
});



