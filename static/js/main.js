var canvas = new fabric.Canvas('canvas');
var objcounter = 0;
var objs = [];
var csvdata = [];
var alignvariable = "not";


function checkemptycanvas() {
    if (canvas.getObjects().length == 0) {
        return true;
    } else {
        return false;
    }
}

function addcertificate() {
    var certificate = document.getElementById('certificate');
    if (certificate.files.length <= 0) {
        alert("No Certificate Selected");
    } else {

        // canvas.clear();
        // document.getElementById('fields').innerHTML = '';

        certificate.addEventListener('change', handleImage, false);

        function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.onload = function () {
                    var f_img = new fabric.Image(img);
                    canvas.setBackgroundImage(f_img);
                    canvas.renderAll();
                    canvas.setDimensions({width: img.width, height: img.height});
                };
                img.src = event.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }
}

function deleteallobjects() {
    var obj = canvas.getObjects();
    for (i = 0; i < obj.length; i++) {
        canvas.remove(obj[i]);
    }
    objs = [];
}

// var csvfilename = '';
function readcsv(input) {

    var l = String(input.value).split('.');
    var extension = l[l.length - 1].toLowerCase();
    if (extension != 'csv') {
        alert("Only CSV files are compatible");
        input.value = '';
        document.getElementById('fields').innerHTML = '';
    } else {
        // csvfilename = String(input.value).replace(/.*(\/|\\)/, '');
        // csvfilename = csvfilename.split('.')[0];
        deleteallobjects();
        var file = input.files[0];
        var reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
            csvdata = $.csv.toArrays(reader.result)
            displaydatafield(csvdata);
            settingsbodydata(csvdata);
            // document.getElementById('settingsbtn').click();
            $('#settings').modal('show')
        };

        reader.onerror = function () {
            console.log(reader.error);
        };
    }
}

canvas.on('selection:cleared', function (options) {

    $('#editfield').fadeOut();


})
canvas.on('selection:created', function (options) {
    $('#editfield').fadeIn();


})

function changeFontStyle(fontvalue) {
    var obj = canvas.getActiveObject();
    obj.fontFamily = fontvalue;
    canvas.renderAll();
}

function changeFontColor(colorvalue) {
    var obj = canvas.getActiveObject();
    obj.set({fill: colorvalue})
    canvas.renderAll();
}

function settingsbodydata(csvdata) {
    var headings = csvdata[0];
    var output = document.getElementById('settingsbody');
    var temp = '<table style="color:white !important;" class="table table-bordered">';

    var indexoffname = 0;
    var indexofpersonname = 0;
    if (emailquestion == true) {
        var indexofemail = 0;
        temp += '<tr>' +
            '<th></th>' +
            '<th>Filename</th>' +
            '<th>Email Field</th>' +
            '<th>Name Field</th>' +
            '</tr>';
    } else {
        temp += '<tr>' +
            '<th></th>' +
            '<th>Filename</th>' +
            '<th>Name Field</th>' +
            '</tr>';
    }


    for (i = 0; i < headings.length; i++) {
        if (emailquestion == true) {
            temp += '<tr>' +
                '<td><span>' + headings[i] + '</span></td>' +

                '<td><input type="radio" name="filenamefield" id=' + indexoffname + ' value=' + indexoffname + ' oninput="setfieldvalues(this.name);"></td>' +
                '<td><input type="radio" name="emailfield" id=' + indexofemail + ' value=' + indexofemail + ' oninput="setfieldvalues(this.name);"></td>' +
                '<td><input type="radio" name="namefield" id=' + indexofpersonname + ' value=' + indexofpersonname + ' oninput="setfieldvalues(this.name);"></td>' +

                '</tr>';
            indexofemail += 1;
            indexoffname += 1;
            indexofpersonname += 1;
        } else {
            temp += '<tr>' +
                '<td><span>' + headings[i] + '</span></td>' +

                '<td><input type="radio" name="filenamefield" id=' + indexoffname + ' value=' + indexoffname + ' oninput="setfieldvalues(this.name);"></td>' +

                '<td><input type="radio" name="namefield" id=' + indexofpersonname + ' value=' + indexofpersonname + ' oninput="setfieldvalues(this.name);"></td>' +

                '</tr>';
            indexoffname += 1;
            indexofpersonname += 1;
        }

    }
    temp += '</table>';
    output.innerHTML = temp;

}

