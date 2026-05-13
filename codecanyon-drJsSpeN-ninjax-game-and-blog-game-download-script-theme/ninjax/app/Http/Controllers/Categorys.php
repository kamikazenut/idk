<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\User; 
use App\Post;
use App\Category;
use Auth;
use File;
use Validator;
 

class Categorys extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  int  $slug
     * @return \Illuminate\Http\Response
     */
    
    public function show($slug)
    {
        //To Get All Category 
        $Category = Category::where('slug', '=', $slug)->firstOrFail();
        //To Get All Game
        $Games = Post::where('category_id','=', $Category->id)->latest()->simplePaginate(10);
        //To Get All Categores
        $Categores = Category::simplePaginate(10);
        return view('Pages.Cat.show',compact('Games','Category','Categores'));
       
    }
}
