/* =====================================================
   CITY DRIVE 3D
   GTA-STYLE ORIGINAL BROWSER PROTOTYPE
===================================================== */

let scene;
let camera;
let renderer;

let car;
let checkpoint;

let traffic = [];
let npcs = [];
let buildings = [];

let clock = new THREE.Clock();

let started = false;

let speed = 0;
let maxSpeed = 0.65;

let health = 100;
let money = 500;
let wanted = 0;

let missionComplete = false;

let keys = {};

let cameraAngle = 0;
let cameraDistance = 10;

let dayTime = 0;


/* =====================================================
   INITIALIZATION
===================================================== */

function init() {

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x73b9ff);

    scene.fog =
        new THREE.Fog(
            0x73b9ff,
            80,
            350
        );


    /* CAMERA */

    camera =
        new THREE.PerspectiveCamera(
            60,
            window.innerWidth /
            window.innerHeight,
            0.1,
            1000
        );

    camera.position.set(
        0,
        7,
        12
    );


    /* RENDERER */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true
        });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    document
        .getElementById("game")
        .appendChild(renderer.domElement);


    /* LIGHT */

    createLights();


    /* WORLD */

    createGround();

    createRoadNetwork();

    createCity();

    createTrees();

    createStreetLights();

    createTraffic();

    createNPCs();

    createPlayerCar();

    createCheckpoint();


    /* EVENTS */

    window.addEventListener(
        "resize",
        resize
    );

    setupKeyboard();

    setupMouse();

    setupMobile();

    animate();
}


/* =====================================================
   LIGHTING
===================================================== */

function createLights() {

    const ambient =
        new THREE.HemisphereLight(
            0x99ccff,
            0x304020,
            1.2
        );

    scene.add(ambient);


    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );

    sun.position.set(
        80,
        150,
        60
    );

    sun.castShadow = true;

    sun.shadow.mapSize.width = 2048;

    sun.shadow.mapSize.height = 2048;

    sun.shadow.camera.left = -200;
    sun.shadow.camera.right = 200;
    sun.shadow.camera.top = 200;
    sun.shadow.camera.bottom = -200;

    scene.add(sun);

    window.sunLight = sun;
}


/* =====================================================
   GROUND
===================================================== */

function createGround() {

    const geometry =
        new THREE.PlaneGeometry(
            600,
            600
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x3d7733,
            roughness: 1
        });

    const ground =
        new THREE.Mesh(
            geometry,
            material
        );

    ground.rotation.x =
        -Math.PI / 2;

    ground.receiveShadow = true;

    scene.add(ground);
}


/* =====================================================
   ROADS
===================================================== */

function createRoadNetwork() {

    const roadMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x242424,
            roughness: .9
        });


    /* Main roads */

    for (
        let x = -120;
        x <= 120;
        x += 60
    ) {

        const road =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    18,
                    .08,
                    300
                ),
                roadMaterial
            );

        road.position.set(
            x,
            .04,
            0
        );

        road.receiveShadow = true;

        scene.add(road);
    }


    for (
        let z = -120;
        z <= 120;
        z += 60
    ) {

        const road =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    300,
                    .08,
                    18
                ),
                roadMaterial
            );

        road.position.set(
            0,
            .04,
            z
        );

        road.receiveShadow = true;

        scene.add(road);
    }


    /* Road markings */

    const lineMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });


    for (
        let x = -120;
        x <= 120;
        x += 60
    ) {

        for (
            let z = -145;
            z < 145;
            z += 12
        ) {

            const line =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .35,
                        .09,
                        5
                    ),
                    lineMaterial
                );

            line.position.set(
                x,
                .1,
                z
            );

            scene.add(line);
        }
    }


    for (
        let z = -120;
        z <= 120;
        z += 60
    ) {

        for (
            let x = -145;
            x < 145;
            x += 12
        ) {

            const line =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        5,
                        .09,
                        .35
                    ),
                    lineMaterial
                );

            line.position.set(
                x,
                .1,
                z
            );

            scene.add(line);
        }
    }
}


/* =====================================================
   CITY BUILDINGS
===================================================== */

