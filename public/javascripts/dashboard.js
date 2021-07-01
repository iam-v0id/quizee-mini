import userObject from './ls.js';

$( document ).ready( function ()
{
    $( '#Logoutbtn' ).click( function ()
    {
        userObject.removeCurrentUser();
        $.ajax( {
            type: "POST",
            url: "/api/user/logout",
            data: {},
        } );
        location.href = "/";
    } );

    
    var createquiz = false
    var cnt = 1
    var quizlength = 0
    var quiz_Code = ''

    // Author Tab
    
    $( '#createquiz' ).click( function ()
    {
        createquiz = true
        if ( createquiz == true )
        {
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
            $( "#forminner" ).show();
            $( "#terminals" ).show();
            $( '#createquiz' ).hide();
        }
    } );
    $( '#addquestion' ).click( function ()
    {

        cnt++;
        var z = document.createElement( 'div' ); // is a node
        z.innerHTML = '<div id=' + cnt + '><div class="form-group" > <label for="question1" class="form-label mt-4">Question ' + cnt + '</label><input type="text" id="' + cnt + 'question" class="form-control" aria-describedby="emailHelp" placeholder="Enter Question"></div><div class="form-group" ><label for="quizname" class="form-label mt-4">Options</label> <input type="text" class="form-control" id="' + cnt + 'opt1" aria-describedby="emailHelp" placeholder="Enter Option 1"> </div><div class="form-group"  >&nbsp;<input type="text" class="form-control" id="' + cnt + 'opt2" aria-describedby="emailHelp" placeholder="Enter Option 2"></div><div class="form-group">&nbsp;<input type="email" class="form-control" id="' + cnt + 'opt3" aria-describedby="emailHelp" placeholder="Enter Option 3"></div><div class="form-group" >&nbsp; <input type="email" class="form-control" id="' + cnt + 'opt4" aria-describedby="emailHelp" placeholder="Enter Option 4"></div><div class="form-group"  ><label for="crctoption" class="form-label mt-4">Select the Correct Option</label><select class="form-select" id="' + cnt + 'crctoption"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><hr></div>';
        //document.body.appendChild(z);
        document.getElementById( 'forminner' ).appendChild( z );
    } );
    $( '#deletequestion' ).click( function ()
    {

        $( '#' + cnt ).remove()
        cnt--;
    } );
    $( '#clearquiz' ).click( function ()
    {

        location.href = "/dashboard";
    } );
    $( "#submitquestion" ).click( function ()
    {
        //var quizobj={quizName:'',author:'',questions:[],quizDuration:''};
        var quizName = $( "#quizname" ).val();
        var quizDuration = parseInt( $( "#quizduration" ).val() );
        var author = userObject.getCurrentUserId();
        var questions = [];
        console.log( cnt );
        for ( var i = 1; i <= cnt; i++ )
        {       //var quesobj={description:'',options:[],correctAnswer:0};
            var description = $( '#' + i + "question" ).val();
            var correctAnswer = parseInt( $( '#' + i + "crctoption" ).val() );
            //console.log(quesobj.correctAnswer);
            var opt = [];
            for ( var j = 1; j <= 4; j++ )
            {
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
            success: function ( data )
            {
                if ( data.success )
                {
                    console.log( "inserted" );
                    console.log( data.quizCode );
                    // $("#quizform").hide();
                    $( "#forminner" ).hide();
                    $( "#terminals" ).hide();
                    $( "#createquiz" ).show();
                    $( "#quizcreatedid" ).html(`Quiz Code : ${data.quizCode}` );
                    $( "#created" ).show();
                    $("#quizid-okbutton").show();
                    //userObject.saveUserInLocalStorage( data );
                    // location.href = "/dashboard";
                }
                else
                    toastr.error( data.error );
            },
        } );


    } );

    $("#quizid-okbutton").click(function(){
        $( "#created" ).hide();
        $("#quizid-okbutton").hide();
    });


                      
    
                          // Participate Tab

                    $( '#participatequiz' ).click( function ()
                    {
                        //var quizidobj={quizid:''};
                        //console.log("pressed");
                        var quizCode = $( "#quizid" ).val();
                        //console.log(quizCode);  
                        //$("#quizsubmitform").html('');
                        $.ajax( {
                            method: 'GET',
                            url: `/dashboard/api/quiz/${quizCode}`,
                            //data:quizCode,
                            success: function ( data )
                            {
                                if ( data.success )
                                {
                                    console.log( data.quiz );
                                    console.log( data.quiz.quizName );
                                    //console.log(data.quiz.questions.length);
                                    quizlength = data.quiz.questions.length;
                                    quiz_Code = data.quiz._id;
                                    $( "#quiztitle" ).html( data.quiz.quizName );
                                    var quizquestionsobj = data.quiz.questions;
                                    for ( var k = 0; k < quizquestionsobj.length; k++ )
                                    {
                                        var c = k + 1;
                                        var quesattempting = quizquestionsobj[k].description;
                                        var optattempting = quizquestionsobj[k].options;
                                        var quizques = document.createElement( 'div' );
                                        $(quizques).attr('style','padding-left : 8%');
                                        quizques.innerHTML = `
                                        <div class="card border-primary mb-3" style="max-width: 90%;" id="${c}-set">
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
                                    $( "#quizsubmitform" ).show();
                                    $( "#submitquizbutton" ).show();
                                    $( "#q-name" ).hide();

                                    $( "#participatequiz" ).hide();

                                }
                                else
                                    toastr.error( data.error );
                            }
                        } )


                    } );

                    $( "#submitquizbutton" ).click( function ()
                    {
                        //$("#participatequiz").hide();

                        var responses = [];
                        //console.log(quizlength);
                        for ( var y = 1; y <= quizlength; y++ )
                        {
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
                            success: function ( data )
                            {
                                if ( data.success )
                                {
                                    console.log( data.marks );
                                    toastr.success( "Quiz Submitted Sucessfully " );
                                    $( "#marks" ).html( data.marks );
                                    $( "#marks_declaration" ).show();
                                    $( "#marksokbutton" ).show();
                                    $( "#q-name" ).hide();
                                    // $("#quizidlabel").hide();
                                    // $("#quizid").hide();
                                    //$("#quizid").val('');

                                }
                                else
                                {
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
                    $( "#marksokbutton" ).click( function ()
                    {

                        $( "#q-name" ).show();
                        $( "#quizid" ).val( '' );
                        $( "#participatequiz" ).show();
                        $( "#marks" ).html( '' );
                        $( "#marks_declaration" ).html( '' );
                        $( "#marksokbutton" ).hide();

                    } );

                    //Leader Board Tab

    
    $("#leaderboard-tab").click(function(){
        var quizzesParticipatedId=userObject.getCurrentUserId();

        $.ajax( {
            method: 'GET',
            url: `/dashboard/api/quiz/participated/${quizzesParticipatedId}`,
            success:function(data)
            {
                    if(data.success)
                        {   var qarray=data.quizDetails;
                           
                            console.log("quizzes received");
                            console.log(qarray);
                            for(var qz=0;qz<qarray.length; qz++)
                            {
                                    var qid=qz+1;
                                    //console.log()
                                    var quizofuser = document.createElement( 'div' );
                                    quizofuser.classList.add("col");
                                    quizofuser.classList.add("span_1_of_3");
                                    quizofuser.innerHTML =`
                                    <div class="card  border-primary bg-light mb-3"  style="max-width: 23rem;" >
                                    <div class="card-header">Quiz Code : ${qarray[qz]._id}</div>
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
                           $("#quizparticipatedlist").show();
                        }
                    else{
                        toastr.error( data.error );
                    }
            }

                 });
       
            } );

    //clicking ok after viewing leader board            
    
    $("#lb-okbutton").click(function(){
        $("#lb-table-body").html('');
        $("#leaderboardheading").hide();
        $("#lb-table").hide();
        $("#lb-okbutton").hide();
        $("#quizheading").show();
        $("#quizparticipatedlist").show();
    });

    //on shifting to other tabs
    $("#home-tab").click(function(){
        $("#quizparticipatedlist").html('');
    });
    $("#profile-tab").click(function(){
        $("#quizparticipatedlist").html('');
    });
    $("#myquizzes-tab").click(function(){
        $("#quizparticipatedlist").html('');
    });

                //my quizzes  tab designing

    
    $("#myquizzes-tab").click(function(){
        var quizzesconductedId=userObject.getCurrentUserId();

        $.ajax( {
            method: 'GET',
            url: `/dashboard/api/quiz/myquizzes/all/${quizzesconductedId}`,
            success:function(data)
                {
                    if(data.success)
                    {
                            console.log("conducted list has come");
                            var q_conductedarray=data.quizDetails;
                           
                            console.log("quizzes received");
                            console.log(q_conductedarray);
                            for(var qz=0;qz<q_conductedarray.length; qz++)
                            {
                                    var qid=qz+1;
                                    //console.log()
                                    var quizconducted = document.createElement( 'div' );
                                    quizconducted.classList.add("col");
                                    quizconducted.classList.add("span_1_of_3");
                                    quizconducted.innerHTML =`
                                    <div class="card  border-primary bg-light mb-3"  style="max-width: 23rem;" id="${qid}-quizconducted">
                                    <div class="card-header">Quiz Code: ${q_conductedarray[qz]._id}</div>
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
                           $("#myquizzes-list").show();
                    }
                    else{
                        toastr.error( data.error );
                    }
                }
        
        });
    
    
    });

    $("#home-tab").click(function(){
        $("#myquizzes-list").html('');
    });
    $("#profile-tab").click(function(){
        $("#myquizzes-list").html('');
    });
    $("#leaderboard-tab").click(function(){
        $("#myquizzes-list").html('');
    });
                
    // Deleting Quiz operation
    $(document).on('click','d',function()
    {
            var testid=$(this).attr('id');
            console.log(testid);
            
            var edit_block= $(this).next().attr('id');
            console.log(edit_block);
            $(`#${testid}`).hide();
            $(`#${edit_block}`).show();
            
    });

    $(document).on('click','b',function(){
        var del_edit_id=$(this).parent().attr('id');
        $(`#${del_edit_id}`).hide();
        var delete_id=$(this).parent().prev().attr('id');
        $(`#${delete_id}`).show();
    });


    $(document).on('click','cd',function(){
        var quiztobedeleted_id=$(this).parent().parent().parent().parent().attr('id');
        console.log(quiztobedeleted_id);
        var delete_conf_id=$(this).parent().prev().attr('id');
        console.log(delete_conf_id);
        $.ajax( {
                method: 'DELETE',
                url: `/dashboard/api/quiz/delete/${delete_conf_id}`,
                success:function(data)
                    {
                        if(data.success)
                            {  $(`#${quiztobedeleted_id}`).remove();
                               toastr.success(data.msg);
                            
                            }
                        else
                        {
                            toastr.error( data.error );
                        }
                    }
            });
        
    });
    //Editing Quiz operation
   
   
   
    var quescnt;
    var id_to_edit;
    $(document).on('click','e',function()
    {
            id_to_edit=$(this).next().attr('id');
            console.log(id_to_edit);
            $.ajax( {
                method: 'GET',
                url: `/dashboard/api/quiz/myquizzes/${id_to_edit}`,
                success:function(data)
                {
                    if(data.success)
                    {
                        console.log(data.quiz);
                        var upd_quizname=data.quiz.quizName;
                        var upd_quizdur=data.quiz.quizDuration;
                        var name_dur=`<div class="form-group" id="upd-qnamediv">
                        <label for="quizname" class="form-label mt-4">Quiz Name</label>
                        <input type="text" class="form-control" id="upd-qname" aria-describedby="emailHelp" value="${upd_quizname}"
                          placeholder="Enter Quiz Name">
                      </div>
                      <div class="form-group" id="upd-qdur">
                        <label for="quizname" class="form-label mt-4">Quiz Duration</label>
                        <input type="number" value="${upd_quizdur}" min="0" step="5" class="form-control" id="upd-qduration"
                          aria-describedby="emailHelp" placeholder="Enter Quiz Duration">
                      </div>`;
                        $("#update-forminner").html(name_dur);
                        var upd_quesrray=data.quiz.questions;
                        console.log(upd_quesrray);
                        for(var q_no=0;q_no<upd_quesrray.length;q_no++)
                            {  var qi=q_no+1;
                                 var q_desc=upd_quesrray[q_no].description;
                                var q_ans=upd_quesrray[q_no].correctAnswer;
                                var opt_array=upd_quesrray[q_no].options;
                                var rec_ques=document.createElement('div');
                                rec_ques.innerHTML=`<div id="upd-${qi}">
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
                              document.getElementById( 'update-forminner' ).appendChild(rec_ques);
                            }

                            quescnt=qi;
                        $("#myquiz-heading").hide();
                        $("#myquizzes-list").hide();
                         $("#update-quizform").show();
                         $("#upd-terminals").show();
                    }
                    else{
                        toastr.error( data.error );
                    }
                }

                });
                                
         });

         $( '#upd-addquestion' ).click( function ()
         {

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

         $( '#upd-deletequestion' ).click( function ()
            {

                $( `#upd-${quescnt}` ).remove()
                quescnt--;
            } );

        $( '#upd-clearquiz' ).click( function ()
        {
    
            $("#update-forminner").html('');
            $("#update-quizform").hide();
        } );

        $("#upd-submitquestion").click(function(){
        var quizName = $( "#upd-qname" ).val();
        var quizDuration = parseInt( $( "#upd-qduration" ).val());
        var author = userObject.getCurrentUserId();
        var questions = [];
        console.log( quescnt );
        for ( var i = 1; i <= quescnt; i++ )
        {       //var quesobj={description:'',options:[],correctAnswer:0};
            var description = $( `#upd-question${i}` ).val();
            var correctAnswer = parseInt( $( `#${i}-upd-crctoption` ).val() );
            //console.log(quesobj.correctAnswer);
            var opt = [];
            for ( var j = 1; j <= 4; j++ )
            {
                var optval = $( `#upd-${i}opt${j}` ).val();
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
            type: "PATCH",
            url: `/dashboard/api/quiz/update/${id_to_edit}`,
            data: quizobj,
            success: function ( data )
            {
                if ( data.success )
                {  
                     $("#update-quizform").hide()
                    $("#upd-terminals").hide();
                    $("#myquizzes-list").html('');
                    toastr.success(data.msg);
                    var quizzesconductedId=userObject.getCurrentUserId();
                    $.ajax( {
                        method: 'GET',
                        url: `/dashboard/api/quiz/myquizzes/all/${quizzesconductedId}`,
                        success:function(data)
                            {
                                if(data.success)
                                {
                                        console.log("conducted list has come");
                                        var q_conductedarray=data.quizDetails;
                                    
                                        console.log("quizzes received");
                                        console.log(q_conductedarray);
                                        for(var qz=0;qz<q_conductedarray.length; qz++)
                                        {
                                                var qid=qz+1;
                                                //console.log()
                                                var quizconducted = document.createElement( 'div' );
                                                quizconducted.classList.add("col");
                                                quizconducted.classList.add("span_1_of_3");
                                                quizconducted.innerHTML =`
                                                <div class="card  border-primary bg-light mb-3"  style="max-width: 23rem;" id="${qid}-quizconducted">
                                                <div class="card-header">Quiz Code: ${q_conductedarray[qz]._id}</div>
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
                                    $("#myquizzes-list").show();
                                }
                                else{
                                    toastr.error( data.error );
                                }
                            }
                    
                            });
                
                
                
                }

                else
                  {  
                    $("#update-quizform").hide();
                    $("#upd-terminals").hide();
                    $("#myquiz-heading").show();
                    $("#myquizzes-list").show();
                    toastr.error( data.error ); 
                  }
            },
        });
        
    
    });



});