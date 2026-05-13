<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\ImageUpload;
use App\User; 
use App\Category;
use App\Gallery;
use App\Client;
use App\Post;
use Auth;
use File;
use Validator; 

class Tournaments extends Controller
{
   
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $Tournaments =  Gallery::latest()->simplePaginate(10);
        $Teams =  Client::latest()->simplePaginate(10);
        return view('Pages.Tournaments.index',compact('Tournaments','Teams'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // This query to get Tournament //
        $Tournament = Gallery::where('id', '=', $id)->firstOrFail(); 
        //To Get All Bigimage recents OUT SIDE IN HOME VIEW
        $TrendGames = Post::simplePaginate(8)->fresh();
        // To Get Change The Language
        return view('Pages.Tournaments.show',compact('Tournament','TrendGames'));
    }
}