function createCity() {

    const colors = [
        0x526273,
        0x687989,
        0x836d62,
        0x4f5968,
        0x777777,
        0x5b6e70
    ];


    for (
        let x = -150;
        x <= 150;
        x += 30
    ) {

        for (
            let z = -150;
            z <= 150;
            z += 30
        ) {

            /* Don't put buildings on roads */

            if (
                Math.abs(x % 60) < 15 ||
                Math.abs(z % 60) < 15
            ) {
                continue;
            }


            const width =
                18 + Math.random() * 7;

            const depth =
                18 + Math.random() * 7;

            const height =
                12 + Math.random() * 45;


            const geometry =
                new THREE.BoxGeometry(
                    width,
                    height,
                    depth
                );


            const material =
                new THREE.MeshStandardMaterial({
                    color:
                        colors[
                            Math.floor(
                                Math.random() *
                                colors.length
                            )
                        ],

                    roughness: .8
                });


            const building =
                new THREE.Mesh(
                    geometry,
                    material
                );


            building.position.set(
                x +
                    (Math.random() * 5 - 2.5),

                height / 2,

                z +
                    (Math.random() * 5 - 2.5)
            );


            building.castShadow = true;

            building.receiveShadow = true;


            scene.add(building);

            buildings.push(building);


            createWindows(
                building,
                width,
                height,
                depth
            );
        }
    }
}


/* =====================================================
   BUILDING WINDOWS
===================================================== */

function createWindows(
    building,
    width,
    height,
    depth
) {

    const windowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x8dd8ff
        });


    for (
        let y = 4;
        y < height - 2;
        y += 5
    ) {

        for (
            let i = -1;
            i <= 1;
            i++
        ) {

            const w =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        1.5,
                        2,
                        .12
                    ),
                    windowMaterial
                );

            w.position.set(
                building.position.x +
                i * 5,

                y,

                building.position.z -
                depth / 2 -
                .08
            );

            scene.add(w);
        }
    }
}


/* =====================================================
   TREES
===================================================== */

function createTrees() {

    for (
        let i = 0;
        i < 80;
        i++
    ) {

        const x =
            (Math.random() - .5) *
            280;

        const z =
            (Math.random() - .5) *
            280;


        if (
            Math.abs(x % 60) < 14 ||
            Math.abs(z % 60) < 14
        ) {
            continue;
        }


        createTree(x, z);
    }
}


function createTree(x, z) {

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                .5,
                .7,
                5,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0x6b3f20
            })
        );

    trunk.position.set(
        x,
        2.5,
        z
    );

    trunk.castShadow = true;

    scene.add(trunk);


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                3.2,
                10,
                10
            ),

            new THREE.MeshStandardMaterial({
                color: 0x176b32
            })
        );

    leaves.position.set(
        x,
        7,
        z
    );

    leaves.castShadow = true;

    scene.add(leaves);
}


/* =====================================================
   STREET LIGHTS
===================================================== */

function createStreetLights() {

    for (
        let x = -120;
        x <= 120;
        x += 60
    ) {

        for (
            let z = -140;
            z <= 140;
            z += 30
        ) {

            createLamp(
                x + 10,
                z
            );
        }
    }
}


function createLamp(x, z) {

    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                .15,
                .2,
                7,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0x222222
            })
        );

    pole.position.set(
        x,
        3.5,
        z
    );

    pole.castShadow = true;

    scene.add(pole);


    const bulb =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .35,
                10,
                10
            ),

            new THREE.MeshBasicMaterial({
                color: 0xffffcc
            })
        );

    bulb.position.set(
        x,
        7,
        z
    );

    scene.add(bulb);


    const light =
        new THREE.PointLight(
            0xffdd99,
            .8,
            25
        );

    light.position.set(
        x,
        7,
        z
    );

    scene.add(light);
}


/* =====================================================
   PLAYER CAR
===================================================== */