function savesettings() {
    if (emailquestion == '') {
        if (filenameindex == '' || namefieldindex == '') {
            alert("Select All Fields");
        } else {
            alert("Settings Saved");
            $('#settings').modal('hide');
        }
    } else {
        if ((filenameindex != '' || namefieldindex != '') && emailfieldindex == '') {
            alert("No email field there?");
        } else if (filenameindex == '' || namefieldindex == '' || emailfieldindex == '') {
            alert("Select All Fields");
        } else {
            alert("Settings Saved");
            $('#settings').modal('hide');
        }
    }

}

function displaydatafield(csvdata) {
    var headings = csvdata[0];
    var fields = document.getElementById('fields');
    var temp = '<table>';
    var btnids = '', deleteids = '';

    for (i = 0; i < headings.length; i++) {
        btnids = headings[i] + 'btn';
        deleteids = headings[i] + 'deletebtn';
        temp += '<tr>' +
            '<td><span>' + headings[i] + '</span></td>' +
            '<td><button type="button" class="btn btn-light" id="' + btnids + '" onclick=\"addtext(\'' + headings[i] + '\'),disablebutton(this.id)\"><img style="height:1.2rem;" src="static/icons/add.png" alt="Add"></button></td>' +
            '<td><button type="button" disabled class="btn btn-danger" id="' + deleteids + '" onclick=\"deletetext(\'' + headings[i] + '\'),enablebutton(this.id)\"><img style="height:1.2rem;filter:invert(1);" src="static/icons/delete.png" alt="Delete"></button></span></td>' +
            '</tr>';
    }
    temp += '</table>';
    fields.innerHTML = temp;
}

function disablebutton(btnid) {
    if (checkemptycanvas()) {
        document.getElementById('generatecertificatebtn').disabled = true;
    } else {
        document.getElementById('generatecertificatebtn').disabled = false;
    }
    document.getElementById(btnid).disabled = true;
    document.getElementById(btnid.slice(0, btnid.length - 3) + 'deletebtn').disabled = false;
}

function enablebutton(deleteid) {
    if (checkemptycanvas()) {
        document.getElementById('generatecertificatebtn').disabled = true;
    } else {
        document.getElementById('generatecertificatebtn').disabled = false;
    }
    document.getElementById(deleteid).disabled = true;
    document.getElementById(deleteid.slice(0, deleteid.length - 9) + 'btn').disabled = false;
}

function deletetext(textval) {
    for (i = 0; i < objs.length; i++) {
        if (objs[i].text == textval) {
            selectobject(objs[i].id);
            deleteSelectedObject();
            objs = canvas.getObjects();
        }
    }
}

function selectobject(elid) {
    for (i = 0; i < objs.length; i++) {
        if (objs[i].id == elid) {
            canvas.item(i).set({
                borderColor: 'black',
                cornerColor: 'red',
                cornerSize: 30,
                transparentCorners: false
            });
            canvas.setActiveObject(canvas.item(i));
        }
    }
}

function deleteSelectedObject() {
    canvas.remove(canvas.getActiveObject());
}

function alignit() {
    // var activeObj = canvas.getActiveObject();
    canvas.getActiveObject().centerH();
    canvas.getActiveObject().setCoords();
    canvas.renderAll();
    // console.log(activeObj)
    // // activeObj.width=2000;
    // var centerX=activeObj.getCenterPoint()['x'];
    // var centerY=activeObj.getCenterPoint()['y'];

    // console.log(eval(String((canvas.width/2)-centerX)))

    // activeObj.set({ width: 2000 });
    // activeObj.setCoords()
    // canvas.renderAll()
    // console.log(canvas.width/2);
    // console.log(canvas.height);
}

