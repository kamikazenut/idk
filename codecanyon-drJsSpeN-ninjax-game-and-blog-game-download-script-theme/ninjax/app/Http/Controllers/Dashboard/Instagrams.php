<?php

namespace App\Http\Controllers\Dashboard;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInstagram;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\User; 
use App\Instagram;
use App\ImageUpload;
use Auth;
use File;
use Validator; 

class Instagrams extends Controller
{

    /**
     * Show the middleware dashboard Super-Admin.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function __construct()
    {
        $this->middleware(['auth','role_or_permission:Super-Admin|edit articles']);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // GET Instagrams
        $Instagrams = Instagram::simplePaginate(5);
        return view('Dashboard.Instagrams.index',compact('Instagrams'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // GET Instagram create
        return view('Dashboard.Instagrams.create');
    }

        /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // GET validate
        $request->validate([
        'Title_ar' => 'required',
        'Title_en' => 'required',
        'Title_fr' => 'required',
        'body_ar' => 'required',
        'body_en' => 'required',
        'body_fr' => 'required'
        ]);

        $ImageUpload = ImageUpload::max('id');
        Instagram::create([  
            'Title_ar' => $request->Title_ar,  
            'Title_en' => $request->Title_en, 
            'Title_fr' => $request->Title_fr,
            'body_ar' => $request->body_ar,  
            'body_en' => $request->body_en,
            'body_fr' => $request->body_fr,
            'ImageUpload_id' => $ImageUpload
        ]);

            return redirect()->route('Instagrams.index')

                        ->with('success','Instagram Store successfully.');
    }

   /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $slug
     * @return \Illuminate\Http\Response
     */
    public function edit($Title_en)
    {
        //To Get All Instagram 
        $Instagram = Instagram::where('Title_en', '=', $Title_en)->firstOrFail();
        return view('Dashboard.Instagrams.edit',compact('Instagram'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $Title_en
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $Title_en)
    {
        // GET Instagram
        $Instagram = Instagram::where('Title_en', '=', $Title_en)->firstOrFail();
        $ImageOld = ImageUpload::max('id');
        if($ImageOld != $Instagram->ImageUpload_id) {
            $InstagramImage = $Instagram->ImageUpload_id;
            $InstagramImage = ImageUpload::findOrFail($InstagramImage);
            File::delete($InstagramImage->filename);
            $InstagramImage->delete();
        }
        $request->validate([
        'Title_ar' => 'required',
        'Title_en' => 'required',
        'Title_fr' => 'required',
        'body_ar' => 'required',
        'body_en' => 'required',
        'body_fr' => 'required'
        ]);

        $Instagram->Title_ar = $request->input('Title_ar');
        $Instagram->Title_en = $request->input('Title_en');
        $Instagram->Title_fr = $request->input('Title_fr');
        $Instagram->body_ar = $request->input('body_ar');
        $Instagram->body_en = $request->input('body_en');
        $Instagram->body_fr = $request->input('body_fr');
        $Instagram->ImageUpload_id = $ImageOld;
        $Instagram->save();
        return redirect()->route('Instagrams.index')

                        ->with('success','Instagram Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Instagram Delete
        $Instagram = Instagram::findOrFail($id);
        $InstagramImage = $Instagram->ImageUpload_id;
        $InstagramImage = ImageUpload::findOrFail($InstagramImage);
        File::delete($InstagramImage->filename);
        $InstagramImage->delete();
        $Instagram->delete();
        return back()->with('Delete','Instagram deleted successfully');
    }
}