function createPlayerCar() {

    car =
        new THREE.Group();


    /* Body */

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                .75,
                4.5
            ),

            new THREE.MeshStandardMaterial({
                color: 0xd71920,
                metalness: .45,
                roughness: .25
            })
        );

    body.position.y =
        1;

    body.castShadow = true;

    car.add(body);


    /* Cabin */

    const cabin =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.9,
                .8,
                2.1
            ),

            new THREE.MeshStandardMaterial({
                color: 0x101820,
                metalness: .3,
                roughness: .2
            })
        );

    cabin.position.set(
        0,
        1.6,
        -.25
    );

    cabin.castShadow = true;

    car.add(cabin);


    /* Wheels */

    const wheelGeometry =
        new THREE.CylinderGeometry(
            .48,
            .48,
            .35,
            20
        );

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x090909,
            roughness: .8
        });


    const wheelPositions = [
        [-1.25, .55, -1.45],
        [1.25, .55, -1.45],
        [-1.25, .55, 1.45],
        [1.25, .55, 1.45]
    ];


    wheelPositions.forEach(
        position => {

            const wheel =
                new THREE.Mesh(
                    wheelGeometry,
                    wheelMaterial
                );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                position[0],
                position[1],
                position[2]
            );

            wheel.castShadow = true;

            car.add(wheel);
        }
    );


    /* Headlights */

    const headlightMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffdd
        });


    [-.7, .7].forEach(
        x => {

            const light =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .35,
                        .2,
                        .08
                    ),
                    headlightMaterial
                );

            light.position.set(
                x,
                1.05,
                -2.27
            );

            car.add(light);
        }
    );


    car.position.set(
        0,
        0,
        10
    );


    scene.add(car);
}


/* =====================================================
   TRAFFIC
===================================================== */

function createTraffic() {

    for (
        let i = 0;
        i < 15;
        i++
    ) {

        const vehicle =
            createTrafficCar();


        const horizontal =
            Math.random() > .5;


        vehicle.userData.horizontal =
            horizontal;


        if (horizontal) {

            vehicle.position.set(
                -150 +
                    Math.random() * 300,

                0,

                Math.random() > .5
                    ? 8
                    : -8
            );

        } else {

            vehicle.position.set(
                Math.random() > .5
                    ? 8
                    : -8,

                0,

                -150 +
                    Math.random() * 300
            );
        }


        vehicle.userData.speed =
            .15 +
            Math.random() * .2;


        scene.add(vehicle);

        traffic.push(vehicle);
    }
}


function createTrafficCar() {

    const group =
        new THREE.Group();


    const colors = [
        0x0066cc,
        0xffcc00,
        0xffffff,
        0x222222,
        0x00aa66
    ];


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2,
                .7,
                4
            ),

            new THREE.MeshStandardMaterial({
                color:
                    colors[
                        Math.floor(
                            Math.random() *
                            colors.length
                        )
                    ],

                metalness: .4,
                roughness: .4
            })
        );


    body.position.y =
        .8;

    body.castShadow = true;

    group.add(body);


    const cabin =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                .65,
                1.8
            ),

            new THREE.MeshStandardMaterial({
                color: 0x18252e
            })
        );


    cabin.position.y =
        1.45;

    group.add(cabin);


    return group;
}


/* =====================================================
   NPCs
===================================================== */

function createNPCs() {

    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const npc =
            new THREE.Group();


        const body =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    .35,
                    1,
                    4,
                    8
                ),

                new THREE.MeshStandardMaterial({
                    color:
                        Math.random() >
                        .5
                            ? 0x3366cc
                            : 0xcc3333
                })
            );


        body.position.y =
            1;

        body.castShadow = true;

        npc.add(body);


        const head =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    .32,
                    12,
                    12
                ),

                new THREE.MeshStandardMaterial({
                    color: 0xc98b6b
                })
            );


        head.position.y =
            2;

        head.castShadow = true;

        npc.add(head);


        npc.position.set(
            (Math.random() - .5) * 250,
            0,
            (Math.random() - .5) * 250
        );


        npc.userData.direction =
            Math.random() *
            Math.PI *
            2;


        npc.userData.speed =
            .015 +
            Math.random() * .025;


        scene.add(npc);

        npcs.push(npc);
    }
}


/* =====================================================
   MISSION CHECKPOINT
===================================================== */

function createCheckpoint() {

    checkpoint =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                5,
                .35,
                12,
                40
            ),

            new THREE.MeshBasicMaterial({
                color: 0xffcc00
            })
        );


    checkpoint.rotation.x =
        Math.PI / 2;


    checkpoint.position.set(
        100,
        .4,
        -100
    );


    scene.add(checkpoint);
}