function setAlign(align, canvas) {
    let activeObj = canvas.getActiveObject(),
        horizontalCenter = (activeObj.width * activeObj.scaleX) / 2,
        verticalCenter = (activeObj.height * activeObj.scaleY) / 2,
        {width, height} = canvas

    switch (align) {
        case 'top':
            activeObj.set({top: verticalCenter})
            break
        case 'left':
            activeObj.set({left: horizontalCenter})
            break
        case 'bottom':
            activeObj.set({top: height - verticalCenter})
            break
        case 'right':
            activeObj.set({left: width - horizontalCenter})
            break
        case 'center':
            activeObj.set({left: (width / 2)})
            break
        case 'middle':
            activeObj.set({top: (height / 2)})
            break
    }

    activeObj.setCoords()
    canvas.renderAll()
}

function makeqr() {
    var qrcode = new QRCode("qrcode");
    qrcode.makeCode(text);
    var c = document.getElementById('qrcode').querySelector('canvas');

    var dataurl = c.toDataURL();
    return dataurl;
}

function addQR() {
    var dataurl = "data:image/png;base64,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";

    fabric.Image.fromURL(dataurl, function (myImg) {
        var img1 = myImg.set({
            top: canvas.height / 2,
            left: canvas.width / 2,
            id: 'qrobject'
        });
        canvas.add(img1);
        objs = canvas.getObjects();
    });

}

function changeQRurl(text) {
    $('#qrcode').qrcode(text);
    var c = document.getElementById('qrcode').querySelector('canvas');
    var dataurl = c.toDataURL();

    var obj = canvas.getActiveObject();
    obj.setSrc(dataurl, function () {
        canvas.renderAll();
        // obj.setCoords();
    });
}

function addtext(defaulttext) {
    var n = new fabric.Text(defaulttext, {
        fontFamily: 'Delicious_500',
        fill: 'black',
        fontSize: 90,
        top: canvas.height / 2,
        left: canvas.width / 2,
        textAlign: "center",
        id: objcounter
    });
    objcounter++;

    canvas.add(n);

    canvas.item(canvas.getObjects().length - 1).set({
        borderColor: 'black',
        cornerColor: 'red',
        cornerSize: 30,
        transparentCorners: false
    });
    canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
    objs = canvas.getObjects();
}

function changeText(newtext) {
    var obj = canvas.getActiveObject();
    obj.text = newtext;
    canvas.renderAll();
}

function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);

    $('#login').modal('hide');
}
function showhidepassword() {
    var el=document.getElementById('password');
    if(el.type=='password')
        el.type='text';
    else
        el.type='password';
}

var zip = new JSZip();

// var data = [];
function generateCertificates() {
    var useremail = sessionStorage.getItem('email');
    var userpassword = sessionStorage.getItem('password');
    if (useremail == null && userpassword == null) {
        $('#login').modal('show');
    } else {

        loader('show');
        setTimeout(function () {
            var fname = '';
            var emailname = '';
            var personname = '';
            var folder = zip.folder('certificates');
            var objids = [];
            var n = 0;

            var objslength = objs.length;
            for (var i = 0; i < objslength; i++) {
                var obj = {"id": objs[i].id, "value": objs[i].text};
                objids.push(obj);
            }
            var csvdatalength = csvdata.length;
            var objidslength = objids.length;

            var flag = 0;
            for (o = 1; o < csvdatalength; o++) {
                flag = 0;
                for (i = 0; i < objidslength; i++) {
                    for (j = 0; j < csvdata[0].length; j++) {
                        if (j == filenameindex) {
                            fname = csvdata[o][j];
                        }
                        if (j == emailfieldindex) {
                            emailname = csvdata[o][j];
                        }
                        if (j == namefieldindex) {
                            personname = csvdata[o][j];
                        }
                        if (objids[i]['value'] == csvdata[0][j]) {
                            flag = 1;
                            canvas.setActiveObject(canvas.item(objids[i]['id']));
                            changeText(csvdata[o][j]);
                            if (alignvariable == 'center') {
                                alignit('center');
                            }
                        }
                    }
                }
                if (flag == 1) {
                    // add to zip folder
                    var c = document.getElementById('canvas');
                    canvas.discardActiveObject().renderAll();
                    var datauri = c.toDataURL();
                    var imgd = datauri.split(';base64,')[1]
                    folder.file(`${fname}.png`, imgd, {base64: true});
                    if (emailfieldindex != '' && emailquestion != '') {
                        senddatatoserver({
                            "name": personname,
                            "filename": `${fname}.png`,
                            "certificatedata": imgd,
                            "email": emailname,
                            "useremail":useremail,
                            "userpassword":userpassword
                        });
                    }
                    n++;
                    console.log(n + " certificate generated")
                }

            }

            // save file
            loader('hide');
            $('#downloadmodal').modal('show');
        }, 1000);
    }
}

