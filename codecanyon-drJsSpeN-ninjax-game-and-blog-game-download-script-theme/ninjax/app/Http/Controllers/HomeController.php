<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\ImageUpload;
use App\User; 
use App\Category;
use App\Gallery;
use App\Post;
use Auth;
use File;
use Validator; 

class HomeController extends Controller
{
      /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
    	$Categories =  Category::all();
        $Games =  Post::latest()->simplePaginate(20);
        $slideGames =  Post::latest()->simplePaginate(5);
        $BigGames =  Post::latest()->simplePaginate(12);
        $Tournaments = Gallery::latest()->simplePaginate(12);
        return view('Pages/home',compact('Categories','Games','BigGames','slideGames','Tournaments'));
    }

}
