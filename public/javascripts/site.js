import userObject from './ls.js';

$( document ).ready( function ()
{
    console.log( "JQuery Runnig" );
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
                {
                    toastr.success( "Sucessfully Registered" );
                    location.href = "/";
                }
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
                    toastr.success( 'Login Sucessful' );
                    userObject.saveUserInLocalStorage( data );
                    location.href = "/dashboard";
                }
                else
                    toastr.error( data.message );
            }
        } );
    } );
} );