function downloadzip() {
    zip.generateAsync({type: "blob"})
        .then(function (content) {
            // see FileSaver.js
            saveAs(content, "getCertified.zip");
            // deleteallobjects();
        });
}

function loader(action) {
    var body = document.getElementsByTagName("body");
    var head = document.getElementsByTagName("head");
    switch (action) {
        case 'show':
            var style = document.createElement('style');
            var div = document.createElement("div");
            var css = ".sk-chase {\n" +
                "            width: 40px;\n" +
                "            height: 40px;\n" +
                "            position: relative;\n" +
                "            animation: sk-chase 2.5s infinite linear both;\n" +
                "        }\n" +
                "\n" +
                "        .sk-chase-dot {\n" +
                "            width: 100%;\n" +
                "            height: 100%;\n" +
                "            position: absolute;\n" +
                "            left: 0;\n" +
                "            top: 0;\n" +
                "            animation: sk-chase-dot 2.0s infinite ease-in-out both;\n" +
                "        }\n" +
                "\n" +
                "        .sk-chase-dot:before {\n" +
                "            content: '';\n" +
                "            display: block;\n" +
                "            width: 25%;\n" +
                "            height: 25%;\n" +
                "            background-color: #fff;\n" +
                "            border-radius: 100%;\n" +
                "            animation: sk-chase-dot-before 2.0s infinite ease-in-out both;\n" +
                "        }\n" +
                "\n" +
                "        .sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }\n" +
                "        .sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }\n" +
                "        .sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }\n" +
                "        .sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }\n" +
                "        .sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }\n" +
                "        .sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }\n" +
                "        .sk-chase-dot:nth-child(1):before { animation-delay: -1.1s; }\n" +
                "        .sk-chase-dot:nth-child(2):before { animation-delay: -1.0s; }\n" +
                "        .sk-chase-dot:nth-child(3):before { animation-delay: -0.9s; }\n" +
                "        .sk-chase-dot:nth-child(4):before { animation-delay: -0.8s; }\n" +
                "        .sk-chase-dot:nth-child(5):before { animation-delay: -0.7s; }\n" +
                "        .sk-chase-dot:nth-child(6):before { animation-delay: -0.6s; }\n" +
                "\n" +
                "        @keyframes sk-chase {\n" +
                "            100% { transform: rotate(360deg); }\n" +
                "        }\n" +
                "\n" +
                "        @keyframes sk-chase-dot {\n" +
                "            80%, 100% { transform: rotate(360deg); }\n" +
                "        }\n" +
                "\n" +
                "        @keyframes sk-chase-dot-before {\n" +
                "            50% {\n" +
                "                transform: scale(0.4);\n" +
                "            } 100%, 0% {\n" +
                "                  transform: scale(1.0);\n" +
                "              }\n" +
                "        }"
            style.type = 'text/css';
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            div.id = "loader";
            div.style.cssText = "position: fixed;\n" +
                "            z-index:5000;\n" +
                "            width: 100%;\n" +
                "            height: 100%;\n" +
                "            background: rgba(4,4,4,0.8);";
            div.innerHTML = '<div style="margin:auto;\n' +
                '            position: absolute;\n' +
                '            top:46%;\n' +
                '            left:46%;">\n' +
                '<div class="sk-chase">\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '</div>' +
                '<div style="text-align:center;color:white;" id="total"></div>' +
                '    </div>'
            head[0].appendChild(style);
            body[0].prepend(div);
            break;
        case 'hide':
            body[0].removeChild(document.getElementById('loader'));
            head[0].removeChild(head[0].lastChild);
            break;
    }
}

