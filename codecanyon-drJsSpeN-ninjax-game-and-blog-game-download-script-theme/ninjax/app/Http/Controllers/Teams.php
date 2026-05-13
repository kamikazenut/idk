<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\ImageUpload;
use App\User; 
use App\Category;
use App\Instagram;
use App\Client;
use App\Post;
use Auth;
use File;
use Validator; 

class Teams extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $Teams =  Client::latest()->simplePaginate(10);
        $FeaturedGames =  Post::latest()->simplePaginate(12);
        return view('Pages.Teams.index',compact('Teams','FeaturedGames'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // This query to get Team page //
        $Team = Client::where('id', '=', $id)->firstOrFail(); 
        $Instagrams =  Instagram::latest()->simplePaginate(12);
        // To Get Change The Language
        return view('Pages.Teams.show',compact('Team','Instagrams'));
    }
}