/* =====================================================
   KEYBOARD
===================================================== */

function setupKeyboard() {

    window.addEventListener(
        "keydown",
        event => {

            keys[
                event.key.toLowerCase()
            ] = true;


            if (
                event.code ===
                "Space"
            ) {

                keys.space = true;
            }
        }
    );


    window.addEventListener(
        "keyup",
        event => {

            keys[
                event.key.toLowerCase()
            ] = false;


            if (
                event.code ===
                "Space"
            ) {

                keys.space = false;
            }
        }
    );
}


/* =====================================================
   MOUSE CAMERA
===================================================== */

function setupMouse() {

    let mouseDown = false;

    let previousX = 0;


    renderer.domElement.addEventListener(
        "mousedown",
        e => {

            mouseDown = true;

            previousX =
                e.clientX;
        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            mouseDown = false;
        }
    );


    window.addEventListener(
        "mousemove",
        e => {

            if (!mouseDown)
                return;


            const difference =
                e.clientX -
                previousX;


            cameraAngle -=
                difference *
                .005;


            previousX =
                e.clientX;
        }
    );
}


/* =====================================================
   MOBILE
===================================================== */

function setupMobile() {

    const buttons = {
        forward: "w",
        left: "a",
        right: "d",
        brake: "s"
    };


    Object.keys(buttons).forEach(
        id => {

            const button =
                document.getElementById(id);


            button.addEventListener(
                "touchstart",
                e => {

                    e.preventDefault();

                    keys[
                        buttons[id]
                    ] = true;
                }
            );


            button.addEventListener(
                "touchend",
                e => {

                    e.preventDefault();

                    keys[
                        buttons[id]
                    ] = false;
                }
            );
        }
    );
}


/* =====================================================
   CAR MOVEMENT
===================================================== */

function updateCar(delta) {

    if (!started)
        return;


    /* Accelerate */

    if (keys.w) {

        speed +=
            .025;

    } else if (keys.s) {

        speed -=
            .04;

    } else {

        speed *=
            .96;
    }


    speed =
        THREE.MathUtils.clamp(
            speed,
            -.3,
            maxSpeed
        );


    /* Steering */

    if (
        Math.abs(speed) >
        .02
    ) {

        if (keys.a) {

            car.rotation.y +=
                .035 *
                (speed / maxSpeed);
        }


        if (keys.d) {

            car.rotation.y -=
                .035 *
                (speed / maxSpeed);
        }
    }


    /* Move forward */

    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );


    direction.applyQuaternion(
        car.quaternion
    );


    car.position.add(
        direction.multiplyScalar(
            speed
        )
    );


    /* World boundary */

    car.position.x =
        THREE.MathUtils.clamp(
            car.position.x,
            -285,
            285
        );

    car.position.z =
        THREE.MathUtils.clamp(
            car.position.z,
            -285,
            285
        );


    /* Speed display */

    const kmh =
        Math.abs(speed) *
        180;


    document
        .getElementById("speed")
        .textContent =
        Math.floor(kmh);
}


/* =====================================================
   TRAFFIC UPDATE
===================================================== */

function updateTraffic() {

    traffic.forEach(
        vehicle => {

            const s =
                vehicle.userData.speed;


            if (
                vehicle.userData
                    .horizontal
            ) {

                vehicle.position.x +=
                    s;

                if (
                    vehicle.position.x >
                    160
                ) {

                    vehicle.position.x =
                        -160;
                }

            } else {

                vehicle.position.z +=
                    s;

                if (
                    vehicle.position.z >
                    160
                ) {

                    vehicle.position.z =
                        -160;
                }
            }


            checkCollision(
                vehicle
            );
        }
    );
}


/* =====================================================
   NPC UPDATE
===================================================== */

function updateNPCs() {

    npcs.forEach(
        npc => {

            const direction =
                npc.userData.direction;


            npc.position.x +=
                Math.cos(direction) *
                npc.userData.speed;


            npc.position.z +=
                Math.sin(direction) *
                npc.userData.speed;


            if (
                npc.position.x >
                150 ||
                npc.position.x <
                -150
            ) {

                npc.userData.direction =
                    Math.PI -
                    direction;
            }


            if (
                npc.position.z >
                150 ||
                npc.position.z <
                -150
            ) {

                npc.userData.direction =
                    -direction;
            }
        }
    );
}


