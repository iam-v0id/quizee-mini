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
            console.log( err );
        }
    } );

}
var createquiz=false
var cnt=1
$("#forminner").hide()
$("#terminals").hide()
$( '#createquiz' ).click( function ()
    {
        createquiz=true
        if (createquiz==true) {
            $("#forminner").show()
            $("#terminals").show()
            $( '#createquiz' ).hide()
        }
    } );
$( '#addquestion' ).click( function (){
               
    cnt++;
    document.getElementById('forminner').innerHTML  +='<div class="form-group" id="'+cnt+'question"> <label for="question1" class="form-label mt-4">Question '+cnt+'</label><input type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter question"></div><div class="form-group" id="'+cnt+'opt1"><label for="quizname" class="form-label mt-4">Options</label> <input type="text" class="form-control" id="quizname" aria-describedby="emailHelp" placeholder="Enter Option1"> </div><div class="form-group" id="'+cnt+'opt2" >&nbsp;<input type="text" class="form-control" id="quizname" aria-describedby="emailHelp" placeholder="Enter Option2"></div><div class="form-group"id="'+cnt+'opt3">&nbsp;<input type="email" class="form-control" id="quizname" aria-describedby="emailHelp" placeholder="Enter Option3"></div><div class="form-group" id="'+cnt+'opt4">&nbsp; <input type="email" class="form-control" id="quizname" aria-describedby="emailHelp" placeholder="Enter Option4"></div><div class="form-group" id="'+cnt+'crctoption" ><label for="crctoption" class="form-label mt-4">Select the Correct Option</label><select class="form-select" id="crctoption"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><hr>';
 } );
 
