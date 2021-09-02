import userObject from './ls.js';
var isFullscreen = false;
var elem = '';

$( document ).ready( function () {
    $( '#Logoutbtn' ).click( function () {
        userObject.removeCurrentUser();
        $.ajax( {
            type: "POST",
            url: "/api/user/logout",
            data: {},
        } );
        location.href = "/";
    } );
    $( "#app" ).hide();//timer id hiding

    var createquiz = false
    var cnt = 1
    var quizlength = 0
    var quiz_Code = ''


    // Author Tab

    $( '#createquiz' ).click( function () {
        createquiz = true
        if ( createquiz == true ) {
            $( "#created" ).hide();
            //$("#quizform").show();
            var defhtml = `<div class="form-group" id="qname"><label for="quizname" class="form-label mt-4">Quiz Name</label><input type="text" class="form-control" id="quizname" aria-describedby="emailHelp" placeholder="Enter Quiz Name"></div><div class="form-group" id="qdur"><label for="quizname" class="form-label mt-4">Quiz Duration</label><input type="number" value="5" min="0" step="5" class="form-control" id="quizduration" aria-describedby="emailHelp" placeholder="Enter Quiz Duration"></div><div id="1"><div class="form-group" ><label for="question1" class="form-label mt-4">Question 1</label><input id="1question" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter Question"></div><div class="form-group" ><label for="quizname" class="form-label mt-4">Options</label><input  type="text" class="form-control" id="1opt1" aria-describedby="emailHelp" placeholder="Enter Option 1"></div>
            <div class="form-group" >&nbsp;
            <input type="text" class="form-control" id="1opt2" aria-describedby="emailHelp" placeholder="Enter Option 2">
          </div>
          <div class="form-group" >&nbsp;
            <input type="text" class="form-control" id="1opt3" aria-describedby="emailHelp" placeholder="Enter Option 3">
          </div>
          <div class="form-group" >&nbsp;
            <input type="text" class="form-control" id="1opt4" aria-describedby="emailHelp" placeholder="Enter Option 4">
          </div>
          <div class="form-group">
            <label for="crctoption" class="form-label mt-4">Select the Correct Option</label>
            <select class="form-select" id="1crctoption">
              <option >1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
        
          <hr>
        </div>`;


            // $( "#forminner" ).html( '' );
            $( "#forminner" ).html( defhtml );
            $( "#quizform" ).show();
            $( "#terminals" ).show();
            $( '#createquiz' ).hide();
        }
    } );
    $( '#addquestion' ).click( function () {

        cnt++;
        var z = document.createElement( 'div' ); // is a node
        z.innerHTML = '<div id=' + cnt + '><div class="form-group" > <label for="question1" class="form-label mt-4">Question ' + cnt + '</label><input type="text" id="' + cnt + 'question" class="form-control" aria-describedby="emailHelp" placeholder="Enter Question"></div><div class="form-group" ><label for="quizname" class="form-label mt-4">Options</label> <input type="text" class="form-control" id="' + cnt + 'opt1" aria-describedby="emailHelp" placeholder="Enter Option 1"> </div><div class="form-group"  >&nbsp;<input type="text" class="form-control" id="' + cnt + 'opt2" aria-describedby="emailHelp" placeholder="Enter Option 2"></div><div class="form-group">&nbsp;<input type="email" class="form-control" id="' + cnt + 'opt3" aria-describedby="emailHelp" placeholder="Enter Option 3"></div><div class="form-group" >&nbsp; <input type="email" class="form-control" id="' + cnt + 'opt4" aria-describedby="emailHelp" placeholder="Enter Option 4"></div><div class="form-group"  ><label for="crctoption" class="form-label mt-4">Select the Correct Option</label><select class="form-select" id="' + cnt + 'crctoption"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><hr></div>';
        //document.body.appendChild(z);
        document.getElementById( 'forminner' ).appendChild( z );
    } );
    $( '#deletequestion' ).click( function () {

        $( '#' + cnt ).remove()
        cnt--;
    } );
    $( '#clearquiz' ).click( function () {

        location.href = "/dashboard";
    } );
    $( "#submitquestion" ).click( function () {
        //var quizobj={quizName:'',author:'',questions:[],quizDuration:''};
        var quizName = $( "#quizname" ).val();
        var quizDuration = parseInt( $( "#quizduration" ).val() );
        var author = userObject.getCurrentUserId();
        var questions = [];
        console.log( cnt );
        for ( var i = 1; i <= cnt; i++ ) {       //var quesobj={description:'',options:[],correctAnswer:0};
            var description = $( '#' + i + "question" ).val();
            var correctAnswer = parseInt( $( '#' + i + "crctoption" ).val() );
            //console.log(quesobj.correctAnswer);
            var opt = [];
            for ( var j = 1; j <= 4; j++ ) {
                var optval = $( "#" + i + "opt" + j ).val();
                opt.push( optval );
            }
            var quesobj = {description: description, correctAnswer: correctAnswer, options: opt};
            //quesobj.options=opt;
            questions.push( quesobj );
        }
        var quizobj = {quizName: quizName, quizDuration: quizDuration, author: author, questions: JSON.stringify( questions )};
        //quizobj.questions=questions;  
        console.log( quizobj );

        $.ajax( {
            type: "POST",
            url: '/dashboard/api/quiz/create',
            data: quizobj,
            success: function ( data ) {
                if ( data.success ) {
                    $( window ).scrollTop( 0 );
                    console.log( "inserted" );
                    console.log( data.quizCode );
                    // $("#quizform").hide();
                    $( "#quizform" ).hide();
                    $( "#terminals" ).hide();
                    $( "#quizcreatedid" ).html( `Quiz Code :  <cpy data-bs-toggle="tooltip" data-bs-placement="top" title="Copy">${data.quizCode}</cpy>` );
                    $( "#created" ).show();
                    $( "#quizid-okbutton" ).show();
                }
                else
                    toastr.error( data.error );
            },
        } );


    } );

    $( "#quizid-okbutton" ).click( function () {
        $( "#created" ).hide();
        $( "#quizid-okbutton" ).hide();
        $( "#createquiz" ).show();
    } );




    // Participate Tab

    $( '#participatequiz' ).click( function () {
        $( "#q-name" ).hide();
        $( "#participatequiz" ).hide();
        $( "#inst-block" ).show();
    } );

    $( "#start-quiz" ).click( function () {
        $( "#inst-block" ).hide();
        $( "#q-name" ).hide();

        var quizCode = $( "#quizid" ).val();
        //console.log(quizCode);  
        //$("#quizsubmitform").html('');
        $.ajax( {
            method: 'GET',
            url: `/dashboard/api/quiz/${quizCode}`,
            //data:quizCode,
            success: function ( data ) {
                if ( data.success ) {
                    console.log( data.quiz );
                    console.log( data.quiz.quizName );
                    //console.log(data.quiz.questions.length);
                    $( "#app" ).show();
                    var duration = data.quiz.quizDuration;
                    timer( duration );
                    quizlength = data.quiz.questions.length;
                    quiz_Code = data.quiz._id;
                    $( "#quiztitle" ).html( data.quiz.quizName );
                    var quizquestionsobj = data.quiz.questions;
                    for ( var k = 0; k < quizquestionsobj.length; k++ ) {
                        var c = k + 1;
                        var quesattempting = quizquestionsobj[k].description;
                        var optattempting = quizquestionsobj[k].options;
                        var quizques = document.createElement( 'div' );
                        $( quizques ).attr( 'style', 'padding-left : 8%' );
                        quizques.innerHTML = `
                                        <div class="card border-primary mb-3" style="max-width: 80%;" id="${c}-set">
                                        <div class="card-header" id="${c}-dispquestion">${c}Q)  ${quesattempting}</div>
                                        <div class="card-body">
                                        <div class="form-check">
                                            <label class="form-check-label">
                                            <input type="radio" class="form-check-input" name="${c}-question" id="${c}-option1" value="1" >
                                            ${optattempting[0]}
                                            </label>
                                        </div>
                                        <div class="form-check">
                                        <label class="form-check-label">
                                            <input type="radio" class="form-check-input" name="${c}-question" id="${c}-option2" value="2">
                                            ${optattempting[1]}
                                        </label>
                                        </div>
                                        <div class="form-check">
                                            <label class="form-check-label">
                                            <input type="radio" class="form-check-input" name="${c}-question" id="${c}-option3" value="3">
                                            ${optattempting[2]}
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <label class="form-check-label">
                                            <input type="radio" class="form-check-input" name="${c}-question" id="${c}-option4" value="4">
                                            ${optattempting[3]}
                                            </label>
                                        </div>
                                        </div>
                                </div>`;

                        document.getElementById( 'quizsubmitform' ).appendChild( quizques );
                    }
                    //full screen functionality
                    $( "#quizsubmitform" ).show();
                    $( "#submitquizbutton" ).show();
                    $( "#participatequiz" ).hide();
                    elem = document.getElementById( "full-screen" );
                    openFullscreen( elem );
                    $( "#full-screen" ).show();

                }
                else
                    toastr.error( data.error );
            }
        } )


    } );

    $( "#submitquizbutton" ).click( function () {
        //$("#participatequiz").hide();
        $( "#app" ).hide();
        var responses = [];
        //console.log(quizlength);
        for ( var y = 1; y <= quizlength; y++ ) {
            var tempobj = $( `input[name='${y}-question']:checked` ).val();

            if ( tempobj == undefined )
                tempobj = 0;


            responses.push( parseInt( tempobj ) );
        }
        console.log( responses );
        $.ajax( {
            type: "POST",
            url: '/dashboard/api/quiz/submit',
            data: {quizCode: quiz_Code, responses: JSON.stringify( responses )},
            success: function ( data ) {
                if ( data.success ) {
                    console.log( data.marks );
                    toastr.success( "Quiz Submitted Sucessfully " );
                    exitFullscreen();
                    isFullscreen = false;
                    $( "#marks" ).html( data.marks );
                    $( "#marks_declaration" ).show();
                    $( "#marksokbutton" ).show();
                    $( "#q-name" ).hide();
                    // $("#quizidlabel").hide();
                    // $("#quizid").hide();
                    //$("#quizid").val('');

                }
                else {
                    toastr.error( data.error );
                    $( "#q-name" ).show();
                    $( "#quizid" ).val( '' );
                    $( "#participatequiz" ).show();
                }
            },
        } );
        $( "#quiztitle" ).html( '' );
        $( "#quizsubmitform" ).html( '' );
        $( "#submitquizbutton" ).hide();
        // $("#q-name").show();
        // $("#participatequiz").show();
        // $("#quizid").val('');


    } );
    $( "#marksokbutton" ).click( function () {

        $( "#q-name" ).show();
        $( "#quizid" ).val( '' );
        $( "#participatequiz" ).show();
        $( "#marks" ).html( '' );
        $( "#marksokbutton" ).hide();
        $( "#marks_declaration" ).hide();


    } );

    //Leader Board Tab


    var leaderboard_functionality = function () {

        var quizzesParticipatedId = userObject.getCurrentUserId();

        $.ajax( {
            method: 'GET',
            url: `/dashboard/api/quiz/participated/${quizzesParticipatedId}`,
            success: function ( data ) {
                if ( data.success ) {
                    var qarray = data.quizDetails;

                    console.log( "quizzes received" );
                    console.log( qarray );
                    for ( var qz = qarray.length - 1; qz >= 0; qz-- ) {
                        var qid = qz + 1;
                        //console.log()
                        var quizofuser = document.createElement( 'div' );
                        quizofuser.classList.add( "col" );
                        quizofuser.classList.add( "span_1_of_3" );
                        quizofuser.innerHTML = `
                                    <div class="card  border-primary bg-light mb-3"  style="max-width: 23rem;" >
                                    <div class="card-header">Quiz Code : <cpy data-bs-toggle="tooltip" data-bs-placement="top" title="Copy">${qarray[qz]._id}</cpy></div>
                                    <div class="card-body"  >
                                      <h4 class="card-title">${qarray[qz].quizName}</h4>
                                      <p class="card-text" >Author : ${qarray[qz].author}</p>
                                      <p class="card-text" >Author's email : <a href="mailto:${qarray[qz].author_email}">${qarray[qz].author_email}</a></p>
                                      <p class="card-text" >Participated : ${qarray[qz].usersParticipated}</p>
                                      <p class="card-text" >Duration : ${qarray[qz].quizDuration} min</p>
                                      <button type="button" class="btn btn-info" id="${qarray[qz]._id}" onclick="myFunction(event)">Leader Board</button>
                                    </div>
                                  </div>`
                        document.getElementById( 'quizparticipatedlist' ).appendChild( quizofuser );
                    }
                    $( "#quizheading" ).show();
                    $( "#quizparticipatedlist" ).show();

                }
                else {
                    toastr.error( data.error );
                }
            }

        } );

    };

    //clicking ok after viewing leader board            

    $( "#lb-okbutton" ).click( function () {
        $( "#leaderboard-block" ).hide();
        $( "#quizheading" ).show();
        $( "#quizparticipatedlist" ).show();
    } );

    //on shifting to other tabs
    $( "#home-tab" ).click( function () {
        $( "#leaderboard" ).hide();
        $( "#profile" ).hide();
    } );
    $( "#profile-tab" ).click( function () {
        $( "#leaderboard" ).hide();
        $( "#profile" ).show();
    } );
    $( "#leaderboard-tab" ).click( function () {
        $( "#leaderboard-block" ).hide();
        $( "#leaderboard" ).show();
        $( "#quizparticipatedlist" ).html( '' );
        leaderboard_functionality();
        $( "#profile" ).hide();
    } );
    //on clicking my quizzes tab
    $( "#myquizzes-tab" ).click( function () {
        myquizzesdisplay();
        $( "#leaderboard" ).hide();
        $( "#lb-table-body" ).html( '' );
        $( "#profile" ).hide();

    } );

    //my quizzes  tab designing

    var myquizzesdisplay = function () {
        $( "#myquizzes-list" ).html( '' );
        var quizzesconductedId = userObject.getCurrentUserId();

        $.ajax( {
            method: 'GET',
            url: `/dashboard/api/quiz/myquizzes/all/${quizzesconductedId}`,
            success: function ( data ) {
                if ( data.success ) {
                    console.log( "conducted list has come" );
                    var q_conductedarray = data.quizDetails;

                    console.log( "quizzes received" );
                    console.log( q_conductedarray );
                    for ( var qz = q_conductedarray.length - 1; qz >= 0; qz-- ) {
                        var qid = qz + 1;
                        //console.log()
                        var quizconducted = document.createElement( 'div' );
                        quizconducted.classList.add( "col" );
                        quizconducted.classList.add( "span_1_of_3" );
                        quizconducted.innerHTML = `
                                    <div class="card  border-primary bg-light mb-3"  style="max-width: 22rem;" id="${qid}-quizconducted">
                                    <div class="card-header">Quiz Code: <cpy data-bs-toggle="tooltip" data-bs-placement="top" title="Copy">${q_conductedarray[qz]._id}</cpy></div>
                                    <div class="card-body"  >
                                      <h4 class="card-title">${q_conductedarray[qz].quizName}</h4>
                                      <p class="card-text" >Number of Questions: ${q_conductedarray[qz].question_count}</p>
                                      <p class="card-text" >Users participated: ${q_conductedarray[qz].usersParticipated}</p>
                                      <p class="card-text" >Duration: ${q_conductedarray[qz].quizDuration} min</p>
                                        <div class="d-flex justify-content-between" id="${qid}-buttonblock">
                                            <e id="edit-button-${qid}"><button type="button" class="btn btn-info" >Edit</button></e>
                                            <d id="${q_conductedarray[qz]._id}"><button type="button" class="btn btn-danger">Delete</button></d>
                                            <div id="asking-deletion-${qid}" style="display:none;">
                                                <b id="del-cancel-${qid}"><button type="button" class="btn btn-info" >Cancel</button> </b>&emsp;
                                                <cd id="del-confirm-${qid}"><button type="button" class="btn btn-danger" >Confirm</button></cb>
                                            </div>
                                        </div>
                                        

                                    </div>
                                  </div>`
                        document.getElementById( 'myquizzes-list' ).appendChild( quizconducted );
                    }
                    $( "#myquizzes-list" ).show();
                }
                else {
                    toastr.error( data.error );
                }
            }

        } );


    }



    // Deleting Quiz operation
    $( document ).on( 'click', 'd', function () {
        var testid = $( this ).attr( 'id' );
        console.log( testid );
        $( `#${testid}` ).hide();
        var edit_block = $( this ).next().attr( 'id' );
        console.log( edit_block );

        $( `#${edit_block}` ).show();

    } );

    $( document ).on( 'click', 'b', function () {
        var del_edit_id = $( this ).parent().attr( 'id' );
        $( `#${del_edit_id}` ).hide();
        var delete_id = $( this ).parent().prev().attr( 'id' );
        $( `#${delete_id}` ).show();
    } );


    $( document ).on( 'click', 'cd', function () {
        var quiztobedeleted_id = $( this ).parent().parent().parent().parent().attr( 'id' );
        console.log( quiztobedeleted_id );
        var delete_conf_id = $( this ).parent().prev().attr( 'id' );
        console.log( delete_conf_id );
        $.ajax( {
            method: 'DELETE',
            url: `/dashboard/api/quiz/delete/${delete_conf_id}`,
            success: function ( data ) {
                if ( data.success ) {
                    $( `#${quiztobedeleted_id}` ).remove();
                    toastr.success( data.msg );

                }
                else {
                    toastr.error( data.error );
                }
            }
        } );

    } );
    //Editing Quiz operation



    var quescnt;
    var id_to_edit;
    $( document ).on( 'click', 'e', function () {
        id_to_edit = $( this ).next().attr( 'id' );
        console.log( id_to_edit );
        $.ajax( {
            method: 'GET',
            url: `/dashboard/api/quiz/myquizzes/${id_to_edit}`,
            success: function ( data ) {
                if ( data.success ) {
                    console.log( data.quiz );
                    var upd_quizname = data.quiz.quizName;
                    var upd_quizdur = data.quiz.quizDuration;
                    var name_dur = `<div class="form-group  " id="upd-qnamediv">
                        <label for="quizname" class="form-label mt-4">Quiz Name</label>
                        <input type="text" class="form-control" id="upd-qname" aria-describedby="emailHelp" value="${upd_quizname}"
                          placeholder="Enter Quiz Name">
                      </div>
                      <div class="form-group" id="upd-qdur">
                        <label for="quizname" class="form-label mt-4">Quiz Duration</label>
                        <input type="number" value="${upd_quizdur}" min="0" step="5" class="form-control" id="upd-qduration"
                          aria-describedby="emailHelp" placeholder="Enter Quiz Duration">
                      </div>`;
                    $( "#update-forminner" ).html( name_dur );
                    var upd_quesrray = data.quiz.questions;
                    console.log( upd_quesrray );
                    for ( var q_no = 0; q_no < upd_quesrray.length; q_no++ ) {
                        var qi = q_no + 1;
                        var q_desc = upd_quesrray[q_no].description;
                        var q_ans = upd_quesrray[q_no].correctAnswer;
                        var opt_array = upd_quesrray[q_no].options;
                        var rec_ques = document.createElement( 'div' );
                        rec_ques.innerHTML = `<div id="upd-${qi}">
                                <div class="form-group">
                                  <label for="upd-question${qi}" class="form-label mt-4">Question ${qi}</label>
                                  <input id="upd-question${qi}" type="text" class="form-control" aria-describedby="emailHelp" value="${q_desc}"
                                    placeholder="Enter Question">
                                </div>
                                <div class="form-group">
                                  <label for="quizname" class="form-label mt-4">Options</label>
                                  <input type="text" class="form-control" id="upd-${qi}opt1" aria-describedby="emailHelp" value="${opt_array[0]}"
                                    placeholder="Enter Option 1">
                                </div>
                                <div class="form-group">&nbsp;
                                  <input type="text" class="form-control" id="upd-${qi}opt2" aria-describedby="emailHelp" value="${opt_array[1]}"
                                    placeholder="Enter Option 2">
                                </div>
                                <div class="form-group">&nbsp;
                                  <input type="text" class="form-control" id="upd-${qi}opt3" aria-describedby="emailHelp" value="${opt_array[2]}"
                                    placeholder="Enter Option 3">
                                </div>
                                <div class="form-group">&nbsp;
                                  <input type="text" class="form-control" id="upd-${qi}opt4" aria-describedby="emailHelp" value="${opt_array[3]}"
                                    placeholder="Enter Option 4">
                                </div>
                                <div class="form-group">
                                  <label for="crctoption" class="form-label mt-4">Select the Correct Option</label>
                                  <select class="form-select" id="${qi}-upd-crctoption">
                                    <option selected>${q_ans}</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                  </select>
                                </div>
                
                                <hr>
                              </div>`;
                        document.getElementById( 'update-forminner' ).appendChild( rec_ques );
                    }

                    quescnt = qi;
                    $( "#myquiz-heading" ).hide();
                    $( "#myquizzes-list" ).hide();
                    $( "#update-quizform" ).show();
                    $( "#upd-terminals" ).show();
                }
                else {
                    toastr.error( data.error );
                }
            }

        } );

    } );

    $( '#upd-addquestion' ).click( function () {

        quescnt++;
        var upd_add = document.createElement( 'div' ); // is a node
        upd_add.innerHTML = `<div id="upd-${quescnt}">
                                <div class="form-group">
                                <label for="upd-question${quescnt}" class="form-label mt-4">Question ${quescnt}</label>
                                <input id="upd-question${quescnt}" type="text" class="form-control" aria-describedby="emailHelp" 
                                    placeholder="Enter Question">
                                </div>
                                <div class="form-group">
                                <label for="quizname" class="form-label mt-4">Options</label>
                                <input type="text" class="form-control" id="upd-${quescnt}opt1" aria-describedby="emailHelp" 
                                    placeholder="Enter Option 1">
                                </div>
                                <div class="form-group">&nbsp;
                                <input type="text" class="form-control" id="upd-${quescnt}opt2" aria-describedby="emailHelp" 
                                    placeholder="Enter Option 2">
                                </div>
                                <div class="form-group">&nbsp;
                                <input type="text" class="form-control" id="upd-${quescnt}opt3" aria-describedby="emailHelp" 
                                    placeholder="Enter Option 3">
                                </div>
                                <div class="form-group">&nbsp;
                                <input type="text" class="form-control" id="upd-${quescnt}opt4" aria-describedby="emailHelp" 
                                    placeholder="Enter Option 4">
                                </div>
                                <div class="form-group">
                                <label for="crctoption" class="form-label mt-4">Select the Correct Option</label>
                                <select class="form-select" id="${quescnt}-upd-crctoption">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                </select>
                                </div>

                                <hr>
                            </div>`;

        document.getElementById( 'update-forminner' ).appendChild( upd_add );
    } );

    $( '#upd-deletequestion' ).click( function () {

        $( `#upd-${quescnt}` ).remove()
        quescnt--;
    } );

    $( '#upd-clearquiz' ).click( function () {

        $( "#update-forminner" ).html( '' );
        $( "#update-quizform" ).hide();
        $( "#myquizzes-list" ).html( '' );
        myquizzesdisplay();
    } );

    $( "#upd-submitquestion" ).click( function () {
        var quizName = $( "#upd-qname" ).val();
        var quizDuration = parseInt( $( "#upd-qduration" ).val() );
        //var author = userObject.getCurrentUserId();
        var questions = [];
        console.log( quescnt );
        for ( var i = 1; i <= quescnt; i++ ) {       //var quesobj={description:'',options:[],correctAnswer:0};
            var description = $( `#upd-question${i}` ).val();
            var correctAnswer = parseInt( $( `#${i}-upd-crctoption` ).val() );
            //console.log(quesobj.correctAnswer);
            var opt = [];
            for ( var j = 1; j <= 4; j++ ) {
                var optval = $( `#upd-${i}opt${j}` ).val();
                opt.push( optval );
            }
            var quesobj = {description: description, correctAnswer: correctAnswer, options: opt};
            //quesobj.options=opt;
            questions.push( quesobj );
        }
        var quizobj = {quizName: quizName, quizDuration: quizDuration, usersParticipated: [], questions: JSON.stringify( questions )};
        //quizobj.questions=questions;  
        console.log( quizobj );

        $.ajax( {
            type: "PATCH",
            url: `/dashboard/api/quiz/update/${id_to_edit}`,
            data: quizobj,
            success: function ( data ) {
                if ( data.success ) {
                    $( "#update-quizform" ).hide()
                    $( "#upd-terminals" ).hide();
                    $( "#myquizzes-list" ).html( '' );
                    toastr.success( data.msg );
                    var quizzesconductedId = userObject.getCurrentUserId();
                    $.ajax( {
                        method: 'GET',
                        url: `/dashboard/api/quiz/myquizzes/all/${quizzesconductedId}`,
                        success: function ( data ) {
                            if ( data.success ) {
                                console.log( "conducted list has come" );
                                var q_conductedarray = data.quizDetails;

                                console.log( "quizzes received" );
                                console.log( q_conductedarray );
                                for ( var qz = 0; qz < q_conductedarray.length; qz++ ) {
                                    var qid = qz + 1;
                                    //console.log()
                                    var quizconducted = document.createElement( 'div' );
                                    quizconducted.classList.add( "col" );
                                    quizconducted.classList.add( "span_1_of_3" );
                                    quizconducted.innerHTML = `
                                                <div class="card  border-primary bg-light mb-3"  style="max-width: 23rem;" id="${qid}-quizconducted">
                                                <div class="card-header">Quiz Code: <cpy data-bs-toggle="tooltip" data-bs-placement="top" title="Copy">${q_conductedarray[qz]._id}</cpy></div>
                                                <div class="card-body"  >
                                                <h4 class="card-title">${q_conductedarray[qz].quizName}</h4>
                                                <p class="card-text" >Number of Questions: ${q_conductedarray[qz].question_count}</p>
                                                <p class="card-text" >Users participated: ${q_conductedarray[qz].usersParticipated}</p>
                                                <p class="card-text" >Duration: ${q_conductedarray[qz].quizDuration} min</p>
                                                    <div class="d-flex justify-content-between" id="${qid}-buttonblock">
                                                        <e id="edit-button-${qid}"><button type="button" class="btn btn-info" >Edit</button></e>
                                                        <d id="${q_conductedarray[qz]._id}"><button type="button" class="btn btn-danger">Delete</button></d>
                                                        <div id="asking-deletion-${qid}" style="display:none;">
                                                            <b id="del-cancel-${qid}"><button type="button" class="btn btn-info" >Cancel</button> </b>&emsp;
                                                            <cd id="del-confirm-${qid}"><button type="button" class="btn btn-danger" >Confirm</button></cb>
                                                        </div>
                                                    </div>
                                                    

                                                </div>
                                            </div>`
                                    document.getElementById( 'myquizzes-list' ).appendChild( quizconducted );
                                }
                                $( "#myquizzes-list" ).show();
                            }
                            else {
                                toastr.error( data.error );
                            }
                        }

                    } );



                }

                else {
                    $( "#update-quizform" ).hide();
                    $( "#upd-terminals" ).hide();
                    $( "#myquiz-heading" ).show();
                    $( "#myquizzes-list" ).show();
                    toastr.error( data.error );
                }
            },
        } );


    } );

    $( document ).on( 'click', 'cpy', function () {
        var $temp = $( "<input>" );
        $( "body" ).append( $temp );
        $temp.val( $( this ).html() ).select();
        document.execCommand( "copy" );
        $temp.remove();
    } );


    async function wait( ms ) {
        return new Promise( resolve => {
            setTimeout( resolve, ms );
        } );
    }

    document.addEventListener( 'fullscreenchange', async () => {
        var full_screen_element = document.fullscreenElement;

        if ( full_screen_element !== null ) {
            console.log( 'Page has entered fullscreen mode' );
            $( "#full-screen" ).css( {'padding-left': '2vw', 'overflow-y': 'scroll'} );

        }
        else {
            console.log( 'Page has exited fullscreen mode' );
            $( "#full-screen" ).css( {'padding-left': '0vw', 'overflow-y': 'hidden'} );
            $( "#redirect-to-quiz" ).show();
            toastr.error( 'Go to Full-Screen ASAP' );
            isFullscreen = false;
            //await wait(10000);
            for ( let i = 0; i < 40; i++ ) {
                await wait( 250 );
                if ( isFullscreen )
                    break;
            }
            console.log( '10 sec done' );
            if ( !isFullscreen ) {
                $( '#submitquizbutton' ).trigger( 'click' );
                $( "#redirect-to-quiz" ).hide();
            }
        }
    } );

    $( "#redirect-to-quiz" ).click( function () {

        $( "#redirect-to-quiz" ).hide();
        openFullscreen( elem );
    } );


} );
// full screen functionality

