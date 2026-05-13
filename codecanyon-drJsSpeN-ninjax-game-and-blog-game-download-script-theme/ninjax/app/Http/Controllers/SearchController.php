<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;
use App\User;
use App\Post;
use Session, DB;
use Auth;

class SearchController extends Controller
{
   /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function search()
    {                      
           // Gets the query string from our form submission 
           $search = \Request::get('search');
           // Searches for FeaturedGames titles //
           $FeaturedGames = Post::where('Title_en', 'LIKE', '%' . $search . '%')->simplePaginate(5);
           return view('Pages.search',compact('FeaturedGames','search'));
           
    }
}
