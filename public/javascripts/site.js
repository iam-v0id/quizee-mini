$( document ).ready( function ()
{
    console.log( "Jquery Running" );

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
                    toastr.error( "User Already Registered" );
            },
            error: function ( dataobj )
            {
                console.log( dataobj );
            }
        } );
    } );

    $( "#loginForm" ).submit( function ( e )
    {

        e.preventDefault(); // avoid to execute the actual submit of the form.

        $.ajax( {
            type: "POST",
            url: "/api/user/login",
            data: $( this ).serialize(), // serializes the form's elements.
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
            url: "/api/users/logout",
            data: {},
        } );
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
            }
        },
        error: ( err ) =>   
        {
            console.log( err );
        }
    } );

}