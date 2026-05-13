<?php
/*
|-------------------------------------------------------------------------
| Web Routes
|-------------------------------------------------------------------------
| Here is where you can register web routes for your application. These
| Routes are loaded by the RouteServiceProvider within a group which
| Contains The middleware Group Now create something great.
|
*/ 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController; 
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\Categorys;
use App\Http\Controllers\Tournaments;
use App\Http\Controllers\Teams;
use App\Http\Controllers\Games;
use App\Http\Controllers\SearchController;
/*
|--------------------------------------------------------------------------
| Laravel Dashboard
|--------------------------------------------------------------------------
|
*/
use App\Http\Controllers\Dashboard\Dashboard;
use App\Http\Controllers\Dashboard\AdSenses;
use App\Http\Controllers\Dashboard\Categories;
use App\Http\Controllers\Dashboard\Messages;
use App\Http\Controllers\Dashboard\Settings;
use App\Http\Controllers\Dashboard\Clients;
use App\Http\Controllers\Dashboard\Galleries;
use App\Http\Controllers\Dashboard\Instagrams;
use App\Http\Controllers\Dashboard\Media;
use App\Http\Controllers\Dashboard\Links;
use App\Http\Controllers\Dashboard\Menus;
use App\Http\Controllers\Dashboard\Posts;
use App\Http\Controllers\Dashboard\Roles;
use App\Http\Controllers\Dashboard\Users;
/*
|--------------------------------------------------------------------------
| ImageUploadController
|--------------------------------------------------------------------------
*/
Route::group(['middleware' => ['auth','role:Super-Admin']], function () {
    Route::get('Dashboard/image/upload', [ImageUploadController::class, 'fileCreate']);
    Route::post('Dashboard/image/upload/store', [ImageUploadController::class, 'fileStore']);
    Route::post('Dashboard/image/delete', [ImageUploadController::class, 'fileDestroy']);
});

// This area for User image 
Route::get('Userimage/upload', [Userimage::class, 'fileCreate']);
Route::post('Userimage/store', [Userimage::class, 'fileStore']);
Route::post('Userimage/delete', [Userimage::class, 'fileDestroy']); 
// This area for Media image 
Route::get('Mediaimage/upload', [Mediaimage::class, 'fileCreate']);
Route::post('Mediaimage/store', [Mediaimage::class, 'fileStore']);
Route::post('Mediaimage/delete', [Mediaimage::class, 'fileDestroy']); 


/*
|--------------------------------------------------------------------------
| LaravelLocalization
|--------------------------------------------------------------------------
|
*/
Route::group([
'prefix' => LaravelLocalization::setLocale(),
'middleware' => [ 'localeSessionRedirect', 'localizationRedirect', 'localeViewPath' ]
],
function () {  
Auth::routes();
Route::get('/', [HomeController::class, 'index']);
Route::get('search', [SearchController::class, 'search']);
Route::get('ask', [HomeController::class, 'ask']);
Route::get('MediaImages', [HomeController::class, 'MediaImages']);
Route::get('MediaVideos', [HomeController::class, 'MediaVideos']);
Route::get('Trending', [HomeController::class, 'Trending']);

/*
|--------------------------------------------------------------------------
| missing RETURN 404 PAGE Route   
|--------------------------------------------------------------------------
|
*/
Route::get('missing', function () {
  return view('404');
});
/*
|--------------------------------------------------------------------------
| resource
|--------------------------------------------------------------------------
|
*/ 
Route::resource('Cat', Categorys::class);
Route::resource('Games', Games::class);
Route::resource('Tournaments', Tournaments::class);
Route::resource('Teams', Teams::class);
/**
*   
* Show the middleware dashboard Super-Admin.
*
* @return \Illuminate\Contracts\Support\Renderable
*/
Route::group(['middleware' => ['auth','role:Super-Admin']], function () {
/*
|--------------------------------------------------------------------------
| Web Routes Dashboard
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/admin', [Dashboard::class, 'index']);
Route::resource('Dashboard/Roles','Dashboard\Roles');
Route::resource('Dashboard/Users','Dashboard\Users');
Route::resource('Dashboard/AdSense','Dashboard\AdSenses');
Route::resource('Dashboard/Categories','Dashboard\Categories');
Route::resource('Dashboard/Links','Dashboard\Links');
Route::resource('Dashboard/Menus','Dashboard\Menus');
Route::resource('Dashboard/Media','Dashboard\Media');
Route::resource('Dashboard/Tages','Dashboard\Tages');
Route::resource('Dashboard/Clients','Dashboard\Clients');
Route::resource('Dashboard/Galleries','Dashboard\Galleries');
Route::resource('Dashboard/Instagrams','Dashboard\Instagrams');
Route::resource('Dashboard/Messages','Dashboard\Messages');
Route::resource('Dashboard/Posts','Dashboard\Posts');
Route::resource('Dashboard/Settings','Dashboard\Settings');
});
});