function setpositions() {
    if (document.querySelector('#setpositions').checked) {
        alignvariable = "center";
    } else {
        alignvariable = "not";
    }
}

var emailquestion = '';

function emailsendcheck() {
    if (document.querySelector('#emailquestion').checked) {
        emailquestion = true;
    } else {
        emailquestion = false;
        emailfieldindex = '';
    }
    settingsbodydata(csvdata);
}


var filenameindex = '';
var emailfieldindex = '';
var namefieldindex = '';

function setfieldvalues(nameoffield) {
    if (nameoffield == 'namefield')
        namefieldindex = $("input[type='radio'][name='namefield']:checked").val();
    else if (nameoffield == 'emailfield') {
        emailfieldindex = $("input[type='radio'][name='emailfield']:checked").val();
    } else if (nameoffield == 'filenamefield') {
        filenameindex = $("input[type='radio'][name='filenamefield']:checked").val();
    }
}


function viewcsvdata() {
    if (csvdata.length != 0) {
        $('#data').addClass('databackground');
        document.getElementById('data').style.display = "block";

        var output = document.querySelector('.csvdata');
        var temp = '';
        temp += '<table class="table bg-light">' +
            '<thead>' +
            '<tr>' +
            `<th scope="col">Serial No. </th>`;
        for (i = 0; i < csvdata[0].length; i++) {
            temp += `<th scope="col">${csvdata[0][i]}</th>`;
        }
        temp += '</tr>' +
            '</thead>';

        temp += '<tbody>';
        for (i = 1; i < csvdata.length; i++) {
            temp += '<tr>';
            temp += `<th scope="row">${i}</th>`;
            for (j = 0; j < csvdata[i].length; j++) {
                temp += `<td>${csvdata[i][j]}</td>`;
            }
            temp += '</tr>'
        }
        temp += '</tbody>' +
            '</table>';

        output.innerHTML = temp;
    }
}