/* =====================================================
   COLLISION
===================================================== */

function checkCollision(vehicle) {

    const distance =
        car.position.distanceTo(
            vehicle.position
        );


    if (
        distance < 3.2 &&
        Math.abs(speed) > .05
    ) {

        health -= .3;

        speed *= -.25;

        wanted =
            Math.min(
                5,
                wanted + 1
            );


        updateHUD();


        if (
            health <= 0
        ) {

            health = 0;

            gameOver();
        }
    }
}


/* =====================================================
   MISSION
===================================================== */

function updateMission() {

    if (missionComplete)
        return;


    checkpoint.rotation.z +=
        .025;


    const distance =
        car.position.distanceTo(
            checkpoint.position
        );


    if (
        distance < 7
    ) {

        missionComplete = true;

        money += 1000;

        wanted = 0;

        document
            .getElementById(
                "missionStatus"
            )
            .textContent =
            "COMPLETED ✓";


        showMessage(
            "MISSION COMPLETE! +$1000"
        );


        checkpoint.visible =
            false;


        updateHUD();
    }
}


/* =====================================================
   WANTED SYSTEM
===================================================== */

function updateWanted() {

    if (
        wanted > 0 &&
        Math.random() < .001
    ) {

        wanted--;

        updateHUD();
    }
}


/* =====================================================
   DAY / NIGHT
===================================================== */

function updateDayNight(delta) {

    dayTime +=
        delta * .01;


    const cycle =
        (Math.sin(dayTime) + 1) / 2;


    const skyColor =
        new THREE.Color();


    skyColor.setHSL(
        .58,
        .55,
        .15 +
            cycle * .5
    );


    scene.background =
        skyColor;


    scene.fog.color =
        skyColor;


    if (window.sunLight) {

        window.sunLight.intensity =
            .3 +
            cycle * 1.7;
    }
}


/* =====================================================
   CAMERA
===================================================== */

function updateCamera() {

    if (!car)
        return;


    const offset =
        new THREE.Vector3(
            Math.sin(cameraAngle) *
                cameraDistance,

            6,

            Math.cos(cameraAngle) *
                cameraDistance
        );


    const desiredPosition =
        car.position.clone()
            .add(offset);


    camera.position.lerp(
        desiredPosition,
        .08
    );


    const lookAt =
        car.position.clone();


    lookAt.y += 1.5;


    camera.lookAt(
        lookAt
    );
}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    document
        .getElementById("health")
        .textContent =
        Math.max(
            0,
            Math.floor(health)
        );


    document
        .getElementById("money")
        .textContent =
        money;


    document
        .getElementById("wanted")
        .textContent =
        "★".repeat(wanted) +
        "☆".repeat(5 - wanted);
}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(text) {

    const message =
        document.getElementById(
            "message"
        );


    message.textContent =
        text;


    message.style.opacity =
        "1";


    setTimeout(
        () => {

            message.style.opacity =
                "0";

        },
        3000
    );
}


/* =====================================================
   GAME OVER
===================================================== */

function gameOver() {

    started = false;

    showMessage(
        "GAME OVER"
    );


    setTimeout(
        () => {

            location.reload();

        },
        2500
    );
}


/* =====================================================
   START GAME
===================================================== */

document
    .getElementById(
        "startButton"
    )
    .addEventListener(
        "click",
        () => {

            started = true;

            document
                .getElementById(
                    "startScreen"
                )
                .style.display =
                "none";


            showMessage(
                "Mission started!"
            );
        }
    );


/* =====================================================
   RESIZE
===================================================== */

function resize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}


/* =====================================================
   GAME LOOP
===================================================== */

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    updateCar(delta);

    updateTraffic();

    updateNPCs();

    updateMission();

    updateWanted();

    updateDayNight(delta);

    updateCamera();

    updateHUD();


    renderer.render(
        scene,
        camera
    );
}


/* =====================================================
   START ENGINE
===================================================== */

init();