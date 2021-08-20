const userObject = {
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
        if ( this.getCurrentUser() === null )
            return false;
        return true;
    }
};

export default userObject;
