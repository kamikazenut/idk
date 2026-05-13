<?php
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\User;
use App\Post;
use App\Message;
use App\AdSense;
use App\Instagram;
use App\Menu;
use App\menu_item;   
use App\Category; 


     /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function Users()
    {

        $Users = User::all();
        return $Users;
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function AdSenses()
    {

        $AdSenses = AdSense::all();
        return $AdSenses;
    }
     /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function Posts()
    {

        $Posts = Post::all();
        return $Posts;
    }
     /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function roles()
    {

        $roles = Role::all();
        return $roles;
    }
     /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function Messages()
    {

        $Messages = Message::simplePaginate(6);
        return $Messages;
    }
     /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function Instagrams()
    {

        $Instagrams = Instagram::all();
        return $Instagrams;
    }

     /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function Categories()
    {

        $Categories = Category::simplePaginate(15);
        return $Categories;
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function Catlistones()
    {

        $Catlistones = Category::simplePaginate(3);
        return $Catlistones;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function Catlisttwos()
    {

        $Catlisttwos = Category::latest()->paginate(3);
        return $Catlisttwos;
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function Catlistthrees()
    {

        $Catlistthrees = Category::oldest()->paginate(3);
        return $Catlistthrees;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function Menus()
    {
        $Menus = menu_item::where('menu_id', '=', 1)->get();
        return $Menus;
    }

     /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
    **/
    function RecentPosts()
    {

        $RecentPosts = Post::orderBy('created_at','desc')->paginate(2);
        return $RecentPosts;
    }




     
    