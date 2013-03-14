

    var cursor_tools = {
                ROTATE: 1,
                MOVE: 2
            };
    var container;
    var camera, controls, scene, projector, renderer;
    var objects = [], plane;
    var width = window.innerWidth;
    var height = window.innerHeight;

    var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),INTERSECTED, SELECTED;

    function init()  {
        container = document.getElementById('container');
        var angle = 45, aspect = this.width / this.height, near = 0.1, far = 20000;
        camera = new THREE.PerspectiveCamera(angle, aspect , near, far);


        scene = new THREE.Scene();
        scene.add(camera);
        camera.position.set(0,150,400);
        camera.lookAt(scene.position);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.sortObjects = false;
        renderer.setSize(this.width, this.height);


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
        floor.position.y = -0.5;
        floor.rotation.x = - Math.PI/2
        floor.doubleSided = true;
        scene.add(floor);



        plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.25, transparent: true, wireframe: true }));
        plane.visible = true;
        scene.add(plane);

        projector = new THREE.Projector();



        renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
        renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp, false);

       // window.addEventListener('resize', this.onWindowResize, false);

    }
// DaArt.prototype.onWindowResize = function() {
    //    var w = window.innerWidth;
     //   var h = window.innerHeight;
      //  camera.aspect = w / h;
       // camera.updateProjectionMatrix();

        //renderer.setSize(w, h);

    //}
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

            container.style.cursor = 'pointer';

        } else {


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

    function createPainting(texUrl) {

        var materialArray = [];
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( texUrl ) }));
        materialArray.push(new THREE.MeshBasicMaterial( { color: 0xc0c0c0 }));

        var cubeGeometry = new THREE.CubeGeometry( 85, 85, 1 , 1, 1, 1 );
        var painting = new THREE.Mesh(cubeGeometry,new THREE.MeshFaceMaterial( materialArray ));
        painting.position.set(-60, 50, -100);

        scene.add(painting);
        objects.push(painting);


    }

$(document).ready(function() {

        var choice = cursor_tools.MOVE;

        $( "#load" ).button({
            text: false,
            icons: {
            primary: "ui-icon-folder-open"
        }

        })
         .click(function() {
            var create_dialog = $('#dialog_window_1');
            var create_button = $(this);
            if( create_dialog.dialog('isOpen') ) {
                create_button.button('option', 'icons', {primary: "ui-icon-folder-open"});
                create_dialog.dialog('close');
            } else {
                create_button.button('option', 'icons', {primary: "ui-icon-closethick"});
                create_dialog.dialog('open');
            }
        });

        $( "#save" ).button({
            text: false,
            icons: {
            primary: "ui-icon-disk"
            }
        });
        $( "#rotate" ).button({
            text: false,
            icons: {
            primary: "ui-icon-arrowrefresh-1-e"
            }
        })
        .click(function() {
            choice = cursor_tools.ROTATE;
            alert(choice);


        });
        $( "#move" ).button({
            text: false,
            icons: {
            primary: "ui-icon-arrow-4"
            }
        })
        .click(function() {
            choice = cursor_tools.MOVE;
            alert(choice);
        });


        $('#dialog_window_1').dialog({
            width: 'auto',
            height: 'auto',
            autoOpen : false,
            buttons: [
                {
                    text: 'Create',
                    click: function() {
                        var button = $("#load");
                        var dialog = $(this);
                        createPainting("images/ml.jpg");
                        button.button('option','icons', {primary: "ui-icon-folder-open"});
                        dialog.dialog('close');

                                }
                        }]

                    });
        init();
        animate();
    });

