<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;
use App\User;
use App\Category;
use App\Instagram;
use Auth;

class Games extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $FeaturedGames =  Post::latest()->simplePaginate(8);
        return view('Pages.Games.index',compact('FeaturedGames'));
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $slug
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        // This query to get Bigimage page //
        $Game = Post::where('slug', '=', $slug)->firstOrFail();
        //To Get All Bigimage recents OUT SIDE IN HOME VIEW
        $TrendGames = Post::simplePaginate(8)->fresh(); 
        // To Get Change The Language
        return view('Pages.Games.show',compact('Game','TrendGames'));
    }
}