function openFullscreen( elem ) {
    isFullscreen = true
    if ( elem.requestFullscreen ) {
        elem.requestFullscreen();
    } else if ( elem.webkitRequestFullscreen ) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if ( elem.msRequestFullscreen ) { /* IE11 */
        elem.msRequestFullscreen();
    }
    else if ( elem.mozRequestFullScreen ) {
        elem.mozRequestFullScreen();
    }
}
function exitFullscreen() {
    console.log( 'exit call received' );
    if ( document.exitFullscreen ) {
        document.exitFullscreen();
    } else if ( document.webkitExitFullscreen ) { /* Safari */
        document.webkitExitFullscreen();
    } else if ( document.msExitFullscreen ) { /* IE11 */
        document.msExitFullscreen();
    } else if ( document.mozCancelFullScreen ) {
        document.mozCancelFullScreen();
    }
}
//timer code 
var timer = function ( duration ) {
    const TIME_LIMIT = 60 * duration; // Give time here
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 0.40 * TIME_LIMIT;
    const ALERT_THRESHOLD = 0.15 * TIME_LIMIT;

    const COLOR_CODES = {
        info: {
            color: "green"
        },
        warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD
        },
        alert: {
            color: "red",
            threshold: ALERT_THRESHOLD
        }
    };

    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;

    document.getElementById( "app" ).innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
    </div>
    `;

    startTimer();

    function onTimesUp() {
        clearInterval( timerInterval );
        console.log( "time up" );


    }

    function startTimer() {
        timerInterval = setInterval( () => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById( "base-timer-label" ).innerHTML = formatTime(
                timeLeft
            );
            setCircleDasharray();
            setRemainingPathColor( timeLeft );

            if ( timeLeft === 0 ) {
                onTimesUp();
                $( '#submitquizbutton' ).trigger( 'click' );
                //$("#app").hide();
            }
        }, 1000 );
    }

    function formatTime( time ) {
        const minutes = Math.floor( time / 60 );
        let seconds = time % 60;

        if ( seconds < 10 ) {
            seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
    }

    function setRemainingPathColor( timeLeft ) {
        const {alert, warning, info} = COLOR_CODES;
        if ( timeLeft <= alert.threshold ) {
            document
                .getElementById( "base-timer-path-remaining" )
                .classList.remove( warning.color );
            document
                .getElementById( "base-timer-path-remaining" )
                .classList.add( alert.color );
        } else if ( timeLeft <= warning.threshold ) {
            document
                .getElementById( "base-timer-path-remaining" )
                .classList.remove( info.color );
            document
                .getElementById( "base-timer-path-remaining" )
                .classList.add( warning.color );
        }
    }

    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - ( 1 / TIME_LIMIT ) * ( 1 - rawTimeFraction );
    }

    function setCircleDasharray() {
        const circleDasharray = `${(
            calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed( 0 )} 283`;
        document
            .getElementById( "base-timer-path-remaining" )
            .setAttribute( "stroke-dasharray", circleDasharray );
    }
}