$(document).ready( function(){
    console.log("Jquery Running");
    // toastr.success('Toastr Running')


    // Know details about current logged on user, allows us to talk to it rather than directly
    // using localStorage
    var userObject = {
        saveUserInLocalStorage : function(userJson){
            window.localStorage.setItem('currentUser', JSON.stringify(userJson));
        },
        removeCurrentUser: function(){
            window.localStorage.removeItem('currentUser');
        },
        getCurrentUser : function(){
            return window.localStorage.getItem('currentUser');
        },
        getCurrentUserName : function(){
            var curUserString = this.getCurrentUser();
            if(curUserString){
                var json = JSON.parse(curUserString);
                if(json && json.username)
                    return json.username;
                return "";
            }
            return "";
        },
        isUserLoggedIn : function(){
            if(this.getCurrentUser()==null)
                return false;
            return true;
        }
    };

    var onSignIn = function(loggedIn){
        if(loggedIn){
            console.log("Logged In");
            $("#signedIn").show();
            $("#notSignedIn").hide();
            $("#welcomeUser").html("Welcome "+ userObject.getCurrentUserName());
        }
        else{
            console.log("Not Logged In");
            $("#notSignedIn").show();
            $("#signedIn").hide();
        }
    }


    if(userObject.isUserLoggedIn()){
        onSignIn(true);
    }
    else{
        onSignIn(false);
    }


    $("#lnkLogout").click(function(){

        // TODO:  When session is implemented, delete session on server side also

        userObject.removeCurrentUser(); // will this update UI?
        onSignIn(false);
    })

    // On click of login button, make AJAX call.
    $("#btnLogin").on('click', function(){
        var userObj = {username: '', password:''};
        userObj.username = $("#txtUserName").val();
        userObj.password = $("#txtPassword").val();
        $.post( "/api/login", userObj)
        .done(function( data ) {

            console.log(JSON.stringify(data));

            // Response will be of the form
            // {success: true, message: 'Login Failed', user: null }
            
            if(data.success){
                toastr.success(data.message, 'Successful');
                userObject.saveUserInLocalStorage(data.user);
                onSignIn(true);
            }
            else{
                toastr.error(data.message, 'Failed');
            }
        })
        .fail(function() {
            alert( "error" );
        })
        .always(function() {
            alert( "finished" );
        });
    })

    // $("#register").on('click', function(){
    //     $("#registerform").show();
    // })
    $("#registerbutton").on('click', function(){
        var userObj = {firstname:'',lastname:'',email:'',role:'',username: '',password:'',confirmpassword:''};
        userObj.firstname=$("#firstname").val();
        userObj.lasttname=$("#lastname").val();
        userObj.email = $("#email").val();
        userObj.role = $("#role").val();
        userObj.username = $("#name").val();
        userObj.password = $("#password").val();
        userObj.confirmpassword = $("#confirm").val();
        console.log(userObj);
        //$("#registerform").hide();
        $.post( "/api/createuser", userObj)
        .done(function( data ) {

            console.log(JSON.stringify(data));

            // Response will be of the form
            // {success: true, message: 'Login Failed', user: null }
            
            if(data.success){
                
                userObject.saveUserInLocalStorage(data.user);
                onSignIn(true);
                location.href='/loginpage'
                console.log(JSON.stringify(userObject.getCurrentUserName()));
                toastr.success(data.message, 'Successful');
            }
            else{
                location.href='/loginpage'
                toastr.error(data.message, 'user already exists');
            }
        })
        .fail(function() {
            alert( "error" );
        })
        .always(function() {
            alert( "finished" );
        });
    })
})
