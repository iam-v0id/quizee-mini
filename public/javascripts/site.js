$( document ).ready( function ()
{

    $( '#password, #confirm_password' ).on( 'keyup', function ()
    {
        if ( $( '#password' ).val() == "" )
            $( '#message' ).html( 'Cannot be Empty' ).css( 'color', 'red' );
        else if ( $( '#password' ).val() == $( '#confirm_password' ).val() )
        {
            $( '#register' ).attr( 'disabled', false );
            $( '#message' ).html( 'Matching' ).css( 'color', 'green' );
        } else
        {
            $( '#register' ).attr( 'disabled', true );
            $( '#message' ).html( 'Not Matching' ).css( 'color', 'red' );
        }
    } );



    // Know details about current logged on user, allows us to talk to it rather than directly
    // using localStorage
    var userObject = {
        saveUserInLocalStorage: function ( userJson )
        {
            window.localStorage.setItem( 'currentUser', JSON.stringify( userJson ) );
        },
        removeCurrentUser: function ()
        {
            window.localStorage.removeItem( 'currentUser' );
        },
        getCurrentUser: function ()
        {
            return window.localStorage.getItem( 'currentUser' );
        },
        getCurrentUserEmail: function ()
        {
            var curUserString = this.getCurrentUser();
            if ( curUserString )
            {
                var json = JSON.parse( curUserString );
                if ( json && json.email )
                    return json.email;
                return "";
            }
            return "";
        },
        getCurrentUserId: function ()
        {
            var curUserString = this.getCurrentUser();
            if ( curUserString )
            {
                var json = JSON.parse( curUserString );
                if ( json && json._id )
                    return json._id;
                return "";
            }
            return "";
        },
        isUserLoggedIn: function ()
        {
            if ( this.getCurrentUser() == null )
                return false;
            return true;
        }
    };


    $( "#registerForm" ).submit( function ( e )
    {

        e.preventDefault(); // avoid to execute the actual submit of the form.

        $.ajax( {
            type: "POST",
            url: "/api/user/register",
            data: $( this ).serialize(), // serializes the form's elements.
            success: function ( data )
            {
                if ( data.success )
                    toastr.success( "Sucessfully Registered" );
                else
                    toastr.error( data.error );
            },
            error: function ( data )
            {
                toastr.error( data.error );
            }
        } );
    } );

    $( "#loginForm" ).submit( function ( e )
    {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $.ajax( {
            type: "POST",
            url: "/api/user/login",
            data: $( this ).serialize(),
            success: function ( data )
            {
                if ( data.success )
                {
                    userObject.saveUserInLocalStorage( data );
                    location.href = "/dashboard";
                }
                else
                    toastr.error( data.message );
            }
        } );
    } );

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
    var createquiz=false
var cnt=1
var quizlength=0
$("#forminner").hide()
$("#terminals").hide()
$( '#createquiz' ).click( function ()
    {
        createquiz=true
        if (createquiz==true) {
            $("#created").hide();
            //$("#quizform").show();
            var defhtml=`<div class="form-group" id="qname"><label for="quizname" class="form-label mt-4">Quiz name</label><input type="text" class="form-control" id="quizname" aria-describedby="emailHelp" placeholder="Enter Quiz name"></div><div class="form-group" id="qdur"><label for="quizname" class="form-label mt-4">Quiz duration</label><input type="number" value="5" min="0" step="5" class="form-control" id="quizduration" aria-describedby="emailHelp" placeholder="Enter Quiz duration"></div><div id="1"><div class="form-group" ><label for="question1" class="form-label mt-4">Question 1</label><input id="1question" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter question"></div><div class="form-group" ><label for="quizname" class="form-label mt-4">Options</label><input  type="text" class="form-control" id="1opt1" aria-describedby="emailHelp" placeholder="Enter Option1"></div>
            <div class="form-group" >&nbsp;
            <input type="text" class="form-control" id="1opt2" aria-describedby="emailHelp" placeholder="Enter Option2">
          </div>
          <div class="form-group" >&nbsp;
            <input type="text" class="form-control" id="1opt3" aria-describedby="emailHelp" placeholder="Enter Option3">
          </div>
          <div class="form-group" >&nbsp;
            <input type="text" class="form-control" id="1opt4" aria-describedby="emailHelp" placeholder="Enter Option4">
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


            $("#forminner").html('');
            $("#forminner").html(defhtml);
            $("#forminner").show();
            $("#terminals").show();
            $( '#createquiz' ).hide();
        }
    } );
$( '#addquestion' ).click( function (){
               
    cnt++;
    var z = document.createElement('div'); // is a node
    z.innerHTML = '<div id='+cnt+'><div class="form-group" > <label for="question1" class="form-label mt-4">Question '+cnt+'</label><input type="text" id="'+cnt+'question" class="form-control" aria-describedby="emailHelp" placeholder="Enter question"></div><div class="form-group" ><label for="quizname" class="form-label mt-4">Options</label> <input type="text" class="form-control" id="'+cnt+'opt1" aria-describedby="emailHelp" placeholder="Enter Option1"> </div><div class="form-group"  >&nbsp;<input type="text" class="form-control" id="'+cnt+'opt2" aria-describedby="emailHelp" placeholder="Enter Option2"></div><div class="form-group">&nbsp;<input type="email" class="form-control" id="'+cnt+'opt3" aria-describedby="emailHelp" placeholder="Enter Option3"></div><div class="form-group" >&nbsp; <input type="email" class="form-control" id="'+cnt+'opt4" aria-describedby="emailHelp" placeholder="Enter Option4"></div><div class="form-group"  ><label for="crctoption" class="form-label mt-4">Select the Correct Option</label><select class="form-select" id="'+cnt+'crctoption"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><hr></div>' ;
    //document.body.appendChild(z);
    document.getElementById('forminner').appendChild(z);
 } );
 $( '#deletequestion' ).click( function (){
               
     $('#'+cnt).remove()
     cnt--;
} );
$( '#clearquiz' ).click( function (){
               
    location.href = "/dashboard";
} );
$("#submitquestion").click(function(){
    //var quizobj={quizName:'',author:'',questions:[],quizDuration:''};
    var quizName=$("#quizname").val();
    var quizDuration=parseInt($("#quizduration").val());
    var author=userObject.getCurrentUserId();
    var questions=[];
    console.log(cnt);
    for(var i=1;i<=cnt;i++)
    {       //var quesobj={description:'',options:[],correctAnswer:0};
            var description=$('#'+i+"question").val();
            var correctAnswer=parseInt($('#'+i+"crctoption").val());
            //console.log(quesobj.correctAnswer);
            var opt=[];
            for(var j=1;j<=4;j++){
                var optval=$("#"+i+"opt"+j).val();
                opt.push(optval);
            }
            var quesobj={description:description,correctAnswer:correctAnswer,options:opt};
            //quesobj.options=opt;
            questions.push(quesobj);
    }
    quizobj={quizName:quizName,quizDuration:quizDuration,author:author,questions:JSON.stringify(questions)};
    //quizobj.questions=questions;
    console.log(quizobj);

    $.ajax( {
        type: "POST",
        url: '/api/quiz/create',
        data: quizobj,
        success: function ( data )
        {
            if ( data.success )
            {   
                console.log("inserted");
                console.log(data.quizCode);
                // $("#quizform").hide();
                $("#forminner").hide();
                $("#terminals").hide();
                $("#createquiz").show();
                $("#quizcreatedid").html(data.quizCode);
                $("#created").show();
                //userObject.saveUserInLocalStorage( data );
                // location.href = "/dashboard";
            }
            else
                toastr.error( data.error );
        },
    } );


});


$( '#participatequiz' ).click( function (){
     //var quizidobj={quizid:''};
    //console.log("pressed");
     var quizCode=$("#quizid").val();
    //console.log(quizCode);  
    //$("#quizsubmitform").html('');
     $.ajax( {
        method: 'GET',
        url:`/api/quiz/${quizCode}`,
        //data:quizCode,
        success:function(data){
            if ( data.success )
            {   
                console.log(data.quiz);
                console.log(data.quiz.quizName);
                //console.log(data.quiz.questions.length);
                quizlength=data.quiz.questions.length;
                $("#quiztitle").html(data.quiz.quizName);
                var quizquestionsobj=data.quiz.questions;
                for(var k=0;k<quizquestionsobj.length;k++)
                {   var c=k+1;
                    var quesattempting=quizquestionsobj[k].description;
                    var optattempting=quizquestionsobj[k].options;
                    var quizques=document.createElement('div');
                    quizques.innerHTML=`<fieldset class="form-group" id="${c}-set">
                    <legend class="mt-4" id="${c}-dispquestion">${c}Q)  ${quesattempting}</legend>
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
                  </fieldset>`;

                    document.getElementById('quizsubmitform').appendChild(quizques);
                }
                $("#quizsubmitform").show();
                $("#submitquizbutton").show();
               $("#q-name").hide();

               $("#participatequiz").hide();

            }
            else
            toastr.error(data.error);
        }
    })

            
} );

$("#submitquizbutton").click(function(){

    //console.log(quizlength);
   for(var y=1;y<=quizlength;y++)
   { var tempobj=$(`input[name='${y}-question']:checked`).val();
        if (tempobj==undefined)
            tempobj='0';
        console.log(tempobj);
    }
    $("#quiztitle").html('');
    $("#quizsubmitform").html('');
    $("#submitquizbutton").hide();
    $("#q-name").show();
    $("#participatequiz").show();
    $("#quizid").val('');
});


} );

function onSignIn( googleobj )
{
    $.ajax( {
        url: '/api/user/login',
        method: 'POST',
        data: googleobj,
        success: ( obj ) =>
        {
            if ( obj.success )
            {
                toastr.success( 'Login Sucessful' );
                window.localStorage.setItem( 'currentUser', JSON.stringify( obj ) );
                location.href = "/dashboard";
                console.log( obj );
            }
        },
        error: ( err ) =>   
        {
            toastr.error( err );
        }
    } );

}