function fonts() {
    fontsarray = [
        'Abadi MT Condensed Light', 'Aharoni', 'Aharoni Bold', 'Aldhabi', 'AlternateGothic2 BT', 'Andale Mono', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Aparajita', 'Apple Chancery', 'Arabic Typesetting', 'Arial', 'Arial Black', 'Arial narrow', 'Arial Nova', 'Arial Rounded MT Bold', 'Arnoldboecklin', 'Avanta Garde',
        'Bahnschrift', 'Bahnschrift Light', 'Bahnschrift SemiBold', 'Bahnschrift SemiLight', 'Baskerville', 'Batang', 'BatangChe', 'Big Caslon', 'BIZ UDGothic', 'BIZ UDMincho Medium', 'Blippo', 'Bodoni MT', 'Book Antiqua', 'Bookman', 'Bradley Hand', 'Browallia New', 'BrowalliaUPC', 'Brush Script MT', 'Brush Script Std', 'Brushstroke',
        'certificatename','Calibri', 'Calibri Light', 'Calisto MT', 'Cambodian', 'Cambria', 'Cambria Math', 'Candara', 'Century Gothic', 'Chalkduster', 'Cherokee', 'Comic Sans', 'Comic Sans MS', 'Consolas', 'Constantia', 'Copperplate', 'Copperplate Gothic Light', 'Copperplate Gothic Bold', 'Corbel', 'Cordia New', 'CordiaUPC', 'Coronetscript', 'Courier', 'Courier New',
        'DaunPenh', 'David', 'DengXian', 'DFKai-SB', 'Didot', 'DilleniaUPC', 'DokChampa', 'Dotum', 'DotumChe',
        'Ebrima', 'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia',
        'FangSong', 'Florence', 'Franklin Gothic Medium', 'FrankRuehl', 'FreesiaUPC', 'Futara',
        'Gabriola', 'Gadugi', 'Garamond', 'Gautami', 'Geneva', 'Georgia', 'Georgia Pro', 'Gill Sans', 'Gill Sans Nova', 'Gisha', 'Goudy Old Style', 'Gulim', 'GulimChe', 'Gungsuh', 'GungsuhChe',
        'Hebrew', 'Hoefler Text', 'HoloLens MDL2 Assets',
        'Impact', 'Ink Free', 'IrisUPC', 'Iskoola Pota', 'Japanese', 'JasmineUPC', 'Javanese Text', 'Jazz LET',
        'KaiTi', 'Kalinga', 'Kartika', 'Khmer UI', 'KodchiangUPC', 'Kokila', 'Korean',
        'Lao', 'Lao UI', 'Latha', 'Leelawadee', 'Leelawadee UI', 'Leelawadee UI Semilight', 'Levenim MT', 'LilyUPC', 'Lucida Bright', 'Lucida Console', 'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode', 'Lucidatypewriter', 'Luminari',
        'Malgun Gothic', 'Malgun Gothic Semilight', 'Mangal', 'Marker Felt', 'Meiryo', 'Meiryo UI', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft JhengHei UI', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft YaHei UI', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'MingLiU-ExtB', 'Miriam', 'Monaco', 'Mongolian Baiti', 'MoolBoran', 'MS Gothic', 'MS Mincho', 'MS PGothic', 'MS PMincho', 'MS UI Gothic', 'MV Boli', 'Myanmar Text',
        'Narkisim', 'Neue Haas Grotesk Text Pro', 'New Century Schoolbook', 'News Gothic MT', 'Nirmala UI', 'No automatic language associations', 'Noto', 'NSimSun', 'Nyala',
        'Oldtown', 'Optima',
        'Palatino', 'Palatino Linotype', 'papyrus', 'Parkavenue', 'Perpetua', 'Plantagenet Cherokee', 'PMingLiU',
        'Raavi', 'Rockwell', 'Rockwell Extra Bold', 'Rockwell Nova', 'Rockwell Nova Cond', 'Rockwell Nova Extra Bold', 'Rod',
        'Sakkal Majalla', 'Sanskrit Text', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Historic', 'Segoe UI Symbol', 'Shonar Bangla', 'Shruti', 'SimHei', 'SimKai', 'Simplified Arabic', 'Simplified Chinese', 'SimSun', 'SimSun-ExtB', 'Sitka', 'Snell Roundhan', 'Stencil Std', 'Sylfaen', 'Symbol',
        'Tahoma', 'Thai', 'Times New Roman', 'Traditional Arabic', 'Traditional Chinese', 'Trattatello', 'Trebuchet MS', 'Tunga',
        'Utsaah',
        'Vani', 'Verdana', 'Verdana Pro', 'Vijaya', 'Vrinda',
        'Yu Gothic', 'Yu Gothic UI', 'Yu Mincho',
        'Zapf Chancery'
    ]

    var list = document.getElementById('fonts');

    fontsarray.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item;
        list.appendChild(option);
    });
}

function senddatatoserver(datajson) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (JSON.parse(this.responseText)['msg'] == 'success') {
                document.getElementById('emailsendshow').innerHTML += "Email sent to " + datajson['name'] + '<br>';
            } else if (JSON.parse(this.responseText) == 'failed') {
                document.getElementById('emailsendshow').innerHTML += "<span class='badge badge-danger'>Email not sent to " + datajson['name'] + '</span><button type="button" onclick="'+sendtoserver(datajson)+'" class="btn btn-danger">Send Again</button><br>';
                failed.push(datajson);
            }

        }
    };
    xhttp.open("POST", "sendemail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(datajson));
}